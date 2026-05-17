# Wedding Invitation - Modern Luxury

Undangan pernikahan digital statis, siap deploy ke **GitHub Pages**.

## Struktur
```
index.html
style.css
script.js
data.json
assets/
  music/       <- letakkan music.mp3 di sini
  images/      <- letakkan groom.jpg, bride.jpg, bg-*.jpg
```

## Cara Pakai
1. Edit `data.json` untuk mengubah semua konten (nama, tanggal, alamat, rekening, dll.).
2. Letakkan file musik di `assets/music/music.mp3`.
3. Letakkan foto pengantin & background di `assets/images/`.
4. Deploy:
   - Push ke repo GitHub.
   - Aktifkan **GitHub Pages** (branch `main` / root).

## Parameter Tamu
Tambahkan `?to=NamaTamu` pada URL.
Contoh: `https://username.github.io/?to=Rizky%20dan%20Keluarga`

## Fitur
- Responsive (mobile, tablet, desktop)
- Smooth scroll & cinematic reveal (IntersectionObserver)
- Musik auto-play setelah "Buka Undangan" + tombol floating draggable
- Countdown realtime
- RSVP & ucapan disimpan di localStorage
- Copy nomor rekening + toast notification
- Parallax ringan & glassmorphism luxury
