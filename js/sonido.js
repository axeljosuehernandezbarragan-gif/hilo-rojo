/* Hilo Rojo · sonido (Web Audio). La música, los efectos y los murmullos se hacen con código (guitarra con
   Karplus-Strong, cajita de música, colchones). Los ambientes, el teclado al hablar, el lápiz al narrar y los
   pasos son grabaciones de dominio público (CC0, Freesound) que viven en audio/ (créditos en audio/CREDITOS.md).
   Si no se pueden cargar (p. ej. abriendo el archivo sin servidor), se usa la versión sintetizada de antes.
   El sonido se prepara en cuanto carga la página. Si el navegador no deja sonar sin que la persona haya tocado
   algo, todo queda listo y arranca con el primer toque o tecla en cualquier parte (no hace falta un botón). */
const Sonido = (() => {
  'use strict';
  const PREF = 'hilorojo:audio';
  let prefs = { musica: true, efectos: true, voces: true, volumen: .8 };
  try { Object.assign(prefs, JSON.parse(localStorage.getItem(PREF)) || {}); } catch (e) { /* sin almacenamiento */ }
  let ctx = null, master, bus = {}, ruidoBuf, pedidoAmb = null, pedidoMus = null, ambActual = null, musActual = null;
  const cuerdas = {};

  /* ---------- Arranque y volumen ---------- */
  function iniciar() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume().then(avisar, () => {}); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    ctx.onstatechange = avisar;
    if (ctx.state === 'suspended') ctx.resume().then(avisar, () => {});
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 3;
    master = ctx.createGain(); master.connect(comp); comp.connect(ctx.destination);
    for (const k of ['musica', 'efectos', 'ambiente', 'voces']) { bus[k] = ctx.createGain(); bus[k].connect(master); }
    ruidoBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const d = ruidoBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    /* Eco de sala grande (reverberación hecha con ruido que se apaga): da espacio y misterio */
    const eco = ctx.createConvolver(), n = Math.round(ctx.sampleRate * 3.4), imp = ctx.createBuffer(2, n, ctx.sampleRate);
    for (let c = 0; c < 2; c++) { const x = imp.getChannelData(c); for (let i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / n, 2.8); }
    eco.buffer = imp; const ecoG = ctx.createGain(); ecoG.gain.value = .5; eco.connect(ecoG); ecoG.connect(master);
    [['musica', .55], ['efectos', .35], ['voces', .18]].forEach(([k, v]) => { const g = ctx.createGain(); g.gain.value = v; bus[k].connect(g); g.connect(eco); });
    aplicar();
    setInterval(bombear, 250);
    const cuadro = () => { bombear(); requestAnimationFrame(cuadro); }; requestAnimationFrame(cuadro);
    ['teclas', 'lapiz', 'pasosTierra', 'pasosPiso', 'reloj'].forEach(cargar); // los cortos se cargan de una vez
    if (pedidoAmb) { const a = pedidoAmb; pedidoAmb = null; ambiente(a); }
    if (pedidoMus) { const m = pedidoMus; pedidoMus = null; musica(m); }
  }
  /* Quien quiera saber si ya suena (p. ej. la portada, para quitar el «toca para oír») */
  const oyentes = [];
  const activo = () => !!ctx && ctx.state === 'running';
  function avisar() { oyentes.forEach(f => f(activo())); }
  function alCambiar(f) { oyentes.push(f); f(activo()); }
  function aplicar() {
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.setTargetAtTime(prefs.volumen, t, .05);
    bus.musica.gain.setTargetAtTime(prefs.musica ? .55 : 0, t, .1);
    bus.efectos.gain.setTargetAtTime(prefs.efectos ? .7 : 0, t, .05);
    bus.ambiente.gain.setTargetAtTime(prefs.efectos ? .5 : 0, t, .3);
    bus.voces.gain.setTargetAtTime(prefs.voces ? .5 : 0, t, .05);
  }
  function ajustar(cambios) { Object.assign(prefs, cambios); try { localStorage.setItem(PREF, JSON.stringify(prefs)); } catch (e) { /* nada */ } aplicar(); }

  /* La música y los lazos programan lo que va a sonar un poco antes. Se les da cuerda con un temporizador y también
     en cada cuadro: al caminar, el navegador se ocupa en dibujar y puede atrasar los temporizadores varios segundos
     (la banda de la feria se callaba hasta soltar la flecha y luego sonaba todo de golpe). */
  const latidos = new Set();
  function bombear() { latidos.forEach(f => f()); }

  /* ---------- Piezas básicas ---------- */
  const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
  function tono(f, t, dur, vol, dest, { tipo = 'sine', ataque = .005, caida = null, filtro = null, glide = null } = {}) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = tipo; o.frequency.setValueAtTime(f, t);
    if (glide) o.frequency.exponentialRampToValueAtTime(glide, t + dur);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + ataque);
    g.gain.exponentialRampToValueAtTime(.0001, t + (caida || dur));
    let n = o;
    if (filtro) { const fl = ctx.createBiquadFilter(); fl.type = filtro[0]; fl.frequency.value = filtro[1]; fl.Q.value = filtro[2] || 1; o.connect(fl); n = fl; }
    n.connect(g); g.connect(dest); o.start(t); o.stop(t + (caida || dur) + .05);
  }
  function ruido(t, dur, vol, dest, { tipo = 'bandpass', f = 1000, q = 1, f2 = null, ataque = .004 } = {}) {
    const src = ctx.createBufferSource(); src.buffer = ruidoBuf; src.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = tipo; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + ataque); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    src.connect(fl); fl.connect(g); g.connect(dest); src.start(t, Math.random()); src.stop(t + dur + .05);
  }
  /* Cuerda pulsada (Karplus-Strong): suena a guitarra o a requinto. */
  function cuerda(f) {
    const k = Math.round(f);
    if (cuerdas[k]) return cuerdas[k];
    const sr = ctx.sampleRate, n = Math.round(sr * 2.2), b = ctx.createBuffer(1, n, sr), d = b.getChannelData(0);
    const p = Math.max(2, Math.round(sr / f)), lin = new Float32Array(p);
    for (let i = 0; i < p; i++) lin[i] = Math.random() * 2 - 1;
    for (let i = 0; i < n; i++) { const a = lin[i % p], c = lin[(i + 1) % p]; lin[i % p] = (a + c) * .5 * .996; d[i] = a; }
    return (cuerdas[k] = b);
  }
  function guitarra(m, t, vol, dest) { const s = ctx.createBufferSource(); s.buffer = cuerda(mtof(m)); const g = ctx.createGain(); g.gain.value = vol; s.connect(g); g.connect(dest); s.start(t); }
  function cajita(m, t, vol, dest) { tono(mtof(m), t, 1.4, vol, dest); tono(mtof(m) * 2.01, t, .5, vol * .35, dest); tono(mtof(m) * 3.98, t, .18, vol * .12, dest); }
  function colchon(ms, t, dur, vol, dest) { ms.forEach(m => { [-6, 6].forEach(det => { const o = ctx.createOscillator(), g = ctx.createGain(), fl = ctx.createBiquadFilter(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det; fl.type = 'lowpass'; fl.frequency.value = 900; g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol / ms.length, t + dur * .35); g.gain.linearRampToValueAtTime(0, t + dur); o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o.stop(t + dur + .1); }); }); }
  function campana(m, t, vol, dest) { tono(mtof(m), t, 2.6, vol, dest, { ataque: .01 }); tono(mtof(m) * 2.76, t, .9, vol * .3, dest, { ataque: .01 }); }
  function bajo(m, t, dur, vol, dest) { tono(mtof(m), t, dur, vol, dest, { tipo: 'triangle', ataque: .01 }); }
  function metal(m, t, dur, vol, dest) { tono(mtof(m), t, dur, vol, dest, { tipo: 'square', ataque: .02, filtro: ['lowpass', 1500, 2] }); }

  /* ---------- Grabaciones (audio/) ---------- */
  const ARCH = {
    teclas: 'teclas.wav', lapiz: 'lapiz.mp3', pasosTierra: 'pasos-tierra.wav', pasosPiso: 'pasos-piso.wav', reloj: 'reloj.wav',
    escuela: 'amb-escuela.mp3', pasillo: 'amb-pasillo.mp3', noche: 'amb-noche.mp3', cerro: 'amb-cerro.mp3', calle: 'amb-calle.mp3',
    feria: 'amb-feria.mp3', combi: 'amb-combi.mp3', ciber: 'amb-ciber.mp3', casa: 'amb-casa.mp3', oficina: 'amb-oficina.mp3'
  };
  /* Los «sprites»: varios golpes sueltos en un mismo archivo, cada uno en su casilla [cuántos, segundos] */
  const SPRITE = { teclas: [16, .2], pasosTierra: [10, .35], pasosPiso: [10, .35], reloj: [2, .1] };
  const bufs = {}, cargas = {};
  function cargar(nombre) {
    if (!ctx || !ARCH[nombre]) return Promise.resolve(null);
    return cargas[nombre] || (cargas[nombre] = fetch('audio/' + ARCH[nombre], { cache: 'no-cache' }) // pregunta siempre si hay una versión nueva de la grabación
      .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); })
      .then(b => new Promise((ok, mal) => ctx.decodeAudioData(b, ok, mal)))
      .then(b => (bufs[nombre] = b), () => (bufs[nombre] = null)));
  }
  /* Un golpe del sprite (k al azar si no se pide uno). Devuelve false si la grabación no está. */
  function golpe(nombre, t, vol, dest, { k = null, vel = 1, filtro = null } = {}) {
    const b = bufs[nombre]; if (!b) return false;
    const [n, casilla] = SPRITE[nombre], i = k ?? Math.floor(Math.random() * n);
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.playbackRate.value = vel; g.gain.value = vol;
    let sale = src;
    if (filtro) { const f = ctx.createBiquadFilter(); f.type = filtro[0]; f.frequency.value = filtro[1]; src.connect(f); sale = f; }
    sale.connect(g); g.connect(dest); src.start(t, i * casilla, casilla * .95);
    return true;
  }
  /* Una grabación larga en lazo: cada vuelta entra mientras la anterior se apaga (fundido de 3 s de potencia
     constante), así no se nota la costura ni el silencio que dejan los mp3 al principio y al final. */
  const ENTRA = new Float32Array(64).map((_, i) => Math.sin(i / 63 * Math.PI / 2)), SALE = ENTRA.slice().reverse();
  function lazo(buf, dest, F = 3) {
    const d = buf.duration, fuentes = new Set();
    let vivo = true;
    const vuelta = (t, desde) => {
      const largo = d - desde - .05, src = ctx.createBufferSource(), g = ctx.createGain();
      src.buffer = buf; src.connect(g); g.connect(dest);
      g.gain.setValueAtTime(0, t); g.gain.setValueCurveAtTime(ENTRA, t, F);
      g.gain.setValueCurveAtTime(SALE, t + largo - F, F);
      src.start(t, desde); src.stop(t + largo + .05);
      fuentes.add(src); src.onended = () => fuentes.delete(src);
      return t + largo - F;
    };
    let sig = vuelta(ctx.currentTime + .05, Math.random() * d * .6); // cada vez empieza en otro punto
    const seguir = () => {
      if (!vivo) return;
      if (sig < ctx.currentTime) sig = ctx.currentTime + .05; // se atrasó: entra la siguiente vuelta ya, sin amontonarlas
      while (sig < ctx.currentTime + 3) sig = vuelta(sig, .05);
    };
    latidos.add(seguir); seguir();
    return () => { vivo = false; latidos.delete(seguir); fuentes.forEach(x => { try { x.stop(ctx.currentTime + 2.6); } catch (e) { /* ya */ } }); };
  }

  /* ---------- Efectos ---------- */
  function efecto(nombre) {
    if (!ctx) return;
    const t = ctx.currentTime, d = bus.efectos;
    switch (nombre) {
      case 'clic': tono(880, t, .06, .12, d, { glide: 600 }); break;
      case 'abrir': tono(520, t, .12, .1, d, { glide: 780 }); break;
      case 'elegir': guitarra(57, t, .28, d); guitarra(64, t + .08, .18, d); break;
      /* «Esto se recordará»: un grave que crece despacio y dos campanitas a medio tono (inquietud, no alarma) */
      case 'hilo':
        tono(mtof(38), t, 3, .1, d, { ataque: .9 }); tono(mtof(45), t + .15, 2.8, .05, d, { ataque: 1 });
        campana(88, t + .45, .045, d); campana(89, t + .85, .03, d);
        ruido(t, 1.8, .018, d, { f: 500, f2: 2200, q: .7, ataque: 1.3 }); break;
      case 'notif': tono(988, t, .09, .12, d); tono(1319, t + .09, .14, .12, d); break;
      case 'vibra': [0, .14, .28].forEach(k => tono(70, t + k, .1, .2, d, { tipo: 'square', filtro: ['lowpass', 180] })); break;
      case 'envia': ruido(t, .18, .08, d, { f: 900, f2: 4000, q: 2 }); break;
      case 'tecla': ruido(t, .025, .05, d, { tipo: 'highpass', f: 3000 }); break;
      case 'tic': tono(1900, t, .05, .07, d, { tipo: 'triangle' }); break;
      case 'titulo': cajita(76, t, .12, d); cajita(83, t + .18, .1, d); cajita(88, t + .36, .09, d); break;
      case 'papel': ruido(t, .22, .07, d, { f: 2400, q: .6 }); ruido(t + .16, .2, .05, d, { f: 3000, q: .6 }); break;
      case 'mirar': campana(84, t, .03, d); campana(91, t + .18, .02, d); break;
      case 'tropiezo': ruido(t, .3, .18, d, { tipo: 'lowpass', f: 700 }); tono(90, t, .2, .15, d, { glide: 50 }); break;
      case 'resbalon': ruido(t, .35, .1, d, { f: 1200, f2: 3500, q: 4 }); break;
      case 'tejido': [0, .25, .5, .75].forEach((k, i) => guitarra([62, 66, 69, 74][i], t + k, .35, d)); break;
    }
  }
  const PISOS = { tierra: ['lowpass', 520, .14], patio: ['bandpass', 900, .09], loseta: ['bandpass', 1900, .07], plaza: ['bandpass', 1100, .08] };
  /* tierra: pasos en tierra; patio, loseta y plaza: pasos en piso duro (el pasillo un poco más agudo) */
  const PASOS = { tierra: ['pasosTierra', 1, .5], patio: ['pasosPiso', .96, .42], loseta: ['pasosPiso', 1.08, .4], plaza: ['pasosPiso', .9, .44] };
  function paso(piso) {
    if (!ctx) return;
    const [arch, vel, vol] = PASOS[piso] || PASOS.patio;
    if (golpe(arch, ctx.currentTime, vol * (.75 + Math.random() * .35), bus.efectos, { vel: vel * (.94 + Math.random() * .12) })) return;
    const [tipo, f, v] = PISOS[piso] || PISOS.patio;
    ruido(ctx.currentTime, .09, v, bus.efectos, { tipo, f: f * (.85 + Math.random() * .3), q: 1.2 });
  }

  /* ---------- Voces: murmullo con el tono de cada personaje (no son palabras) ---------- */
  const TONO_VOZ = { yare: 225, mari: 205, iker: 135, abuela: 185, lupita: 255, tono: 300, mau: 125, lucia: 195, ramiro: 105, mama: 195, rocio: 215, rosy: 235 };
  function balbuceo(base, texto, vol, dest, maxS = 2.4) {
    const t0 = ctx.currentTime + .02, sil = Math.min(Math.ceil(String(texto).length / 3), Math.round(maxS / .085));
    for (let i = 0; i < sil; i++) {
      const t = t0 + i * (.075 + Math.random() * .03), f = base * (.85 + Math.random() * .35);
      const o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.linearRampToValueAtTime(f * (Math.random() < .5 ? .9 : 1.08), t + .07);
      fl.type = 'bandpass'; fl.frequency.value = [550, 900, 1300, 750, 1700][Math.floor(Math.random() * 5)]; fl.Q.value = 2.2;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .012); g.gain.exponentialRampToValueAtTime(.0001, t + .07);
      o.connect(fl); fl.connect(g); g.connect(dest); o.start(t); o.stop(t + .09);
    }
  }
  /* Cuando alguien habla: teclazos de teclado mecánico al ritmo en que aparece el texto (cada quien con su
     timbre: las voces agudas, teclas un poco más agudas). callar() corta lo que falta si el texto se completa. */
  let teclas = [], trazo = null;
  function teclazo(t, base, vol, espacio) {
    const vel = (.88 + (base - 100) / 200 * .26) * (.96 + Math.random() * .08);
    if (golpe('teclas', t, vol * (espacio ? 1.1 : .8), bus.voces, { vel: espacio ? vel * .82 : vel })) return;
    const f = 1500 + (base - 100) * 7;
    ruido(t, espacio ? .03 : .018, vol * (espacio ? .7 : 1), bus.voces, { f: espacio ? f * .55 : f * (.9 + Math.random() * .25), q: 1.6, ataque: .001 });
    tono(espacio ? 95 : 150 + Math.random() * 40, t, .035, vol * .55, bus.voces, { tipo: 'triangle', glide: 70, ataque: .001 });
    ruido(t + .004, .008, vol * .45, bus.voces, { tipo: 'highpass', f: 6500, ataque: .001 });
  }
  function voz(quien, texto, cps = 45) {
    if (!ctx || !quien || !prefs.voces) return;
    callar();
    const letras = [...String(texto)], base = TONO_VOZ[quien] || 190;
    const dur = Math.min(letras.length / cps, 4.5);
    let t = 0;
    while (t < dur) {
      const k = Math.min(letras.length - 1, Math.floor(t * cps)), esp = letras[k] === ' ';
      const id = setTimeout(() => teclazo(ctx.currentTime, base, .3 + Math.random() * .12, esp), t * 1000);
      teclas.push(id);
      t += .055 + Math.random() * .045; // nadie teclea parejo
    }
  }
  /* Cuando se narra: un lápiz que escribe en papel (la libreta de Yare), suave y parejo mientras sale el texto */
  function narrar(texto, cps = 45) {
    if (!ctx || !prefs.voces) return;
    callar();
    const b = bufs.lapiz, dur = Math.min([...String(texto)].length / cps, 5), t = ctx.currentTime;
    if (!b) { // sin la grabación: rasguitos de ruido filtrado
      for (let k = 0; k < dur; k += .16 + Math.random() * .12) teclas.push(setTimeout(() => ruido(ctx.currentTime, .12, .03, bus.voces, { f: 2600 + Math.random() * 900, q: .8, ataque: .03 }), k * 1000));
      return;
    }
    const src = ctx.createBufferSource(), g = ctx.createGain();
    src.buffer = b; src.playbackRate.value = .95 + Math.random() * .1;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.55, t + .08);
    g.gain.setValueAtTime(.55, t + dur); g.gain.linearRampToValueAtTime(0, t + dur + .25);
    src.connect(g); g.connect(bus.voces);
    src.start(t, Math.random() * Math.max(0, b.duration - dur - 1)); src.stop(t + dur + .3);
    trazo = { src, g };
  }
  function callar() {
    teclas.forEach(clearTimeout); teclas = [];
    if (trazo && ctx) { const { src, g } = trazo, t = ctx.currentTime; g.gain.cancelScheduledValues(t); g.gain.setTargetAtTime(0, t, .04); try { src.stop(t + .3); } catch (e) { /* ya */ } }
    trazo = null;
  }
  function murmullo(texto) { if (ctx && prefs.voces) balbuceo(150 + Math.random() * 120, texto, .28, bus.voces, 2); }

  /* ---------- Ambientes ---------- */
  const AMB = { encinal: 'noche', cerro: 'noche', cima: 'noche', jardinera: 'gente', escaleras: 'pasillo', cocina: 'casa', combi: 'combi', prepa: 'gente', patio: 'gente', calle: 'calle', ciber: 'ciber', feria: 'feria', pasillo: 'pasillo', orientacion: 'oficina' };
  /* Con grabación: [archivo, volumen, pasa-bajos (lejanía)]. Las escaleras de atrás del laboratorio oyen el patio
     de lejos, detrás del muro. */
  const GRAB = {
    encinal: ['noche', 1], cerro: ['cerro', .9], cima: ['cerro', .95], jardinera: ['escuela', .85], prepa: ['escuela', .85], patio: ['escuela', .95],
    escaleras: ['escuela', .55, 900], pasillo: ['pasillo', .7], cocina: ['casa', 1], combi: ['combi', .8], calle: ['calle', 1],
    ciber: ['ciber', 1], feria: ['feria', .6], orientacion: ['oficina', .85]
  };
  function ambienteGrabado(nombre, cfg) {
    const [arch, vol, lp] = cfg, g = ctx.createGain(); g.gain.value = 0;
    let dest = g;
    if (lp) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; f.connect(g); dest = f; }
    g.connect(bus.ambiente);
    const paradas = [], timers = [];
    const azar = (ms, fn) => { const tick = () => { if (ctx.state === 'running') fn(); timers.push(setTimeout(tick, ms * (.6 + Math.random() * .9))); }; timers.push(setTimeout(tick, ms * Math.random())); };
    const v = ctx.createGain(); v.gain.value = vol; v.connect(dest);
    cargar(arch).then(b => { if (b && !g.muerto) paradas.push(lazo(b, v)); });
    /* el reloj de pared de la cocina: tic… tac… */
    if (nombre === 'cocina') { let k = 0; timers.push(setInterval(() => { if (ctx.state === 'running') golpe('reloj', ctx.currentTime, .16, g, { k: k++ % 2, vel: k % 2 ? 1 : .9 }); }, 1000)); }
    /* en el ciber, alguien teclea en otra máquina */
    /* en la feria toca la banda del kiosco, mezclada con el tianguis */
    if (nombre === 'feria') { const b = secuencia('banda', g); paradas.push(b.parar); }
    if (nombre === 'ciber') azar(1800, () => { const t = ctx.currentTime, n = 3 + Math.floor(Math.random() * 9); for (let i = 0; i < n; i++) golpe('teclas', t + i * (.09 + Math.random() * .08), .12 + Math.random() * .06, g, { filtro: ['lowpass', 2600], vel: .85 }); });
    return { g, parar: () => { g.muerto = true; timers.forEach(x => { clearInterval(x); clearTimeout(x); }); paradas.forEach(f => f()); g.gain.setTargetAtTime(0, ctx.currentTime, .5); setTimeout(() => g.disconnect(), 3000); } };
  }
  function lazoRuido(dest, tipo, f, q, vol) {
    const s = ctx.createBufferSource(); s.buffer = ruidoBuf; s.loop = true;
    const fl = ctx.createBiquadFilter(); fl.type = tipo; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.value = vol; s.connect(fl); fl.connect(g); g.connect(dest); s.start();
    return { s, g, fl };
  }
  function lfo(param, frec, prof) { const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = frec; g.gain.value = prof; o.connect(g); g.connect(param); o.start(); return o; }
  function crearAmbiente(tipo) {
    const g = ctx.createGain(); g.gain.value = 0; g.connect(bus.ambiente);
    const fuentes = [], timers = [];
    const cada = (ms, fn) => timers.push(setInterval(() => { if (ctx.state === 'running') fn(); }, ms));
    const azar = (ms, fn) => { const tick = () => { if (ctx.state === 'running') fn(); timers.push(setTimeout(tick, ms * (.6 + Math.random() * .9))); }; timers.push(setTimeout(tick, ms * Math.random())); };
    if (tipo === 'noche') {
      const v = lazoRuido(g, 'lowpass', 380, .7, .22); fuentes.push(v.s, lfo(v.g.gain, .07, .1));
      azar(900, () => { const t = ctx.currentTime; for (let i = 0; i < 3; i++) tono(4300 + Math.random() * 300, t + i * .06, .04, .025, g); });
      azar(9000, () => { const t = ctx.currentTime; ruido(t, .25, .05, g, { f: 600, q: 4 }); ruido(t + .3, .2, .04, g, { f: 650, q: 4 }); }); // un perro, lejos
    } else if (tipo === 'gente' || tipo === 'feria' || tipo === 'pasillo') {
      const v = lazoRuido(g, 'bandpass', tipo === 'pasillo' ? 420 : 650, .8, tipo === 'feria' ? .24 : .16); fuentes.push(v.s, lfo(v.g.gain, .13, .05));
      azar(tipo === 'feria' ? 260 : 420, () => balbuceo(130 + Math.random() * 160, 'xxxxxxxx', .06 + Math.random() * .05, g, .7));
      if (tipo === 'gente') azar(5000, () => { const t = ctx.currentTime; tono(3200, t, .12, .02, g, { glide: 2800 }); tono(3600, t + .14, .1, .02, g); }); // pájaros
      if (tipo === 'pasillo') azar(7000, () => ruido(ctx.currentTime, .14, .06, g, { tipo: 'lowpass', f: 300 })); // una puerta
      if (tipo === 'feria') { const b = secuencia('banda', g); fuentes.push({ stop: b.parar }); }
    } else if (tipo === 'combi') {
      const o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), og = ctx.createGain(); o.type = 'sawtooth'; o.frequency.value = 46; fl.type = 'lowpass'; fl.frequency.value = 170; og.gain.value = .14; o.connect(fl); fl.connect(og); og.connect(g); o.start(); fuentes.push(o, lfo(o.frequency, .3, 3));
      const v = lazoRuido(g, 'lowpass', 300, .7, .12); fuentes.push(v.s);
      azar(2200, () => ruido(ctx.currentTime, .08, .05, g, { f: 2500, q: 3 })); // algo que tintinea
    } else if (tipo === 'ciber') {
      const o = ctx.createOscillator(), og = ctx.createGain(); o.frequency.value = 120; og.gain.value = .025; o.connect(og); og.connect(g); o.start(); fuentes.push(o);
      const v = lazoRuido(g, 'bandpass', 2200, .5, .03); fuentes.push(v.s);
      azar(600, () => { const t = ctx.currentTime; for (let i = 0; i < 2 + Math.random() * 5; i++) ruido(t + i * .09, .02, .04, g, { tipo: 'highpass', f: 3000 }); });
    } else if (tipo === 'casa' || tipo === 'oficina') {
      const v = lazoRuido(g, 'lowpass', 250, .7, .05); fuentes.push(v.s);
      cada(1000, () => tono(2100, ctx.currentTime, .03, .025, g, { tipo: 'triangle' })); // el reloj de pared
    } else if (tipo === 'calle') {
      const v = lazoRuido(g, 'lowpass', 500, .7, .14); fuentes.push(v.s, lfo(v.g.gain, .05, .06));
      azar(12000, () => { const t = ctx.currentTime; tono(420, t, .25, .03, g, { tipo: 'square', filtro: ['lowpass', 900] }); });
    }
    return { g, parar: () => { timers.forEach(x => { clearInterval(x); clearTimeout(x); }); g.gain.setTargetAtTime(0, ctx.currentTime, .5); setTimeout(() => { fuentes.forEach(f => { try { f.stop(); } catch (e) { /* ya */ } }); g.disconnect(); }, 2500); } };
  }
  function ambiente(id) {
    const nombre = String(id).split(':')[0], cfg = GRAB[nombre];
    if (!ctx) { pedidoAmb = id; return; }
    /* la misma grabación con el mismo filtro (o el mismo sintetizado) sigue sonando sin cortar */
    const tipo = cfg ? cfg.join('|') : AMB[nombre] || null;
    if (ambActual && ambActual.tipo === tipo) return;
    if (ambActual?.a) ambActual.a.parar();
    ambActual = null;
    if (!tipo) return;
    const actual = ambActual = { tipo, a: null };
    const empezar = (grabado) => {
      if (ambActual !== actual) return; // ya se cambió de lugar mientras cargaba
      actual.a = grabado ? ambienteGrabado(nombre, cfg) : crearAmbiente(AMB[nombre]);
      actual.a.g.gain.setTargetAtTime(1, ctx.currentTime, .8);
    };
    if (cfg) cargar(cfg[0]).then(b => empezar(!!b)); else empezar(false);
  }
  function escuchar(on) {
    if (!ctx) return;
    const t = ctx.currentTime;
    bus.ambiente.gain.setTargetAtTime(prefs.efectos ? (on ? .14 : .5) : 0, t, .25);
    bus.musica.gain.setTargetAtTime(prefs.musica ? (on ? .2 : .55) : 0, t, .25);
    bus.voces.gain.setTargetAtTime(prefs.voces ? (on ? .8 : .5) : 0, t, .2);
  }

  /* ---------- Música (secuenciador sencillo) ----------
     prog: acordes (notas MIDI) por compás. capas: qué toca cada instrumento. */
  const A = { Am: [57, 60, 64], F: [53, 57, 60], C: [48, 52, 55, 60], G: [55, 59, 62], Dm: [50, 53, 57], Bb: [46, 50, 53], Gm: [55, 58, 62], A: [57, 61, 64], Em: [52, 55, 59], D: [50, 54, 57], Bm: [47, 50, 54], E: [52, 56, 59], B: [47, 51, 54] };
  const TEMAS = {
    /* Todo tranquilo y con algo de misterio (como Ori): pocas notas, mucho espacio y eco */
    portada: { bpm: 58, prog: ['Am', 'F', 'C', 'Em'], capas: ['lento', 'colchon', 'gota'] },
    diario: { bpm: 60, prog: ['F', 'C', 'Dm', 'Bb'], capas: ['cajitaBaja', 'colchon'] },
    patio: { bpm: 64, prog: ['Am', 'F', 'C', 'G'], capas: ['lento', 'colchon'] },
    pasillo: { bpm: 54, prog: ['Dm', 'Bb', 'Gm', 'A'], capas: ['colchon', 'latido', 'gota'] },
    cerro: { bpm: 50, prog: ['Em', 'C', 'G', 'D'], capas: ['colchon', 'gota', 'lento'] },
    banda: { bpm: 100, prog: ['G', 'D', 'D', 'G'], capas: ['oompa', 'trompeta', 'rasgueo'], filtro: 1500, vol: 1.5 }, // la banda de la feria (suena con el ambiente)
    tension: { bpm: 66, prog: ['Dm', 'Dm', 'Bb', 'A'], capas: ['latido', 'colchon'] },
    telar: { bpm: 84, prog: ['D', 'A', 'Bm', 'G'], capas: ['arpegio', 'colchon', 'melodia', 'bajo'] },
    hilo: { bpm: 78, prog: ['F', 'C', 'Dm', 'Bb'], capas: ['arpegio', 'cajita', 'bajo'] },
    puntada: { bpm: 70, prog: ['Am', 'F', 'C', 'E'], capas: ['arpegio', 'colchon', 'melodia'] },
    nudo: { bpm: 64, prog: ['Dm', 'Bb', 'F', 'A'], capas: ['cajitaBaja', 'colchon'] },
    bajo: { bpm: 56, prog: ['Em', 'C', 'Am', 'B'], capas: ['colchon', 'gota'] }
  };
  function musica(id) {
    if (!ctx) { pedidoMus = id; return; }
    if (musActual && musActual.id === id) return;
    if (musActual) musActual.parar();
    musActual = TEMAS[id] && id !== 'banda' ? secuencia(id, bus.musica) : null;
  }
  /* Toca un tema hacia un destino (la música, o el ambiente en el caso de la banda de la feria) */
  function secuencia(id, destino) {
    const tema = TEMAS[id];
    const g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(tema.vol || 1, ctx.currentTime, .8);
    if (tema.filtro) { const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = tema.filtro; g.connect(f); f.connect(destino); } else g.connect(destino);
    const m = { id, g, vivo: true, compas: 0, prox: ctx.currentTime + .15,
      parar: () => { m.vivo = false; latidos.delete(tocar); g.gain.setTargetAtTime(0, ctx.currentTime, .6); setTimeout(() => g.disconnect(), 3000); } };
    const negra = 60 / tema.bpm;
    let semilla = id.length * 7;
    const rnd = () => { semilla = (semilla * 9301 + 49297) % 233280; return semilla / 233280; };
    const motivo = Array.from({ length: 8 }, () => Math.floor(rnd() * 3)); // la melodía se repite: suena a tema, no a azar
    const compas = negra * 4;
    const tocar = () => {
      if (!m.vivo) return;
      /* si se atrasó, los compases que ya pasaron se saltan (si no, sonarían todos juntos) */
      if (m.prox < ctx.currentTime) { const k = Math.ceil((ctx.currentTime - m.prox) / compas); m.prox += k * compas; m.compas += k; }
      while (m.prox < ctx.currentTime + 1.5) {
        const c = A[tema.prog[m.compas % tema.prog.length]], t = m.prox, raiz = c[0];
        for (const capa of tema.capas) {
          if (capa === 'arpegio') [0, 1, 2, 1, 2, 3, 2, 1].forEach((k, i) => guitarra(c[k % c.length] + (k === 3 ? 12 : 0) + 12, t + i * negra / 2, .32, g));
          if (capa === 'rasgueo') [0, 2].forEach(b => c.forEach((n, i) => guitarra(n + 12, t + b * negra + i * .015, .16, g)));
          if (capa === 'colchon') colchon(c.map(n => n + 12), t, negra * 4, .06, g);
          if (capa === 'bajo') { bajo(raiz - 12, t, negra * 1.8, .18, g); bajo(raiz - 12 + 7, t + negra * 2, negra * 1.8, .14, g); }
          if (capa === 'pulso') [0, 1, 2, 3].forEach(b => bajo(raiz - 12, t + b * negra, negra * .4, .16, g));
          if (capa === 'lento') [0, 2, 1, 3].forEach((k, i) => guitarra(c[k % c.length] + (k === 3 ? 12 : 0) + 12, t + i * negra, .17, g));
          if (capa === 'latido') [0, .5].forEach(b => bajo(raiz - 12, t + b * negra, negra * .45, .09, g));
          if (capa === 'cajita') [0, 2, 1, 2].forEach((k, i) => cajita(c[k % c.length] + 24, t + i * negra, .07, g));
          if (capa === 'cajitaBaja') [0, 2, 1].forEach((k, i) => cajita(c[k % c.length] + 12, t + i * negra * 1.3, .08, g));
          if (capa === 'gota') { if (m.compas % 2 === 0) cajita(c[motivo[m.compas % 8] % c.length] + 24, t + negra, .06, g); ruido(t, negra * 4, .012, g, { tipo: 'highpass', f: 5000, ataque: 1 }); }
          if (capa === 'melodia' && m.compas % 4 !== 3) [0, 1.5, 2, 3].forEach((b, i) => cajita(c[motivo[(m.compas * 2 + i) % 8] % c.length] + 24, t + b * negra, .06, g));
          if (capa === 'oompa') [0, 1, 2, 3].forEach(b => b % 2 === 0 ? bajo(raiz - 12, t + b * negra, negra * .5, .22, g) : c.forEach(n => tono(mtof(n + 12), t + b * negra, negra * .3, .03, g, { tipo: 'triangle' })));
          if (capa === 'trompeta' && m.compas % 2 === 0) [0, 1, 1.5, 2, 3].forEach((b, i) => metal(c[motivo[i] % c.length] + 12 + (i === 3 ? 12 : 0), t + b * negra, negra * .45, .035, g));
        }
        m.prox += compas; m.compas++;
      }
    };
    latidos.add(tocar); tocar();
    return m;
  }
  function silencio() { musica(null); }

  return { iniciar, activo, alCambiar, callar, ajustar, prefs: () => ({ ...prefs }), efecto, paso, voz, narrar, murmullo, ambiente, musica, silencio, escuchar };
})();

/* Se prepara de una vez (la música de la portada empieza sola si el navegador lo permite) y despierta con el
   primer toque, clic o tecla en cualquier parte de la página. */
Sonido.iniciar();
['pointerdown', 'keydown', 'touchend', 'click'].forEach(ev => addEventListener(ev, () => Sonido.iniciar(), { capture: true, passive: true }));
