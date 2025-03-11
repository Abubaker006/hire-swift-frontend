"use client";

import { RootState } from "@/hooks/redux/store";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const AssessmentPortal = () => {
  const assessmentData = useSelector(
    (state: RootState) => state.assessment.assessmentData
  );
  const message = useSelector((state: RootState) => state.assessment.message);
  const assessmentSessionToken = useSelector(
    (state: RootState) => state.assessment.token
  );

  useEffect(() => {
    console.log("Assessment DATA", assessmentData);
    console.log("Message", message);
    console.log("Token", assessmentSessionToken);
  });

  return <>Hello, this is the assessment module</>;
};

export default AssessmentPortal;
