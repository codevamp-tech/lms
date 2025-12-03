"use client"

import { Award, MapPin } from "lucide-react"

interface CertificateDisplayProps {
  name: string
  level: string
  completionDate: string
}

export default function CertificateDisplay({ name, level, completionDate }: CertificateDisplayProps) {
  return (
    <div className="w-full max-w-md">
      {/* Certificate Container */}
      <div className="relative bg-white rounded-lg shadow-2xl p-12 border-8 border-amber-100 aspect-video flex flex-col items-center justify-center">
        {/* Decorative corner elements */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400"></div>

        {/* Content */}
        <div className="text-center z-10">
          {/* Icon and Title */}
          <div className="flex justify-center mb-4">
            <Award className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Certificate of Achievement</h2>

          {/* Divider */}
          <div className="w-24 h-1 bg-blue-400 mx-auto my-4"></div>

          {/* Student Name */}
          <p className="text-sm text-slate-500 mb-1">This is to certify that</p>
          <p className="text-3xl font-serif font-bold text-slate-800 my-4 italic">{name}</p>

          {/* Achievement Text */}
          <p className="text-sm text-slate-600 mb-4">
            has successfully completed the English Speaking Mastery Program and achieved
          </p>

          {/* Level */}
          <p className="text-lg font-bold text-blue-600 mb-6">{level}</p>

          {/* Completion Info */}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
            <MapPin className="w-4 h-4" />
            <span>Completed on {completionDate}</span>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-slate-400 mt-6 italic">In recognition of dedication and progress</p>
        </div>

        {/* Watermark effect */}
        <div className="absolute inset-0 opacity-5 text-center flex items-center justify-center pointer-events-none">
          <span className="text-6xl font-bold text-slate-400 rotate-45">CERTIFICATE</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4 justify-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Print Certificate
        </button>
        <button
          className="px-6 py-2 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium"
          onClick={() => {
            const canvas = document.querySelector("canvas")
            if (canvas) {
              const link = document.createElement("a")
              link.href = canvas.toDataURL()
              link.download = `${name}-certificate.png`
              link.click()
            }
          }}
        >
          Download
        </button>
      </div>
    </div>
  )
}
