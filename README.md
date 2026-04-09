# Prisma Guard

Prisma Guard adalah web app skrining awal kesehatan mental mahasiswa menggunakan SRQ-29 dan model Logistic Regression (Scaler + PCA).

## Ringkas Fitur

- Tanpa database (in-memory processing).
- Form prediksi 4 langkah.
- Hasil status + probabilitas + rekomendasi.
- Struktur kode sederhana: app entrypoint + modul di folder src.

## Persyaratan

- Python 3.10 - 3.13
- uv

## Instalasi Lokal

1. Clone project dan masuk ke folder project.
2. Buat virtual environment:

```bash
uv venv .venv
```

3. Install dependency:

```bash
uv pip sync requirements.txt
```

4. Jalankan aplikasi:

Windows:

```bash
.venv\Scripts\python.exe app.py
```

Linux/macOS:

```bash
.venv/bin/python app.py
```

5. Buka aplikasi di:

```text
http://127.0.0.1:3000
```

## Deploy Production (Ubuntu 22.04)

Target path hosting:

```text
/var/www/prisma-guard
```

1. Install dependency sistem:

```bash
sudo apt update
sudo apt install -y python3 python3-venv nginx
```

2. Copy project ke server di path target, lalu masuk folder project:

```bash
cd /var/www/prisma-guard
```

3. Setup uv + environment + dependency:

```bash
uv venv .venv
uv pip sync requirements.txt
```

4. Uji Gunicorn manual:

```bash
/var/www/prisma-guard/.venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 wsgi:app
```

5. Pasang systemd service:

```bash
sudo cp deploy/prisma-guard.service /etc/systemd/system/prisma-guard.service
sudo systemctl daemon-reload
sudo systemctl enable prisma-guard
sudo systemctl restart prisma-guard
sudo systemctl status prisma-guard
```

6. Pasang Nginx reverse proxy:

```bash
sudo cp deploy/prisma-guard.nginx.conf /etc/nginx/sites-available/prisma-guard
sudo ln -s /etc/nginx/sites-available/prisma-guard /etc/nginx/sites-enabled/prisma-guard
sudo nginx -t
sudo systemctl reload nginx
```

7. (Opsional) Aktifkan HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Catatan Penting Perubahan UI di Production

Project ini sudah memakai versioned static asset URL (`?v=<mtime>`). Jadi saat file CSS/JS berubah, browser akan mengambil versi baru.

Jika perubahan navbar/footer belum terlihat:

1. Pastikan deploy file terbaru sudah benar.
2. Restart service app (Gunicorn/systemd).
3. Hard refresh browser (`Ctrl+F5`).
4. Jika ada CDN/proxy cache, lakukan purge cache.

## Troubleshooting

### 1) ImportError: attempted relative import with no known parent package

Jalankan aplikasi langsung dari root project dengan:

```bash
python app.py
```

Kode app sudah disesuaikan agar menggunakan import package yang aman untuk mode ini.

### 2) Model tidak bisa dimuat

Pastikan file berikut ada di folder `models`:

- `scaler.pkl`
- `pca.pkl`
- `model_logistic_regression.pkl`
