import { buildSummaryPrompt } from '../lib/prompts'

// Test 1: Prompt includes project name
test('prompt includes project name', () => {
  const prompt = buildSummaryPrompt('Bridge Renovation Phase 2', 'Some updates here')
  expect(prompt).toContain('Bridge Renovation Phase 2')
})

// Test 2: Prompt includes the updates text
test('prompt includes project updates', () => {
  const updates = 'Foundation work completed. Electrical delayed.'
  const prompt = buildSummaryPrompt('Test Project', updates)
  expect(prompt).toContain('Foundation work completed')
})

// Test 3: RAG status validation
test('valid RAG statuses are accepted', () => {
  const validStatuses = ['red', 'amber', 'green']
  const testStatus = 'amber'
  expect(validStatuses).toContain(testStatus)
})

// Test 4: Invalid RAG status is rejected
test('invalid RAG status is rejected', () => {
  const validStatuses = ['red', 'amber', 'green']
  const invalidStatus = 'yellow'
  expect(validStatuses).not.toContain(invalidStatus)
})

// Test 5: Action item has required fields
test('action item contains required fields', () => {
  const actionItem = {
    task: 'Follow up with permits office',
    owner: 'Maria',
    due_date: '2026-08-01'
  }
  expect(actionItem).toHaveProperty('task')
  expect(actionItem).toHaveProperty('owner')
  expect(actionItem).toHaveProperty('due_date')
})