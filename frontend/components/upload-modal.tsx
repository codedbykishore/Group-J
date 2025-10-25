"use client"

import { useState } from "react"
import { X, Upload } from "lucide-react"

interface UploadModalProps {
  onClose: () => void
  onUpload: (doc: any) => void
}

export default function UploadModal({ onClose, onUpload }: UploadModalProps) {
  const [fileName, setFileName] = useState("")
  const [companyName, setCompanyName] = useState("")

  const handleUpload = () => {
    if (fileName && companyName) {
      onUpload({
        name: fileName,
        date: new Date().toISOString().split("T")[0],
        size: "0.0 MB",
        type: "Document",
      })
      setFileName("")
      setCompanyName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-8 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Upload your files</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition">
            <X size={20} className="text-foreground" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="mb-6">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition cursor-pointer">
            <Upload size={32} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-foreground font-medium">Drag & drop your file here</p>
            <p className="text-sm text-muted-foreground">or click to browse</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Company Name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  )
}
