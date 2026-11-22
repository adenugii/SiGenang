'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { requireAdmin } from '@/lib/auth'

// ─── Locations ───────────────────────────────────────────────────────────────

export async function createLocation(formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const kelurahan_id = parseInt(formData.get('kelurahan_id') as string)
  const latitude = parseFloat(formData.get('latitude') as string)
  const longitude = parseFloat(formData.get('longitude') as string)
  const source_type = formData.get('source_type') as string
  const verification_status = formData.get('verification_status') as string
  const notes = (formData.get('notes') as string) || null

  if (!name || !address || !kelurahan_id || isNaN(latitude) || isNaN(longitude) || !source_type) {
    throw new Error('Data tidak lengkap. Mohon isi semua field yang wajib.')
  }

  const { data, error } = await supabase
    .from('locations')
    .insert({
      name,
      address,
      kelurahan_id,
      latitude,
      longitude,
      source_type,
      verification_status: verification_status || 'unverified',
      notes,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Gagal menyimpan lokasi: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/lokasi')
  revalidatePath('/peta')
  redirect(`/lokasi/${data.id}`)
}

export async function updateLocation(id: string, formData: FormData) {
  await requireAdmin()

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const kelurahan_id = parseInt(formData.get('kelurahan_id') as string)
  const latitude = parseFloat(formData.get('latitude') as string)
  const longitude = parseFloat(formData.get('longitude') as string)
  const source_type = formData.get('source_type') as string
  const verification_status = formData.get('verification_status') as string
  const notes = (formData.get('notes') as string) || null

  const { error } = await supabase
    .from('locations')
    .update({
      name,
      address,
      kelurahan_id,
      latitude,
      longitude,
      source_type,
      verification_status,
      notes,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) {
    throw new Error(`Gagal memperbarui lokasi: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/lokasi')
  revalidatePath(`/lokasi/${id}`)
  revalidatePath('/peta')
  redirect(`/lokasi/${id}`)
}

export async function deleteLocation(id: string) {
  await requireAdmin()

  const { error } = await supabase.from('locations').delete().eq('id', id)

  if (error) {
    throw new Error(`Gagal menghapus lokasi: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/lokasi')
  revalidatePath('/peta')
  redirect('/lokasi')
}

// ─── Observations ─────────────────────────────────────────────────────────────

export async function createObservation(formData: FormData) {
  await requireAdmin()

  const location_id = formData.get('location_id') as string
  const observed_at = formData.get('observed_at') as string
  const flood_history = (formData.get('flood_history') as string) || null
  const water_depth_cm_raw = formData.get('water_depth_cm') as string
  const water_depth_cm = water_depth_cm_raw ? parseInt(water_depth_cm_raw) : null
  const drainage_condition = formData.get('drainage_condition') as string
  const sedimentation_level = formData.get('sedimentation_level') as string
  const water_flow = formData.get('water_flow') as string
  const channel_narrowing = formData.get('channel_narrowing') as string
  const notes = (formData.get('notes') as string) || null

  if (!location_id || !observed_at) {
    throw new Error('Lokasi dan tanggal observasi wajib diisi.')
  }

  const { data, error } = await supabase
    .from('observations')
    .insert({
      location_id,
      observed_at,
      flood_history,
      water_depth_cm,
      drainage_condition: drainage_condition || 'unknown',
      sedimentation_level: sedimentation_level || 'unknown',
      water_flow: water_flow || 'unknown',
      channel_narrowing: channel_narrowing || 'unknown',
      notes,
    })
    .select('id')
    .single()

  if (error) {
    throw new Error(`Gagal menyimpan observasi: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/observasi')
  revalidatePath(`/lokasi/${location_id}`)
  redirect(`/observasi/${data.id}`)
}

export async function deleteObservation(id: string, locationId: string) {
  await requireAdmin()

  const { error } = await supabase.from('observations').delete().eq('id', id)

  if (error) {
    throw new Error(`Gagal menghapus observasi: ${error.message}`)
  }

  revalidatePath('/')
  revalidatePath('/observasi')
  revalidatePath(`/lokasi/${locationId}`)
  redirect(`/lokasi/${locationId}`)
}
