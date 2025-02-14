"use client";
import React, { useState } from "react";
import LogoImage from "../../../public/assets/logo/logo.png";
import Image from "next/image";
import { Form, Input, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFormik, FormikHelpers } from "formik";
import { loginPageValidationSchema } from "@/utils/schema";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";

const Login = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSubmit = (
    values: { email: string; password: string },
    actions: FormikHelpers<{ email: string; password: string }>
  ) => {
    setIsLoading(true);
    console.log(values);
    actions.resetForm();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginPageValidationSchema,
    onSubmit,
  });

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-[#1E1E1E] text-white flex flex-col items-center justify-center p-14 shadow-lg">
        <Image src={LogoImage} alt="HireSwift Logo" width={170} height={75} />
        <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
          Login to continue your journey with HireSwift.
        </p>

        <Form
          layout="vertical"
          onFinish={formik.handleSubmit}
          className="w-full max-w-md space-y-6 mt-8"
        >
          <Form.Item
            label={
              <span className="text-gray-200 font-semibold text-l">Email</span>
            }
            validateStatus={
              formik.touched.email && formik.errors.email ? "error" : ""
            }
            help={
              formik.touched.email && formik.errors.email
                ? formik.errors.email
                : ""
            }
          >
            <Input
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              placeholder="Enter your email."
              className={`w-full px-4 py-3 bg-white text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                formik.touched.email && formik.errors.email
                  ? "border border-red-500"
                  : "border-none"
              }`}
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-gray-200 font-semibold text-l">
                Password
              </span>
            }
            validateStatus={
              formik.touched.password && formik.errors.password ? "error" : ""
            }
            help={
              formik.touched.password && formik.errors.password
                ? formik.errors.password
                : ""
            }
          >
            <Input.Password
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              placeholder="Enter your password."
              className={`w-full px-4 py-3 bg-white text-black placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${
                formik.touched.email && formik.errors.email
                  ? "border border-red-500"
                  : "border-none"
              }`}
            />
          </Form.Item>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 shadow-md text-l"
          >
            {isLoading ? (
              <Spin
                indicator={<LoadingOutlined style={{ color: "black" }} />}
                size="large"
              />
            ) : (
              "Login"
            )}
          </button>
        </Form>

        <Link href={"/signup"}
          className="text-gray-300 hover:text-white text-sm mt-5 transition duration-200"
        >
          Don&apos;t have an account?{" "}<span className="font-semibold underline">Signup</span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-[#DBEAFE] p-12">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-5">
          #1 Job Hunting and Talent Recruitment Platform.
        </h1>
        <Image
          src={LaptopImage}
          alt="Dashboard Preview"
          width={450}
          height={280}
          className="grayscale -translate-x-2 transition-transform duration-300 [transform:rotateX(15deg)]"
        />
      </div>
    </div>
  );
};

export default Login;
