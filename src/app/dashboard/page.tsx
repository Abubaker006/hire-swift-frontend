"use client";
import React from "react";
import CandidateDashboard from "@/components/Dashboard/CandidateDashboard";
import RecruiterDashboard from "@/components/Dashboard/RecruiterDashboard";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
const Dashboard = () => {

  const user = useSelector((state:RootState)=>state.auth.user);
  
 
  return (
    <>
      {user?.role === "recruiter" && (<RecruiterDashboard />)}
      {user?.role === "candidate" && (<CandidateDashboard />)}
    </>
  );
};

export default Dashboard;
