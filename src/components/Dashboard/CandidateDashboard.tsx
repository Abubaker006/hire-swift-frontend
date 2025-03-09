"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";

const CandidateDashboard = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Welcome, {user?.firstName || "Candidate"}
      </h1>
      <p>Your Statistics will be shown here, for now navigate to Job Listings</p>
    </div>
  );
};

export default CandidateDashboard;
