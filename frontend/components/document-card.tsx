"use client"

import { FileText, MoreVertical } from "lucide-react"

interface DocumentCardProps {
  document: {
    id: number
    name: string
    date: string
    size: string
    type: string
  }
}

export default function DocumentCard({ document }: DocumentCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary transition cursor-pointer group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary rounded-lg group-hover:bg-primary/10 transition">
            <FileText size={24} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-base">{document.name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{document.type}</p>
          </div>
        </div>
        <button
          className="p-2 hover:bg-muted rounded-lg transition opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={16} className="text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-2 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>month, dd, year</span>
          <span className="font-medium text-foreground">{document.date}</span>
        </div>
      </div>
    </div>
  )
}
