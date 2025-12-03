"use client"

import { ArrowLeft } from "lucide-react"
import CertificateDisplay from "./certificate-display"
import { useRouter } from "next/navigation"


export default function CertificatePage() {
    const router = useRouter();

  const studentData = {
    name: "Imtiyaz Bhat",
    level: "Advanced Speaker",
    completionDate: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#e2eef7" }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
          <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 group text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Your Achievement Unlocked</h2>
          <p className="text-xl text-slate-600 mb-4">Celebrate your English speaking mastery</p>
          <p className="text-lg text-blue-600 font-semibold animate-pulse">
            Next can be <span className="text-blue-700 font-bold">YOU</span>
          </p>
        </div>

        {/* Certificate Display */}
        <div className="flex items-center justify-center">
          <CertificateDisplay
            name={studentData.name}
            level={studentData.level}
            completionDate={studentData.completionDate}
          />
        </div>

        {/* Success Message */}
        <div className="mt-16 text-center">
          <p className="text-lg text-slate-700 mb-4">Congratulations on completing your English speaking course!</p>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This certificate recognizes your dedication and achievement. Share it with pride or download it to showcase
            your skills to the world.
          </p>
        </div>
      </div>
    </main>
  )
}
