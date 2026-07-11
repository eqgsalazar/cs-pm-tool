# CS PM Tool

> AI-powered project monitoring for construction, engineering, and architectural design firms.

**Live app:** [URL will be added after deployment]

## What It Does

CS PM Tool lets project managers paste their project updates and instantly get an AI-generated status summary including:

- 🟢🟡🔴 **RAG status** (Red / Amber / Green) for each project
- ⚠️ **Key risks and blockers** extracted from your updates
- ✅ **Action items with named owners and due dates**
- 📝 **Summary narrative** for use in standups and reports

## Tech Stack

- **Frontend:** Next.js 14 + Tailwind CSS
- **AI:** Gemini 3.5 Flash API
- **Database:** Supabase
- **Deploy:** Vercel + GitHub Actions

## Getting Started

1. Clone the repo and install dependencies:
```bash
git clone https://github.com/eqgsalazar/cs-pm-tool.git
cd cs-pm-tool
npm install
```

2. Create a `.env.local` file with your keys:
NEXT_PUBLIC_SUPABASE_URL=https://rgtlzdboaekppzpitjir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJndGx6ZGJvYWVrcHB6cGl0amlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NTAxODEsImV4cCI6MjA5OTMyNjE4MX0.mkmH306diaBJYr1NZwQVEWWmDzcMt9VnSSalevsjZUI
GEMINI_API_KEY=AIzaSyARyyOf095d5-ltI8uikugDUkJdjkds0-M

3. Run locally:
```bash
npm run dev
```

## Running Tests
```bash
npm test
```

## Demo

[Link to demo video — add after recording]

## Reflection

[Link to reflection — add before submission]