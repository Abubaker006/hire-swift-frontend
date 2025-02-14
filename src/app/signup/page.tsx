"use client";
import React from "react";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FormikHelpers, Formik, Form } from "formik";
import { signUpPageValidationSchema } from "@/utils/schema";
import LogoImage from "../../../public/assets/logo/logo.png";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import CustomSelect from "@/components/Inputs/customSelect";

const SignUp = () => {

    const onSubmit = (
        values: {
            firstName: string;
            lastName: string;
            email: string;
            contactNumber: string;
            password: string;
            confirmPassword: string;
            role: string;
        },
        actions: FormikHelpers<{
            firstName: string;
            lastName: string;
            email: string;
            contactNumber: string;
            password: string;
            confirmPassword: string;
            role: string;
        }>
    ) => {
        console.log(values);
        actions.resetForm();
        setTimeout(() => {
            console.log("Form submitted successfully!");
        }, 3000);
    };

    return (
        <div className="min-h-screen flex w-full">
            <div className="w-full md:w-1/2 bg-[#1E1E1E] text-white flex flex-col items-center justify-center py-6 px-10 shadow-lg">
                <Image src={LogoImage} alt="HireSwift Logo" width={170} height={75} />
                <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
                    Create an Account!
                </h1>
                <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
                    Sign up to start your journey with HireSwift.
                </p>

                <Formik
                    initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        contactNumber: "",
                        password: "",
                        confirmPassword: "",
                        role: "",
                    }}
                    onSubmit={onSubmit}
                    validationSchema={signUpPageValidationSchema}
                >
                    {({ isSubmitting }) => (
                        <Form className="w-full">
                            {/* Grid Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-3">
                                <CustomInput
                                    label="First Name"
                                    name="firstName"
                                    type="text"
                                    placeholder="Enter your first name"
                                />
                                <CustomInput
                                    label="Last Name"
                                    name="lastName"
                                    type="text"
                                    placeholder="Enter your last name"
                                />
                                <CustomInput
                                    label="Email"
                                    name="email"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                                <CustomInput
                                    label="Contact Number"
                                    name="contactNumber"
                                    type="text"
                                    placeholder="Enter your Contact number"
                                />
                                <CustomInput
                                    label="Password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                />
                                <CustomInput
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirm your password"
                                />
                                <CustomSelect
                                    label="Role"
                                    name="role"
                                >
                                    <option value="">Select your role</option>
                                    <option value="Recruiter">Recruiter</option>
                                    <option value="Candidate">Candidate {"(User)"}</option>
                                </CustomSelect>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 shadow-lg text-lg mt-4"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Spin
                                        indicator={<LoadingOutlined style={{ color: "black" }} />}
                                        size="large"
                                    />
                                ) : (
                                    "Sign up"
                                )}
                            </button>
                        </Form>
                    )}
                </Formik>


                <Link
                    href={"/login"}
                    className="text-gray-300 hover:text-white text-sm mt-5 transition duration-200"
                >
                    Already have an account?{" "}
                    <span className="font-semibold underline">Login</span>
                </Link>
            </div>

            <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-[#DBEAFE] p-12">
                <h1 className="text-5xl font-bold text-gray-800 text-center mb-5">
                    #1 Job Hunting and Talent Recruitment Platform.
                </h1>
                <Image
                    src={LaptopImage}
                    alt="Dashboard Preview"
                    width={450}
                    height={280}
                    className="grayscale -translate-x-2 transition-transform duration-300"
                />
            </div>
        </div>
    );
};

export default SignUp;
