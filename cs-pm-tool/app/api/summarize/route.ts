import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: NextRequest) {
  try {
    const { projectName, updates } = await req.json()

    if (!projectName || !updates) {
      return NextResponse.json(
        { error: 'projectName and updates are required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const prompt = `You are a project management assistant for construction, engineering, and architectural design firms.

Analyze the following project updates for "${projectName}" and return a structured JSON summary.

Project Updates:
${updates}

Return ONLY a valid JSON object with this exact shape, no markdown, no explanation:
{
  "rag_status": "green",
  "risks": ["risk 1", "risk 2"],
  "action_items": [
    { "task": "task description", "owner": "person name", "due_date": "YYYY-MM-DD" }
  ],
  "summary_narrative": "2-3 sentence summary of overall project health"
}

RAG status rules:
- green: on track, no major issues
- amber: minor delays or risks, needs monitoring
- red: significant blockers, behind schedule, or critical risks`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return NextResponse.json(parsed)
  } catch (err) {
    console.error('Summarize error:', err)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}