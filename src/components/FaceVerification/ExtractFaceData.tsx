import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import nextConfig from "../../../next.config";
import { getCenterPoint } from "face-api.js/build/commonjs/utils";
import { postFaceDescription } from "@/apiServices/verifyingAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const MODELS_URL = nextConfig.env?.NEXT_PUBLIC_MODEL_URL ?? "";

export interface FaceData {
  descriptor: Float32Array;
  detection: faceapi.WithFaceDescriptor<{
    detection: faceapi.FaceDetection;
    landmarks: faceapi.FaceLandmarks68;
  }>;
}

export interface VerificationResult {
  isMatch: boolean;
  message: string;
  distance?: number;
  confidence?: number;
}

interface ExtractFaceDataProps {
  handleIsAssessmentAllowed: (data: boolean) => void;
}

const ExtractFaceData: React.FC<ExtractFaceDataProps> = ({
  handleIsAssessmentAllowed,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isModelsLoaded, setIsModelsLoaded] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [multipleFacesDetected, setMultipleFacesDetected] =
    useState<boolean>(false);
  const [isLookingAtScreen, setIsLookingAtScreen] = useState<boolean>(true);
  const [isWebCamAccessed, setIsWebCamAccessed] = useState<boolean>(false);
  const [shouldTakeDescription, setShouldTakeDescription] =
    useState<boolean>(true);
  const token = useSelector((state: RootState) => state.assessment.token);

  const loadModels = async (): Promise<void> => {
    try {
      console.log("Model loading from ", MODELS_URL);
      if (!MODELS_URL) return;

      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODELS_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODELS_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODELS_URL),
      ]);
      setIsModelsLoaded(true);
      setStatusMessage("We are ready, Capturing your face.");
    } catch (error) {
      console.error("Error at loading models", error);
      setStatusMessage("Please reload the window, a problem occured.");
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  const startWebCam = async (): Promise<void> => {
    if (!videoRef.current) return;
    try {
      setIsWebCamAccessed(false);
      setStatusMessage("Verifying webcam availability...");
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasWebCam = devices.some((device) => device.kind === "videoinput");

      if (!hasWebCam) {
        setStatusMessage(
          "Please use a device with web cam to start assessment."
        );
        handleIsAssessmentAllowed(false);
        return;
      }

      setStatusMessage("Requesting webcam access");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: "user",
        },
      });
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
      };
      setStatusMessage(
        'Webcam active. Position your face and click "Capture Face"'
      );
    } catch (error) {
      console.error("Failed to access web cam", error);
      setStatusMessage(
        "Wecam active, postition your face accurately towards camera."
      );
      setIsWebCamAccessed(true);
    } finally {
      setIsWebCamAccessed(true);
    }
  };

  useEffect(() => {
    if (isModelsLoaded) {
      startWebCam();
    }
  }, [isModelsLoaded]);

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

    const noseXCenter = (leftEyeCenter.x - rightEyeCenter.y) / 2;
    const noseOffset = Math.abs(nosePoint.x - noseXCenter);

    const isEyesLevel = eyeYDifference < eyeXDifference * 0.03;
    const isNoseCentered = noseOffset < eyeXDifference * 0.04;

    return isEyesLevel && isNoseCentered;
  };

  const captureFace = async () => {
    console.log("called");
    if (!videoRef.current || !isModelsLoaded) return;
    try {
      setStatusMessage("Detecting Face...");
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length === 0) {
        setStatusMessage(
          "No face detected! Please position yourself correctly"
        );
        return;
      }

      if (detections.length > 1) {
        setMultipleFacesDetected(true);
        setStatusMessage(
          "Multiple faces detected! Please ensure only your face is in the frame."
        );

        if (canvasRef.current) {
          const displaySize = {
            width: videoRef.current.width,
            height: videoRef.current.height,
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetections = faceapi.resizeResults(
            detections,
            displaySize
          );

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) {
            setStatusMessage("Canvas not initialized");
            return;
          }
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);

          ctx.font = "24px Arial";
          ctx.fillStyle = "red";
          ctx.fillText("MULTIPLE FACES DETECTED", 10, 30);
        }
        return;
      }
      const detection = detections[0];
      const isLooking = checkIfLookingAtScreen(detection.landmarks);
      setIsLookingAtScreen(isLooking);

      if (!isLooking) {
        setStatusMessage(
          "Please look directly at the screen before capturting your face"
        );
        if (canvasRef.current) {
          const displaySize = {
            width: videoRef.current.width,
            height: videoRef.current.height,
          };
          faceapi.matchDimensions(canvasRef.current, displaySize);
          const resizedDetection = faceapi.resizeResults(
            detection,
            displaySize
          );

          const ctx = canvasRef.current.getContext("2d");
          if (!ctx) {
            setStatusMessage("Canvas not initialized");
            return;
          }
          ctx.clearRect(
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
          );

          faceapi.draw.drawDetections(canvasRef.current, [resizedDetection]);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, [resizedDetection]);

          ctx.font = "24px Arial";
          ctx.fillStyle = "orange";
          ctx.fillText("PLEASE LOOK AT SCREEN", 10, 30);
        }
      }
      console.log("Data detected");
      const data: FaceData = {
        descriptor: detection.descriptor,
        detection: detection,
      };

      if (canvasRef.current) {
        const displaySize = {
          width: videoRef.current.width,
          height: videoRef.current.height,
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        const resizedDetection = faceapi.resizeResults(detection, displaySize);
        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) {
          setStatusMessage("Canvas not initialized");
          return;
        }
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        faceapi.draw.drawDetections(canvasRef.current, [resizedDetection]);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, [resizedDetection]);

        ctx.font = "24px Arial";
        ctx.fillStyle = "green";
        ctx.fillText("FACE CAPTURED ✓", 10, 30);
      }
      setStatusMessage("Face captured successfully!");
      handleInitialFaceValue(data);
    } catch (error) {
      console.error("Error at capturing face", error);
      setStatusMessage("Could'nt capture you face, please try again.");
    }
  };

  const handleInitialFaceValue = async (data: FaceData | null) => {
    try {
      if (data?.descriptor && token) {
        const response = await postFaceDescription(token, data.descriptor);
        toast.success(response.message);
        setShouldTakeDescription(false);
        handleIsAssessmentAllowed(true);
        Cookies.set("faceScanned", "true", { expires: 1 });
      } else {
        toast.error("Face data or token missing.");
        handleIsAssessmentAllowed(false);
      }
    } catch (error) {
      console.error("Error posting initial face data", error);
      toast.error("Couldn't save face data. Please try again.");
      handleIsAssessmentAllowed(false);
      setShouldTakeDescription(true);
    }
  };

  return (
    <>
      {shouldTakeDescription ? (
        <div className="space-y-4 p-6  max-w-4xl mx-auto my-4">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-indigo-600">
              Verify Your Face
            </h1>
            <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>

            {multipleFacesDetected && (
              <div className="mt-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                <p>
                  ⚠️ Multiple faces detected! Ensure only your face is visible
                  in the camera for proper verification.
                </p>
              </div>
            )}

            {!isLookingAtScreen && (
              <div className="mt-4 bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm border border-yellow-200">
                <p>
                  (Note:) 👀 Please look directly at the screen for accurate
                  face verification.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative w-full max-w-xl">
                {(!isModelsLoaded ||
                  !canvasRef.current ||
                  !videoRef.current ||
                  !isWebCamAccessed) && (
                  <div className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm flex items-center justify-center rounded-xl">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <video
                  ref={videoRef}
                  width="640"
                  height="480"
                  autoPlay
                  muted
                  className={`rounded-xl border border-gray-200 shadow transition duration-300 ${
                    !isModelsLoaded ? "blur-sm brightness-90" : ""
                  }`}
                />

                <canvas
                  ref={canvasRef}
                  width="640"
                  height="480"
                  className="absolute top-0 left-0 rounded-xl pointer-events-none"
                />
              </div>
            </div>

            <button
              onClick={captureFace}
              disabled={!isModelsLoaded}
              className={`px-[50px] py-2 rounded-lg bg-gradient-to-r  text-white font-semibold shadow-lg 
        transition-all duration-300 transform active:scale-95 
         ${
           isModelsLoaded
             ? "from-purple-600 to-[#5E17EB] hover:from-[#7c3ef7] hover:to-[#4c1d95] hover:shadow-purple-500/50"
             : "bg-gray-400 cursor-not-allowed"
         }`}
            >
              Capture Face
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium text-white mb-2">
              Instructions:
            </h3>
            <ol className="list-decimal list-inside text-sm text-white space-y-1">
              <li>Wait for models to load and webcam to activate</li>
              <li>
                Position your face in the frame and click &quot;Capture
                Face&quot;
              </li>
              <li>
                For verification test, either stay in frame (should match) or
                have someone else step in (should not match)
              </li>
              <li>
                Click &quot;Verify Current Face&quot; to check if the current
                face matches the initial one
              </li>
            </ol>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default ExtractFaceData;
