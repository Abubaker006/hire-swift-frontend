"use client";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "@/utils/Timer";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";
import { formatScheduledTime } from "@/utils/dateFormatter";
import { toast } from "react-toastify";
import {
  startAssessment,
  startAssessmentEvaluation,
} from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import { useRouter } from "next/navigation";
import QuestionRenderer from "@/components/QuestionRenderer/QuestionRenderer";
import { Question, AssessmentQuestion } from "@/utils/Types";
import Loader from "@/utils/loader";
import axios, { AxiosError } from "axios";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import ExtractFaceData from "@/components/FaceVerification/ExtractFaceData";
import VerifyFaceData from "@/components/FaceVerification/VerifyFaceData";

const AssessmentPortal = () => {
  const router = useRouter();
  const isValidatingInProgress = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const { assessmentData, message, scheduledDateTime, status } = useSelector(
    (state: RootState) => state.assessment
  );
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const [questions, setQuestions] = useState<Question[] | AssessmentQuestion[]>(
    []
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const token =
    (useSelector((state: RootState) => state.assessment.token) ||
      Cookies.get("assessmentValidationToken")) ??
    null;
  const [canStartAssessment, setCanStartAssessment] = useState<boolean>(false);
  const [isValidatedToStart, setIsValidatedToStart] = useState<boolean>(false);
  const [assessmentTime, setAssessentTime] = useState<number | null>(0);
  const [warningCount, setWarningCount] = useState<number>(0);
  const [warningMessage, setWarningMessage] = useState<string>(
    "Warning: Suspicious activity detected."
  );
  const [warningAlertHeader, setWarningHeaderAlert] =
    useState<string>("Warning");
  const isAlertActive = useRef<boolean>(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
  const [isAssessmentAllowed, setIsAssessmentAllowed] =
    useState<boolean>(false);

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

  const handleStartAssessment = async (canStart: boolean) => {
    try {
      if (!canStart) return;
      const response = await startAssessment(token);
      const totalTime = response.totalTime ?? 0;
      Cookies.set("assessmentValidationToken", response.token ?? "", {
        expires: totalTime / 86400,
      });
      console.log(response);
      if (response.questions?.length) {
        setQuestions(response.questions);
        setAssessentTime(response.totalTime);
        setIsValidatedToStart(true);
        setCanStartAssessment(false);
      } else {
        throw new Error("No questions received from the server");
      }
    } catch (error) {
      setIsValidatedToStart(false);
      setCanStartAssessment(true);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const statusCode = axiosError.response?.status;
        console.log(statusCode);
        const errorMessage =
          axiosError.response?.data?.message || "Assessment validation failed";

        if (statusCode === 401) {
          toast.error("Your assessment has expired.");
          router.replace("/hireSwift-assessment-site/invalid-assessment");
        } else if (statusCode === 403) {
          toast.error("You don't have permission to access this assessment.");
          router.replace("/hireSwift-assessment-site/assessment-missed");
        } else {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleAssessmentValidation = async () => {
    if (!token) {
      router.replace("/hireSwift-assessment-site/assessment-missed");
      return;
    }
    try {
      const response = await validateAssessment(token);
      if (response?.canStart) {
        handleStartAssessment(response.canStart);
        console.log("Assessment can be started.", response?.canStart);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const statusCode = axiosError.response?.status;
        console.log(statusCode);
        const errorMessage =
          axiosError.response?.data?.message || "Assessment validation failed";

        if (statusCode === 401) {
          toast.error("Your assessment has expired.");
          router.replace("/hireSwift-assessment-site/invalid-assessment");
        } else if (statusCode === 403) {
          toast.error("You don't have permission to access this assessment.");
          router.replace("/hireSwift-assessment-site/assessment-missed");
        } else {
          toast.error(errorMessage);
        }
      }
    }
  };

  const handleCanStartAssessment = () => {
    try {
      console.log("Validating Assessment.");
      handleAssessmentValidation();
      setHasStartedAllowed(true);
    } catch (error) {
      console.error("Error while starting the assessment", error);
    }
  };

  const handleDisableTimer = () => {
    setCanStartAssessment(true);
  };

  const handleAssessmentValidationOnRefresh = async () => {
    if (!token) {
      router.replace("/hireSwift-assessment-site/assessment-missed");
      return;
    }
    try {
      const response = await validateAssessment(token);
      if (response?.canStart) {
        const questionsArray = Array.isArray(response.questions)
          ? response.questions
          : response.questions
          ? [response.questions]
          : [];

        setIsValidatedToStart(true);
        setCanStartAssessment(false);
        if (questionsArray.length > 0) {
          setQuestions(questionsArray);
          setAssessentTime(response.totalTime ?? 0);
        } else if (
          response.canStart &&
          response.status === "assessment_scheduled"
        ) {
          setCanStartAssessment(true);
          setIsValidatedToStart(false);
        } else if (questionsArray.length <= 0) {
          router.replace("/hireSwift-assessment-site/assessment-submitted");
        }
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

  const handleNextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (
      currentIndex === questions.length - 1 ||
      currentIndex >= questions.length - 1
    ) {
      // here we call the evaluation api
      try {
        const response = await startAssessmentEvaluation(token);
        if (response) {
          router.replace("/hireSwift-assessment-site/assessment-submitted");
        }
      } catch (error) {
        await startAssessmentEvaluation(token); //just in case the api fails we make the call again
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("An unexpected error occurred.");
        }
      }
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

  const handleAlertClose = () => {
    isAlertActive.current = false;
    setWarningMessage("Warning: Suspicious activity detected.");
    setIsAlertDialogOpen(false);
  };

  useEffect(() => {
    if (!isValidatedToStart) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarningCount((prev) => {
          if (isAlertActive.current) return prev + 0;
          const newCount = prev + 1;
          setWarningMessage(`Warning ${newCount}: Suspicious activity!`);
          setWarningHeaderAlert("Tabs Shifted.");
          return newCount;
        });
        isAlertActive.current = true;
      }
    };

    const handleBlur = () => {
      setWarningCount((prev) => {
        if (isAlertActive.current) return prev + 0;
        const newCount = prev + 1;
        setWarningMessage(`Warning ${newCount}: Suspicious activity!`);
        setWarningHeaderAlert("Window Unfocused.");
        return newCount;
      });
    };

    const checkMinimized = () => {
      if (document.hidden || window.outerHeight - window.innerHeight > 100) {
        setWarningCount((prev) => {
          if (isAlertActive.current) return prev + 0;
          const newCount = prev + 1;
          setWarningMessage(`Warning ${newCount}: Suspicious activity!`);
          setWarningHeaderAlert("Window Minimized.");
          return newCount;
        });
      }
    };

    const checkMultipleDisplays = () => {
      if (screen.width !== screen.availWidth) {
        setWarningCount((prev) => {
          if (isAlertActive.current) return prev + 0;
          const newCount = prev + 1;
          setWarningMessage(`Warning ${newCount}: Suspecious Activity.`);
          setWarningHeaderAlert("Multiple Displays Detected.");
          return newCount;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("resize", checkMinimized);
    checkMultipleDisplays();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("resize", checkMinimized);
      checkMultipleDisplays();
    };
  }, [isValidatedToStart]);

  useEffect(() => {
    if (isAlertActive.current) return;

    if (warningCount >= 3) {
      console.log("Test submission due to repeated violations.");
      //make api call that assessment is submitted but tampered.
    } else if (warningCount > 0) {
      isAlertActive.current = true;
      setIsAlertDialogOpen(true);
    }
  }, [warningCount]);

  const handleIsAssessmntAllowed = (value: boolean) => {
    setIsAssessmentAllowed(value);
    localStorage.setItem("isAllowed", "true");
  };

  const [hasStartedAllowed, setHasStartedAllowed] = useState(true);

  useEffect(() => {
    const isAllowed = localStorage.getItem("isAllowed");
    if (isAllowed === "true") {
      setHasStartedAllowed(true);
    }
  }, [hasStartedAllowed]);

  const shouldRenderVerifyFaceData = useMemo(
    () => hasStartedAllowed && isValidatedToStart && !canStartAssessment,
    [hasStartedAllowed, isValidatedToStart, canStartAssessment]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div>
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
            <div className="relative w-full min-h-screen inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-black via-black to-[#5E17EB] text-white py-6">
              <h1 className="text-xl md:text-xl font-semibold mb-4 text-center">
                Press start to begin your assessment.
              </h1>
              <p className="text-sm">
                {formatScheduledTime(targetTime.toString())}
              </p>
              {isAssessmentAllowed ? (
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
              ) : (
                <ExtractFaceData
                  handleIsAssessmentAllowed={handleIsAssessmntAllowed}
                />
              )}
            </div>
          </>
        )}
        {isValidatedToStart && !canStartAssessment && (
          <>
            <div className="flex h-[92.4vh] w-full bg-[#121212]">
              {questions.length > 0 && (
                <QuestionRenderer
                  question={questions[currentIndex]}
                  onNext={handleNextQuestion}
                  assessmentTime={assessmentTime}
                />
              )}
            </div>
          </>
        )}
        {shouldRenderVerifyFaceData && <VerifyFaceData />}
      </div>
      {isAlertDialogOpen && (
        <AlertDialog.Root
          open={isAlertDialogOpen}
          onOpenChange={setIsAlertDialogOpen}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-gray-300/60 backdrop-blur-sm transition-opacity duration-300 z-[1000]" />
            <AlertDialog.Content
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
    bg-white p-6 rounded-xl shadow-2xl max-w-md w-full 
    border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200 z-[1000]"
            >
              <AlertDialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                {warningAlertHeader}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 mb-6 text-gray-600 leading-relaxed text-sm">
                {warningMessage}
              </AlertDialog.Description>
              <div className="flex justify-end gap-3">
                <AlertDialog.Action asChild>
                  <button
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
          hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 
          transition-colors duration-200 font-medium"
                    onClick={handleAlertClose}
                  >
                    Okay
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </>
  );
};

export default AssessmentPortal;
