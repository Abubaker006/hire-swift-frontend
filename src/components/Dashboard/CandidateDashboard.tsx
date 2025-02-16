"use client";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";

const CandidateDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
   
    useEffect(()=>{
      console.log("The user information",user);
    },[user]);
  
    return (
        <>CLient Dashboard for {user?.role} and the userid is with moke user</>
    );
};

export default CandidateDashboard;