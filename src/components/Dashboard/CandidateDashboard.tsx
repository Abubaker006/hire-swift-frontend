"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { Formik, Form } from "formik";
import CustomInput from "../Inputs/customInput";
import { stipePaymentScehma } from "@/utils/schema";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { createCheckoutSession } from "@/apiServices/StripeAPI";
import { toast } from "react-toastify";
import { Coins } from "lucide-react";

const CandidateDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl  p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Welcome, {user?.firstName || "Candidate"}
          </h1>
          <p className="text-gray-600 mt-2">
            Your dashboard will display stats soon. Meanwhile, check Job
            Listings.
          </p>
        </div>

        <div className="p-6 rounded-xl">
          <h2 className="text-xl flex items-center font-semibold text-gray-700 mb-4">
            Buy Tokens, your current tokens are {user?.tokens} <Coins className="ml-1 text-[#4A13C2]" size={24}/>
          </h2>

          <Formik
            initialValues={{ amount: 10 }}
            validationSchema={stipePaymentScehma}
            onSubmit={async (values, actions) => {
              try {
                if (user?.tokens && user.tokens >= 500) {
                  toast.info(
                    "Your current tokens are more than enough please utilize them."
                  );
                  return;
                }
                const response = await createCheckoutSession(
                  token,
                  values.amount * 100
                );
                if (response?.url) {
                  window.location.href = response.url;
                }
              } catch (error) {
                console.error("Error at payment gateway init", error);
                toast.error("Payment initiation failed");
              }

              actions.setSubmitting(false);
              actions.resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4">
                <CustomInput
                  label="Amount (USD)"
                  name="amount"
                  type="number"
                  isOnboarding={false}
                />
                <button
                  type="submit"
                  className="w-full bg-[#5E17EB] text-white py-2 px-4 rounded-md font-semibold hover:bg-[#4a13c2] transition"
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
                    "Pay Now"
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
