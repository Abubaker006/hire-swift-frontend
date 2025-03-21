"use client";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Timer from "@/utils/Timer";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";
import { formatScheduledTime } from "@/utils/dateFormatter";
import { toast } from "react-toastify";
import { startAssessment } from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import { useRouter } from "next/navigation";
import QuestionRenderer from "@/components/QuestionRenderer/QuestionRenderer";
import { Question, AssessmentQuestion } from "@/utils/Types";

const AssessmentPortal = () => {
  const router = useRouter();
  const isValidatingInProgress = useRef(false);
  const dispatch = useDispatch<AppDispatch>();
  const { assessmentData, message, scheduledDateTime, status } = useSelector(
    (state: RootState) => state.assessment
  );
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
        const questionsArray = Array.isArray(response.questions)
          ? response.questions
          : response.questions
          ? [response.questions]
          : [];

        setIsValidatedToStart(true);
        setCanStartAssessment(false);
        console.log("reponse on refresh", response);
        if (questionsArray.length > 0) {
          console.log("Found questions", response.questions);
          setQuestions(questionsArray);
          setAssessentTime(response.totalTime ?? 0);
        } else if (
          response.canStart &&
          response.status === "assessment_scheduled"
        ) {
          setCanStartAssessment(true);
          setIsValidatedToStart(false);
        } else if (questionsArray.length <= 0) {
          router.push("/hireSwift-assessment-site/assessment-submitted");
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

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (
      currentIndex === questions.length - 1 ||
      currentIndex >= questions.length - 1
    ) {
      router.push("/hireSwift-assessment-site/assessment-submitted");
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

  useEffect(() => {
    console.log("questions", questions);
  }, [questions]);

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
    </>
  );
};

export default AssessmentPortal;
