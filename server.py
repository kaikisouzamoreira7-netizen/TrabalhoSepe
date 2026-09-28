#!/usr/bin/env python3
import json
import sqlite3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent
DATA_DIR = ROOT / "data"
DB_PATH = DATA_DIR / "roma_antiga.db"
HOST = "0.0.0.0"
PORT = 8000


def init_db():
    DATA_DIR.mkdir(exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    conn.execute(
        "INSERT OR IGNORE INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
        ("Administrador", "admin@roma.com", "123456"),
    )
    conn.commit()
    conn.close()


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


class AppHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/health":
            self._send_json({"ok": True, "message": "Banco funcionando."})
            return

        if parsed.path in ("/", "/index.html"):
            self.path = "/index.html"
            return super().do_GET()

        if parsed.path.startswith(("/HTML/", "/CSS/", "/JS/")):
            return super().do_GET()

        return super().do_GET()

    def do_POST(self):
        parsed = urlparse(self.path)

        if parsed.path == "/api/register":
            self._handle_register()
            return

        if parsed.path == "/api/login":
            self._handle_login()
            return

        self._send_json({"message": "Rota não encontrada."}, status=404)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            raise ValueError("JSON inválido.")

    def _send_json(self, payload, status=200):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _handle_register(self):
        try:
            payload = self._read_json()
        except ValueError:
            self._send_json({"message": "JSON inválido."}, status=400)
            return

        nome = str(payload.get("nome", "")).strip()
        email = str(payload.get("email", "")).strip()
        senha = str(payload.get("senha", "")).strip()

        if not nome or not email or not senha:
            self._send_json({"message": "Preencha nome, e-mail e senha."}, status=400)
            return

        conn = get_db_connection()
        try:
            existing = conn.execute(
                "SELECT id FROM usuarios WHERE email = ?",
                (email,),
            ).fetchone()

            if existing:
                self._send_json({"message": "Este e-mail já está cadastrado."}, status=409)
                return

            conn.execute(
                "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
                (nome, email, senha),
            )
            conn.commit()

            self._send_json(
                {
                    "message": "Cadastro realizado com sucesso.",
                    "user": {"nome": nome, "email": email},
                },
                status=201,
            )
        except sqlite3.Error as exc:
            self._send_json({"message": f"Erro ao cadastrar usuário: {exc}"}, status=500)
        finally:
            conn.close()

    def _handle_login(self):
        try:
            payload = self._read_json()
        except ValueError:
            self._send_json({"message": "JSON inválido."}, status=400)
            return

        email = str(payload.get("email", "")).strip()
        senha = str(payload.get("senha", "")).strip()

        if not email or not senha:
            self._send_json({"message": "Informe e-mail e senha."}, status=400)
            return

        conn = get_db_connection()
        try:
            user = conn.execute(
                "SELECT id, nome, email FROM usuarios WHERE email = ? AND senha = ?",
                (email, senha),
            ).fetchone()

            if not user:
                self._send_json({"message": "E-mail ou senha incorretos."}, status=401)
                return

            self._send_json(
                {
                    "message": "Login realizado com sucesso.",
                    "user": {
                        "id": user["id"],
                        "nome": user["nome"],
                        "email": user["email"],
                    },
                }
            )
        except sqlite3.Error as exc:
            self._send_json({"message": f"Erro ao fazer login: {exc}"}, status=500)
        finally:
            conn.close()

    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    init_db()
    print(f"Servidor rodando em http://localhost:{PORT}")
    print(f"Banco SQLite em {DB_PATH}")
    httpd = ThreadingHTTPServer((HOST, PORT), AppHandler)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nEncerrando servidor...")
    finally:
        httpd.server_close()
