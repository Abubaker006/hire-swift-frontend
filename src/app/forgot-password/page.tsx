"use client";
import React, { useState, useEffect } from "react";
import LogoImage from "../../../public/assets/Logo/hire-swift-white.svg";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Formik, FormikHelpers, Form } from "formik";
import { forgotPasswordSchema } from "@/utils/schema";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import { toast } from "react-toastify";
import BackButton from "@/components/miscellenious/BackButton";
import { forgotPassword } from "@/apiServices/authAPI";

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const onSubmit = async (
    values: { email: string },
    actions: FormikHelpers<{ email: string }>
  ) => {
    try {
      if (!values.email) {
        toast.error("Please provide a valid email");
        return;
      }
      const response = await forgotPassword(values.email);
      if (response) {
        actions.resetForm();
        toast(response.message || "Password reset link sent to your email");
        setEmailSent(true);
        setCooldownTime(30);
      }
    } catch (error) {
      console.error("Error occured at sending email.", error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (cooldownTime > 0) {
      timer = setTimeout(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [cooldownTime]);

  return (
    <div className="min-h-screen flex w-full relative">
      <div className="absolute top-6 left-6 z-50">
        <BackButton route="/login" />
      </div>
      <div className="w-full md:w-1/2 bg-[#000] text-white flex flex-col items-center justify-center p-14 shadow-lg">
        <Image src={LogoImage} alt="HireSwift Logo" width={180} height={75} />
        <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
          {emailSent
            ? "Check your email for a reset link"
            : "Enter your email and we'll send you a link to reset your password."}
        </p>

        {!emailSent ? (
          <Formik
            initialValues={{
              email: "",
            }}
            onSubmit={onSubmit}
            validationSchema={forgotPasswordSchema}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col items-center my-8">
                <div className="w-1/2 py-3 my-1">
                  <div className="my-2">
                    <CustomInput
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      isOnboarding={true}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-1/2 bg-white text-black font-semibold py-4 rounded-lg hover:bg-[#5E17EB] active:bg-[#5E17EB] hover:text-[#fff] transition-all duration-200 shadow-md text-l"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <Spin
                      indicator={
                        <LoadingOutlined style={{ color: "black" }} spin />
                      }
                      size="large"
                    />
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="w-full flex flex-col items-center my-8">
            <div className="w-1/2 bg-[#1e1e1e] rounded-lg p-6 text-center">
              <p className="mb-4">
                A password reset link has been sent to your email. Please check
                your inbox.
              </p>
              <p className="text-sm text-gray-400">
                Didn&apos;t receive the email? Check your spam folder or try
                again.
              </p>
            </div>
            <button
              onClick={() => setEmailSent(false)}
              className={`w-1/2 py-4 rounded-lg transition-all mt-4 duration-200 shadow-md text-l font-semibold ${
                cooldownTime > 0
                  ? "bg-gray-500 text-white cursor-not-allowed"
                  : "bg-white text-black hover:bg-[#5E17EB] active:bg-[#5E17EB] hover:text-[#fff]"
              }`}
              disabled={cooldownTime > 0}
            >
              {cooldownTime > 0 ? `Try Again in ${cooldownTime}s` : "Try Again"}
            </button>
          </div>
        )}

        <Link
          href={"/login"}
          className="text-white hover:text-white text-sm mt-5 transition duration-200"
        >
          Remember your password?{" "}
          <span className="font-semibold underline text-md text-[#845ed2] hover:text-white transition-all duration-300">
            Login
          </span>
        </Link>
      </div>

      <div className="w-1/2 hidden md:flex flex-col items-center justify-center p-12">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-5">
          #1 Job Hunting and Talent Recruitment Platform.
        </h1>
        <Image
          src={LaptopImage}
          alt="Dashboard Preview"
          width={450}
          height={280}
          className=" -translate-x-2 transition-transform duration-300 [transform:rotateX(15deg)]"
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
