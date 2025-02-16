import React from "react";
import Link from "next/link";

interface BackbuttonProps {
  route: string;
}

const BackButton: React.FC<BackbuttonProps> = ({ route }) => {
  return (
    <>
      <Link href={route}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white hover:text-[#5E17EB] transition-all duration-200"
        >
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </Link>
    </>
  );
};

export default BackButton;
