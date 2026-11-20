'use client'

import { useTransition } from 'react'
import { deleteObservation } from '@/app/actions'

export default function DeleteObservasiButton({ id, locationId }: { id: string; locationId: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Yakin ingin menghapus observasi ini?')) return
    startTransition(async () => {
      await deleteObservation(id, locationId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Menghapus...' : 'Hapus Observasi'}
    </button>
  )
}
