"use client";
import React from "react";
import CandidateDashboard from "@/components/Dashboard/CandidateDashboard";
import useAuth from "@/hooks/customHooks/useAuth";
import { MoonLoader } from "react-spinners";
import RecruiterDashboard from "@/components/Dashboard/RecruiterDashboard";

const Dashboard = () => {
  const { isChecking, role } = useAuth(["recruiter", "candidate"]);

  if (isChecking || role === null) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <MoonLoader size={60} color={"#2980b9"} loading={true} />
        <p className="my-10">Loading...</p>
      </div>
    );
  }
  return (
    <>
      {role === "recruiter" && (<RecruiterDashboard />)}
      {role === "candidate" && (<CandidateDashboard />)}
    </>
  );
};

export default Dashboard;
