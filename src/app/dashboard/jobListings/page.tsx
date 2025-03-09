"use client"
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/hooks/redux/store";
import { showLoader, hideLoader } from "@/hooks/slices/loaderSlice";
import JobCard from "@/components/Jobs/JobCard";
import {
  getAllCandidateJobPostings,
  CandidateJobData,
} from "@/apiServices/jobPostingAPI";
import { toast } from "react-toastify";

const JobListings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const userToken = useSelector((state: RootState) => state.auth.token);
  const [jobsData, setJobsData] = useState<CandidateJobData[]>([]);

  const fetchJobPostings = async () => {
    try {
      dispatch(showLoader());
      const response = await getAllCandidateJobPostings(userToken);
      setJobsData(response.data);
    } catch (error) {
      dispatch(hideLoader());
      console.error("Error occurred while fetching job postings", error);
      toast.error("Error occurred while fetching job postings.");
    } finally {
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchJobPostings();
  }, []);

  const handleRefreshData = () => {
    fetchJobPostings();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome, {user?.firstName || "Candidate"}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobsData.map((job) => (
            <JobCard
              key={job._id}
              jobsData={job}
              handleRefreshData={handleRefreshData}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default JobListings;
