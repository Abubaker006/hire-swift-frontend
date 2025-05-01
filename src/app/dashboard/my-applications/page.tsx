"use client";
import React, { useEffect, useRef, useState } from "react";
import { getMyApplications } from "@/apiServices/jobPostingAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { showLoader, hideLoader } from "@/hooks/slices/loaderSlice";
import { ApplicationsResponse } from "@/utils/Types";
import AppliedJobsCard from "@/components/Jobs/AppliedJobCard";
import axios, { AxiosError } from "axios";

const MyApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userToken = useSelector((state: RootState) => state.auth.token);
  const user = useSelector((state: RootState) => state.auth.user);
  const [applicationsData, setApplicationsData] =
    useState<ApplicationsResponse | null>(null);
  const isFetchingRef = useRef<boolean>(false);

  const fetchAppliedJobs = async () => {
    try {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      dispatch(showLoader());
      const response = await getMyApplications(userToken);
      setApplicationsData(response);
    } catch (error) {
      isFetchingRef.current = false;
      console.error("Full error object:", error);
      console.log("Error type:", typeof error);

      if (axios.isAxiosError(error)) {
        console.log("This is an Axios error.");
        const axiosError = error as AxiosError<{ message?: string }>;
        console.log("Axios Error Response:", axiosError.response);

        if (axiosError.response) {
          const statusCode = axiosError.response.status;
          console.log("Status Code:", statusCode);

          const errorMessage =
            axiosError.response.data?.message || "Assessment Fetching failed";
          toast.error(errorMessage);
        } else {
          toast.error("Server did not respond with an error message.");
        }
      } else {
        console.log("This is NOT an Axios error.");
        toast.error("Unexpected error occurred while fetching job postings.");
      }
    } finally {
      isFetchingRef.current = false;
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchAppliedJobs();
  }, []);

  const handleRefreshData = () => {
    fetchAppliedJobs();
  };

  return (
    <>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {user?.firstName || "Candidate"}, your active job applications
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applicationsData?.applications?.length ? (
            applicationsData?.applications.map((application) => (
              <AppliedJobsCard
                key={application._id}
                jobsData={application.jobId}
                handleRefreshData={handleRefreshData}
                applications={applicationsData}
              />
            ))
          ) : (
            <p>No applied jobs found.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default MyApplications;
