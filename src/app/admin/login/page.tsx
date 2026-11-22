'use client'

import { useActionState } from 'react'
import { loginAction } from './actions'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [state, action, isPending] = useActionState(loginAction, null)

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700 shadow-lg mb-4">
            <div className="relative w-10 h-10">
              <Image src="/logo.png" alt="SiGenang Logo" fill className="object-contain p-1" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Login Admin</h1>
          <p className="text-sm text-slate-500 mt-1">SiGenang Malang – Panel Pengelola Data</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          {state?.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center gap-2">
              <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {state.error}
            </div>
          )}

          <form action={action} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="admin@example.com"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm shadow-blue-500/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-5">
          <Link href="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {/* Info */}
        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-500 text-center">
          Akun Admin dibuat oleh pengelola sistem melalui Supabase Dashboard.<br />
          Tidak ada registrasi publik.
        </div>
      </div>
    </div>
  )
}
