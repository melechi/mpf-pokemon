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
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-2.5 rounded-3xl bg-white p-4 shadow-[0_2px_0_rgba(43,42,51,.06)]"
    >
      <b className="font-display text-lg font-bold text-ink">
        Make a new group
      </b>
      <label htmlFor="new-group-name" className="sr-only">
        New group name
      </label>
      <input
        id="new-group-name"
        type="text"
        value={name}
        placeholder="Team name…"
        aria-invalid={error !== null}
        aria-describedby={error ? 'new-group-error' : undefined}
        onChange={(e) => {
          setName(e.target.value)
          if (error) setError(null)
        }}
        className="min-h-12 rounded-2xl border-2 border-line bg-[#FFFDF7] px-4 text-base font-semibold text-ink outline-none placeholder:text-stone-500 focus-visible:border-berry focus-visible:ring-4 focus-visible:ring-berry/20 aria-[invalid=true]:border-red-500"
      />
      {error && (
        <p
          id="new-group-error"
          role="alert"
          className="text-sm font-bold text-red-700"
        >
          {error}
        </p>
      )}
      <button
        type="submit"
        className="min-h-12 rounded-2xl bg-berry font-extrabold text-white shadow-[0_3px_0_#A62622] transition active:translate-y-[3px] active:shadow-none focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-berry/35"
      >
        Create group
      </button>
    </form>
  )
}

export default CreateGroupForm
