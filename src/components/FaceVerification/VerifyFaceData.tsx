import React, { useState, useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import nextConfig from "../../../next.config";
import { getCenterPoint } from "face-api.js/build/commonjs/utils";
import { getDescriptions } from "@/apiServices/verifyingAPI";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import Cookies from "js-cookie";

export interface VerificationResult {
  isMatch: boolean;
  message: string;
  distance?: number;
  confidence?: number;
}

const MODELS_URL = nextConfig.env?.NEXT_PUBLIC_MODEL_URL ?? "";

const VerifyFaceData = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isCameraAvaiable, setIsCameraAvailable] = useState<boolean>(false);
  const [fetchedData, setFetchedData] = useState<Float32Array | null>(null);
  const token =
    (useSelector((state: RootState) => state.assessment.token) ||
      Cookies.get("assessmentValidationToken")) ??
    null;

  const loadModels = async (): Promise<void> => {
    try {
      if (!MODELS_URL) return;

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
      ]);
      setIsModelsLoaded(true);
    } catch (error) {
      console.error("Error at loading models", error);
    }
  };

  useEffect(() => {
    loadModels();
    getFacialData();
  }, []);

  const startWebCam = async (): Promise<void> => {
    if (!videoRef.current) return;
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasWebCam = devices.some((device) => device.kind === "videoinput");

      if (!hasWebCam) {
        toast.error("Please use a device with web cam to start assessment.");
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
      });
      setIsCameraAvailable(true);

      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };

      toast.info("Webcam active. Stay focused on assessment.");
    } catch (error) {
      console.error("Failed to access web cam", error);
      toast.error(
        "Wecam active, postition your face accurately towards camera."
      );
    }
  };

  const verifyFace = async () => {
    if (!videoRef.current || !isModelsLoaded || !fetchedData) {
      console.log("data not found");
      console.log("ref", videoRef.current);
      console.log("load", isModelsLoaded);
      console.log("fetcted", fetchedData);
      return;
    }
    console.log("Running check");
    try {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setVerificationResult({
          isMatch: false,
          message: "No face detected for verification.",
        });
        return;
      }

      if (detections.length > 1) {
        setVerificationResult({
          isMatch: false,
          message:
            "Multiple faces detected. Please ensure only your face is in the frame.",
        });
        toast.info("Verification failed: Multiple faces detected.");
        return;
      }

      const detection = detections[0];

      const isLooking = checkIfLookingAtScreen(detection.landmarks);

      if (!isLooking) {
        setVerificationResult({
          isMatch: false,
          message: "Please look directly at the screen for verification.",
        });

        toast.info("Please stay focused.");
        return;
      }

      const distance = faceapi.euclideanDistance(
        fetchedData,
        detection.descriptor
      );

      const threshold = 0.6;
      const isMatch = distance < threshold;
      const confidence = Math.round((1 - distance) * 100);

      setVerificationResult({
        isMatch,
        distance,
        confidence,
        message: isMatch
          ? `Match confirmed! (${confidence}% confidence)`
          : `Different person detected. (${confidence}% similarity)`,
      });

      console.log(
        `Verification complete: ${
          isMatch ? "Match confirmed!" : "Different person detected."
        }`
      );
    } catch (error) {
      console.error("Error at verifying face", error);
    }
  };

  const checkIfLookingAtScreen = (
    landmarks: faceapi.FaceLandmarks68
  ): boolean => {
    const nose = landmarks.getNose();
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    const nosePoint = nose[3];
    const leftEyeCenter = getCenterPoint(leftEye);
    const rightEyeCenter = getCenterPoint(rightEye);

    const eyeLine = {
      x: rightEyeCenter.x - leftEyeCenter.x,
      y: rightEyeCenter.y - leftEyeCenter.y,
    };

    const eyeYDifference = Math.abs(eyeLine.y);
    const eyeXDifference = Math.abs(eyeLine.x);

    const noseXCenter = (leftEyeCenter.x + rightEyeCenter.x) / 2;
    const noseOffset = Math.abs(nosePoint.x - noseXCenter);

    const isEyesLevel = eyeYDifference < eyeXDifference * 0.3;
    const isNoseCentered = noseOffset < eyeXDifference * 0.4;

    return isEyesLevel && isNoseCentered;
  };

  useEffect(() => {
    if (isModelsLoaded) {
      startWebCam();
    }
  }, [isModelsLoaded]);

  useEffect(() => {
    if (!isModelsLoaded || !isCameraAvaiable) {
      console.log("Check skipped: ", { isModelsLoaded, isCameraAvaiable });
      return;
    }

    console.log("Starting face verification checks");
    const totalDuration = 2 * 60 * 1000;
    const randomChecks = Math.floor(Math.random() * 3) + 3;
    const timeouts: NodeJS.Timeout[] = [];

    console.log("Scheduling immediate face verification");
    verifyFace();

    for (let i = 0; i < randomChecks; i++) {
      const randomTime =
        ((i + 1) / (randomChecks + 1)) * totalDuration + Math.random() * 5000;
      console.log(
        `Scheduling check #${i + 1} in ${(randomTime / 1000).toFixed(
          2
        )} seconds`
      );
      const timeout = setTimeout(() => {
        console.log(`Running spaced random check #${i + 1}`);
        verifyFaceWithRetry();
      }, randomTime);
      timeouts.push(timeout);
    }

    return () => {
      console.log("Cleaning up timeouts");
      timeouts.forEach(clearTimeout);
    };
  }, [isModelsLoaded, isCameraAvaiable]);

  const verifyFaceWithRetry = async (retries = 2, delay = 2000) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Attempt ${attempt} to verify face`);
        await verifyFace();
        return;
      } catch (error) {
        console.error(`Verify face attempt ${attempt} failed:`, error);
        if (attempt < retries) {
          console.log(`Retrying in ${delay / 1000} seconds...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    console.log("All retry attempts failed");
    toast.error("Face verification failed after retries. Please try again.");
  };

  const getFacialData = async () => {
    try {
      if (!token) return;
      const response = await getDescriptions(token);
      if (response.descriptor) {
        const descriptor = new Float32Array(response?.descriptor);
        setFetchedData(descriptor);
      }
    } catch (error) {
      console.error("Error at getting facial data", error);
    }
  };

  return (
    <>
      <video ref={videoRef} style={{ display: "none" }} />
    </>
  );
};

export default VerifyFaceData;
