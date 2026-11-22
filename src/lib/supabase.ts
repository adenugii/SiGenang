import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client publik (anon) — untuk komponen & halaman publik
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client — HANYA digunakan di server-side (Server Actions, Route Handlers)
// Menggunakan service_role key sehingga bypass RLS (hanya untuk operasi tulis admin)
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY tidak ditemukan di environment variables.')
  }
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  })
}
