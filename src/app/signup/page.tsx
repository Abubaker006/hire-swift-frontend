"use client";
import React from "react";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FormikHelpers, Formik, Form } from "formik";
import { signUpPageValidationSchema } from "@/utils/schema";
import LogoImage from "../../../public/assets/logo/hire-swift-white.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import CustomSelect from "@/components/Inputs/customSelect";
import { toast } from "react-toastify";
import { signupAPI } from "@/apiServices/authAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import BackButton from "@/components/miscellenious/BackButton";

const SignUp = () => {
  const router = useRouter();

  const onSubmit = async (
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
    try {
      if (values.role === "recruiter") {
        console.log("Recruiter Login");
        //here we will call a custom hook to verify if the user is valid recruiter or not from a valid company.
        //future functionality.
      }

      const data = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        contactNumber: values.contactNumber,
        role: values.role,
      };
      const response = await signupAPI(data);

      actions.resetForm();
      Cookies.set("access_token", response.token, { expires: 1 });
      router.replace("/dashboard");
    } catch (error) {
      toast.error("An Error Occurred, Please try again.");
      console.error("An error occured", error);
    }
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-black relative">
      <BackButton route="/" />
      <div className="w-1/2 bg-[#000] text-white flex flex-col items-center justify-center py-6 px-10 shadow-lg">
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
                <CustomSelect label="Role" name="role">
                  <option value="">Select your role</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate {"(User)"}</option>
                </CustomSelect>
              </div>

              <div className="flex flex-1 justify-center">
                <button
                  type="submit"
                  className="w-1/2 bg-white text-black font-semibold py-4 rounded-lg hover:bg-[#5E17EB] active:bg-[#5E17EB] hover:text-[#fff] transition-all duration-200 shadow-lg text-lg mt-4"
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
              </div>
            </Form>
          )}
        </Formik>

        <Link
          href={"/login"}
          className="text-white hover:text-white text-sm mt-5 transition duration-200"
        >
          Already have an account?{" "}
          <span className="font-semibold underline text-[#5E17EB] hover:text-white transition-all duration-300">
            Login
          </span>
        </Link>
      </div>
    </div>
  );
};

export default SignUp;
