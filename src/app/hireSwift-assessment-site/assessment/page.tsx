"use client";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "@/utils/Timer";
import CodeEditor from "@/components/CodeEidtor/CodeEditor";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";
import { formatScheduledTime } from "@/utils/dateFormatter";
import { toast } from "react-toastify";
import { startAssessment } from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import { useRouter } from "next/navigation";

const AssessmentPortal = () => {
  const router = useRouter();
  const isValidatingInProgress = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const { assessmentData, message, scheduledDateTime, status } = useSelector(
    (state: RootState) => state.assessment
  );
  const token =
    (useSelector((state: RootState) => state.assessment.token) ||
      Cookies.get("assessmentValidationToken")) ??
    null;

  const [transcript, setTranscript] = useState<string>("");
  const [canStartAssessment, setCanStartAssessment] = useState<boolean>(false);
  const [isValidatedToStart, setIsValidatedToStart] = useState<boolean>(false);

  const getStoredTime = () => {
    const storedTime = localStorage.getItem("scheduledDateTime");
    return storedTime ? new Date(storedTime) : null;
  };

  const [targetTime, setTargetTime] = useState<Date | string>(
    scheduledDateTime ? new Date(scheduledDateTime) : ""
  );

  useEffect(() => {
    dispatch(showLoader());
    if (!scheduledDateTime) {
      const storedTime = getStoredTime();
      if (storedTime) {
        setTargetTime(storedTime);
        dispatch(hideLoader());
      }
    } else {
      const date = new Date(scheduledDateTime);
      setTargetTime(date);
      localStorage.setItem("scheduledDateTime", date.toISOString());
      dispatch(hideLoader());
    }
  }, [assessmentData, message, token, scheduledDateTime, status]);

  const handleTranscriptChange = (newTranscript: string) => {
    setTranscript(newTranscript);
    console.log(newTranscript);
  };

  const handleStartAssessment = async (canStart: boolean) => {
    try {
      if (!canStart) return;
      const response = await startAssessment(token);
      const totalTime = response.totalTime ?? 0;
      Cookies.set("assessmentValidationToken", response.token ?? "", {
        expires: totalTime / 86400,
      });
      setIsValidatedToStart(true);
      setCanStartAssessment(false);
    } catch (error) {
      setIsValidatedToStart(false);
      setCanStartAssessment(true);
      console.error("Error occured while applying for the job.", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleAssessmentValidation = async () => {
    if (!token) {
      router.push("/hireSwift-assessment-site/assessment-missed");
      return;
    }
    try {
      console.log("Token", token);
      const response = await validateAssessment(token);
      if (response?.canStart) {
        handleStartAssessment(response.canStart);
        console.log("Assessment can be started.", response?.canStart);
      }
    } catch (error) {
      console.error("Error occurred while validating assessment:", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleCanStartAssessment = () => {
    try {
      console.log("Validating Assessment.");
      handleAssessmentValidation();
    } catch (error) {
      console.error("Error while starting the assessment", error);
    }
  };

  const handleDisableTimer = () => {
    setCanStartAssessment(true);
  };

  const handleAssessmentValidationOnRefresh = async () => {
    if (!token) {
      router.push("/hireSwift-assessment-site/assessment-missed");
      return;
    }
    try {
      console.log("Token", token);
      const response = await validateAssessment(token);
      if (response?.canStart) {
        setIsValidatedToStart(true);
        setCanStartAssessment(false);
      }
    } catch (error) {
      isValidatingInProgress.current = false;
      console.error("Error occurred while validating assessment:", error);
      dispatch(hideLoader());
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      dispatch(hideLoader());
      isValidatingInProgress.current = false;
    }
  };
  useEffect(() => {
    const canResume: string | null = localStorage.getItem("canResume");
    if (canResume === "true") {
      dispatch(showLoader());
      if (isValidatingInProgress.current) return;
      isValidatingInProgress.current = true;
      handleAssessmentValidationOnRefresh();
    } else {
      localStorage.setItem("canResume", "false");
    }
  }, []);

  return (
    <>
      {!canStartAssessment &&
        !isValidatedToStart &&
        targetTime &&
        new Date(targetTime) > new Date() && (
          <>
            <Timer
              targetTime={targetTime.toString()}
              handleDisableTimer={handleDisableTimer}
            />
          </>
        )}

      {canStartAssessment && !isValidatedToStart && (
        <>
          <div className="relative w-full min-h-screen inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-black to-[#5E17EB] text-white">
            <h1 className="text-xl md:text-xl font-semibold mb-4 text-center">
              Press start to begin your assessment.
            </h1>
            <p className="text-sm">
              {formatScheduledTime(targetTime.toString())}
            </p>
            <div className="mt-5">
              <button
                onClick={handleCanStartAssessment}
                className="px-[50px] py-2 rounded-lg bg-gradient-to-r from-purple-600 to-[#5E17EB] text-white font-semibold shadow-lg 
        transition-all duration-300 transform active:scale-95 
        hover:from-[#7c3ef7] hover:to-[#4c1d95] hover:shadow-purple-500/50"
              >
                Start
              </button>
            </div>
          </div>
        </>
      )}
      {isValidatedToStart && !canStartAssessment && (
        <>
          <div className="flex h-[92.4vh] w-full bg-[#121212]">
            <div className="w-2/3">
              <CodeEditor />
              {/* <SpeechRecognitionComponent
            onTranscriptChange={handleTranscriptChange}
          /> */}
            </div>

            <div className="w-[1px] bg-[#fff]"></div>

            <div className="w-1/3 p-6 flex flex-col bg-black">
              <h1 className="text-3xl font-bold mb-3 text-[#5E17EB]">
                Question
              </h1>
              <p className="text-white mb-4">
                You are required to implement a function that reverses a string
                while preserving spaces.
              </p>
              <p className="text-white mb-6">
                Example: Input: &quot;hello world&quot; → Output: &quot;dlrow
                olleh&quot;
              </p>
              <p className="mt-auto font-semibold text-white">
                Time remaining{" "}
              </p>
              <h1
                className="text-3xl font-bold mb-3 text-[#5E17EB]"
                style={{
                  WebkitTextStroke: "0.5px white",
                }}
              >
                00:05
              </h1>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AssessmentPortal;
