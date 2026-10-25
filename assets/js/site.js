/* Blondz Only — landing behaviour. Data lives in window.BLONDZ (index.html). */
(() => {
  document.documentElement.classList.remove("no-js");
  const C = window.BLONDZ;
  if (!C) return;

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  const canAutoplay = !reduceMotion && !saveData;
  const mobile = matchMedia("(max-width: 860px)");
  const byId = Object.fromEntries(C.shades.map((s) => [s.id, s]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
  };
  const params = new URLSearchParams(location.search);

  /* ---------- store region: ?region= > saved choice > time zone > US ---------- */
  function guessRegion() {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (/^Europe\//.test(tz) || /^Atlantic\/(Canary|Madeira|Faroe|Reykjavik)/.test(tz)) return "eu";
    } catch (e) { /* old browser */ }
    return "us";
  }
  const savedRegion = store.get("bz-region");
  let region = C.regions[params.get("region")] ? params.get("region")
    : C.regions[savedRegion] ? savedRegion : guessRegion();
  const R = () => C.regions[region];

  // Picked in <head> (?shade= link, else the last shade) so the hero loads the right photos first.
  const urlShade = params.get("shade");
  let current = byId[C.initShade] ? C.initShade
    : byId[urlShade] ? urlShade : byId[store.get("bz-shade")] ? store.get("bz-shade") : C.shades[0].id;

  /* ---------- stars with an exact partial fill (4.3 shows 4 stars and a third) ---------- */
  function starsHTML(value) {
    const v = parseFloat(value) || 0;
    let out = "";
    for (let i = 0; i < 5; i++) {
      const f = Math.round(Math.max(0, Math.min(1, v - i)) * 100);
      out += `<svg style="--f:${f}%"><use href="#i-star"/></svg>`;
    }
    return out;
  }

  /* ---------- shelf ---------- */
  const shelf = $(".js-shelf");
  const bottleSet = (s) => [560, 740].map((h) => `assets/img/bottle-${s.id}-${h}.webp ${Math.round((s.bottleWidth * h) / 1100)}w`)
    .concat(`assets/img/bottle-${s.id}.webp ${s.bottleWidth}w`).join(", ");
  const fineHover = matchMedia("(hover: hover) and (pointer: fine)").matches;

  function renderShelf() {
    if (!shelf) return;
    const reg = R();
    shelf.innerHTML = C.shades.map((s) => `
      <article class="shade-col${s.id === current ? " is-active" : ""}" data-shade="${s.id}" style="--tint:${s.tint};--accent:${s.accent}">
        <p class="shade-pack">${s.pack}</p>
        <button class="shade-figure" type="button" data-photos="${s.id}" aria-label="See photos of ${s.name}">
          <img class="shade-bottle" src="assets/img/bottle-${s.id}-740.webp" srcset="${bottleSet(s)}" sizes="(max-width: 860px) 97px, 117px" alt="${s.name} ${s.kicker.toLowerCase()}, ${reg.size} bottle" width="${s.bottleWidth}" height="1100" loading="lazy">
        </button>
        <h3 class="shade-name">${s.name}</h3>
        <p class="shade-line">${s.line}</p>
        <p class="shade-rating"><span class="stars" aria-hidden="true">${starsHTML(reg.rating.value)}</span><span>${reg.rating.value} <span class="shade-count">(${reg.rating.count})</span></span><span class="visually-hidden">out of 5 stars from ${reg.rating.count} ratings on ${reg.rating.source || reg.store}</span></p>
        <p class="shade-for">${s.forWhom}</p>
        <div class="shade-price"><strong>${s.price[region]}</strong><span>${reg.size}</span></div>
        <div class="shade-actions">
          <a class="btn btn-dark" href="${s.amazon[region]}" target="_blank" rel="noopener"><span>Buy on ${reg.store}<span class="visually-hidden">, ${s.name}</span></span></a>
          <button class="shade-photos" type="button" data-photos="${s.id}">See all ${s.gallery.length} photos</button>
        </div>
      </article>`).join("");

    // A slight turn of the bottle toward the pointer (desktop only).
    if (!reduceMotion && fineHover) {
      $$(".shade-col", shelf).forEach((col) => {
        const bottle = $(".shade-bottle", col);
        col.addEventListener("pointermove", (e) => {
          const b = col.getBoundingClientRect();
          const x = (e.clientX - b.left) / b.width - 0.5;
          bottle.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
          bottle.style.setProperty("--ty", "-6px");
        });
        col.addEventListener("pointerleave", () => {
          bottle.style.setProperty("--ry", "0deg");
          bottle.style.setProperty("--ty", "0px");
        });
      });
    }
  }
  if (shelf) {
    shelf.addEventListener("click", (e) => {
      const col = e.target.closest(".shade-col");
      if (!col || e.target.closest("a")) return;
      if (col.dataset.shade !== current) setShade(col.dataset.shade, { source: "shelf" });
    });
  }

  /* ---------- region-dependent text ---------- */
  function applyRegion() {
    const reg = R();
    const r = reg.rating;
    const src = r.source || reg.store; // where the ratings are counted (global Amazon for Europe)
    document.documentElement.dataset.region = region;
    $$(".js-stars").forEach((el) => (el.innerHTML = starsHTML(r.value)));
    $$(".js-rating").forEach((el) => (el.textContent = `${r.value} out of 5 from ${r.count} ${src} ratings`));
    $$(".js-announce").forEach((el) => (el.textContent = `Rated ${r.value} out of 5 by ${r.count} shoppers on ${src}.`));
    $$(".js-score").forEach((el) => (el.textContent = r.value));
    $$(".js-score-meta").forEach((el) => (el.textContent = `out of 5, from ${r.count} ratings (${r.checked})`));
    $$(".js-reviews").forEach((el) => {
      el.href = reg.reviewsUrl;
      el.textContent = `Read the reviews on ${reg.store}`;
    });
    $$(".js-store").forEach((el) => (el.textContent = reg.store));
    $$(".js-rating-source").forEach((el) => (el.textContent = src));
    $$(".js-shades-intro").forEach((el) => (el.textContent = `Every mask is ${reg.size}, made with argan oil and biotin, and ${reg.shipping}.`));
    $$(".reel").forEach((reel) => {
      const a = $("figcaption a", reel);
      const s = byId[reel.dataset.shade];
      if (a && s) {
        a.href = s.amazon[region];
        a.innerHTML = `Buy on ${reg.store}<span class="visually-hidden">, ${s.name}</span>`;
      }
    });
    $$(".lineup-item").forEach((a) => (a.href = byId[a.dataset.shade].amazon[region]));
    // header switch
    $$(".js-region-flag").forEach((u) => u.setAttribute("href", `#flag-${region}`));
    $$(".js-region-code").forEach((el) => (el.textContent = reg.short));
    $$(".js-region-label").forEach((el) => (el.textContent = `Store: ${reg.label}. Change store`));
    $$(".region-menu [data-region]").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.region === region)));
    renderShelf();
  }

  $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- region menu ---------- */
  const regionBtn = $(".region-btn");
  const regionMenu = $(".region-menu");
  if (regionBtn && regionMenu) {
    const open = (on) => {
      regionMenu.hidden = !on;
      regionBtn.setAttribute("aria-expanded", String(on));
      if (on) ($('[aria-checked="true"]', regionMenu) || $("button", regionMenu)).focus();
    };
    regionBtn.addEventListener("click", () => open(regionMenu.hidden));
    regionMenu.addEventListener("click", (e) => {
      const b = e.target.closest("[data-region]");
      if (!b) return;
      region = b.dataset.region;
      store.set("bz-region", region);
      applyRegion();
      setShade(current, { instant: true, source: "region" });
      open(false);
      regionBtn.focus();
    });
    regionMenu.addEventListener("keydown", (e) => {
      const items = $$("button", regionMenu);
      const i = items.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { items[(i + 1) % items.length].focus(); e.preventDefault(); }
      if (e.key === "ArrowUp") { items[(i - 1 + items.length) % items.length].focus(); e.preventDefault(); }
      if (e.key === "Home") { items[0].focus(); e.preventDefault(); }
      if (e.key === "End") { items[items.length - 1].focus(); e.preventDefault(); }
      if (e.key === "Escape") { open(false); regionBtn.focus(); }
      if (e.key === "Tab") open(false);
    });
    regionBtn.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !regionMenu.hidden) open(false);
    });
    document.addEventListener("click", (e) => {
      if (!regionMenu.hidden && !e.target.closest(".region")) open(false);
    });
  }

  /* ---------- before / after slider ---------- */
  const ba = $(".ba");
  const slider = ba ? initSlider(ba) : null;

  function initSlider(root) {
    const handle = $(".ba-handle", root);
    const tagBefore = $(".ba-tag-before", root);
    const tagAfter = $(".ba-tag-after", root);
    let pos = 50;
    let pointer = null;
    let dragging = false;
    let decided = false;
    let startX = 0;
    let startY = 0;
    let raf = 0;
    let touched = false;

    function set(p) {
      pos = Math.max(0, Math.min(100, p));
      root.style.setProperty("--pos", `${pos}%`);
      const v = Math.round(pos);
      handle.setAttribute("aria-valuenow", v);
      handle.setAttribute("aria-valuetext", `${v}% before, ${100 - v}% after`);
      tagBefore.style.opacity = pos < 16 ? 0 : 1;
      tagAfter.style.opacity = pos > 84 ? 0 : 1;
    }
    const pctAt = (x) => {
      const b = root.getBoundingClientRect();
      return ((x - b.left) / b.width) * 100;
    };
    function begin() {
      dragging = true;
      touched = true;
      cancelAnimationFrame(raf);
      root.classList.add("is-dragging");
      try { root.setPointerCapture(pointer); } catch (e) { /* already released */ }
    }
    root.addEventListener("pointerdown", (e) => {
      if (!e.isPrimary) { pointer = null; dragging = false; root.classList.remove("is-dragging"); return; }
      if (e.button !== 0 || pointer !== null) return;
      pointer = e.pointerId;
      startX = e.clientX;
      startY = e.clientY;
      decided = false;
      const onHandle = !!e.target.closest(".ba-handle");
      // Mouse and the handle drag at once; a finger on the photo waits to see if it is a swipe or a scroll.
      if (e.pointerType === "mouse" || onHandle) {
        decided = true;
        begin();
        if (!onHandle) set(pctAt(e.clientX));
        e.preventDefault();
      }
    });
    root.addEventListener("pointermove", (e) => {
      if (e.pointerId !== pointer) return;
      if (!decided) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx < 6 && dy < 6) return;
        decided = true;
        if (dx > dy) begin();
      }
      if (dragging) set(pctAt(e.clientX));
    });
    const end = (e) => {
      if (e.pointerId !== pointer) return;
      if (e.type === "pointerup" && !decided) { // a tap moves the line there
        touched = true;
        cancelAnimationFrame(raf);
        set(pctAt(e.clientX));
      }
      pointer = null;
      dragging = false;
      root.classList.remove("is-dragging");
    };
    root.addEventListener("pointerup", end);
    root.addEventListener("pointercancel", end);
    root.addEventListener("dragstart", (e) => e.preventDefault());

    handle.addEventListener("keydown", (e) => {
      const big = e.shiftKey ? 10 : 2;
      const keys = { ArrowLeft: -big, ArrowDown: -big, ArrowRight: big, ArrowUp: big, PageDown: -10, PageUp: 10 };
      if (e.key in keys) set(pos + keys[e.key]);
      else if (e.key === "Home") set(0);
      else if (e.key === "End") set(100);
      else return;
      touched = true;
      cancelAnimationFrame(raf);
      e.preventDefault();
    });

    // One gentle sweep the first time the slider is on screen, so it reads as draggable.
    function peek() {
      if (reduceMotion || touched) return;
      const keys = [[0, 50], [650, 66], [1400, 34], [2050, 50]];
      const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      const t0 = performance.now();
      const frame = (now) => {
        if (touched) return;
        const t = now - t0;
        let i = 0;
        while (i < keys.length - 1 && t > keys[i + 1][0]) i++;
        if (i >= keys.length - 1) { set(50); return; }
        const [ta, pa] = keys[i];
        const [tb, pb] = keys[i + 1];
        set(pa + (pb - pa) * ease((t - ta) / (tb - ta)));
        raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    }
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        io.disconnect();
        setTimeout(peek, 700);
      }
    }, { threshold: 0.6 });
    io.observe(root);
    set(50);

    let swapId = 0;
    function swap(shade, instant) {
      const id = ++swapId;
      const imgs = { before: $(".ba-before", root), after: $(".ba-after", root) };
      const src = (side, sm) => `assets/img/ba-${shade.id}-${side}${sm ? "-sm" : ""}.webp`;
      const apply = () => {
        for (const side of ["before", "after"]) {
          imgs[side].srcset = `${src(side, true)} 720w, ${src(side, false)} 1119w`;
          imgs[side].src = src(side, false);
          imgs[side].alt = shade[side];
        }
      };
      if (instant || reduceMotion) { root.classList.remove("is-swapping"); apply(); return; }
      root.classList.add("is-swapping");
      // Preload exactly the file the <img> will pick (same srcset and sizes).
      const pre = ["before", "after"].map((side) => {
        const im = new Image();
        im.sizes = imgs[side].getAttribute("sizes");
        im.srcset = `${src(side, true)} 720w, ${src(side, false)} 1119w`;
        im.src = src(side, false);
        return im.decode ? im.decode().catch(() => {}) : Promise.resolve();
      });
      Promise.all([...pre, new Promise((res) => setTimeout(res, 200))]).then(() => {
        if (id !== swapId) return; // a newer shade was picked meanwhile
        apply();
        requestAnimationFrame(() => root.classList.remove("is-swapping"));
      });
    }
    return { set, swap };
  }

  /* ---------- shade state ---------- */
  const STEP_ALT = ["mask squeezed into a gloved palm", "mask worked through damp hair", "hair after rinsing"];
  const word = $(".js-word");
  const kicker = $(".js-kicker");
  const desc = $(".js-desc");

  function swapText(el, text, instant) {
    if (!el) return;
    clearTimeout(el._swapTimer); // a pending fade must not bring back an older text
    if (instant || reduceMotion || el.textContent === text) {
      el.textContent = text;
      el.classList.remove("is-out");
      return;
    }
    el.classList.add("is-out");
    el._swapTimer = setTimeout(() => {
      el.textContent = text;
      el.classList.remove("is-out");
    }, 240);
  }

  function setShade(id, opts = {}) {
    const s = byId[id];
    if (!s) return;
    const instant = !!opts.instant;
    const reg = R();
    const changed = id !== current || opts.source === "init";
    current = id;
    if (!/^init/.test(opts.source || "")) store.set("bz-shade", id);
    document.documentElement.style.setProperty("--accent", s.accent);

    $$(".chip").forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.shade === id)));
    swapText(word, s.word, instant);
    if (kicker) kicker.textContent = s.kicker;
    swapText(desc, s.desc, instant);
    $$(".js-buy").forEach((a) => (a.href = s.amazon[region]));
    $$(".js-buy-label").forEach((el) => (el.textContent = `Buy ${s.name} on ${reg.store}`));
    $$(".js-buy-name").forEach((el) => (el.textContent = `, ${s.name}`));
    if (slider && changed && opts.source !== "region") slider.swap(s, instant);
    $$(".shade-col").forEach((c) => c.classList.toggle("is-active", c.dataset.shade === id));
    $$(".js-step").forEach((img) => {
      img.src = `assets/img/step-${id}-${img.dataset.n}.webp`;
      img.alt = `${s.name}: ${STEP_ALT[img.dataset.n - 1]}`;
    });
    const sw = $(".js-buybar-swatch");
    if (sw) sw.src = `assets/img/swatch-${id}.webp`;
    const bn = $(".js-buybar-name");
    if (bn) bn.textContent = s.name;
    const bp = $(".js-buybar-price");
    if (bp) bp.textContent = `${s.price[region]}, ${reg.sizeShort}`;
    if (opts.source !== "tab") watch.select(id, instant);
  }

  $$(".chip").forEach((c) => c.addEventListener("click", () => {
    if (c.dataset.shade !== current) setShade(c.dataset.shade, { source: "chip" });
  }));

  /* ---------- results player ---------- */
  const watch = (() => {
    const video = $(".js-watch");
    const panel = $(".player");
    const tabs = $$(".tab");
    const soundBtn = $(".js-sound");
    const pauseBtn = $(".js-pause");
    if (!video) return { select() {} };
    let shown = null;
    let inView = false;
    let userPaused = !canAutoplay;
    let loaded = false;

    const file = (id) => `assets/video/salon-${id}-${mobile.matches ? "45" : "169"}.mp4`;
    const poster = (id) => `assets/poster/salon-${id}-${mobile.matches ? "45" : "169"}.webp`;

    function syncButtons() {
      const paused = video.paused || userPaused;
      pauseBtn.setAttribute("aria-pressed", String(paused));
      pauseBtn.setAttribute("aria-label", paused ? "Play video" : "Pause video");
      $("use", pauseBtn).setAttribute("href", paused ? "#i-play" : "#i-pause");
      soundBtn.setAttribute("aria-pressed", String(!video.muted));
      soundBtn.setAttribute("aria-label", video.muted ? "Turn sound on" : "Turn sound off");
      $("use", soundBtn).setAttribute("href", video.muted ? "#i-sound-off" : "#i-sound-on");
    }
    function play() { video.play().then(syncButtons).catch(syncButtons); }

    function select(id) {
      if (shown === id) return;
      shown = id;
      const s = byId[id];
      tabs.forEach((t) => {
        const on = t.dataset.shade === id;
        t.setAttribute("aria-selected", String(on));
        t.tabIndex = on ? 0 : -1;
      });
      // keep the picked tab visible in its scrolling row (without scrolling the page)
      const row = tabs[0].parentElement;
      const onTab = tabs.find((t) => t.dataset.shade === id);
      if (row.scrollWidth > row.clientWidth) {
        row.scrollTo({ left: row.scrollLeft + onTab.getBoundingClientRect().left - row.getBoundingClientRect().left - 16 });
      }
      panel.setAttribute("aria-labelledby", `tab-${id}`);
      video.setAttribute("aria-label", `${s.name} before and after film`);
      video.dataset.poster = poster(id);
      if (video.hasAttribute("poster")) video.poster = poster(id);
      if (loaded) {
        video.src = file(id);
        video.load();
        if (inView && !userPaused) play();
      }
      syncButtons();
    }

    tabs.forEach((t, i) => {
      t.addEventListener("click", () => {
        if (t.dataset.shade === shown) return;
        setShade(t.dataset.shade, { source: "tab" });
        select(t.dataset.shade);
      });
      t.addEventListener("keydown", (e) => {
        const to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
        if (to === undefined) return;
        const next = tabs[(to + tabs.length) % tabs.length];
        next.focus();
        next.click();
        e.preventDefault();
      });
    });

    soundBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      if (!video.muted) {
        muteOthers(video);
        if (!loaded) { video.src = file(shown); loaded = true; }
        userPaused = false;
        play();
      }
      syncButtons();
    });
    pauseBtn.addEventListener("click", () => {
      if (video.paused) {
        userPaused = false;
        if (!loaded) { video.src = file(shown); loaded = true; }
        play();
      } else {
        userPaused = true;
        video.pause();
      }
      syncButtons();
    });
    video.addEventListener("click", () => pauseBtn.click());
    video.addEventListener("play", syncButtons);
    video.addEventListener("pause", syncButtons);

    new IntersectionObserver((entries) => {
      inView = entries[0].isIntersecting;
      if (inView) {
        if (!loaded && canAutoplay) { video.src = file(shown); loaded = true; }
        if (!userPaused) play();
      } else if (!video.paused) {
        video.pause();
      }
    }, { threshold: 0.45 }).observe(panel);

    return { select, video, syncButtons };
  })();

  /* ---------- muted loops that play only on screen ---------- */
  function muteOthers(except) {
    $$("video").forEach((v) => {
      if (v === except) return;
      if (!v.muted) {
        v.muted = true;
        const btn = v.parentElement && $(".reel-sound", v.parentElement);
        if (btn) setReelButton(btn, true);
      }
      if (v.classList.contains("js-film") && !v.paused) v.pause();
    });
    if (watch.syncButtons) watch.syncButtons();
  }

  function lazyLoop(video, pickSrc, threshold = 0.5) {
    let loaded = false;
    const ensure = () => { if (!loaded) { video.src = pickSrc(); loaded = true; } };
    new IntersectionObserver((entries) => {
      const on = entries[0].isIntersecting;
      if (on && canAutoplay && !video.dataset.userPaused) {
        ensure();
        video.play().catch(() => {});
      } else if (!on && !video.paused) {
        video.pause();
      }
    }, { threshold }).observe(video);
    // Every loop gets a pause button (a looping video must be stoppable).
    const btn = $(".loop-toggle", video.parentElement);
    if (btn) {
      const sync = () => {
        const off = video.paused;
        btn.setAttribute("aria-pressed", String(off));
        btn.setAttribute("aria-label", off ? "Play video" : "Pause video");
        $("use", btn).setAttribute("href", off ? "#i-play" : "#i-pause");
      };
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (video.paused) {
          delete video.dataset.userPaused;
          ensure();
          video.play().catch(() => {});
        } else {
          video.dataset.userPaused = "1";
          video.pause();
        }
      });
      video.addEventListener("play", sync);
      video.addEventListener("pause", sync);
      sync();
    }
    return ensure;
  }

  const band = $(".js-band");
  if (band) lazyLoop(band, () => (mobile.matches ? band.dataset.srcTall : band.dataset.srcWide), 0.25);

  function setReelButton(btn, muted) {
    btn.setAttribute("aria-pressed", String(!muted));
    btn.setAttribute("aria-label", muted ? "Turn sound on" : "Turn sound off");
    $("use", btn).setAttribute("href", muted ? "#i-sound-off" : "#i-sound-on");
  }
  $$(".reel").forEach((reel) => {
    const video = $("video", reel);
    const btn = $(".reel-sound", reel);
    const ensure = lazyLoop(video, () => video.dataset.src, 0.6);
    const toggle = () => {
      ensure();
      if (video.muted) {
        muteOthers(video);
        delete video.dataset.userPaused;
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(() => {});
      } else {
        video.muted = true;
      }
      setReelButton(btn, video.muted);
    };
    btn.addEventListener("click", (e) => { e.stopPropagation(); toggle(); });
    $(".reel-media", reel).addEventListener("click", toggle);
  });

  /* ---------- posters load only when their video is near ---------- */
  const posterIO = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const v = e.target;
    posterIO.unobserve(v);
    v.poster = (mobile.matches && v.dataset.posterTall) || v.dataset.poster;
  }), { rootMargin: "800px 0px" });
  $$("video[data-poster]").forEach((v) => posterIO.observe(v));

  /* ---------- film ---------- */
  const filmSec = $(".film");
  const film = $(".js-film");
  if (film) {
    const frame = $(".film-frame");
    const start = () => {
      if (!film.getAttribute("src")) film.src = film.dataset.src;
      if (!film.hasAttribute("poster") && film.dataset.poster) film.poster = film.dataset.poster;
      muteOthers(film);
      film.muted = false;
      film.controls = true;
      filmSec.classList.add("is-playing");
      // Bring the whole frame into view (it starts with sound), then hand focus to the video and its controls.
      const r = frame.getBoundingClientRect();
      if (r.top < $(".site-header").offsetHeight || r.bottom > window.innerHeight) {
        frame.scrollIntoView({ block: "center", behavior: reduceMotion ? "auto" : "smooth" });
      }
      film.focus({ preventScroll: true });
      film.play().catch(() => {});
    };
    $$(".js-film-start").forEach((b) => b.addEventListener("click", start));
    film.addEventListener("ended", () => filmSec.classList.remove("is-playing"));
    new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting && !film.paused) film.pause();
    }, { threshold: 0 }).observe(film);
  }

  /* ---------- featured reviews (pasted by the owner into BLONDZ.reviews) ---------- */
  const rcBox = $(".js-review-cards");
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  if (rcBox && Array.isArray(C.reviews) && C.reviews.length) {
    const row = $(".js-rc-row", rcBox);
    row.innerHTML = C.reviews.map((rv) => `
      <article class="rc" role="listitem">
        <div class="rc-who"><span class="rc-avatar" aria-hidden="true">${rv.photo ? `<img src="${esc(rv.photo)}" alt="" width="80" height="80" loading="lazy">` : esc(String(rv.name).trim().charAt(0))}</span>
          <span class="rc-name">${esc(rv.name)}<svg class="rc-check" role="img" aria-label="Verified purchase"><use href="#i-verified"/></svg></span></div>
        <p class="stars rc-stars" role="img" aria-label="${esc(rv.stars)} out of 5 stars">${starsHTML(rv.stars)}</p>
        ${rv.title ? `<h4 class="rc-heading">${esc(rv.title)}</h4>` : ""}
        <p class="rc-text">${esc(rv.text)}</p>
        <button class="rc-more" type="button" hidden>Read more</button>
        <p class="rc-meta">Verified Purchase on Amazon${rv.where ? ` · ${esc(rv.where)}` : ""}${rv.date ? ` · ${esc(rv.date)}` : ""}${byId[rv.shade] ? ` · ${byId[rv.shade].name}` : ""}</p>
      </article>`).join("");
    rcBox.hidden = false;
    $$(".rc", row).forEach((card) => {
      const text = $(".rc-text", card);
      const more = $(".rc-more", card);
      if (text.scrollHeight <= text.clientHeight + 2) return;
      more.hidden = false;
      more.addEventListener("click", () => {
        const open = card.classList.toggle("is-open");
        more.textContent = open ? "Show less" : "Read more";
      });
    });
    const step = () => (row.firstElementChild ? row.firstElementChild.getBoundingClientRect().width + 20 : 300);
    $(".js-rc-prev", rcBox).addEventListener("click", () => row.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    $(".js-rc-next", rcBox).addEventListener("click", () => row.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
  }

  /* ---------- photo lightbox ---------- */
  const lb = $(".lightbox");
  if (lb && typeof lb.showModal === "function") {
    const track = $(".lb-track", lb);
    const count = $(".lb-count", lb);
    let total = 0;
    let opener = null;
    const index = () => Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
    const update = () => (count.textContent = `${index() + 1} of ${total}`);
    const go = (d) => track.scrollTo({ left: (index() + d) * track.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });

    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-photos]");
      if (!b) return;
      const s = byId[b.dataset.photos];
      opener = b;
      total = s.gallery.length;
      $(".lb-title", lb).textContent = s.name;
      track.innerHTML = s.gallery.map((src, i) =>
        `<img src="${src}" alt="${s.name}, Amazon product photo ${i + 1} of ${total}" width="1000" height="1000" ${i > 1 ? 'loading="lazy"' : ""}>`).join("");
      lb.showModal();
      track.scrollLeft = 0;
      update();
    });
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    $(".js-lb-prev", lb).addEventListener("click", () => go(-1));
    $(".js-lb-next", lb).addEventListener("click", () => go(1));
    $(".js-lb-close", lb).addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
    lb.addEventListener("close", () => { if (opener) opener.focus(); });
    lb.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { go(1); e.preventDefault(); }
      if (e.key === "ArrowLeft") { go(-1); e.preventDefault(); }
    });
  } else if (lb) {
    // Very old browsers: open the first photo instead of the dialog.
    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-photos]");
      if (b) window.open(byId[b.dataset.photos].gallery[0], "_blank", "noopener");
    });
  }

  /* ---------- header line + mobile buy bar ---------- */
  const header = $(".site-header");
  const heroCta = $(".hero-body .btn");
  const footer = $(".site-footer");
  const buybar = $(".buybar");
  let barOn = false;
  let ticking = false;
  // Measured on scroll (not with IntersectionObserver) so a jump back to the top also hides the bar.
  const onScroll = () => {
    ticking = false;
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    if (!buybar || !heroCta) return;
    const heroGone = heroCta.getBoundingClientRect().bottom < 0;
    const footerIn = footer ? footer.getBoundingClientRect().top < window.innerHeight : false;
    // keep the bar off the film (and its controls) while it plays
    const fr = film ? film.getBoundingClientRect() : null;
    const filmOn = !!film && !film.paused && fr.bottom > 0 && fr.top < window.innerHeight;
    const on = heroGone && !footerIn && !filmOn;
    if (on === barOn) return;
    barOn = on;
    buybar.classList.toggle("is-on", on);
    buybar.setAttribute("aria-hidden", String(!on));
    $$("a", buybar).forEach((a) => (a.tabIndex = on ? 0 : -1));
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  if (film) {
    film.addEventListener("play", onScroll);
    film.addEventListener("pause", onScroll);
  }
  onScroll();

  /* ---------- start ---------- */
  applyRegion();
  setShade(current, { instant: true, source: "init" });
})();
