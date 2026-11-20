'use client'

import { useTransition } from 'react'
import { deleteLocation } from '@/app/actions'

export default function DeleteLocationButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm('Yakin ingin menghapus lokasi ini? Semua observasi terkait akan ikut terhapus.')) return
    startTransition(async () => {
      await deleteLocation(id)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="text-sm border border-red-300 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? 'Menghapus...' : 'Hapus Lokasi'}
    </button>
  )
}
