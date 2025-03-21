import React from "react";
import Link from "next/link";

const AssessmentMissedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-6">
      <div className="max-w-md text-center">
        <h1 className="text-5xl font-bold mb-6">Success</h1>
        <h2 className="text-2xl font-semibold mb-4">Assessment Completed!</h2>
        <p className="text-gray-400 mb-6">
          Thank you, for submitting your assessment your result will be emailed
          and availed at your dashboard shortly.
        </p>
        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 text-lg font-medium text-black bg-white rounded-lg shadow-md hover:gray-300 transition"
        >
          Navigate to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default AssessmentMissedPage;
