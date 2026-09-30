let intervalo;

function mostrarInformacao(card, nome, pagina, funcao, descricao) {

  const informacao = document.getElementById("informacao");
  const cards = document.querySelectorAll(".card");

  clearInterval(intervalo);

  cards.forEach(function (item) {
    item.classList.remove("ativo");
  });

  card.classList.add("ativo");

  informacao.innerHTML = `
    <strong>${nome}</strong><br>
    <b>Página desenvolvida:</b> ${pagina}<br>
    <b>Função no projeto:</b> ${funcao}<br><br>
    <span id="texto-digitado"></span>
  `;

  const texto = document.getElementById("texto-digitado");

  let i = 0;

  intervalo = setInterval(function () {

    texto.textContent += descricao[i];

    i++;

    if (i >= descricao.length) {
      clearInterval(intervalo);
    }

  }, 8);
}


/* ===== GUILHERME ===== */

function guilherme(card) {

  mostrarInformacao(
    card,
    "Guilherme Luciano Da Silva",
    "Comércio",
    "Pesquisa e desenvolvimento",
    "Guilherme participou do desenvolvimento geral do site e ficou responsável pela criação da página Comércio. Trabalhou na pesquisa e organização das informações sobre o comércio na Roma Antiga, além de desenvolver a estrutura da página e contribuir para sua apresentação visual. Também participou da organização dos conteúdos e dos elementos necessários para apresentar as informações de forma clara e organizada."
  );
}


/* ===== CAUÃ ===== */

function caua(card) {

  mostrarInformacao(
    card,
    "Cauã Wlodarczyk",
    "Mercadorias",
    "Pesquisa e desenvolvimento",
    "Cauã participou do desenvolvimento geral do site e ficou responsável pela criação da página Mercadorias. Trabalhou na pesquisa e organização das informações sobre os principais produtos comercializados na Roma Antiga, além de desenvolver a estrutura da página e contribuir para sua apresentação visual. Também participou da organização dos conteúdos e da construção dos elementos utilizados para apresentar as informações de forma clara."
  );
}


/* ===== KAIKI ===== */

function kaiki(card) {

  mostrarInformacao(
    card,
    "Kaiki De Souza Moreira",
    "Rotas",
    "Pesquisa e desenvolvimento",
    "Kaiki participou do desenvolvimento geral do site e ficou responsável pela criação da página Rotas. Trabalhou na pesquisa e organização das informações sobre as principais rotas comerciais da Roma Antiga, além de desenvolver a estrutura da página e contribuir para sua apresentação visual. Também participou da organização dos conteúdos e dos elementos necessários para apresentar as informações de forma clara e organizada."
  );
}


/* ===== ANDREUS ===== */

function andreus(card) {

  mostrarInformacao(
    card,
    "Andreus Cesar Coelho",
    "Tecnologias",
    "Desenvolvimento e organização",
    "Andreus participou do desenvolvimento geral do site e ficou responsável pela criação da página Tecnologias. Trabalhou principalmente com HTML, CSS e JavaScript, desenvolvendo a estrutura da página, seus elementos visuais e recursos interativos. Também contribuiu para a organização do projeto e para manter um padrão visual entre as diferentes páginas desenvolvidas pelo grupo."
  );
}


/* ===== BOTÃO VOLTAR AO TOPO ===== */

window.addEventListener("scroll", function () {

  const botao = document.getElementById("topo");

  if (window.scrollY > 400) {
    botao.style.display = "block";
  } else {
    botao.style.display = "none";
  }

});


function voltarAoTopo() {

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}
