"use client";
import React, { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  getAllJobPostings,
  getJobPost,
  JobPosting,
  JobPostings,
  deleteJobPosting,
  updateJobPostingStatus,
} from "@/apiServices/jobPostingAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import Button from "@/components/Inputs/CustonButton";
import JobPostingInformationDrawer from "@/components/Drawers/JobPostingInformationDrawer";
import JobPostingEditDrawer from "@/components/Drawers/JobPostingEditDrawer";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

ModuleRegistry.registerModules([AllCommunityModule]);

interface JobData {
  _id: string;
  title: string;
  jobType: string;
  locationType: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const CreatedJobPostings = () => {
  const userToken = useSelector((state: RootState) => state.auth.token);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState<boolean>(false);

  const [colDefs] = useState<ColDef<JobData>[]>([
    { field: "title", headerName: "Title" },
    { field: "jobType", headerName: "Job Type" },
    { field: "locationType", headerName: "Location Type" },
    {
      field: "status",
      headerName: "Status",
      cellRenderer: (params: ICellRendererParams) => {
        const status = params.value;
        return (
          <button
            onClick={() => {
              setSelectedJobId(params.data._id);
              setCurrentStatus(status);
              setIsStatusDialogOpen(true);
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-xs font-medium cursor-pointer
              ${
                status === "Published"
                  ? "bg-green-100 text-green-800 hover:bg-green-200"
                  : status === "Draft"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                  : status === "Closed"
                  ? "bg-red-100 text-red-800 hover:bg-red-200"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            {status}
          </button>
        );
      },
    },
    { field: "createdAt", headerName: "Created At" },
    { field: "updatedAt", headerName: "Updated At" },
    {
      headerName: "Actions",
      field: "_id",
      cellRenderer: (params: ICellRendererParams) => (
        <div className="flex items-center justify-center gap-2 mt-1">
          <Button
            variant="primary"
            icon="view"
            className="min-w-[20px] flex justify-center"
            onClick={() => handleDetail(params.data._id)}
          />
          <Button
            variant="secondary"
            icon="edit"
            className="min-w-[20px] flex justify-center"
            onClick={() => handleEdit(params.data._id)}
          />
          <Button
            variant="danger"
            icon="delete"
            className="min-w-[20px] flex justify-center"
            onClick={() => {
              setSelectedJobId(params.data._id);
              setIsDeleteDialogOpen(true);
            }}
          />
        </div>
      ),
      sortable: false,
      filter: false,
    },
  ]);
  const [rowData, setRowData] = useState<JobPostings[]>([]);

  const fetchJobPostings = async () => {
    try {
      const response = await getAllJobPostings(
        userToken,
        "published,draft,closed"
      );
      setRowData(response);
    } catch (error) {
      console.error("Error occurred while fetching job postings", error);
      toast.error("Error occurred while fetching job postings.");
    }
  };
  useEffect(() => {
    fetchJobPostings();
  });

  const handleDetail = async (id: string) => {
    try {
      setIsLoading(true);
      setIsDrawerOpen(true);
      const response = await getJobPost(id, userToken);
      console.log(response);
      setSelectedJob(response.data);
    } catch (error) {
      toast.error("An error occured, please try again.");
      console.error("Error occured while fetching job", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleEdit = async (id: string) => {
    try {
      setIsLoading(true);
      setIsEditDrawerOpen(true);
      const response = await getJobPost(id, userToken);
      console.log(response);
      setSelectedJob(response.data);
    } catch (error) {
      toast.error("An error occured, please try again.");
      console.error("Error occured while fetching job", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedJobId) return;

    try {
      setIsLoading(true);
      await deleteJobPosting(selectedJobId, userToken);
      setRowData(rowData.filter((job) => job._id !== selectedJobId));
      toast.success("Job posting deleted successfully");
    } catch (error) {
      console.error("Error deleting job posting:", error);
      toast.error("Failed to delete job posting");
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      setSelectedJobId(null);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedJobId) return;
    try {
      setIsLoading(true);
      const response = await updateJobPostingStatus(
        selectedJobId,
        newStatus.toLowerCase(),
        userToken
      );
      setRowData((prev) =>
        prev.map((job) =>
          job._id === selectedJobId ? { ...job, status: response.status } : job
        )
      );
      toast.success(response.message);
    } catch (error) {
      console.error("Error updating job status:", error);
      toast.error("Failed to update job status");
    } finally {
      setIsLoading(false);
      setIsStatusDialogOpen(false);
      setSelectedJobId(null);
      setCurrentStatus(null);
    }
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedJob(null);
  };
  const handleIsEditCloseDrawer = () => {
    setIsEditDrawerOpen(false);
    setSelectedJob(null);
  };
  return (
    <>
      <h1 className="text-2xl font-bold text-center text-gray-800 border-b-2 pb-2 inline-block">
        Your Current Job Postings:
      </h1>

      <div className="relative w-full mt-4">
        <div
          className="ag-theme-alpine custom-grid"
          style={{ height: "80vh", width: "100%" }}
        >
          <AgGridReact
            rowData={rowData}
            columnDefs={colDefs}
            pagination={true}
            paginationPageSize={5}
            suppressPaginationPanel={false}
          />
        </div>
      </div>

      {isDrawerOpen && selectedJob && (
        <JobPostingInformationDrawer
          isDrawerOpen={isDrawerOpen}
          handleCloseDrawer={handleCloseDrawer}
          selectedJob={selectedJob}
          isLoading={isLoading}
        />
      )}
      {isEditDrawerOpen && selectedJob && (
        <JobPostingEditDrawer
          isEditDrawerOpen={isEditDrawerOpen}
          handleCloseDrawer={handleIsEditCloseDrawer}
          selectedJob={selectedJob}
          isLoading={isLoading}
        />
      )}

      {isDeleteDialogOpen && (
        <AlertDialog.Root
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-gray-300/60 backdrop-blur-sm transition-opacity duration-300" />
            <AlertDialog.Content
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
        bg-white p-6 rounded-xl shadow-2xl max-w-md w-full 
        border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200"
            >
              <AlertDialog.Title className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Confirm Deletion
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 mb-6 text-gray-600 leading-relaxed text-sm">
                Are you sure you want to delete this job posting? This action
                cannot be undone and all associated data will be permanently
                removed.
              </AlertDialog.Description>
              <div className="flex justify-end gap-3">
                <AlertDialog.Cancel asChild>
                  <button
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg 
              hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 
              transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </AlertDialog.Cancel>
                <AlertDialog.Action asChild>
                  <button
                    onClick={handleDelete}
                    className={`px-4 py-2 rounded-lg font-medium text-white 
              ${
                isLoading
                  ? "bg-red-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              } transition-colors duration-200`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </button>
                </AlertDialog.Action>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
      {isStatusDialogOpen && (
        <AlertDialog.Root
          open={isStatusDialogOpen}
          onOpenChange={setIsStatusDialogOpen}
        >
          <AlertDialog.Portal>
            <AlertDialog.Overlay className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300" />
            <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200 animate-in fade-in-0 zoom-in-95 duration-200">
              <AlertDialog.Title className="text-xl font-semibold text-gray-900">
                Change Job Status
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-3 mb-6 text-gray-600 leading-relaxed text-sm">
                Select a new status for this job posting:
              </AlertDialog.Description>
              <div className="flex justify-end gap-3 flex-wrap">
                {currentStatus !== "Published" && (
                  <button
                    onClick={() => handleStatusChange("published")}
                    className={`px-4 py-2 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Publish
                  </button>
                )}
                {currentStatus !== "Draft" && (
                  <button
                    onClick={() => handleStatusChange("draft")}
                    className={`px-4 py-2 rounded-lg font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Draft
                  </button>
                )}
                {currentStatus !== "Closed" && (
                  <button
                    onClick={() => handleStatusChange("closed")}
                    className={`px-4 py-2 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    Close
                  </button>
                )}
                <AlertDialog.Cancel asChild>
                  <button className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors duration-200 font-medium">
                    Cancel
                  </button>
                </AlertDialog.Cancel>
              </div>
            </AlertDialog.Content>
          </AlertDialog.Portal>
        </AlertDialog.Root>
      )}
    </>
  );
};

export default CreatedJobPostings;
