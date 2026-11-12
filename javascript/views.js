function sRow(x) {
  return "<tr><td>" + fmtD(x.date) + "</td><td>" + esc(srcName(x.sid)) + "</td><td>" +
    x.temp + "</td><td>" + x.ph + "</td><td>" + x.nh3 + "</td><td>" + x.no3 +
    "</td><td>" + x.no2 + "</td><td>" + esc(x.notes) + "</td>";
}

/* ---------- Fontes ---------- */
function vSources() {
  var e = s.edit, f = "";

  if (e) {
    f = '<div class="card"><h2>' + (e.id ? "Editar fonte" : "Nova fonte") + "</h2>" +
      '<div class="g">' +
      '<div><label>Nome</label><input id="f_n" value="' + esc(e.name) + '"></div>' +
      '<div><label>Local</label><input id="f_l" value="' + esc(e.location) + '"></div>' +
      '<div><label>Latitude</label><input id="f_la" value="' + esc(e.lat) + '"></div>' +
      '<div><label>Longitude</label><input id="f_lo" value="' + esc(e.lng) + '"></div>' +
      '</div><div class="row">' +
      '<button class="p" onclick="A.saveSrc()">Salvar</button>' +
      '<button onclick="A.cancel()">Cancelar</button>' +
      '<span class="err">' + esc(s.err) + "</span></div></div>";
  }

  var r = db.sources.map(function (x) {
    var n = db.samples.filter(function (a) { return a.sid == x.id; }).length;
    return "<tr><td>" + esc(x.name) + "</td><td>" + esc(x.location) + "</td><td>" +
      esc(x.lat) + ", " + esc(x.lng) + '</td><td><span class="badge">' + n +
      '</span></td><td class="row">' +
      '<button class="s" onclick="A.newSmp(' + x.id + ')">+ Amostra</button>' +
      '<button class="s" onclick="A.editSrc(' + x.id + ')">Editar</button>' +
      '<button class="s d" onclick="A.delSrc(' + x.id + ')">Excluir</button></td></tr>';
  }).join("");

  return f + '<div class="card">' +
    '<div class="row" style="justify-content:space-between">' +
    "<h2>Fontes de água</h2>" +
    '<button class="p" onclick="A.newSrc()">+ Nova fonte</button>' +
    '</div><div class="sc"><table>' +
    "<tr><th>Nome</th><th>Local</th><th>Coordenadas</th><th>Amostras</th><th></th></tr>" +
    (r || '<tr><td colspan="5" class="mu">Nenhuma fonte cadastrada.</td></tr>') +
    "</table></div></div>";
}

