import { useEffect, useState } from "react";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setValidationStatus } from "../slices/assessmentSlice";
import { hideLoader, showLoader } from "../slices/loaderSlice";

interface useAssessmentValidationParameters {
  assessmentToken: string | null;
}

interface AssessmentData {
  scheduled: boolean;
  taken: boolean;
  passed: boolean;
  overallScore: number | null;
}

interface AssessmentValidatedData {
  isLoading: boolean;
  isValid: boolean;
  message: string;
  assessmentData: AssessmentData | null;
  status: string;
  scheduledDateTime: string | null;
  token?: string;
  error: string | null;
}

const useAssessmentValidation = ({
  assessmentToken,
}: useAssessmentValidationParameters): AssessmentValidatedData | null => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [data, setData] = useState<AssessmentValidatedData | null>(null);

  const handleAssessmentValidation = async () => {
    try {
      dispatch(showLoader());

      const response = await validateAssessment(assessmentToken);
      const { message, assessment, token, scheduledDateTime, status } =
        response;

      setData({
        isLoading: false,
        isValid: message === "Assessment ready",
        message,
        assessmentData: assessment,
        status: status,
        scheduledDateTime: scheduledDateTime,
        token,
        error: null,
      });

      dispatch(
        setValidationStatus({
          isLoading: false,
          isValid: message === "Assessment ready",
          message,
          assessmentData: assessment,
          status: status,
          scheduledDateTime: scheduledDateTime,
          token,
          error: null,
        })
      );

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        const scheduledTime = new Date(scheduledDateTime);
        const currentTime = new Date();

        const timeRemaining = scheduledTime.getTime() - currentTime.getTime();
        const extendedExpiryTime = new Date(
          currentTime.getTime() + timeRemaining + 5 * 60 * 1000
        );

        Cookies.set("assessmentValidationToken", urlToken, {
          expires: extendedExpiryTime || 2,
        });
        router.replace("/hireSwift-assessment-site/assessment");
      }
    } catch (error) {
      dispatch(hideLoader());
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      setData(null);
      dispatch(
        setValidationStatus({
          isLoading: false,
          isValid: false,
          message: "Assessment validation failed",
          assessmentData: null,
          status: null,
          scheduledDateTime: null,
          token: undefined,
          error: errorMessage,
        })
      );
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    if (assessmentToken) {
      handleAssessmentValidation();
    }
  }, [assessmentToken, dispatch]);

  return data;
};

export default useAssessmentValidation;
