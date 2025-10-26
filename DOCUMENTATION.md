# M&A Agent - Technical Documentation

**Version:** 1.0.0  
**Last Updated:** October 26, 2025  
**Stack:** Next.js 16, TypeScript, Contextual AI Platform

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Core Components](#core-components)
4. [API Reference](#api-reference)
5. [Data Flow](#data-flow)
6. [RAG Pipeline](#rag-pipeline)
7. [Evaluation System](#evaluation-system)
8. [Environment Configuration](#environment-configuration)
9. [Deployment](#deployment)
10. [Troubleshooting](#troubleshooting)

---

## System Overview

### Purpose

The M&A Agent is an AI-powered due diligence assistant that analyzes merger and acquisition documents using advanced RAG (Retrieval-Augmented Generation) techniques. It helps analysts quickly extract insights from complex financial, legal, and regulatory documents.

### Key Features

- **Intelligent Chat Interface:** Natural language queries answered with grounded AI responses
- **Document Analysis:** Processes 10-K filings, merger agreements, and industry reports
- **Quality Evaluation:** LMUnit-powered assessment of response quality
- **Contextual Grounding:** All responses cite specific sources with page numbers
- **Real-time Processing:** Instant responses with server-side caching

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16 (App Router), React 19, TypeScript |
| **Styling** | Tailwind CSS 4, Radix UI components |
| **Backend** | Next.js API Routes (serverless) |
| **AI Platform** | Contextual AI (Parser, Reranker, GLM, LMUnit) |
| **Deployment** | Vercel (recommended), or any Node.js host |

---

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Dashboard   │  │  Chat UI     │  │  Eval Page   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Next.js API Routes                            │
│  ┌──────────────────────┐  ┌──────────────────────┐            │
│  │   /api/chat          │  │   /api/evaluate      │            │
│  │  - Query agent       │  │  - Run LMUnit tests  │            │
│  │  - Stream response   │  │  - Cache results     │            │
│  └──────────┬───────────┘  └──────────┬───────────┘            │
└─────────────┼──────────────────────────┼─────────────────────────┘
              │                          │
              │ HTTPS (Bearer Token)     │
              ▼                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Contextual AI Platform                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │  Datastore   │  │  RAG Agent   │  │   LMUnit     │         │
│  │  (Documents) │  │  (GLM+Rerank)│  │  (Eval API)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
frontend/
├── app/
│   ├── api/
│   │   ├── chat/route.ts          # Chat endpoint (agent proxy)
│   │   └── evaluate/route.ts      # Evaluation endpoint (LMUnit)
│   ├── layout.tsx                 # Root layout with metadata
│   ├── page.tsx                   # Dashboard page
│   └── globals.css                # Global styles
├── components/
│   ├── chatbot.tsx                # Chat interface component
│   ├── dashboard.tsx              # Document dashboard
│   ├── eval-page.tsx              # Evaluation results page
│   ├── sidebar.tsx                # Navigation sidebar
│   └── ui/                        # Reusable UI components
└── lib/
    └── utils.ts                   # Utility functions
```

### Backend Architecture

The backend uses Next.js API Routes as serverless functions:

- **Stateless:** Each request is independent
- **Server-side:** API keys never exposed to client
- **Cached:** In-memory caching for evaluation results
- **Scalable:** Auto-scales on Vercel

---

## Core Components

### 1. Chat Interface (`components/chatbot.tsx`)

**Purpose:** Real-time conversational interface for querying M&A documents.

**Features:**
- Message history management
- Loading states with animated indicators
- Error handling with user-friendly messages
- Auto-scroll to latest message
- Enter key to send (Shift+Enter for new line)

**API Integration:**
```typescript
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: userInput })
})

const data = await response.json()
const assistantMessage = data.assistant
```

**State Management:**
```typescript
interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
}
```

### 2. Evaluation Page (`components/eval-page.tsx`)

**Purpose:** Display LMUnit quality assessment results for M&A agent responses.

**Features:**
- Cached results (instant load after first run)
- Overall statistics dashboard
- Detailed per-query breakdowns
- Visual progress bars for test scores
- Manual re-run capability

**Data Flow:**
```typescript
useEffect(() => {
  // Load cached results on mount
  fetchEvaluations(false)
}, [])

// Force refresh when button clicked
const handleRerun = () => {
  fetchEvaluations(true)
}
```

**Display Sections:**
1. **Statistics Cards:** Overall score, total evaluations, tests, score range
2. **Unit Test Framework:** 8 evaluation criteria
3. **Detailed Results:** Each query with scores and responses
4. **Cache Indicator:** Shows cached status and last run time

### 3. Sidebar Navigation (`components/sidebar.tsx`)

**Purpose:** Application navigation and branding.

**Routes:**
- **Document:** Dashboard with document cards
- **Enquire:** Chat interface
- **Eval:** Evaluation results
- **Logs:** (Placeholder for future implementation)

---

## API Reference

### POST `/api/chat`

**Purpose:** Send user query to M&A agent and receive AI-generated response.

**Request:**
```json
{
  "message": "What was Seagen's total revenue in 2022?"
}
```

**Response:**
```json
{
  "assistant": "Based on my analysis of the financial data, I can provide a clear answer about Seagen's 2022 revenue with high confidence...\n\nAccording to the unaudited supplemental pro forma information in Pfizer's 10-K filing, Seagen's revenues for the year ended December 31, 2022 were $65,986 million.[1]..."
}
```

**Error Response:**
```json
{
  "error": "Server configuration error: missing CONTEXTUAL_API_KEY"
}
```

**Implementation:**
```typescript
// Server-side proxy to Contextual AI
const res = await fetch(
  `https://api.contextual.ai/v1/agents/${agentId}/query`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: message }]
    })
  }
)
```

**Security:**
- API key stored server-side only (`process.env.CONTEXTUAL_API_KEY`)
- Never exposed to browser
- HTTPS enforced in production

### GET `/api/evaluate`

**Purpose:** Run or retrieve LMUnit evaluation results.

**Query Parameters:**
- `refresh=true` - Force new evaluation (optional)

**Request:**
```bash
# Get cached results (instant)
GET /api/evaluate

