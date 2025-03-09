import React from "react";
import { Drawer } from "antd";
import { JobPosting } from "@/apiServices/jobPostingAPI";
import { formatDate } from "@/utils/dateFormatter";

interface JobPostingInformationDrawerProps {
  selectedJob: JobPosting;
  handleCloseDrawer: () => void;
  isDrawerOpen: boolean;
  isLoading: boolean;
}

const JobPostingInformationDrawer: React.FC<
  JobPostingInformationDrawerProps
> = ({ selectedJob, handleCloseDrawer, isDrawerOpen, isLoading }) => {
  return (
    <Drawer
      title="Job Details"
      placement="right"
      onClose={handleCloseDrawer}
      open={isDrawerOpen}
      width={500}
      loading={isLoading}
    >
      <div className="p-4 space-y-4">
        <h2 className="text-xl font-bold text-gray-800">{selectedJob.title}</h2>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Job Type:</p>
            <p className="text-gray-600">{selectedJob.jobType}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Location:</p>
            <p className="text-gray-600">
              {selectedJob.locationDetails} ({selectedJob.locationType})
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Team:</p>
            <p className="text-gray-600">{selectedJob.team}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Status:</p>
            <span
              className={`px-3 py-1 text-xs font-medium rounded-md 
          ${
            selectedJob.status === "published"
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : selectedJob.status === "draft"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
              : selectedJob.status === "closed"
              ? "bg-red-100 text-red-800 hover:bg-red-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
            >
              {selectedJob.status.charAt(0).toUpperCase() +
                selectedJob.status.slice(1).toLowerCase()}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">Description:</p>
          <p className="text-gray-600">{selectedJob.description}</p>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">Required Qualification:</p>
          <p className="text-gray-600">{selectedJob.requiredQualification}</p>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">
            Preferred Qualification:
          </p>
          <p className="text-gray-600">{selectedJob.prefferedQualification}</p>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">Tech Stack:</p>
          <div className="flex flex-wrap gap-2">
            {selectedJob.techStack.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold text-gray-700">Application Deadline:</p>
            <p className="text-gray-600">
              {formatDate(selectedJob.applicationDeadLine)}
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Start Date:</p>
            <p className="text-gray-600">{formatDate(selectedJob.startDate)}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Duration:</p>
            <p className="text-gray-600">{selectedJob.duration}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">Compensation:</p>
            <p className="text-gray-600">
              ${selectedJob.compensation.min} - ${selectedJob.compensation.max}{" "}
              per {selectedJob.compensation.type}
            </p>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">Diversity Statement:</p>
          <p className="text-gray-600">{selectedJob.diversityStatement}</p>
        </div>

        <div className="border-t pt-4">
          <p className="font-semibold text-gray-700">Required Candidates:</p>
          <p className="text-gray-600">
            {selectedJob.numberOfCandidatesRequired || "Not Specified"}
          </p>
        </div>

        <div className="border-t pt-4 flex justify-between text-sm">
          <p className="text-gray-500">Contact: {selectedJob.contactEmail}</p>
          <p className="text-gray-500">
            Posted on: {new Date(selectedJob.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Drawer>
  );
};

export default JobPostingInformationDrawer;
