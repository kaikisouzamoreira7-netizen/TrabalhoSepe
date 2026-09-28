const usuarioPadrao = {
  nome: "Administrador",
  email: "admin@roma.com",
  senha: "123456",
};

function getLoginPath() {
  return window.location.pathname.includes("/HTML/")
    ? "login.html"
    : "HTML/login.html";
}

function getHomePath() {
  return window.location.pathname.includes("/HTML/")
    ? "../index.html"
    : "index.html";
}

function getUsuarioLogado() {
  try {
    return JSON.parse(localStorage.getItem("usuarioLogado") || "null");
  } catch (error) {
    return null;
  }
}

function mostrarMensagem(texto, tipo) {
  const mensagem = document.getElementById("mensagem");
  if (!mensagem) return;

  mensagem.textContent = texto;
  mensagem.className = tipo;
}

function logout() {
  localStorage.removeItem("usuarioLogado");
  window.location.href = getLoginPath();
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
                <a class="status-link" href="${getHomePath()}">IR PARA INÍCIO</a>
            `;

      caixa.insertBefore(status, formulario);
    }
  }
}

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const senhaInput = document.getElementById("senha");
const cadastrarBtn = document.getElementById("cadastrarBtn");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();

    mostrarMensagem("", "");

    if (email === "" || senha === "") {
      mostrarMensagem("Preencha todos os campos.", "erro");
      return;
    }

    if (email === usuarioPadrao.email && senha === usuarioPadrao.senha) {
      const usuario = { ...usuarioPadrao };
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));

      mostrarMensagem(
        `Olá, ${usuario.nome}! Login realizado com sucesso.`,
        "sucesso",
      );

      setTimeout(function () {
        window.location.href = getHomePath();
      }, 1000);
    } else {
      mostrarMensagem("E-mail ou senha incorretos.", "erro");
    }
  });
}

if (cadastrarBtn) {
  cadastrarBtn.addEventListener("click", function () {
    alert("Sistema de cadastro ainda não configurado.");
  });
}

const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

atualizarEstadoLogin();
