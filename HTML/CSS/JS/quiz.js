const perguntas = [
  {
    pergunta: "Qual era uma das principais funções das estradas romanas?",
    alternativas: [
      "Servir apenas para cerimônias religiosas",
      "Facilitar o transporte de pessoas, tropas e mercadorias",
      "Impedir a circulação entre as províncias",
      "Ligar somente pequenas aldeias",
    ],
    resposta: 1,
  },

  {
    pergunta:
      "A Via Ápia foi importante principalmente para a ligação de Roma com:",
    alternativas: [
      "A Gália",
      "O sul da Península Itálica",
      "A Bretanha",
      "A Hispânia",
    ],
    resposta: 1,
  },

  {
    pergunta:
      "Por que as rotas marítimas eram fundamentais para o comércio romano?",
    alternativas: [
      "Porque permitiam o transporte de grandes quantidades de mercadorias",
      "Porque substituíam todas as estradas",
      "Porque eram utilizadas apenas pelo exército",
      "Porque impediam o comércio terrestre",
    ],
    resposta: 0,
  },

  {
    pergunta:
      "Qual função estava diretamente relacionada à administração das províncias romanas?",
    alternativas: [
      "Arrecadação de tributos",
      "Produção de todas as mercadorias",
      "Construção exclusiva de templos",
      "Controle apenas das atividades religiosas",
    ],
    resposta: 0,
  },

  {
    pergunta:
      "Além da função militar, as estradas romanas contribuíam diretamente para:",
    alternativas: [
      "O isolamento das províncias",
      "A redução das cidades",
      "A circulação comercial e administrativa",
      "A proibição do comércio marítimo",
    ],
    resposta: 2,
  },

  {
    pergunta: "Qual era uma característica importante do Direito Romano?",
    alternativas: [
      "Ser utilizado apenas pelo exército",
      "Regular somente o comércio",
      "Ser exclusivamente religioso",
      "Organizar relações jurídicas e sociais por meio de leis",
    ],
    resposta: 3,
  },

  {
    pergunta:
      "Qual via romana conectava regiões dos Bálcãs ao sistema de circulação oriental?",
    alternativas: ["Via Aurélia", "Via Cássia", "Via Egnácia", "Via Flamínia"],
    resposta: 2,
  },

  {
    pergunta: "Por que a moeda favorecia a expansão do comércio romano?",
    alternativas: [
      "Facilitava pagamentos e transações comerciais",
      "Eliminava a necessidade de mercadorias",
      "Era utilizada exclusivamente pelos soldados",
      "Impedía o comércio entre províncias",
    ],
    resposta: 0,
  },

  {
    pergunta:
      "A integração territorial romana dependia principalmente da combinação entre:",
    alternativas: [
      "Religião, isolamento e agricultura",
      "Portos, muralhas e ausência de leis",
      "Estradas, administração e forças militares",
      "Exército, templos e proibição comercial",
    ],
    resposta: 2,
  },

  {
    pergunta:
      "Qual alternativa melhor explica a importância das vias romanas para o Império?",
    alternativas: [
      "Tinham função exclusivamente militar",
      "Eram utilizadas somente dentro da cidade de Roma",
      "Serviam principalmente para cerimônias públicas",
      "Permitiam a circulação de pessoas, mercadorias, informações e tropas",
    ],
    resposta: 3,
  },
];

let atual = 0;
let pontos = 0;
let escolha = null;

const $ = (id) => document.getElementById(id);

function mostrar() {
  const q = perguntas[atual];

  $("pergunta").textContent = q.pergunta;
  $("numero-questao").textContent =
    `QUESTÃO ${atual + 1} DE ${perguntas.length}`;

  $("pontuacao").textContent = `PONTOS: ${pontos}`;

  $("progresso").style.width = `${((atual + 1) / perguntas.length) * 100}%`;

  $("alternativas").innerHTML = "";
  escolha = null;

  q.alternativas.forEach((texto, i) => {
    const botao = document.createElement("button");

    botao.textContent = texto;
    botao.className = "alternativa";

    botao.onclick = () => {
      document
        .querySelectorAll(".alternativa")
        .forEach((b) => b.classList.remove("selecionada"));

      botao.classList.add("selecionada");
      escolha = i;
      if (i === q.resposta) {
        botao.classList.add("correta");
        botao.classList.add("acertou");
      } else {
        botao.classList.add("errada");
      }
    };
    $("alternativas").appendChild(botao);
  });
}

$("proximo").onclick = () => {
  if (escolha === null) return;
  if (escolha === perguntas[atual].resposta) pontos++;
  atual++;
  atual < perguntas.length ? mostrar() : resultado();
};

function resultado() {
  $("quiz-conteudo").style.display = "none";
  $("proximo").style.display = "none";
  $("resultado").style.display = "block";

  $("pontuacao-final").textContent = `${pontos} de ${perguntas.length} pontos`;

  $("mensagem-final").textContent =
    pontos >= 8
      ? "Excelente domínio dos conteúdos."
      : pontos >= 5
        ? "Bom conhecimento, mas alguns conteúdos podem ser revisados."
        : "Revise os conteúdos das páginas e tente novamente.";
}

$("reiniciar").onclick = () => {
  atual = 0;
  pontos = 0;

  $("quiz-conteudo").style.display = "block";
  $("proximo").style.display = "block";
  $("resultado").style.display = "none";

  mostrar();
};

mostrar();
