"use client"

export default function EvalPage() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">Evaluation</h2>
        <p className="text-sm text-muted-foreground mt-1">Review and analyze your documents</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Evaluation Card 1 */}
          <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Document Quality</h3>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">92%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Your documents meet high quality standards</p>
          </div>

          {/* Evaluation Card 2 */}
          <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Completeness</h3>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">85%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">All required sections are present</p>
          </div>

          {/* Evaluation Card 3 */}
          <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Compliance</h3>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">88%</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Documents comply with regulations</p>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="mt-8 border border-border rounded-lg p-6 bg-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Detailed Analysis</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm text-foreground">SEC Filing Accuracy</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "95%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <span className="text-sm text-foreground">Merger Agreement Clarity</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "88%" }}></div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Market Research Relevance</span>
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: "82%" }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
