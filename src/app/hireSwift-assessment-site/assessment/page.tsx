"use client";
import { RootState } from "@/hooks/redux/store";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Timer from "@/utils/Timer";
import CodeEditor from "@/components/CodeEidtor/CodeEditor";
import SpeechRecognitionComponent from "@/components/SpeechRecognition/SpeechRecognition";

const AssessmentPortal = () => {
  const [transcript, setTranscript] = useState<string>("");

  const { assessmentData, message, token, scheduledDateTime, status } =
    useSelector((state: RootState) => state.assessment);

  const getStoredTime = () => {
    const storedTime = localStorage.getItem("scheduledDateTime");
    return storedTime ? new Date(storedTime) : null;
  };

  const [targetTime, setTargetTime] = useState<Date | null>(
    scheduledDateTime ? new Date(scheduledDateTime) : null
  );

  useEffect(() => {
    if (!scheduledDateTime) {
      const storedTime = getStoredTime();
      if (storedTime) setTargetTime(storedTime);
    } else {
      const date = new Date(scheduledDateTime);
      setTargetTime(date);
      localStorage.setItem("scheduledDateTime", date.toISOString());
    }
  }, [assessmentData, message, token, scheduledDateTime, status]);

  const handleTranscriptChange = (newTranscript: string) => {
    console.log("Hello");
    setTranscript(newTranscript);
    console.log(newTranscript);
  };

  return (
    <>
      {/* {targetTime && targetTime > new Date() ? (
        <Timer targetTime={targetTime.toString()} />
      ) : (
        <div>Hello, this is the assessment module</div>
      )} */}
      <div className="flex h-[92.4vh] w-full bg-[#121212]">
        <div className="w-2/3">
          {/* <CodeEditor /> */}
          <SpeechRecognitionComponent
            onTranscriptChange={handleTranscriptChange}
          />
        </div>

        <div className="w-[1px] bg-[#fff]"></div>

        <div className="w-1/3 p-6 flex flex-col bg-black">
          <h1
            className="text-3xl font-bold mb-3 text-[#5E17EB]"
          >
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
            <h1
              className="text-3xl font-bold mb-3 text-[#5E17EB]"
              style={{
                WebkitTextStroke: "0.5px white",
              }}
            >
              00:05
            </h1>
          </p>
        </div>
      </div>
    </>
  );
};

export default AssessmentPortal;
