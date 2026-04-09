# MindCheck SRQ-29 (Flask)

Web app skrining kesehatan mental mahasiswa berbasis SRQ-29 dengan model Logistic Regression (Scaler + PCA).

Versi Python yang didukung: 3.10 hingga 3.13.

## Fitur Utama

- Tidak menggunakan database (semua pemrosesan in-memory).
- Form prediksi 4 langkah dengan validasi real-time.
- Rekomendasi berbasis jawaban SRQ:
  - Tersedia 29 rekomendasi terpisah (1 rekomendasi untuk setiap pertanyaan SRQ).
  - Jika jawaban SRQ ke-n adalah Ya, maka rekomendasi ke-n ditampilkan.
- Arsitektur modular agar mudah maintenance.
- Asset frontend dipisah per halaman (CSS/JS tidak dimuat global jika tidak dibutuhkan).

## Struktur Project

app.py
gunicorn.conf.py
wsgi.py
pyproject.toml
requirements.txt
mental_health_app/
templates/
static/
deploy/

### Rincian Modul Backend

- mental_health_app/__init__.py: app factory.
- mental_health_app/routes.py: route handler.
- mental_health_app/predictor.py: loading model global + inferensi.
- mental_health_app/parsers.py: parsing dan validasi field request.
- mental_health_app/constants.py: daftar SRQ dan rekomendasi.
- mental_health_app/recommendations.py: pemetaan jawaban SRQ -> rekomendasi.

## Menjalankan Lokal (Windows/Linux)

1. Install uv.
2. Buat virtual environment:

	uv venv .venv

3. Install dependency dari requirements:

	uv pip sync requirements.txt

4. Jalankan aplikasi:

	.venv/Scripts/python.exe app.py

	Untuk Linux:

	.venv/bin/python app.py

5. Buka:

	http://127.0.0.1:5000

## Generate requirements.txt dengan uv

File requirements.txt dibuat dari pyproject.toml dengan perintah:

uv pip compile pyproject.toml -o requirements.txt

## Health Check

Endpoint health check tersedia di:

GET /health

## Deployment Ready Ubuntu 22.04

Langkah berikut diasumsikan domain sudah diarahkan ke server.

### 1) Install paket sistem

sudo apt update
sudo apt install -y python3 python3-venv nginx

### 2) Clone project

sudo mkdir -p /opt/flask-prisma-guard
sudo chown -R $USER:$USER /opt/flask-prisma-guard
cd /opt/flask-prisma-guard

### 3) Install uv dan dependency project

curl -LsSf https://astral.sh/uv/install.sh | sh
source $HOME/.cargo/env

uv venv .venv
uv pip sync requirements.txt

### 4) Jalankan dengan Gunicorn (uji manual)

.venv/bin/gunicorn -c gunicorn.conf.py wsgi:app

Jika sukses, aplikasi siap dipasang sebagai service.

### 5) Setup systemd service

Salin file service:

sudo cp deploy/mindcheck.service /etc/systemd/system/mindcheck.service

Pastikan path pada file service sesuai:

- WorkingDirectory=/opt/flask-prisma-guard
- PATH=/opt/flask-prisma-guard/.venv/bin

Aktifkan service:

sudo systemctl daemon-reload
sudo systemctl enable mindcheck
sudo systemctl restart mindcheck
sudo systemctl status mindcheck

### 6) Setup Nginx reverse proxy

Salin config nginx:

sudo cp deploy/mindcheck.nginx.conf /etc/nginx/sites-available/mindcheck
sudo ln -s /etc/nginx/sites-available/mindcheck /etc/nginx/sites-enabled/mindcheck

Edit server_name pada file Nginx sesuai domain.

Uji dan reload nginx:

sudo nginx -t
sudo systemctl reload nginx

### 7) Aktifkan HTTPS (opsional, direkomendasikan)

sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com

## Catatan Model

- Model pickle dilatih dengan scikit-learn 1.6.1.
- Versi scikit-learn dipin ke 1.6.1 pada pyproject untuk menjaga kompatibilitas loading model di production.
- Untuk menghindari masalah build dependency, gunakan Python 3.10-3.13 di server Ubuntu 22.
