/* BLONDZ PRO USA — formulario de postulación de /blondz-pro/ → POST /api/solicitud (solicitud.js del Worker).
   Manda los mismos campos que lee el Worker; los errores llegan ya traducidos al idioma enviado (campo «idioma»)
   y se muestran debajo de cada campo. «sitio_web» es la trampa para bots (oculta). «ref» sale de ?ref= y
   «origen» de los utm_* o del referrer. Depende de girlz-pro.js (window.GP). */
(function () {
  "use strict";
  var GP = window.GP;
  var form = document.getElementById("gp-form");
  if (!GP || !form) return;

  var ESTADOS = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", CO: "Colorado", CT: "Connecticut",
    DE: "Delaware", DC: "District of Columbia", FL: "Florida", GA: "Georgia", HI: "Hawaii", ID: "Idaho", IL: "Illinois",
    IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana",
    NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico", NY: "New York",
    NC: "North Carolina", ND: "North Dakota", OH: "Ohio", OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania",
    RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah",
    VT: "Vermont", VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
  };
  var MSG = {
    acepta: { en: "Please check this box to continue.", es: "Marca esta casilla para continuar." },
    revisa: { en: "Please check the highlighted fields.", es: "Revisa los campos marcados." },
  };

  // ---------- estados de EE. UU. (orden alfabético por nombre) ----------
  var sel = document.getElementById("f-estado");
  Object.keys(ESTADOS).sort(function (a, b) { return ESTADOS[a] < ESTADOS[b] ? -1 : 1; }).forEach(function (k) {
    var o = document.createElement("option");
    o.value = k;
    o.textContent = ESTADOS[k];
    sel.appendChild(o);
  });

  // ---------- fecha de nacimiento: como máximo hoy menos 18 años ----------
  (function () {
    var h = new Date(), y = h.getFullYear() - 18;
    var m = String(h.getMonth() + 1), d = String(h.getDate());
    document.getElementById("f-nacimiento").max = y + "-" + (m.length < 2 ? "0" + m : m) + "-" + (d.length < 2 ? "0" + d : d);
  })();

  // ---------- ref (?ref=CODIGO) y origen (utm_* o referrer externo) ----------
  var q;
  try { q = new URLSearchParams(location.search); } catch (e) { q = { get: function () { return null; } }; }
  var ref = String(q.get("ref") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  if (ref) {
    GP.guardar("gp_ref", ref);
  } else {
    ref = String(GP.leer("gp_ref") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 20);
  }
  document.getElementById("f-ref").value = ref;
  if (ref) {
    document.getElementById("gp-ref-cod").textContent = ref;
    document.getElementById("gp-ref-nota").hidden = false;
  }
  var utm = ["utm_source", "utm_medium", "utm_campaign"].map(function (k) { return String(q.get(k) || "").trim(); }).filter(Boolean).join("/");
  var refer = "";
  try { if (document.referrer && new URL(document.referrer).host !== location.host) refer = document.referrer; } catch (e) { refer = ""; }
  document.getElementById("f-origen").value = (utm || refer).slice(0, 200);

  // ---------- idioma de los correos: sigue al selector EN | ES mientras ella no lo cambie a mano ----------
  var idiomaTocado = false;
  function marcarIdioma(i) {
    var r = form.querySelector('input[name="idioma"][value="' + (i === "es" ? "es" : "en") + '"]');
    if (r) r.checked = true;
  }
  marcarIdioma(GP.idioma());
  Array.prototype.forEach.call(form.querySelectorAll('input[name="idioma"]'), function (r) {
    r.addEventListener("change", function () { idiomaTocado = true; });
  });
  GP.alCambiarIdioma(function (i) { if (!idiomaTocado) marcarIdioma(i); });

  // ---------- errores ----------
  function limpiarErrores() {
    Array.prototype.forEach.call(form.querySelectorAll(".gp-err"), function (p) { p.textContent = ""; });
    Array.prototype.forEach.call(form.querySelectorAll(".is-error"), function (x) { x.classList.remove("is-error"); });
    Array.prototype.forEach.call(form.querySelectorAll('[aria-invalid="true"]'), function (x) { x.removeAttribute("aria-invalid"); });
    document.getElementById("gp-form-aviso").textContent = "";
  }
  function ponerError(campo, texto) {
    var p = document.getElementById("e-" + campo);
    var caja = form.querySelector('[data-campo="' + campo + '"]');
    if (!p && caja) p = caja.querySelector(".gp-err");
    if (p) p.textContent = texto;
    if (caja) {
      caja.classList.add("is-error");
      var inp = caja.querySelector("input, select, textarea");
      if (inp) inp.setAttribute("aria-invalid", "true");
    }
    return caja;
  }
  function enfocar(caja) {
    if (!caja) return;
    var inp = caja.querySelector("input:not([type=hidden]), select, textarea");
    try { caja.scrollIntoView({ block: "center", behavior: "smooth" }); } catch (e) { caja.scrollIntoView(); }
    if (inp) setTimeout(function () { try { inp.focus({ preventScroll: true }); } catch (e) { inp.focus(); } }, 250);
  }

  // ---------- envío ----------
  var enviando = false;
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (enviando) return;
    limpiarErrores();
    var v = function (n) { var el = form.elements[n]; return el ? String(el.value || "").trim() : ""; };
    var marcados = function (n) {
      return Array.prototype.filter.call(form.querySelectorAll('input[name="' + n + '"]'), function (x) { return x.checked; }).map(function (x) { return x.value; });
    };
    var cuerpo = {
      nombre: v("nombre"), correo: v("correo"), nacimiento: v("nacimiento"), telefono: v("telefono"),
      estado_us: v("estado_us"), ciudad: v("ciudad"),
      instagram: v("instagram").replace(/^@+/, ""), tiktok: v("tiktok").replace(/^@+/, ""),
      red_principal: marcados("red_principal")[0] || "instagram",
      seguidores: v("seguidores").replace(/[^\d]/g, ""),
      cabello: marcados("cabello"), marcas: marcados("marcas"), porque: v("porque"),
      idioma: marcados("idioma")[0] || GP.idioma(),
      acepta_terminos: form.elements.acepta_terminos.checked === true,
      acepta_privacidad: form.elements.acepta_privacidad.checked === true,
      autoriza_uso: form.elements.autoriza_uso.checked === true,
      sitio_web: v("sitio_web"), ref: v("ref"), origen: v("origen"),
    };

    // Las 3 casillas se revisan antes de enviar (el Worker también las exige).
    var primera = null;
    ["acepta_terminos", "acepta_privacidad", "autoriza_uso"].forEach(function (k) {
      if (!cuerpo[k]) { var c = ponerError(k, GP.t(MSG.acepta)); primera = primera || c; }
    });

    var boton = document.getElementById("gp-enviar");
    enviando = true;
    boton.disabled = true;
    boton.setAttribute("aria-busy", "true");
    GP.llamar("/api/solicitud", { cuerpo: cuerpo }).then(function (r) {
      enviando = false;
      boton.disabled = false;
      boton.removeAttribute("aria-busy");
      if (r.ok) {
        form.hidden = true;
        var listo = document.getElementById("gp-listo");
        document.getElementById("gp-listo-repetida").hidden = !r.repetida;
        document.getElementById("gp-listo-nueva").hidden = !!r.repetida;
        listo.hidden = false;
        try { listo.scrollIntoView({ block: "center" }); } catch (e) { /* nada */ }
        listo.focus();
        GP.borrar("gp_ref");
        return;
      }
      var errs = r.errores && typeof r.errores === "object" ? r.errores : {};
      Object.keys(errs).forEach(function (k) {
        var c = ponerError(k, String(errs[k]));
        if (!primera || (c && primera.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_PRECEDING)) primera = c || primera;
      });
      document.getElementById("gp-form-aviso").textContent = r.error || GP.t(MSG.revisa);
      if (primera) enfocar(primera);
      else enfocar(document.getElementById("gp-form-aviso").parentNode.querySelector(".gp-enviar"));
    });
  });
})();
