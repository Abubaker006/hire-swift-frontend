import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "../../../public/assets/Logo/logo.png";
import InternetIcon from "../../../public/assets/icons/internetIcon.svg";
// import HomePageMainImage from "../../../public/assets/images/homePageImage.svg";
// import DashboardImage from "../../../public/assets/images/dashboard.svg";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";

import LoginSign from "./login-sign";

const HomePage = () => {
  return (
    <>
      <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-white shadow-md">
        <div>
          <Image src={LogoImage} alt="Logo" width={50} height={50} />
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/jobs" className="hover:text-blue-600">
            Our Jobs
          </Link>
          <Link href="/schedule" className="hover:text-blue-600">
            Schedule Interviews
          </Link>
          <Link href="/statistics" className="hover:text-blue-600">
            Statistics
          </Link>
          <Link href="/faq" className="hover:text-blue-600">
            FAQ
          </Link>
        </nav>
        <div className="flex space-x-4">
          <LoginSign />
        </div>
      </header>

      <main className="bg-blue-100 text-center py-16 px-4 md:py-20">
        <div className="inline-flex items-center bg-white text-sm text-gray-700 px-4 py-2 rounded-full shadow-md mb-4">
          <Image
            src={InternetIcon}
            alt="Internet Icon"
            width={16}
            height={16}
          />
          <span className="ml-2">The #1 Job hunting platform</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-gray-900">
          A trusted platform for everyone to find their dream jobs
        </h1>
        <h2 className="text-lg md:text-xl text-gray-600 mt-3">
          We make it easy, start yours today in just 2 minutes
        </h2>

        <button className="mt-6 bg-black text-white text-lg px-6 md:px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-gray-900">
          Get Started
        </button>

        <div className="relative mt-10 flex justify-center">
          <Image
            src={LaptopImage}
            alt="Laptop Image"
            className="w-full md:w-3/5"
          />
{/* 
          <div className="absolute inset-0 flex justify-center items-center pointer-events-none">
            <Image
              src={DashboardImage}
              alt="Dashboard Image"
              className="w-[80%] md:w-[44%] h-[85%] object-contain rounded-lg border-4 border-gray-200 shadow-xl -translate-y-5 bg-red-300"
            />
          </div> */}

          <div className="absolute bottom-0 left-8 md:left-16 animate-bounce">
            <span className="text-blue-600 text-2xl md:text-3xl">👍</span>
          </div>
          <div className="absolute bottom-0 right-8 md:right-16 animate-bounce">
            <span className="text-blue-600 text-2xl md:text-3xl">💬</span>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 bg-blue-100">
        Al-Copyrights reserved by HireSwift
      </footer>
    </>
  );
};

export default HomePage;
