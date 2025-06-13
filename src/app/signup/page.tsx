"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FormikHelpers, Formik, Form, FormikProps } from "formik";
import { signUpPageValidationSchema } from "@/utils/schema";
import LogoImage from "../../../public/assets/Logo/hire-swift-white.svg";
import Link from "next/link";
import CustomInput from "@/components/Inputs/customInput";
import CustomSelect from "@/components/Inputs/customSelect";
import { toast } from "react-toastify";
import { signupAPI } from "@/apiServices/authAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import BackButton from "@/components/miscellenious/BackButton";
import RecruiterVerificationModal from "./RecruiterVerification";
import { RecruiterVerificationData, SignupData } from "@/utils/Types";

const SignUp = () => {
  const router = useRouter();
  const [openVerificationModal, setOpenVerificationModal] = useState(false);
  const [recruiterVerificationData, setRecruiterVerificationData] =
    useState<RecruiterVerificationData | null>(null);
  const formikRef = useRef<FormikProps<SignupData>>(null);

  const onSubmit = async (
    values: SignupData,
    actions: FormikHelpers<SignupData>
  ) => {
    try {
      if (values.role === "recruiter" && !recruiterVerificationData) {
        setOpenVerificationModal(true);
        return;
      }

      const data: SignupData = {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
        contactNumber: values.contactNumber,
        role: values.role,
      };

      if (values.role === "recruiter" && recruiterVerificationData) {
        data.recruiterVerification = recruiterVerificationData;
      }
      
      console.log("The other data", data);
      const response = await signupAPI(data);

      actions.resetForm();
      Cookies.set("access_token", response.token, { expires: 1 });
      router.replace("/dashboard");
    } catch (error) {
      toast.error("An Error Occurred, Please try again.");
      console.error("An error occurred during signup:", error);
    }
  };

  const handleVerification = (data: RecruiterVerificationData) => {
    setRecruiterVerificationData(data);
    formikRef.current?.submitForm();
  };

  return (
    <div className="min-h-screen flex w-full items-center justify-center bg-gradient-to-br from-black via-black to-purple-900 relative">
      <BackButton route="/" />
      <div className="w-1/2 text-white flex flex-col items-center justify-center py-6 px-10">
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
          innerRef={formikRef}
          onSubmit={onSubmit}
          validationSchema={signUpPageValidationSchema}
        >
          {({ isSubmitting }) => (
            <Form className="w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3 py-3">
                <CustomInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  isOnboarding
                />
                <CustomInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  isOnboarding
                />
                <CustomInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  isOnboarding
                />
                <CustomInput
                  label="Contact Number"
                  name="contactNumber"
                  type="text"
                  placeholder="Enter your contact number"
                  isOnboarding
                />
                <CustomInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  isOnboarding
                />
                <CustomInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  isOnboarding
                />
                <CustomSelect label="Role" name="role" isOnboarding>
                  <option value="">Select your role</option>
                  <option value="recruiter">Recruiter</option>
                  <option value="candidate">Candidate (User)</option>
                </CustomSelect>
              </div>

              <div className="flex flex-1 justify-center">
                <button
                  type="submit"
                  className="w-1/2 bg-white text-black font-semibold py-4 rounded-lg hover:bg-[#5E17EB] active:bg-[#5E17EB] hover:text-white transition-all duration-200 shadow-lg text-lg mt-4"
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
          className="text-white text-sm mt-5 hover:underline transition duration-200"
        >
          Already have an account?{" "}
          <span className="font-semibold text-[#845ed2]">Login</span>
        </Link>
      </div>

      {openVerificationModal && (
        <RecruiterVerificationModal
          isOpen={openVerificationModal}
          onClose={() => setOpenVerificationModal(false)}
          onVerified={handleVerification}
        />
      )}
    </div>
  );
};

export default SignUp;
