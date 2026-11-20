# Context Project --- SiGenang Malang

Dokumen ini menjadi sumber konteks utama untuk diskusi, perencanaan, dan
pengembangan aplikasi SiGenang Malang. Gunakan dokumen ini sebagai acuan
agar keputusan desain dan implementasi tetap konsisten. Jika ada
perubahan keputusan dari tim, perbarui bagian terkait dan tandai
keputusan terbaru.

## 1. Ringkasan Proyek

**Nama aplikasi:** SiGenang Malang\
**Kepanjangan:** Sistem Informasi Genangan Malang\
**Jenis aplikasi:** Sistem informasi pemetaan dan analisis genangan\
**Platform:** Web\
**Pendekatan:** Web GIS (Geographic Information System)\
**Wilayah cakupan:** Seluruh Kecamatan Lowokwaru, Kota Malang, Jawa
Timur\
**Status:** Rancangan awal / MVP untuk proyek kelompok Smart City\
**Pengguna awal:** Tim survei/pengelola data. Pihak kecamatan atau
kelurahan dapat menjadi pengguna/pemangku kepentingan berikutnya, tetapi
akses multi-peran belum menjadi kebutuhan MVP.

### Deskripsi singkat

SiGenang Malang adalah aplikasi berbasis web untuk mengumpulkan,
menyimpan, memetakan, dan menyajikan informasi mengenai titik genangan
air serta kondisi drainase di seluruh wilayah Kecamatan Lowokwaru. Data
bersumber dari data sekunder, observasi lapangan, wawancara, dan
kuesioner. Informasi ditampilkan melalui dashboard, peta interaktif,
formulir observasi, dan halaman detail lokasi.

Aplikasi ini membantu proses identifikasi dan analisis permasalahan.
Aplikasi **bukan** sistem prediksi banjir, peringatan dini, pengendalian
banjir, atau pemberi rekomendasi penanganan otomatis.

## 2. Latar Belakang dan Masalah

Informasi tentang genangan dan kondisi drainase dapat tersebar pada
berita, penelitian, dokumen pemerintah, serta keterangan warga. Kondisi
lapangan pada setiap lokasi juga perlu diverifikasi.

Masalah yang ingin dibantu oleh sistem: 1. Informasi lokasi genangan
belum terkumpul dalam satu tempat. 2. Riwayat kejadian genangan perlu
didokumentasikan. 3. Kondisi drainase perlu dicatat secara terstruktur.
4. Informasi seperti tinggi genangan, sedimentasi, kelancaran aliran,
dan penyempitan saluran perlu dicatat jika dapat diamati. 5. Data
sekunder dan hasil pengumpulan data lapangan perlu dibedakan dan
dibandingkan. 6. Informasi perlu dapat ditinjau berdasarkan lokasi dan
kelurahan.

## 3. Tujuan Sistem

1.  Mengumpulkan informasi titik genangan di seluruh Kecamatan
    Lowokwaru.
2.  Memetakan lokasi berdasarkan koordinat geografis.
3.  Mendokumentasikan riwayat genangan dan kondisi drainase.
4.  Menyimpan hasil observasi beserta foto dan catatan.
5.  Menyediakan filter dan ringkasan informasi per kelurahan.
6.  Mendukung proses identifikasi kondisi dan analisis permasalahan
    berdasarkan bukti yang terkumpul.

## 4. Cakupan Wilayah

Aplikasi mencakup 12 kelurahan di Kecamatan Lowokwaru: 1. Tulusrejo 2.
Lowokwaru 3. Jatimulyo 4. Tunjungsekar 5. Tlogomas 6. Dinoyo 7.
Merjosari 8. Sumbersari 9. Ketawanggede 10. Mojolangu 11. Tasikmadu 12.
Tunggulwulung

Setiap data lokasi wajib dikaitkan dengan kelurahan. Data awal yang
pernah dibahas untuk Tulusrejo antara lain Kedawung RT 01/RW 05,
Bantaran Terusan II, Bantaran IV, Bantaran V, sejumlah ruas Jalan
Cengkeh, dan Jalan Cempaka. Lokasi tersebut hanyalah contoh data awal
dari sumber sekunder/penelitian terdahulu; bukan berarti seluruhnya
sudah diverifikasi atau mewakili seluruh Kecamatan Lowokwaru.

