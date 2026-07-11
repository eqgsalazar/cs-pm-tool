import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CS PM Tool',
  description: 'AI-powered project monitoring for construction, engineering, and architectural design',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900">CS PM Tool</h1>
            <span className="text-sm text-gray-500">
              Construction & Engineering Project Monitor
            </span>
          </div>
        </nav>
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}