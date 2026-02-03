## 🔐 Alur Proses Autentikasi (Next.js + NextAuth + Laravel)

Berikut adalah urutan kejadian dari saat pengguna mengisi formulir hingga berhasil mendapatkan akses:

### 1. Client Side (LoginForm.jsx)
* **Input**: Pengguna memasukkan `email` dan `password`.
* **Action**: Tombol Login diklik, menjalankan fungsi `signIn("credentials", { email, password })`.
* **State**: Tombol berubah menjadi "Sedang Memproses..." (`isLoading: true`).

### 2. NextAuth Middleware (API Route)
* NextAuth menerima permintaan di endpoint internal `/api/auth/callback/credentials`.
* NextAuth memanggil fungsi `authorize` yang ada di dalam `authOptions.ts`.

### 3. Server-to-Server Validation (authOptions.ts)
* **Fetch**: Server Next.js melakukan "tembakan" API ke Laravel (`http://127.0.0.1:8000/api/auth/login`).
* **Laravel Check**: Laravel memeriksa database. Jika cocok, Laravel mengirimkan data `User` dan `Bearer Token`.
* **Result**: 
    * Jika Laravel menolak (401), fungsi `authorize` mengembalikan `null` (Login Gagal).
    * Jika Laravel setuju, data User + Token dikirim ke tahap selanjutnya.

### 4. JWT & Session Callback
* **JWT Callback**: Data dari Laravel (seperti `accessToken` dan `roles`) "disuntikkan" ke dalam Token JWT yang terenkripsi.
* **Session Callback**: Token JWT tersebut dipindahkan ke dalam objek `session` agar bisa diakses oleh komponen React.

### 5. Final Response (LoginForm.jsx)
* **Success**: `result.ok` bernilai true. Browser melakukan `router.push("/")` ke halaman utama.
* **Session Ready**: Sekarang, seluruh aplikasi bisa tahu siapa yang login menggunakan hook `useSession()`.

---

## 🛠 Visualisasi Arsitektur



| Lokasi | Komponen | Peran |
| :--- | :--- | :--- |
| **Browser** | `LoginForm.jsx` | Antarmuka pengguna (UI) |
| **Next.js Server** | `authOptions.ts` | Jembatan Keamanan (Proxy) |
| **Laravel API** | `Controller` | Sumber Data & Validasi (Backend) |