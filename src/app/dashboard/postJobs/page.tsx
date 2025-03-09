"use client";
import React from "react";
import { Formik } from "formik";
import CustomInput from "@/components/Inputs/customInput";
import CustomSelect from "@/components/Inputs/customSelect";
import "react-datepicker/dist/react-datepicker.css";
import { JobPostFormValidationSchema } from "@/utils/schema";
import CustomDatePicker from "@/components/Inputs/customDatePicker";
import { createJobPosting } from "@/apiServices/jobPostingAPI";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "@/hooks/slices/loaderSlice";

const PostJob = () => {
  const userToken = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const isLoading = useSelector((state: RootState) => state.loader.isLoading);
  const handleOnSubmit = async (values: any, actions: any) => {
    try {
      dispatch(showLoader());
      const transformedValues = {
        ...values,
        techStack: values.techStack.split(",").map((tech: any) => tech.trim()),
        compensation: {
          min: Number(values.compensationMin),
          max: Number(values.compensationMax),
          type: values.compensationType,
        },
      };
      await createJobPosting(transformedValues, userToken);
      toast.success("Job Post Created Successfully.");
      actions.resetForm();
    } catch (error) {
      dispatch(hideLoader());
      console.error("An Error Occured while creating job post:", error);
      toast.error("Something went wrong.");
      actions.resetForm();
    } finally {
      dispatch(hideLoader());
    }
  };
  return (
    <div className="min-h-screen  p-8">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Post a Job</h1>
      <Formik
        initialValues={{
          title: "",
          jobType: "",
          locationType: "",
          locationDetails: "",
          team: "",
          description: "",
          requiredQualification: "",
          prefferedQualification: "",
          techStack: "",
          compensationMin: "",
          compensationMax: "",
          compensationType: "",
          applicationDeadLine: null,
          startDate: null,
          duration: "",
          diversityStatement: "",
          contactEmail: "",
          numberOfCandidatesRequired: "",
        }}
        validationSchema={JobPostFormValidationSchema}
        onSubmit={handleOnSubmit}
      >
        {({ handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
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
              <option value="">Select compensation type</option>
              <option value="hourly">Hourly</option>
              <option value="salary">Salary</option>
              <option value="DOE">DOE</option>
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
            <CustomInput
              label="Required Candidates"
              name="numberOfCandidatesRequired"
              placeholder="Enter number of candidates required (i.e 1-2)"
              type="number"
              isOnboarding={false}
              onChange={handleChange}
            />
            <div className="col-span-2 flex justify-center mt-6">
              <button
                type="submit"
                className="bg-black text-white py-3 px-10 rounded-md hover:bg-[#5E17EB] transition-all duration-200 w-1/4"
                disabled={isLoading}
              >
                Post Job →
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default PostJob;
