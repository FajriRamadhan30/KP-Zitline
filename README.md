# Zitline IP Management & Authentication System

Zitline adalah sistem manajemen IP perusahaan berbasis web yang dikembangkan menggunakan **Node.js**, **Express.js**, **MySQL**, dan **React.js**. Proyek ini terinspirasi dari **phpIPAM** dan bertujuan untuk membantu perusahaan mengelola alamat IP secara efisien.

## 📦 Fitur
- CRUD IP Address (Buat, Baca, Perbarui, Hapus)
- Log akses dan deteksi alamat IP
- Validasi input dan penanganan error
- Frontend responsif dengan React.js

## 🛠️ Persyaratan
- **Node.js** (v14 atau lebih baru)
- **MySQL** (v8.0 atau lebih baru)


## 🚀 Menjalankan Proyek

### 1. **Backend**
```bash
cd backend
npm install
node server.js
```

### 2. **Frontend**
```bash
cd apps
npm install
npm run dev
```

## 🔍 Endpoint API

| Method | Endpoint         | Deskripsi                        |
|--------|------------------|----------------------------------|
| GET    | /api/ips          | Mendapatkan semua IP Address     |
| POST   | /api/ips          | Menambahkan IP Address baru      |
| DELETE | /api/ips/:id      | Menghapus IP Address berdasarkan ID |
| GET    | /api/ips/logs     | Mendapatkan log akses IP         |

## 📸 Screenshot

🚀 **Dashboard IP Management:**
- Menampilkan daftar IP dan detail log.

## 📜 Lisensi
Proyek ini menggunakan lisensi **MIT**.

