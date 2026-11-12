var TABS = [
  ["sources", "Fontes de água"],
  ["samples", "Amostras"],
  ["cal",     "Calendário"],
  ["rep",     "Relatórios"],
  ["bk",      "Backup"]
];

function renderTabs() {
  var list = TABS.slice();
  if (s.user.role === "admin") list.splice(4, 0, ["users", "Usuários"]);

  var nav = document.getElementById("nav-tabs");
  
  var isOpen = nav.classList.contains("open");

  nav.innerHTML = list.map(function (x) {
    return '<button class="' + (s.tab === x[0] ? "on" : "") +
      '" onclick="A.tab(\'' + x[0] + '\')">' + x[1] + "</button>";
  }).join("");

  if (isOpen) nav.classList.add("open");
}

/** Abre o menu lateral no mobile */
function openMenu() {
  document.getElementById("nav-tabs").classList.add("open");
  document.getElementById("sidebar-overlay").hidden = false;
}

/** Fecha o menu lateral no mobile */
function closeMenu() {
  document.getElementById("nav-tabs").classList.remove("open");
  document.getElementById("sidebar-overlay").hidden = true;
}

/** Renderiza a tela atual. */
function render() {
  var loginScreen = document.getElementById("login-screen");
  var appScreen   = document.getElementById("app-screen");

  if (!s.user) {
    appScreen.hidden = true;
    loginScreen.hidden = false;
    document.getElementById("login-err").textContent = s.err;
    return;
  }

  loginScreen.hidden = true;
  appScreen.hidden = false;

  document.getElementById("user-info").textContent =
    s.user.username + " (" + s.user.role + ")";

  renderTabs();
  document.getElementById("view").innerHTML = VIEWS[s.tab]();
}

async function init() {
  db = load();

  if (!db) {
    db = await criarBancoInicial();
    save();
  }

  var ultima = db.samples.map(function (x) { return x.date; }).sort().pop();
  s.month = ultima ? new Date(ultima + "T12:00:00") : new Date();
  s.month.setDate(1);

  document.getElementById("btn-login").addEventListener("click", A.login);
  document.getElementById("l_p").addEventListener("keydown", function (e) {
    if (e.key === "Enter") A.login();
  });
  document.getElementById("btn-logout").addEventListener("click", A.out);

  document.getElementById("btn-menu").addEventListener("click", openMenu);
  document.getElementById("sidebar-overlay").addEventListener("click", closeMenu);

  render();
}

init().catch(function (e) {
  document.getElementById("app").innerHTML =
    '<div class="card"><p class="warn">Erro ao iniciar: ' + esc((e && e.message) || e) + "</p></div>";
});