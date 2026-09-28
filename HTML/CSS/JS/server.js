const express = require("express");
const path = require("path");
const { initDatabase, get, run } = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

app.post("/api/register", async (req, res) => {
  try {
    const { nome, email, senha } = req.body || {};

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: "Preencha nome, e-mail e senha." });
    }

    const existingUser = await get("SELECT * FROM usuarios WHERE email = ?", [email.trim()]);
    if (existingUser) {
      return res.status(409).json({ message: "Este e-mail já está cadastrado." });
    }

    await run("INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)", [
      nome.trim(),
      email.trim(),
      senha.trim(),
    ]);

    return res.status(201).json({
      message: "Cadastro realizado com sucesso.",
      user: { nome: nome.trim(), email: email.trim() },
    });
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, senha } = req.body || {};

    if (!email || !senha) {
      return res.status(400).json({ message: "Informe e-mail e senha." });
    }

    const user = await get("SELECT * FROM usuarios WHERE email = ? AND senha = ?", [
      email.trim(),
      senha.trim(),
    ]);

    if (!user) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    return res.json({
      message: "Login realizado com sucesso.",
      user: {
        id: user.id,
        nome: user.nome,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ message: "Erro ao fazer login." });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Banco funcionando." });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/HTML/login.html", (req, res) => {
  res.sendFile(path.join(__dirname, "HTML", "login.html"));
});

initDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Banco SQLite iniciado em ${path.join(__dirname, "data", "roma_antiga.db")}`);
    });
  })
  .catch((error) => {
    console.error("Erro ao inicializar o banco de dados:", error);
    process.exit(1);
  });