/* ---------- Amostras ---------- */
function vSamples() {
  var e = s.editS, f = "";

  if (e) {
    var o = db.sources.map(function (x) {
      return '<option value="' + x.id + '"' + (x.id == e.sid ? " selected" : "") + ">" +
        esc(x.name) + "</option>";
    }).join("");

    f = '<div class="card"><h2>' + (e.id ? "Editar amostra" : "Nova amostra") + "</h2>" +
      '<div class="g">' +
      '<div><label>Fonte</label><select id="s_s">' + o + "</select></div>" +
      '<div><label>Data</label><input id="s_d" type="date" value="' + esc(e.date) + '"></div>' +
      '<div><label>Temperatura</label><input id="s_t" type="number" step="any" value="' + esc(e.temp) + '"></div>' +
      '<div><label>pH</label><input id="s_p" type="number" step="any" value="' + esc(e.ph) + '"></div>' +
      '<div><label>Amônia</label><input id="s_a" type="number" step="any" value="' + esc(e.nh3) + '"></div>' +
      '<div><label>Nitrato</label><input id="s_n3" type="number" step="any" value="' + esc(e.no3) + '"></div>' +
      '<div><label>Nitrito</label><input id="s_n2" type="number" step="any" value="' + esc(e.no2) + '"></div>' +
      '</div><label>Observações</label>' +
      '<textarea id="s_o" rows="2">' + esc(e.notes) + "</textarea>" +
      '<div class="row" style="margin-top:10px">' +
      '<button class="p" onclick="A.saveSmp()">Salvar</button>' +
      '<button onclick="A.cancel()">Cancelar</button>' +
      '<span class="err">' + esc(s.err) + "</span></div></div>";
  }

  var fo = '<option value="">Todas as fontes</option>' +
    db.sources.map(function (x) {
      return '<option value="' + x.id + '"' + (s.filt == x.id ? " selected" : "") + ">" +
        esc(x.name) + "</option>";
    }).join("");

  var l = db.samples.filter(function (x) {
    return !s.filt || x.sid == s.filt;
  }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

  var r = l.map(function (x) {
    return sRow(x) +
      '<td class="row">' +
      '<button class="s" onclick="A.editSmp(' + x.id + ')">Editar</button>' +
      '<button class="s d" onclick="A.delSmp(' + x.id + ')">Excluir</button>' +
      "</td></tr>";
  }).join("");

  return f + '<div class="card">' +
    '<div class="row" style="justify-content:space-between">' +
    "<h2>Amostras</h2>" +
    '<div class="row">' +
    '<select style="width:auto" onchange="A.filt(this.value)">' + fo + "</select>" +
    '<button class="p" onclick="A.newSmp()">+ Nova amostra</button>' +
    "</div></div><div class=\"sc\"><table>" +
    "<tr><th>Data</th><th>Fonte</th><th>Temp.</th><th>pH</th><th>NH₃</th><th>NO₃</th><th>NO₂</th><th>Notas</th><th></th></tr>" +
    (r || '<tr><td colspan="9" class="mu">Nenhuma amostra.</td></tr>') +
    "</table></div></div>";
}

/* ---------- Calendário ---------- */
function vCal() {
  var m = s.month,
      y = m.getFullYear(),
      mo = m.getMonth(),
      first = new Date(y, mo, 1).getDay(),
      n = new Date(y, mo + 1, 0).getDate();

  var nm = m.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  var h = ["D", "S", "T", "Q", "Q", "S", "S"].map(function (x) {
    return '<div class="h">' + x + "</div>";
  }).join("");

  for (var i = 0; i < first; i++) h += "<div class='h'></div>";

  for (var d = 1; d <= n; d++) {
    var k = y + "-" + String(mo + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0");
    var c = db.samples.filter(function (x) { return x.date == k; }).length;

    h += '<div class="' + (c ? "has" : "") + (s.day == k ? " sel" : "") + '"' +
      (c ? ' onclick="A.day(\'' + k + '\')"' : "") + ">" + d +
      (c ? ' <span class="badge">' + c + "</span>" : "") + "</div>";
  }

  var det = "";
  if (s.day) {
    var l = db.samples.filter(function (x) { return x.date == s.day; });
    det = '<h2 style="margin-top:14px">' + fmtD(s.day) + "</h2>" +
      '<div class="sc"><table>' +
      "<tr><th>Data</th><th>Fonte</th><th>Temp.</th><th>pH</th><th>NH₃</th><th>NO₃</th><th>NO₂</th><th>Notas</th></tr>" +
      l.map(function (x) { return sRow(x) + "</tr>"; }).join("") +
      "</table></div>";
  }

  return '<div class="card">' +
    '<div class="row cal-header">' +
    '<button onclick="A.mon(-1)">←</button>' +
    '<h2 class="cal-title">' + nm + "</h2>" +
    '<button onclick="A.mon(1)">→</button>' +
    '</div><div class="cal">' + h + "</div>" + det + "</div>";
}

/* ---------- Relatórios ---------- */
function vRep() {
  var r = s.rep;

  var fo = Object.keys(FL).map(function (k) {
    return '<option value="' + k + '"' + (r.f == k ? " selected" : "") + ">" + FL[k] + "</option>";
  }).join("");

  var po = [">", "<", "=", ">=", "<="].map(function (k) {
    return "<option" + (r.op == k ? " selected" : "") + ">" + esc(k) + "</option>";
  }).join("");

  var res = "";
  if (r.v !== "" && !isNaN(parseFloat(r.v))) {
    var v = parseFloat(r.v);
    var l = db.samples.filter(function (x) {
      var a = parseFloat(x[r.f]);
      return r.op == ">" ? a > v : r.op == "<" ? a < v
           : r.op == "=" ? a == v : r.op == ">=" ? a >= v : a <= v;
    });
    res = '<p class="mu">' + l.length + " amostra(s) encontrada(s)</p>" +
      (l.length
        ? '<div class="sc"><table>' +
          "<tr><th>Data</th><th>Fonte</th><th>Temp.</th><th>pH</th><th>NH₃</th><th>NO₃</th><th>NO₂</th><th>Notas</th></tr>" +
          l.map(function (x) { return sRow(x) + "</tr>"; }).join("") +
          "</table></div>"
        : "");
  }

  return '<div class="card"><h2>Relatório de amostras</h2>' +
    '<div class="row">' +
    '<select id="r_f" style="width:auto">' + fo + "</select>" +
    '<select id="r_o" style="width:auto">' + po + "</select>" +
    '<input id="r_v" type="number" step="any" style="width:120px" value="' + esc(r.v) + '">' +
    '<button class="p" onclick="A.rep()">Gerar</button>' +
    "</div>" + res + "</div>";
}

/* ---------- Usuários ---------- */
function vUsers() {
  var r = db.users.map(function (u) {
    return "<tr><td>" + esc(u.username) + "</td><td>" + esc(u.role) +
      '</td><td><button class="s d" onclick="A.delUser(' + u.id + ')">Excluir</button></td></tr>';
  }).join("");

  return '<div class="card"><h2>Novo usuário</h2>' +
    '<div class="g">' +
    '<div><label>Usuário</label><input id="u_n"></div>' +
    '<div><label>Senha</label><input id="u_p" type="password"></div>' +
    '<div><label>Papel</label><select id="u_r"><option>biologo</option><option>admin</option></select></div>' +
    '</div><div class="row">' +
    '<button class="p" onclick="A.addUser()">Adicionar</button>' +
    '<span class="err">' + esc(s.err) + "</span></div></div>" +
    '<div class="card"><h2>Usuários</h2><div class="sc"><table>' +
    "<tr><th>Usuário</th><th>Papel</th><th></th></tr>" + r +
    "</table></div></div>";
}

/* ---------- Backup ---------- */
function vBk() {
  return '<div class="card"><h2>Backup e sincronização manual</h2>' +
    '<p class="mu">Os dados ficam no armazenamento do navegador. Copie o JSON abaixo para guardar um backup, ou cole outro JSON para importar (substitui os dados atuais). Serve também para levar amostras de um aparelho para outro.</p>' +
    '<textarea id="b_t" rows="9" placeholder="JSON">' +
    esc(JSON.stringify({ sources: db.sources, samples: db.samples, seq: db.seq })) +
    '</textarea><div class="row" style="margin-top:10px">' +
    '<button class="p" onclick="A.imp()">Importar JSON</button>' +
    '<span class="err">' + esc(s.err) + "</span>" +
    '<span class="ok">' + esc(s.msg) + "</span></div></div>";
}

var VIEWS = {
  sources: vSources,
  samples: vSamples,
  cal:     vCal,
  rep:     vRep,
  users:   vUsers,
  bk:      vBk
};