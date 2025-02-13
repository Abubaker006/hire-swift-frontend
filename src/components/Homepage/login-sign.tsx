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
      <button className="text-gray-700 font-medium" onClick={handleLoginClick}>
        Login
      </button>
      <button
        className="bg-blue-600 text-white px-4 md:px-5 py-2 rounded-lg font-medium hover:bg-blue-700"
        onClick={handleSignUpClick}
      >
        Get Started
      </button>
    </>
  );
};

export default LoginSign;
