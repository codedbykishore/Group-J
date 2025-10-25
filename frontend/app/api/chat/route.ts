import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const message: string = body?.message

    if (!message) {
      return NextResponse.json({ error: 'Missing `message` in request body' }, { status: 400 })
    }

    const apiKey = process.env.CONTEXTUAL_API_KEY
    const agentId = process.env.AGENT_ID

    if (!apiKey) {
      return NextResponse.json({ error: 'Server configuration error: missing CONTEXTUAL_API_KEY' }, { status: 500 })
    }

    if (!agentId) {
      return NextResponse.json({ error: 'Server configuration error: missing AGENT_ID' }, { status: 500 })
    }

    const API_URL = `https://api.contextual.ai/v1/agents/${agentId}/query`

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: message,
          },
        ],
      }),
    })

    if (!res.ok) {
      const text = await res.text()
      return NextResponse.json({ error: `Upstream API error: ${res.status} ${text}` }, { status: res.status })
    }

    const data = await res.json()
    const assistant = data?.message?.content ?? null

    return NextResponse.json({ assistant })
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 })
  }
}
