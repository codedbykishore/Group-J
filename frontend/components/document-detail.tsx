"use client"

import { ArrowLeft, Download, Share2, Trash2, MoreVertical } from "lucide-react"

interface DocumentDetailProps {
  document: {
    id: number
    name: string
    date: string
    size: string
    type: string
  }
  onBack: () => void
}

export default function DocumentDetail({ document, onBack }: DocumentDetailProps) {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:opacity-80 transition font-medium"
          >
            <ArrowLeft size={20} />
            Back
          </button>
          <button className="p-2 hover:bg-muted rounded-lg transition">
            <MoreVertical size={20} className="text-muted-foreground" />
          </button>
        </div>
        <h1 className="text-3xl font-bold text-foreground">{document.name}</h1>
        <p className="text-muted-foreground mt-2">
          {document.type} • {document.size}
        </p>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">
          {/* Document Preview */}
          <div className="bg-card border border-border rounded-lg p-12 mb-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-secondary rounded-lg mb-4">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-muted-foreground mb-4">Document preview not available</p>
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
              Download to view
            </button>
          </div>

          {/* Document Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">File Information</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">File Name</p>
                  <p className="font-medium text-foreground">{document.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">File Type</p>
                  <p className="font-medium text-foreground">{document.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">File Size</p>
                  <p className="font-medium text-foreground">{document.size}</p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Upload Details</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Upload Date</p>
                  <p className="font-medium text-foreground">{document.date}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="font-medium text-foreground">Uploaded</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Document ID</p>
                  <p className="font-medium text-foreground font-mono text-sm">#{document.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase">Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Document uploaded</p>
                  <p className="text-sm text-muted-foreground">{document.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border p-6 bg-card">
        <div className="max-w-4xl mx-auto flex gap-3">
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition">
            <Download size={20} />
            Download
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-border text-foreground rounded-lg font-medium hover:bg-muted transition">
            <Share2 size={20} />
            Share
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-destructive text-destructive rounded-lg font-medium hover:bg-destructive/10 transition">
            <Trash2 size={20} />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
