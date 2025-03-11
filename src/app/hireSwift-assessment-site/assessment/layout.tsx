"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useAssessmentValidation from "@/hooks/customHooks/useAssessmentValidation";
import Cookies from "js-cookie";

const AssessmentLayoutPage = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();

  const assessmentToken: string | null =
    searchParams.get("token") ??
    Cookies.get("assessmentValidationToken") ??
    null;

  useAssessmentValidation({ assessmentToken });

  return <>{children}</>;
};

export default AssessmentLayoutPage;
