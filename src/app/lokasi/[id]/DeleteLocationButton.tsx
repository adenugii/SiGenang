'use client'

import { useState, useTransition } from 'react'
import { deleteLocation } from '@/app/actions'
import ConfirmModal from '@/components/ui/ConfirmModal'

export default function DeleteLocationButton({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    setErrorMessage(null)
    startTransition(async () => {
      try {
        await deleteLocation(id)
      } catch (e: unknown) {
        setErrorMessage(e instanceof Error ? e.message : 'Gagal menghapus lokasi.')
        setIsOpen(false)
      }
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        disabled={isPending}
        className="inline-flex items-center gap-1.5 text-sm font-semibold border border-rose-200 text-rose-600 bg-rose-50/50 hover:bg-rose-100 hover:border-rose-300 px-4 py-2 rounded-xl transition-all disabled:opacity-50 shadow-xs cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span>{isPending ? 'Menghapus...' : 'Hapus Lokasi'}</span>
      </button>

      {errorMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 text-sm animate-in fade-in slide-in-from-bottom-2">
          <svg className="w-4 h-4 text-rose-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-2 text-rose-400 hover:text-rose-600"
          >
            ✕
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        title="Hapus Titik Lokasi"
        message="Yakin ingin menghapus titik lokasi ini? Semua data hasil observasi lapangan terkait lokasi ini juga akan ikut terhapus secara permanen."
        confirmText="Ya, Hapus Lokasi"
        cancelText="Batal"
        isPending={isPending}
        onConfirm={handleConfirm}
        onCancel={() => setIsOpen(false)}
      />
    </>
  )
}
