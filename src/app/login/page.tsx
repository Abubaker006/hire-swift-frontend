"use client";
import React from "react";
import LogoImage from "../../../public/assets/logo/hire-swift-white.svg";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Formik, FormikHelpers, Form } from "formik";
import { loginPageValidationSchema } from "@/utils/schema";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import { toast } from "react-toastify";
import { loginAPI } from "@/apiServices/authAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import BackButton from "@/components/miscellenious/BackButton";

const Login = () => {
  const router = useRouter();

  const onSubmit = async (
    values: { email: string; password: string },
    actions: FormikHelpers<{ email: string; password: string }>
  ) => {
    try {
      console.log(values);
      const data = {
        email: values.email,
        password: values.password,
      };
      const response = await loginAPI(data);

      actions.resetForm();
      if (!response) {
        toast("An Error Occured, Please try again later");
        throw new Error(
          "An Error Occured, Please try again later, while logging in"
        );
      }

      toast("Login Successfull...");
      Cookies.set("access_token", response.token, { expires: 1 });
      router.replace("/dashboard");
    } catch (error) {
      console.error("Error In Logging In:", error);
    }
  };

  return (
    <div className="min-h-screen flex w-full relative">
      <div className="absolute top-6 left-6 z-50">
        {" "}
        <BackButton route={"/"} />
      </div>

      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-[#000] text-white flex flex-col items-center justify-center p-14 shadow-lg">
        <Image src={LogoImage} alt="HireSwift Logo" width={180} height={75} />
        <h1 className="text-5xl font-bold mt-6 leading-tight text-center">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-400 text-center mt-3 max-w-xs">
          Login to continue your journey with HireSwift.
        </p>
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          onSubmit={onSubmit}
          validationSchema={loginPageValidationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="w-full flex flex-col items-center my-3">
              <div className="w-1/2 py-3 my-1">
                <div className="my-2">
                  <CustomInput
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="my-2">
                  <CustomInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
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
                  "Login"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <Link
          href={"/signup"}
          className="text-white hover:text-white text-sm mt-5 transition duration-200"
        >
          Don&apos;t have an account?{" "}
          <span className="font-semibold underline text-[#5E17EB] hover:text-white transition-all duration-300">
            Signup
          </span>
        </Link>
      </div>

      {/* Right Side */}
      <div className="w-1/2 hidden md:flex flex-col items-center justify-center bg-[#] p-12">
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

export default Login;
