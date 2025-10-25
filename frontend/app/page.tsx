"use client"

import { useState } from "react"
import Sidebar from "@/components/sidebar"
import Dashboard from "@/components/dashboard"
import DocumentModal from "@/components/document-modal"
import Chatbot from "@/components/chatbot"
import EvalPage from "@/components/eval-page"

interface Document {
  id: number
  name: string
  date: string
  size: string
  type: string
}

interface DocumentWithFiles extends Document {
  files?: {
    sec?: string
    merger?: string
    market?: string
  }
}

export default function Home() {
  const [activeSection, setActiveSection] = useState("document")
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<DocumentWithFiles | null>(null)
  const [documents, setDocuments] = useState<DocumentWithFiles[]>([
    {
      id: 1,
      name: "Company A",
      date: "2024-10-20",
      size: "2.4 MB",
      type: "Company",
      files: { sec: "sec-filing.pdf", merger: "merger-agreement.pdf", market: "market-research.pdf" },
    },
    { id: 2, name: "Company B", date: "2024-10-18", size: "1.8 MB", type: "Company", files: {} },
    { id: 3, name: "Company C", date: "2024-10-15", size: "0.5 MB", type: "Company", files: {} },
  ])

  const handleSelectDocument = (doc: DocumentWithFiles) => {
    setSelectedDocument(doc)
    setShowUploadModal(true)
  }

  const handleUploadFiles = (docId: number, uploadedFiles: { sec?: string; merger?: string; market?: string }) => {
    setDocuments(
      documents.map((doc) => (doc.id === docId ? { ...doc, files: { ...doc.files, ...uploadedFiles } } : doc)),
    )
    setShowUploadModal(false)
    setSelectedDocument(null)
  }

  const handleAddDocument = (doc: any) => {
    setDocuments([...documents, { ...doc, id: documents.length + 1, files: {} }])
    setShowUploadModal(false)
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="flex-1 overflow-auto">
        {activeSection === "document" && (
          <Dashboard
            documents={documents}
            onUpload={() => {
              setSelectedDocument(null)
              setShowUploadModal(true)
            }}
            onSelectDocument={handleSelectDocument}
          />
        )}
        {activeSection === "enquire" && <Chatbot />}
        {activeSection === "eval" && <EvalPage />}
      </main>
      {showUploadModal && (
        <DocumentModal
          document={selectedDocument}
          onClose={() => {
            setShowUploadModal(false)
            setSelectedDocument(null)
          }}
          onUpload={selectedDocument ? (files) => handleUploadFiles(selectedDocument.id, files) : handleAddDocument}
          isEditMode={!!selectedDocument}
        />
      )}
    </div>
  )
}
