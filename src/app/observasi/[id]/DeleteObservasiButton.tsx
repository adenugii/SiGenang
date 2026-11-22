'use client'

import { useTransition } from 'react'
import { deleteObservation } from '@/app/actions'

export default function DeleteObservasiButton({ id, locationId }: { id: string; locationId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Yakin ingin menghapus data observasi ini? Data yang dihapus tidak dapat dikembalikan.')) return
    startTransition(async () => {
      await deleteObservation(id, locationId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-sm font-semibold border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-300 px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-xs"
    >
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {isPending ? 'Menghapus...' : 'Hapus Observasi'}
    </button>
  )
}
