var KEY = "mobilebiologist_v1";
var mem = null;
var db = null;

var s = {
  tab: "sources", user: null,
  edit: null, editS: null,
  month: null, day: null,
  filt: "", rep: { f: "ph", op: ">", v: "" },
  err: "", msg: ""
};

var FL = {
  temp: "Temperatura", ph: "pH",
  nh3: "Amônia", no3: "Nitrato", no2: "Nitrito"
};

function save() {
  var j = JSON.stringify(db);
  try { localStorage.setItem(KEY, j); } catch (e) { mem = j; }
}

function load() {
  var j = null;
  try { j = localStorage.getItem(KEY); } catch (e) {}
  if (!j) j = mem;
  try { return j ? JSON.parse(j) : null; } catch (e) { return null; }
}

async function criarBancoInicial() {
  return {
    seq: 10,
    users: [
      { id: 1, username: "admin",   pass: await sha("admin"),   role: "admin" },
      { id: 2, username: "biologo", pass: await sha("biologo"), role: "biologo" }
    ],
    sources: [
      { id: 1, name: "Lago dos Modelos",     location: "Parque Central", lat: "-20.4697", lng: "-54.6201" },
      { id: 2, name: "Lagoa das Tartarugas", location: "Reserva Norte",  lat: "-20.4412", lng: "-54.5890" },
      { id: 3, name: "Reservatório",         location: "Zona Leste",     lat: "-20.5102", lng: "-54.5533" }
    ],
    samples: [
      { id: 1, sid: 3, date: "2003-06-12", temp: 56, ph: 5.8, nh3: 0.6, no3: 70, no2: 1.0,
        notes: "A água parece ruim, provavelmente por causa da chuva longa" },
      { id: 2, sid: 2, date: "2003-06-01", temp: 76, ph: 5.8, nh3: 0.2, no3: 20, no2: 0.4,
        notes: "Esta água tem cheiro estranho" }
    ]
  };
}

function srcName(id) {
  var x = db.sources.find(function (a) { return a.id == id; });
  return x ? x.name : "?";
}