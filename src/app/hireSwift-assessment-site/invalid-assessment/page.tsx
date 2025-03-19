import React from "react";
import Link from "next/link";

const InvalidAssessmentPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-6">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold mb-6">401</h1>
        <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
        <p className="text-gray-400 mb-6">
          We are sorry to tell you but your assessment has expired, due to you
          being late for assessment.
        </p>
        <Link
          href="/dashboard/jobListings"
          className="inline-block px-6 py-3 text-lg font-medium text-black bg-white rounded-lg shadow-md hover:gray-300 transition"
        >
          Apply again
        </Link>
      </div>
    </div>
  );
};

export default InvalidAssessmentPage;
