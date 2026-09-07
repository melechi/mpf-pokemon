import { useState } from 'react'
import { useSetAtom } from 'jotai'
import { createGroupAtom } from '@/state/collections'

/**
 * Create a new group by name. Colour is assigned automatically (no picker).
 * Empty / whitespace-only names are rejected with inline validation; the name
 * is trimmed before saving.
 */
function CreateGroupForm() {
  const createGroup = useSetAtom(createGroupAtom)
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed === '') {
      setError('Please enter a group name.')
      return
    }
    createGroup(trimmed)
    setName('')
    setError(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-1" noValidate>
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor="new-group-name" className="sr-only">
            New group name
          </label>
          <input
            id="new-group-name"
            type="text"
            value={name}
            placeholder="New group name…"
            aria-invalid={error !== null}
            aria-describedby={error ? 'new-group-error' : undefined}
            onChange={(e) => {
              setName(e.target.value)
              if (error) setError(null)
            }}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 placeholder:text-slate-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/40 aria-[invalid=true]:border-red-400"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          Create
        </button>
      </div>
      {error && (
        <p id="new-group-error" role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </form>
  )
}

export default CreateGroupForm
