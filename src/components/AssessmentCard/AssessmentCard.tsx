import React, { useState } from "react";
import GenericModal from "../Modal/GenericModal";
import { AssessmentReportBase } from "@/utils/Types";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { getAssessmentReport } from "@/apiServices/AssessmentAPI";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Download } from "lucide-react";

const AssessmentCard: React.FC<AssessmentReportBase> = ({
  assessment: assessmentData,
  job,
  candidate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOnClick = () => setIsModalOpen(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const token = useSelector((state: RootState) => state.auth.token);

  const handleDownloadReport = async (
    jobId: string,
    assessmentCode: string,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      const response = await getAssessmentReport(
        token,
        userId,
        jobId,
        assessmentCode
      );
      if (response.success) {
        toast.success(response.message);
      }
    } catch (error) {
      setIsLoading(false);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!assessmentData) {
    return <h2>No assessment data available.</h2>;
  }
  return (
    <>
      <div className="relative bg-white border border-gray-300 shadow-md rounded-2xl p-6 hover:shadow-xl transition-transform transform hover:-translate-y-1 duration-200">
        <h2 className="text-gray-900 font-bold text-xl">{job.title}</h2>
        <div className="flex flex-row items-center">
          <p className="text-gray-500 text-sm font-semibold">
            Assessment Code:
          </p>
          <p className="font-semiBold ml-1">{assessmentData.assessmentCode}</p>
        </div>
        <div className="flex flex-row items-center">
          <p className="text-gray-700 text-lg font-semibold">Total Score:</p>
          <p className="font-semiBold ml-1">
            {assessmentData.totalScore} / 100
          </p>
        </div>

        <div className="w-[300px] mt-1 flex justify-around">
          <button
            className="mt-4 w-[140px] bg-[#5E17EB] text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-all duration-300 text-sm"
            onClick={handleOnClick}
          >
            View Details
          </button>
          <button
            className="w-[140px] mt-4 bg-[#000] text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-all duration-300 text-sm"
            onClick={() => {
              console.log("Canidate Id", candidate);
              handleDownloadReport(
                job.id,
                assessmentData.assessmentCode,
                candidate.id
              );
            }}
            disabled={isLoading}
          >
            {" "}
            {isLoading ? (
              <Spin
                indicator={<LoadingOutlined style={{ color: "white" }} spin />}
                size="default"
              />
            ) : (
              <div className="flex flex-row items-center justify-between">
                <p className="mr-1">Download</p>
                <Download width={18} height={18} />
              </div>
            )}
          </button>
        </div>
      </div>

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Assessment Details - ${job.title}`}
      >
        <div className="text-sm text-gray-700 space-y-4">
          <p>
            <strong>Summary:</strong> {assessmentData.observation.summary}
          </p>
          <p>
            <strong>Code Quality:</strong>{" "}
            {assessmentData.observation.codeQualityFeedback}
          </p>
          <p>
            <strong>Problem Solving:</strong>{" "}
            {assessmentData.observation.problemSolvingFeedback}
          </p>
          <div>
            <p>
              <strong>Key Strengths:</strong>
            </p>
            {assessmentData.observation.keyStrengths.length ? (
              <ul className="list-disc ml-5">
                {assessmentData.observation.keyStrengths.map(
                  (strength, index) => (
                    <li key={index}>{strength}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">No strengths identified.</p>
            )}
          </div>
          <div>
            <p>
              <strong>Key Weaknesses:</strong>
            </p>
            <ul className="list-disc ml-5">
              {assessmentData.observation.keyWeaknesses.map(
                (weakness, index) => (
                  <li key={index}>{weakness}</li>
                )
              )}
            </ul>
          </div>
          <p>
            <strong>Next Steps:</strong> {assessmentData.observation.nextSteps}
          </p>
        </div>
      </GenericModal>
    </>
  );
};

export default AssessmentCard;
