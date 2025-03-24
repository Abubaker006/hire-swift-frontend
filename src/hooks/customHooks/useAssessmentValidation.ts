import { useEffect, useState } from "react";
import { validateAssessment } from "@/apiServices/AssessmentAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { setValidationStatus } from "../slices/assessmentSlice";
import { hideLoader, showLoader } from "../slices/loaderSlice";
import {
  AssessmentValidatedData,
  UseAssessmentValidationResponse,
} from "@/utils/Types";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";

interface useAssessmentValidationParameters {
  assessmentToken: string | null;
}

const useAssessmentValidation = ({
  assessmentToken,
}: useAssessmentValidationParameters): UseAssessmentValidationResponse | null => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [data, setData] = useState<AssessmentValidatedData | null>(null);

  const handleAssessmentValidation = async () => {
    try {
      dispatch(showLoader());

      const response = await validateAssessment(assessmentToken);

      const { message, assessment, scheduledDateTime, status } = response;

      if (status === "assessment_taken" || status === "assessment_missed") {
        console.log("This code was also");
        router.push("/hireSwift-assessment-site/assessment-missed");
        return;
      }
      if (status === "assessment_started") {
        localStorage.setItem("canResume", "true");
      }

      setData({
        isLoading: false,
        isValid: message === "Assessment ready",
        message,
        assessmentData: assessment,
        status: status,
        token: assessmentToken,
        scheduledDateTime: scheduledDateTime,
        error: null,
      });

      dispatch(
        setValidationStatus({
          isLoading: false,
          isValid: message === "Assessment ready",
          message,
          assessmentData: assessment,
          status: status,
          token: assessmentToken,
          scheduledDateTime: scheduledDateTime,
          error: null,
        })
      );
      toast(message || "Assessment Ready");

      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("token");
      if (urlToken) {
        const scheduledTime = new Date(scheduledDateTime);
        const currentTime = new Date();

        const timeRemaining = scheduledTime.getTime() - currentTime.getTime();
        const extendedExpiryTime = new Date(
          currentTime.getTime() + timeRemaining + 6 * 60 * 1000
        ); //set 6 minutes just to avoid collision with grace time

        Cookies.set("assessmentValidationToken", urlToken, {
          expires: extendedExpiryTime || 2,
        });
        router.replace("/hireSwift-assessment-site/assessment");
      }
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error occurred while applying for the job.", error);

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        const statusCode = axiosError.response?.status;
        console.log(statusCode);
        const errorMessage =
          axiosError.response?.data?.message || "Assessment validation failed";

        if (statusCode === 401) {
          toast.error("Your assessment has expired.");
          router.push("/hireSwift-assessment-site/invalid-assessment");
        } else if (statusCode === 403) {
          toast.error("You don't have permission to access this assessment.");
          router.push("/hireSwift-assessment-site/assessment-missed");
        } else {
          toast.error(errorMessage);
        }

        dispatch(
          setValidationStatus({
            isLoading: false,
            isValid: false,
            message: "Assessment validation failed",
            assessmentData: null,
            status: "",
            token: null,
            scheduledDateTime: null,
            error: errorMessage,
          })
        );
      } else {
        setData(null);
        setIsValidating(false);
        dispatch(
          setValidationStatus({
            isLoading: false,
            isValid: false,
            message: "Assessment validation failed",
            assessmentData: null,
            status: "",
            token: null,
            scheduledDateTime: null,
            error: "Something went wrong.",
          })
        );
      }
    } finally {
      dispatch(hideLoader());
      setIsValidating(false);
    }
  };

  useEffect(() => {
    if (assessmentToken) {
      handleAssessmentValidation();
    } else if (!assessmentToken) {
      router.push("/hireSwift-assessment-site/assessment-missed");
      setData({
        isLoading: false,
        isValid: false,
        message: "No token provided",
        assessmentData: null,
        status: "no_token",
        token: null,
        scheduledDateTime: null,
        error: "Authentication required",
      });
      dispatch(
        setValidationStatus({
          isLoading: false,
          isValid: false,
          message: "No token provided",
          assessmentData: null,
          status: "no_token",
          token: null,
          scheduledDateTime: null,
          error: "Authentication required",
        })
      );
      return;
    }
  }, [assessmentToken, dispatch]);

  return { data, isValidating };
};

export default useAssessmentValidation;
