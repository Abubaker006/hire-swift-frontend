"use client";
import React, { useEffect, useRef, useState } from "react";
import { getEvaluatedAssessments } from "@/apiServices/AssessmentAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { showLoader, hideLoader } from "@/hooks/slices/loaderSlice";
import { toast } from "react-toastify";
import { AdminAssessmentResponse, AdminAssessmentReport } from "@/utils/Types";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  SelectionChangedEvent,
} from "ag-grid-community";
import GenericModal from "@/components/Modal/GenericModal";
import { getAssessmentReport } from "@/apiServices/AssessmentAPI";
import { Download } from "lucide-react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);

const Statistics = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const apiRef = useRef<boolean>(false);
  const gridRef = useRef<AgGridReact>(null);
  const [selectedRow, setSelectedRow] = useState<AdminAssessmentReport | null>(
    null
  );
  const [groupedData, setGroupedData] = useState<{
    [key: string]: AdminAssessmentReport[];
  }>({});
  const [modalData, setModalData] = useState<AdminAssessmentReport | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [colDefs] = useState<ColDef[]>([
    {
      field: "rank",
      headerName: "Rank",
      width: 100,
      sortable: true,
      sort: "asc",
      sortingOrder: ["asc", "desc"],
    },
    { field: "candidate.name", headerName: "Candidate Name", sortable: false },
    {
      field: "candidate.email",
      headerName: "Candidate Email",
      sortable: false,
    },
    { field: "job.title", headerName: "Job Title", sortable: false },
    {
      field: "assessment.assessmentCode",
      headerName: "Assessment Code",
      width: 150,
      sortable: false,
    },
    {
      field: "assessment.totalScore",
      headerName: "Total Score",
      width: 120,
      sortable: false,
    },
    {
      field: "assessment.parameters.codeQuality",
      headerName: "Code Quality",
      width: 120,
      sortable: false,
    },
    {
      field: "assessment.parameters.problemSolving",
      headerName: "Problem Solving",
      width: 120,
      sortable: false,
    },
  ]);

  const fetchEvaluatedAssessments = async () => {
    try {
      dispatch(showLoader());
      if (!token || apiRef.current) return;
      apiRef.current = true;

      const response = await getEvaluatedAssessments<AdminAssessmentResponse>(
        token
      );
      if (!response.data) return;
      const grouped = response.data.reduce((acc, curr) => {
        const jobTitle = curr.job.title;
        if (!acc[jobTitle]) {
          acc[jobTitle] = [];
        }
        acc[jobTitle].push(curr);
        return acc;
      }, {} as { [key: string]: AdminAssessmentReport[] });

      setGroupedData(grouped);
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

  const handleRowSelection = (event: SelectionChangedEvent) => {
    if (!selectedRow) {
      toast("Press space-bar to deselect");
    }
    setSelectedRow(event.api.getSelectedRows()[0]);
  };

  const handleDownloadReport = async () => {
    try {
      if (!selectedRow) {
        toast.error("Please select a row to download report.");
        return;
      }
      setIsLoading(true);
      const jobId: string = selectedRow.job.id;
      const assessmentCode: string = selectedRow.assessment.assessmentCode;
      const userId: string = selectedRow.candidate.id;
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

  const handleDetails = () => {
    if (selectedRow) {
      setModalData(selectedRow);
      setIsModalOpen(true);
    } else {
      toast.error("Please select a row to view details.");
    }
  };

  useEffect(() => {
    fetchEvaluatedAssessments();
  }, []);

  return (
    <>
      <div className="relative w-full mt-4">
        <h1 className="text-xl font-semibold">Candidate Rankings</h1>
        {Object.keys(groupedData).map((jobTitle, index) => (
          <div key={jobTitle}>
            <div className="flex flex-row items-center justify-between mt-4 ">
              <h3 className="text-lg text-gray-700 font-semibold ">
                {index + 1}
                {")"} {jobTitle}
              </h3>
              <div className="mx-2 mb-2">
                <button
                  onClick={handleDetails}
                  className="w-[120px] mr-2 px-4 py-2 text-sm bg-[#5E17EB] hover:bg-purple-800 transition-all duration-300 text-white rounded"
                >
                  View Details
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="w-[120px] px-4 py-2 bg-[#000] hover:bg-gray-800 transition-all duration-300 text-white rounded"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ color: "white" }} spin />
                      }
                      size="default"
                    />
                  ) : (
                    <div className=" flex flex-row items-center justify-between">
                      <p className="mr-1 text-sm">Download</p>
                      <Download width={18} height={18} />
                    </div>
                  )}
                </button>
              </div>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: "37vh", width: "100%" }}
            >
              <AgGridReact
                ref={gridRef}
                rowData={groupedData[jobTitle]}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={5}
                suppressPaginationPanel={false}
                onSelectionChanged={handleRowSelection}
                rowSelection={"single"}
              />
            </div>
          </div>
        ))}
      </div>

      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Assessment Details - ${modalData?.job.title}`}
      >
        <div className="text-sm text-gray-700 space-y-4 max-h-[500px] overflow-y-auto p-2">
          <p>
            <strong>Candidate Name:</strong> {modalData?.candidate.name}
          </p>
          <p>
            <strong>Candidate Email:</strong> {modalData?.candidate.email}
          </p>
          <p>
            <strong>Assessment Code:</strong>{" "}
            {modalData?.assessment.assessmentCode}
          </p>
          <p>
            <strong>Total Score:</strong> {modalData?.assessment.totalScore}
          </p>
          <div>
            <h3 className="font-semibold">Assessment Breakdown:</h3>
            <ul className="list-disc ml-5">
              <li>
                <strong>Concept:</strong>{" "}
                {modalData?.assessment.parameters.concept}
              </li>
              <li>
                <strong>Clarity:</strong>{" "}
                {modalData?.assessment.parameters.clarity}
              </li>
              <li>
                <strong>Accuracy:</strong>{" "}
                {modalData?.assessment.parameters.accuracy}
              </li>
              <li>
                <strong>Knowledge:</strong>{" "}
                {modalData?.assessment.parameters.knowledge}
              </li>
              <li>
                <strong>Code Quality:</strong>{" "}
                {modalData?.assessment.parameters.codeQuality}
              </li>
              <li>
                <strong>Problem Solving:</strong>{" "}
                {modalData?.assessment.parameters.problemSolving}
              </li>
            </ul>
          </div>
          <p>
            <strong>Summary:</strong>{" "}
            {modalData?.assessment.observation.summary}
          </p>
          <p>
            <strong>Code Quality Feedback:</strong>{" "}
            {modalData?.assessment.observation.codeQualityFeedback}
          </p>
          <p>
            <strong>Problem Solving Feedback:</strong>{" "}
            {modalData?.assessment.observation.problemSolvingFeedback}
          </p>
          <div>
            <h3 className="font-semibold">Key Strengths:</h3>
            {modalData?.assessment.observation.keyStrengths.length ? (
              <ul className="list-disc ml-5">
                {modalData.assessment.observation.keyStrengths.map(
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
            <h3 className="font-semibold">Key Weaknesses:</h3>
            {modalData?.assessment.observation.keyWeaknesses.length ? (
              <ul className="list-disc ml-5">
                {modalData.assessment.observation.keyWeaknesses.map(
                  (weakness, index) => (
                    <li key={index}>{weakness}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="text-gray-500">No weaknesses identified.</p>
            )}
          </div>
          <p>
            <strong>Next Steps:</strong>{" "}
            {modalData?.assessment.observation.nextSteps}
          </p>
        </div>
      </GenericModal>
    </>
  );
};

export default Statistics;
