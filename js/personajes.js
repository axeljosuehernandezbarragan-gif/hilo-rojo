/* Hilo Rojo · personajes (SVG hecho con código).
   Estilo de suspenso, como en Ori o Little Nightmares: figuras delgadas y alargadas, cara facetada SIN rasgos
   (ni ojos ni boca: el jugador imagina el gesto por lo que dicen y cómo se mueven), la frente en sombra,
   colores apagados y un filo de luz. El único color fuerte es el hilo rojo de la muñeca de Yare.
   Están armados por articulaciones para animarlos como en la animación 2D clásica: cuerpo › tronco › pecho,
   cuello › cabeza, hombro › codo (brazos) y cadera › rodilla (piernas). Los pies quedan en (0, 0) y miran
   hacia la derecha; para mirar a la izquierda se voltea desde afuera. */
const Personajes = (() => {
  'use strict';

  /* ---------- Color ---------- */
  const hex = (h) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const aHex = (c) => '#' + c.map(v => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const mezcla = (a, b, t) => { const x = hex(a), y = hex(b); return aHex(x.map((v, i) => v + (y[i] - v) * t)); };
  const sombra = (c, t = .22) => mezcla(c, '#1A1022', t);
  const luz = (c, t = .18) => mezcla(c, '#FFF6EC', t);
  /* Apaga un color: menos saturado y más oscuro, para que nadie «brille» más que el hilo rojo */
  const apaga = (c, t = .34) => { const [r, g, b] = hex(c), gris = (r + g + b) / 3; return mezcla(aHex([r, g, b].map(v => v + (gris - v) * .35)), '#231A2E', t); };
  const azar = (semilla) => { let a = (semilla * 9301 + 49297) >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };
  const ROJO = '#E0303F';
  const PIELES = ['#E0AA80', '#C98E62', '#B87A50', '#A06640', '#8A5636'];

  /* ---------- Medidas (esqueleto) ---------- */
  const CADERA = -150, RODILLA = -78, HOMBRO = -258, CODO = -196;
  const PIE_X = 9, BRAZO_X = 25;

  /* ---------- Los personajes ----------
     amp: qué tanto se mueve al estar parado o al hablar (0.35 casi nada · 1.4 mucho). */
  const DEF = {
    yare: { esc: 1, piel: '#B87A50', pelo: ['larga', '#2A1B26'], top: ['sueter', '#A84466', { flor: true }], abajo: ['pantalon', '#3B3858'], zap: '#CFC3B4', amp: .7, hilo: true, mochila: '#5E4775' },
    iker: { esc: 1.04, piel: '#C48A5C', pelo: ['gorra_plana', '#1F1A22', '#5E8C8A'], top: ['chamarra', '#4B5F8E', { dentro: '#CFC6BA' }], abajo: ['pantalon', '#5A5866'], zap: '#2A2530', amp: 1.3 },
    abuela: { esc: .9, piel: '#A86E48', pelo: ['chongo_bajo', '#B9B0B4'], top: ['blusa', '#D9C9B4', { rebozo: '#6A3550' }], abajo: ['falda_larga', '#4A3A5C'], zap: '#2A2530', amp: .4, lentes: true, encorvada: true },
    lupita: { esc: .98, piel: '#C99069', pelo: ['cola_alta', '#3A2420'], top: ['blusa', '#E2A878', {}], abajo: ['pantalon', '#3E5C8A'], zap: '#D8CCBE', amp: 1.2, aretes: true },
    rocio: { esc: 1, piel: '#B07650', pelo: ['rizos', '#2B1A1E'], top: ['playera', '#5E8C8A', { mandil: '#2E4A4A' }], abajo: ['pantalon', '#2E2A36'], zap: '#2A2530', amp: .6 },
    tono: { esc: .76, piel: '#B87A50', pelo: ['gorra', '#1F1A22', '#C9707E'], top: ['playera', '#D8CCB8', { rayas: '#B9707E' }], abajo: ['short', '#5E5A86'], zap: '#CFC3B4', amp: 1.4 },
    mari: { esc: .95, piel: '#9C6440', pelo: ['bob', '#1E1620'], top: ['sueter', '#8C7AA8', {}], abajo: ['falda', '#3E3A58'], zap: '#2A2530', amp: .35, medias: '#3E3A58' },
    mama: { esc: 1, piel: '#B07450', pelo: ['chongo_bajo', '#2A1B22'], top: ['blusa', '#C99080', { mandil: '#D8CCBE' }], abajo: ['falda', '#5A4466'], zap: '#2A2530', amp: .8, medias: '#80583E' },
    lucia: { esc: .97, piel: '#C99069', pelo: ['chongo_alto', '#3A2A26'], top: ['cardigan', '#B98E3E', { dentro: '#D8CCBE' }], abajo: ['falda_larga', '#4A4A66'], zap: '#3A2A26', amp: .5, lentes: true },
    mau: { esc: 1.06, piel: '#C99069', pelo: ['fade', '#1A1418'], top: ['varsity', '#3A2E52', { mangas: '#CFC3B4' }], abajo: ['pantalon', '#2A2633'], zap: '#D8D8D8', amp: 1.2, audifonos: true },
    ramiro: { esc: 1.05, piel: '#A86B45', pelo: ['sombrero', '#2A1B22', '#B9A47A'], top: ['chaleco', '#D8CCBE', { chaleco: '#6B4A3A' }], abajo: ['pantalon', '#3E3A44'], zap: '#3A2A20', amp: .7, bigote: true, panza: true }
  };

  /* Gente de fondo: misma construcción, combinaciones al azar (con semilla, para que no cambien al redibujar). */
  const PELOS_G = [['corto', 0], ['corto', 0], ['larga', 1], ['bob', 1], ['cola_alta', 1], ['gorra', 0], ['rizos', 1], ['chongo_bajo', 1], ['canas', 0], ['fade', 0], ['capucha', 0]];
  const TOPS_G = ['#8C7AA8', '#5E8C8A', '#C9707E', '#B98E3E', '#4B5F8E', '#9C5A3A', '#CFC3B4', '#6B4A6A', '#7FA38A', '#94405E', '#9C8E7A'];
  const ABAJO_G = ['#3B3858', '#2E2A36', '#5A5866', '#4A3A5C', '#3E5C8A', '#6A5A4A'];
  const PELO_C = ['#1E1620', '#2A1B22', '#3A2420', '#4A2E26', '#2B1A1E'];
  function generico(semilla) {
    const r = azar(semilla);
    const elige = (l) => l[Math.floor(r() * l.length)];
    const [pelo, fem] = elige(PELOS_G);
    const top = elige(TOPS_G), estilo = pelo === 'capucha' ? 'sudadera' : elige(['playera', 'sueter', 'blusa', 'chamarra', 'playera', 'sudadera']);
    return {
      esc: .9 + r() * .16, piel: elige(PIELES), pelo: [pelo, pelo === 'canas' ? '#B9B0B4' : elige(PELO_C), elige(TOPS_G)],
      top: [estilo, top, { rayas: r() < .18 ? luz(top, .3) : null, dentro: '#CFC6BA' }],
      abajo: [fem && r() < .45 ? 'falda' : 'pantalon', elige(ABAJO_G)], zap: elige(['#2A2530', '#CFC3B4', '#3A2A20']), amp: .35 + r() * .9,
      medias: '#3E3A58', aretes: fem && r() < .3, lentes: r() < .1, encorvada: pelo === 'canas'
    };
  }

  /* ---------- Piernas: muslo (gira en la cadera) › espinilla y pie (giran en la rodilla) ---------- */
  function pierna(d, lado) {
    const x = lado === 'i' ? -PIE_X : PIE_X, [tipo, c0] = d.abajo, c = apaga(c0);
    const t = (col) => lado === 'd' ? sombra(col, .2) : col;
    const piel = apaga(d.medias || d.piel, .28);
    const telaMuslo = tipo === 'pantalon' || tipo === 'short' ? c : piel;
    const telaEspinilla = tipo === 'pantalon' ? sombra(c, .06) : piel;
    const zap = apaga(d.zap, .2);
    const muslo = `<rect x="${x - 9}" y="${CADERA - 4}" width="18" height="${RODILLA - CADERA + 8}" rx="8" fill="${t(telaMuslo)}"/>`
      + (tipo === 'short' ? `<rect x="${x - 8.5}" y="-108" width="17" height="34" rx="7" fill="${t(piel)}"/>` : '');
    const espinilla = `<rect x="${x - 7.5}" y="${RODILLA - 4}" width="15" height="${-RODILLA - 4}" rx="6.5" fill="${t(telaEspinilla)}"/>`;
    const pie = `<path d="M${x - 8} -13 L${x + 5} -13 Q${x + 19} -12 ${x + 19} -3 L${x + 19} 0 L${x - 8} 0Z" fill="${t(zap)}"/>`;
    return `<g class="pj-pierna" data-l="${lado}" style="transform-origin:${x}px ${CADERA}px">${muslo}<g class="pj-rodilla" style="transform-origin:${x}px ${RODILLA}px">${espinilla}${pie}</g></g>`;
  }

  /* ---------- Brazos: brazo (gira en el hombro) › antebrazo y mano (giran en el codo) ---------- */
  const mangaLarga = (t) => ['sueter', 'chamarra', 'cardigan', 'varsity', 'sudadera'].includes(t);
  function brazo(d, lado) {
    const x = lado === 'i' ? -BRAZO_X : BRAZO_X;
    const [tipo, c0, det = {}] = d.top;
    const manga = apaga(tipo === 'varsity' ? det.mangas : c0), piel = apaga(d.piel, .28);
    const largo = mangaLarga(tipo) || tipo === 'chaleco';
    const t = (col) => lado === 'd' ? sombra(col, .2) : col;
    const brazoArriba = `<rect x="${x - 7.5}" y="${HOMBRO - 8}" width="15" height="${CODO - HOMBRO + 12}" rx="7" fill="${t(largo || tipo === 'chaleco' ? (tipo === 'chaleco' ? apaga(c0) : manga) : piel)}"/>`
      + (!largo ? `<rect x="${x - 9}" y="${HOMBRO - 9}" width="18" height="26" rx="8" fill="${t(manga)}"/>` : '');
    const ante = `<rect x="${x - 6.8}" y="${CODO - 4}" width="13.6" height="62" rx="6" fill="${t(largo ? (tipo === 'chaleco' ? apaga(c0) : manga) : piel)}"/>`;
    const mano = `<rect x="${x - 7}" y="-141" width="14" height="19" rx="5.5" fill="${t(piel)}"/>`; // manos de bloque, como en el dibujo
    const hilo = d.hilo && lado === 'i' ? `<rect x="${x - 7.2}" y="-144" width="14.4" height="2.8" rx="1.4" fill="${ROJO}"/><path d="M${x + 6} -143 q5 6 2 13" stroke="${ROJO}" stroke-width="1.2" fill="none"/>` : '';
    /* el celular solo se ve con la pose «cel»; va girado para quedar derecho frente a la cara */
    const cel = lado === 'i' ? `<g class="pj-cel" transform="rotate(110 ${x} -130)"><rect x="${x - 4.5}" y="-140" width="9" height="16" rx="2" fill="#1A1620"/><rect x="${x - 3.3}" y="-138" width="6.6" height="12" rx="1" fill="#CFEFFF"/><circle cx="${x}" cy="-132" r="13" fill="#CFEFFF" opacity=".1"/></g>` : '';
    /* la torta (pose «come»): va en la mano de enfrente y luego se queda en la orilla, junto a la cadera */
    const torta = lado === 'i' ? `<g class="pj-comida">${TORTA(x + 3, -122)}</g>` : '';
    return `<g class="pj-brazo" data-l="${lado}" style="transform-origin:${x}px ${HOMBRO}px">${brazoArriba}<g class="pj-ante" style="transform-origin:${x}px ${CODO}px">${ante}${torta}${mano}${hilo}${cel}</g></g>`;
  }

  /* Una torta envuelta a medias en servilleta (bolillo, jamón y lechuga asomándose) */
  const TORTA = (x, y) => `<g transform="translate(${x} ${y}) rotate(-12)"><ellipse cx="0" cy="0" rx="13" ry="6.5" fill="${apaga('#D9A46A')}"/><path d="M-12 1 Q0 6 12 1" stroke="${apaga('#8FB070')}" stroke-width="2.4" fill="none"/><path d="M-11 -1 Q0 3 11 -1" stroke="${apaga('#E39A9A')}" stroke-width="1.8" fill="none"/><path d="M-14 -2 L-3 -4 L-1 8 L-12 7Z" fill="${apaga('#F2EDE4')}"/><path d="M-6 -6 q6 -3 12 0" stroke="${luz(apaga('#D9A46A'), .35)}" stroke-width="1.4" fill="none"/></g>`;

  /* ---------- Torso y ropa ---------- */
  function torso(d) {
    const [tipo, c0, det = {}] = d.top, c = apaga(c0);
    const hs = d.panza ? 29 : 26, cin = d.panza ? 25 : 19, y0 = -266, y1 = -146;
    const forma = d.panza
      ? `M${-hs + 6} ${y0} L${hs - 6} ${y0} Q${hs} ${y0} ${hs} ${y0 + 8} Q${hs + 9} -196 ${cin + 1} ${y1} L${-cin - 1} ${y1} Q${-hs - 9} -196 ${-hs} ${y0 + 8} Q${-hs} ${y0} ${-hs + 6} ${y0}Z`
      : `M${-hs + 6} ${y0} L${hs - 6} ${y0} Q${hs} ${y0} ${hs} ${y0 + 8} L${cin + 1} ${y1} L${-cin - 1} ${y1} L${-hs} ${y0 + 8} Q${-hs} ${y0} ${-hs + 6} ${y0}Z`;
    const mitad = `M0 ${y0} L${hs - 6} ${y0} Q${hs} ${y0} ${hs} ${y0 + 8} L${cin + 1} ${y1} L0 ${y1}Z`;
    let s = `<path d="${forma}" fill="${c}"/>`;
    if (['chamarra', 'cardigan', 'varsity', 'sudadera'].includes(tipo)) {
      if (tipo !== 'sudadera') s += `<path d="M-5 ${y0} L5 ${y0} L4 ${y1} L-4 ${y1}Z" fill="${apaga(det.dentro || '#CFC6BA')}"/><path d="M-6 ${y0} L-1 -228 L-6 ${y1} M6 ${y0} L1 -228 L6 ${y1}" stroke="${sombra(c, .35)}" stroke-width="1.6" fill="none"/>`;
      else s += `<path d="M-15 -196 L15 -196 L17 -170 L-17 -170Z" fill="${sombra(c, .12)}"/><path d="M-4 ${y0} l0 22 M4 ${y0} l0 22" stroke="${luz(c, .25)}" stroke-width="1.4"/>`;
      if (tipo === 'cardigan') s += [-236, -212, -188].map(y => `<circle cx="-8" cy="${y}" r="1.6" fill="${sombra(c, .4)}"/>`).join('');
      if (tipo === 'varsity') s += `<rect x="${-cin - 1}" y="${y1 - 8}" width="${(cin + 1) * 2}" height="8" fill="${apaga(det.mangas)}"/>`;
    }
    if (tipo === 'chaleco') s += `<path d="M${-hs + 6} ${y0} L-4 ${y0} L-3 ${y1} L${-cin - 1} ${y1} L${-hs} ${y0 + 8} Q${-hs} ${y0} ${-hs + 6} ${y0}Z" fill="${apaga(det.chaleco)}"/><path d="M${hs - 6} ${y0} L4 ${y0} L3 ${y1} L${cin + 1} ${y1} L${hs} ${y0 + 8} Q${hs} ${y0} ${hs - 6} ${y0}Z" fill="${sombra(apaga(det.chaleco), .12)}"/>`;
    if (tipo === 'sueter') s += `<path d="M-8 ${y0} Q0 ${y0 + 8} 8 ${y0}" stroke="${sombra(c, .3)}" stroke-width="3" fill="none"/><rect x="${-cin - 1}" y="${y1 - 7}" width="${(cin + 1) * 2}" height="7" fill="${sombra(c, .15)}"/>`;
    if (tipo === 'blusa' || tipo === 'playera') s += `<path d="M-7 ${y0} Q0 ${y0 + 7} 7 ${y0}" stroke="${sombra(c, .3)}" stroke-width="2" fill="none"/>`;
    if (det.rayas) s += [-246, -226, -206, -186].map(y => `<rect x="${-hs + 2}" y="${y}" width="${(hs - 2) * 2}" height="5" fill="${apaga(det.rayas)}" opacity=".8"/>`).join('');
    if (det.flor) s += `<g transform="translate(12 -228) scale(.48)" opacity=".9">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="3.4" ry="6" cy="-5" fill="${ROJO}" transform="rotate(${a})"/>`).join('')}<circle r="3" fill="${apaga('#F2B880')}"/></g>`;
    if (det.mandil) s += `<path d="M-16 -232 L16 -232 L20 -140 L-20 -140Z" fill="${apaga(det.mandil)}"/><path d="M-16 -232 L-21 ${y0} M16 -232 L21 ${y0}" stroke="${apaga(det.mandil)}" stroke-width="2"/>`;
    if (d.mochila) s += `<path d="M-19 ${y0 + 2} L-14 -186" stroke="${apaga(d.mochila)}" stroke-width="6" stroke-linecap="round"/>`;
    if (det.rebozo) {
      const r = apaga(det.rebozo, .25);
      s += `<path d="M${-hs - 4} ${y0 - 2} L${hs + 4} ${y0 - 2} L${hs + 2} -232 L0 -196 L${-hs - 2} -232Z" fill="${r}"/>`
        + [-258, -248].map((y, i) => `<path d="M${-hs - 2 + i * 4} ${y} L${hs + 2 - i * 4} ${y}" stroke="${apaga(ROJO, .45)}" stroke-width="1.4"/>`).join('')
        + Array.from({ length: 7 }, (_, i) => `<path d="M${-18 + i * 6} ${-214 + Math.abs(i - 3) * -6} l0 7" stroke="${r}" stroke-width="1.4"/>`).join('');
    }
    /* sombra del lado derecho y un filo de luz del izquierdo (como si la luz viniera de atrás) */
    s += `<path d="${mitad}" fill="#140C1C" opacity=".2"/><path d="M${-hs} ${y0 + 8} L${-cin - 1} ${y1}" stroke="${luz(c, .55)}" stroke-width="1.6" opacity=".35"/>`;
    return s;
  }

  function faldaDe(d) {
    const [tipo, c0] = d.abajo, c = apaga(c0);
    if (tipo === 'falda') return `<g class="pj-falda"><path d="M-21 -156 L21 -156 L30 -94 L-30 -94Z" fill="${c}"/><path d="M0 -156 L21 -156 L30 -94 L0 -94Z" fill="#140C1C" opacity=".18"/></g>`;
    if (tipo === 'falda_larga') return `<g class="pj-falda"><path d="M-21 -156 L21 -156 L33 -18 L-33 -18Z" fill="${c}"/><path d="M0 -156 L21 -156 L33 -18 L0 -18Z" fill="#140C1C" opacity=".18"/></g>`;
    return '';
  }
  /* Sentada, la falda no cuelga de la cadera: se acomoda sobre los muslos (si no, parece que el cuerpo está partido) */
  function faldaSentada(d) {
    const [tipo, c0] = d.abajo, c = apaga(c0);
    if (tipo !== 'falda' && tipo !== 'falda_larga') return '';
    const caida = tipo === 'falda_larga' ? `<path d="M64 -150 L88 -150 Q94 -100 90 -60 L66 -62 Q68 -100 64 -150Z" fill="${sombra(c, .1)}"/>` : `<path d="M70 -152 L90 -150 Q94 -138 90 -126 L72 -128Z" fill="${sombra(c, .1)}"/>`;
    return `<g class="pj-falda-sentada">${caida}<path d="M-26 -166 Q-2 -172 22 -166 L84 -160 Q94 -156 92 -146 Q90 -136 82 -134 L-24 -128 Q-31 -146 -26 -166Z" fill="${c}"/><path d="M-24 -138 L84 -142 Q90 -138 82 -134 L-24 -128Z" fill="#140C1C" opacity=".2"/></g>`;
  }

  /* ---------- Cabeza: facetada, sin rasgos ---------- */
  const CARA = 'M0 -338 L17 -329 L21 -306 L13 -284 L0 -277 L-13 -284 L-21 -306 L-17 -329Z';
  const CARA_SOMBRA = 'M0 -338 L17 -329 L21 -306 L13 -284 L0 -277 L3 -305Z';
  const MANDIBULA = 'M-13 -284 L0 -277 L13 -284 L0 -289Z';
  /* La mitad de arriba de la cara queda en la sombra del pelo (donde irían los ojos); la de abajo, apenas */
  const FRENTE = 'M0 -338 L17 -329 L21 -306 L0 -299 L-21 -306 L-17 -329Z', MEJILLAS = 'M-21 -306 L0 -299 L21 -306 L13 -290 L0 -287 L-13 -290Z';
  function peloAtras(d) {
    const [e, c0] = d.pelo, c = apaga(c0, .2);
    switch (e) {
      case 'larga': return `<path d="M-23 -320 Q-26 -350 0 -351 Q26 -350 24 -320 L27 -282 Q30 -246 23 -224 L-23 -224 Q-30 -246 -27 -282Z" fill="${c}"/>`;
      case 'cola_alta': return `<path d="M-10 -346 Q-42 -356 -40 -318 Q-40 -288 -32 -262 Q-27 -292 -25 -316 Q-22 -334 -6 -338Z" fill="${c}"/>`;
      case 'bob': return `<path d="M-26 -302 Q-28 -352 0 -352 Q28 -352 26 -302 L26 -274 L-26 -274Z" fill="${c}"/>`;
      case 'chongo_bajo': return `<circle cx="-21" cy="-294" r="10" fill="${c}"/>`;
      case 'chongo_alto': return `<circle cx="0" cy="-350" r="10" fill="${c}"/>`;
      case 'rizos': return Array.from({ length: 11 }, (_, i) => { const a = Math.PI * (1.02 + i / 10 * .96); return `<circle cx="${(Math.cos(a) * 25).toFixed(1)}" cy="${(-308 + Math.sin(a) * 32).toFixed(1)}" r="10" fill="${c}"/>`; }).join('') + `<circle cx="-25" cy="-286" r="9" fill="${c}"/><circle cx="25" cy="-288" r="8" fill="${c}"/>`;
      case 'capucha': { const s = apaga(d.top[1]); return `<path d="M-27 -296 Q-30 -356 0 -356 Q30 -356 27 -296 L24 -262 L-24 -262Z" fill="${sombra(s, .1)}"/>`; }
      default: return '';
    }
  }
  function peloFrente(d) {
    const [e, c0, c20] = d.pelo, c = apaga(c0, .2), c2 = c20 ? apaga(c20) : c;
    switch (e) {
      /* pelo suelto que enmarca la cara (como el dibujo del equipo): fleco de lado y un mechón al frente */
      case 'larga': return `<path d="M-23 -306 Q-24 -346 0 -346 Q23 -345 22 -318 Q12 -331 -3 -327 Q-15 -321 -21 -296Z" fill="${c}"/><path d="M-22 -312 Q-27 -276 -22 -240 L-17 -242 Q-20 -278 -16 -304Z" fill="${c}"/>`;
      case 'cola_alta': return `<path d="M-22 -306 Q-22 -345 0 -345 Q22 -345 22 -306 Q14 -330 0 -330 Q-14 -330 -22 -306Z" fill="${c}"/>`;
      case 'bob': return `<path d="M-24 -308 Q-24 -347 0 -347 Q24 -347 24 -308 L24 -312 L-24 -312Z" fill="${c}"/><path d="M-24 -312 L-24 -280 L-17 -282 L-17 -312Z M24 -312 L24 -280 L17 -282 L17 -312Z" fill="${c}"/>`;
      case 'corto': return `<path d="M-22 -310 Q-23 -345 0 -345 Q23 -345 22 -312 Q14 -330 2 -330 Q-12 -330 -22 -304Z" fill="${c}"/>`;
      /* canas: un casquete completo (antes se veía calvo de arriba y con mechones sueltos) */
      case 'canas': return `<path d="M-22 -308 Q-22 -343 0 -343 Q22 -343 22 -308 Q17 -323 0 -327 Q-17 -323 -22 -308Z" fill="${c}"/>`;
      case 'gorra': return `<path d="M-22 -316 Q-22 -351 0 -351 Q22 -351 22 -316Z" fill="${c2}"/><path d="M14 -321 L40 -319 Q44 -317 40 -314 L14 -315Z" fill="${sombra(c2, .2)}"/>`;
      /* gorra de visera plana, hacia el frente (antes iba al revés y parecía que la cabeza miraba para atrás) */
      case 'gorra_plana': return `<path d="M-22 -312 Q-23 -352 0 -353 Q23 -352 22 -316 L22 -312Z" fill="${c2}"/><path d="M12 -318 L46 -318 L46 -312 L12 -312Z" fill="${sombra(c2, .25)}"/><rect x="-22" y="-318" width="44" height="5" fill="${sombra(c2, .15)}"/><path d="M-22 -312 Q-25 -300 -21 -290 L-17 -300 Q-18 -306 -16 -312Z" fill="${c}"/>`;
      case 'fade': return `<path d="M-21 -316 Q-21 -343 -11 -345 L11 -345 Q21 -343 21 -316 Q10 -328 0 -328 Q-10 -328 -21 -316Z" fill="${c}"/>`;
      case 'chongo_bajo': case 'chongo_alto': return `<path d="M-22 -304 Q-22 -345 0 -345 Q22 -345 22 -304 Q14 -328 0 -330 Q-14 -328 -22 -304Z" fill="${c}"/>`;
      case 'rizos': return Array.from({ length: 6 }, (_, i) => `<circle cx="${-19 + i * 7.6}" cy="${(-334 - Math.sin(i / 5 * Math.PI) * 8).toFixed(1)}" r="8" fill="${c}"/>`).join('');
      case 'sombrero': return `<path d="M-17 -330 Q-16 -364 0 -364 Q16 -364 17 -330Z" fill="${c2}"/><rect x="-17" y="-336" width="34" height="5" fill="${sombra(c2, .45)}"/><ellipse cx="0" cy="-330" rx="42" ry="6" fill="${luz(c2, .05)}"/><path d="M-21 -326 L21 -326 L21 -306 L-21 -306Z" fill="#140C1C" opacity=".28"/>`;
      case 'capucha': { const s = apaga(d.top[1]); return `<path d="M-27 -296 Q-30 -356 0 -356 Q30 -356 27 -296 L22 -294 Q24 -340 0 -342 Q-24 -340 -22 -294Z" fill="${s}"/>`; }
      default: return '';
    }
  }

  function cabeza(d) {
    const piel = apaga(d.piel, .26);
    const lentes = d.lentes ? `<rect x="-17" y="-312" width="13" height="8" rx="3" fill="#E9E0F0" opacity=".32"/><rect x="4" y="-312" width="13" height="8" rx="3" fill="#E9E0F0" opacity=".22"/><path d="M-4 -308 L4 -308" stroke="#E9E0F0" stroke-width="1" opacity=".3"/>` : '';
    const aretes = d.aretes ? `<circle cx="-21" cy="-286" r="2.4" fill="none" stroke="${apaga('#F6C177')}" stroke-width="1.4"/>` : '';
    const audif = d.audifonos ? `<path d="M-18 -268 Q0 -254 18 -268" stroke="#141016" stroke-width="4" fill="none"/><circle cx="-19" cy="-269" r="5" fill="${apaga(ROJO, .4)}"/><circle cx="19" cy="-269" r="5" fill="${apaga(ROJO, .5)}"/>` : '';
    const bigote = d.bigote ? `<path d="M-8 -290 Q1 -296 10 -290 Q6 -287 1 -289 Q-3 -287 -8 -290Z" fill="${apaga(d.pelo[1], .1)}" opacity=".9"/>` : '';
    return `<g class="pj-cabeza">
      <rect x="-6.5" y="-282" width="13" height="20" fill="${sombra(piel, .22)}"/>
      <path d="${CARA}" fill="${piel}"/><path d="${CARA_SOMBRA}" fill="#140C1C" opacity=".2"/><path d="${MANDIBULA}" fill="#140C1C" opacity=".1"/>
      <path d="${FRENTE}" fill="#140C1C" opacity=".3"/><path d="${MEJILLAS}" fill="#140C1C" opacity=".1"/>
      <path d="M-21 -306 L-17 -329 L0 -338" stroke="${luz(piel, .5)}" stroke-width="1.4" fill="none" opacity=".35"/>
      ${bigote}${lentes}
      ${peloFrente(d)}${aretes}${audif}
    </g>`;
  }

  /* ---------- Armar el personaje ---------- */
  const cacheGen = {};
  function definicion(id, semilla) {
    if (DEF[id]) return DEF[id];
    const k = Math.round(semilla || 1);
    return cacheGen[k] || (cacheGen[k] = generico(k));
  }
  function dibujar(id, op = {}) {
    const gen = !DEF[id];
    const d = definicion(id, op.semilla);
    const e = d.esc * (op.escala || 1);
    const r = azar(Math.round((op.semilla || 7) * 13 + id.length * 31));
    const estilo = `--amp:${(d.amp).toFixed(2)};--d:${(5.5 + r() * 4).toFixed(1)}s;--r:${(-r() * 8).toFixed(1)}s`;
    return `<g class="pj ${op.pose ? 'pose-' + op.pose : ''} ${op.cel ? 'pose-cel' : ''} ${op.come ? 'pose-come' : ''} ${d.encorvada ? 'encorvada' : ''}" data-pj="${gen ? 'gente' : id}" data-semilla="${Math.round(op.semilla || 1)}" data-animo="${op.exp || 'neutral'}" style="${estilo}">
      <ellipse cx="2" cy="1" rx="${30 * e}" ry="${5 * e}" fill="#140C1C" opacity=".3"/>
      <g transform="scale(${e.toFixed(3)})">
        <g class="pj-cuerpo">
          ${op.come ? `<g class="pj-comida-dejada">${TORTA(-86, -161)}</g>` : ''}${pierna(d, 'd')}${pierna(d, 'i')}${faldaSentada(d)}
          <g class="pj-tronco"><g class="pj-pecho">
            ${brazo(d, 'd')}
            <g class="pj-nuca"><g class="pj-cabeza">${peloAtras(d)}</g></g>
            ${faldaDe(d)}${torso(d)}
            <g class="pj-nuca">${cabeza(d)}</g>
            ${brazo(d, 'i')}
          </g></g>
        </g>
      </g>
    </g>`;
  }

  /* Sin caras: el «gesto» se nota en la postura (cabeza baja, hombros tensos, el pecho que se infla…).
     actor = el <g> que contiene al personaje. */
  function expresion(actor, exp) {
    const pj = actor && actor.querySelector('.pj');
    if (pj) pj.dataset.animo = exp || 'neutral';
  }

  /* Una postura aproximada según lo que dice (para que el que habla no esté siempre igual). */
  function caraDe(texto) {
    const t = String(texto || '');
    if (/jaj|😂|🤣|JAJA/i.test(t)) return 'risa';
    if (/[¡!]{1}.*[A-ZÁÉÍÓÚ]{4,}|¿¡|!!|😡|QUÉ TE PASA/.test(t)) return 'enojo';
    if (/😭|perdón|lo siento|ay no|no sé qué/i.test(t)) return 'triste';
    if (/gracias|qué bonito|😊|🙏|eres la mejor|💕/i.test(t)) return 'feliz';
    if (/^¿|\?$|¿neta|¿qué/i.test(t.trim())) return 'preocupa';
    if (/^…|^\.\.\./.test(t.trim())) return 'triste';
    return 'neutral';
  }

  /* Retrato quieto (cabeza y hombros) para fotos, stickers y avatares de los chats: el personaje de verdad,
     no una silueta genérica. Devuelve el <g> para meterlo en otro SVG (x, y = dónde queda la barbilla). */
  function retratoG(id, { x = 0, y = 0, escala = 1, inclina = 0, exp = 'neutral', cel = false } = {}) {
    const d = definicion(id, 1), e = escala / d.esc; // que todos queden del mismo tamaño en la foto
    return `<g class="quieto" transform="translate(${x} ${y}) rotate(${inclina}) scale(${e.toFixed(3)}) translate(0 ${(280 * d.esc).toFixed(1)})">${dibujar(id, { exp, cel })}</g>`;
  }
  function retrato(id, { fondo = '#D9CCE0', exp = 'neutral', clase = 'retrato' } = {}) {
    return `<svg class="${clase}" viewBox="-60 -66 120 120" aria-hidden="true"><rect x="-60" y="-66" width="120" height="120" fill="${fondo}"/>${retratoG(id, { exp, escala: 1.1, y: 14 })}</svg>`;
  }

  return { dibujar, expresion, caraDe, retrato, retratoG, DEF, mezcla, sombra, luz, apaga };
})();
