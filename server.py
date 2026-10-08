#!/usr/bin/env python3
"""
KHUSHISOUNDLAB — DJ Portfolio Upload Server
============================================
Compatible with Python 3.11+ (no deprecated cgi module).
Run:   python server.py
Site:  http://localhost:3000
Admin: http://localhost:3000/admin.html
"""

import os
import json
import mimetypes
from http.server import HTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import urllib.parse
import re

# ── Upload folder config ──────────────────────────────────────────────
BASE_DIR = Path(__file__).parent

UPLOAD_DIRS = {
    'photos': BASE_DIR / 'uploads' / 'photos',
    'videos': BASE_DIR / 'uploads' / 'videos',
    'songs':  BASE_DIR / 'uploads' / 'songs',
}

ALLOWED_EXTENSIONS = {
    'photos': {'.jpg', '.jpeg', '.png', '.gif', '.webp'},
    'videos': {'.mp4', '.mov', '.webm', '.mkv'},
    'songs':  {'.mp3', '.wav', '.ogg', '.aac', '.flac', '.m4a'},
}

MAX_FILE_SIZE = 500 * 1024 * 1024  # 500 MB

# Ensure folders exist
for d in UPLOAD_DIRS.values():
    d.mkdir(parents=True, exist_ok=True)

# ── MIME types ────────────────────────────────────────────────────────
mimetypes.add_type('video/mp4',  '.mp4')
mimetypes.add_type('video/webm', '.webm')
mimetypes.add_type('audio/mpeg', '.mp3')
mimetypes.add_type('audio/ogg',  '.ogg')
mimetypes.add_type('audio/aac',  '.aac')


# ── Helpers ───────────────────────────────────────────────────────────
def human_size(n):
    for unit in ('B', 'KB', 'MB', 'GB'):
        if n < 1024:
            return f'{n:.1f} {unit}'
        n /= 1024
    return f'{n:.1f} GB'


def file_info(f: Path, file_type: str) -> dict:
    stat = f.stat()
    return {
        'name':       f.name,
        'url':        f'/uploads/{file_type}/{urllib.parse.quote(f.name)}',
        'size':       stat.st_size,
        'size_human': human_size(stat.st_size),
        'type':       file_type,
        'mtime':      stat.st_mtime,
    }


# ── Multipart parser (no cgi module needed) ───────────────────────────
def parse_multipart(body: bytes, boundary: bytes):
    """
    Returns list of dicts:
        { name, filename, content_type, data }
    """
    delimiter = b'--' + boundary
    parts     = []

    for segment in body.split(delimiter)[1:]:
        if segment[:2] == b'--':          # end boundary
            break
        if segment[:2] == b'\r\n':
            segment = segment[2:]

        sep = segment.find(b'\r\n\r\n')
        if sep == -1:
            continue

        headers_raw = segment[:sep].decode('utf-8', errors='replace')
        data        = segment[sep + 4:]
        if data.endswith(b'\r\n'):
            data = data[:-2]

        part = {'name': None, 'filename': None,
                'content_type': 'application/octet-stream', 'data': data}

        for line in headers_raw.split('\r\n'):
            if ':' not in line:
                continue
            key, _, val = line.partition(':')
            key = key.strip().lower()
            val = val.strip()

            if key == 'content-disposition':
                m_name = re.search(r'name="([^"]*)"', val)
                m_file = re.search(r'filename="([^"]*)"', val)
                if m_name: part['name']     = m_name.group(1)
                if m_file: part['filename'] = m_file.group(1)
            elif key == 'content-type':
                part['content_type'] = val

        if part['name']:
            parts.append(part)

    return parts


