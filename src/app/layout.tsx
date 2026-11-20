import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import './globals.css'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'SiGenang Malang | Sistem Pemetaan Titik Genangan Lowokwaru',
  description:
    'Sistem Informasi Genangan Malang – pemetaan interaktif, monitoring drainase, dan pendokumentasian bukti observasi lapangan di Kecamatan Lowokwaru, Kota Malang.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${fontSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-500 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="bg-white border-t border-slate-200/80 py-6 text-slate-500 text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5 text-slate-600 font-medium">
              <div className="relative w-5 h-5 flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="SiGenang Logo"
                  fill
                  sizes="20px"
                  className="object-contain"
                />
              </div>
              <span>SiGenang Malang · Wilayah Cakupan 12 Kelurahan Kecamatan Lowokwaru</span>
            </div>
            <p className="text-slate-400">
              Proyek Inisiatif Smart City · Pemetaan & Verifikasi Lapangan Drainase
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
