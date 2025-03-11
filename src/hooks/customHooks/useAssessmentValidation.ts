import { useEffect } from "react";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import {
  resetValidation,
  setValidationStatus,
} from "../slices/assessmentSlice";
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
  token?: string;
  error: string | null;
}

const useAssessmentValidation = ({
  assessmentToken,
}: useAssessmentValidationParameters): AssessmentValidatedData => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const validationStatus = useSelector((state: RootState) => state.assessment);

  const handleAssessmentValidation = async () => {
    try {
      dispatch(showLoader());

      const response = await validateAssessment(assessmentToken);
      const { message, assessment, token, scheduledDateTime, status } =
        response;

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
        Cookies.set("assessmentValidationToken", urlToken, {
          expires: 1,
        });
        router.replace("/hireSwift-assessment-site/assessment");
      }
    } catch (error) {
      dispatch(hideLoader());
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
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

  const handleTabClose = () => {
    Cookies.remove("assessmentValidationToken");
    dispatch(resetValidation());
  };

  useEffect(() => {
    if (assessmentToken) {
      handleAssessmentValidation();
      window.addEventListener("beforeunload", handleTabClose);
    } else {
      dispatch(
        setValidationStatus({
          isLoading: false,
          isValid: false,
          message: "No assessment token provided",
          assessmentData: null,
          status: null,
          scheduledDateTime: null,
          token: undefined,
          error: null,
        })
      );
    }

    return () => {
      window.removeEventListener("beforeunload", handleTabClose);
    };
  }, [assessmentToken, dispatch]);

  return validationStatus;
};

export default useAssessmentValidation;