# Force new evaluation (~30-60 seconds)
GET /api/evaluate?refresh=true
```

**Response:**
```json
{
  "cached": true,
  "lastEvaluationTime": 1761444507761,
  "stats": {
    "totalEvaluations": 5,
    "totalTests": 8,
    "averageScore": 4.2,
    "minScore": 3.5,
    "maxScore": 4.8
  },
  "results": [
    {
      "prompt": "What was Seagen's total revenue...",
      "response": "Seagen's total revenue for 2022...",
      "averageScore": 4.5,
      "testResults": [
        {
          "test": "Does the response accurately identify...",
          "score": 4.7
        }
      ]
    }
  ],
  "unitTests": [
    "Does the response accurately identify all material risks...",
    "Are all financial and risk-related figures precisely traced..."
  ]
}
```

**Caching Strategy:**

```typescript
// In-memory cache
let cachedResults: any = null
let lastEvaluationTime: number | null = null

// Return cached if available and not forcing refresh
if (cachedResults && !forceRefresh) {
  return { ...cachedResults, cached: true }
}

// Run evaluations and cache results
cachedResults = results
lastEvaluationTime = Date.now()
```

**Performance:**
- First call: 30-60 seconds (runs all tests)
- Subsequent calls: < 100ms (cached)
- Cache persists until server restart

---

## Data Flow

### Chat Query Flow

```
1. User types query in chatbot.tsx
   └─> "What was Seagen's revenue?"

2. Component sends POST to /api/chat
   └─> fetch('/api/chat', { body: { message } })

3. API route proxies to Contextual AI
   └─> POST https://api.contextual.ai/v1/agents/{id}/query
   └─> Headers: { Authorization: Bearer {key} }
   └─> Body: { messages: [{ role: "user", content }] }

4. Contextual AI processes query
   ├─> Retrieves relevant document chunks
   ├─> Reranks by relevance
   ├─> Generates grounded response with GLM
   └─> Returns response with citations

5. API route extracts assistant message
   └─> response = data.message.content

6. Frontend displays response
   └─> Adds to messages array
   └─> Renders in chat UI
```

### Evaluation Flow

```
1. User visits Eval page
   └─> useEffect triggers fetchEvaluations(false)

2. Frontend checks cache
   └─> GET /api/evaluate (no refresh param)

3. API route checks cache
   ├─> If cached: return immediately
   └─> If not cached: run evaluations

4. Run LMUnit evaluations
   ├─> For each sample (5 total):
   │   └─> For each unit test (8 total):
   │       └─> POST to LMUnit API
   │       └─> Store score
   └─> Calculate statistics

5. Cache results
   └─> cachedResults = results
   └─> lastEvaluationTime = Date.now()

6. Return to frontend
   └─> Display stats, tests, and results

7. Subsequent visits
   └─> Return cached data instantly
