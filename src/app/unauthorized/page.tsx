import React from "react";
import Link from "next/link";
const UnauthorizedPage = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-black text-white px-6">
            <div className="max-w-md text-center">
                <h1 className="text-5xl font-bold mb-6">403</h1>
                <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
                <p className="text-gray-400 mb-6">
                    You do not have the necessary permissions to access this page. Please
                    sign in with an authorized account.
                </p>
                <Link
                    href="/login"
                    className="inline-block px-6 py-3 text-lg font-medium text-black bg-white rounded-lg shadow-md hover:bg-gray-300 transition"
                >
                    Go to Login
                </Link>
            </div>
        </div>
    )
};

export default UnauthorizedPage;