**Prinsip cakupan:** Peta dan sistem mendukung seluruh kecamatan, tetapi
tim tidak wajib mengklaim telah melakukan survei pada seluruh 12
kelurahan. Data yang belum diverifikasi harus diberi label sumber dan
status yang jelas.

## 5. Pengguna dan Batas Akses

### MVP

-   Pengguna utama: anggota tim survei atau pengelola data.
-   Pengguna dapat melihat dashboard dan peta, menambahkan/mengubah data
    lokasi, serta memasukkan hasil observasi.
-   Jika waktu terbatas, aplikasi dapat menggunakan satu akses pengelola
    sederhana atau bahkan tanpa autentikasi untuk demo lokal/terbatas,
    dengan mempertimbangkan keamanan deployment.

### Di luar MVP

-   Akun publik untuk seluruh warga.
-   Multi-role kompleks (admin, operator kelurahan, warga, verifikator).
-   Alur persetujuan laporan masyarakat.
-   Notifikasi WhatsApp atau push notification.

Jangan mengasumsikan data publik boleh diubah oleh semua pengunjung.
Tentukan kontrol akses sebelum aplikasi dipublikasikan.

## 6. Fitur Utama

### 6.1 Dashboard

Menampilkan ringkasan data, misalnya: - Total lokasi tercatat. - Total
observasi. - Jumlah lokasi berdasarkan status pemeriksaan. - Ringkasan
kondisi drainase. - Grafik atau jumlah titik per kelurahan. -
Data/observasi terbaru.

Angka dashboard harus dihitung dari data yang benar-benar tersimpan.
Jangan membuat angka contoh terlihat seperti data faktual.

### 6.2 Peta Genangan

-   Peta interaktif seluruh Kecamatan Lowokwaru.
-   Marker untuk setiap lokasi yang tercatat.
-   Klik marker untuk melihat ringkasan lokasi.
-   Filter berdasarkan kelurahan dan status pemeriksaan.
-   Pencarian nama lokasi/jalan jika memungkinkan.
-   Informasi sumber data dan status verifikasi.

Gunakan Leaflet dengan OpenStreetMap sebagai opsi awal. Perhatikan
ketentuan penggunaan tile OpenStreetMap dan jangan menganggap layanan
tile publik memiliki SLA untuk trafik produksi tinggi.

### 6.3 Data Observasi

Form untuk mencatat pemeriksaan lapangan: - Pilih lokasi yang sudah ada
atau buat lokasi baru. - Tanggal observasi. - Riwayat/kondisi genangan
yang diamati atau dilaporkan. - Tinggi genangan (cm), jika
diketahui/terukur. - Kondisi drainase. - Tingkat sedimentasi. -
Kelancaran aliran air. - Ada/tidaknya penyempitan saluran. - Foto
dokumentasi. - Catatan tambahan.

Bedakan temuan yang diamati langsung dari informasi yang disampaikan
narasumber. Jangan mengisi nilai yang tidak diketahui dengan perkiraan
tanpa label.

### 6.4 Detail Lokasi

Menampilkan: - Nama lokasi dan alamat. - Kelurahan. - Koordinat. -
Sumber data. - Status verifikasi/pemeriksaan. - Riwayat genangan. -
Daftar hasil observasi. - Foto dan catatan. - Waktu pembaruan terakhir.

## 7. Data dan Model Database Awal

Model sederhana yang direkomendasikan terdiri dari tabel `locations` dan
`observations`. Tabel referensi `kelurahan` dapat ditambahkan agar nama
wilayah konsisten.

### 7.1 `kelurahan` (opsional tetapi disarankan)

-   `id`
-   `name`
-   `created_at`

Isi 12 kelurahan Kecamatan Lowokwaru. Pastikan penamaan konsisten.

### 7.2 `locations`

