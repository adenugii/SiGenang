'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'
import { AUTH_COOKIE } from '@/lib/auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export type LoginState = {
  error?: string
} | null

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' }
  }

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  })

  const { data, error } = await client.auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    return { error: 'Email atau password salah. Silakan coba lagi.' }
  }

  const cookieStore = await cookies()
  cookieStore.set(AUTH_COOKIE, JSON.stringify({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 hari
    path: '/',
  })

  redirect('/')
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE)
  redirect('/')
}
