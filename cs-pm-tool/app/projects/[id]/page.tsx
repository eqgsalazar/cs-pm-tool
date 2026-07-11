'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'


interface Project {
  id: string
  name: string
  description: string
  created_at: string
}

interface ActionItem {
  task: string
  owner: string
  due_date: string
}

interface Summary {
  id: string
  rag_status: 'red' | 'amber' | 'green'
  risks: string[]
  action_items: ActionItem[]
  summary_narrative: string
  created_at: string
}

const RAG_COLORS = {
  green: 'bg-green-100 text-green-800 border-green-200',
  amber: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  red: 'bg-red-100 text-red-800 border-red-200',
}

const RAG_LABELS = {
  green: '🟢 On Track',
  amber: '🟡 Needs Attention',
  red: '🔴 At Risk',
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [project, setProject] = useState<Project | null>(null)
  const [summaries, setSummaries] = useState<Summary[]>([])
  const [updates, setUpdates] = useState('')
  const [generating, setGenerating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchProject()
    fetchSummaries()
  }, [projectId])

  async function fetchProject() {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single()
    setProject(data)
    setLoading(false)
  }

  async function fetchSummaries() {
    const { data } = await supabase
      .from('summaries')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false })
    setSummaries(data || [])
  }

  async function handleGenerateSummary() {
    if (!updates.trim()) {
      setError('Please paste your project updates before generating a summary.')
      return
    }
    setError('')
    setGenerating(true)
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectName: project!.name,
          updates: updates,
        }),
      })
  
      if (!response.ok) throw new Error('API call failed')
  
      const result = await response.json()
  
      await supabase.from('summaries').insert({
        project_id: projectId,
        rag_status: result.rag_status,
        risks: result.risks,
        action_items: result.action_items,
        summary_narrative: result.summary_narrative,
      })
      setUpdates('')
      fetchSummaries()
    } catch (err) {
      setError('Failed to generate summary. Please try again.')
      console.error(err)
    }
    setGenerating(false)
  }

  async function handleDeleteProject() {
    if (!confirm('Are you sure you want to delete this project?')) return
    await supabase.from('projects').delete().eq('id', projectId)
    router.push('/')
  }

  if (loading) {
    return <div className="text-center py-16 text-gray-400">Loading project...</div>
  }

  if (!project) {
    return <div className="text-center py-16 text-gray-400">Project not found.</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-blue-600 hover:underline mb-2 block"
          >
            ← Back to Projects
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
          {project.description && (
            <p className="text-gray-500 mt-1">{project.description}</p>
          )}
        </div>
        <button
          onClick={handleDeleteProject}
          className="text-sm text-red-500 hover:text-red-700 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition"
        >
          Delete Project
        </button>
      </div>

      {/* Input section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-8">
        <h3 className="font-semibold text-gray-900 mb-1">
          Generate AI Summary
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste your project updates below — emails, meeting notes, status
          reports, anything. The AI will analyze and summarize them.
        </p>
        <textarea
          value={updates}
          onChange={(e) => setUpdates(e.target.value)}
          placeholder="Paste your project updates here...

Example:
- Foundation work completed on Block A. Waiting for inspection sign-off.
- Electrical contractor delayed by 2 weeks due to material shortage.
- Maria to follow up with city permits office by Friday.
- Budget currently 5% over due to material cost increases."
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={8}
        />
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        <button
          onClick={handleGenerateSummary}
          disabled={generating || !updates.trim()}
          className="mt-3 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition font-medium"
        >
          {generating ? '⏳ Generating summary...' : '✨ Generate AI Summary'}
        </button>
      </div>

      {/* Summaries */}
      <div>
        <h3 className="font-semibold text-gray-900 mb-4">
          Summary History ({summaries.length})
        </h3>

        {summaries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-400">No summaries yet.</p>
            <p className="text-gray-400 text-sm mt-1">
              Paste your project updates above and click Generate.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {summaries.map((summary) => (
              <div
                key={summary.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm"
              >
                {/* RAG Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${RAG_COLORS[summary.rag_status]}`}
                  >
                    {RAG_LABELS[summary.rag_status]}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(summary.created_at).toLocaleString()}
                  </span>
                </div>

                {/* Narrative */}
                <p className="text-gray-700 text-sm mb-4">
                  {summary.summary_narrative}
                </p>

                {/* Risks */}
                {summary.risks?.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      ⚠️ Risks & Blockers
                    </h4>
                    <ul className="space-y-1">
                      {summary.risks.map((risk, i) => (
                        <li
                          key={i}
                          className="text-sm text-gray-600 flex items-start gap-2"
                        >
                          <span className="text-red-400 mt-0.5">•</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Items */}
                {summary.action_items?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      ✅ Action Items
                    </h4>
                    <div className="space-y-2">
                      {summary.action_items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 text-sm bg-gray-50 rounded-lg px-3 py-2"
                        >
                          <span className="text-blue-500 mt-0.5">→</span>
                          <div className="flex-1">
                            <span className="text-gray-800">{item.task}</span>
                            <div className="flex gap-3 mt-0.5">
                              <span className="text-gray-400 text-xs">
                                👤 {item.owner}
                              </span>
                              {item.due_date && (
                                <span className="text-gray-400 text-xs">
                                  📅 {item.due_date}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}