"use client";
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { logoutAPI } from "@/apiServices/authAPI";
import { logoutSuccess } from "@/hooks/slices/authSlice";
import { showLoader, hideLoader } from "@/hooks/slices/loaderSlice";
import Link from "next/link";
import LogoImage from "../../../public/assets/Logo/hire-swift-white.svg";
import LocationIcon from "../../../public/assets/icons/locationIcon.svg";
import GenericAvatar from "../../../public/assets/icons/Generic-avatar.svg";
import Filters from "@/components/Dashboard/Filters";
import useAuth from "@/hooks/customHooks/useAuth";
import LoaderImage from "../../../public/assets/loader/hire swift .gif";

export default function DashbaordLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isChecking, role } = useAuth(["recruiter", "candidate"]);

  const handleLogout = async () => {
    try {
      dispatch(showLoader());
      const response = await logoutAPI();
      if (!response) throw "Error logging out";
      dispatch(logoutSuccess());
      Cookies.remove("access_token");
      toast.success("Logged out successfully!");
      router.replace("/login");
    } catch (error) {
      toast.error("Something went wrong.");
      console.error("Something went wrong in logging out", error);
    } finally {
      dispatch(hideLoader());
    }
  };

  const navLinks =
    role === "recruiter"
      ? [
          { href: "/dashboard/postJobs", label: "Post Jobs" },
          { href: "/dashboard/results", label: "Schedule Interviews" },
          { href: "/dashboard/statistics", label: "Statistics" },
          { href: "/dashboard/faqs", label: "FAQ" },
        ]
      : [
          { href: "/dashboard/jobListings", label: "Job Listings" },
          { href: "/dashboard/applications", label: "My Applications" },
          { href: "/dashboard/interviews", label: "Interviews" },
          { href: "/dashboard/faqs", label: "FAQ" },
        ];

  if (isChecking || role === null) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-white">
        <Image src={LoaderImage} alt="Logo" width={100} height={100} />
      </div>
    );
  }
  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#fff] text-gray-900">
        <header className="flex justify-between items-center bg-black text-white p-4">
          <div className="flex items-center gap-10">
            <Image src={LogoImage} alt="Logo" width={100} height={100} />
            <nav className="flex gap-5">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Image src={LocationIcon} alt="Location" width={20} height={20} />
            <p>Your location</p>
            <Image src={GenericAvatar} alt="Avatar" width={30} height={30} />
            <button
              onClick={handleLogout}
              className="bg-[#5E17EB] text-white px-4 py-1 rounded hover:bg-[#fff] transition-all duration-300 hover:text-black"
            >
              Logout
            </button>
          </div>
        </header>


        <div className="flex flex-1">
          <aside className="w-1/4 bg-white p-5 border-r border-gray-300 min-h-screen">
            <div className="bg-black text-white p-4 rounded-md text-center">
              <p className="text-sm">Get the best talent with HireSwift</p>
              <button className="mt-3 bg-[#5E17EB] text-white px-4  rounded hover:bg-[#fff] transition-all duration-300 hover:text-black py-2">
                Learn more
              </button>
            </div>
            <Filters />
          </aside>

          <main className="flex-1 p-10 bg-[#fff] min-h-screen overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
