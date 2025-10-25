"use client"

import { Search, Plus, Filter, FileText } from "lucide-react"
import DocumentCard from "./document-card"

interface Document {
  id: number
  name: string
  date: string
  size: string
  type: string
}

interface DashboardProps {
  documents: Document[]
  onUpload: () => void
  onSelectDocument: (doc: Document) => void
}

export default function Dashboard({ documents, onUpload, onSelectDocument }: DashboardProps) {
  return (
    <div className="p-8 md:p-12">
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-foreground mb-2">Your Documents</h2>
        <div className="h-1 w-32 bg-primary rounded-full"></div>
      </div>

      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 text-muted-foreground" size={20} />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition font-medium">
          <Filter size={20} />
          Filters
        </button>
        <button className="flex items-center justify-center gap-2 px-6 py-3 border border-border rounded-lg text-foreground hover:bg-muted transition font-medium">
          Sort
        </button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          <div key={doc.id} onClick={() => onSelectDocument(doc)} className="cursor-pointer">
            <DocumentCard document={doc} />
          </div>
        ))}

        {/* Add New Document Card */}
        <button
          onClick={onUpload}
          className="border-2 border-dashed border-border rounded-lg p-8 hover:border-primary hover:bg-secondary transition flex flex-col items-center justify-center gap-3 min-h-48"
        >
          <Plus size={32} className="text-primary" />
          <span className="text-foreground font-semibold">add new document</span>
        </button>
      </div>

      {/* Empty State */}
      {documents.length === 0 && (
        <div className="text-center py-16">
          <FileText size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-lg">No documents yet</p>
          <p className="text-muted-foreground mb-6">Upload your first document to get started</p>
          <button
            onClick={onUpload}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition"
          >
            Upload Document
          </button>
        </div>
      )}
    </div>
  )
}
