import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import {toast} from "react-toastify";
import { logoutAPI } from "@/apiServices/authAPI";
import { logoutSuccess } from "@/hooks/slices/authSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const RecruiterDashboard = ()=>{
    const dispatch=useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const router= useRouter(); 

    const handleLogout=async()=>{
        try{
            const response = logoutAPI();
            if(!response){
              throw ("Error occured while logging out");
            }
            dispatch(logoutSuccess()); 
            Cookies.remove("access_token"); 
            toast.success("Logged out successfully!");
            router.replace("/login");
        }catch(error){
            console.error("Logout Error:", error);
            toast.error("Something went wrong.");
        }
    }
    return (
     <>Recruiter Dashboard {user?.role} {"   "} <button onClick={handleLogout}>logout?</button></>
    );
};

export default RecruiterDashboard;