export type SourceType = 'secondary' | 'field_observation' | 'community_report'
export type VerificationStatus = 'unverified' | 'verified' | 'needs_follow_up'
export type DrainageCondition = 'good' | 'problematic' | 'unknown'
export type SedimentationLevel = 'low' | 'medium' | 'high' | 'unknown'
export type WaterFlow = 'smooth' | 'not_smooth' | 'unknown'
export type ChannelNarrowing = 'yes' | 'no' | 'unknown'

export interface Kelurahan {
  id: number
  name: string
  created_at: string
}

export interface Location {
  id: string
  name: string
  address: string
  kelurahan_id: number
  latitude: number
  longitude: number
  source_type: SourceType
  verification_status: VerificationStatus
  notes: string | null
  created_at: string
  updated_at: string
}

export interface LocationWithKelurahan extends Location {
  kelurahan: Kelurahan
}

export interface Observation {
  id: string
  location_id: string
  observed_at: string
  flood_history: string | null
  water_depth_cm: number | null
  drainage_condition: DrainageCondition
  sedimentation_level: SedimentationLevel
  water_flow: WaterFlow
  channel_narrowing: ChannelNarrowing
  photo_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ObservationWithLocation extends Observation {
  location: Location
}

// Label maps in Indonesian
export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  secondary: 'Data Sekunder',
  field_observation: 'Observasi Lapangan',
  community_report: 'Laporan Masyarakat',
}

export const VERIFICATION_STATUS_LABELS: Record<VerificationStatus, string> = {
  unverified: 'Belum Diperiksa',
  verified: 'Sudah Diperiksa',
  needs_follow_up: 'Perlu Pemeriksaan Lanjutan',
}

export const VERIFICATION_STATUS_COLORS: Record<VerificationStatus, string> = {
  unverified: 'bg-gray-100 text-gray-700',
  verified: 'bg-green-100 text-green-700',
  needs_follow_up: 'bg-yellow-100 text-yellow-700',
}

export const DRAINAGE_CONDITION_LABELS: Record<DrainageCondition, string> = {
  good: 'Baik',
  problematic: 'Bermasalah',
  unknown: 'Tidak Diketahui',
}

export const SEDIMENTATION_LEVEL_LABELS: Record<SedimentationLevel, string> = {
  low: 'Rendah',
  medium: 'Sedang',
  high: 'Tinggi',
  unknown: 'Tidak Diketahui',
}

export const WATER_FLOW_LABELS: Record<WaterFlow, string> = {
  smooth: 'Lancar',
  not_smooth: 'Tidak Lancar',
  unknown: 'Tidak Diketahui',
}

export const CHANNEL_NARROWING_LABELS: Record<ChannelNarrowing, string> = {
  yes: 'Ya',
  no: 'Tidak',
  unknown: 'Tidak Diketahui',
}