-   `id`
-   `name` --- nama titik/ruas jalan
-   `address` --- alamat atau deskripsi lokasi
-   `kelurahan_id` --- relasi ke kelurahan
-   `latitude`
-   `longitude`
-   `source_type` --- misalnya `secondary`, `field_observation`,
    `community_report`
-   `verification_status` --- misalnya `unverified`, `verified`,
    `needs_follow_up`
-   `notes`
-   `created_at`
-   `updated_at`

### 7.3 `observations`

-   `id`
-   `location_id` --- relasi ke lokasi
-   `observed_at` --- tanggal/waktu observasi
-   `flood_history` --- keterangan riwayat genangan
-   `water_depth_cm` --- nullable jika tidak diketahui
-   `drainage_condition` --- misalnya `good`, `problematic`, `unknown`
-   `sedimentation_level` --- `low`, `medium`, `high`, atau `unknown`
-   `water_flow` --- `smooth`, `not_smooth`, atau `unknown`
-   `channel_narrowing` --- boolean atau `unknown`
-   `photo_url` --- nullable
-   `notes`
-   `created_at`
-   `updated_at`

Enum dan tipe data final perlu disesuaikan saat skema database dibuat.
Jangan memaksakan nilai `unknown` menjadi nilai baik/buruk.

### Status yang ditampilkan pada UI

-   Belum diperiksa
-   Sudah diperiksa
-   Perlu pemeriksaan lanjutan

Status ini adalah status administratif pemeriksaan, bukan keputusan
teknis penanganan.

## 8. Sumber Data dan Kualitas Informasi

Sumber data yang dapat digunakan: 1. Data sekunder: dokumen pemerintah,
berita, penelitian, dan sumber publik lain. 2. Observasi langsung oleh
tim. 3. Wawancara dengan pihak kelurahan, RT/RW, atau warga. 4.
Kuesioner masyarakat.

Setiap entri perlu menyimpan atau menampilkan asal informasi. Minimal
bedakan: - **Data Sekunder --- Perlu Verifikasi** - **Hasil Observasi
Lapangan** - **Informasi Wawancara/Laporan Masyarakat**

Prinsip kualitas data: - Jangan menyatakan lokasi sebagai titik rawan
resmi hanya karena muncul dalam berita atau penelitian. - Jangan
menyamakan kebutuhan sumur resapan hasil perhitungan penelitian dengan
bukti bahwa sumur tersebut sudah dibangun. - Jangan menyatakan
anggaran/program telah selesai hanya berdasarkan informasi alokasi
anggaran. - Catat tanggal, sumber, dan konteks setiap data. - Hindari
menyimpulkan penyebab genangan hanya dari satu observasi. - Data kosong
harus tetap kosong/tidak diketahui, bukan diisi dengan asumsi.

## 9. Alur Penggunaan Sistem

1.  Tim memperoleh data dari sumber sekunder atau kegiatan lapangan.
2.  Tim memilih lokasi yang sudah ada atau menambahkan lokasi baru.
3.  Tim mengisi informasi lokasi, kelurahan, koordinat, dan sumber data.
4.  Tim mengisi hasil observasi jika telah melakukan pemeriksaan.
5.  Tim mengunggah foto dan menambahkan catatan jika tersedia.
6.  Sistem menyimpan data.
7.  Data tampil pada peta dan dashboard.
8.  Tim meninjau dan membandingkan informasi untuk proses analisis.

## 10. Hubungan dengan Pilar Smart City

Pemetaan kontribusi yang dapat dijelaskan: - **Smart Environment:**
pemetaan genangan dan dokumentasi kondisi lingkungan/drainase. - **Smart
Society:** pengumpulan informasi dari warga dan keterlibatan masyarakat
dalam pelaporan. - **Smart Living:** penyediaan informasi kondisi
lingkungan yang berhubungan dengan kenyamanan dan keamanan. - **Smart
Governance:** dokumentasi data untuk mendukung evaluasi dan pengambilan
keputusan. - **Smart Economy:** penyediaan informasi pendukung dalam
evaluasi/prioritas infrastruktur.

