"use client"

import { LayoutGrid, LogOut, MessageSquare, BarChart3 } from "lucide-react"

interface SidebarProps {
  activeSection: string
  onNavigate: (section: string) => void
}

export default function Sidebar({ activeSection, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
            {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <h1 className="text-2xl font-bold text-sidebar-primary tracking-wider">M&A Agent</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="space-y-1">
          <button
            onClick={() => onNavigate("document")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              activeSection === "document"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <LayoutGrid size={20} />
            Document
          </button>
          <button
            onClick={() => onNavigate("enquire")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              activeSection === "enquire"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <MessageSquare size={20} />
            Enquire
          </button>
          <button
            onClick={() => onNavigate("eval")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              activeSection === "eval"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <BarChart3 size={20} />
            Eval
          </button>
          <button
            onClick={() => onNavigate("logs")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition ${
              activeSection === "logs"
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <LogOut size={20} />
            Logs
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-sidebar-border text-xs text-sidebar-foreground text-center">
        <p>© 2025 M&A Agent</p>
      </div>
    </aside>
  )
}
