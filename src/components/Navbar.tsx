'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { logoutAction } from '@/app/admin/login/actions'

interface NavbarProps {
  isAdmin: boolean
}

export default function Navbar({ isAdmin }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/peta', label: 'Peta GIS' },
    { href: '/lokasi', label: 'Titik Genangan' },
    { href: '/observasi', label: 'Observasi' },
  ]

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/90 border-b border-slate-800 text-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-900 border border-slate-700/80 shadow-md shadow-blue-900/20 flex items-center justify-center overflow-hidden group-hover:border-cyan-500/50 group-hover:scale-105 transition-all duration-200">
              <Image
                src="/logo.png"
                alt="SiGenang Logo"
                fill
                sizes="40px"
                className="object-contain p-1 drop-shadow"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  SiGenang
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  Lowokwaru
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-none">Smart City GIS Genangan</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl transition-all ${
                    active
                      ? 'bg-slate-800 text-cyan-400 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}

            {/* Auth area */}
            {isAdmin ? (
              <div className="ml-2 flex items-center gap-2 pl-2 border-l border-slate-700">
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Admin
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="ml-2 pl-2 border-l border-slate-700">
                <Link
                  href="/admin/login"
                  className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-all"
                >
                  Login Admin
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all"
              aria-label="Toggle Menu"
            >
              {isOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-800/80 bg-slate-900/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-1 shadow-xl">
          {navLinks.map((link) => {
            const active = isActive(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-slate-800 text-cyan-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            )
          })}

          {/* Mobile auth */}
          <div className="pt-2 mt-2 border-t border-slate-800">
            {isAdmin ? (
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                  Mode Admin Aktif
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="text-xs text-slate-400 hover:text-red-400 transition-colors"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                Login Admin
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
