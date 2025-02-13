"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Input, Select, Spin, Form } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useFormik, FormikHelpers } from "formik";
import { signUpPageValidationSchema } from "@/utils/schema";
import LogoImage from "../../../public/assets/logo/logo.png";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = (
    values: {
      firstName: string;
      lastName: string;
      email: string;
      contact: string;
      password: string;
      confirmPassword: string;
      role: string;
    },
    actions: FormikHelpers<{
      firstName: string;
      lastName: string;
      email: string;
      contact: string;
      password: string;
      confirmPassword: string;
      role: string;
    }>
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
      firstName: "",
      lastName: "",
      email: "",
      contact: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: signUpPageValidationSchema,
    onSubmit,
  });

  return (
    <div className="min-h-screen flex w-full">
      <div className="w-full md:w-1/2 bg-[#1E1E1E] text-white flex flex-col items-center justify-center py-10 px-10 shadow-lg">
        <Image src={LogoImage} alt="HireSwift Logo" width={170} height={75} />
        <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
          Create an Account!
        </h1>
        <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
          Sign up to start your journey with HireSwift.
        </p>

        <Form
          layout="vertical"
          onFinish={formik.handleSubmit}
          className="w-full max-w-md space-y-5 mt-8"
        >
          <div className="flex gap-2">
            <Form.Item
              validateStatus={
                formik.touched.firstName && formik.errors.firstName
                  ? "error"
                  : ""
              }
              help={
                formik.touched.firstName && formik.errors.firstName
                  ? formik.errors.firstName
                  : ""
              }
              className="w-1/2"
            >
              <Input
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>

            <Form.Item
              validateStatus={
                formik.touched.lastName && formik.errors.lastName ? "error" : ""
              }
              help={
                formik.touched.lastName && formik.errors.lastName
                  ? formik.errors.lastName
                  : ""
              }
              className="w-1/2"
            >
              <Input
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Form.Item
              validateStatus={
                formik.touched.email && formik.errors.email ? "error" : ""
              }
              help={
                formik.touched.email && formik.errors.email
                  ? formik.errors.email
                  : ""
              }
              className="w-1/2"
            >
              <Input
                name="email"
                placeholder="Email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>

            <Form.Item
              validateStatus={
                formik.touched.contact && formik.errors.contact ? "error" : ""
              }
              help={
                formik.touched.contact && formik.errors.contact
                  ? formik.errors.contact
                  : ""
              }
              className="w-1/2"
            >
              <Input
                name="contact"
                placeholder="Contact Number"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>
          </div>

          <div className="flex gap-2">
            <Form.Item
              validateStatus={
                formik.touched.password && formik.errors.password ? "error" : ""
              }
              help={
                formik.touched.password && formik.errors.password
                  ? formik.errors.password
                  : ""
              }
              className="w-1/2"
            >
              <Input.Password
                name="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>

            <Form.Item
              validateStatus={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? "error"
                  : ""
              }
              help={
                formik.touched.confirmPassword && formik.errors.confirmPassword
                  ? formik.errors.confirmPassword
                  : ""
              }
              className="w-1/2"
            >
              <Input.Password
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-3 bg-white text-black rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            validateStatus={
              formik.touched.role && formik.errors.role ? "error" : ""
            }
            help={
              formik.touched.role && formik.errors.role
                ? formik.errors.role
                : ""
            }
          >
            <Select
              placeholder="Select your role"
              value={formik.values.role || undefined}
              onChange={(value) => formik.setFieldValue("role", value)}
              onBlur={() => formik.setFieldTouched("role", true)}
              className="w-full h-12"
            >
              <Select.Option value="company">Works in a company</Select.Option>
              <Select.Option value="student">Student</Select.Option>
            </Select>
          </Form.Item>

          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-4 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-all duration-200 shadow-lg text-lg"
          >
            {isLoading ? (
              <Spin
                indicator={<LoadingOutlined style={{ color: "black" }} />}
                size="large"
              />
            ) : (
              "Sign Up"
            )}
          </button>
        </Form>

        <Link
          href={"/login"}
          className="text-gray-300 hover:text-white text-sm mt-5 transition duration-200"
        >
          Already have an account?{" "}
          <span className="font-semibold underline">Login</span>
        </Link>
      </div>

      <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-gray-100 p-12">
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
