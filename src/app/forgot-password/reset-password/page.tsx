"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import LogoImage from "../../../../public/assets/Logo/hire-swift-white.svg";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Formik, FormikHelpers, Form } from "formik";
import { resetPasswordSchema } from "@/utils/schema";
import LaptopImage from "../../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import { toast } from "react-toastify";
import { resetPassword, verifyResetToken } from "@/apiServices/authAPI";
import { useRouter } from "next/navigation";
import BackButton from "@/components/miscellenious/BackButton";
import Cookies from "js-cookie";

const ResetPassword = () => {
  const router = useRouter();
  const [isValidToken, setIsValidToken] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);
  const searchParams = useSearchParams();

  const urlToken = searchParams.get("token");
  const urlEmail = searchParams.get("email");

  const [token, setToken] = useState<string | null>(
    urlToken || null
  );
  const [email, setEmail] = useState<string | null>(
    urlEmail || null
  );

  useEffect(() => {
    if (urlEmail && urlToken) {
      console.log("Setting token and email from URL params");
      setEmail(urlEmail);
      setToken(urlToken);
      Cookies.set("resetEmail", urlEmail, { expires: 1 / 24 });
      Cookies.set("resetToken", urlToken, { expires: 1 / 24 });
    } else {
      console.log("Using stored token and email:", {
        cookieToken: Cookies.get("resetToken"),
        cookieEmail: Cookies.get("resetEmail"),
      });
    }

    if (urlToken && urlEmail) {
      setTimeout(() => {
        router.replace("/forgot-password/reset-password", { scroll: false });
      }, 500);
    }
  }, [urlEmail, urlToken]);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!email || !token) {
          console.log("Missing email or token for verification");
          setIsLoading(false);
          setIsValidToken(false);
          return;
        }

        console.log("Verifying token for email:", email);
        const result = await verifyResetToken(email, token);

        if (result) {
          console.log("Token verified successfully");
          setIsValidToken(true);
        } else {
          console.log("Token verification returned false");
          setIsValidToken(false);
        }
      } catch (error) {
        console.error("Token verification error:", error);
        setIsValidToken(false);
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (email && token) {
      verifyToken();
    } else {
      setIsLoading(false);
      setIsValidToken(false);
    }
  }, [email, token]);

  const onSubmit = async (
    values: { password: string; confirmPassword: string },
    actions: FormikHelpers<{ password: string; confirmPassword: string }>
  ) => {
    try {
      if (!email || !token) {
        toast.error("Missing email or token");
        throw new Error("Invalid credentials");
      }

      const response = await resetPassword(email, token, values.password);

      actions.resetForm();

      if (!response) {
        toast.error("An error occurred. Please try again later.");
        throw new Error("Error resetting password");
      }

      toast.success(response.message || "Password reset successful");
      setResetSuccess(true);
      Cookies.remove("resetEmail");
      Cookies.remove("resetToken");

      setTimeout(() => {
        router.replace("/login");
      }, 3000);
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
      console.error("Error in reset password:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spin
          indicator={<LoadingOutlined style={{ color: "white" }} spin />}
          size="large"
        />
        <span className="text-white ml-3">Verifying your reset link...</span>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
        <Image src={LogoImage} alt="HireSwift Logo" width={180} height={75} />
        <h1 className="text-3xl font-bold mt-6">Invalid Reset Link</h1>
        <p className="text-gray-400 mt-2 mb-6">
          This password reset link is invalid or has expired.
        </p>
        <Link
          href="/forgot-password"
          className="bg-white text-black font-semibold py-3 px-6 rounded-lg hover:bg-[#5E17EB] hover:text-white transition-all duration-200"
        >
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex w-full relative">
      <div className="absolute top-6 left-6 z-50">
        <BackButton route="/login" />
      </div>
      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-[#000] text-white flex flex-col items-center justify-center p-14 shadow-lg">
        <Image src={LogoImage} alt="HireSwift Logo" width={180} height={75} />
        <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
          Reset Password
        </h1>
        <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
          {resetSuccess
            ? "Your password has been reset successfully. Redirecting to login page..."
            : "Create a new password for your account"}
        </p>

        {!resetSuccess ? (
          <Formik
            initialValues={{
              password: "",
              confirmPassword: "",
            }}
            onSubmit={onSubmit}
            validationSchema={resetPasswordSchema}
          >
            {({ isSubmitting }) => (
              <Form className="w-full flex flex-col items-center my-8">
                <div className="w-1/2 py-3 my-1">
                  <div className="my-2">
                    <CustomInput
                      label="New Password"
                      name="password"
                      type="password"
                      placeholder="Enter new password"
                      isOnboarding={true}
                    />
                  </div>
                  <div className="my-2">
                    <CustomInput
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm new password"
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
                    "Reset Password"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="w-full flex flex-col items-center my-8">
            <div className="w-1/2 bg-[#1e1e1e] rounded-lg p-6 text-center">
              <p className="mb-4">Your password has been reset successfully.</p>
              <p className="text-sm text-gray-400">
                You will be redirected to the login page in a few seconds.
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Right Side */}
      <div className="w-1/2 hidden md:flex flex-col items-center justify-center p-12">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-5">
          #1 Job Hunting and Talent Recruitment Platform.
        </h1>
        <Image
          src={LaptopImage}
          alt="Dashboard Preview"
          width={450}
          height={280}
          className="-translate-x-2 transition-transform duration-300 [transform:rotateX(15deg)]"
        />
      </div>
    </div>
  );
};

export default ResetPassword;
