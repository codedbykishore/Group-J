"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

interface TestResult {
  test: string
  score: number | null
  error?: string
}

interface EvaluationResult {
  prompt: string
  response: string
  testResults: TestResult[]
  averageScore: number
}

interface EvaluationStats {
  totalEvaluations: number
  totalTests: number
  averageScore: number
  minScore: number
  maxScore: number
}

interface EvaluationData {
  results: EvaluationResult[]
  stats: EvaluationStats
  unitTests: string[]
}

export default function EvalPage() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvaluations()
  }, [])

  const fetchEvaluations = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/evaluate')
      
      if (!res.ok) {
        throw new Error(`Failed to fetch evaluations: ${res.status}`)
      }

      const data = await res.json()
      setEvaluationData(data)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load evaluation data')
      console.error('Error fetching evaluations:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-full bg-background items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Running LMUnit evaluations...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col h-full bg-background">
        <div className="border-b border-border p-6">
          <h2 className="text-2xl font-bold text-foreground">Evaluation</h2>
          <p className="text-sm text-muted-foreground mt-1">M&A Due Diligence Quality Assessment</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={fetchEvaluations}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold text-foreground">Evaluation</h2>
        <p className="text-sm text-muted-foreground mt-1">M&A Due Diligence Quality Assessment using LMUnit</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Overall Statistics */}
        {evaluationData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Overall Score</h3>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {evaluationData.stats.averageScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Average across all tests (out of 5.0)</p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Evaluations</h3>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{evaluationData.stats.totalEvaluations}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Sample queries tested</p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Unit Tests</h3>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{evaluationData.stats.totalTests}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Quality criteria evaluated</p>
              </div>

              <div className="border border-border rounded-lg p-6 bg-card hover:shadow-lg transition">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Score Range</h3>
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {evaluationData.stats.minScore.toFixed(1)}-{evaluationData.stats.maxScore.toFixed(1)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">Min to max test scores</p>
              </div>
            </div>

            {/* Unit Tests Overview */}
            <div className="mb-8 border border-border rounded-lg p-6 bg-card">
              <h3 className="text-lg font-semibold text-foreground mb-4">Unit Test Framework</h3>
              <div className="space-y-3">
                {evaluationData.unitTests.map((test, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-medium text-xs">
                      {index + 1}
                    </span>
                    <p className="text-muted-foreground">{test}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Results */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">Detailed Evaluation Results</h3>
              
              {evaluationData.results.map((result, index) => (
                <div key={index} className="border border-border rounded-lg p-6 bg-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-2">Query {index + 1}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{result.prompt}</p>
                      <div className="text-sm bg-muted/50 p-3 rounded border border-border">
                        <span className="font-medium text-foreground">Response: </span>
                        <span className="text-muted-foreground">{result.response}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <div className="text-center">
                          <span className="text-2xl font-bold text-primary block">
                            {result.averageScore.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">avg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Test Scores */}
                  <div className="mt-4 space-y-2">
                    <p className="text-sm font-medium text-foreground">Test Scores:</p>
                    {result.testResults.map((testResult, testIndex) => (
                      <div key={testIndex} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex-1 mr-4">Test {testIndex + 1}</span>
                        <div className="flex items-center gap-2">
                          {testResult.score !== null ? (
                            <>
                              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary transition-all"
                                  style={{ width: `${(testResult.score / 5) * 100}%` }}
                                ></div>
                              </div>
                              <span className="w-12 text-right font-medium text-foreground">
                                {testResult.score.toFixed(1)}/5
                              </span>
                            </>
                          ) : (
                            <span className="text-red-500 text-xs">{testResult.error || 'Error'}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Refresh Button */}
            <div className="mt-8 text-center">
              <button
                onClick={fetchEvaluations}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
              >
                Re-run Evaluations
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
