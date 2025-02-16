"use client";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import { toast } from "react-toastify";
import { logoutAPI } from "@/apiServices/authAPI";
import { logoutSuccess } from "@/hooks/slices/authSlice";
import { showLoader, hideLoader } from "@/hooks/slices/loaderSlice";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const CandidateDashboard = () => {
    const dispatch = useDispatch();
    const user = useSelector((state: RootState) => state.auth.user);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            dispatch(showLoader());
            const response = await logoutAPI();
            if (!response) {
                throw ("Error occured while logging out");
            }
            dispatch(logoutSuccess());
            Cookies.remove("access_token");
            toast.success("Logged out successfully!");
            router.replace("/login");
        } catch (error) {
            dispatch(hideLoader());
            console.error("Logout Error:", error);
            toast.error("Something went wrong.");
        } finally{
            dispatch(hideLoader());
        }
    }
    return (
        <>CLient Dashboard for {user?.role} and the userid is with moke user <button onClick={handleLogout}>logout?</button></>
    );
};

export default CandidateDashboard;