const usuarioPadrao = {
  nome: "Administrador",
  email: "admin@roma.com",
  senha: "123456",
};

const API_BASE = window.location.protocol === "file:" ? "http://localhost:8000" : "";

function getLoginPath() {
  return window.location.pathname.includes("/HTML/")
    ? "login.html"
    : "HTML/login.html";
}

function getLoginUrl() {
  return window.location.protocol === "file:"
    ? "http://localhost:8000/HTML/login.html"
    : getLoginPath();
}

function getHomePath() {
  return window.location.pathname.includes("/HTML/")
    ? "../index.html"
    : "index.html";
}

function getHomeUrl() {
  return window.location.protocol === "file:"
    ? "http://localhost:8000/index.html"
    : getHomePath();
}

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  } catch (error) {
    return null;
  }
}

async function apiRequest(endpoint, dados) {
  const resposta = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  const texto = await resposta.text();
  let json = null;

  if (texto) {
    try {
      json = JSON.parse(texto);
    } catch (error) {
      throw new Error(
        "O backend não respondeu em JSON. Verifique se o servidor está rodando em http://localhost:8000.",
      );
    }
  }

  if (!resposta.ok) {
    throw new Error(json?.message || "Erro ao processar a requisição.");
  }

  return json;
}

function mostrarMensagem(texto, tipo, elementoId = "mensagem") {
  const mensagem = document.getElementById(elementoId);
  if (!mensagem) return;

  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = getLoginUrl();
}

function atualizarEstadoLogin() {
  const usuario = getUsuarioLogado();
  const linksLogin = document.querySelectorAll(
    'a[href$="login.html"], a[href$="HTML/login.html"]',
  );

  if (!usuario) {
    return;
  }

  linksLogin.forEach((link) => {
    const item = link.closest("li");

    if (!item) return;

    const nome = usuario.nome.split(" ")[0];

    item.innerHTML = `
      <span class="usuario-logado">Olá, ${nome}</span>
      <button type="button" class="logout-btn">SAIR</button>
    `;

    const botaoLogout = item.querySelector(".logout-btn");
    if (botaoLogout) {
      botaoLogout.addEventListener("click", logout);
    }
  });

  const paginaLogin = window.location.pathname.endsWith("login.html");
  if (paginaLogin) {
    const formulario = document.getElementById("loginForm");
    const caixa = document.querySelector(".login-box");

    if (formulario && caixa) {
      formulario.style.display = "none";

      const status = document.createElement("div");
      status.className = "login-status";
      status.innerHTML = `
        <p>Olá, ${usuario.nome}! Você já está logado.</p>
        <a class="status-link" href="${getHomeUrl()}">IR PARA INÍCIO</a>
      `;

      caixa.insertBefore(status, formulario);
    }
  }
}

function mostrarTelaLogin() {
  const loginView = document.getElementById("loginView");
  const cadastroView = document.getElementById("cadastroView");

  if (loginView && cadastroView) {
    loginView.classList.remove("hidden");
    cadastroView.classList.add("hidden");
  }
}

function mostrarTelaCadastro() {
  const loginView = document.getElementById("loginView");
  const cadastroView = document.getElementById("cadastroView");

  if (loginView && cadastroView) {
    loginView.classList.add("hidden");
    cadastroView.classList.remove("hidden");
  }
}

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const cadastrarBtn = document.getElementById("cadastrarBtn");
const registerForm = document.getElementById("registerForm");
const voltarLoginBtn = document.getElementById("voltarLoginBtn");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    mostrarMensagem("", "");

    if (!email || !senha) {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }

    try {
      const response = await apiRequest("/api/login", { email, senha });
      const usuario = response.user;

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ nome: usuario.nome, email: usuario.email }),
      );

      mostrarMensagem(
        `Olá, ${usuario.nome}! Login realizado com sucesso.`,
        "sucesso",
      );

      setTimeout(() => {
        window.location.href = getHomeUrl();
      }, 1000);
    } catch (error) {
      mostrarMensagem(error.message, "erro");
    }
  });
}

if (cadastrarBtn) {
  cadastrarBtn.addEventListener("click", mostrarTelaCadastro);
}

if (voltarLoginBtn) {
  voltarLoginBtn.addEventListener("click", mostrarTelaLogin);
}

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("cadastroEmail").value.trim();
    const senha = document.getElementById("cadastroSenha").value.trim();

    mostrarMensagem("", "", "registerMensagem");

    if (!nome || !email || !senha) {
      mostrarMensagem("Preencha todos os campos.", "erro", "registerMensagem");
      return;
    }

    try {
      const response = await apiRequest("/api/register", {
        nome,
        email,
        senha,
      });
      const usuario = response.user;

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify({ nome: usuario.nome, email: usuario.email }),
      );

      mostrarMensagem(
        `Cadastro realizado com sucesso! Olá, ${usuario.nome}.`,
        "sucesso",
        "registerMensagem",
      );

      setTimeout(() => {
        window.location.href = getHomeUrl();
      }, 1000);
    } catch (error) {
      mostrarMensagem(error.message, "erro", "registerMensagem");
    }
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

atualizarEstadoLogin();
