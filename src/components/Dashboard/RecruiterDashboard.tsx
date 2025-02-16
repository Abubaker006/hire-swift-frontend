import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";

import PostForm from "./PostJobs/PostForm";


const RecruiterDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
   
    useEffect(() => {
        console.log("User:", user);
    }, [user]);
    return (
        <PostForm />
    );
};

export default RecruiterDashboard;
