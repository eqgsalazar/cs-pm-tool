export function buildSummaryPrompt(projectName: string, updates: string): string {
    return `You are a project management assistant for construction, engineering, and architectural design firms.
  
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
  }