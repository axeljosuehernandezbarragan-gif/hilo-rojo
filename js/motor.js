/* Hilo Rojo · motor narrativo: escenas, diálogos, decisiones, celular, hilos y guardado. */
const Motor = (() => {
  'use strict';

  const CLAVE = 'hilorojo:v1';
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (t) => String(t ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const espera = (ms) => new Promise(r => setTimeout(r, ms));
  const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  const NOMBRES = { yare: 'Yare', iker: 'Iker', lupita: 'Lupita', abuela: 'Abuela Chela', rocio: 'Rocío', mari: 'Mari', tono: 'Toño', mama: 'Mamá', lucia: 'Maestra Lucía', mau: 'Mau', ramiro: 'Ramiro Díaz', rosy: 'Rosy' };
  /* Los contactos que conocemos llevan su retrato (el personaje de verdad), no solo una letra */
  const RETRATOS = { 'Abuela Chela': 'abuela', Lupita: 'lupita', 'Mamá': 'mama', Mari: 'mari', Iker: 'iker', 'Toño': 'tono' };
  const avatar = (chat, av) => RETRATOS[chat] ? `<span class="av foto">${Personajes.retrato(RETRATOS[chat])}</span>` : `<span class="av">${esc(av || (chat || '?')[0])}</span>`;

  let H;            // la historia (nodos, inicio, tejido, sueltos)
  let s;            // estado de la partida
  let modo = 'nada';
  let alAvanzar = null;
  let escribiendo = null;
  let terminarEscritura = null; // completa el texto de golpe si el jugador hace clic a media escritura
  let temporizador = null;
  let rapido = false;
  let escena = { id: null, actores: [] };

  const el = {};

  /* ---------- Estado y guardado ---------- */
  function nuevoEstado() {
    return { nodo: H.inicio, m: {}, rel: { iker: 0, mari: 0, lupita: 0, abuela: 0, mama: 0 }, pedidos: 0, tejido: {}, etiqueta: '' };
  }
  function guardar() { try { localStorage.setItem(CLAVE, JSON.stringify(s)); } catch (e) { /* sin almacenamiento */ } }
  function cargar() { try { return JSON.parse(localStorage.getItem(CLAVE)); } catch (e) { return null; } }
  const val = (v) => typeof v === 'function' ? v(s) : v;

  /* ---------- Escenario ---------- */
  function rangoVisible() {
    const r = el.escenario.getBoundingClientRect();
    if (!r.width || !r.height) return [.1, .9];
    const esc = Math.max(r.width / Escenarios.W, r.height / Escenarios.H);
    const vis = r.width / esc / Escenarios.W;
    const x0 = (1 - vis) / 2;
    const margen = vis * .12;
    return [x0 + margen, 1 - x0 - margen];
  }

  function ponerEscena(id, actores, hablando) {
    escena = { id, actores: actores || [] };
    const c = Escenarios.componer(id, escena.actores, hablando, rangoVisible());
    const nuevo = document.createElement('div');
    nuevo.className = 'lienzo entra';
    nuevo.dataset.tono = c.tono; // la luz de la escena tiñe a los personajes
    Sonido.ambiente(id);
    nuevo.innerHTML = c.svg;
    el.escenario.appendChild(nuevo);
    document.documentElement.style.setProperty('--luz', c.luz);
    const viejos = [...el.escenario.querySelectorAll('.lienzo')].slice(0, -1);
    requestAnimationFrame(() => nuevo.classList.remove('entra'));
    setTimeout(() => viejos.forEach(v => v.remove()), 700);
  }

  function resaltar(id) {
    el.escenario.querySelectorAll('.lienzo:last-child .actor').forEach(a => a.classList.toggle('hablando', a.dataset.id === id));
  }

  /* Paralaje suave con el mouse o la inclinación. */
  function paralaje(dx, dy) {
    el.escenario.querySelectorAll('.lienzo:last-child .capa').forEach(g => {
      const p = +g.dataset.prof || 0;
      g.style.transform = `translate(${-dx * p * 900}px, ${-dy * p * 260}px)`;
    });
  }

  /* ---------- Caja de diálogo ---------- */
  function mostrarCaja(quien, texto, clase = '') {
    clearTimeout(temporizador);
    el.caja.className = `caja visible ${clase} ${quien ? 'con-nombre' : 'narracion'}`;
    el.nombre.textContent = quien ? (NOMBRES[quien] || quien) : '';
    el.nombre.dataset.quien = quien || '';
    el.caja.dataset.quien = quien || ''; // colorea la caja según quién habla
    el.opciones.innerHTML = '';
    el.reloj.className = 'reloj';
    escribir.quien = quien;
    return escribir(texto);
  }

  function escribir(texto) {
    return new Promise(resolve => {
      const limpio = val(texto);
      el.texto.innerHTML = '';
      const letras = [...limpio];
      let i = 0;
      modo = 'escribiendo';
      el.caja.classList.remove('lista');
      const terminar = () => {
        clearInterval(escribiendo); escribiendo = null; terminarEscritura = null;
        Sonido.callar(); // si se completó de golpe, ya no se oyen más teclazos ni el lápiz
        el.texto.innerHTML = formato(limpio);
        el.caja.classList.add('lista');
        resolve();
      };
      if (reducido() || rapido) return terminar();
      if (escribir.quien) Sonido.voz(escribir.quien, limpio); else Sonido.narrar(limpio); // teclado si alguien habla, lápiz si se narra
      terminarEscritura = terminar;
      escribiendo = setInterval(() => {
        i += letras[i] === ' ' ? 2 : 1;
        el.texto.innerHTML = formato(letras.slice(0, i).join(''));
        if (i >= letras.length) terminar();
      }, 22);
    });
  }
  /* *cursiva* y **negritas** dentro de los textos. */
  const formato = (t) => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\*(.+?)\*/g, '<i>$1</i>').replace(/\n/g, '<br>');

  function esperarClic() {
    return new Promise(resolve => { modo = 'esperando'; alAvanzar = resolve; });
  }

  function avanzar() {
    if (modo === 'escribiendo' && terminarEscritura) { terminarEscritura(); return; }
    if (modo === 'esperando' && alAvanzar) { const f = alAvanzar; alAvanzar = null; modo = 'nada'; f(); }
  }

  async function decir(quien, texto, clase) {
    if (quien) resaltar(quien); else resaltar(null);
    if (quien) {
      const actor = el.escenario.querySelector(`.lienzo:last-child .actor[data-id="${quien}"]`);
      if (actor) Personajes.expresion(actor, Personajes.caraDe(val(texto)));
    }
    await mostrarCaja(quien, texto, clase);
    await esperarClic();
  }

  /* ---------- Hilos (avisos de consecuencia) ---------- */
  function hilo(texto) {
    if (!texto) return;
    Sonido.efecto('hilo');
    const a = document.createElement('div');
    a.className = 'hilo-aviso';
    a.innerHTML = `<svg viewBox="0 0 60 20" aria-hidden="true"><path d="M2 14 C12 2 18 18 28 8 S44 2 58 10" /></svg><span>${esc(val(texto))}</span>`;
    el.avisos.appendChild(a);
    setTimeout(() => a.classList.add('fuera'), 4200);
    setTimeout(() => a.remove(), 5000);
  }

  function aplicar(op) {
    if (op.fx) op.fx(s);
    if (op.tej) s.tejido[op.tej[0]] = op.tej[1];
    if (op.pedidos) s.pedidos += op.pedidos;
    hilo(op.hilo);
    guardar();
  }

  /* ---------- Decisiones ---------- */
  function elegir(n) {
    return new Promise(resolve => {
      const ops = val(n.opciones).filter(o => !o.si || o.si(s));
      modo = 'opciones';
      el.caja.classList.add('eligiendo');
      el.opciones.innerHTML = ops.map((o, i) => `<button class="opcion" data-i="${i}"><span>${i + 1}</span>${formato(val(o.t))}</button>`).join('');
      let fin = false;
      const listo = (op) => {
        if (fin) return; fin = true;
        clearInterval(temporizador);
        if (n.tiempo) Sonido.musica(null);
        Sonido.efecto('elegir');
        el.reloj.className = 'reloj';
        el.opciones.innerHTML = '';
        el.caja.classList.remove('eligiendo');
        modo = 'nada';
        resolve(op);
      };
      el.opciones.querySelectorAll('.opcion').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); listo(ops[+b.dataset.i]); }));
      el.opciones.dataset.activo = '1';
      elegir.teclas = (k) => { if (ops[k - 1]) listo(ops[k - 1]); };
      if (n.tiempo) {
        Sonido.musica('tension');
        const total = n.tiempo * 1000, t0 = Date.now();
        el.reloj.className = 'reloj activo';
        temporizador = setInterval(() => {
          const r = 1 - (Date.now() - t0) / total;
          el.reloj.style.setProperty('--r', Math.max(0, r));
          if (r <= 0) listo(n.silencio || ops[ops.length - 1]);
        }, 50);
      }
    });
  }

  /* ---------- Celular ---------- */
  function abrirTel(n) {
    el.tel.innerHTML = `
      <div class="tel-marco">
        <div class="tel-barra"><span>${esc(val(n.hora) || '')}</span><span class="senal">${n.senal === 0 ? 'Sin señal' : `${Iconos.svg('senal')} 4G`} ${Iconos.svg('bateria')}</span></div>
        <div class="tel-cab ${n.app || 'wa'}">${avatar(val(n.chat), val(n.avatar))}<div><b>${esc(val(n.chat))}</b><small>${esc(val(n.sub) || '')}</small></div></div>
        <div class="tel-msjs"></div>
        <div class="tel-pie"></div>
      </div>`;
    el.tel.classList.add('visible');
    el.caja.classList.remove('visible');
    Sonido.efecto('vibra');
    modo = 'tel';
  }
  function burbuja(m, grupo) {
    const d = document.createElement('div');
    const yo = m.de === 'yo';
    d.className = `msj ${yo ? 'yo' : 'otro'} ${m.clase || ''}`;
    d.innerHTML = `${!yo && grupo ? `<small class="autor">${esc(m.de)}</small>` : ''}
      ${m.audio ? `<div class="audio"><span class="play">${Iconos.svg('play')}</span><span class="onda"></span><small>${m.audio}</small></div>${m.texto ? `<p class="transcripcion">“${formato(m.texto)}”</p>` : ''}`
        : m.img ? `<div class="img-msj">${m.img}</div>${m.texto ? `<p>${formato(m.texto)}</p>` : ''}`
          : `<p>${formato(val(m.texto))}</p>`}
      <span class="hora">${esc(m.hora || '')}${yo ? ' ✓✓' : ''}</span>`;
    return d;
  }
  async function mensajes(lista, grupo) {
    const caja = $('.tel-msjs', el.tel);
    for (const m of lista) {
      if (m.si && !m.si(s)) continue;
      if (m.de !== 'yo' && !rapido && !reducido()) {
        const tecleo = document.createElement('div');
        tecleo.className = 'msj otro escribiendo';
        tecleo.innerHTML = '<i></i><i></i><i></i>';
        caja.appendChild(tecleo); caja.scrollTop = caja.scrollHeight;
        await espera(Math.min(1700, 550 + String(val(m.texto) || '').length * 14));
        tecleo.remove();
      } else if (!rapido && !reducido()) await espera(350);
      caja.appendChild(burbuja(m, grupo));
      Sonido.efecto(m.de === 'yo' ? 'envia' : 'notif');
      caja.scrollTop = caja.scrollHeight;
    }
  }
  function botonTel(texto) {
    return new Promise(resolve => {
      const pie = $('.tel-pie', el.tel);
      pie.innerHTML = `<button class="tel-seguir">${texto}</button>`;
      $('.tel-seguir', pie).addEventListener('click', (e) => { e.stopPropagation(); pie.innerHTML = ''; resolve(); });
    });
  }
  function respuestasTel(ops) {
    return new Promise(resolve => {
      const pie = $('.tel-pie', el.tel);
      pie.innerHTML = `<p class="tel-pista">Responder</p>${ops.map((o, i) => `<button class="tel-resp" data-i="${i}">${formato(val(o.t))}</button>`).join('')}`;
      const msjs = $('.tel-msjs', el.tel); msjs.scrollTop = msjs.scrollHeight; // que el último mensaje siga a la vista
      pie.querySelectorAll('.tel-resp').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); pie.innerHTML = ''; resolve(ops[+b.dataset.i]); }));
      elegir.teclas = (k) => { if (ops[k - 1]) { pie.innerHTML = ''; resolve(ops[k - 1]); } };
    });
  }
  /* Pasar a otro chat dentro del mismo celular (p. ej. del grupo al privado de alguien). */
  async function cambiarChat(c) {
    const msjs = $('.tel-msjs', el.tel), cab = $('.tel-cab', el.tel);
    if (!reducido() && !rapido) { msjs.classList.add('saliendo'); await espera(260); }
    cab.className = `tel-cab ${c.app || 'wa'}`;
    cab.innerHTML = `${avatar(c.chat, c.avatar)}<div><b>${esc(c.chat)}</b><small>${esc(c.sub || '')}</small></div>`;
    msjs.innerHTML = (c.previos || []).map(m => burbuja(m, false).outerHTML).join('');
    msjs.classList.remove('saliendo');
    msjs.classList.add('entrando');
    setTimeout(() => msjs.classList.remove('entrando'), 400);
    if (!reducido() && !rapido) await espera(350);
  }
  function cerrarTel() { el.tel.classList.remove('visible'); modo = 'nada'; }

  /* ---------- Pensamientos de Yare (revisar / celular explorable) ----------
     Aparecen uno a la vez y se desvanecen. Los que valen la pena (lo que el jugador tocó a propósito)
     se guardan en «Lo que pensé» para volver a leerlos. */
  const HTML_PENSAR = `<div class="pensar-zona" aria-live="polite"></div>
    <div class="pensar-memoria" hidden><button class="pensar-boton" aria-expanded="false">${Iconos.svg('pensar')} Lo que pensé <span>0</span></button><ul class="rev-notas" hidden></ul></div>`;
  function pensamientos(raiz) {
    const zona = $('.pensar-zona', raiz), memoria = $('.pensar-memoria', raiz), lista = $('.rev-notas', raiz), boton = $('.pensar-boton', raiz);
    const guardados = new Set();
    let actual = null, reloj = null;
    boton.addEventListener('click', (e) => {
      e.stopPropagation();
      lista.hidden = !lista.hidden;
      boton.setAttribute('aria-expanded', !lista.hidden);
    });
    const quitar = (d) => { d.classList.add('fuera'); setTimeout(() => d.remove(), reducido() ? 0 : 450); };
    return function mostrar(id, texto, recordar) {
      if (actual) { quitar(actual); clearTimeout(reloj); }
      const d = document.createElement('div');
      d.className = 'pensar';
      d.innerHTML = `<span class="quien-piensa">Yare</span>${formato(texto)}`;
      zona.appendChild(d);
      actual = d;
      const dura = Math.min(9000, Math.max(4500, 3000 + texto.length * 45));
      reloj = setTimeout(() => { quitar(d); if (actual === d) actual = null; }, dura);
      if (recordar && !guardados.has(id)) {
        guardados.add(id);
        const li = document.createElement('li');
        li.innerHTML = formato(texto);
        lista.appendChild(li);
        memoria.hidden = false;
        $('span', boton).textContent = guardados.size;
      }
    };
  }

  /* La pista de controles de la portada cambia si se juega con teclado, pantalla táctil o mando */
  Entrada.alCambiar(() => document.querySelectorAll('.pista-controles').forEach(e => { e.innerHTML = Entrada.resumen('portada'); }));

  /* ---------- Paneles a pantalla completa ---------- */
  function panel(html, clase) {
    el.panel.className = `panel visible ${clase}`;
    el.panel.innerHTML = html;
    el.caja.classList.remove('visible');
    return el.panel;
  }
  function cerrarPanel() { el.panel.className = 'panel'; el.panel.innerHTML = ''; }

  /* ---------- Ejecutar nodos ---------- */
  async function ir(id) {
    if (!H.nodos[id]) { console.error('Nodo inexistente:', id); return; }
    s.nodo = id;
    const n = H.nodos[id];
    if (n.alEntrar) n.alEntrar(s); // efectos al llegar a la escena (p. ej. calcular consecuencias)
    const escId = val(n.escena);
    const actores = val(n.actores);
    if (escId && (escId !== escena.id || (actores && JSON.stringify(actores) !== JSON.stringify(escena.actores)))) ponerEscena(escId, actores, n.quien);
    else if (actores && JSON.stringify(actores) !== JSON.stringify(escena.actores)) ponerEscena(escena.id, actores, n.quien);
    s.escena = { id: escena.id, actores: escena.actores }; // al continuar la partida se vuelve a poner este escenario
    guardar();
    const sig = await (TIPOS[n.tipo] || TIPOS.narra)(n);
    const destino = val(sig ?? n.sig);
    if (destino) ir(destino);
  }

  async function reacciones(lista) {
    for (const [q, t] of (lista || [])) await decir(q, t);
  }

  const TIPOS = {
    async titulo(n) {
      el.caja.classList.remove('visible');
      s.etiqueta = `${n.sup} · ${n.titulo}`;
      Sonido.efecto('titulo');
      el.etiqueta.textContent = s.etiqueta;
      const p = panel(`<div class="titulo-cap"><p class="sup">${esc(n.sup)}</p><h1>${esc(n.titulo)}</h1><p class="sub">${esc(n.sub || '')}</p><svg viewBox="0 0 300 30" class="hilo-linea"><path d="M4 18 C60 2 90 28 150 14 S240 4 296 16"/></svg><p class="toca">Toca para continuar</p></div>`, 'titulo');
      await new Promise(r => { p.addEventListener('click', r, { once: true }); modo = 'esperando'; alAvanzar = r; });
      modo = 'nada'; alAvanzar = null;
      cerrarPanel();
    },
    async narra(n) { await decir(null, n.texto, n.clase); },
    async dice(n) { await decir(n.quien, n.texto, n.clase); },
    async salto() {},
    async elige(n) {
      if (n.texto) { resaltar(n.quien || null); await mostrarCaja(n.quien || null, n.texto); }
      else { el.caja.className = 'caja visible'; el.texto.innerHTML = ''; el.nombre.textContent = ''; }
      const op = await elegir(n);
      aplicar(op);
      await reacciones(val(op.dice));
      return op.ir;
    },
    async tel(n) {
      abrirTel(n);
      const grupo = !!n.grupo;
      await mensajes(val(n.mensajes), grupo);
      const ops = n.opciones ? (val(n.opciones) || null)?.filter(o => !o.si || o.si(s)) : null;
      let op = null;
      if (ops) {
        op = await respuestasTel(ops);
        aplicar(op);
        const otro = val(op.chat); // la respuesta se escribe en otro chat
        if (otro) await cambiarChat(otro);
        const g = otro ? !!otro.grupo : grupo;
        // Lo que se escribe en el chat: «…» marca diálogo en la opción, pero en el mensaje no va.
        if (op.yo !== false) await mensajes([{ de: 'yo', texto: val(op.yo) || String(val(op.t)).replace(/^«([\s\S]*)»$/, '$1'), hora: val(n.hora) }], g); // yo: false = no se escribe nada (dejar en visto)
        if (op.respuesta) await mensajes(val(op.respuesta), g);
      }
      await botonTel(n.boton || 'Continuar');
      cerrarTel();
      if (op) await reacciones(val(op.dice));
      return op?.ir;
    },
    /* Revisar un mensaje pieza por pieza (como en Orwell o Papers, Please). Revisar es opcional. */
    async revisar(n) {
      const partes = val(n.partes);
      const ops = val(n.opciones).filter(o => !o.si || o.si(s));
      const vistos = new Set();
      const p = panel(`<div class="revisar-caja">
          <div class="rev-tel">
            <div class="rev-cab ${n.app || ''}">${val(n.cabecera)}</div>
            <div class="rev-cuerpo">${partes.map(x => `<button class="pista" data-id="${x.id}">${x.html}</button>`).join('')}</div>
          </div>
          <div class="rev-lado">
            ${n.texto ? `<p class="rev-texto">${formato(val(n.texto))}</p>` : ''}
            <p class="rev-indica">${Iconos.svg('lupa')} ${esc(n.indica || 'Toca cualquier parte para revisarla.')}</p>
            ${HTML_PENSAR}
            <p class="sup">¿Qué haces?</p>
            <div class="rev-ops">${ops.map((o, i) => `<button class="opcion" data-i="${i}"><span>${i + 1}</span>${formato(val(o.t))}</button>`).join('')}</div>
          </div>
        </div>`, 'revisar');
      const pensar = pensamientos(p);
      p.querySelectorAll('.pista').forEach(b => b.addEventListener('click', (e) => {
        e.stopPropagation();
        const x = partes.find(q => q.id === b.dataset.id);
        b.classList.add('vista');
        vistos.add(x.id);
        pensar(x.id, val(x.nota), true); // tocarla otra vez la vuelve a mostrar
      }));
      const op = await new Promise(r => {
        p.querySelectorAll('.rev-ops .opcion').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); r(ops[+b.dataset.i]); }));
        modo = 'opciones';
        elegir.teclas = (k) => { if (ops[k - 1]) r(ops[k - 1]); };
      });
      modo = 'nada';
      if (n.marca) s.m[n.marca] = vistos.size;
      cerrarPanel();
      aplicar(op);
      await reacciones(val(op.dice));
      return op.ir;
    },
    /* Celular explorable: pantallas por las que el jugador navega a su ritmo (bandeja, perfiles, menú…).
       Lo que Yare piensa al ver algo aparece a la derecha; nunca confirma si algo es falso. */
    async app(n) {
      const P = val(n.pantallas), piezas = val(n.piezas) || {};
      const ops = val(n.opciones).filter(o => !o.si || o.si(s));
      const est = { pila: [...(n.pila || [n.inicio])], vistos: new Set(), pensados: new Set() };
      const p = panel(`<div class="revisar-caja app-caja">
          <div class="rev-tel app-tel">
            ${n.barra ? '<div class="app-barra"></div>' : ''}
            <div class="app-cab"></div>
            <div class="app-cuerpo"></div>
            ${n.tabs ? `<nav class="app-tabs">${n.tabs.map(([id, txt]) => `<button data-tab="${id}">${txt}</button>`).join('')}</nav>` : ''}
          </div>
          <div class="rev-lado">
            ${n.texto ? `<p class="rev-texto">${formato(val(n.texto))}</p>` : ''}
            <p class="rev-indica">${Iconos.svg('celular')} ${esc(n.indica || 'Puedes moverte por el celular con calma.')}</p>
            ${HTML_PENSAR}
            <p class="sup">¿Qué haces?</p>
            <div class="rev-ops">${ops.map((o, i) => `<button class="opcion" data-i="${i}"><span>${i + 1}</span>${formato(val(o.t))}</button>`).join('')}</div>
          </div>
        </div>`, 'revisar app');
      const cab = $('.app-cab', p), cuerpo = $('.app-cuerpo', p), mostrarPensamiento = pensamientos(p);
      let resolver;
      /* Lo de las pantallas se piensa una sola vez y no se guarda (salvo que la pantalla diga «recordar»);
         lo que el jugador toca a propósito se guarda y se puede volver a mostrar tocándolo otra vez. */
      const pensar = (id, texto, recordar = true, otraVez = false) => {
        if (!texto || (est.pensados.has(id) && !otraVez)) return;
        est.pensados.add(id);
        mostrarPensamiento(id, val(texto), recordar);
      };
      const api = {
        pensar, hilo,
        ir: (id) => { est.pila.push(id); mostrar(); },
        atras: () => { if (est.pila.length > 1) est.pila.pop(); mostrar(); },
        /* Resolver desde una acción (p. ej. se acabó el tiempo); busca también entre opciones ocultas. */
        elegir: (id) => { const op = val(n.opciones).find(o => o.id === id); if (op) setTimeout(() => resolver(op), reducido() ? 0 : 1600); }
      };
      function mostrar() {
        const id = est.pila[est.pila.length - 1], pa = P[id];
        est.vistos.add(id);
        cab.innerHTML = `${est.pila.length > 1 ? '<button class="app-atras" data-atras aria-label="Atrás">‹</button>' : ''}<b>${formato(val(pa.titulo))}</b>`;
        cuerpo.innerHTML = typeof pa.cuerpo === 'function' ? pa.cuerpo(s, est) : pa.cuerpo;
        cuerpo.scrollTop = 0;
        if (n.barra) $('.app-barra', p).innerHTML = n.barra(s, est);
        p.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('activa', b.dataset.tab === (pa.tab || est.pila[0])));
        pensar('ver:' + id, pa.pensar, !!pa.recordar);
      }
      p.querySelector('.app-tel').addEventListener('click', (e) => {
        e.stopPropagation();
        const b = e.target.closest('[data-ir],[data-atras],[data-tab],[data-p],[data-a],[data-elige]');
        if (!b) return;
        if (b.dataset.p) { b.classList.add('vista'); pensar(b.dataset.p, piezas[b.dataset.p], true, true); }
        if (b.dataset.a && n.acciones?.[b.dataset.a]) { n.acciones[b.dataset.a](s, est, api); guardar(); mostrar(); }
        if (b.dataset.ir) api.ir(b.dataset.ir);
        if (b.hasAttribute('data-atras')) api.atras();
        if (b.dataset.tab) { est.pila = [b.dataset.tab]; mostrar(); }
        if (b.dataset.elige) { const op = ops.find(o => o.id === b.dataset.elige); if (op) resolver(op); }
      });
      mostrar();
      const op = await new Promise(r => {
        resolver = r;
        p.querySelectorAll('.rev-ops .opcion').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); r(ops[+b.dataset.i]); }));
        modo = 'opciones';
        elegir.teclas = (k) => { if (ops[k - 1]) r(ops[k - 1]); };
      });
      modo = 'nada';
      if (n.marca) { s.m[n.marca] = est.pensados.size; s.m[n.marca + 'Vistas'] = [...est.vistos]; }
      cerrarPanel();
      aplicar(op);
      await reacciones(val(op.dice));
      return op.ir;
    },
    async caminar(n) {
      Sonido.musica(n.mundo);
      await new Promise(r => Caminar.iniciar(n, s, el, () => { cerrarPanel(); guardar(); r(); }));
      Sonido.musica(null); Sonido.ambiente(escena.id);
    },
    /* Cinemática muda de un final (cine.js): solo música. */
    async cine(n) { await Cine.reproducir(val(n.guion), el); cerrarPanel(); },
    async clave(n) { return new Promise(r => Clave.iniciar(n, s, el, () => { cerrarPanel(); guardar(); r(); })); },
    async ciber(n) { return new Promise(r => Ciber.iniciar(n, s, el, (marcas) => { cerrarPanel(); guardar(); r(); })); },
    async diario(n) {
      Sonido.efecto('papel'); Sonido.musica('diario');
      const p = panel(`<div class="libreta"><p class="fecha">${esc(n.fecha)}</p>${val(n.parrafos).filter(Boolean).map(t => `<p>${formato(t)}</p>`).join('')}<p class="firma">— Y.</p><button class="boton">Cerrar la libreta</button></div>`, 'diario');
      await new Promise(r => $('.boton', p).addEventListener('click', r));
      Sonido.efecto('papel');
      cerrarPanel();
    },
    async tejido(n) {
      Sonido.efecto('tejido'); Sonido.musica('diario');
      const p = panel(Tejido.html(val(n.filas) || H.tejido, s, val(n.sueltos), n.proximo, n.titulo, n.sup), 'tejido');
      await new Promise(r => $('.boton', p).addEventListener('click', r));
      if (n.sig !== 's9c') Sonido.musica(null);
      cerrarPanel();
    },
    async fin(n) {
      const p = panel(`<div class="fin-demo"><p class="sup">${esc(val(n.sup))}</p><h1>${esc(val(n.titulo))}</h1><p>${esc(val(n.texto))}</p>
        <div class="botones"><button class="boton" data-a="otra">Jugar otra vez</button><button class="boton vacio" data-a="portada">Volver a la portada</button><a class="boton vacio" href="propuesta.html">Leer la propuesta</a></div></div>`, 'fin');
      $('[data-a="otra"]', p).addEventListener('click', () => { cerrarPanel(); s = nuevoEstado(); guardar(); ir(H.inicio); });
      $('[data-a="portada"]', p).addEventListener('click', () => { cerrarPanel(); portada(); });
      return null;
    }
  };

  /* Partidas guardadas antes de que se guardara el escenario: el último nodo anterior que pone uno */
  function escenaPrevia(id) {
    let ultima = null;
    for (const [k, n] of Object.entries(H.nodos)) {
      if (k === id) break;
      const e = n.escena && val(n.escena);
      if (e) ultima = { id: e, actores: val(n.actores) || [] };
      else if (n.actores && ultima) ultima.actores = val(n.actores);
    }
    return ultima;
  }

  /* ---------- Portada ---------- */
  function portada() {
    ponerEscena('encinal', []);
    Sonido.musica('portada');
    el.caja.classList.remove('visible');
    el.etiqueta.textContent = '';
    const hay = cargar();
    const p = panel(`
      <div class="portada">
        <p class="sup">Una historia sobre lo que dejamos a la vista</p>
        <h1>Hilo <span>Rojo</span></h1>
        <svg viewBox="0 0 300 30" class="hilo-linea"><path d="M4 18 C60 2 90 28 150 14 S240 4 296 16"/></svg>
        <div class="botones">
          ${hay && hay.nodo !== H.inicio ? `<button class="boton" data-a="seguir">Continuar · ${esc(hay.etiqueta || '')}</button>` : ''}
          <button class="boton ${hay && hay.nodo !== H.inicio ? 'vacio' : ''}" data-a="nueva">Nueva partida</button>
          <a class="boton vacio" href="propuesta.html">Leer la propuesta</a>
        </div>
        <p class="nota">Cada decisión deja un hilo. Algunos se cruzan días después.<br><span class="pista-controles">${Entrada.resumen('portada')}</span></p>
      </div>`, 'inicio');
    /* Si el navegador no deja sonar hasta que se toque algo, se avisa (y el aviso se va solo en cuanto suena) */
    const oir = document.createElement('div');
    oir.className = 'aviso-sonido fuera';
    oir.innerHTML = `${Iconos.svg('sonido')} Toca cualquier parte para oír la música`;
    p.appendChild(oir);
    setTimeout(() => Sonido.alCambiar(on => { if (oir.isConnected) oir.classList.toggle('fuera', on || !Sonido.prefs().musica); }), 700);
    $('[data-a="nueva"]', p).addEventListener('click', () => { Sonido.iniciar(); Sonido.musica(null); cerrarPanel(); s = nuevoEstado(); guardar(); ir(H.inicio); });
    $('[data-a="seguir"]', p)?.addEventListener('click', () => {
      Sonido.iniciar(); Sonido.musica(null); cerrarPanel();
      s = Object.assign(nuevoEstado(), hay); el.etiqueta.textContent = s.etiqueta;
      const e = s.escena || escenaPrevia(s.nodo); // el escenario donde se quedó, no el de la portada
      if (e?.id) ponerEscena(e.id, e.actores);
      ir(s.nodo);
    });
  }

  /* ---------- Arranque ---------- */
  function iniciar(historia) {
    H = historia;
    Object.assign(el, {
      escenario: $('#escenario'), caja: $('#caja'), nombre: $('#caja .nombre'), texto: $('#caja .texto'),
      opciones: $('#caja .opciones'), reloj: $('#caja .reloj'), tel: $('#tel'), panel: $('#panel'), avisos: $('#avisos'), etiqueta: $('#etiqueta')
    });

    const despertar = () => Sonido.iniciar();
    addEventListener('pointerdown', despertar, true); addEventListener('keydown', despertar, true);
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, a, input, .tel, .menu-juego, .panel.visible:not(.titulo)')) return;
      avanzar();
    });
    document.addEventListener('keydown', (e) => {
      if (e.target.matches?.('input, textarea') || !$('#menu-juego').hidden) return;
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); avanzar(); }
      if (/^[1-4]$/.test(e.key) && elegir.teclas && (modo === 'opciones' || modo === 'tel')) elegir.teclas(+e.key);
    });
    document.addEventListener('pointermove', (e) => {
      if (reducido() || e.pointerType === 'touch') return;
      paralaje(e.clientX / innerWidth - .5, e.clientY / innerHeight - .5);
    });
    let t;
    addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => escena.id && ponerEscena(escena.id, escena.actores), 200); });
    /* Menú propio: el panel del navegador de la app bloquea confirm(). */
    const menu = $('#menu-juego');
    const cerrarMenu = () => { menu.hidden = true; };
    $('#menu').addEventListener('click', (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; });
    const pref = Sonido.prefs();
    menu.querySelectorAll('[data-s]').forEach(i => {
      if (i.type === 'checkbox') i.checked = !!pref[i.dataset.s]; else i.value = pref[i.dataset.s];
      i.addEventListener('input', () => { Sonido.iniciar(); Sonido.ajustar({ [i.dataset.s]: i.type === 'checkbox' ? i.checked : +i.value }); Sonido.efecto('clic'); });
    });
    menu.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('.ajustes-sonido')) return;
      const a = e.target.closest('[data-m]')?.dataset.m;
      if (!a || a === 'seguir' || e.target === menu) return cerrarMenu();
      if (a === 'reiniciar') { try { localStorage.removeItem(CLAVE); } catch (err) { /* nada */ } }
      location.reload();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarMenu(); });
    $('#rapido').addEventListener('click', (e) => { e.stopPropagation(); rapido = !rapido; e.currentTarget.classList.toggle('activo', rapido); e.currentTarget.setAttribute('aria-pressed', rapido); });
    portada();
  }

  return { iniciar, hilo, NOMBRES, formato, esc, val: (v) => val(v), estado: () => s };
})();

