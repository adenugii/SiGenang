'use server'

import { revalidatePath } from 'next/cache'
import { supabase } from '@/lib/supabase'

export type LaporanFormState = {
  success: boolean
  message: string
  locationId?: string
} | null

/**
 * Server action untuk pelaporan publik (tanpa login).
 * - Hanya bisa insert dengan source_type = 'community_report'
 * - verification_status selalu 'unverified'
 * - Menggunakan anon client (Supabase RLS harus mengizinkan anon insert community_report)
 * - Upload foto ke folder community-reports/ di bucket observation-photos (opsional)
 *   Supabase Storage policy yang dibutuhkan:
 *   - anon: INSERT ke community-reports/* dalam bucket observation-photos
 *   - anon: SELECT dari bucket observation-photos (untuk public URL)
 */
export async function createPublicReport(
  _prevState: LaporanFormState,
  formData: FormData
): Promise<LaporanFormState> {
  const name = (formData.get('name') as string)?.trim()
  const address = (formData.get('address') as string)?.trim()
  const kelurahan_id_raw = formData.get('kelurahan_id') as string
  const kelurahan_id = kelurahan_id_raw ? parseInt(kelurahan_id_raw) : NaN
  const latitude_raw = formData.get('latitude') as string
  const longitude_raw = formData.get('longitude') as string
  const latitude = latitude_raw ? parseFloat(latitude_raw) : NaN
  const longitude = longitude_raw ? parseFloat(longitude_raw) : NaN
  const notes = (formData.get('notes') as string)?.trim() || null

  // Validasi field wajib
  if (!name || !address) {
    return { success: false, message: 'Nama lokasi dan alamat wajib diisi.' }
  }
  if (isNaN(kelurahan_id) || kelurahan_id <= 0) {
    return { success: false, message: 'Kelurahan wajib dipilih.' }
  }
  if (isNaN(latitude) || isNaN(longitude)) {
    return { success: false, message: 'Koordinat lokasi wajib diisi. Klik pada peta untuk menentukan titik.' }
  }
  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return { success: false, message: 'Koordinat tidak valid.' }
  }

  // Handle upload foto (opsional)
  let photo_url: string | null = null
  const photoFile = formData.get('photo') as File | null

  if (photoFile && photoFile.size > 0 && photoFile.name) {
    // Validasi ukuran (maks 5MB) dan tipe
    if (photoFile.size > 5 * 1024 * 1024) {
      return { success: false, message: 'Ukuran foto maksimal 5MB.' }
    }
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(photoFile.type)) {
      return { success: false, message: 'Format foto harus JPG, PNG, WebP, atau GIF.' }
    }

    const ext = photoFile.name.split('.').pop() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`
    // Simpan di subfolder community-reports/ agar bisa dibedakan & diberi policy terpisah
    const filePath = `community-reports/${fileName}`

    const arrayBuffer = await photoFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { error: uploadError } = await supabase.storage
      .from('observation-photos')
      .upload(filePath, buffer, {
        contentType: photoFile.type || 'image/jpeg',
        upsert: false,
      })

    if (uploadError) {
      console.error('createPublicReport upload error:', uploadError)
      // Jika gagal upload (misal policy belum aktif), lanjutkan tanpa foto
      // agar laporan tetap tersimpan; catat ke log saja
      if (uploadError.message?.toLowerCase().includes('policy') || uploadError.message?.toLowerCase().includes('denied') || uploadError.message?.toLowerCase().includes('not allowed')) {
        return {
          success: false,
          message: 'Gagal mengunggah foto: izin upload belum dikonfigurasi. Coba kirim tanpa foto, atau hubungi pengelola.',
        }
      }
      return { success: false, message: `Gagal mengunggah foto: ${uploadError.message}` }
    }

    const { data: publicUrlData } = supabase.storage
      .from('observation-photos')
      .getPublicUrl(filePath)

    photo_url = publicUrlData.publicUrl
  }

  // Simpan lokasi
  const { data, error } = await supabase
    .from('locations')
    .insert({
      name,
      address,
      kelurahan_id,
      latitude,
      longitude,
      source_type: 'community_report',
      verification_status: 'unverified',
      photo_url,
      notes,
    })
    .select('id')
    .single()

  if (error) {
    console.error('createPublicReport error:', error)
    if (error.code === '42501') {
      return {
        success: false,
        message:
          'Pelaporan publik belum diaktifkan. Silakan hubungi pengelola sistem untuk mengaktifkan izin pelaporan.',
      }
    }
    return { success: false, message: `Gagal menyimpan laporan: ${error.message}` }
  }

  revalidatePath('/')
  revalidatePath('/lokasi')
  revalidatePath('/peta')

  return {
    success: true,
    message: 'Laporan berhasil dikirim! Terima kasih atas kontribusi Anda.',
    locationId: data.id,
  }
}