# ── Request handler ───────────────────────────────────────────────────
class PortfolioHandler(SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def _cors(self):
        self.send_header('Access-Control-Allow-Origin',  '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    # ── GET ──────────────────────────────────────────────────────────
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path   = parsed.path
        qs     = urllib.parse.parse_qs(parsed.query)

        if path == '/api/files':
            ftype = qs.get('type', ['photos'])[0]
            self._serve_list(ftype)

        elif path == '/api/all':
            result = {}
            for ftype, folder in UPLOAD_DIRS.items():
                result[ftype] = [
                    file_info(f, ftype)
                    for f in sorted(folder.iterdir())
                    if f.is_file() and not f.name.startswith('.')
                ]
            self._json(result)

        elif path == '/api/stats':
            stats = {}
            for ftype, folder in UPLOAD_DIRS.items():
                files = [f for f in folder.iterdir()
                         if f.is_file() and not f.name.startswith('.')]
                total = sum(f.stat().st_size for f in files)
                stats[ftype] = {
                    'count':      len(files),
                    'total_size': human_size(total),
                }
            self._json(stats)

        elif path == '/api/settings':
            settings_path = BASE_DIR / 'settings.json'
            if settings_path.exists():
                with open(settings_path, 'r', encoding='utf-8') as f:
                    self._json(json.load(f))
            else:
                self._json({})

        else:
            super().do_GET()

    def _serve_list(self, ftype):
        if ftype not in UPLOAD_DIRS:
            self._json({'error': 'Invalid type'}, 400)
            return
        folder = UPLOAD_DIRS[ftype]
        files  = sorted(folder.iterdir(), key=lambda x: x.stat().st_mtime, reverse=True)
        self._json([
            file_info(f, ftype)
            for f in files
            if f.is_file() and not f.name.startswith('.')
        ])

    # ── POST (upload) ────────────────────────────────────────────────
    def do_POST(self):
        if self.path == '/upload':
            self._handle_upload()
        elif self.path == '/api/settings':
            self._handle_save_settings()
        else:
            self._json({'error': 'Not found'}, 404)

    def _handle_save_settings(self):
        try:
            cl   = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(cl)
            data = json.loads(body.decode('utf-8'))
            settings_path = BASE_DIR / 'settings.json'
            with open(settings_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            self._json({'success': True})
        except Exception as e:
            self._json({'error': str(e)}, 500)

    def _handle_upload(self):
        try:
            ct = self.headers.get('Content-Type', '')
            cl = int(self.headers.get('Content-Length', 0))

            if cl > MAX_FILE_SIZE:
                self._json({'error': 'File too large (max 500 MB)'}, 413)
                return

            if 'multipart/form-data' not in ct:
                self._json({'error': 'Expected multipart/form-data'}, 400)
                return

            # Extract boundary
            m = re.search(r'boundary=([^\s;]+)', ct)
            if not m:
                self._json({'error': 'Missing boundary'}, 400)
                return
            boundary = m.group(1).encode()

            body  = self.rfile.read(cl)
            parts = parse_multipart(body, boundary)

            # Get 'type' field
            ftype = 'photos'
            for p in parts:
                if p['name'] == 'type' and not p['filename']:
                    ftype = p['data'].decode('utf-8', errors='replace').strip()
                    break

            if ftype not in UPLOAD_DIRS:
                self._json({'error': 'Invalid category'}, 400)
                return

            # Get file part
            file_part = next((p for p in parts if p['name'] == 'file' and p['filename']), None)
            if not file_part:
                self._json({'error': 'No file in request'}, 400)
                return

            ext = Path(file_part['filename']).suffix.lower()
            if ext not in ALLOWED_EXTENSIONS[ftype]:
                allowed = ', '.join(ALLOWED_EXTENSIONS[ftype])
                self._json({'error': f'"{ext}" not allowed. Use: {allowed}'}, 415)
                return

            safe_name = Path(file_part['filename']).name
            save_path = UPLOAD_DIRS[ftype] / safe_name

            with open(save_path, 'wb') as fh:
                fh.write(file_part['data'])

            self._json({'success': True, 'file': file_info(save_path, ftype)})

        except Exception as e:
            self._json({'error': str(e)}, 500)

    # ── DELETE ───────────────────────────────────────────────────────
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        parts  = parsed.path.lstrip('/').split('/', 3)

        if len(parts) == 4 and parts[0] == 'api' and parts[1] == 'delete':
            ftype    = parts[2]
            filename = urllib.parse.unquote(parts[3])
            self._handle_delete(ftype, filename)
        else:
            self._json({'error': 'Not found'}, 404)

    def _handle_delete(self, ftype, filename):
        if ftype not in UPLOAD_DIRS:
            self._json({'error': 'Invalid type'}, 400)
            return
        safe_name = Path(filename).name
        fp        = UPLOAD_DIRS[ftype] / safe_name
        if fp.exists() and fp.is_file():
            fp.unlink()
            self._json({'success': True, 'deleted': safe_name})
        else:
            self._json({'error': 'File not found'}, 404)

    # ── JSON helper ──────────────────────────────────────────────────
    def _json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode('utf-8')
        self.send_response(status)
        self.send_header('Content-Type',   'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self._cors()
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        try:
            method = str(args[0]).split()[0] if args else ''
            path   = str(args[0]).split()[1] if args and ' ' in str(args[0]) else ''
            code   = str(args[1]) if len(args) > 1 else ''
            colour = '\033[32m' if code.startswith('2') else \
                     '\033[33m' if code.startswith('3') else '\033[31m'
            print(f'  {colour}{code}\033[0m  {method:6}  {path}')
        except Exception:
            pass  # never crash on logging


# ── Entry point ───────────────────────────────────────────────────────
if __name__ == '__main__':
    PORT   = 7800
    server = HTTPServer(('', PORT), PortfolioHandler)

    print('\n  \033[35m♫  KHUSHISOUNDLAB — Portfolio Server\033[0m')
    print(f'  \033[36m🌐  Site :\033[0m  http://localhost:{PORT}')
    print(f'  \033[36m⚙️   Admin:\033[0m  http://localhost:{PORT}/admin.html')
    print(f'  \033[90m      Press Ctrl+C to stop\033[0m\n')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n  Server stopped.')
