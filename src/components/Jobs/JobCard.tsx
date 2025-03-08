"use client";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faBriefcase } from "@fortawesome/free-solid-svg-icons";
import GenericModal from "../Modal/GenericModal";

const JobCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnClick = () => {
    console.log("hello");
    setIsModalOpen(true);
  };
  return (
    <>
      <div className="bg-[#E6DAFF] rounded-xl p-4 w-64 shadow-md relative">
        <div className="absolute top-3 left-3 bg-white text-sm font-medium px-3 py-1 rounded-full shadow">
          4 Feb, 2024
        </div>

        <div className="absolute top-3 right-3 cursor-pointer">
          <FontAwesomeIcon icon={faBookmark} className="w-5 h-5 text-black" />
        </div>
        <div className="mt-10">
          <p className="text-gray-800 text-sm font-semibold">META</p>
          <h2 className="text-black font-bold text-lg">
            Junior UI/UX Designer
          </h2>
        </div>
        <div className="flex justify-end my-2">
          <FontAwesomeIcon icon={faBriefcase} className="h-10 w-10" />
        </div>

        <div className="flex flex-wrap gap-2 mt-2">
          {["senior level", "project work", "part time"].map((tag, index) => (
            <span
              key={index}
              className="bg-white text-black text-xs font-medium px-3 py-1 rounded-full shadow"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <button
            className="bg-black text-white text-sm font-medium px-4 py-2 rounded-lg"
            onClick={handleOnClick}
          >
            Details
          </button>
        </div>
      </div>
      <GenericModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Job Details"
      >
        <p className="text-gray-700">
          More information about this job goes here...
        </p>
      </GenericModal>
    </>
  );
};

export default JobCard;
