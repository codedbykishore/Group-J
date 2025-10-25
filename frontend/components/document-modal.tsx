"use client"

import { useState } from "react"
import { X, Trash2 } from "lucide-react"

interface DocumentModalProps {
  document: any
  onClose: () => void
  onUpload: (data: any) => void
  isEditMode?: boolean
}

export default function DocumentModal({ document, onClose, onUpload, isEditMode }: DocumentModalProps) {
  const [companyName, setCompanyName] = useState(document?.name || "")
  const [files, setFiles] = useState({
    sec: document?.files?.sec || null,
    merger: document?.files?.merger || null,
    market: document?.files?.market || null,
  })
  const [newFiles, setNewFiles] = useState({
    sec: null as File | null,
    merger: null as File | null,
    market: null as File | null,
  })

  const handleFileChange = (field: keyof typeof newFiles, file: File | null) => {
    setNewFiles({ ...newFiles, [field]: file })
  }

  const handleRemoveFile = (field: keyof typeof files) => {
    setFiles({ ...files, [field]: null })
  }

  const handleUpload = () => {
    if (isEditMode) {
      const uploadedFiles: any = {}
      if (newFiles.sec) uploadedFiles.sec = newFiles.sec.name
      if (newFiles.merger) uploadedFiles.merger = newFiles.merger.name
      if (newFiles.market) uploadedFiles.market = newFiles.market.name

      // Keep existing files if no new file is uploaded
      if (!newFiles.sec && files.sec) uploadedFiles.sec = files.sec
      if (!newFiles.merger && files.merger) uploadedFiles.merger = files.merger
      if (!newFiles.market && files.market) uploadedFiles.market = files.market

      onUpload(uploadedFiles)
    } else {
      const uploadedFiles: any = {}
      if (newFiles.sec) uploadedFiles.sec = newFiles.sec.name
      if (newFiles.merger) uploadedFiles.merger = newFiles.merger.name
      if (newFiles.market) uploadedFiles.market = newFiles.market.name

      onUpload({
        name: companyName,
        date: new Date().toISOString().split("T")[0],
        size: "0.0 MB",
        type: "Company",
        files: uploadedFiles,
      })
    }
    setCompanyName("")
    setFiles({ sec: null, merger: null, market: null })
    setNewFiles({ sec: null, merger: null, market: null })
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-foreground">{isEditMode ? document?.name : "Add new"}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground"
          >
            <X size={24} />
          </button>
        </div>

        {/* Company Name Input - only show for new documents */}
        {!isEditMode && (
          <div className="mb-8">
            <label className="block text-sm font-semibold text-foreground mb-3">Company name</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
            />
          </div>
        )}

        {/* Upload Your Files Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Upload your files</h3>

          {/* File Upload Fields */}
          <div className="space-y-4">
            {[
              { key: "sec", label: "SEC", placeholder: "Upload" },
              { key: "merger", label: "Merger Agreement", placeholder: "Upload" },
              { key: "market", label: "Market Research", placeholder: "Upload" },
            ].map((field) => (
              <div key={field.key} className="flex items-center gap-4">
                <label className="text-sm font-medium text-foreground min-w-fit w-32">{field.label}</label>
                <div className="flex-1">
                  {files[field.key as keyof typeof files] ? (
                    <div className="px-4 py-3 border border-border rounded-lg bg-muted flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-foreground font-medium">
                          {files[field.key as keyof typeof files]}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(field.key as keyof typeof files)}
                        className="p-1 hover:bg-background rounded transition text-muted-foreground hover:text-foreground"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        onChange={(e) =>
                          handleFileChange(field.key as keyof typeof newFiles, e.target.files?.[0] || null)
                        }
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="px-4 py-3 border border-border rounded-lg bg-background text-muted-foreground hover:border-primary transition cursor-pointer flex items-center justify-between">
                        <span className="text-sm">
                          {newFiles[field.key as keyof typeof newFiles]?.name || "Choose file..."}
                        </span>
                        <span className="text-sm font-medium text-primary">{field.placeholder}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            {isEditMode ? "Update" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  )
}