Ini merupakan potensi kontribusi sistem, bukan klaim bahwa aplikasi
secara langsung menyelesaikan seluruh persoalan pada lima pilar.

## 11. Rekomendasi Teknologi

Stack yang disarankan: - **Frontend:** Next.js + TypeScript -
**Styling:** Tailwind CSS - **Peta:** Leaflet + OpenStreetMap -
**Database/backend:** Supabase - **Penyimpanan foto:** Supabase
Storage - **Grafik:** Recharts (opsional)

Teknologi final boleh disederhanakan berdasarkan kemampuan anggota dan
waktu. Pastikan tim menyepakati stack sebelum implementasi agar tidak
terjadi pekerjaan ganda.

## 12. Batasan MVP

### Wajib untuk prototype awal

1.  Dashboard ringkas.
2.  Peta interaktif dengan marker lokasi.
3.  Filter kelurahan.
4.  Form tambah/edit lokasi.
5.  Form input observasi.
6.  Halaman detail lokasi.
7.  Penyimpanan data persisten atau dataset demo yang jelas.

### Tambahan jika waktu cukup

-   Upload foto.
-   Grafik kondisi drainase.
-   Filter status verifikasi.
-   Pencarian lokasi.
-   Riwayat observasi.

### Tidak dikerjakan pada MVP

-   Machine Learning/prediksi banjir.
-   Sensor IoT.
-   Peringatan dini otomatis.
-   Notifikasi WhatsApp.
-   Rekomendasi solusi otomatis.
-   Navigasi evakuasi.
-   Portal publik dan sistem multi-role kompleks.

## 13. Rencana Pengerjaan

Tahap 1 --- Finalisasi kebutuhan: - Sepakati fitur MVP. - Tentukan
pengguna dan alur. - Sepakati stack. - Tentukan data yang tersedia.

Tahap 2 --- Desain: - Buat wireframe dashboard, peta, form, dan detail
lokasi. - Buat struktur database. - Tentukan komponen UI dan navigasi.

Tahap 3 --- Implementasi: - Inisialisasi proyek. - Buat layout dan
navigasi. - Implementasikan peta. - Buat CRUD lokasi. - Buat CRUD
observasi. - Integrasikan database dan penyimpanan foto jika diperlukan.

Tahap 4 --- Pengujian: - Uji input dan validasi. - Uji filter
kelurahan. - Uji marker dan detail lokasi. - Uji penyimpanan dan
pemuatan data. - Pastikan data sekunder dan hasil observasi dibedakan.

Tahap 5 --- Demo: - Siapkan dataset contoh yang diberi label dengan
benar. - Demonstrasikan alur tambah lokasi, input observasi, dan melihat
data pada peta/dashboard. - Jelaskan batasan prototype.

## 14. Keputusan yang Masih Perlu Disepakati Tim

Jangan menganggap hal berikut sudah final sebelum didiskusikan: 1.
Apakah aplikasi memerlukan login pada prototype? 2. Siapa yang boleh
menambah, mengubah, dan menghapus data? 3. Apakah foto wajib atau
opsional? 4. Apakah satu lokasi dapat memiliki banyak observasi?
(Rekomendasi: ya.) 5. Apakah laporan masyarakat masuk MVP atau hanya
data yang dimasukkan tim? 6. Apakah data disimpan di Supabase atau
menggunakan data lokal untuk demo awal? 7. Bagaimana metode verifikasi
data dan siapa yang bertanggung jawab? 8. Seberapa banyak lokasi yang
realistis untuk dimasukkan sebelum demo?

## 15. Prinsip untuk AI Coding Assistant / Vibe Coding

