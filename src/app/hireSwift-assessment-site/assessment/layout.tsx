"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import useAssessmentValidation from "@/hooks/customHooks/useAssessmentValidation";
import Cookies from "js-cookie";

const AssessmentLayoutPage = ({ children }: { children: React.ReactNode }) => {
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token");
  const tokenFromCookie = Cookies.get("assessmentValidationToken");

  const assessmentToken: string | null =
    tokenFromUrl ?? tokenFromCookie ?? null;

  console.log("Assessment Token:", {
    tokenFromUrl,
    tokenFromCookie,
    assessmentToken,
  });

  useAssessmentValidation({ assessmentToken });

  return <>{children}</>;
};

export default AssessmentLayoutPage;