/* ---------- Escena interactiva: crear la contraseña ---------- */
const Clave = (() => {
  const PERSONALES = ['bordad', 'hilo', 'rojo', 'encinal', 'chela', 'graciela', 'coronel', 'yare', 'tepetlan', 'abuela', 'lupita', 'cooperativa', '2024', '2025', '2026'];
  const COMUNES = ['123', 'abc', 'qwerty', 'contrasena', 'password', '000', '111'];

  function analizar(p) {
    const n = p.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    const tipos = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter(r => r.test(p)).length;
    const personal = PERSONALES.some(x => n.includes(x));
    const comun = COMUNES.some(x => n.includes(x)) || /(.)\1\1/.test(p);
    if (p.length < 9 || personal || comun) return 'debil';
    if (p.length >= 14 && (tipos >= 3 || p.length >= 18)) return 'fuerte';
    return 'media';
  }

  const DICE = {
    debil: ['¡Esa! Esa hasta doña Tere se la aprende.', 'Perfecto, fácil. Así nadie batalla.', 'Ándale, esa sí.'],
    media: ['Mmm… ¿y eso cómo se lo dicto a doña Tere por teléfono?', 'Ok, pero me la vas a tener que repetir.', 'Ni que fuera la del banco, Yare.'],
    fuerte: ['¿Qué es eso? ¿Un hechizo?', 'Yare, por favor. Nadie se va a acordar de eso.', 'Ni yo me la aprendo, y eso que estoy viéndola.']
  };
  const PIENSA = {
    debil: 'Fácil de recordar. Para todas. Para cualquiera.',
    media: 'Ni tan fácil, ni tan difícil. Como casi todo lo que hago de noche.',
    fuerte: 'Nadie la va a adivinar. Ni siquiera Lupita, que me está viendo.'
  };

  function iniciar(n, s, el, listo) {
    const p = document.createElement('div');
    el.panel.className = 'panel visible clave';
    el.caja.classList.remove('visible');
    el.panel.innerHTML = `
      <div class="libro-pass">
        <p class="sup">Nueva página · Hilo Rojo · Bordados de El Encinal</p>
        <h2>Crea la contraseña de la página</h2>
        <p class="sit">Lupita se inclina sobre tu hombro para ver la pantalla.</p>
        <div class="campo-pass"><input id="pass" type="text" autocomplete="off" spellcheck="false" maxlength="40" placeholder="Escribe la contraseña…" aria-label="Contraseña de la página"></div>
        <p class="nota">Es un juego: no escribas una contraseña que uses de verdad.</p>
        <div class="lupe"><span class="quien">Lupita</span><p id="lupe-dice">Ándale, ponle algo fácil.</p></div>
        <p class="piensa" id="piensa"></p>
        <button class="boton" id="guardar-pass" disabled>Guardar contraseña</button>
      </div>`;
    const inp = el.panel.querySelector('#pass');
    const btn = el.panel.querySelector('#guardar-pass');
    let t, nivel = 'debil';
    inp.focus();
    inp.addEventListener('input', () => {
      btn.disabled = inp.value.length < 4;
      clearTimeout(t);
      t = setTimeout(() => {
        nivel = analizar(inp.value);
        const frases = DICE[nivel];
        el.panel.querySelector('#lupe-dice').textContent = frases[Math.floor(Math.random() * frases.length)];
        el.panel.querySelector('#piensa').textContent = inp.value.length >= 4 ? PIENSA[nivel] : '';
      }, 450);
    });
    btn.addEventListener('click', () => {
      nivel = analizar(inp.value);
      s.m.clave = nivel;
      s.m.claveLargo = inp.value.length;
      s.tejido.clave = nivel;
      inp.value = ''; // no se guarda el texto, solo qué tan fuerte era
      Motor.hilo(nivel === 'debil' ? 'Lupita aprobó tu contraseña.' : 'Lupita no se la va a aprender.');
      listo();
    });
  }
  return { iniciar, analizar };
})();

