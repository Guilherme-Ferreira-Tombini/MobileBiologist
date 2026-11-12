function esc(x) {
  return String(x == null ? "" : x).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function F(id) { return document.getElementById(id).value; }
function num(x) { return parseFloat(String(x).replace(",", ".")); }

async function sha(t) {
  try {
    if (window.crypto && crypto.subtle) {
      var b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t));
      return Array.from(new Uint8Array(b))
        .map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    }
  } catch (e) {}
  var h = 5381;
  for (var i = 0; i < t.length; i++) h = ((h << 5) + h + t.charCodeAt(i)) | 0;
  return "f" + (h >>> 0).toString(16);
}

function fmtD(d) {
  var p = String(d).split("-");
  return p.length === 3 ? p[2] + "/" + p[1] + "/" + p[0] : d;
}