/* BLONDZ PRO USA — código común de las páginas del club (/blondz-pro/, /blondz-pro/my-club/, terms y privacy).
   - API: una sola constante. En localhost / 127.0.0.1 va al wrangler dev local (:8797); si no, al Worker publicado.
   - Idioma EN | ES: se guarda en localStorage «gp_idioma» (siempre con try/catch), cambia los textos sin recargar
     y actualiza <html lang>. Los textos fijos vienen dos veces en el HTML (data-l="en" / data-l="es") y el CSS
     muestra el del idioma activo; <option> y <title> usan data-t-en / data-t-es; los atributos (placeholder,
     aria-label, content...) usan data-i18n-attr="placeholder" + data-en-placeholder / data-es-placeholder.
   - Si el navegador está en español y ella todavía no eligió, la página sigue en inglés y se le sugiere el español.
   Debe andar en iPhone con Brave (WebKit): nada de lookbehind en regex. */
(function () {
  "use strict";

  // ---------- API (cámbiala aquí si el Worker cambia de dirección) ----------
  var LOCAL = location.hostname === "localhost" || location.hostname === "127.0.0.1";
  var API = LOCAL ? "http://localhost:8797" : "https://letos-club-us.casapadelcolombia.workers.dev";

  // ---------- almacenamiento local (puede fallar en modo privado o con datos bloqueados) ----------
  var memoria = {};
  function leer(k) {
    try {
      var v = window.localStorage.getItem(k);
      if (v !== null) return v;
    } catch (e) { /* sin localStorage: se usa la memoria */ }
    return Object.prototype.hasOwnProperty.call(memoria, k) ? memoria[k] : null;
  }
  function guardar(k, v) {
    memoria[k] = String(v);
    try { window.localStorage.setItem(k, String(v)); } catch (e) { /* queda solo en memoria */ }
  }
  function borrar(k) {
    delete memoria[k];
    try { window.localStorage.removeItem(k); } catch (e) { /* nada */ }
  }

  // ---------- idioma ----------
  var html = document.documentElement;
  var oyentes = [];
  function idioma() { return html.getAttribute("lang") === "es" ? "es" : "en"; }
  function elegido() { var v = leer("gp_idioma"); return v === "es" || v === "en" ? v : null; }
  // Del par {en, es} (o de un texto suelto) saca el del idioma activo.
  function t(par) { if (par == null) return ""; if (typeof par === "string") return par; return par[idioma()] != null ? par[idioma()] : par.en; }

  function aplicar() {
    var i = idioma(), k, n, els, el, nombres, v;
    els = document.querySelectorAll("[data-t-en]");
    for (k = 0; k < els.length; k++) {
      el = els[k];
      v = el.getAttribute("data-t-" + i);
      if (v != null) el.textContent = v;
    }
    els = document.querySelectorAll("[data-i18n-attr]");
    for (k = 0; k < els.length; k++) {
      el = els[k];
      nombres = el.getAttribute("data-i18n-attr").split(/\s+/);
      for (n = 0; n < nombres.length; n++) {
        if (!nombres[n]) continue;
        v = el.getAttribute("data-" + i + "-" + nombres[n]);
        if (v != null) el.setAttribute(nombres[n], v);
      }
    }
    els = document.querySelectorAll("[data-gp-lang]");
    for (k = 0; k < els.length; k++) els[k].setAttribute("aria-pressed", els[k].getAttribute("data-gp-lang") === i ? "true" : "false");
  }

  // recordar = true cuando ella lo elige (botón EN | ES o sugerencia).
  function ponerIdioma(i, recordar) {
    i = i === "es" ? "es" : "en";
    var antes = idioma();
    html.setAttribute("lang", i);
    if (recordar) { guardar("gp_idioma", i); quitarSugerencia(); }
    aplicar();
    if (antes !== i) for (var k = 0; k < oyentes.length; k++) { try { oyentes[k](i, recordar); } catch (e) { console.error(e); } }
  }
  function alCambiarIdioma(fn) { oyentes.push(fn); }

  // ---------- sugerencia de español ----------
  function quitarSugerencia() {
    var caja = document.getElementById("gp-sugiere");
    if (caja) caja.hidden = true;
    var sel = document.querySelectorAll(".gp-lang");
    for (var k = 0; k < sel.length; k++) sel[k].classList.remove("is-hint");
  }
  function sugerir() {
    var caja = document.getElementById("gp-sugiere");
    if (!caja) return;
    var nav = String((navigator.languages && navigator.languages[0]) || navigator.language || "");
    if (elegido() || idioma() === "es" || !/^es(-|_|$)/i.test(nav)) return;
    caja.hidden = false;
    var sel = document.querySelectorAll(".gp-lang");
    for (var k = 0; k < sel.length; k++) sel[k].classList.add("is-hint");
  }

  // ---------- llamadas a la API ----------
  var TXT_RED = {
    en: "We couldn't connect. Check your internet and try again.",
    es: "No pudimos conectarnos. Revisa tu internet e intenta de nuevo.",
  };
  var TXT_GENERAL = { en: "Something went wrong. Please try again.", es: "Algo falló. Intenta de nuevo." };

  // Devuelve siempre un objeto { ok, error?, errores?, ..., _status } (nunca lanza).
  function llamar(ruta, op) {
    op = op || {};
    var metodo = op.metodo || (op.cuerpo ? "POST" : "GET");
    var h = { Accept: "application/json" };
    if (op.token) h.Authorization = "Bearer " + op.token;
    var init = { method: metodo, headers: h, credentials: "omit", cache: "no-store" };
    var url = API + ruta;
    if (metodo === "POST") {
      var cuerpo = op.cuerpo || {};
      if (cuerpo.idioma == null) cuerpo.idioma = idioma();
      h["Content-Type"] = "application/json";
      init.body = JSON.stringify(cuerpo);
    } else {
      // El Worker contesta los errores de sesión en el idioma de ?idioma=.
      url += (url.indexOf("?") < 0 ? "?" : "&") + "idioma=" + idioma();
    }
    return fetch(url, init).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!j || typeof j !== "object" || Array.isArray(j)) j = {};
        j._status = r.status;
        if (!r.ok) j.ok = false;
        if (j.ok === false && !j.error) j.error = t(TXT_GENERAL);
        return j;
      });
    }, function () {
      return { ok: false, _status: 0, _red: true, error: t(TXT_RED) };
    });
  }

  // ---------- utilidades de texto y fecha ----------
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Fecha corta: «November 20» / «20 de noviembre». Acepta YYYY-MM-DD (se lee a mediodía UTC) o ISO.
  function fecha(v, conAnio) {
    if (!v) return "";
    var s = String(v), d;
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) d = new Date(s + "T12:00:00Z");
    else d = new Date(s);
    if (isNaN(d.getTime())) return s;
    var op = { month: "long", day: "numeric", timeZone: /^\d{4}-\d{2}-\d{2}$/.test(s) ? "UTC" : "America/New_York" };
    if (conAnio) op.year = "numeric";
    try { return d.toLocaleDateString(idioma() === "es" ? "es-US" : "en-US", op); }
    catch (e) { return s.slice(0, 10); }
  }
  function numero(n) {
    var x = Number(n) || 0;
    try { return x.toLocaleString(idioma() === "es" ? "es-US" : "en-US"); } catch (e) { return String(x); }
  }

  // ---------- arranque ----------
  function iniciar() {
    var els = document.querySelectorAll("[data-gp-lang]"), k;
    for (k = 0; k < els.length; k++) {
      els[k].addEventListener("click", function (ev) { ponerIdioma(ev.currentTarget.getAttribute("data-gp-lang"), true); });
    }
    els = document.querySelectorAll("[data-gp-sugiere]");
    for (k = 0; k < els.length; k++) {
      els[k].addEventListener("click", function (ev) {
        if (ev.currentTarget.getAttribute("data-gp-sugiere") === "es") ponerIdioma("es", true);
        else { guardar("gp_idioma", "en"); quitarSugerencia(); }
      });
    }
    els = document.querySelectorAll(".js-year");
    for (k = 0; k < els.length; k++) els[k].textContent = String(new Date().getFullYear());

    var header = document.querySelector(".site-header");
    if (header) {
      var marcar = function () { header.classList.toggle("is-scrolled", window.scrollY > 8); };
      window.addEventListener("scroll", marcar, { passive: true });
      marcar();
    }
    aplicar();
    sugerir();
  }

  window.GP = {
    API: API, LOCAL: LOCAL,
    leer: leer, guardar: guardar, borrar: borrar,
    idioma: idioma, elegido: elegido, ponerIdioma: ponerIdioma, alCambiarIdioma: alCambiarIdioma, aplicar: aplicar, t: t,
    llamar: llamar, esc: esc, fecha: fecha, numero: numero, TXT_RED: TXT_RED, TXT_GENERAL: TXT_GENERAL,
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", iniciar);
  else iniciar();
})();
