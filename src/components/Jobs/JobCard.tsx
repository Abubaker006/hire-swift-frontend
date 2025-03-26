"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import GenericModal from "../Modal/GenericModal";
import { CandidateJobData } from "@/utils/Types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { applyForJobPosting } from "@/apiServices/jobPostingAPI";
import { showLoader } from "@/hooks/slices/loaderSlice";
import { toast } from "react-toastify";

interface JobCardProps {
  jobsData: CandidateJobData | null;
  handleRefreshData: () => void;
}

const JobCard: React.FC<JobCardProps> = ({ jobsData, handleRefreshData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const userToken = useSelector((state: RootState) => state.auth.token);

  const handleOnClick = () => setIsModalOpen(true);

  const handleJobApply = async (id: string) => {
    if (!userToken && !id) return;
    try {
      dispatch(showLoader());
      const response = await applyForJobPosting(id, userToken);
      toast.success(response.message || "Applied Successfully.");
      handleRefreshData();
    } catch (error) {
      console.error("Error occured while applying for the job.", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
      handleRefreshData();
    }
  };

  return (
    <>
      {jobsData ? (
        <>
          <div className="relative overflow-hidden bg-white/90 backdrop-blur-md border border-gray-300 shadow-md hover:shadow-xl rounded-2xl p-6 transition-transform transform hover:-translate-y-1 duration-200 h-[270px]">
            <div className="absolute top-3 left-3 bg-gray-200  font-semibold px-3 py-2 rounded-md shadow-sm text-xs">
              {new Date(jobsData.createdAt).toLocaleDateString()}
            </div>

            <div className="absolute top-3 right-3 cursor-pointer group">
              <FontAwesomeIcon
                icon={faBookmark}
                className="w-5 h-5 text-gray-500 group-hover:text-gray-800 transition"
              />
            </div>

            <div className="mt-10">
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                {jobsData.team}
              </p>
              <h2 className="text-gray-900 font-extrabold text-xl mt-1">
                {jobsData.title}
              </h2>
              <p className="text-gray-500 text-xs">
                Applications Submitted: {jobsData.numberOfSubmittedApplications}
                {" /50"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              {[jobsData.jobType, jobsData.locationType, jobsData.duration].map(
                (tag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-md shadow-sm border border-gray-200"
                  >
                    {tag}
                  </span>
                )
              )}
            </div>
            <div className="w-[300px] mt-5 absolute bottom-3 flex justify-around">
              <button
                className="w-[140px] bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-500 transition"
                onClick={handleOnClick}
              >
                View Details
              </button>
              <button
                className="w-[140px] bg-purple-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-purple-400 transition"
                onClick={() => handleJobApply(jobsData._id)}
                disabled={isLoading}
              >
                Apply
              </button>
            </div>
          </div>

          <GenericModal
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={jobsData?.title}
          >
            <div className="text-sm text-gray-700 space-y-6">
              <p className="text-gray-600 leading-relaxed">
                {jobsData?.description}
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-gray-300 pb-2">
                  <p className="text-gray-800 font-semibold">Location</p>
                  <p className="text-gray-500">
                    {jobsData?.locationDetails || "Not specified"}
                  </p>
                </div>

                <div className="border-b  border-gray-300 pb-2">
                  <p className="text-gray-800 font-semibold">Tech Stack</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {jobsData?.techStack?.length ? (
                      jobsData.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-md"
                        >
                          {tech}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-500">Not specified</p>
                    )}
                  </div>
                </div>

                {jobsData?.compensation && (
                  <div className="border-b  border-gray-300 pb-2">
                    <p className="text-gray-800 font-semibold">Compensation</p>
                    <p className="text-gray-500">
                      ${jobsData.compensation.min} - $
                      {jobsData.compensation.max}
                    </p>
                  </div>
                )}

                {jobsData?.applicationDeadLine && (
                  <div className="border-b  border-gray-300 pb-2">
                    <p className="text-gray-800 font-semibold">
                      Application Deadline
                    </p>
                    <p className="text-gray-500">
                      {new Date(
                        jobsData.applicationDeadLine
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {jobsData?.requiredQualification && (
                <div className="border-b  border-gray-300 pb-2">
                  <p className="text-gray-800 font-semibold">
                    Required Qualification
                  </p>
                  <p className="text-gray-500">
                    {jobsData.requiredQualification}
                  </p>
                </div>
              )}

              {jobsData?.prefferedQualification && (
                <div className="border-b border-gray-300 pb-2">
                  <p className="text-gray-800 font-semibold">
                    Preferred Qualification
                  </p>
                  <p className="text-gray-500">
                    {jobsData.prefferedQualification}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {jobsData?.contactEmail && (
                  <div className="border-b  border-gray-300 pb-2">
                    <p className="text-gray-800 font-semibold">Contact Email</p>
                    <p className="text-gray-500 font-mono">
                      {jobsData.contactEmail}
                    </p>
                  </div>
                )}

                {jobsData?.startDate && (
                   <div className="border-b  border-gray-300 pb-2">
                    <p className="text-gray-800 font-semibold">Start Date</p>
                    <p className="text-gray-500">
                      {new Date(jobsData.startDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </GenericModal>
        </>
      ) : (
        <>
          {" "}
          <h2>No job postings found.</h2>
        </>
      )}
    </>
  );
};

export default JobCard;
