"use client";
import React from "react";
import { Button } from "@/components/ui/button";

const DownloadAppPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto bg-card p-8 rounded-lg shadow text-center">
        <h1 className="text-2xl font-bold mb-4">Download Mr English App</h1>
        <p className="mb-6 text-muted-foreground">
          Get the app for the best learning experience on mobile.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Play Store Link Updated */}
          <Button asChild>
            <a
              href="https://play.google.com/store/apps/details?id=co.bran.hjkbk"
              className="w-full"
              target="_blank"
              rel="noreferrer"
            >
              Download on Play Store
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DownloadAppPage;