```

---

## RAG Pipeline

### Contextual AI RAG Architecture

The M&A Agent uses Contextual AI's enterprise RAG pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│                    Document Ingestion                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  PDF Upload  │→ │    Parser    │→ │  Datastore   │     │
│  │  (10-K, etc) │  │ (VLM+OCR)    │  │  (Indexed)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                    Query Processing                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  User Query  │→ │  Retrieval   │→ │  Reranker    │     │
│  │              │  │  (Top 100)   │  │  (Top 10)    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Response Generation                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  GLM Model   │→ │  Grounding   │→ │  Citations   │     │
│  │  (Context)   │  │  (Facts)     │  │  (Sources)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Components Explained

#### 1. Document Parser
- **Technology:** Contextual AI's multimodal parser (VLM + OCR)
- **Capabilities:** Tables, charts, figures, hierarchical structure
- **Output:** Structured markdown with document hierarchy

#### 2. Datastore
- **Purpose:** Indexed document storage
- **Features:** Fast semantic search, metadata filtering
- **Documents:** Pfizer 10-K, Seagen merger agreement, industry analysis

#### 3. Retrieval
- **Method:** Dense vector search (embeddings)
- **Recall:** Top 100 candidates from datastore
- **Speed:** < 100ms for retrieval

#### 4. Reranker (v2)
- **Technology:** Contextual AI's instruction-following reranker
- **Input:** Query + 100 candidates
- **Output:** Top 10 most relevant chunks
- **Instruction Example:** "Prioritize formal SEC filings over analyst reports"

#### 5. Grounded Language Model (GLM)
- **Purpose:** Generate responses grounded in retrieved context
- **Key Feature:** Minimizes hallucinations
- **Output:** Response with citations (e.g., [1], [2])

---

## Evaluation System

### LMUnit Framework

**Purpose:** Assess quality of M&A agent responses using natural language unit tests.

### Unit Tests (8 Criteria)

1. **Material Risk Identification**
   - Test: "Does the response accurately identify all material risks disclosed in financial statements, legal contracts, and regulatory filings?"
   - Weight: Critical for due diligence

2. **Source Citation**
   - Test: "Are all financial and risk-related figures precisely traced back to their document sources and cited with page numbers?"
   - Weight: Essential for verification

3. **Regulatory Compliance**
   - Test: "Is regulatory compliance, including pending investigations and antitrust approvals, analyzed and cited based on the merger documents?"
   - Weight: High for M&A deals

4. **Synergy Evaluation**
   - Test: "Does the answer evaluate management's synergy and integration estimates using both historical benchmarks and cited post-merger evidence?"
   - Weight: Important for valuation

5. **Deal Terms Clarity**
   - Test: "Are deal terms—such as termination conditions, breakup fees, or change-of-control provisions—summarized with specific contract references?"
   - Weight: Critical for legal review

6. **Legal Liability Capture**
   - Test: "Does the system capture and cite legal liabilities, pending litigations, and compliance exposures called out in the filings?"
   - Weight: High for risk assessment

7. **Evidence-Based Recommendations**
   - Test: "Are recommendations for go/no-go acquisition and negotiation topics supported by cross-document evidence?"
   - Weight: Critical for decision-making

8. **Risk Matrix Completeness**
   - Test: "Is the generated risk matrix exhaustive, ranking major risks by both probability and impact, and does it justify each score using the source material?"
   - Weight: Essential for comprehensive analysis

### Evaluation Data (5 Sample Queries)

```typescript
const evaluationData = [
  {
    prompt: "What was Seagen's total revenue reported in the 2022 10-K filing?",
    response: "Seagen's total revenue for 2022, as reported in their 10-K, was $1.96 billion..."
  },
  {
    prompt: "What breakup fee is stipulated in the Pfizer–Seagen merger agreement?",
    response: "The agreement specifies a termination (breakup) fee of $1.64 billion..."
  },
  // ... 3 more samples
]
```

### Scoring

- **Range:** 1-5 (continuous)
- **Calculation:** Average across all 8 tests per query
- **Overall:** Average of all query scores

### Caching Behavior

```typescript
// First run: Executes all tests
GET /api/evaluate
// → cached: false, runs 40 API calls (5×8)

// Subsequent loads: Instant
GET /api/evaluate
// → cached: true, returns stored results

// Force refresh
GET /api/evaluate?refresh=true
// → cached: false, re-runs all tests
```

---

## Environment Configuration

### Required Variables

#### Development (`.env.local`)

```bash
# Contextual AI API Key
CONTEXTUAL_API_KEY=key-uRyfZgT-9AkHMBigRnrc7cUO0QN3m3w_HZ2gPUTDx5TP7O-5w

