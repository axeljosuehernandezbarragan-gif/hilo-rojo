/* Hilo Rojo · secuencias para caminar a voluntad (de lado, con paralaje). No hay saltos ni se pueden omitir.
   Controles: ← → / A D para caminar, Q o Shift (o el botón de la oreja) para prestar atención, E / Enter para interactuar.
   Prestar atención acerca la cámara al grupo más cercano, baja el ruido de alrededor y deja leer lo que murmuran.
   La vibra es la de Ori: tranquila y con misterio. Hay rayos de luz, polvo que flota y cosas en primer plano
   (siluetas de gente, ramas, rocas) que pasan entre la cámara y Yare. La gente del fondo está parada sobre el
   piso según su distancia. En el entorno hay cositas para mirar (un brillo) y tramos donde Yare puede resbalar. */
const Caminar = (() => {
  'use strict';
  const W = 1600, H = 900;
  /* En las caminatas la gente se ve más chica que en las pláticas: el mundo es grande (como en Ori) y así
     las puertas, las bancas y los puestos quedan a la medida de las personas. */
  const ESC = .76;
  const ZBASE = 198 * ESC / .85; // lo que avanza un ciclo de paso completo por cada unidad de --z (ver pjMuslo en el CSS)
  const Z = 1;                   // largo del paso de Yare (y de quien la acompaña)
  const ZANCADA = ZBASE * Z;
  const VEL = 225;               // un paso tranquilo
  const ALTO = 350 * ESC;        // estatura (para poner los textos y avisos encima de la gente)
  let s, el, listo, n, mundo, j, cam, raf, ult, teclas, ui, activo, pausa, comp, oyendo, avisos;
  let quieta = 0; // mientras se escribe lo que se dijo al interactuar, Yare no se mueve (guarda el turno de ese texto)

  const azar = (semilla) => { let a = (semilla * 9301 + 49297) >>> 0; return () => { a = (a * 1664525 + 1013904223) >>> 0; return a / 4294967296; }; };

  /* ---------- Gente de fondo ----------
     tramos: [[x0, x1, cuántos], …]. Fila 0 = más atrás (sobre el piso, entre la pared y Yare: más chica y oscura);
     fila 1 = en el mismo plano que Yare. */
  function multitud(semilla, tramos) {
    const r = azar(semilla), lista = [];
    tramos.forEach(([a, b, k]) => { for (let i = 0; i < k; i++) {
      const fila = r() < .6 ? 0 : 1;
      lista.push({ x: a + r() * (b - a), fila, prof: r(), semilla: Math.round(semilla * 31 + i * 17 + a), voltea: r() < .5, cel: r() < .18,
        camina: r() < .2 ? { a, b, v: 70 + r() * 30, dir: r() < .5 ? 1 : -1 } : null });
    } });
    return lista;
  }

  /* ---------- Ambiente común: rayos de luz, bruma ---------- */
  const DEFS = `<linearGradient id="cw-rayo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF4E0" stop-opacity=".55"/><stop offset="1" stop-color="#FFF4E0" stop-opacity="0"/></linearGradient>
    <linearGradient id="cw-bruma" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E4EE" stop-opacity="0"/><stop offset=".6" stop-color="#F6E4EE" stop-opacity=".28"/><stop offset="1" stop-color="#F6E4EE" stop-opacity="0"/></linearGradient>`;
  function rayos(semilla, largo, n, inclina = 160, y1 = H) {
    const r = azar(semilla);
    return `<g class="cw-rayos">${Array.from({ length: n }, (_, i) => { const x = (i + .3 + r() * .5) * largo / n, w = 60 + r() * 120;
      return `<path d="M${x.toFixed(0)} -40 L${(x + w).toFixed(0)} -40 L${(x + w + inclina).toFixed(0)} ${y1} L${(x + inclina * .7).toFixed(0)} ${y1}Z" fill="url(#cw-rayo)" opacity="${(.25 + r() * .35).toFixed(2)}" style="--r:${(-r() * 9).toFixed(1)}s"/>`; }).join('')}</g>`;
  }
  const bruma = (y, alto, largo) => `<rect x="-200" y="${y}" width="${largo}" height="${alto}" fill="url(#cw-bruma)"/>`;

  /* ---------- Primer plano (como en Ori): cosas oscuras y desenfocadas entre la cámara y Yare ---------- */
  const PIEZAS = {
    persona: (x, r) => `<g transform="translate(${x.toFixed(0)} ${(H + 110 + r() * 170).toFixed(0)}) scale(${(r() < .5 ? -1 : 1) * (1.75 + r() * .35)} ${(1.75 + r() * .35).toFixed(2)})">${Personajes.dibujar('gente', { semilla: Math.round(x) })}</g>`,
    rama: (x, r) => { const l = 300 + r() * 260; return `<path d="M${x} -30 C${x + l * .3} ${60 + r() * 60} ${x + l * .6} ${40 + r() * 80} ${x + l} ${120 + r() * 80}" stroke="#000" stroke-width="${14 + r() * 8}" fill="none" stroke-linecap="round"/>` + Array.from({ length: 7 }, (_, i) => `<ellipse cx="${(x + l * (.2 + i * .12)).toFixed(0)}" cy="${(70 + r() * 110).toFixed(0)}" rx="${(40 + r() * 40).toFixed(0)}" ry="${(24 + r() * 22).toFixed(0)}"/>`).join(''); },
    arbusto: (x, r) => Array.from({ length: 5 }, (_, i) => `<ellipse cx="${(x + i * 55 + r() * 30).toFixed(0)}" cy="${(H - 10 + r() * 30).toFixed(0)}" rx="${(70 + r() * 40).toFixed(0)}" ry="${(60 + r() * 50).toFixed(0)}"/>`).join(''),
    columna: (x, r) => `<rect x="${x}" y="-20" width="${(70 + r() * 30).toFixed(0)}" height="${H + 40}"/><rect x="${x - 14}" y="-20" width="${(98 + r() * 30).toFixed(0)}" height="40"/>`,
    roca: (x, r) => { const w = 180 + r() * 160, h = 120 + r() * 140; return `<path d="M${x} ${H + 20} L${(x + w * .12).toFixed(0)} ${(H - h * .7).toFixed(0)} L${(x + w * .45).toFixed(0)} ${(H - h).toFixed(0)} L${(x + w * .8).toFixed(0)} ${(H - h * .8).toFixed(0)} L${(x + w).toFixed(0)} ${H + 20}Z"/>`; },
    encino: (x, r) => { const g = 34 + r() * 20; return `<path d="M${x} ${H + 20} L${x + 10} 300 Q${x - 60} 160 ${x - 180} 90 M${x + 10} 330 Q${x + 80} 200 ${x + 220} 140" stroke="#000" stroke-width="${g.toFixed(0)}" fill="none" stroke-linecap="round"/><rect x="${x - g / 2 + 5}" y="300" width="${g.toFixed(0)}" height="${H}"/>`
      + Array.from({ length: 9 }, (_, i) => `<ellipse cx="${(x - 240 + i * 60 + r() * 30).toFixed(0)}" cy="${(40 + r() * 90).toFixed(0)}" rx="${(70 + r() * 50).toFixed(0)}" ry="${(46 + r() * 30).toFixed(0)}"/>`).join(''); },
    zacate: (x, r) => Array.from({ length: 16 }, (_, i) => { const bx = x + i * 14 + r() * 8, h = 70 + r() * 120, c = (r() - .5) * 60; return `<path d="M${bx.toFixed(0)} ${H + 10} Q${(bx + c * .4).toFixed(0)} ${(H - h * .6).toFixed(0)} ${(bx + c).toFixed(0)} ${(H - h).toFixed(0)} Q${(bx + c * .3 + 6).toFixed(0)} ${(H - h * .5).toFixed(0)} ${(bx + 9).toFixed(0)} ${H + 10}Z"/>`; }).join(''),
    picado: (x) => `<path d="M${x} 40 Q${x + 260} 110 ${x + 520} 40" stroke="#000" stroke-width="3" fill="none"/>` + Array.from({ length: 8 }, (_, i) => { const px = x + 30 + i * 60, t = (px - x) / 520, py = 40 + 280 * t * (1 - t) * .5; return `<path d="M${px.toFixed(0)} ${py.toFixed(0)} h44 v48 l-11 -8 l-11 8 l-11 -8 l-11 8z"/>`; }).join(''),
    poste: (x) => `<rect x="${x}" y="-20" width="16" height="${H + 40}"/><path d="M${x + 8} 120 h70 v14 h-70z"/>`
  };
  /* hasta dónde llega cada pieza a los lados de su x (para saber qué tapa) */
  const ANCHO_PIEZA = { persona: [-120, 120], rama: [0, 560], arbusto: [-70, 370], columna: [-14, 130], roca: [0, 340], encino: [-310, 320], zacate: [0, 240], picado: [0, 520], poste: [0, 80] };
  /* lo que tiene hojas o cuelga se mece con el aire (desde abajo; las ramas y el papel picado, desde arriba) */
  const MECE = { rama: 'arriba', picado: 'arriba', arbusto: 'abajo', encino: 'abajo', zacate: 'abajo' };
  function frente(semilla, largo, tipos) {
    const r = azar(semilla), piezas = [];
    for (let x = 220 + r() * 260, i = 0; x < largo; x += 470 + r() * 560, i++) {
      const tipo = tipos[i % tipos.length], [a, b] = ANCHO_PIEZA[tipo];
      const dib = PIEZAS[tipo](x, r);
      piezas.push(`<g data-x0="${(x + a).toFixed(0)}" data-x1="${(x + b).toFixed(0)}">${MECE[tipo] ? `<g class="cw-mece ${MECE[tipo]}" style="--r:${(-r() * 6).toFixed(1)}s;--d:${(5 + r() * 3).toFixed(1)}s">${dib}</g>` : dib}</g>`);
    }
    return `<g class="cw-frente">${piezas.join('')}</g>`;
  }
  /* El primer plano se mueve 1.45 veces lo que la cámara: cuando Yare está en x, lo que queda frente a ella en esa
     capa está en 1.45·x − 0.45·W/2. Se quitan las piezas que taparían algo importante (un tropiezo, el perro,
     alguien que habla, algo para mirar) justo cuando Yare llega ahí. */
  function despejarFrente(raiz, importantes) {
    raiz.querySelectorAll('.cw-frente > g[data-x0]').forEach(g => {
      const x0 = +g.dataset.x0, x1 = +g.dataset.x1;
      if (importantes.some(x => { const c = 1.45 * x - .45 * W / 2; return x1 > c - 230 && x0 < c + 230; })) g.remove();
    });
  }

  /* ---------- Polvo en la luz y luciérnagas ----------
     Viven dentro del mundo (con su profundidad, no pegadas a la pantalla). Cada una sube o flota en una sola
     dirección mientras aparece y se desvanece, y vuelve a empezar ya invisible: nada va y viene en zigzag. */
  function motas(semilla, largo, luz) {
    const r = azar(semilla), n = Math.round(largo / (luz ? 170 : 210));
    return `<g class="cw-motas ${luz ? 'luz' : ''}">${Array.from({ length: n }, () => { const d = luz ? 7 + r() * 6 : 14 + r() * 10;
      return `<circle class="cw-mota" cx="${(r() * largo).toFixed(0)}" cy="${(luz ? 420 + r() * 380 : 160 + r() * 520).toFixed(0)}" r="${luz ? 8 : (4 + r() * 3).toFixed(1)}" fill="url(#${luz ? 'cw-luci' : 'cw-polvo'})"
        style="--d:${d.toFixed(1)}s;--r:${(-r() * d).toFixed(1)}s;--dx:${((r() - .5) * (luz ? 140 : 70)).toFixed(0)}px;--dy:${(luz ? (r() - .5) * 50 : -50 - r() * 60).toFixed(0)}px"/>`; }).join('')}</g>`;
  }

  /* ---------- Lo que pasa rápido frente a la cámara ----------
     De vez en cuando alguien cruza enfrente (en el cerro, un murciélago). Solo cuando Yare no está cerca de algo
     importante ni se está diciendo nada, para que no tape lo que importa. */
  const MURCIELAGO = `<g class="cw-alas"><path d="M0 0 C-14 -10 -30 -14 -46 -6 C-38 -2 -34 4 -30 10 C-22 4 -12 4 0 8 C12 4 22 4 30 10 C34 4 38 -2 46 -6 C30 -14 14 -10 0 0Z"/></g><ellipse cx="0" cy="4" rx="7" ry="9"/>`;
  function pasar() {
    const dir = Math.random() < .5 ? 1 : -1, ave = mundo.pasan === 'ave';
    const esc = ave ? 1.7 + Math.random() * .6 : 1.8 + Math.random() * .3;
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.innerHTML = ave ? MURCIELAGO : Personajes.dibujar('gente', { semilla: Math.floor(Math.random() * 9999), cel: Math.random() < .2 });
    if (!ave) { g.classList.add('actor'); g.style.setProperty('--z', 1.1); g.style.setProperty('--paso', '.62s'); g.querySelector('.pj')?.classList.add('camina'); }
    ui.pasan.appendChild(g);
    const f = cam.x * 1.45; // la capa de enfrente se mueve 1.45 veces lo que la cámara
    ui.pasantes.push({ g, dir, esc, ave, x: f + (dir > 0 ? -340 : W + 340), y: ave ? 140 + Math.random() * 260 : H + 120 + Math.random() * 110, v: (ave ? 1150 : 760 + Math.random() * 220) * dir, t: 0 });
  }
  function moverPasantes(dt) {
    ui.pasaT -= dt;
    const algoCerca = ui.puntos.some(p => ((p.pt.interaccion && !p.hecho) || (p.pt.mira && !p.visto) || p.pt.ambiente) && Math.abs(j.x - p.pt.x) < 430)
      || (mundo.resbalones || []).some(z => Math.abs(j.x - (z.x1 + z.x2) / 2) < 430);
    if (ui.pasaT <= 0) {
      ui.pasaT = 4 + Math.random() * 6;
      if (mundo.pasan && !pausa && !quieta && !oyendo && !algoCerca && !ui.puntos.some(p => p.mostrandoDice) && !reducido()) pasar();
    }
    ui.pasantes = ui.pasantes.filter(q => {
      q.x += q.v * dt; q.t += dt;
      const sx = q.x - cam.x * 1.45, y = q.y + (q.ave ? Math.sin(q.t * 5) * 18 : 0);
      q.g.setAttribute('transform', `translate(${sx.toFixed(1)} ${y.toFixed(1)}) scale(${(q.dir * q.esc).toFixed(2)} ${q.esc.toFixed(2)})`);
      const fuera = q.dir > 0 ? sx > W + 400 : sx < -400;
      if (fuera) q.g.remove();
      return !fuera;
    });
  }

  /* ---------- Cositas para mirar ----------
     A la medida de la gente (estatura ≈ ALTO): la rodilla queda a ~60, la cadera a ~115 y los ojos a ~230.
     Las de la pared (tablero, periódico mural, casillero) se dibujan pegadas al muro, DETRÁS de la gente que pasa;
     las demás, en el mismo plano que Yare. alto = a qué altura está lo que se mira (para la pose y el brillo). */
  const OBJETOS = {
    /* el tablero de avisos se para en dos postes de madera clavados en una base de concreto (no flota) */
    tablero: { pared: true, dib: (x, y) => `<g transform="translate(${x} ${y})">${[-74, 74].map(dx => `<rect x="${dx - 9}" y="-340" width="18" height="334" fill="#6A4C3A"/><rect x="${dx - 9}" y="-340" width="6" height="334" fill="#8A6A52" opacity=".55"/><rect x="${dx - 18}" y="-14" width="36" height="16" rx="3" fill="#8E86A0"/><path d="M${dx - 22} 2 q4 -16 8 -2 q3 -14 7 0 q4 -18 8 -1 q3 -12 6 1" fill="#5E7A5E"/>`).join('')}
      <path d="M-122 -342 L0 -372 L122 -342 L116 -334 L0 -362 L-116 -334Z" fill="#5A3E30"/><rect x="-118" y="-338" width="236" height="8" fill="#4A3226"/></g><g transform="translate(${x} ${y - 200})"><rect x="-104" y="-128" width="208" height="132" rx="4" fill="#7C5C46"/><rect x="-96" y="-120" width="192" height="116" fill="#A8805E"/>
      <rect x="-86" y="-112" width="52" height="68" fill="#EFE3D3" transform="rotate(-4 -60 -78)"/><rect x="-22" y="-110" width="48" height="40" fill="#F2E07E"/><rect x="36" y="-114" width="50" height="78" fill="#E6D8C4" transform="rotate(5 61 -75)"/><rect x="-20" y="-60" width="44" height="40" fill="#C9A6E8"/>
      <path d="M-80 -96 h36 M-80 -88 h28 M-80 -80 h32 M44 -100 h32 M44 -92 h26" stroke="#8C7A6A" stroke-width="2"/>
      <circle cx="-60" cy="-110" r="3.5" fill="#E0303F"/><circle cx="2" cy="-108" r="3.5" fill="#5E8C8A"/><circle cx="61" cy="-112" r="3.5" fill="#E0303F"/></g>` },
    bebedero: { ancho: 62, dib: (x, y) => `<g transform="translate(${x} ${y})"><rect x="-24" y="-112" width="48" height="112" rx="5" fill="#8E86A0"/><rect x="-40" y="-132" width="80" height="24" rx="9" fill="#A9A2B8"/><rect x="-5" y="-142" width="10" height="12" rx="2" fill="#6E6680"/>
      <rect x="-18" y="-96" width="36" height="28" fill="#F4EEE4" transform="rotate(-6)"/><path d="M-11 -86 h22 M-11 -79 h14" stroke="#5A4A66" stroke-width="2"/></g>` },
    mural: { pared: true, dib: (x, y) => `<g transform="translate(${x} ${y - 150})"><rect x="-140" y="-170" width="280" height="170" rx="4" fill="#C98A9A"/><rect x="-128" y="-158" width="80" height="88" fill="#F4E6D8"/><circle cx="-88" cy="-124" r="19" fill="#B9A49A"/><path d="M-100 -114 q12 8 24 0" stroke="#2A1B26" stroke-width="3" fill="none"/>
      <rect x="-36" y="-154" width="156" height="42" fill="#F2E07E"/><text x="42" y="-127" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="15" fill="#3A2A12">CONVIVENCIA</text>
      <rect x="-36" y="-102" width="74" height="82" fill="#F4E6D8"/><path d="M38 -20 l-18 -14 l-8 12 l-12 -16 l-10 18" fill="#C98A9A"/><rect x="52" y="-102" width="66" height="50" fill="#E6D8C4"/></g>` },
    casillero: { pared: true, dib: (x, y) => `<g transform="translate(${x} ${y + 40})"><rect x="-21" y="-290" width="42" height="250" fill="#8A73A6" stroke="#FFF3D6" stroke-opacity=".25"/><rect x="-14" y="-276" width="28" height="4" fill="#6A5486"/><rect x="-14" y="-266" width="28" height="4" fill="#6A5486"/><rect x="14" y="-200" width="5" height="24" fill="#B796D4"/>
      <circle cx="-2" cy="-210" r="15" fill="#F2C94C"/><text x="-2" y="-206" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="8" fill="#3A2A12">DILO</text><path d="M-17 -186 q9 -5 18 1 q7 3 12 -1" stroke="#2A1B26" stroke-width="1.8" fill="none"/></g>` },
    mirador: { dib: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-70 4 L-50 -30 L20 -40 L74 -18 L84 4Z" fill="#2E2440"/><path d="M-50 -30 L20 -40 L74 -18" stroke="#4A3C5E" stroke-width="3" fill="none"/></g>` },
    /* el nicho de la Virgen sobre su pedestal de piedra, como los de las veredas */
    nicho: { ancho: 70, dib: (x, y) => `<g transform="translate(${x} ${y})"><path d="M-34 0 L-30 -116 L30 -116 L34 0Z" fill="#3A2E4E"/><path d="M-30 -60 h60 M-32 -30 h64 M-8 -116 v56 M12 -60 v30" stroke="#2A2038" stroke-width="2"/>
      <rect x="-40" y="-124" width="80" height="10" fill="#4A3C5E"/><path d="M-34 -124 L-34 -196 Q0 -236 34 -196 L34 -124Z" fill="#4A3C5E"/><path d="M-22 -128 L-22 -188 Q0 -214 22 -188 L22 -128Z" fill="#1E1630"/>
      <path d="M-9 -134 L-6 -176 Q0 -186 6 -176 L9 -134Z" fill="#6E8FB0" opacity=".8"/><circle cx="0" cy="-180" r="4.5" fill="#E9D7C2" opacity=".8"/>
      <circle cx="12" cy="-140" r="16" fill="#F6C177" class="cw-halo"/><rect x="9" y="-146" width="7" height="12" fill="#F2E6D8"/><path d="M12.5 -152 q3 4 0 6 q-3 -2 0 -6" fill="#FFD48A" class="cw-vela"/>
      <g fill="#C24A5A" opacity=".8"><circle cx="-14" cy="-132" r="3"/><circle cx="-9" cy="-134" r="3"/></g></g>` },
    fuente: { ancho: 135, dib: (x, y) => `<g transform="translate(${x} ${y})"><ellipse cx="0" cy="-4" rx="104" ry="20" fill="#2A1C33"/><path d="M-98 -4 L-92 -64 L92 -64 L98 -4Z" fill="#3A2846"/><ellipse cx="0" cy="-64" rx="92" ry="15" fill="#6E8FA0" opacity=".7"/>
      <rect x="-10" y="-170" width="20" height="106" fill="#3A2846"/><ellipse cx="0" cy="-170" rx="38" ry="8" fill="#4A3658"/><circle cx="0" cy="-180" r="14" fill="#9FD8C8" opacity=".5"/>
      <path d="M-30 -168 q-14 30 -34 96 M30 -168 q14 30 34 96" stroke="#BFE3F2" stroke-width="2" fill="none" opacity=".45" class="cw-chorro"/></g>` },
    loteria: { ancho: 150, dib: (x, y) => `<g transform="translate(${x} ${y})"><g transform="translate(78 0) scale(${(.95 * ESC).toFixed(3)})">${Personajes.dibujar('gente', { semilla: 77 })}</g>
      <rect x="-100" y="-120" width="210" height="12" rx="3" fill="#5A3A3A"/><rect x="-92" y="-108" width="10" height="108" fill="#3A2830"/><rect x="90" y="-108" width="10" height="108" fill="#3A2830"/><rect x="-92" y="-108" width="192" height="60" fill="#3A2830" opacity=".6"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${-90 + i * 38}" y="-140" width="30" height="22" fill="#EFE3D3" transform="rotate(${i % 2 ? 4 : -3} ${-75 + i * 38} -129)"/><circle cx="${-79 + i * 38}" cy="-131" r="3.5" fill="${['#E0303F', '#5E8C8A', '#D9A441', '#7A5AA8', '#E0303F'][i]}"/>`).join('')}
      <rect x="-118" y="-330" width="7" height="210" fill="#3A2830"/>${Escenarios.letrero({ cx: -114, y: -340, w: 130, h: 42, texto: 'LOTERÍA', estilo: 'pintado', fondo: '#B0476A', tinta: '#FFF3E6', size: 16, espacio: 2 })}</g>` }
  };

  /* ---------- Mundos ---------- */
  const MUNDOS = {
    /* El patio de la prepa a la hora del recreo (la escena de “prepa”, pero ancha). */
    patio: () => {
      const ancho = 4400, suelo = 820, fondo = 768;
      const ventanas = (x0, n, y) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * 104}" y="${y}" width="70" height="110" rx="3"/>`).join('');
      return {
        ancho, suelo, fondo, silueta: '#2E2140', inicio: 230,
        defs: `<linearGradient id="cw-cielo" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8E7AAE"/><stop offset=".6" stop-color="#C9A0B2"/><stop offset="1" stop-color="#E6C0B4"/></linearGradient>
          <linearGradient id="cw-piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E4874"/><stop offset="1" stop-color="#3E2E50"/></linearGradient>`,
        capas: [
          [0, `<rect x="-200" y="0" width="${W + 400}" height="${H}" fill="url(#cw-cielo)"/><circle cx="380" cy="190" r="80" fill="#FFF1E4" opacity=".6"/>`],
          [.15, `<path d="M-200 520 Q200 430 600 500 T1400 480 T2200 500 T3000 470 V900 H-200Z" fill="#A586A8" opacity=".6"/>${bruma(440, 200, 2600)}`],
          [.3, rayos(3, 2400, 6, 220)],
          [.4, `<path d="M-200 590 Q300 540 700 580 T1600 560 T2600 585 T3800 560 V900 H-200Z" fill="#8E6E99" opacity=".85"/>` + Array.from({ length: 40 }, (_, i) => { const x = i * 95 + (i % 3) * 20; const h = 60 + (i * 37) % 70; return `<polygon points="${x - h * .2},600 ${x},${600 - h} ${x + h * .2},600" fill="#80618E"/>`; }).join('') + bruma(520, 180, 4000)],
          [1, `
            <g fill="#664E7A"><rect x="200" y="250" width="1900" height="${fondo - 250}"/><rect x="2780" y="380" width="1150" height="${fondo - 380}"/></g>
            <rect x="180" y="236" width="1940" height="24" fill="#56406A"/><rect x="2760" y="366" width="1190" height="22" fill="#56406A"/><rect x="200" y="500" width="1900" height="10" fill="#56406A"/>
            <g fill="#E9CFC6" opacity=".6">${ventanas(260, 18, 330)}${ventanas(260, 18, 560)}${ventanas(2840, 11, 470)}</g>
            <rect x="1000" y="640" width="120" height="${fondo - 640}" fill="#45325A"/><rect x="1058" y="640" width="4" height="${fondo - 640}" fill="#36284A"/>
            ${Escenarios.letrero({ cx: 1040, y: 256, w: 600, h: 60, texto: 'PREPARATORIA LÁZARO CÁRDENAS', sub: 'TEPETLÁN, TLAX. · TURNO MATUTINO', size: 20, espacio: 3, fondo: '#45325A', tinta: '#EBC6B6', icono: Escenarios.escudo(770, 286, '#EBC6B6') })}
            ${Escenarios.letrero({ cx: 3350, y: 392, w: 300, h: 52, texto: 'CAFETERÍA', sub: 'TORTAS · AGUAS · TAMALES', estilo: 'pintado', fondo: '#EBD8C6', tinta: '#7A3E55', size: 19, espacio: 4 })}
            ${Escenarios.arbol(120, fondo, 470, '#735690', 41, '#B79AD8')}${Escenarios.arbol(2330, fondo, 500, '#735690', 42, '#B79AD8')}${Escenarios.arbol(4280, fondo, 480, '#735690', 43, '#B79AD8')}
            <rect x="0" y="${fondo - 8}" width="${ancho}" height="10" fill="#4E3A62"/>
            <rect x="0" y="${fondo}" width="${ancho}" height="${H - fondo}" fill="url(#cw-piso)"/>
            ${Array.from({ length: 30 }, (_, i) => `<path d="M${i * 150} ${fondo} L${i * 150 - 40} ${H}" stroke="#36284A" stroke-width="2" opacity=".5"/>`).join('')}
            <g fill="#36284A"><rect x="1290" y="${suelo - 62}" width="240" height="15" rx="4"/><rect x="1306" y="${suelo - 48}" width="13" height="48"/><rect x="1501" y="${suelo - 48}" width="13" height="48"/></g>
            <rect x="3820" y="${suelo - 54}" width="340" height="54" fill="#523E66"/><rect x="3812" y="${suelo - 60}" width="356" height="10" fill="#614C78"/>
            <g fill="#3F7A58" opacity=".7">${[3850, 3920, 4010, 4100].map(x => `<path d="M${x} ${suelo - 60} q10 -60 22 0 q12 -46 20 0z"/>`).join('')}</g>`],
          [1.45, frente(11, ancho * 1.5 + W, ['persona', 'rama', 'persona', 'arbusto', 'persona'])]
        ],
        tono: 'dia', piso: 'patio', pasan: 'gente',
        gente: multitud(11, [[300, 760, 7], [1050, 1250, 3], [1600, 1950, 6], [2300, 2950, 8], [3350, 3780, 7]]),
        petalos: '#C9A6E8'
      };
    },
    /* La Feria del Bordado: una calle de puestos hasta el de la cooperativa (si todavía lo tienen). */
    feria: (s) => {
      const ancho = 5200, suelo = 820, fondo = 762;
      const cs = ['#9C4766', '#6E5498', '#B8707E', '#557E7C', '#A2613E'];
      const puesto = (x, w, c, letrero) => `<rect x="${x}" y="430" width="${w}" height="${fondo - 430}" fill="#34243F" opacity=".7"/><rect x="${x}" y="430" width="8" height="${fondo - 430}" fill="#261A2F"/><rect x="${x + w - 8}" y="430" width="8" height="${fondo - 430}" fill="#261A2F"/>
        <path d="M${x - 12} 430 L${x + w + 12} 430 L${x + w} 470 ${Array.from({ length: 6 }, (_, i) => `Q${x + w - (i + .5) * w / 6} 492 ${x + w - (i + 1) * w / 6} 470`).join(' ')}Z" fill="${c}"/>
        <rect x="${x}" y="${fondo - 90}" width="${w}" height="12" fill="#261A2F"/>
        ${Array.from({ length: Math.floor(w / 60) }, (_, i) => `<rect x="${x + 12 + i * 60}" y="${fondo - 128}" width="44" height="38" fill="${['#E2D6C8', '#DDA0B8', '#C8303F', '#A68CC6'][(i + x) % 4]}" opacity=".85"/>`).join('')}
        ${letrero ? `<path d="M${x + w / 2 - 80} 432 V376 M${x + w / 2 + 80} 432 V376" stroke="#261A2F" stroke-width="2"/>${Escenarios.letrero({ cx: x + w / 2, y: 370, w: 220, h: 50, texto: letrero, estilo: 'pintado', fondo: '#F2E3CF', tinta: Personajes.sombra(c, .1), size: 18, espacio: 2 })}` : ''}`;
      const cordel = (x0, x1, y) => `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + 50} ${x1} ${y}" stroke="#2A1C33" stroke-width="2" fill="none"/>` + Array.from({ length: Math.floor((x1 - x0) / 48) }, (_, i) => { const x = x0 + 14 + i * 48, t = (x - x0) / (x1 - x0), yy = y + 200 * t * (1 - t) * .5; return `<path d="M${x} ${yy} h32 v34 l-8 -6 l-8 6 l-8 -6 l-8 6z" fill="${cs[i % cs.length]}" opacity=".85"/>`; }).join('');
      const focos = (x0, x1, y) => Array.from({ length: Math.floor((x1 - x0) / 70) }, (_, i) => { const x = x0 + 35 + i * 70, t = (x - x0) / (x1 - x0); return `<circle cx="${x}" cy="${y + 200 * t * (1 - t) * .5}" r="7" fill="#FFE3A3" class="foco" style="--r:${-(i % 5) * .4}s"/>`; }).join('');
      /* la otra hilera de puestos, más atrás: solo el bulto, el toldo apagado y la luz de adentro */
      const puestosAtras = (x0, x1) => { let h = '', x = x0, i = 0; while (x < x1) { const w = 220 + (i * 53) % 120; h += `<rect x="${x}" y="590" width="${w}" height="150" fill="#4A2D56"/><rect x="${x + 14}" y="620" width="${w - 28}" height="60" fill="#FFD9A0" opacity=".14"/><path d="M${x - 8} 590 H${x + w + 8} L${x + w} 616 ${Array.from({ length: 5 }, (_, k) => `Q${x + w - (k + .5) * w / 5} 632 ${x + w - (k + 1) * w / 5} 616`).join(' ')}Z" fill="${cs[i % cs.length]}" opacity=".5"/><path d="M${x - 8} 590 H${x + w + 8} L${x + w} 616 H${x}Z" fill="#3A2246" opacity=".35"/>`; x += w + 40 + (i * 37) % 60; i++; } return h; };
      const nuestro = s && s.m.puesto !== 'perdido';
      return {
        ancho, suelo, fondo, silueta: '#24172E', inicio: 220,
        defs: `<linearGradient id="cw-feria" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3E2852"/><stop offset=".6" stop-color="#AE6478"/><stop offset="1" stop-color="#E2AE88"/></linearGradient>
          <linearGradient id="cw-piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2846"/><stop offset="1" stop-color="#22162C"/></linearGradient>`,
        capas: [
          [0, `<rect x="-200" y="0" width="${W + 400}" height="${H}" fill="url(#cw-feria)"/><circle cx="1100" cy="560" r="130" fill="#FFE3C2" opacity=".7"/>`],
          [.12, `<path d="M-200 600 Q300 540 800 580 T1800 560 T2800 590 V900 H-200Z" fill="#8A5470" opacity=".7"/>` + Escenarios.parroquia(1500, 690, 1, '#6A3E66', '#FFD9A0')],
          [.2, Escenarios.casas(-200, 3000, 720, 21, '#5E3862', '#FFD9A0', 1.05) + Escenarios.kiosco(900, 740, 1.25, '#4A2A52', '#FFD9A0')
            + Escenarios.arbol(500, 740, 320, '#432748', 31) + Escenarios.arbol(1330, 740, 300, '#432748', 32) + Escenarios.arbol(2350, 740, 340, '#432748', 33) + bruma(460, 200, 2800)],
          [.35, rayos(5, 2800, 6, -200)],
          [.5, puestosAtras(-200, ancho * .5 + 900) + Escenarios.rueda(1500, 720, 210, '#4A2D56', '#FFE3A3') + Array.from({ length: 10 }, (_, i) => cordel(i * 420 - 100, i * 420 + 320, 300)).join('') + bruma(560, 160, ancho * .5 + 900)],
          [1, `
            <rect x="0" y="${fondo}" width="${ancho}" height="${H - fondo}" fill="url(#cw-piso)"/>
            ${Array.from({ length: 36 }, (_, i) => `<path d="M${i * 150} ${fondo} L${i * 150 - 50} ${H}" stroke="#1A1022" stroke-width="2" opacity=".35"/>`).join('')}
            ${puesto(500, 300, cs[0], 'ELOTES')}${puesto(1120, 340, cs[3], 'BARRO')}
            ${puesto(1760, 360, cs[0], 'LAS ÁNIMAS')}${puesto(2480, 320, cs[2], 'JUEGOS')}
            ${puesto(3150, 300, cs[4], 'DULCES')}
            <rect x="3860" y="${suelo - 112}" width="300" height="16" rx="4" fill="#261A2F"/><rect x="3880" y="${suelo - 96}" width="12" height="96" fill="#261A2F"/><rect x="4128" y="${suelo - 96}" width="12" height="96" fill="#261A2F"/><rect x="3870" y="${suelo - 96}" width="280" height="50" fill="#3A2846" opacity=".7"/>
            <rect x="3866" y="${suelo - 330}" width="8" height="218" fill="#261A2F"/><rect x="4146" y="${suelo - 330}" width="8" height="218" fill="#261A2F"/>${Escenarios.letrero({ cx: 4010, y: suelo - 340, w: 288, h: 54, texto: 'COMITÉ DE LA FERIA', sub: 'INFORMES · REGISTRO DE ARTESANAS', estilo: 'manta', fondo: '#F2E3CF', tinta: '#7A3E55', size: 17, espacio: 2 })}
            ${nuestro ? puesto(4540, 380, '#E0303F', 'HILO ROJO') : `<rect x="4560" y="${fondo - 4}" width="300" height="14" fill="#E0303F"/><text x="4710" y="${fondo - 20}" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="16" fill="#F6E6D6">HILO ROJO (manta junto a la entrada)</text>`}
            ${Array.from({ length: 12 }, (_, i) => cordel(i * 460, i * 460 + 420, 150)).join('')}${focos(0, ancho, 230)}`],
          [1.45, frente(5, ancho * 1.5 + W, ['persona', 'picado', 'persona', 'poste', 'persona'])]
        ],
        tono: 'tarde', piso: 'plaza', pasan: 'gente',
        gente: multitud(5, [[200, 560, 7], [800, 1150, 8], [1420, 1720, 7], [2150, 2450, 8], [2800, 3150, 8], [3450, 3850, 7], [4200, 4450, 4]]),
        petalos: '#F2A7C3'
      };
    },
    /* El pasillo de la planta baja, de los salones a Orientación (interior, luz de la tarde por las ventanas). */
    pasillo: () => {
      const ancho = 4000, suelo = 820, fondo = 744;
      const puerta = (x, letrero, color = '#45325A') => `<rect x="${x}" y="400" width="150" height="${fondo - 400}" fill="${color}"/><rect x="${x + 12}" y="416" width="126" height="110" fill="#F2D7C9" opacity=".22"/><circle cx="${x + 128}" cy="600" r="7" fill="#B796D4"/>${Escenarios.letrero({ cx: x + 75, y: 346, w: letrero.length > 6 ? 168 : 124, h: 42, texto: letrero, size: letrero.length > 6 ? 13 : 16, espacio: 2, fondo: '#2E2140', tinta: '#EBC6B6' })}`;
      const lockers = (x0, n) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * 46}" y="${fondo - 250}" width="42" height="250" fill="#715C8C"/><rect x="${x0 + i * 46 + 8}" y="${fondo - 236}" width="26" height="4" fill="#54406A"/><rect x="${x0 + i * 46 + 8}" y="${fondo - 226}" width="26" height="4" fill="#54406A"/><rect x="${x0 + i * 46 + 32}" y="${fondo - 150}" width="5" height="22" fill="#B796D4"/>`).join('');
      const ventana = (x) => `<rect x="${x}" y="120" width="220" height="190" fill="url(#cw-afuera)"/><rect x="${x + 106}" y="120" width="8" height="190" fill="#54406A"/><rect x="${x - 8}" y="112" width="236" height="10" fill="#54406A"/><rect x="${x - 8}" y="308" width="236" height="12" fill="#54406A"/>`;
      return {
        ancho, suelo, fondo, silueta: '#2E2140', inicio: 220,
        defs: `<linearGradient id="cw-muro" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7E6898"/><stop offset="1" stop-color="#A486A8"/></linearGradient>
          <linearGradient id="cw-afuera" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C5A7D8"/><stop offset="1" stop-color="#F5CDB8"/></linearGradient>
          <linearGradient id="cw-piso" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A5480"/><stop offset="1" stop-color="#46345A"/></linearGradient>`,
        capas: [
          [0, `<rect x="-200" y="0" width="${W + 400}" height="${H}" fill="url(#cw-muro)"/>`],
          [.5, Array.from({ length: 12 }, (_, i) => ventana(i * 420 + 80)).join('') + Array.from({ length: 12 }, (_, i) => `<rect x="${i * 420 + 60}" y="60" width="300" height="12" rx="6" fill="#FFF3E6" opacity=".5"/>`).join('')],
          [1, `
            <rect x="0" y="${fondo - 400}" width="${ancho}" height="8" fill="#664E7A"/>
            ${puerta(420, '3°A')}${lockers(640, 9)}${puerta(1120, '3°B')}
            ${puerta(1760, 'LAB')}${lockers(1960, 10)}${puerta(2500, 'BAÑOS', '#54406A')}${lockers(2720, 8)}
            ${puerta(3560, 'ORIENTACIÓN', '#613A57')}
            <rect x="3540" y="392" width="190" height="8" fill="#E0303F"/>
            <rect x="0" y="${fondo}" width="${ancho}" height="${H - fondo}" fill="url(#cw-piso)"/>
            ${Array.from({ length: 50 }, (_, i) => `<path d="M${i * 90} ${fondo} L${i * 90 - 60} ${H}" stroke="#3E2E50" stroke-width="2" opacity=".6"/>`).join('')}
            <path d="M0 ${fondo + 34} H${ancho}" stroke="#3E2E50" stroke-width="2" opacity=".5"/>
            <g transform="translate(1690 ${suelo})"><path d="M-40 0 L-26 -100 L26 -100 L40 0 Z" fill="#D9B24C"/><path d="M-26 -100 L0 -118 L26 -100Z" fill="#C49C3A"/><g transform="translate(0 -74)" stroke="#3A2A12" stroke-width="3" stroke-linecap="round" fill="none"><circle cx="-2" cy="-10" r="4" fill="#3A2A12"/><path d="M-4 -5 L2 6 L10 4 M2 6 L-4 13 L-12 11 M-4 -2 L-12 -6 M-1 -1 L8 -4"/><path d="M-14 15 q8 -3 16 0 q8 3 16 0" stroke-width="2"/></g><text x="0" y="-38" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="14" fill="#3A2A12">PISO</text><text x="0" y="-21" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="14" fill="#3A2A12">MOJADO</text></g>
            <g transform="translate(1780 ${suelo})"><rect x="-34" y="-58" width="68" height="58" rx="6" fill="#476E8C"/><rect x="-6" y="-120" width="8" height="66" fill="#7C5E46"/></g>
            <ellipse cx="1740" cy="${suelo + 6}" rx="130" ry="10" fill="#9FC8E6" opacity=".35"/>`],
          [1.02, rayos(9, ancho + 600, 12, 260, H)],
          [1.45, frente(23, ancho * 1.5 + W, ['columna', 'persona', 'persona', 'columna', 'persona'])]
        ],
        resbalones: [{ x1: 1660, x2: 1750, tipo: 'agua', dice: '¡Ay! …Por eso dice «piso mojado».' }],
        tono: 'interior', piso: 'loseta', pasan: 'gente',
        gente: multitud(23, [[250, 640, 5], [900, 1350, 6], [1700, 2050, 5], [2350, 2750, 6], [3050, 3400, 4]]),
        petalos: 'transparent'
      };
    },
    /* El cerro de El Encinal de noche: una subida de tierra hasta la cruz, donde sí hay señal. Hay tramos de tierra suelta. */
    cerro: () => {
      const ancho = 4600, suelo = 820;
      const perfil = [[0, 820], [700, 820], [1050, 740], [1300, 690], [1500, 640], [1750, 600], [1900, 612], [2150, 640], [2400, 600], [2700, 540], [2950, 490], [3200, 452], [3400, 440], [4600, 440]];
      const alto = (x) => { for (let i = 1; i < perfil.length; i++) { const [x1, y1] = perfil[i]; if (x <= x1) { const [x0, y0] = perfil[i - 1]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } } return 440; };
      const resbalones = [{ x1: 1180, x2: 1260, tipo: 'tierra', dice: 'Uy. Tierra suelta.' }, { x1: 2480, x2: 2560, tipo: 'tierra', dice: 'Despacio, Yare.' }];
      const piedras = Array.from({ length: 34 }, (_, i) => { const x = 760 + i * 112 + (i % 3) * 23, y = alto(x), w = 18 + (i * 7) % 26; return `<path d="M${x - w} ${y + 3} L${x - w * .5} ${y - w * .55} L${x + w * .4} ${y - w * .6} L${x + w} ${y + 3}Z" fill="#342A48"/>`; }).join('');
      const estrellas = Array.from({ length: 70 }, (_, i) => `<circle cx="${(i * 97) % (W + 400) - 200}" cy="${(i * 53) % 420}" r="${1 + (i % 3) * .7}" fill="#FFE9D6" opacity="${.3 + (i % 5) * .14}"/>`).join('');
      return {
        ancho, suelo, alto, resbalones, inicio: 220, tono: 'noche', piso: 'tierra', gente: [], pasan: 'ave',
        defs: `<linearGradient id="cw-noche" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#120E22"/><stop offset=".7" stop-color="#352648"/><stop offset="1" stop-color="#5E4060"/></linearGradient>`,
        capas: [
          [0, `<rect x="-200" y="0" width="${W + 400}" height="${H}" fill="url(#cw-noche)"/>${estrellas}<circle cx="1240" cy="150" r="46" fill="#FBEBD6"/><circle cx="1258" cy="140" r="44" fill="#120E22" opacity=".92"/>`],
          [.15, `<path d="M-200 600 Q300 520 800 580 T1800 560 T2800 590 V900 H-200Z" fill="#2A1F3C"/>` + Array.from({ length: 26 }, (_, i) => `<circle cx="${300 + i * 61 + (i % 4) * 9}" cy="${600 + (i % 5) * 7}" r="2.4" fill="#FFD48A" opacity=".85"/>`).join('') + bruma(540, 160, 2800)],
          [.25, rayos(4, 1800, 3, 300)],
          [.4, `<path d="M-200 660 Q400 600 900 650 T2000 630 T3200 650 T4200 620 V900 H-200Z" fill="#211830"/>` + Array.from({ length: 46 }, (_, i) => { const x = i * 100 + (i % 3) * 25; const h = 70 + (i * 41) % 90; return `<polygon points="${x - h * .2},${670} ${x},${670 - h} ${x + h * .2},${670}" fill="#1B142C"/>`; }).join('')],
          [1, `
            <path d="M0 ${H + 300} L${perfil.map(([x, y]) => `${x} ${y}`).join(' L')} L${ancho} ${H + 300}Z" fill="#271D35"/>
            <path d="M${perfil.map(([x, y]) => `${x} ${y}`).join(' L')}" stroke="#443758" stroke-width="6" fill="none"/>
            ${resbalones.map(z => `<ellipse cx="${(z.x1 + z.x2) / 2}" cy="${alto((z.x1 + z.x2) / 2) + 4}" rx="${(z.x2 - z.x1) / 2 + 16}" ry="9" fill="#6B5A6E" opacity=".75"/>${[0, 1, 2, 3, 4].map(q => `<circle cx="${z.x1 + q * (z.x2 - z.x1) / 4}" cy="${alto(z.x1 + q * (z.x2 - z.x1) / 4) - 2}" r="3" fill="#8A7A8A"/>`).join('')}`).join('')}
            ${piedras}
            <g transform="translate(4250 440)"><rect x="-6" y="-260" width="12" height="260" fill="#120D1C"/><rect x="-70" y="-200" width="140" height="12" fill="#120D1C"/><path d="M-90 0 L0 -40 L90 0Z" fill="#120D1C"/>
              <path d="M-70 -194 q20 20 6 50 M60 -194 q-10 24 4 46" stroke="#E0303F" stroke-width="3" fill="none" opacity=".8"/></g>`],
          [1.45, frente(4, ancho * 1.5 + W, ['roca', 'encino', 'zacate', 'roca', 'zacate', 'encino'])]
        ],
        petalos: '#F6E27A', luz: true // luciérnagas en lugar de pétalos
      };
    }
  };

  /* ---------- Arranque ---------- */
  function iniciar(nodo, estado, elementos, done) {
    n = nodo; s = estado; el = elementos; listo = done;
    mundo = MUNDOS[n.mundo](s); // algunos mundos cambian según la partida (p. ej. si hay puesto)
    mundo.alto = mundo.alto || (() => mundo.suelo);
    const puntos = Motor.val(n.puntos).filter(pt => !pt.si || pt.si(s));
    j = { x: mundo.inicio, y: mundo.alto(mundo.inicio), vx: 0, dir: 1, bloqueo: 0, pasoT: 0, empuje: 0, paso: .78, pend: 0, sube: false };
    const acomp = Motor.val(n.acompana); // alguien que camina detrás de Yare: ['mari', { opciones de figura }]
    comp = acomp ? { id: acomp[0], op: acomp[1] || {}, x: mundo.inicio - 120, y: mundo.alto(mundo.inicio - 120), vx: 0, dir: 1, paso: .78, siguiendo: false, quieto: 0, sube: false } : null;
    cam = { x: 0, y: 0 }; // el zoom de «prestar atención» lo hace el CSS sobre .cw-mundo
    teclas = { izq: false, der: false, usar: false, oir: false };
    activo = true; pausa = false; oyendo = null; avisos = {}; turno = 0; quieta = 0;
    /* Nadie se para enfrente de lo que se puede mirar o de quien te habla */
    const despejar = puntos.filter(pt => pt.mira || pt.interaccion || pt.figuras).map(pt => pt.x);
    const gente = (mundo.gente || []).filter(g => despejar.every(x => Math.abs(g.x - x) > (g.fila ? 150 : 110)));
    /* Fila de atrás: los pies sobre el piso, entre la pared (fondo) y la línea de Yare; más lejos = más chico */
    const fondo = mundo.fondo || mundo.suelo - 50;
    const pie = (g) => g.fila ? { y: mundo.alto(g.x) - 2, esc: .97 * ESC } : (() => { const k = .15 + g.prof * .55, y = fondo + (mundo.suelo - fondo) * k; return { y, esc: (.7 + .27 * k) * ESC }; })();
    const npc = (g, i) => { const { y, esc } = pie(g); g.y = y; g.esc = esc;
      const vars = g.camina ? `style="--z:.5;--paso:${(ZBASE * .5 / g.camina.v).toFixed(2)}s"` : '';
      return `<g class="actor gente cw-npc ${g.fila ? '' : 'lejos'}" data-n="${i}" ${vars} transform="translate(${g.x.toFixed(0)} ${y.toFixed(1)}) scale(${(g.voltea ? -esc : esc).toFixed(3)} ${esc.toFixed(3)})">${Personajes.dibujar('gente', { semilla: g.semilla, cel: g.cel })}</g>`; };
    const figuras = (pt) => (pt.figuras || []).map(([fig, dx, op = {}]) => Escenarios.figura(fig, pt.x + dx, (pt.suelo ?? mundo.alto(pt.x)) + (op.dy || 0), op.color || '#000', { ...op, escala: (op.escala || 1) * ESC, semilla: pt.x + dx }));
    const obj = (pt) => pt.objeto && OBJETOS[pt.objeto];
    const objeto = (pt) => obj(pt) && !obj(pt).pared ? `<g class="cw-obj">${obj(pt).dib(pt.x, pt.suelo ?? mundo.alto(pt.x))}</g>` : '';
    /* lo que está pegado en la pared queda detrás de la gente que pasa */
    const pared = puntos.map((pt, k) => obj(pt)?.pared ? `<g class="cw-obj cw-pared" data-k="${k}">${obj(pt).dib(pt.x, fondo)}</g>` : '').join('');
    const actor = (id, op) => `<g id="cw-${id === 'yare' ? 'yare' : 'acomp'}" class="actor" style="--z:${Z}">${Personajes.dibujar(id, { ...op, escala: ESC })}</g>`;
    const capas = [...mundo.capas], iFrente = capas.findIndex(([pr]) => pr > 1.2);
    capas.splice(iFrente < 0 ? capas.length : iFrente, 0, [1.12, motas(n.mundo.length * 13, mundo.ancho * 1.12 + W, !!mundo.luz)]);
    el.caja.classList.remove('visible');
    el.panel.className = 'panel visible caminar';
    el.panel.innerHTML = `
      <div class="cw" data-tono="${mundo.tono || 'dia'}" data-mundo="${n.mundo}">
        <div class="cw-mundo">
          <svg class="cw-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice">
            <defs>${DEFS}${mundo.defs}<radialGradient id="cw-foco"><stop offset="0" stop-color="#FFF3D6" stop-opacity=".45"/><stop offset="1" stop-color="#FFF3D6" stop-opacity="0"/></radialGradient>
              <radialGradient id="cw-polvo"><stop offset="0" stop-color="#FFF6E2" stop-opacity=".9"/><stop offset=".35" stop-color="#FFF0D6" stop-opacity=".35"/><stop offset="1" stop-color="#FFF0D6" stop-opacity="0"/></radialGradient>
              <radialGradient id="cw-luci"><stop offset="0" stop-color="#FFF8C8"/><stop offset=".25" stop-color="#F6E27A" stop-opacity=".8"/><stop offset="1" stop-color="#F6E27A" stop-opacity="0"/></radialGradient></defs>
            ${capas.map(([prof, cont], i) => `<g class="cw-capa ${prof > 1.2 ? 'cw-capa-frente' : ''}" data-prof="${prof}" data-i="${i}">${cont}${prof === 1 ? `
              <g class="cw-paredes">${pared}</g>
              <g class="cw-fila0">${gente.map((g, k) => g.fila ? '' : npc(g, k)).join('')}</g>
              <g class="cw-fila1">${gente.map((g, k) => g.fila ? npc(g, k) : '').join('')}</g>
              <g id="cw-gente">${puntos.map((pt, k) => `<g class="cw-punto ${pt.ambiente ? 'cw-grupo' : ''}" data-k="${k}">${pt.ambiente ? `<ellipse cx="${pt.x}" cy="${(pt.suelo ?? mundo.alto(pt.x)) + 4}" rx="170" ry="22" fill="url(#cw-foco)"/>` : ''}${objeto(pt)}<g class="cw-svgpt">${pt.svg || ''}</g>${figuras(pt).join('')}</g>`).join('')}</g>
              ${comp ? actor(comp.id, comp.op) : ''}
              ${actor('yare', {})}` : ''}</g>`).join('')}
            <g class="cw-capa-frente cw-pasan"></g>
          </svg>
          <div class="cw-capa-ui"></div>
        </div>
        <div class="cw-petalos">${mundo.petalos === 'transparent' || mundo.luz ? '' : Array.from({ length: 12 }, (_, i) => `<i style="--x:${(i * 61) % 100}%;--y:${20 + (i * 37) % 65}%;--d:${9 + (i % 5) * 1.5}s;--r:${-(i * 1.7) % 9}s;background:${mundo.petalos}"></i>`).join('')}</div>
        <div class="cw-vineta"></div>
        ${n.hud ? '<div class="cw-hud"></div>' : ''}
        <div class="cw-intro">${Motor.formato(Motor.val(n.intro) || '')}<small>← → caminar · Q prestar atención · E interactuar</small></div>
        <div class="cw-ori" aria-live="polite"></div>
        <div class="cw-eleccion" hidden></div>
        <div class="cw-tactil">
          <button class="cw-b" data-t="izq" aria-label="Caminar a la izquierda">${Iconos.svg('izq')}</button>
          <button class="cw-b" data-t="der" aria-label="Caminar a la derecha">${Iconos.svg('der')}</button>
          <button class="cw-b oir" data-t="oir" aria-label="Prestar atención">${Iconos.svg('oir')}</button>
          <button class="cw-b usar" data-t="usar" hidden>Hablar</button>
        </div>
      </div>`;
    despejarFrente(el.panel, [...puntos.map(pt => pt.x), ...(mundo.resbalones || []).map(z => (z.x1 + z.x2) / 2)]);
    ui = {
      raiz: el.panel.querySelector('.cw'), mundo: el.panel.querySelector('.cw-mundo'), svg: el.panel.querySelector('.cw-svg'), capa: el.panel.querySelector('.cw-capa-ui'),
      eleccion: el.panel.querySelector('.cw-eleccion'), usar: el.panel.querySelector('[data-t="usar"]'), ori: el.panel.querySelector('.cw-ori'),
      yare: el.panel.querySelector('#cw-yare'), acomp: el.panel.querySelector('#cw-acomp'),
      capas: [...el.panel.querySelectorAll('.cw-capa')], hud: el.panel.querySelector('.cw-hud'),
      pasan: el.panel.querySelector('.cw-pasan'), pasantes: [], pasaT: 3 + Math.random() * 3,
      npcs: gente.map((g, k) => ({ g, nodo: el.panel.querySelector(`.cw-npc[data-n="${k}"]`) })),
      puntos: puntos.map((pt, k) => ({ pt, k, hecho: false, voz: null, aviso: null, oidoT: 0, grupo: el.panel.querySelector(`.cw-punto[data-k="${k}"]`), pared: el.panel.querySelector(`.cw-pared[data-k="${k}"]`) }))
    };
    ui.yareP = ui.yare.querySelector('.pj'); ui.acompP = ui.acomp?.querySelector('.pj');
    ui.npcs.forEach(x => { if (x.g.camina) x.nodo.querySelector('.pj').classList.add('camina'); });
    ui.puntos.forEach(p => {
      if (p.pt.ambiente) { p.voz = document.createElement('div'); p.voz.className = 'cw-voz murmullo'; p.voz.hidden = true; ui.capa.appendChild(p.voz); }
      if (p.pt.mira) { p.brillo = document.createElement('div'); p.brillo.className = 'cw-brillo'; ui.capa.appendChild(p.brillo); }
      p.aviso = document.createElement('div'); p.aviso.className = 'cw-aviso'; p.aviso.hidden = true; ui.capa.appendChild(p.aviso);
    });
    addEventListener('keydown', abajo); addEventListener('keyup', arriba);
    ui.raiz.addEventListener('pointerdown', () => { if (quieta) ui.adelantar?.(); });
    el.panel.querySelectorAll('.cw-b').forEach(b => {
      const t = b.dataset.t;
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); teclas[t] = true; });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, () => { if (t !== 'usar') teclas[t] = false; }));
      b.addEventListener('click', (e) => e.stopPropagation());
    });
    setTimeout(() => el.panel.querySelector('.cw-intro')?.classList.add('fuera'), 7000);
    window.Sonido?.ambiente(n.mundo);
    ult = performance.now();
    raf = requestAnimationFrame(cuadro);
  }

  function aviso(id, texto) { if (avisos[id]) return; avisos[id] = true; Motor.hilo(texto); }
  const tactil = () => matchMedia('(pointer: coarse)').matches;
  const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const espera = (ms) => new Promise(r => setTimeout(r, ms));

  /* ---------- Teclado ---------- */
  function abajo(e) {
    if (!activo) return;
    if (!document.getElementById('menu-juego')?.hidden) { teclas.izq = teclas.der = teclas.oir = teclas.usar = false; return; } // con el menú abierto no se camina
    const k = e.key.toLowerCase();
    if (pausa) { if (/^[1-4]$/.test(k)) ui.eleccion.querySelectorAll('button')[+k - 1]?.click(); return; }
    if (['arrowleft', 'a'].includes(k)) teclas.izq = true;
    if (['arrowright', 'd'].includes(k)) teclas.der = true;
    if (['q', 'shift', 'arrowdown', 's'].includes(k)) teclas.oir = true;
    if (['e', 'enter'].includes(k)) teclas.usar = true;
    if (['arrowleft', 'arrowright', 'arrowdown', ' ', 'enter'].includes(k)) e.preventDefault();
    e.stopPropagation();
  }
  function arriba(e) {
    const k = e.key.toLowerCase();
    if (['arrowleft', 'a'].includes(k)) teclas.izq = false;
    if (['arrowright', 'd'].includes(k)) teclas.der = false;
    if (['q', 'shift', 'arrowdown', 's'].includes(k)) teclas.oir = false;
  }

  /* ---------- Movimiento ---------- */
  function cuadro(t) {
    if (!activo) return;
    const dt = Math.min(.05, (t - ult) / 1000); ult = t;
    if (!pausa) mover(dt, t);
    moverGente(dt);
    moverPasantes(dt);
    dibujar(t);
    raf = requestAnimationFrame(cuadro);
  }

  /* El ciclo de paso dura lo que tarda en avanzar una zancada: así los pies no patinan.
     Se cambia en escalones y con margen (no cada cuadro): si la duración cambia a cada rato, la animación brinca. */
  function ritmo(quien, nodo, v) {
    const p = Math.min(1.3, Math.max(.7, ZANCADA / Math.max(1, Math.abs(v))));
    if (Math.abs(p - quien.paso) < .14) return;
    const escalon = p < .86 ? .78 : p < 1.05 ? .95 : 1.2;
    if (escalon !== quien.paso) { quien.paso = escalon; nodo.style.setProperty('--paso', escalon + 's'); }
  }
  /* Qué tan empinado está hacia donde va (negativo = de subida). Suavizado: en los quiebres del cerro no brinca. */
  function cuesta(quien, hacia, dt) {
    const pend = (mundo.alto(quien.x + 40 * hacia) - mundo.alto(quien.x)) / 40;
    quien.pend = (quien.pend || 0) + (pend - (quien.pend || 0)) * Math.min(1, dt * 3);
    if (quien.sube ? quien.pend > -.07 : quien.pend < -.14) quien.sube = !quien.sube; // con margen, para que no parpadee
    return quien.pend;
  }

  const POSES_MIRAR = ['g-agacha', 'g-arriba', 'g-mira', 'g-lejos'];
  function quitarPose() { if (ui.mirando) { ui.yareP.classList.remove(...POSES_MIRAR); clearTimeout(ui.mirando); ui.mirando = null; } }

  function mover(dt, t) {
    const quiere = quieta ? 0 : (teclas.der ? 1 : 0) - (teclas.izq ? 1 : 0);
    const escuchando = teclas.oir && !quieta;
    j.bloqueo = Math.max(0, j.bloqueo - dt);
    if (quiere && ui.mirando && j.bloqueo <= 0) quitarPose();
    /* En subida se camina más despacio y con el cuerpo inclinado */
    const pend = cuesta(j, quiere || j.dir, dt);
    const empinado = Math.max(0, Math.min(1, (-pend - .05) / .25));
    const vel = VEL * (1 - .35 * empinado) * (escuchando ? 0 : 1);
    const objetivo = j.bloqueo > 0 ? 0 : quiere * vel;
    j.vx += (objetivo - j.vx) * Math.min(1, dt * 8);
    if (Math.abs(j.vx) > 20) j.dir = j.vx > 0 ? 1 : -1;
    j.x = Math.max(90, Math.min(mundo.ancho - 90, j.x + (j.vx + j.empuje) * dt));
    j.empuje *= Math.exp(-dt * 5); // el resbalón la arrastra un poco y se va frenando
    if (j.meta != null) { const dx = j.meta - j.x; j.x += dx * Math.min(1, dt * 6); if (Math.abs(dx) < 2) j.meta = null; }
    j.y += (mundo.alto(j.x) - j.y) * Math.min(1, dt * 18);
    const andando = Math.abs(j.vx) > 30;
    ui.yareP.classList.toggle('camina', andando);
    ui.yareP.classList.toggle('sube', j.sube);
    ui.yareP.classList.toggle('baja', pend > .14);
    if (andando) { ritmo(j, ui.yare, j.vx); j.pasoT -= dt; if (j.pasoT <= 0) { j.pasoT = j.paso / 2; window.Sonido?.paso(mundo.piso || 'tierra'); } }

    /* Tropiezos: piedras sueltas, piso mojado… (una vez por tramo) */
    for (const z of (mundo.resbalones || [])) if (!z.hecho && andando && j.x > z.x1 && j.x < z.x2) {
      z.hecho = true;
      const agua = z.tipo === 'agua', clase = agua ? 'g-resbala' : 'g-tropieza';
      j.bloqueo = agua ? 1.05 : 1.2; j.vx = 0;
      j.empuje = (agua ? 140 : -40) * j.dir; // en el agua se va de frente; en la tierra suelta el pie se corre un poco para abajo
      ui.yareP.classList.remove('camina', 'sube'); ui.yareP.classList.add(clase); setTimeout(() => ui.yareP.classList.remove(clase), agua ? 1150 : 1320);
      polvo(j.x, mundo.alto(j.x), z.tipo);
      window.Sonido?.efecto(agua ? 'resbalon' : 'tropiezo');
      if (z.dice) setTimeout(() => activo && decir({ pt: { x: j.x } }, [['yare', Motor.val(z.dice)]], true), 500);
    }

    /* Acompañante: no se mueve de golpe. Si Yare se da la vuelta, se queda donde está hasta que ella
       le pasa a un lado y se aleja; entonces sí voltea y la sigue. Ya parado, al rato voltea a verla. */
    if (comp) {
      const d = j.x - comp.x, hueco = 110;
      if (!comp.siguiendo && Math.abs(d) > hueco + 60) comp.siguiendo = true;
      if (comp.siguiendo && Math.abs(d) < hueco) comp.siguiendo = false;
      const meta = comp.siguiendo ? Math.sign(d) * Math.max(0, Math.min(VEL * 1.12, (Math.abs(d) - hueco) * 2.6)) : 0; // frena solo al acercarse
      comp.vx += (meta - comp.vx) * Math.min(1, dt * 6);
      comp.x += comp.vx * dt;
      const anda = Math.abs(comp.vx) > 30;
      if (anda) { comp.dir = comp.vx > 0 ? 1 : -1; comp.quieto = 0; }
      else { comp.quieto += dt; if (comp.quieto > 1.4 && Math.abs(d) > 40) comp.dir = Math.sign(d); }
      comp.y += (mundo.alto(comp.x) - comp.y) * Math.min(1, dt * 12);
      cuesta(comp, comp.dir, dt);
      ui.acompP.classList.toggle('camina', anda);
      ui.acompP.classList.toggle('sube', comp.sube);
      if (anda) ritmo(comp, ui.acomp, comp.vx);
    }

    /* Prestar atención: zoom al grupo más cercano y el resto del ruido baja.
       La mano va a la oreja del lado del grupo: si está enfrente, la de enfrente; si está atrás, por detrás. */
    let foco = null;
    if (escuchando) for (const p of ui.puntos) if (p.pt.ambiente && !(p.hecho && !p.pt.despues) && Math.abs(j.x - p.pt.x) < (p.pt.oido || 560) && (!foco || Math.abs(j.x - p.pt.x) < Math.abs(j.x - foco.pt.x))) foco = p;
    if (foco !== oyendo) {
      oyendo = foco;
      ui.raiz.classList.toggle('escuchando', !!foco);
      ui.puntos.forEach(p => p.grupo?.classList.toggle('oido', p === foco));
      ui.yareP.classList.remove('g-escucha', 'g-oye');
      if (foco) ui.yareP.classList.add(Math.sign(foco.pt.x - j.x) === j.dir ? 'g-oye' : 'g-escucha');
      window.Sonido?.escuchar(!!foco);
      if (foco && foco.pt.alEscuchar) foco.pt.alEscuchar(s);
    }
    if (oyendo) oyendo.oidoT += dt;
    if (escuchando && !foco) aviso('nadie', 'No hay nadie hablando cerca.');
    const cercaDeGrupo = ui.puntos.some(p => p.pt.ambiente && !Motor.val(p.pt.claro) && !p.hecho && Math.abs(j.x - p.pt.x) < 480);
    if (cercaDeGrupo) aviso('oir', tactil() ? 'Mantén presionado el botón de la oreja para prestar atención a lo que murmuran.' : 'Mantén Q (o Shift) para prestar atención a lo que murmuran.');

    /* Puntos de interés. A un grupo que murmura solo se le puede contestar si de verdad se le puso atención
       (¿cómo le reclamas algo que no oíste?). Lo que se puede mirar se ilumina un poco al acercarse. */
    let cercano = null;
    for (const p of ui.puntos) {
      const d = Math.abs(j.x - p.pt.x);
      const usable = (p.pt.interaccion && !p.hecho) || (p.pt.mira && !p.visto);
      if (usable && d < (p.pt.radio || 170) && (!cercano || d < Math.abs(j.x - cercano.pt.x))) cercano = p;
    }
    const oyoBien = (p) => !p.pt.interaccion || !p.pt.ambiente || Motor.val(p.pt.claro) || p.oidoT >= 1.2;
    const elegible = cercano && oyoBien(cercano) ? cercano : null;
    ui.puntos.forEach(p => {
      p.aviso.hidden = p !== cercano || !!oyendo || !!quieta;
      p.aviso.classList.toggle('tenue', p === cercano && !elegible);
      p.grupo?.classList.toggle('cerca', p === elegible);
      p.pared?.classList.toggle('cerca', p === elegible);
      if (p === cercano) p.aviso.innerHTML = elegible ? `${tactil() ? '' : 'E · '}${Motor.esc(Motor.val(p.pt.interaccion?.etiqueta || p.pt.etiqueta || 'Mirar'))}` : `${tactil() ? Iconos.svg('oir') : 'Q ·'} Prestar atención`;
    });
    ui.usar.hidden = !elegible || !!quieta;
    if (elegible) ui.usar.textContent = Motor.val(elegible.pt.interaccion?.etiqueta || elegible.pt.etiqueta || 'Mirar');
    if (teclas.usar) { teclas.usar = false; if (quieta) ui.adelantar?.(); else if (elegible) interactuar(elegible); }
  }

  function moverGente(dt) {
    for (const x of ui.npcs) {
      const c = x.g.camina; if (!c) continue;
      x.g.x += c.v * c.dir * dt;
      if (x.g.x > c.b) c.dir = -1; if (x.g.x < c.a) c.dir = 1;
      const esc = x.g.esc, y = x.g.fila ? mundo.alto(x.g.x) - 2 : x.g.y;
      x.nodo.setAttribute('transform', `translate(${x.g.x.toFixed(1)} ${y.toFixed(1)}) scale(${(c.dir * esc).toFixed(3)} ${esc.toFixed(3)})`);
    }
  }

  function polvo(x, y, tipo) {
    for (let i = 0; i < 7; i++) {
      const d = document.createElement('i');
      d.className = `cw-polvo ${tipo}`;
      const [px, py] = aPantalla(x + (Math.random() - .5) * 50, y - 6);
      d.style.left = px + 'px'; d.style.top = py + 'px'; d.style.setProperty('--dx', ((Math.random() - .5) * 60) + 'px');
      ui.capa.appendChild(d); setTimeout(() => d.remove(), 900);
    }
  }

  /* Convierte una coordenada del mundo a píxeles de pantalla (para los textos en HTML).
     Medidas sin el zoom de «prestar atención»: los textos viven dentro del mismo contenedor que se agranda. */
  const medida = () => ({ width: ui.svg.clientWidth, height: ui.svg.clientHeight });
  /* Que los textos no se salgan por los lados (en celular la pantalla es angosta). */
  const dentro = (bx) => { const w = medida().width, m = Math.min(150, w * .34) + 6; return Math.max(m, Math.min(w - m, bx)); };
  function aPantalla(x, y) {
    const r = medida();
    const e = Math.max(r.width / W, r.height / H);
    return [(r.width - W * e) / 2 + (x - cam.x) * e, r.height - (H - y - cam.y) * e];
  }

  function dibujar(t) {
    const r = medida();
    if (!r.width || !r.height) return; // todavía sin tamaño (primer cuadro o pestaña oculta)
    if (!Number.isFinite(cam.x)) cam.x = 0;
    const e = Math.max(r.width / W, r.height / H), vis = r.width / e, x0 = (W - vis) / 2;
    const metaX = (oyendo ? (j.x + oyendo.pt.x) / 2 : j.x) - W / 2;
    cam.x += (Math.max(-x0, Math.min(mundo.ancho - W + x0, metaX)) - cam.x) * .08;
    cam.y += (Math.max(0, 640 - j.y) - cam.y) * .06; // en lo alto (el cerro) la cámara también sube
    /* El primer plano no sube con la cámara: está pegado a la pantalla, como si estuviera junto a ella */
    ui.capas.forEach(g => { const pr = +g.dataset.prof; g.setAttribute('transform', `translate(${(-cam.x * pr).toFixed(1)} ${(pr > 1.2 ? 0 : cam.y * Math.min(1, pr)).toFixed(1)})`); });
    ui.yare.setAttribute('transform', `translate(${j.x.toFixed(1)} ${j.y.toFixed(1)}) scale(${j.dir} 1)`);
    if (ui.acomp) ui.acomp.setAttribute('transform', `translate(${comp.x.toFixed(1)} ${comp.y.toFixed(1)}) scale(${comp.dir} 1)`);
    if (ui.hud) { const h = n.hud(j.x, s); if (h !== ui.hudTxt) { ui.hudTxt = h; ui.hud.innerHTML = h; } } // p. ej. las rayitas de señal
    if (oyendo) { const [fx, fy] = aPantalla(oyendo.pt.x, mundo.alto(oyendo.pt.x) - ALTO * .6); ui.mundo.style.transformOrigin = `${fx}px ${fy}px`; }
    for (const p of ui.puntos) {
      const pie = p.pt.suelo ?? mundo.alto(p.pt.x);
      const [ax, ay] = aPantalla(p.pt.x, pie - (p.pt.mira && !p.pt.figuras ? Math.max(120, (p.pt.alto || 60) + 60) : ALTO + 40));
      p.aviso.style.transform = `translate(${dentro(ax)}px, ${ay}px)`;
      if (p.brillo) { p.brillo.hidden = !!p.visto; const [gx, gy] = aPantalla(p.pt.x, pie - (p.pt.alto || 60)); p.brillo.style.translate = `${gx}px ${gy}px`; } // translate (no transform): el pulso de scale no debe escalar la posición
      if (p.voz) {
        /* Ya que se habló con alguien, no repite lo de antes (si acaso dice otra cosa: «despues») */
        const lineas = p.hecho ? Motor.val(p.pt.despues) : Motor.val(p.pt.ambiente);
        const claro = !!Motor.val(p.pt.claro);
        const cerca = Math.abs(j.x - p.pt.x) < (p.pt.oido || 560) && !pausa;
        const enfocado = oyendo === p;
        p.voz.hidden = !lineas || !lineas.length || !cerca || p.mostrandoDice || (oyendo && !enfocado);
        if (p.voz.hidden) continue;
        const i = Math.floor(t / (enfocado ? 2600 : 2900)) % lineas.length;
        p.voz.classList.toggle('murmullo', !claro && !enfocado);
        p.voz.classList.toggle('claro', enfocado);
        if (p.voz.dataset.i !== String(i)) { p.voz.dataset.i = i; p.voz.textContent = lineas[i]; }
        /* voz: 'acomp' = lo dice quien acompaña a Yare (sale sobre él); 'yare' = lo piensa ella */
        const de = Motor.val(p.pt.voz), vx = de === 'acomp' && comp ? comp.x : de === 'yare' ? j.x : p.pt.x + (p.pt.dxVoz || 0);
        const [bx, by] = aPantalla(vx, (de ? mundo.alto(vx) : pie) - ALTO - 30);
        p.voz.style.transform = `translate(${dentro(bx)}px, ${by}px)`;
        if (enfocado && p.ultimaLinea !== i) { p.ultimaLinea = i; window.Sonido?.murmullo(lineas[i]); }
      }
    }
  }

  /* ---------- Interacciones ---------- */
  function interactuar(p) {
    if (p.pt.mira && !p.pt.interaccion) { // cositas del entorno: Yare se acerca a mirarlas y piensa algo
      p.visto = true; window.Sonido?.efecto('mirar');
      if (p.pt.alMirar) p.pt.alMirar(s);
      quitarPose();
      /* se para a un lado de lo que mira (no encima) */
      const ancho = OBJETOS[p.pt.objeto]?.ancho || 0;
      if (ancho && Math.abs(p.pt.x - j.x) < ancho) j.meta = p.pt.x - ancho * (j.x <= p.pt.x ? 1 : -1);
      j.dir = p.pt.x >= (j.meta ?? j.x) ? 1 : -1; j.vx = 0; j.bloqueo = .7;
      ui.yareP.classList.remove('camina', 'sube');
      /* la pose según la altura de lo que mira: abajo se agacha, a media altura baja la cabeza, arriba la sube */
      const alto = p.pt.alto || 60;
      const pose = p.pt.pose || (alto <= 120 ? 'agacha' : alto < 200 ? 'mira' : alto >= 290 ? 'arriba' : null);
      if (pose) ui.yareP.classList.add('g-' + pose);
      ui.mirando = setTimeout(quitarPose, 3600);
      return decir({ pt: { x: j.x } }, [['yare', Motor.val(p.pt.mira)]], true, null, true);
    }
    const it = p.pt.interaccion;
    if (it.fin) return terminar();
    const ops = Motor.val(it.opciones || []).filter(o => o && (!o.si || o.si(s)));
    pausa = true; j.vx = 0; teclas.izq = teclas.der = false; ui.yareP.classList.remove('camina', 'sube');
    ui.puntos.forEach(q => { q.aviso.hidden = true; }); ui.usar.hidden = true;
    window.Sonido?.efecto('abrir');
    ui.eleccion.hidden = false;
    ui.eleccion.innerHTML = `${it.texto ? `<p>${Motor.formato(Motor.val(it.texto))}</p>` : ''}${ops.map((o, i) => `<button class="opcion"><span>${i + 1}</span>${Motor.formato(Motor.val(o.t))}</button>`).join('')}`;
    ui.eleccion.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', (e) => {
      e.stopPropagation();
      const o = ops[i];
      if (o.fx) o.fx(s);
      if (o.tej) s.tejido[o.tej[0]] = o.tej[1];
      Motor.hilo(o.hilo);
      window.Sonido?.efecto('elegir');
      ui.eleccion.hidden = true; pausa = false; p.hecho = true;
      decir(p, Motor.val(o.dice) || [], false, o.tras, true);
    }));
  }

  /* Lo que se dice va arriba, al centro, como en Ori: texto claro sobre una sombra difuminada (sin globos que
     se muevan con la cámara). Quien habla acompaña con el cuerpo. Si empieza otra cosa que decir, esta se calla.
     tras: lo que se ve que pasa después (alguien baja el celular, se va, deja algo…); ocurre cuando lo narra. */
  let turno = 0;
  /* fijo: lo que sale de interactuar con algo o alguien. Yare se queda quieta hasta que termina de escribirse
     (E, Enter o un toque lo completa); luego ya puede caminar mientras se lee. */
  async function decir(p, lineas, piensa = false, tras = null, fijo = false) {
    const yo = ++turno;
    el.panel.querySelector('.cw-intro')?.classList.add('fuera'); // que no se encime con el texto de arriba
    let hecho = false;
    const pasa = () => { if (!hecho && tras) { hecho = true; consecuencias(p, tras); } };
    p.mostrandoDice = true;
    quieta = fijo && lineas.length ? yo : 0;
    if (quieta) { j.vx = 0; teclas.oir = false; ui.yareP.classList.remove('camina', 'sube'); }
    const ultima = lineas.length - 1;
    for (const [i, [quien, texto]] of lineas.entries()) {
      if (yo !== turno || !activo) break;
      if (!quien) pasa();
      ui.ori.dataset.quien = quien || '';
      ui.ori.className = `cw-ori ${quien ? '' : 'narra'} ${piensa ? 'piensa' : ''}`;
      ui.ori.innerHTML = `${quien ? `<b>${Motor.NOMBRES[quien] || quien}</b>` : ''}<p>${Motor.formato(texto)}</p>`;
      void ui.ori.offsetWidth; ui.ori.classList.add('visible');
      const hablante = piensa ? null : quien === 'yare' ? ui.yare : quien && p.grupo ? [...p.grupo.querySelectorAll(':scope > .actor')].find(a => a.dataset.id === quien) || p.grupo.querySelector(':scope > .actor') : null;
      if (hablante) { hablante.classList.add('hablando'); Personajes.expresion(hablante, Personajes.caraDe(texto)); }
      /* el texto se va escribiendo (teclado si habla alguien; lápiz si se narra o Yare piensa). Va por reloj, no por
         cuadros: si el navegador se atrasa (por ejemplo al empezar a caminar), alcanza al sonido en vez de trabarse. */
      const parrafo = ui.ori.querySelector('p'), letras = [...texto.replace(/\*/g, '')];
      if (!reducido()) {
        parrafo.textContent = '';
        if (quien && !piensa) window.Sonido?.voz(quien, texto, 42); else window.Sonido?.narrar(texto, 42);
        let completo = false, k = 0;
        ui.adelantar = () => { completo = true; window.Sonido?.callar(); };
        const t0 = performance.now();
        while (k < letras.length && yo === turno && activo && !completo) {
          const nk = Math.min(letras.length, Math.floor((performance.now() - t0) / 24) + 1);
          if (nk !== k) { k = nk; parrafo.textContent = letras.slice(0, k).join(''); }
          await espera(16);
        }
        ui.adelantar = null;
        parrafo.innerHTML = Motor.formato(texto);
      }
      if (i === ultima && quieta === yo) quieta = 0; // ya se escribió todo: puede seguir caminando mientras lee
      await espera(Math.max(2000, texto.length * 48));
      if (hablante) hablante.classList.remove('hablando');
      if (yo !== turno || !activo) break;
      ui.ori.classList.remove('visible');
      await espera(320);
    }
    pasa();
    if (quieta === yo) quieta = 0;
    p.mostrandoDice = false;
  }

  function consecuencias(p, tras) {
    for (const [quien, accion, valor] of tras) {
      if (quien === 'svg') { p.grupo?.querySelector('.cw-svgpt')?.classList.add('fuera'); continue; }
      const actores = p.grupo ? [...p.grupo.querySelectorAll(':scope > .actor')] : [];
      const a = typeof quien === 'number' ? actores[quien] : actores.find(x => x.dataset.id === quien);
      if (!a) continue;
      const pj = a.querySelector('.pj');
      if (accion === 'baja') pj.classList.remove('pose-cel');
      if (accion === 'sale') irse(a, pj, valor || 1);
    }
  }
  /* Alguien se va caminando (y se pierde entre la gente) */
  function irse(a, pj, dir) {
    const m = (a.getAttribute('transform') || '').match(/translate\(([-\d.]+) ([-\d.]+)\)/); if (!m) return;
    let x = +m[1], t0 = performance.now(), recorrido = 0;
    const y = +m[2], v = ZBASE / .85 * dir;
    a.style.setProperty('--z', Z); a.style.setProperty('--paso', '.85s');
    pj.classList.remove('pose-cel', 'hablando'); pj.classList.add('camina');
    a.style.transition = 'opacity 1.6s 2s'; a.style.opacity = 0;
    const paso = (t) => {
      const dt = Math.min(.05, (t - t0) / 1000); t0 = t;
      x += v * dt; recorrido += Math.abs(v * dt);
      a.setAttribute('transform', `translate(${x.toFixed(1)} ${y}) scale(${dir} 1)`);
      if (recorrido < 760 && activo) requestAnimationFrame(paso); else a.remove();
    };
    requestAnimationFrame(paso);
  }

  function terminar() {
    if (!activo) return;
    activo = false;
    cancelAnimationFrame(raf);
    removeEventListener('keydown', abajo); removeEventListener('keyup', arriba);
    window.Sonido?.escuchar(false);
    if (n.alSalir) n.alSalir(s);
    listo();
  }

  /* Solo para las pruebas automáticas (no hay botón para saltarse el recorrido). */
  const _prueba = { x: () => j.x, quieta: () => !!quieta, pasantes: () => ui.pasantes.length, pasar: () => pasar(), irA: (x) => { j.x = x; j.y = mundo.alto(x); }, terminar: () => terminar(), oyendo: () => !!oyendo, comp: () => comp && { x: comp.x, dir: comp.dir } };

  return { iniciar, _prueba, detener: () => { if (activo) { activo = false; cancelAnimationFrame(raf); removeEventListener('keydown', abajo); removeEventListener('keyup', arriba); } } };
})();
