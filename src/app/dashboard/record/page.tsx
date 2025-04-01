"use client";
import React, { useEffect, useRef, useState } from "react";
import { getEvaluatedAssessments } from "@/apiServices/AssessmentAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";
import AssessmentCard from "@/components/AssessmentCard/AssessmentCard";
import {
  CandidateAssessmentResponse,
  AssessmentReportBase,
} from "@/utils/Types";

const Record = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const apiRef = useRef<boolean>(false);
  const [evaluatedAssessments, setEvaluatedAssessments] = useState<
    AssessmentReportBase[] | undefined
  >([]);
  const user = useSelector((state: RootState) => state.auth.user);

  const fetchEvaluatedAssessments = async () => {
    try {
      dispatch(showLoader());
      if (!token || apiRef.current) return;
      apiRef.current = true;

      const response =
        await getEvaluatedAssessments<CandidateAssessmentResponse>(token);
      console.log("Response", response);
      setEvaluatedAssessments(response.data);
    } catch (error) {
      console.error("Error occurred while fetching assessments.", error);
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      apiRef.current = false;
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchEvaluatedAssessments();
  }, []);
  
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome, {user?.firstName || "Candidate"}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {evaluatedAssessments ? (
          evaluatedAssessments.length > 0 ? (
            evaluatedAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.job.id}
                assessment={assessment.assessment}
                job={assessment.job}
                candidate={assessment.candidate}
              />
            ))
          ) : (
            <p className="text-gray-500">No assessments found.</p>
          )
        ) : (
          <p className="text-gray-500">No assessments found.</p>
        )}
      </div>
    </div>
  );
};

export default Record;
