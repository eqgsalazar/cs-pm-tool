'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

interface Project {
  id: string
  name: string
  description: string
  created_at: string
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  async function fetchProjects() {
    setLoading(true)
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  async function createProject() {
    if (!newName.trim()) return
    setSaving(true)
    await supabase.from('projects').insert({
      name: newName.trim(),
      description: newDescription.trim(),
    })
    setNewName('')
    setNewDescription('')
    setShowForm(false)
    setSaving(false)
    fetchProjects()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-500 mt-1">
            Monitor your active projects with AI-powered summaries
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Project
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4">Create New Project</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Bridge Renovation Phase 2"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Brief description of the project"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={createProject}
                disabled={saving || !newName.trim()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {saving ? 'Creating...' : 'Create Project'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading projects...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <p className="text-gray-500 text-lg">No projects yet</p>
          <p className="text-gray-400 text-sm mt-1">
            Click "+ New Project" to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition block"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="text-gray-500 text-sm mt-1">
                      {project.description}
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-2">
                    Created {new Date(project.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-blue-600 text-sm font-medium">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}