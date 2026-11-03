/* Hilo Rojo · con qué se está jugando: teclado (y mouse), pantalla táctil o mando.
   Entrada.modo() dice cuál se usó por última vez; las instrucciones y las etiquetas de teclas cambian con eso
   (Entrada.tecla, Entrada.alCambiar). También lee el mando con la Gamepad API del navegador (Xbox, PlayStation y
   genéricos, por cable o Bluetooth): lo traduce a las mismas teclas que ya usa el juego y mueve el foco entre botones.
     Stick izquierdo o cruceta ◀ ▶  → flechas (caminar)
     Cruceta ▲ ▼ (o stick)         → pasar de un botón a otro (respuestas, menús)
     A / ✕                          → el botón con foco; si no hay, Enter (avanzar, interactuar)
     X / □, LB / L1, LT / L2        → Q (prestar atención, mientras se mantiene)
     B / ○                          → Escape (cerrar el menú)      Y / △ → texto rápido      Start / Options → menú
     Stick derecho ▲ ▼              → desplazar lo que tenga barra (chats, el celular explorable, la libreta, el tejido) */
const Entrada = (() => {
  'use strict';
  let modo = matchMedia('(pointer: coarse)').matches ? 'tactil' : 'teclado';
  let tipo = 'xbox';
  const oyentes = [];
  const raiz = document.documentElement;
  raiz.dataset.entrada = modo;

  function poner(m) {
    if (m === modo) return;
    modo = m; raiz.dataset.entrada = m;
    oyentes.forEach(f => f(m));
  }
  addEventListener('keydown', (e) => { if (!e.mando) poner('teclado'); }, true);
  addEventListener('pointerdown', (e) => poner(e.pointerType === 'touch' || e.pointerType === 'pen' ? 'tactil' : 'teclado'), true);

  /* ---------- Etiquetas de teclas para las instrucciones ---------- */
  const k = (t, clase = '') => `<kbd class="${clase}">${t}</kbd>`;
  const ps = () => tipo === 'ps';
  const BOTON = {
    a: () => ps() ? k('✕', 'm ps-x') : k('A', 'm xb-a'),
    b: () => ps() ? k('○', 'm ps-o') : k('B', 'm xb-b'),
    x: () => ps() ? k('□', 'm ps-c') : k('X', 'm xb-x'),
    lt: () => ps() ? k('L2', 'm') : k('LT', 'm')
  };
  /* La tecla (o botón) de cada acción, según con qué se juega */
  function tecla(accion) {
    if (modo === 'mando') return ({ usar: BOTON.a(), oir: BOTON.x(), seguir: BOTON.a() })[accion] || '';
    if (modo === 'tactil') return '';
    return ({ usar: k('E'), oir: k('Q'), seguir: k('Enter') })[accion] || '';
  }
  /* Resumen de una línea para la portada y para el texto de entrada de las caminatas */
  function resumen(cual) {
    if (cual === 'portada') return modo === 'mando' ? `${BOTON.a()} para avanzar · cruceta ▲ ▼ para elegir · stick derecho para desplazar` : modo === 'tactil' ? 'Toca la pantalla para avanzar y toca una respuesta para elegir.' : 'Clic, espacio o Enter para avanzar · 1-4 para elegir.';
    if (modo === 'mando') return `Stick o cruceta: caminar · ${BOTON.x()} escuchar · ${BOTON.a()} interactuar`;
    if (modo === 'tactil') return '';
    return '← → caminar · Q prestar atención · E interactuar';
  }

  /* ---------- Mando ---------- */
  const mandos = new Set();
  const antes = {}; // qué estaba apretado en la vuelta anterior
  let raf = null;
  addEventListener('gamepadconnected', (e) => {
    mandos.add(e.gamepad.index);
    const id = e.gamepad.id; // Xbox primero: el suyo también dice «Wireless Controller»
    tipo = !/xbox|045e/i.test(id) && /054c|playstation|dualsense|dualshock|wireless controller/i.test(id) ? 'ps' : 'xbox';
    avisar(`Mando conectado${ps() ? ' (PlayStation)' : ''}. Ya puedes jugar con él.`);
    poner('mando');
    if (!raf) raf = requestAnimationFrame(leer);
  });
  addEventListener('gamepaddisconnected', (e) => {
    mandos.delete(e.gamepad.index);
    if (!mandos.size) { soltarTodo(); avisar('Se desconectó el mando.'); poner(matchMedia('(pointer: coarse)').matches ? 'tactil' : 'teclado'); }
  });

  /* Un aviso chiquito abajo al centro (no es un «hilo»: no tiene que ver con la historia) */
  function avisar(texto) {
    const d = document.createElement('div');
    d.className = 'aviso-mando';
    d.innerHTML = `${window.Iconos ? Iconos.svg('mando') : ''}<span>${texto}</span>`;
    document.body.appendChild(d);
    setTimeout(() => d.classList.add('fuera'), 3200);
    setTimeout(() => d.remove(), 3800);
  }

  /* Teclas sintéticas: el juego ya sabe qué hacer con ellas. `mando` marca que no vienen del teclado. */
  const apretadas = new Set();
  function teclaEv(tipoEv, key) {
    const ev = new KeyboardEvent(tipoEv, { key, code: key, bubbles: true, cancelable: true });
    ev.mando = true;
    (document.activeElement && document.activeElement !== document.body ? document.activeElement : document).dispatchEvent(ev);
  }
  function mantener(key, si) {
    if (si && !apretadas.has(key)) { apretadas.add(key); teclaEv('keydown', key); }
    if (!si && apretadas.has(key)) { apretadas.delete(key); teclaEv('keyup', key); }
  }
  function soltarTodo() { [...apretadas].forEach(key => mantener(key, false)); }

  /* Botones a los que se puede pasar con la cruceta: los de la parte que está al frente */
  const visible = (b) => { if (b.disabled || b.closest('[hidden]')) return false; const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.bottom > 0 && r.top < innerHeight && getComputedStyle(b).visibility !== 'hidden'; };
  function candidatos() {
    const zonas = ['#menu-juego:not([hidden])', '.cw-eleccion:not([hidden])', '.cw', '#panel.visible', '#tel.visible .tel-pie', '#caja .opciones'];
    for (const z of zonas) {
      const el = document.querySelector(z);
      if (!el) continue;
      if (z === '.cw') return []; // caminando: las flechas mueven a Yare, no el foco
      const bs = [...el.querySelectorAll('button, a.boton, a[href].ap-btn')].filter(b => !b.closest('.cw-tactil, #hud') && visible(b));
      if (bs.length) return bs;
    }
    return [];
  }
  function moverFoco(paso) {
    const bs = candidatos();
    if (!bs.length) return;
    const i = bs.indexOf(document.activeElement);
    const sig = i < 0 ? (paso > 0 ? 0 : bs.length - 1) : (i + paso + bs.length) % bs.length;
    bs[sig].focus({ preventScroll: false });
    bs[sig].scrollIntoView?.({ block: 'nearest' });
  }
  function confirmar() {
    const bs = candidatos(), foco = document.activeElement;
    if (bs.includes(foco)) { foco.click(); return; }
    if (bs.length === 1) { bs[0].click(); return; } // un solo botón (p. ej. «Continuar»): no hace falta enfocarlo antes
    if (bs.length > 1) { moverFoco(1); return; }
    teclaEv('keydown', 'Enter'); teclaEv('keyup', 'Enter');
  }

  /* Stick derecho: desplaza lo que tenga barra de desplazamiento, como la ruedita del mouse. Primero lo que contiene
     al botón con foco; si no, lo de más adentro en lo que está al frente (la pantalla del celular antes que el panel
     que la rodea). Si ya llegó al final, sigue con el de afuera. */
  const puede = (e) => { const st = getComputedStyle(e); return /(auto|scroll)/.test(st.overflowY) && e.scrollHeight > e.clientHeight + 2 && e.getClientRects().length > 0; };
  const hondo = (e) => { let n = 0; for (; e; e = e.parentElement) n++; return n; };
  function desplazables() {
    const delFoco = [];
    for (let e = document.activeElement; e && e !== document.body; e = e.parentElement) if (puede(e)) delFoco.push(e);
    if (delFoco.length) return delFoco;
    for (const sel of ['#menu-juego:not([hidden])', '#tel.visible', '#panel.visible']) {
      const r = document.querySelector(sel);
      if (!r) continue;
      const cs = [r, ...r.querySelectorAll('*')].filter(puede);
      if (cs.length) return cs.sort((a, b) => hondo(b) - hondo(a));
    }
    return [];
  }
  let rodando = null, tAntes = 0;

  const ZONA = .45; // zona muerta del stick
  function leer(t = performance.now()) {
    raf = null;
    const dt = Math.min(.05, Math.max(0, (t - tAntes) / 1000)); tAntes = t;
    const lista = [...(navigator.getGamepads ? navigator.getGamepads() : [])].filter(Boolean);
    if (!lista.length) { if (mandos.size) raf = requestAnimationFrame(leer); return; }
    const g = lista[0], b = (i) => !!g.buttons[i]?.pressed, x = g.axes[0] || 0, y = g.axes[1] || 0;
    const ahora = {
      a: b(0), b: b(1), x: b(2), y: b(3), lb: b(4), lt: b(6) || (g.buttons[6]?.value || 0) > .4, start: b(9),
      arriba: b(12) || y < -ZONA, abajo: b(13) || y > ZONA, izq: b(14) || x < -ZONA, der: b(15) || x > ZONA
    };
    const nuevo = (n) => ahora[n] && !antes[n];
    if (Object.keys(ahora).some(n => ahora[n] !== !!antes[n])) poner('mando');
    const enCaminata = !!document.querySelector('#panel.visible .cw') && document.querySelector('#menu-juego')?.hidden !== false;
    /* Izquierda y derecha: en una caminata se mantienen (caminar); fuera, mueven el foco como arriba y abajo */
    if (enCaminata && !document.querySelector('.cw-eleccion:not([hidden])')) { mantener('ArrowLeft', ahora.izq); mantener('ArrowRight', ahora.der); }
    else { mantener('ArrowLeft', false); mantener('ArrowRight', false); if (nuevo('izq')) moverFoco(-1); if (nuevo('der')) moverFoco(1); }
    mantener('q', ahora.x || ahora.lb || ahora.lt);
    if (nuevo('arriba')) moverFoco(-1);
    if (nuevo('abajo')) moverFoco(1);
    if (nuevo('a')) confirmar();
    if (nuevo('b')) { teclaEv('keydown', 'Escape'); teclaEv('keyup', 'Escape'); }
    if (nuevo('y')) document.getElementById('rapido')?.click();
    if (nuevo('start')) document.getElementById('menu')?.click();
    const ry = g.axes[3] || 0;
    if (Math.abs(ry) > .2) {
      poner('mando');
      if (!rodando || rodando.some(e => !e.isConnected)) rodando = desplazables();
      const d = Math.sign(ry) * (Math.abs(ry) - .2) / .8 * 1100 * dt;
      const e = rodando.find(e => d > 0 ? e.scrollTop + e.clientHeight < e.scrollHeight - 1 : e.scrollTop > 0);
      e?.scrollBy({ top: d, behavior: 'instant' });
    } else rodando = null;
    Object.assign(antes, ahora);
    raf = requestAnimationFrame(leer);
  }

  return { modo: () => modo, tipo: () => tipo, tecla, resumen, boton: (n) => BOTON[n]?.() || '', alCambiar: (f) => oyentes.push(f), avisar };
})();
