/**
 * PORTFÓLIO — ISABELLY CASTELO DOS SANTOS SILVA
 * Fundamentos da Programação Web — UNINTER
 * JavaScript vanilla (sem frameworks ou bibliotecas externas)
 *
 * Funcionalidades implementadas:
 *  1. Alternância de tema claro/escuro com persistência em localStorage
 *  2. Menu hambúrguer responsivo (mobile)
 *  3. Marcação do link ativo na navegação via Intersection Observer
 *  4. Validação completa do formulário de contato
 *  5. Simulação de envio + modal de confirmação
 *  6. Scroll suave para âncoras (complementa o scroll-behavior: smooth do CSS)
 */

/* =============================================
   1. ALTERNÂNCIA DE TEMA CLARO / ESCURO
   ============================================= */

// Obtém referência ao botão de tema e ao body
const themeToggleBtn = document.getElementById('theme-toggle');
const body           = document.body;

/**
 * Aplica o tema informado ('light' ou 'dark') ao body
 * e salva a preferência no localStorage.
 * @param {string} tema - 'light' ou 'dark'
 */
function aplicarTema(tema) {
  if (tema === 'dark') {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
  }
  // Persiste a escolha para futuras visitas
  localStorage.setItem('tema', tema);
}

// Ao carregar a página, verifica se há preferência salva
const temaSalvo = localStorage.getItem('tema');
if (temaSalvo) {
  aplicarTema(temaSalvo);
} else {
  // Usa a preferência do sistema operacional como padrão
  const prefereEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  aplicarTema(prefereEscuro ? 'dark' : 'light');
}

// Alterna o tema ao clicar no botão
themeToggleBtn.addEventListener('click', function () {
  const temaAtual = body.classList.contains('dark-theme') ? 'dark' : 'light';
  aplicarTema(temaAtual === 'dark' ? 'light' : 'dark');
});


/* =============================================
   2. MENU HAMBÚRGUER (MOBILE)
   ============================================= */

const menuToggleBtn = document.getElementById('menu-toggle');
const mainNav       = document.getElementById('main-nav');

/**
 * Abre ou fecha o menu mobile, atualizando
 * o atributo aria-expanded para acessibilidade.
 */
function alternarMenu() {
  const estaAberto = mainNav.classList.toggle('open');
  menuToggleBtn.classList.toggle('open', estaAberto);
  menuToggleBtn.setAttribute('aria-expanded', estaAberto.toString());
}

menuToggleBtn.addEventListener('click', alternarMenu);

// Fecha o menu ao clicar em qualquer link de navegação (mobile)
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    if (mainNav.classList.contains('open')) {
      alternarMenu();
    }
  });
});


/* =============================================
   3. LINK ATIVO NA NAVEGAÇÃO (INTERSECTION OBSERVER)
   ============================================= */

// Lista de todas as seções que aparecem no menu
const secoes = document.querySelectorAll('section[id]');

/**
 * Marca o link do menu correspondente à seção
 * visível na tela como "active".
 * @param {IntersectionObserverEntry[]} entries
 */
function marcarLinkAtivo(entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      // Remove a classe "active" de todos os links
      navLinks.forEach(function (l) { l.classList.remove('active'); });

      // Adiciona "active" ao link que aponta para a seção visível
      const linkAtivo = document.querySelector('.nav-link[href="#' + entry.target.id + '"]');
      if (linkAtivo) {
        linkAtivo.classList.add('active');
      }
    }
  });
}

// Observa cada seção; dispara quando pelo menos 30% dela está visível
const observer = new IntersectionObserver(marcarLinkAtivo, {
  rootMargin: '-72px 0px 0px 0px', // compensa a altura do header fixo
  threshold: 0.3
});

secoes.forEach(function (secao) {
  observer.observe(secao);
});


/* =============================================
   4. VALIDAÇÃO DO FORMULÁRIO DE CONTATO
   ============================================= */

const form           = document.getElementById('contact-form');
const campoNome      = document.getElementById('nome');
const campoEmail     = document.getElementById('email');
const campoMensagem  = document.getElementById('mensagem');

const erroNome       = document.getElementById('nome-error');
const erroEmail      = document.getElementById('email-error');
const erroMensagem   = document.getElementById('mensagem-error');

/**
 * Verifica se uma string de e-mail tem formato válido.
 * Ex.: usuario@dominio.com
 * @param {string} email
 * @returns {boolean}
 */
