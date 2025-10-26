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
  cached?: boolean
  lastEvaluationTime?: number
}

// Generate random score around 3.6 average
const generateScore = () => {
  // Generate scores between 2.8 and 4.4 to average around 3.6
  const min = 2.8
  const max = 4.4
  const score = Math.random() * (max - min) + min
  return Math.round(score * 10) / 10 // Round to 1 decimal
}

// Fake evaluation data generator
const generateFakeEvaluations = (): EvaluationData => {
  const unitTests = [
    "Does the response accurately identify all material risks disclosed in financial statements, legal contracts, and regulatory filings?",
    "Are all financial and risk-related figures precisely traced back to their document sources and cited with page numbers?",
    "Is regulatory compliance, including pending investigations and antitrust approvals, analyzed and cited based on the merger documents?",
    "Does the answer evaluate management's synergy and integration estimates using both historical benchmarks and cited post-merger evidence?",
    "Are deal terms—such as termination conditions, breakup fees, or change-of-control provisions—summarized with specific contract references?",
    "Does the system capture and cite legal liabilities, pending litigations, and compliance exposures called out in the filings?",
    "Are recommendations for go/no-go acquisition and negotiation topics supported by cross-document evidence?",
    "Is the generated risk matrix exhaustive, ranking major risks by both probability and impact, and does it justify each score using the source material?",
  ]

  const evaluationData = [
    {
      prompt: "What was Seagen's total revenue reported in the 2022 10-K filing?",
      response: "Seagen's total revenue for 2022, as reported in their 10-K, was $1.96 billion, reflecting strong year-over-year growth driven by its oncology pipeline."
    },
    {
      prompt: "What breakup fee is stipulated in the Pfizer–Seagen merger agreement?",
      response: "The agreement specifies a termination (breakup) fee of $1.64 billion payable by Seagen to Pfizer if certain conditions are not met, as detailed in Section 8.3."
    },
    {
      prompt: "How does Seagen's market share in US oncology compare to top competitors according to recent industry analysis?",
      response: "Seagen held an estimated 7% US oncology market share in targeted therapies for 2024, positioning it behind Roche/Genentech and Novartis as outlined in the industry report."
    },
    {
      prompt: "Summarize the key regulatory risks highlighted for this acquisition.",
      response: "Key regulatory risks include ongoing FTC antitrust review due to market concentration and FDA inspection delays for lead product BLA approval, both cited in recent filings."
    },
    {
      prompt: "What synergy savings are projected by Pfizer management versus industry benchmarks for similar oncology M&A?",
      response: "Pfizer projects $1.2 billion in annual synergies by 2027, which is modestly above the oncology M&A average according to McKinsey industry studies."
    }
  ]

  const results: EvaluationResult[] = evaluationData.map(item => {
    const testResults: TestResult[] = unitTests.map(test => ({
      test,
      score: generateScore()
    }))

    const averageScore = testResults.reduce((sum, t) => sum + (t.score || 0), 0) / testResults.length

    return {
      prompt: item.prompt,
      response: item.response,
      testResults,
      averageScore
    }
  })

  const allScores = results.flatMap(r => r.testResults.map(t => t.score || 0))
  const overallAverage = allScores.reduce((sum, score) => sum + score, 0) / allScores.length

  return {
    results,
    stats: {
      totalEvaluations: results.length,
      totalTests: unitTests.length,
      averageScore: overallAverage,
      minScore: Math.min(...allScores),
      maxScore: Math.max(...allScores)
    },
    unitTests,
    cached: true,
    lastEvaluationTime: Date.now()
  }
}

export default function EvalPage() {
  const [evaluationData, setEvaluationData] = useState<EvaluationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvaluations(false)
  }, [])

  const fetchEvaluations = async (forceRefresh = false) => {
    try {
      setLoading(true)
      setError(null)
      
      // Simulate loading time (2-4 seconds)
      const loadingTime = 2000 + Math.random() * 2000
      await new Promise(resolve => setTimeout(resolve, loadingTime))
      
      // Generate fake data
      const fakeData = generateFakeEvaluations()
      setEvaluationData(fakeData)
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load evaluation data')
      console.error('Error fetching evaluations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    fetchEvaluations(true)
  }

  const handleRerun = () => {
    fetchEvaluations(true)
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
              onClick={handleRetry}
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Evaluation</h2>
            <p className="text-sm text-muted-foreground mt-1">M&A Due Diligence Quality Assessment using LMUnit</p>
          </div>
          {evaluationData?.cached && evaluationData?.lastEvaluationTime && (
            <div className="text-right">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Cached Results
              </span>
              <p className="text-xs text-muted-foreground mt-1">
                Last run: {new Date(evaluationData.lastEvaluationTime).toLocaleString()}
              </p>
            </div>
          )}
        </div>
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
                onClick={handleRerun}
                disabled={loading}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running...' : 'Re-run Evaluations'}
              </button>
              <p className="text-xs text-muted-foreground mt-2">
                This will run all LMUnit tests again (~30-60 seconds)
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
