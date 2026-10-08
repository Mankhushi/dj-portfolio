# 🎧 KHUSHISOUNDLAB — DJ Portfolio

> A full-stack DJ portfolio website with admin panel, file uploads, and live audio player.

🌐 **Live Demo:** [https://mankhushi.github.io/dj-portfolio/](https://mankhushi.github.io/dj-portfolio/)

---

## 📸 Preview

<div align="center">

![DJ Khushi Portfolio](https://raw.githubusercontent.com/Mankhushi/dj-portfolio/main/dj-khushi-mixing.png)

### *"Music. Energy. Good Vibes."*
### 🎵 ELECTRONIC • AFRO HOUSE • TECH HOUSE • BOLLYWOOD

</div>

---

## 👩‍🎤 About

**DJ Khushi** is a Mumbai-based DJ and music enthusiast crafting energetic, unforgettable experiences through sound — from Electronic and Afro House to Tech House and Bollywood.

- 📍 Location: Mumbai, India
- 🎵 Genres: Electronic • Afro House • Tech House • Bollywood
- 📧 Email: djkhushisoundlab@gmail.com
- 📸 Instagram: [@khushisoundlab](https://instagram.com/khushisoundlab)

---

## 🚀 Features

- 🎵 **Live Audio Player** — Featured mix with waveform controls
- 🖼️ **Photo Gallery** — Dynamic photo uploads with lightbox preview
- 🎬 **Video Section** — Embedded performance videos
- 📂 **Admin Panel** — Upload/delete photos, videos, and songs
- ⚙️ **Settings Editor** — Update bio, stats, contact info live
- 🌐 **REST API** — Python backend with file management endpoints
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Python 3.11+ (built-in `http.server`) |
| Storage | Local filesystem (`uploads/`) |
| Styling | Custom CSS + Font Awesome 6 |

---

## ▶️ Run Locally

```bash
# Clone the repo
git clone https://github.com/Mankhushi/dj-portfolio.git
cd dj-portfolio

# Start the server (Python 3.11+ required)
python server.py
```

Then open:
- **Portfolio** → http://localhost:7800
- **Admin Panel** → http://localhost:7800/admin.html

---

## 📁 Project Structure

```
dj-portfolio/
├── index.html          # Main portfolio page
├── admin.html          # Admin panel (upload/manage media)
├── server.py           # Python HTTP server + REST API
├── settings.json       # Site config (bio, stats, contact)
├── css/
│   └── style.css       # All styles
├── js/
│   └── app.js          # Frontend logic
└── uploads/
    ├── photos/         # Uploaded photos
    ├── videos/         # Uploaded videos
    └── songs/          # Uploaded mixes/songs
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/all` | Get all uploaded files |
| GET | `/api/files?type=photos` | List files by type |
| GET | `/api/stats` | Upload stats |
| GET | `/api/settings` | Get site settings |
| POST | `/upload` | Upload a file |
| POST | `/api/settings` | Save site settings |
| DELETE | `/api/delete/{type}/{filename}` | Delete a file |

---

## 📬 Contact

Book DJ Khushi for your next event:

- 📧 djkhushisoundlab@gmail.com
- 📱 WhatsApp: +91 6207803155
- 📸 [Instagram @khushisoundlab](https://instagram.com/khushisoundlab)

---

*Built with ❤️ for the love of music.*