# Agent ID (from Contextual AI dashboard)
AGENT_ID=5d4f0493-bdb5-4bd9-bd28-23dacef6fd6d
```

#### Production (Vercel Environment Variables)

Set these in Vercel Dashboard → Settings → Environment Variables:

| Variable | Value | Environments |
|----------|-------|--------------|
| `CONTEXTUAL_API_KEY` | Your API key | Production, Preview, Development |
| `AGENT_ID` | Your agent ID | Production, Preview, Development |

### Security Best Practices

✅ **DO:**
- Store keys in `.env.local` (ignored by git)
- Use server-side API routes
- Validate environment variables on startup
- Rotate keys regularly

❌ **DON'T:**
- Commit `.env` files to version control
- Use `NEXT_PUBLIC_` prefix for secrets
- Expose keys in client-side code
- Share keys in documentation

### Variable Validation

```typescript
// In API routes
const apiKey = process.env.CONTEXTUAL_API_KEY
const agentId = process.env.AGENT_ID

if (!apiKey) {
  return NextResponse.json(
    { error: 'Missing CONTEXTUAL_API_KEY' },
    { status: 500 }
  )
}

if (!agentId) {
  return NextResponse.json(
    { error: 'Missing AGENT_ID' },
    { status: 500 }
  )
}
```

---

## Deployment

### Vercel Deployment (Recommended)

#### Prerequisites
- GitHub repository with pushed code
- Vercel account (free tier works)
- Environment variables ready

#### Steps

1. **Connect Repository**
   ```
   vercel.com → New Project → Import Git Repository
   → Select: codedbykishore/Group-J
   ```

2. **Configure Build Settings**
   - **Root Directory:** `frontend`
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install --legacy-peer-deps`

3. **Add Environment Variables**
   ```
   Settings → Environment Variables
   → Add: CONTEXTUAL_API_KEY
   → Add: AGENT_ID
   → Apply to: Production, Preview, Development
   ```

4. **Deploy**
   ```
   Click "Deploy" → Wait 2-3 minutes → Live!
   ```

#### Deployment URL
```
https://your-project.vercel.app
```

#### Continuous Deployment

Vercel auto-deploys on git push:
```bash
git add .
git commit -m "Update feature"
git push origin main
# Vercel automatically deploys
```

### Alternative: Docker Deployment

```dockerfile
# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./

ENV NODE_ENV=production
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

```bash
# Build and run
docker build -t ma-agent .
docker run -p 3000:3000 \
  -e CONTEXTUAL_API_KEY=your_key \
  -e AGENT_ID=your_agent_id \
  ma-agent
```

---

## Troubleshooting

### Common Issues

#### 1. Chat Returns "Error: Server configuration error"

**Cause:** Missing environment variables

**Solution:**
```bash
# Check .env.local exists
ls frontend/.env.local

# Verify contents
cat frontend/.env.local
# Should show:
# CONTEXTUAL_API_KEY=key-...
# AGENT_ID=5d4f0493-...

# Restart dev server
cd frontend && npm run dev
```

#### 2. Evaluation Page Shows Error

**Cause:** LMUnit API error or rate limiting

**Solution:**
```bash
# Check server logs
tail -f /tmp/nextjs-dev.log

# Test API directly
curl http://localhost:3001/api/evaluate

# If rate limited, wait 1 minute and retry
```

#### 3. Build Fails with Peer Dependency Error

**Cause:** React 19 vs older package versions

**Solution:**
```bash
# Ensure .npmrc exists
cat frontend/.npmrc
# Should show: legacy-peer-deps=true

# Clean install
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

#### 4. "Port 3000 in use" Warning

**Not an error!** Next.js automatically uses port 3001.

```bash
# Access at:
http://localhost:3001
```

#### 5. Cached Evaluations Not Updating

**Cause:** Server-side cache not cleared

**Solution:**
```bash
# Force refresh via URL
curl 'http://localhost:3001/api/evaluate?refresh=true'

# Or restart server
pkill -f "npm run dev"
cd frontend && npm run dev
```

### Debug Mode

Enable detailed logging:

```typescript
// In API routes
console.log('API Key present:', !!process.env.CONTEXTUAL_API_KEY)
console.log('Agent ID:', process.env.AGENT_ID)
console.log('Request body:', JSON.stringify(body, null, 2))
```

### Health Check Endpoints

