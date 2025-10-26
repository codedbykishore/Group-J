import { NextResponse } from 'next/server'

// Sample evaluation data from the notebook
const evaluationData = [
  {
    prompt: "What was Seagen's total revenue reported in the 2022 10-K filing?",
    response:
      "Seagen's total revenue for 2022, as reported in their 10-K, was $1.96 billion, reflecting strong year-over-year growth driven by its oncology pipeline.",
  },
  {
    prompt: 'What breakup fee is stipulated in the Pfizer–Seagen merger agreement?',
    response:
      'The agreement specifies a termination (breakup) fee of $1.64 billion payable by Seagen to Pfizer if certain conditions are not met, as detailed in Section 8.3.',
  },
  {
    prompt: "How does Seagen's market share in US oncology compare to top competitors according to recent industry analysis?",
    response:
      'Seagen held an estimated 7% US oncology market share in targeted therapies for 2024, positioning it behind Roche/Genentech and Novartis as outlined in the industry report.',
  },
  {
    prompt: 'Summarize the key regulatory risks highlighted for this acquisition.',
    response:
      'Key regulatory risks include ongoing FTC antitrust review due to market concentration and FDA inspection delays for lead product BLA approval, both cited in recent filings.',
  },
  {
    prompt: 'What synergy savings are projected by Pfizer management versus industry benchmarks for similar oncology M&A?',
    response:
      'Pfizer projects $1.2 billion in annual synergies by 2027, which is modestly above the oncology M&A average according to McKinsey industry studies.',
  },
]

// Unit tests for evaluation
const unitTests = [
  'Does the response accurately identify all material risks disclosed in financial statements, legal contracts, and regulatory filings?',
  'Are all financial and risk-related figures precisely traced back to their document sources and cited with page numbers?',
  'Is regulatory compliance, including pending investigations and antitrust approvals, analyzed and cited based on the merger documents?',
  "Does the answer evaluate management's synergy and integration estimates using both historical benchmarks and cited post-merger evidence?",
  'Are deal terms—such as termination conditions, breakup fees, or change-of-control provisions—summarized with specific contract references?',
  'Does the system capture and cite legal liabilities, pending litigations, and compliance exposures called out in the filings?',
  'Are recommendations for go/no-go acquisition and negotiation topics supported by cross-document evidence?',
  'Is the generated risk matrix exhaustive, ranking major risks by both probability and impact, and does it justify each score using the source material?',
]

export async function GET() {
  try {
    const apiKey = process.env.CONTEXTUAL_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error: missing CONTEXTUAL_API_KEY' }, { status: 500 })
    }

    const API_URL = 'https://api.contextual.ai/v1/lmunit'

    // Run evaluations for each sample
    const results = []

    for (const sample of evaluationData) {
      const testResults = []

      // Run each unit test for this sample
      for (const test of unitTests) {
        try {
          const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              query: sample.prompt,
              response: sample.response,
              unit_test: test,
            }),
          })

          if (!res.ok) {
            console.error(`LMUnit API error: ${res.status}`)
            testResults.push({
              test,
              score: null,
              error: `API error: ${res.status}`,
            })
            continue
          }

          const data = await res.json()
          testResults.push({
            test,
            score: data.score || 0,
          })
        } catch (err: any) {
          console.error(`Error evaluating test "${test}":`, err)
          testResults.push({
            test,
            score: null,
            error: err?.message ?? String(err),
          })
        }
      }

      // Calculate average score for this sample
      const validScores = testResults.filter((r) => r.score !== null).map((r) => r.score!)
      const avgScore = validScores.length > 0 ? validScores.reduce((a, b) => a + b, 0) / validScores.length : 0

      results.push({
        prompt: sample.prompt,
        response: sample.response,
        testResults,
        averageScore: avgScore,
      })
    }

    // Calculate overall statistics
    const allScores = results.flatMap((r) => r.testResults.filter((t) => t.score !== null).map((t) => t.score!))

    const overallStats = {
      totalEvaluations: results.length,
      totalTests: unitTests.length,
      averageScore: allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0,
      minScore: allScores.length > 0 ? Math.min(...allScores) : 0,
      maxScore: allScores.length > 0 ? Math.max(...allScores) : 0,
    }

    return NextResponse.json({
      results,
      stats: overallStats,
      unitTests,
    })
  } catch (err: any) {
    console.error('Evaluation error:', err)
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
