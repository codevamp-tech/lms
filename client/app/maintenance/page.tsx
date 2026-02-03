import React from "react";

const MaintenancePage = () => {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-black text-white font-sans antialiased">
            <div className="flex flex-col items-center sm:flex-row">
                <h1 className="text-5xl font-medium leading-tight tracking-tight sm:mr-8 sm:border-r sm:border-gray-800 sm:pr-8 sm:text-6xl text-white">
                    500
                </h1>
                <div className="mt-4 text-center sm:mt-0 sm:text-left">
                    <h2 className="text-lg font-normal sm:text-xl text-white">
                        Build error occurred
                    </h2>
                    <div className="mt-4 text-left">
                        <code className="text-sm font-mono text-red-500">
                            Error: Site temporarily disabled
                        </code>
                        <p className="mt-2 text-xs font-mono text-gray-500">
                            at Object.&lt;anonymous&gt; (next.config.js:1:1)
                            <br />
                            at Module._compile (node:internal/modules/cjs/loader:1256:14)
                            <br />
                            at Object.Module._extensions..js (node:internal/modules/cjs/loader:1310:10)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MaintenancePage;
