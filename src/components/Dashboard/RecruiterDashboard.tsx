import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/hooks/redux/store";
import Link from "next/link";

const RecruiterDashboard = () => {
    const user = useSelector((state: RootState) => state.auth.user);
   
    useEffect(() => {
        console.log("User:", user);
    }, [user]);

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center p-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">
                Welcome {user?.firstName}, wan&apos;t to post a job?
            </h1>
            <Link href="/dashboard/postjobs">
                <button className="bg-[#5E17EB] hover:bg-black text-white font-semibold py-2 px-10 rounded-md transition duration-300 ease-in-out transform hover:scale-105">
                    Click Me!
                </button>
            </Link>
        </div>
    );
};

export default RecruiterDashboard;