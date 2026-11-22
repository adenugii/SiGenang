import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const AUTH_COOKIE = 'sb-session'

/**
 * Buat Supabase client dengan token dari cookie.
 * Digunakan di Server Components / Server Actions untuk membaca sesi admin atau menjalankan aksi sebagai authenticated user.
 */
export async function createServerClient() {
  const cookieStore = await cookies()
  const session = cookieStore.get(AUTH_COOKIE)?.value
  let parsedSession: { access_token: string; refresh_token: string } | null = null

  if (session) {
    try {
      parsedSession = JSON.parse(session)
    } catch {
      parsedSession = null
    }
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })

  if (parsedSession?.access_token) {
    await client.auth.setSession({
      access_token: parsedSession.access_token,
      refresh_token: parsedSession.refresh_token,
    })
  }

  return client
}

/**
 * Ambil user dari sesi cookie.
 * Mengembalikan null jika tidak ada sesi atau token tidak valid.
 */
export async function getAdminUser() {
  try {
    const client = await createServerClient()
    const { data: { user }, error } = await client.auth.getUser()
    if (error || !user) return null
    return user
  } catch {
    return null
  }
}

/**
 * Cek apakah sesi admin aktif (boolean).
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getAdminUser()
  return user !== null
}

/**
 * Guard untuk Server Actions — throw error jika bukan admin.
 */
export async function requireAdmin() {
  const user = await getAdminUser()
  if (!user) {
    throw new Error('Akses ditolak. Silakan login sebagai admin terlebih dahulu.')
  }
  return user
}
