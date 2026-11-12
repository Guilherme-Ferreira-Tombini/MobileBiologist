var A = {
    tab: function (t) {
    s.tab = t;
    s.edit = s.editS = null;
    s.err = s.msg = "";
    closeMenu();
    render();
  },

  out: function () {
    s.user = null;
    s.err = "";
    closeMenu(); 
    render();
  },

  cancel: function () {
    s.edit = s.editS = null;
    s.err = "";
    render();
  },

  login: async function () {
    var u = F("l_u").trim();
    var h = await sha(F("l_p"));
    var x = db.users.find(function (a) { return a.username == u && a.pass == h; });

    if (x) {
      s.user = x;
      s.err = "";
      s.tab = "sources";
    } else {
      s.err = "Usuário ou senha inválidos.";
    }
    render();
  },

  newSrc: function () {
    s.edit = { name: "", location: "", lat: "", lng: "" };
    s.err = ""; render();
  },

  editSrc: function (i) {
    s.edit = Object.assign({}, db.sources.find(function (x) { return x.id == i; }));
    s.err = ""; render();
  },

  saveSrc: function () {
    var n = F("f_n").trim();
    if (!n) { s.err = "Informe o nome."; render(); return; }
    var o = { name: n, location: F("f_l"), lat: F("f_la"), lng: F("f_lo") };
    if (s.edit.id) {
      Object.assign(db.sources.find(function (x) { return x.id == s.edit.id; }), o);
    } else {
      o.id = db.seq++;
      db.sources.push(o);
    }
    save();
    s.edit = null; s.err = ""; render();
  },

  delSrc: function (i) {
    db.sources = db.sources.filter(function (x) { return x.id != i; });
    db.samples = db.samples.filter(function (x) { return x.sid != i; });
    save(); render();
  },

  filt: function (v) { s.filt = v; render(); },

  newSmp: function (sid) {
    s.tab = "samples";
    s.editS = {
      sid: sid || (db.sources[0] && db.sources[0].id),
      date: new Date().toISOString().slice(0, 10),
      temp: "", ph: "", nh3: "", no3: "", no2: "", notes: ""
    };
    s.err = ""; render();
  },

  editSmp: function (i) {
    s.editS = Object.assign({}, db.samples.find(function (x) { return x.id == i; }));
    s.err = ""; render();
  },

  saveSmp: function () {
    var o = {
      sid: +F("s_s"), date: F("s_d"),
      temp: num(F("s_t")), ph: num(F("s_p")),
      nh3: num(F("s_a")),  no3: num(F("s_n3")),
      no2: num(F("s_n2")), notes: F("s_o")
    };
    if (!o.sid || !o.date || [o.temp, o.ph, o.nh3, o.no3, o.no2].some(isNaN)) {
      s.err = "Preencha fonte, data e todos os valores numéricos."; render(); return;
    }
    if (o.ph < 0 || o.ph > 14) { s.err = "O pH deve estar entre 0 e 14."; render(); return; }
    if (s.editS.id) {
      Object.assign(db.samples.find(function (x) { return x.id == s.editS.id; }), o);
    } else {
      o.id = db.seq++;
      db.samples.push(o);
    }
    save(); s.editS = null; s.err = ""; render();
  },

  delSmp: function (i) {
    db.samples = db.samples.filter(function (x) { return x.id != i; });
    save(); render();
  },

  mon: function (d) {
    s.month = new Date(s.month.getFullYear(), s.month.getMonth() + d, 1);
    s.day = null; render();
  },

  day: function (k) { s.day = k; render(); },

  rep: function () {
    s.rep = { f: F("r_f"), op: F("r_o"), v: F("r_v") };
    render();
  },

  addUser: async function () {
    var n = F("u_n").trim(), p = F("u_p");
    if (!n || !p) { s.err = "Informe usuário e senha."; render(); return; }
    if (db.users.some(function (u) { return u.username == n; })) {
      s.err = "Esse usuário já existe."; render(); return;
    }
    db.users.push({ id: db.seq++, username: n, pass: await sha(p), role: F("u_r") });
    save(); s.err = ""; render();
  },

  delUser: function (i) {
    if (i == s.user.id) { s.err = "Você não pode excluir o próprio usuário."; render(); return; }
    db.users = db.users.filter(function (u) { return u.id != i; });
    save(); s.err = ""; render();
  },

  imp: function () {
    try {
      var o = JSON.parse(F("b_t"));
      if (!Array.isArray(o.sources) || !Array.isArray(o.samples)) throw 0;
      db.sources = o.sources; db.samples = o.samples;
      db.seq = o.seq || db.seq + 100;
      save(); s.err = ""; s.msg = "Importado com sucesso.";
    } catch (e) {
      s.err = "JSON inválido."; s.msg = "";
    }
    render();
  }
};