//not being used.
"use client";
import React from "react";
import { useRouter } from "next/navigation";

const LoginSign = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/login");
  };

  const handleSignUpClick = () => {
    router.push("/signup");
  };
  return (
    <>
      <button className="text-white font-medium hover:text-[#5E17EB] transition-all duration-500" onClick={handleLoginClick}>
        Login
      </button>
      <button
        className="bg-[#fff] text-black px-4 md:px-5 py-2 rounded-lg font-medium transition-all duration-300 hover:bg-[#5E17EB] hover:text-white"
        onClick={handleSignUpClick}
      >
        Get Started
      </button>
    </>
  );
};

export default LoginSign;
