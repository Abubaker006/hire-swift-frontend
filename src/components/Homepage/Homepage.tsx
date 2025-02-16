import React from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "../../../public/assets/Logo/hire-swift-white.svg";
import InternetIcon from "../../../public/assets/icons/internetIcon.svg";
import LaptopImage from "../../../public/assets/images/LaptopImage.svg";

import LoginSign from "./login-sign";

const HomePage = () => {
  return (
    <>
      <header className="flex items-center justify-between px-6 md:px-8 py-4 bg-[#000] shadow-md">
        <div>
          <Image src={LogoImage} alt="Logo" width={150} height={100} />
        </div>
        <nav className="hidden md:flex space-x-6 text-gray-700 font-medium">
          <Link href="/jobs" className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500">
            Our Jobs
          </Link>
          <Link href="/schedule" className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500">
            Schedule Interviews
          </Link>
          <Link href="/statistics" className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500">
            Statistics
          </Link>
          <Link href="/faq" className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500">
            FAQ
          </Link>
        </nav>
        <div className="flex space-x-4">
          <LoginSign />
        </div>
      </header>

      <main className="bg-gradient-to-b from-black via-black to-[#5E17EB] text-center py-16 px-4 md:py-20">
        <div className="inline-flex items-center bg-white text-sm text-gray-700 px-4 py-2 rounded-full shadow-md mb-4">
          <Image
            src={InternetIcon}
            alt="Internet Icon"
            width={16}
            height={16}
          />
          <span className="ml-2">The #1 Job hunting platform</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-[#fff]">
          A trusted platform for everyone to find their dream jobs
        </h1>
        <h2 className="text-lg md:text-xl text-gray-400 mt-3">
          We make it easy, start yours today in just 2 minutes
        </h2>

        <button className="mt-6 bg-[#fff] text-black text-lg px-6 md:px-8 py-3 rounded-xl font-medium shadow-lg transition-all duration-300 hover:bg-[#5E17EB] hover:text-white">
          <Link href={"/signup"}> Get Started</Link>
        </button>

        <div className="relative mt-10 flex justify-center">
          <Image
            src={LaptopImage}
            alt="Laptop Image"
            className="w-full md:w-3/5"
          />
          <div className="absolute bottom-0 left-8 md:left-16 animate-bounce">
            <span className="text-blue-600 text-2xl md:text-3xl">👍</span>
          </div>
          <div className="absolute bottom-0 right-8 md:right-16 animate-bounce">
            <span className="text-blue-600 text-2xl md:text-3xl">💬</span>
          </div>
        </div>
      </main>

      <footer className="text-center text-[#fff] py-4 bg-[#5E17EB]">
        Al-Copyrights reserved by HireSwift
      </footer>
    </>
  );
};

export default HomePage;