Saat membantu membangun aplikasi: - Baca dokumen konteks ini terlebih
dahulu. - Pertahankan cakupan seluruh Kecamatan Lowokwaru, bukan hanya
Tulusrejo. - Jangan menambahkan fitur di luar MVP tanpa diminta. -
Utamakan implementasi sederhana, mudah diuji, dan konsisten. - Jangan
membuat data fiktif seolah-olah data lapangan nyata. - Jika memakai data
dummy, beri label `DEMO` atau `Data Contoh`. - Jangan menebak koordinat
lokasi. Gunakan koordinat yang diberikan atau minta data yang valid. -
Jangan mengarang sumber, kejadian, atau status verifikasi. - Pisahkan
komponen UI, logika data, dan akses database secara wajar. - Validasi
form dan tangani loading, error, empty state, serta keberhasilan
penyimpanan. - Jangan menaruh secret key Supabase di kode frontend.
Gunakan environment variables dan kebijakan akses yang sesuai. - Sebelum
mengubah banyak file, jelaskan rencana singkat dan file yang akan
disentuh. - Setelah setiap tahap, jalankan lint/build/test yang tersedia
dan perbaiki error sebelum melanjutkan. - Jika ada keputusan produk yang
belum ditetapkan, tanyakan satu hal paling penting atau berikan opsi
dengan rekomendasi; jangan diam-diam mengasumsikan.

## 16. Definisi Selesai untuk MVP

Prototype dianggap siap didemonstrasikan apabila: - Pengguna dapat
membuka dashboard dan peta. - Peta menampilkan lokasi yang memiliki
koordinat valid. - Pengguna dapat memfilter lokasi berdasarkan
kelurahan. - Pengguna dapat menambahkan lokasi. - Pengguna dapat
menambahkan observasi pada lokasi. - Detail lokasi menampilkan data yang
benar. - Data tetap tersedia setelah halaman dimuat ulang (jika
menggunakan database). - Sumber data dan status verifikasi terlihat
jelas. - Tidak ada data contoh yang disajikan seolah-olah hasil survei
nyata.

------------------------------------------------------------------------

**Dokumen status:** Rancangan awal SiGenang Malang --- cakupan Kecamatan
Lowokwaru.\
**Catatan pemeliharaan:** Perbarui dokumen ini jika tim mengubah nama,
cakupan, fitur, stack, skema data, atau keputusan MVP.

------------------------------------------------------------------------

berikut skema tabel sql di supabase
-- 1. Tabel Referensi Kelurahan
create table public.kelurahan (
  id serial primary key,
  name text not null unique,
  created_at timestamptz default now()
);

-- Isi 12 Kelurahan di Kecamatan Lowokwaru
insert into public.kelurahan (name) values
  ('Tulusrejo'),
  ('Lowokwaru'),
  ('Jatimulyo'),
  ('Tunjungsekar'),
  ('Tlogomas'),
  ('Dinoyo'),
  ('Merjosari'),
  ('Sumbersari'),
  ('Ketawanggede'),
  ('Mojolangu'),
  ('Tasikmadu'),
  ('Tunggulwulung');

-- 2. Tabel Titik Lokasi Genangan
create table public.locations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  kelurahan_id integer not null references public.kelurahan(id) on delete restrict,
  latitude double precision not null,
  longitude double precision not null,
  source_type text not null check (source_type in ('secondary', 'field_observation', 'community_report')),
  verification_status text not null default 'unverified' check (verification_status in ('unverified', 'verified', 'needs_follow_up')),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Tabel Hasil Observasi Lapangan
create table public.observations (
  id uuid default gen_random_uuid() primary key,
  location_id uuid not null references public.locations(id) on delete cascade,
  observed_at timestamptz not null default now(),
  flood_history text,
  water_depth_cm integer,
  drainage_condition text not null default 'unknown' check (drainage_condition in ('good', 'problematic', 'unknown')),
  sedimentation_level text not null default 'unknown' check (sedimentation_level in ('low', 'medium', 'high', 'unknown')),
  water_flow text not null default 'unknown' check (water_flow in ('smooth', 'not_smooth', 'unknown')),
  channel_narrowing text not null default 'unknown' check (channel_narrowing in ('yes', 'no', 'unknown')),
  photo_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

dan

alter table public.kelurahan enable row level security;
alter table public.locations enable row level security;
alter table public.observations enable row level security;

create policy "Allow public read kelurahan" on public.kelurahan for select using (true);
create policy "Allow public all locations" on public.locations for all using (true) with check (true);
create policy "Allow public all observations" on public.observations for all using (true) with check (true);