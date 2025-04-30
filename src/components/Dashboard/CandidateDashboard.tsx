"use client";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Formik, Form } from "formik";
import CustomInput from "../Inputs/customInput";
import CheckoutForm from "../Stripe/CheckoutForm";
import { stipePaymentScehma } from "@/utils/schema";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CandidateDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [amount, setAmount] = useState<number>(1000);

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
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Make a Payment
          </h2>

          <Formik
            initialValues={{ amount: amount / 100 }}
            validationSchema={stipePaymentScehma}
            onSubmit={(values) => {
              setAmount(values.amount * 100);
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
                    "Update Amount"
                  )}
                </button>
              </Form>
            )}
          </Formik>

          <div className="mt-8">
            <Elements stripe={stripePromise}>
              <CheckoutForm amount={amount} />
            </Elements>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;
