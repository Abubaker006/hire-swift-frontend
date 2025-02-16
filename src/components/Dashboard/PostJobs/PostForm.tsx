import React from "react";
import CustomInput from "@/components/Inputs/customInput";
import { Formik } from "formik";

const PostForm = () => {
    return (
        <>
            <h1 className="text-[40px] font-bold mb-5">Make a Post here.</h1>
            <Formik
                initialValues={{
                    companyName: "",
                    companyWebsite: "",
                    email: "",
                    contact: "",
                    jobTitle: "",
                    jobType: "",
                    jobDescription: "",
                    salary: "",
                }}
                onSubmit={(values) => console.log(values)}
            >
                {({ handleChange, handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                        {/* Company Details */}
                        <CustomInput
                            label="Company Name"
                            name="companyName"
                            placeholder="Enter your company name"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Business Email Address"
                            name="email"
                            placeholder="Enter your business email"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Company Website"
                            name="companyWebsite"
                            placeholder="Enter your website"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Company Business Contact"
                            name="contact"
                            placeholder="Enter your company's contact no."
                            onChange={handleChange}
                        />

                        {/* Job Details */}
                        <CustomInput
                            label="Job Title"
                            name="jobTitle"
                            placeholder="Enter your required job title"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Job Type"
                            name="jobType"
                            placeholder="Enter job type e.g., full-time"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Job Description"
                            name="jobDescription"
                            placeholder="Enter additional job description"
                            onChange={handleChange}
                        />
                        <CustomInput
                            label="Enter Salary Range"
                            name="salary"
                            placeholder="Enter salary range e.g. $50-$150"
                            onChange={handleChange}
                        />

                        {/* Submit Button */}
                        <div className="col-span-2 flex justify-center mt-5">
                            <button
                                type="submit"
                                className="bg-black text-white py-3 px-10 text-lg rounded-md shadow-lg hover:bg-[#5E17EB] transition-all duration-200  w-1/4"
                            >
                                Go Post →
                            </button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    );
};

export default PostForm;