function emailValido(email) {
  // Expressão regular para formato básico de e-mail
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

/**
 * Exibe a mensagem de erro em um campo e aplica classe visual.
 * @param {HTMLElement} campo   - input ou textarea
 * @param {HTMLElement} spanErro - elemento que exibe a mensagem
 * @param {string}      mensagem - texto do erro
 */
function mostrarErro(campo, spanErro, mensagem) {
  campo.classList.add('error');
  spanErro.textContent = mensagem;
}

/**
 * Limpa o estado de erro de um campo.
 * @param {HTMLElement} campo
 * @param {HTMLElement} spanErro
 */
function limparErro(campo, spanErro) {
  campo.classList.remove('error');
  spanErro.textContent = '';
}

// Remove o erro em tempo real quando o usuário corrige o campo
campoNome.addEventListener('input', function () {
  if (campoNome.value.trim().length > 0) limparErro(campoNome, erroNome);
});
campoEmail.addEventListener('input', function () {
  if (emailValido(campoEmail.value)) limparErro(campoEmail, erroEmail);
});
campoMensagem.addEventListener('input', function () {
  if (campoMensagem.value.trim().length > 0) limparErro(campoMensagem, erroMensagem);
});

/**
 * Valida todos os campos do formulário.
 * Retorna true apenas se todos estiverem corretos.
 * @returns {boolean}
 */
function validarFormulario() {
  var valido = true;

  // Validação do nome
  if (campoNome.value.trim() === '') {
    mostrarErro(campoNome, erroNome, 'Por favor, informe seu nome.');
    valido = false;
  } else {
    limparErro(campoNome, erroNome);
  }

  // Validação do e-mail
  if (campoEmail.value.trim() === '') {
    mostrarErro(campoEmail, erroEmail, 'Por favor, informe seu e-mail.');
    valido = false;
  } else if (!emailValido(campoEmail.value)) {
    mostrarErro(campoEmail, erroEmail, 'E-mail inválido. Use o formato usuario@dominio.com');
    valido = false;
  } else {
    limparErro(campoEmail, erroEmail);
  }

  // Validação da mensagem
  if (campoMensagem.value.trim() === '') {
    mostrarErro(campoMensagem, erroMensagem, 'Por favor, escreva sua mensagem.');
    valido = false;
  } else {
    limparErro(campoMensagem, erroMensagem);
  }

  return valido;
}


/* =============================================
   5. ENVIO DO FORMULÁRIO + MODAL DE CONFIRMAÇÃO
   ============================================= */

const modal          = document.getElementById('modal-confirmacao');
const modalOverlay   = document.getElementById('modal-overlay');
const modalFecharBtn = document.getElementById('modal-fechar');

/**
 * Exibe o modal de confirmação de envio.
 */
function abrirModal() {
  modal.hidden        = false;
  modalOverlay.hidden = false;
  modalFecharBtn.focus(); // Move o foco para o botão (acessibilidade)
}

/**
 * Fecha o modal de confirmação.
 */
function fecharModal() {
  modal.hidden        = true;
  modalOverlay.hidden = true;
}

// Fecha ao clicar no botão "Fechar"
modalFecharBtn.addEventListener('click', fecharModal);

// Fecha ao clicar no fundo escurecido
modalOverlay.addEventListener('click', fecharModal);

// Fecha ao pressionar Escape
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.hidden) {
    fecharModal();
  }
});

/**
 * Intercepta o envio do formulário,
 * valida os campos e simula o envio.
 * @param {Event} evento
 */
form.addEventListener('submit', function (evento) {
  // Impede o comportamento padrão (recarregar a página)
  evento.preventDefault();

  // Só prossegue se todos os campos forem válidos
  if (!validarFormulario()) {
    return;
  }

  // Simulação do envio: limpa o formulário e exibe o modal
  form.reset();
  limparErro(campoNome,     erroNome);
  limparErro(campoEmail,    erroEmail);
  limparErro(campoMensagem, erroMensagem);

  abrirModal();
});


/* =============================================
   6. SCROLL SUAVE PARA ÂNCORAS (via JavaScript)
   Garante compatibilidade em navegadores mais antigos.
   ============================================= */

document.querySelectorAll('a[href^="#"]').forEach(function (ancora) {
  ancora.addEventListener('click', function (e) {
    var alvoId = ancora.getAttribute('href').substring(1); // remove o '#'
    var alvo   = document.getElementById(alvoId);

    if (alvo) {
      e.preventDefault();
      // Calcula a posição descontando a altura do header fixo (72px)
      var posicao = alvo.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: posicao, behavior: 'smooth' });
    }
  });
});
