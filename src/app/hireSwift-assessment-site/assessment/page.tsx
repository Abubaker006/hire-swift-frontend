"use client";

import { RootState } from "@/hooks/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Timer from "@/utils/Timer";

const AssessmentPortal = () => {
  const { assessmentData, message, token, scheduledDateTime, status } =
    useSelector((state: RootState) => state.assessment);

  // Get stored time from localStorage if Redux state is empty
  const getStoredTime = () => {
    const storedTime = localStorage.getItem("scheduledDateTime");
    return storedTime ? new Date(storedTime) : null;
  };

  const [targetTime, setTargetTime] = useState<Date | null>(
    scheduledDateTime ? new Date(scheduledDateTime) : getStoredTime()
  );

  useEffect(() => {
    if (scheduledDateTime) {
      const date = new Date(scheduledDateTime);
      setTargetTime(date);
      localStorage.setItem("scheduledDateTime", date.toISOString()); // Persist time
    }

    console.log("Assessment DATA", assessmentData);
    console.log("Message", message);
    console.log("Token", token);
    console.log("Time remaining", scheduledDateTime);
    console.log("Time status", status);
  }, [assessmentData, message, token, scheduledDateTime, status]);

  return (
    <>
      {targetTime && targetTime > new Date() ? (
        <Timer targetTime={targetTime.toString()} />
      ) : (
        <div>Hello, this is the assessment module</div>
      )}
    </>
  );
};

export default AssessmentPortal;
