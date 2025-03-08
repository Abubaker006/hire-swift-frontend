"use client";
import React from "react";
import { Drawer } from "antd";
import { Formik } from "formik";
import CustomInput from "@/components/Inputs/customInput";
import CustomSelect from "@/components/Inputs/customSelect";
import CustomDatePicker from "@/components/Inputs/customDatePicker";
import { updateJobPosting } from "@/apiServices/jobPostingAPI";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { JobPosting } from "@/apiServices/jobPostingAPI";
import { JobPostFormValidationSchema } from "@/utils/schema";

interface JobPostingEditDrawerProps {
  selectedJob: JobPosting;
  isEditDrawerOpen: boolean;
  isLoading: boolean;
  handleCloseDrawer: () => void;
}
const JobPostingEditDrawer: React.FC<JobPostingEditDrawerProps> = ({
  selectedJob,
  isEditDrawerOpen,
  isLoading,
  handleCloseDrawer,
}) => {
  const userToken = useSelector((state: RootState) => state.auth.token);

  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      const transformedValues = {
        ...values,
        techStack: values.techStack.split(",").map((tech: any) => tech.trim()),
        compensation: {
          min: Number(values.compensationMin),
          max: Number(values.compensationMax),
          type: values.compensationType,
        },
      };
      await updateJobPosting(selectedJob._id, transformedValues, userToken);
      toast.success("Job Post Updated Successfully.");
      handleCloseDrawer();
    } catch (error) {
      console.error("Error updating job post:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Drawer
      title="Edit Job Details"
      placement="right"
      onClose={handleCloseDrawer}
      open={isEditDrawerOpen}
      width={500}
      loading={isLoading}
    >
      <Formik
        initialValues={{
          ...selectedJob,
          techStack: selectedJob.techStack.join(", "),
        }}
        validationSchema={JobPostFormValidationSchema}
        onSubmit={handleOnSubmit}
      >
        {({ handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <CustomInput
              label="Job Title"
              name="title"
              placeholder="Enter job title"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomSelect
              label="Job Type"
              name="jobType"
              isOnboarding={false}
              onChange={handleChange}
            >
              <option value="">Select job type</option>
              <option value="internship">Internship</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="temporary">Temporary</option>
            </CustomSelect>
            <CustomSelect
              label="Location Type"
              name="locationType"
              isOnboarding={false}
              onChange={handleChange}
            >
              <option value="">Select location type</option>
              <option value="remote">Remote</option>
              <option value="onsite">Onsite</option>
              <option value="hybrid">Hybrid</option>
            </CustomSelect>
            <CustomInput
              label="Location Details"
              name="locationDetails"
              placeholder="Enter location details"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Team"
              name="team"
              placeholder="Enter team name"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Job Description"
              name="description"
              placeholder="Enter job description"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Required Qualification"
              name="requiredQualification"
              placeholder="Enter required qualifications"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Preferred Qualification"
              name="prefferedQualification"
              placeholder="Enter preferred qualifications"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Tech Stack"
              name="techStack"
              placeholder="Enter tech stack (comma separated)"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Min Compensation"
              name="compensationMin"
              type="number"
              placeholder="Enter minimum compensation"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Max Compensation"
              name="compensationMax"
              type="number"
              placeholder="Enter maximum compensation"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomSelect
              label="Compensation Type"
              name="compensationType"
              isOnboarding={false}
              onChange={handleChange}
            >
              <option value="hourly">Hourly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </CustomSelect>
            <div className="flex flex-col w-full">
              <CustomDatePicker name="startDate" label="Starting Date" />
            </div>

            <div className="flex flex-col w-full">
              <CustomDatePicker
                name="applicationDeadLine"
                label="Application Deadline"
              />
            </div>
            <CustomInput
              label="Duration"
              name="duration"
              placeholder="Enter duration (e.g., 6 months)"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Diversity Statement"
              name="diversityStatement"
              placeholder="Enter diversity statement"
              isOnboarding={false}
              onChange={handleChange}
            />
            <CustomInput
              label="Contact Email"
              name="contactEmail"
              type="email"
              placeholder="Enter contact email"
              isOnboarding={false}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="bg-black text-white py-3 px-10 rounded-md hover:bg-[#5E17EB] transition-all duration-200 w-full"
            >
              Update Job →
            </button>
          </form>
        )}
      </Formik>
    </Drawer>
  );
};

export default JobPostingEditDrawer;
