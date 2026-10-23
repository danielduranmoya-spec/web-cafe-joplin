/* =========================================================
   Café Joplin · script (a partir del modelo ÁNCORA)
   Todo lo editable está en CONFIG y CARTA (al principio).
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Datos editables ---------- */
  var CONFIG = {
    telefono: '+34607680787',          // para los enlaces tel:
    telefonoVisible: '607 68 07 87',   // como se muestra en la web
    whatsapp: '34607680787',           // número para wa.me, sin + ni espacios
    mensaje: 'Hola, quería preguntar por Café Joplin.',
    zonaHoraria: 'Europe/Madrid',
    // 0 = domingo, 1 = lunes … 6 = sábado. Tramos 'HH:MM' ('24:00' = medianoche).
    // PENDIENTE: confirmar con el local; tomado de fichas públicas.
    horario: {
      0: [],
      1: [['09:00', '24:00']],
      2: [['09:00', '24:00']],
      3: [['09:00', '24:00']],
      4: [['09:00', '24:00']],
      5: [['09:00', '24:00']],
      6: [['13:30', '24:00']]
    },
    mapa: 'https://www.openstreetmap.org/export/embed.html?bbox=-6.3487%2C38.9142%2C-6.3427%2C38.9172&layer=mapnik&marker=38.91574%2C-6.34572',
    claveConsentimiento: 'joplin-consent'
  };

  var ORDEN = ['desayunos', 'caucaso', 'casera', 'postres', 'bebidas'];

  // Platos tomados de la carta publicada del local. Sin precios hasta confirmarlos.
  var CARTA = {
    desayunos: {
      nombre: 'Desayunos y meriendas',
      nota: '',
      lead: 'Tostadas de pan artesanal, café y zumo de naranja para empezar el día en pleno centro.',
      platos: [
        ['Tostada extremeña', 'Pan artesanal con producto de la tierra.'],
        ['Jamón con queso semicurado', 'Tostada especial de la casa.'],
        ['Lacón con queso semicurado', 'Otra de las tostadas especiales.'],
        ['Queso fresco', 'Con mermelada o con tomate.'],
        ['Mantequilla y mermelada', 'La de siempre.'],
        ['Café bombón, Colacao o zumo de naranja', 'Para acompañar.']
      ]
    },
    caucaso: {
      nombre: 'Del Cáucaso',
      nota: 'Lo que no encuentras en otro bar',
      lead: 'La parte de la carta que hace distinto a Joplin: recetas armenias, rusas y del Cáucaso cocinadas aquí, en Mérida.',
      platos: [
        ['Tolmá al estilo armenio', 'Rellena de carne y arroz, en salsa. Especialidad de la casa.'],
        ['Kebab al estilo del Cáucaso', 'Para abrir la mesa.'],
        ['Pelmeni', 'Empanadillas rusas.'],
        ['Stroganoff de ternera', 'El clásico ruso.'],
        ['Berenjena con pasta de nueces', 'Una de las favoritas en las reseñas.'],
        ['Moussaka', 'Al horno.']
      ]
    },
    casera: {
      nombre: 'Cocina casera',
      nota: '',
      lead: 'Guisos, raciones y platos calientes de siempre, en raciones generosas.',
      platos: [
        ['Carrillada ibérica en salsa', 'Guisada a fuego lento.'],
        ['Ternera guisada en salsa de cerveza', 'Plato caliente.'],
        ['Lomo en salsa de almendras', 'Receta de la casa.'],
        ['Crepes rellenos de champiñones', 'Opción vegetariana.'],
        ['Salmorejo', 'Entrante.'],
        ['Gambas al ajillo', 'Para compartir.']
      ]
    },
    postres: {
      nombre: 'Postres',
      nota: '',
      lead: 'Tartas caseras para quedarse un rato más. La tarta de queso sale en muchas reseñas.',
      platos: [
        ['Tarta de queso', 'La que más se repite en las reseñas.'],
        ['Bizcocho de chocolate', 'Casero.'],
        ['Helados', 'Pregunta por los sabores del día.']
      ]
    },
    bebidas: {
      nombre: 'Tés, vinos y cervezas',
      nota: '',
      lead: 'Carta de tés e infusiones, vinos de la tierra y cervezas, con buena música de fondo.',
      platos: [
        ['Tés e infusiones', 'Fraggle Rock bio, té verde Caperucita Roja, matcha fruit y más.'],
        ['Vino Joplin', 'Tinto joven de la casa.'],
        ['Tintos de la tierra', 'Lengua Azul, Flor de Orán, Viña Puebla crianza.'],
        ['Blancos', 'Verdejo Ruiz Torres, Entremares.'],
        ['Cervezas y sidras de sabores', 'Variedad para elegir.'],
        ['Granizados y zumos', 'Para el verano emeritense.']
      ]
    }
  };

  /* ---------- Utilidades ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function waLink(msg) {
    return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(msg || CONFIG.mensaje);
  }

  function storageGet(key) {
    try { return window.localStorage.getItem(key); } catch (e) { return null; }
  }
  function storageSet(key, value) {
    try { window.localStorage.setItem(key, value); } catch (e) { /* sin almacenamiento: no pasa nada */ }
  }

  /* ---------- Enlaces de contacto ---------- */
  function applyContactLinks(ctx) {
    $$('[data-wa]', ctx).forEach(function (a) {
      a.href = waLink(a.getAttribute('data-wa-msg'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('[data-tel]', ctx).forEach(function (a) { a.href = 'tel:' + CONFIG.telefono; });
    $$('[data-tel-text]', ctx).forEach(function (el) { el.textContent = CONFIG.telefonoVisible; });
  }

  /* ---------- Carta por secciones ---------- */
  function cartaMarkup(key) {
    var c = CARTA[key];
    var n = ORDEN.indexOf(key) + 1;
    var num = (n < 10 ? '0' : '') + n;
    var msg = 'Hola, quería preguntar por la carta (' + c.nombre + ') de Café Joplin.';
    var dish = function (p) { return '<li class="dish"><h4>' + p[0] + '</h4><p>' + p[1] + '</p></li>'; };
    return '' +
      '<div class="carta-panel__top">' +
        '<p class="mono">Carta ' + num + ' / 0' + ORDEN.length + '</p>' +
        (c.nota ? '<p class="tag">' + c.nota + '</p>' : '') +
      '</div>' +
      '<h3 class="carta-panel__title">' + c.nombre + '</h3>' +
      '<p class="carta-panel__lead">' + c.lead + '</p>' +
      '<ul class="dishes">' + c.platos.map(dish).join('') + '</ul>' +
      '<a class="btn btn--primary" data-wa data-wa-msg="' + msg + '" href="' + waLink(msg) + '">Preguntar por WhatsApp</a>';
  }

  function initCarta() {
    var panel = $('[data-carta-panel]');
    var inner = $('[data-carta-inner]');
    var tabsWrap = $('[data-carta-tabs]');
    if (!panel || !inner || !tabsWrap) return;

    var chips = $$('.chip', tabsWrap);
    var current = tabsWrap.getAttribute('data-active') || 'caucaso';
    var timer = null;

    function mark(key) {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c.getAttribute('data-carta') === key)); });
      tabsWrap.setAttribute('data-active', key);
    }

    function swap(key) {
      inner.innerHTML = cartaMarkup(key);
      applyContactLinks(inner);
    }

    function select(key) {
      if (!CARTA[key] || key === current) return;
      current = key;
      mark(key);
      if (reduceMotion) { swap(key); return; }
      clearTimeout(timer);
      panel.classList.remove('is-entering');
      panel.classList.add('is-leaving');
      timer = setTimeout(function () {
        swap(key);
        panel.classList.remove('is-leaving');
        void panel.offsetWidth; // reinicia la animación de entrada
        panel.classList.add('is-entering');
      }, 150);
    }

    chips.forEach(function (c) {
      c.addEventListener('click', function () { select(c.getAttribute('data-carta')); });
    });

    // Flechas, Inicio y Fin para moverse entre secciones con el teclado
    tabsWrap.addEventListener('keydown', function (e) {
      var i = chips.indexOf(document.activeElement);
      if (i === -1) return;
      var next = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % chips.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + chips.length) % chips.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = chips.length - 1;
      if (next === null) return;
      e.preventDefault();
      chips[next].focus();
      select(chips[next].getAttribute('data-carta'));
    });

    mark(current);
    swap(current);
  }

  /* ---------- Horario: abierto ahora ---------- */
  function toMin(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
  }
  function fmt(hhmm) {
    var p = hhmm.split(':');
    return parseInt(p[0], 10) + ':' + p[1];
  }
  var DIAS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  function nowInCafe() {
    try {
      var parts = new Intl.DateTimeFormat('en-GB', {
        timeZone: CONFIG.zonaHoraria,
        weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date());
      var get = function (t) { for (var i = 0; i < parts.length; i++) if (parts[i].type === t) return parts[i].value; return ''; };
      var day = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
      return { day: day, mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }

  function hoursStatus(now) {
    var today = CONFIG.horario[now.day] || [];
    for (var i = 0; i < today.length; i++) {
      var s = toMin(today[i][0]), e = toMin(today[i][1]);
      if (now.mins >= s && now.mins < e) {
        return { open: true, text: 'Abierto ahora · cierra a las ' + fmt(today[i][1]) };
      }
    }
    for (var j = 0; j < today.length; j++) {
      if (toMin(today[j][0]) > now.mins) {
        return { open: false, text: 'Cerrado · abre hoy a las ' + fmt(today[j][0]) };
      }
    }
    for (var k = 1; k <= 7; k++) {
      var d = (now.day + k) % 7;
      var tramos = CONFIG.horario[d] || [];
      if (tramos.length) {
        var cuando = k === 1 ? 'mañana' : 'el ' + DIAS[d];
        return { open: false, text: 'Cerrado · abre ' + cuando + ' a las ' + fmt(tramos[0][0]) };
      }
    }
    return { open: false, text: 'Cerrado' };
  }

  function initHours() {
    var status = $('[data-status]');
    var text = $('[data-status-text]');
    if (!status || !text) return;
    function update() {
      var now = nowInCafe();
      var st = hoursStatus(now);
      status.setAttribute('data-state', st.open ? 'open' : 'closed');
      text.textContent = st.text;
      $$('.hours tr[data-days]').forEach(function (tr) {
        var days = tr.getAttribute('data-days').split(',').map(Number);
        tr.classList.toggle('is-today', days.indexOf(now.day) !== -1);
      });
    }
    update();
    setInterval(update, 60 * 1000);
  }

  /* ---------- Consentimiento y mapa ---------- */
  function loadMap() {
    var box = $('[data-map]');
    if (!box || box.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = CONFIG.mapa;
    iframe.title = 'Mapa con la ubicación de Café Joplin en Mérida';
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer';
    box.appendChild(iframe);
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = true;
  }
  function unloadMap() {
    var box = $('[data-map]');
    if (!box) return;
    var iframe = box.querySelector('iframe');
    if (iframe) iframe.remove();
    var ph = $('[data-map-placeholder]');
    if (ph) ph.hidden = false;
  }

  function initConsent() {
    var banner = $('[data-cookie-banner]');
    var mobileCta = $('[data-mobile-cta]');
    var stored = storageGet(CONFIG.claveConsentimiento);

    function setCtaBlocked(blocked) {
      if (mobileCta) mobileCta.classList.toggle('is-blocked', blocked);
      document.dispatchEvent(new CustomEvent('joplin:cta'));
    }

    function hide() {
      if (!banner || banner.hidden) return;
      if (reduceMotion) { banner.hidden = true; setCtaBlocked(false); return; }
      banner.classList.add('is-leaving');
      setTimeout(function () {
        banner.hidden = true;
        banner.classList.remove('is-leaving');
        setCtaBlocked(false);
      }, 180);
    }
    function show() {
      if (!banner) return;
      banner.hidden = false;
      setCtaBlocked(true);
    }

    if (stored === 'accepted') loadMap();
    if (!stored) show();

    $$('[data-consent]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var value = btn.getAttribute('data-consent');
        storageSet(CONFIG.claveConsentimiento, value);
        if (value === 'accepted') loadMap(); else unloadMap();
        hide();
      });
    });
    $$('[data-open-cookies]').forEach(function (btn) {
      btn.addEventListener('click', show);
    });
    var loadBtn = $('[data-map-load]');
    if (loadBtn) loadBtn.addEventListener('click', loadMap);
  }

  /* ---------- Cabecera y CTA móvil ---------- */
  function initHeader() {
    var header = $('[data-header]');
    if (!header) return;
    var ticking = false;
    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  function initMobileCta() {
    var cta = $('[data-mobile-cta]');
    var hero = $('[data-hero]');
    var contact = $('[data-contact]');
    if (!cta || !hero || !('IntersectionObserver' in window)) return;
    var heroVisible = true;
    var contactVisible = false;
    function update() {
      var show = !heroVisible && !contactVisible && !cta.classList.contains('is-blocked');
      cta.classList.toggle('is-visible', show);
    }
    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting; update();
    }, { threshold: 0 }).observe(hero);
    if (contact) {
      new IntersectionObserver(function (entries) {
        contactVisible = entries[0].isIntersecting; update();
      }, { threshold: 0 }).observe(contact);
    }
    document.addEventListener('joplin:cta', update);
  }

  /* ---------- Entradas al hacer scroll ---------- */
  function initReveal() {
    var items = $$('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Arranque ---------- */
  function init() {
    applyContactLinks(document);
    initCarta();
    initHours();
    initConsent();
    initHeader();
    initMobileCta();
    initReveal();
    $$('[data-year]').forEach(function (el) { el.textContent = String(new Date().getFullYear()); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  // Datos accesibles desde la consola del navegador: __joplin.config, __joplin.carta
  window.__joplin = { config: CONFIG, carta: CARTA };
})();