/* ---------- Tejido: diagrama de ramas al final del capítulo ---------- */
const Tejido = (() => {
  function html(todas, s, sueltos = [], proximo, titulo = 'El tejido de tu día', sup = 'Fin del capítulo') {
    const filas = todas.filter(f => s.tejido[f.clave] !== undefined); // solo lo que de verdad pasó en esta partida
    const ancho = 640, alto = 92;
    const pts = [];
    const nodos = filas.map((f, i) => {
      const y = 46 + i * alto;
      const n = f.opciones.length;
      return f.opciones.map(([v, etiqueta], j) => {
        const x = ancho * (j + 1) / (n + 1);
        const elegido = s.tejido[f.clave] === v;
        if (elegido) pts.push([x, y]);
        return `<g class="nodo ${elegido ? 'elegido' : ''}">
          <circle cx="${x}" cy="${y}" r="${elegido ? 11 : 8}"/>
          ${elegido ? `<path d="M${x - 5} ${y - 5} L${x + 5} ${y + 5} M${x + 5} ${y - 5} L${x - 5} ${y + 5}" class="cruz"/>` : ''}
          <text x="${x}" y="${y + 30}" text-anchor="middle">${Motor.esc(etiqueta)}</text></g>`;
      }).join('') + `<text x="10" y="${y - 22}" class="fila-tit">${Motor.esc(f.titulo)}</text>`;
    }).join('');
    let d = '';
    pts.forEach(([x, y], i) => {
      if (!i) { d = `M${x} ${y}`; return; }
      const [px, py] = pts[i - 1];
      d += ` C${px} ${py + alto * .55} ${x} ${y - alto * .55} ${x} ${y}`;
    });
    const total = 46 + filas.length * alto;
    const ocultos = `<g class="oculto">${[0, 1, 2].map(j => `<circle cx="${ancho * (j + 1) / 4}" cy="${total}" r="8"/><text x="${ancho * (j + 1) / 4}" y="${total + 4}" text-anchor="middle">?</text>`).join('')}<text x="10" y="${total - 22}" class="fila-tit">${Motor.esc(proximo || 'Lo que sigue')}</text></g>`;
    return `<div class="tejido-caja">
      <p class="sup">${Motor.esc(sup)}</p><h2>${Motor.esc(titulo)}</h2>
      <p class="sub">El hilo rojo es tu camino. Los puntos grises son lo que no elegiste.</p>
      <svg viewBox="0 0 ${ancho} ${total + 30}" class="tejido-svg">
        ${filas.map((_, i) => `<line x1="0" x2="${ancho}" y1="${46 + i * alto + alto / 2 + 4}" y2="${46 + i * alto + alto / 2 + 4}" class="sep"/>`).join('')}
        <path d="${d}" class="hilo-camino"/>
        ${nodos}${ocultos}
      </svg>
      ${sueltos.length ? `<div class="sueltos"><h3>Hilos sueltos</h3><ul>${sueltos.map(t => `<li>${Motor.formato(t)}</li>`).join('')}</ul></div>` : ''}
      <button class="boton">Continuar</button>
    </div>`;
  }
  return { html };
})();