```bash
# Test chat API
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'

# Test eval API
curl http://localhost:3001/api/evaluate | jq .cached

# Check frontend
curl -I http://localhost:3001
```

---

## Performance Metrics

### Response Times

| Endpoint | First Call | Cached |
|----------|-----------|--------|
| `/api/chat` | 2-5 seconds | N/A (always fresh) |
| `/api/evaluate` | 30-60 seconds | < 100ms |
| Frontend page load | < 1 second | < 500ms |

### API Usage

| Operation | API Calls |
|-----------|-----------|
| Single chat query | 1 |
| Full evaluation run | 40 (5 samples × 8 tests) |
| Cached evaluation | 0 |

### Optimization Tips

1. **Enable caching** (already implemented)
2. **Limit evaluation samples** in production
3. **Use CDN** for static assets (Vercel does this)
4. **Implement response streaming** for long answers
5. **Add database** for persistent cache

---

## API Rate Limits

### Contextual AI Limits

Check your plan at: https://app.contextual.ai

**Typical limits:**
- **Agent queries:** 1000/day (free tier)
- **LMUnit calls:** 500/day (free tier)
- **Concurrent requests:** 10

**Best practices:**
- Cache evaluation results (✅ implemented)
- Implement exponential backoff
- Monitor usage dashboard

---

## Future Enhancements

### Planned Features

1. **Document Upload**
   - Allow users to upload their own M&A documents
   - Automatic ingestion to Contextual AI datastore

2. **Conversation History**
   - Store chat sessions in database
   - Resume previous conversations

3. **Custom Evaluation Sets**
   - Define custom unit tests per use case
   - A/B test different agent configurations

4. **Advanced Analytics**
   - Track query patterns
   - Response quality over time
   - User satisfaction metrics

5. **Multi-Agent Support**
   - Switch between different specialized agents
   - Compare responses across agents

6. **Export Reports**
   - Generate PDF reports of evaluations
   - Export chat transcripts

---

## Support & Resources

### Documentation
- **Contextual AI:** https://docs.contextual.ai
- **Next.js:** https://nextjs.org/docs
- **Vercel:** https://vercel.com/docs

### Project Files
- **Setup Guide:** `SETUP.md`
- **Deployment Guide:** `DEPLOYMENT.md`
- **Evaluation Methodology:** `EVALUATION.md`
- **Problem Statement:** `PROBLEM_STATEMENT.md`

### Contact
- **Repository:** https://github.com/codedbykishore/Group-J
- **Issues:** https://github.com/codedbykishore/Group-J/issues

---

## Appendix

### Tech Stack Details

| Component | Version | Purpose |
|-----------|---------|---------|
| Next.js | 16.0.0 | Full-stack framework |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.1.9 | Styling |
| Radix UI | Latest | Component primitives |
| Contextual AI | Latest | RAG platform |

### File Structure Reference

```
Group-J/
├── frontend/                    # Next.js application
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts   # Chat API endpoint
│   │   │   └── evaluate/route.ts # Evaluation API endpoint
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Dashboard page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── chatbot.tsx         # Chat interface
│   │   ├── eval-page.tsx       # Evaluation page
│   │   ├── sidebar.tsx         # Navigation
│   │   └── ui/                 # UI components
│   ├── .env.local              # Environment variables (not in git)
│   ├── .npmrc                  # npm configuration
│   ├── next.config.mjs         # Next.js configuration
│   └── package.json            # Dependencies
├── data/                        # Document storage
│   ├── Pfizer_10K_2024.pdf
│   ├── Pfizer_Seagen_Merger_Agreement.pdf
│   └── Pfizer_Seagen_Industry_Analysis.pdf
├── Agentic_RAG.ipynb           # Jupyter notebook (prototype)
├── DOCUMENTATION.md            # This file
├── DEPLOYMENT.md               # Deployment guide
├── SETUP.md                    # Setup instructions
├── EVALUATION.md               # Evaluation methodology
└── README.md                   # Project overview
```

### Glossary

- **RAG:** Retrieval-Augmented Generation
- **GLM:** Grounded Language Model
- **LMUnit:** Language Model Unit Testing
- **M&A:** Mergers & Acquisitions
- **10-K:** Annual financial report filed with SEC
- **Due Diligence:** Investigation before business transaction
- **Datastore:** Indexed document repository
- **Reranker:** Model that scores and ranks retrieved documents

---

**Document Version:** 1.0.0  
**Last Updated:** October 26, 2025  
**Maintained By:** Group J Team
