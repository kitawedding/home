# 📄 Invoice Gallery — GitHub Pages

Website otomatis untuk menampilkan invoice dari folder `invoice/`.

## 🚀 Setup

### 1. Buat repo GitHub baru
```bash
git init
git remote add origin https://github.com/USERNAME/REPO.git
```

### 2. Push semua file ini
```bash
git add .
git commit -m "init: invoice gallery"
git push -u origin main
```

### 3. Aktifkan GitHub Pages
- Buka repo → **Settings** → **Pages**
- Source: **Deploy from a branch** → branch `main` → folder `/` (root)
- Klik **Save**

### 4. Aktifkan GitHub Actions
- Buka **Settings** → **Actions** → **General**
- Pilih **Allow all actions**
- Di bawah **Workflow permissions** → pilih **Read and write permissions**
- Klik **Save**

---

## 📸 Cara Tambah Invoice

Cukup taruh gambar di folder `invoice/` lalu push:

```bash
cp /path/to/invoice.jpg invoice/
git add invoice/invoice.jpg
git commit -m "add: invoice bulan Mei"
git push
```

GitHub Actions akan otomatis:
1. Scan folder `invoice/`
2. Generate ulang `images.json`
3. Website langsung memuat gambar baru ✓

## 📁 Struktur Folder

```
├── index.html              ← Website utama
├── images.json             ← Auto-generated (jangan edit manual)
├── invoice/                ← Taruh semua file invoice di sini
│   ├── invoice-001.jpg
│   ├── invoice-002.png
│   └── ...
└── .github/
    └── workflows/
        └── update-manifest.yml  ← GitHub Actions
```

## ✅ Format yang Didukung
JPG · PNG · WEBP · GIF · AVIF · BMP · PDF
