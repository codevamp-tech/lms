import React from "react";

const MaintenancePage = () => {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <div className="flex flex-col items-center space-y-6">
                {/* Blocked/Restriction Icon */}
                <div className="rounded-full bg-red-100 p-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-600"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                </div>

                <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    Site Access Blocked
                </h1>

                <p className="max-w-md text-lg text-gray-600">
                    Usage is temporarily restricted.
                    <br />
                    Please try again later.
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
