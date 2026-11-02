/* Hilo Rojo · escenarios vectoriales (SVG en capas) y personajes en silueta.
   Todo se dibuja con código: no hay imágenes externas. El lienzo mide 1600 × 900. */
const Escenarios = (() => {
  'use strict';
  const W = 1600, H = 900;

  /* Aleatorio con semilla: el mismo escenario siempre se dibuja igual. */
  function azar(semilla) {
    let a = semilla >>> 0;
    return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  }

  /* Cordillera suave: polígono desde la izquierda hasta la derecha y hasta el suelo. */
  function cerros(semilla, base, amp, n, color, opac = 1, cicla = false) {
    const r = azar(semilla);
    const pasos = Array.from({ length: n + 1 }, (_, i) => [i * W / n, base - r() * amp]);
    if (cicla) pasos[n][1] = pasos[0][1]; // el final empata con el inicio para repetirse sin brinco
    let d = `M0 ${H} L0 ${pasos[0][1]}`;
    for (let i = 1; i < pasos.length; i++) {
      const [x, y] = pasos[i], [px, py] = pasos[i - 1];
      d += ` Q${px + (x - px) / 2} ${Math.min(y, py) - amp * .15} ${x} ${y}`;
    }
    return `<path d="${d} L${W} ${H} Z" fill="${color}" opacity="${opac}"/>`;
  }

  /* Hilera de pinos triangulares sobre una línea. */
  function pinos(semilla, y, n, alto, color, x0 = 0, x1 = W) {
    const r = azar(semilla);
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = x0 + r() * (x1 - x0), h = alto * (.55 + r() * .6), w = h * (.32 + r() * .12);
      s += `<polygon points="${x - w / 2},${y} ${x},${y - h} ${x + w / 2},${y}" fill="${color}"/>`;
    }
    return s;
  }

  /* Árbol: tronco que se adelgaza, dos ramas y una copa de varias masas redondas; la parte de arriba de cada masa
     es un poco más clara, como si le diera la luz. Con `flor` le salen flores sueltas (las jacarandas). */
  function arbol(x, y, alto, color, semilla = 1, flor = null) {
    const r = azar(semilla), f = (n) => n.toFixed(1);
    const tr = Math.max(7, alto * .05), cy = y - alto * .7, rc = alto * .2;
    let s = `<path d="M${f(x - tr)} ${y} L${f(x - tr * .4)} ${f(y - alto * .62)} L${f(x + tr * .4)} ${f(y - alto * .62)} L${f(x + tr)} ${y}Z" fill="${color}"/>
      <path d="M${x} ${f(y - alto * .4)} Q${f(x - alto * .12)} ${f(y - alto * .5)} ${f(x - alto * .22)} ${f(y - alto * .62)} M${x} ${f(y - alto * .48)} Q${f(x + alto * .1)} ${f(y - alto * .58)} ${f(x + alto * .2)} ${f(y - alto * .7)}" stroke="${color}" stroke-width="${f(tr * .55)}" fill="none" stroke-linecap="round"/>`;
    const masas = Array.from({ length: 7 + Math.floor(r() * 3) }, (_, i) => {
      const a = i === 0 ? 0 : (i / 8) * Math.PI * 2 + r() * .6;
      return { cx: x + (i ? Math.cos(a) * rc * (1 + r() * .5) : 0), cy: cy + (i ? Math.sin(a) * rc * .55 : 0), rad: rc * (.55 + r() * .35) };
    }).sort((p, q) => q.cy - p.cy);
    s += masas.map(m => `<circle cx="${f(m.cx)}" cy="${f(m.cy)}" r="${f(m.rad)}" fill="${color}"/>`).join('');
    s += `<g fill="${claro(color, .07)}">${masas.map(m => `<circle cx="${f(m.cx - m.rad * .12)}" cy="${f(m.cy - m.rad * .26)}" r="${f(m.rad * .68)}"/>`).join('')}</g>`;
    if (flor) s += `<g fill="${flor}" opacity=".7">${Array.from({ length: 44 }, () => { const m = masas[Math.floor(r() * masas.length)], a = r() * Math.PI * 2, d = r() * m.rad * .85; return `<circle cx="${f(m.cx + Math.cos(a) * d)}" cy="${f(m.cy + Math.sin(a) * d)}" r="${f(rc * (.03 + r() * .045))}"/>`; }).join('')}</g>`;
    return s;
  }

  /* ---------- La plaza de Tepetlán (feria): casas, parroquia, kiosco y la rueda de la fortuna ---------- */
  /* Hilera de casas de pueblo: azotea con pretil, tinacos, ventanas (algunas con luz) y portales con arcos. */
  function casas(x0, x1, y, semilla, c, luz, alto = 1) {
    const r = azar(semilla), f = (n) => n.toFixed(0);
    let s = '', x = x0;
    while (x < x1) {
      const w = 150 + r() * 150, h = (120 + r() * 120) * alto, top = y - h, tono = r() < .5 ? c : claro(c, .05);
      s += `<rect x="${f(x)}" y="${f(top)}" width="${f(w)}" height="${f(h)}" fill="${tono}"/><rect x="${f(x - 4)}" y="${f(top - 8)}" width="${f(w + 8)}" height="10" fill="${oscuro(c, .14)}"/>`;
      if (r() < .55) { const tx = x + 20 + r() * (w - 70); s += `<rect x="${f(tx)}" y="${f(top - 40)}" width="30" height="28" rx="5" fill="${oscuro(c, .1)}"/><path d="M${f(tx + 4)} ${f(top - 12)} v6 M${f(tx + 26)} ${f(top - 12)} v6" stroke="${oscuro(c, .1)}" stroke-width="3"/>`; }
      if (r() < .25) s += `<path d="M${f(x + w - 30)} ${f(top - 8)} V${f(top - 60)} M${f(x + w - 44)} ${f(top - 50)} H${f(x + w - 16)} M${f(x + w - 40)} ${f(top - 40)} H${f(x + w - 20)}" stroke="${oscuro(c, .2)}" stroke-width="2"/>`;
      const n = Math.max(1, Math.floor((w - 20) / 70)), pisos = h > 170 ? 2 : 1;
      for (let p = 0; p < pisos; p++) for (let i = 0; i < n; i++) {
        const vx = x + (w - n * 70) / 2 + i * 70 + 20, vy = top + 26 + p * 70, prendida = r() < .4;
        s += `<rect x="${f(vx)}" y="${f(vy)}" width="30" height="40" rx="2" fill="${prendida ? luz : oscuro(c, .2)}" opacity="${prendida ? .8 : 1}"/><rect x="${f(vx - 4)}" y="${f(vy + 40)}" width="38" height="4" fill="${oscuro(c, .14)}"/>`;
      }
      if (r() < .4) { const k = Math.floor(w / 56); for (let i = 0; i < k; i++) { const ax = x + (w - k * 56) / 2 + i * 56 + 6; s += `<path d="M${f(ax)} ${y} V${f(y - 46)} a22 22 0 0 1 44 0 V${y}Z" fill="${oscuro(c, .24)}"/>`; } }
      else s += `<path d="M${f(x + w * .5 - 20)} ${y} V${f(y - 58)} a20 20 0 0 1 40 0 V${y}Z" fill="${oscuro(c, .24)}"/>`;
      x += w + (r() < .3 ? 14 : 0);
    }
    return s;
  }
  /* La parroquia: fachada con frontón y rosetón, dos campanarios con su cúpula y la cúpula grande atrás. */
  function parroquia(x, y, s, c, luz) {
    const k = (n) => (n * s).toFixed(1), o = oscuro(c, .12);
    const torre = (dx) => `<rect x="${x + dx * s - 32 * s}" y="${y - 400 * s}" width="${k(64)}" height="${k(400)}" fill="${c}"/><rect x="${x + dx * s - 38 * s}" y="${y - 404 * s}" width="${k(76)}" height="${k(10)}" fill="${o}"/>
      <path d="M${x + dx * s - 14 * s} ${y - 300 * s} V${y - 350 * s} a14 14 0 0 1 ${k(28)} 0 V${y - 300 * s}Z" fill="${luz}" opacity=".55"/><rect x="${x + dx * s - 38 * s}" y="${y - 296 * s}" width="${k(76)}" height="${k(8)}" fill="${o}"/>
      <path d="M${x + dx * s - 30 * s} ${y - 404 * s} Q${x + dx * s} ${y - 470 * s} ${x + dx * s + 30 * s} ${y - 404 * s}Z" fill="${o}"/><path d="M${x + dx * s} ${y - 452 * s} V${y - 490 * s} M${x + dx * s - 9 * s} ${y - 478 * s} H${x + dx * s + 9 * s}" stroke="${o}" stroke-width="${k(3)}"/>`;
    return `<path d="M${x - 120 * s} ${y - 250 * s} Q${x} ${y - 400 * s} ${x + 120 * s} ${y - 250 * s}Z" fill="${oscuro(c, .06)}"/><rect x="${x - 10 * s}" y="${y - 420 * s}" width="${k(20)}" height="${k(40)}" fill="${oscuro(c, .06)}"/>
      <rect x="${x - 110 * s}" y="${y - 280 * s}" width="${k(220)}" height="${k(280)}" fill="${claro(c, .04)}"/><path d="M${x - 118 * s} ${y - 278 * s} L${x} ${y - 350 * s} L${x + 118 * s} ${y - 278 * s}Z" fill="${c}"/>
      <circle cx="${x}" cy="${y - 300 * s}" r="${k(16)}" fill="${luz}" opacity=".5"/><path d="M${x - 34 * s} ${y} V${y - 120 * s} a34 34 0 0 1 ${k(68)} 0 V${y}Z" fill="${oscuro(c, .3)}"/>
      ${torre(-142)}${torre(142)}`;
  }
  /* El kiosco: base con escalones y barandal, columnas delgadas, techo de lámina curvo con su linternilla y foquitos. */
  function kiosco(x, y, s, c, luz) {
    const k = (n) => (n * s).toFixed(1), w = 170 * s, yb = y - 60 * s, yt = yb - 150 * s, o = oscuro(c, .14);
    const cols = [-.95, -.55, -.18, .18, .55, .95].map(t => `<rect x="${(x + t * w - 5 * s).toFixed(1)}" y="${yt.toFixed(1)}" width="${k(10)}" height="${k(150)}" fill="${c}"/>`).join('');
    const balaustres = Array.from({ length: Math.floor(2 * w / (16 * s)) }, (_, i) => `<rect x="${(x - w + 6 * s + i * 16 * s).toFixed(1)}" y="${(yb - 30 * s).toFixed(1)}" width="${k(5)}" height="${k(30)}" fill="${o}"/>`).join('');
    const focos = Array.from({ length: 9 }, (_, i) => `<circle cx="${(x - w + i * w / 4).toFixed(1)}" cy="${(yt + 4 * s).toFixed(1)}" r="${k(4)}" fill="#FFE3A3" class="foco" style="--r:${-(i % 4) * .5}s"/>`).join('');
    return `<ellipse cx="${x}" cy="${(yb - 70 * s).toFixed(1)}" rx="${(w * .95).toFixed(1)}" ry="${k(90)}" fill="${luz}" opacity=".16"/>
      <path d="M${x - w - 24 * s} ${y} L${x - w} ${yb} L${x + w} ${yb} L${x + w + 24 * s} ${y}Z" fill="${o}"/>
      <path d="M${x - 50 * s} ${y} v${k(-20)} h${k(100)} v${k(20)}Z M${x - 40 * s} ${y - 20 * s} v${k(-20)} h${k(80)} v${k(20)}Z" fill="${oscuro(c, .24)}"/>
      ${cols}${balaustres}<rect x="${x - w}" y="${(yb - 34 * s).toFixed(1)}" width="${(2 * w).toFixed(1)}" height="${k(6)}" fill="${c}"/>
      <rect x="${(x - w - 18 * s).toFixed(1)}" y="${(yt - 12 * s).toFixed(1)}" width="${(2 * w + 36 * s).toFixed(1)}" height="${k(14)}" fill="${c}"/>
      <path d="M${(x - w - 12 * s).toFixed(1)} ${(yt - 12 * s).toFixed(1)} Q${(x - w * .55).toFixed(1)} ${(yt - 40 * s).toFixed(1)} ${(x - 22 * s).toFixed(1)} ${(yt - 120 * s).toFixed(1)} L${(x + 22 * s).toFixed(1)} ${(yt - 120 * s).toFixed(1)} Q${(x + w * .55).toFixed(1)} ${(yt - 40 * s).toFixed(1)} ${(x + w + 12 * s).toFixed(1)} ${(yt - 12 * s).toFixed(1)}Z" fill="${o}"/>
      <path d="M${(x - w * .6).toFixed(1)} ${(yt - 30 * s).toFixed(1)} Q${(x - w * .3).toFixed(1)} ${(yt - 60 * s).toFixed(1)} ${(x - 12 * s).toFixed(1)} ${(yt - 112 * s).toFixed(1)}" stroke="${claro(c, .08)}" stroke-width="${k(3)}" fill="none" opacity=".7"/>
      <rect x="${(x - 16 * s).toFixed(1)}" y="${(yt - 150 * s).toFixed(1)}" width="${k(32)}" height="${k(32)}" fill="${c}"/><rect x="${(x - 7 * s).toFixed(1)}" y="${(yt - 144 * s).toFixed(1)}" width="${k(14)}" height="${k(18)}" fill="${luz}" opacity=".6"/>
      <path d="M${(x - 22 * s).toFixed(1)} ${(yt - 150 * s).toFixed(1)} Q${x} ${(yt - 184 * s).toFixed(1)} ${(x + 22 * s).toFixed(1)} ${(yt - 150 * s).toFixed(1)}Z" fill="${o}"/><path d="M${x} ${(yt - 176 * s).toFixed(1)} V${(yt - 200 * s).toFixed(1)}" stroke="${o}" stroke-width="${k(3)}"/>${focos}`;
  }
  /* La rueda de la fortuna: patas en A, rayos, canastillas y foquitos en el aro. Gira despacio (.gira). */
  function rueda(x, y, rad, c, luz) {
    const hub = y - rad - 30, f = (n) => n.toFixed(1);
    const rayos = Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<path d="M${x} ${f(hub)} L${f(x + Math.cos(a) * rad)} ${f(hub + Math.sin(a) * rad)}" stroke="${c}" stroke-width="3"/><rect x="${f(x + Math.cos(a) * rad - 11)}" y="${f(hub + Math.sin(a) * rad - 4)}" width="22" height="18" rx="4" fill="${c}"/><circle cx="${f(x + Math.cos(a + Math.PI / 12) * rad)}" cy="${f(hub + Math.sin(a + Math.PI / 12) * rad)}" r="4" fill="${luz}" class="foco" style="--r:${-(i % 4) * .6}s"/>`; }).join('');
    return `<path d="M${f(x - rad * .55)} ${y} L${x} ${f(hub)} L${f(x + rad * .55)} ${y} M${f(x - rad * .4)} ${y} L${x} ${f(hub)} L${f(x + rad * .4)} ${y}" stroke="${oscuro(c, .1)}" stroke-width="7" fill="none"/>
      <g class="gira" style="transform-origin:${x}px ${f(hub)}px"><circle cx="${x}" cy="${f(hub)}" r="${rad}" fill="none" stroke="${c}" stroke-width="5"/><circle cx="${x}" cy="${f(hub)}" r="${f(rad * .82)}" fill="none" stroke="${c}" stroke-width="2"/>${rayos}</g>
      <circle cx="${x}" cy="${f(hub)}" r="10" fill="${oscuro(c, .1)}"/>`;
  }

  function bruma(y, alto, color, opac = .35) {
    return `<rect x="-50" y="${y}" width="${W + 100}" height="${alto}" fill="url(#bruma-${color.replace('#', '')})" opacity="${opac}"/>`;
  }
  function defBruma(color) {
    return `<linearGradient id="bruma-${color.replace('#', '')}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity="0"/><stop offset=".5" stop-color="${color}" stop-opacity="1"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient>`;
  }
  function cielo(id, paradas) {
    return `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${paradas.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join('')}</linearGradient>`;
  }
  function estrellas(semilla, n, alto, color = '#FFE9D6') {
    const r = azar(semilla);
    return Array.from({ length: n }, () => `<circle cx="${r() * W}" cy="${r() * alto}" r="${.8 + r() * 1.8}" fill="${color}" opacity="${.3 + r() * .7}"/>`).join('');
  }
  function particulas(semilla, n, color, y0 = 300, y1 = 800) {
    const r = azar(semilla);
    return `<g class="particulas">${Array.from({ length: n }, (_, i) => `<circle class="p" style="--d:${6 + r() * 8}s;--r:${-r() * 8}s;--dx:${(r() - .5) * 60}px" cx="${r() * W}" cy="${y0 + r() * (y1 - y0)}" r="${1.5 + r() * 2.5}" fill="${color}"/>`).join('')}</g>`;
  }
  const capa = (prof, contenido, clase = '') => `<g class="capa ${clase}" data-prof="${prof}">${contenido}</g>`;

  /* ---------- Letreros: nada de «rectángulo con letras». Cada uno tiene material: placa atornillada, tabla
     pintada a mano, neón, lámina de la ruta o manta de tela. cx = centro, y = borde de arriba. ---------- */
  const { luz: claro, sombra: oscuro } = Personajes;
  const tornillo = (x, y) => `<circle cx="${x}" cy="${y}" r="3.2" fill="#C9BCC8"/><path d="M${x - 2} ${y - 1.6} L${x + 2} ${y + 1.6}" stroke="#5A4A5E" stroke-width="1.1"/>`;
  function letrero({ cx, y, w, h, texto, estilo = 'placa', fondo = '#4A3659', tinta = '#F5CDB8', size = 20, sub = '', espacio = 4, icono = '' }) {
    const x = cx - w / 2, fuente = `font-family="system-ui" font-weight="900" letter-spacing="${espacio}"`;
    const ty = y + h / 2 + size * .36 - (sub ? size * .28 : 0);
    const letras = (dx, dy, color, extra = '') => `<text x="${cx + dx}" y="${ty + dy}" text-anchor="middle" ${fuente} font-size="${size}" fill="${color}" ${extra}>${texto}</text>`;
    const subt = sub ? `<text x="${cx}" y="${ty + size * .82}" text-anchor="middle" font-family="system-ui" font-weight="700" letter-spacing="2" font-size="${Math.round(size * .42)}" fill="${tinta}" opacity=".7">${sub}</text>` : '';
    if (estilo === 'neon') return `<g>
      <rect x="${x + 5}" y="${y + 7}" width="${w}" height="${h}" rx="10" fill="#000" opacity=".3"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="#1E1428"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="none" stroke="#3A2C48" stroke-width="3"/>
      <rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="7" fill="none" stroke="${tinta}" stroke-width="2.5" opacity=".9" class="neon"/>
      <rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="7" fill="none" stroke="${tinta}" stroke-width="9" opacity=".14"/>
      ${icono}${letras(0, 0, tinta, 'stroke-width="7" stroke="' + tinta + '" opacity=".18"')}${letras(0, 0, '#F2FFFB', 'class="neon"')}${letras(0, 0, tinta, 'opacity=".55" class="neon"')}${subt}
      ${[x + 18, x + w - 18].map(px => `<path d="M${px} ${y} V${y - 40}" stroke="#1E1428" stroke-width="3"/>`).join('')}</g>`;
    if (estilo === 'pintado') {
      const tablas = Array.from({ length: Math.max(2, Math.round(h / 18)) }, (_, i) => `<path d="M${x + 4} ${y + (i + 1) * h / Math.max(2, Math.round(h / 18))} H${x + w - 4}" stroke="${oscuro(fondo, .25)}" stroke-width="1.5" opacity=".6"/>`).join('');
      return `<g><rect x="${x + 4}" y="${y + 6}" width="${w}" height="${h}" rx="3" fill="#000" opacity=".25"/>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${fondo}"/>${tablas}
        <rect x="${x + 6}" y="${y + 6}" width="${w - 12}" height="${h - 12}" rx="2" fill="none" stroke="${tinta}" stroke-width="2.5" stroke-dasharray="1 0" opacity=".85"/>
        <rect x="${x + 11}" y="${y + 11}" width="${w - 22}" height="${h - 22}" rx="1" fill="none" stroke="${tinta}" stroke-width="1" opacity=".5"/>
        ${[x + 22, x + w - 22].map(px => `<g transform="translate(${px} ${y + h / 2})" fill="${tinta}" opacity=".85">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="2.6" ry="5.5" cy="-5" transform="rotate(${a})"/>`).join('')}<circle r="2.4" fill="${fondo}"/></g>`).join('')}
        ${letras(2, 2, oscuro(fondo, .45))}${letras(0, 0, tinta)}${subt}
        <path d="M${x + w * .2} ${y + h} q4 10 1 18 M${x + w * .72} ${y + h} q-3 7 0 12" stroke="${oscuro(fondo, .4)}" stroke-width="2" opacity=".35" fill="none"/></g>`;
    }
    if (estilo === 'manta') {
      const ojillos = Array.from({ length: Math.max(2, Math.round(w / 90)) + 1 }, (_, i) => { const px = x + 8 + i * (w - 16) / Math.max(2, Math.round(w / 90)); return `<circle cx="${px}" cy="${y + 6}" r="3" fill="#D8CCD8" stroke="#3A2C48" stroke-width="1.2"/>`; }).join('');
      return `<g><path d="M${x} ${y} H${x + w} V${y + h} Q${cx} ${y + h + 10} ${x} ${y + h}Z" fill="${fondo}"/>
        <path d="M${x} ${y} H${x + w} V${y + 5} H${x}Z" fill="${claro(fondo, .2)}" opacity=".5"/>
        ${[.25, .5, .75].map(t => `<path d="M${x + w * t} ${y + 6} q${(t - .5) * 18} ${h * .4} 0 ${h - 4}" stroke="${oscuro(fondo, .3)}" stroke-width="2.5" opacity=".25" fill="none"/>`).join('')}
        ${ojillos}${letras(1.5, 1.5, oscuro(fondo, .5))}${letras(0, 0, tinta)}${subt}</g>`;
    }
    if (estilo === 'lamina') return `<g><rect x="${x + 4}" y="${y + 6}" width="${w}" height="${h}" rx="8" fill="#000" opacity=".25"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="8" fill="${fondo}"/><rect x="${x + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="5" fill="none" stroke="${tinta}" stroke-width="2.5"/>
      <path d="M${x + 8} ${y + 4} H${x + w - 8}" stroke="#fff" stroke-width="2" opacity=".2"/>${icono}${letras(0, 0, tinta)}${subt}
      ${tornillo(x + 10, y + h / 2)}${tornillo(x + w - 10, y + h / 2)}<path d="M${x + w * .3} ${y + h - 4} l3 12 M${x + w * .66} ${y + h - 6} l-2 9" stroke="#5A3A2A" stroke-width="2" opacity=".35"/></g>`;
    /* placa: concreto o metal atornillado, con letras en relieve y un poco de óxido */
    return `<g><rect x="${x + 5}" y="${y + 7}" width="${w}" height="${h}" rx="4" fill="#000" opacity=".22"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="${fondo}"/>
      <rect x="${x}" y="${y}" width="${w}" height="4" rx="2" fill="${claro(fondo, .3)}" opacity=".6"/><rect x="${x}" y="${y + h - 5}" width="${w}" height="5" rx="2" fill="${oscuro(fondo, .3)}"/>
      <rect x="${x + 7}" y="${y + 7}" width="${w - 14}" height="${h - 14}" rx="2" fill="none" stroke="${claro(fondo, .35)}" stroke-width="1.5" opacity=".6"/>
      ${icono}${letras(0, 2, oscuro(fondo, .5))}${letras(0, 0, tinta)}${subt}
      ${tornillo(x + 13, y + 13)}${tornillo(x + w - 13, y + 13)}${tornillo(x + 13, y + h - 13)}${tornillo(x + w - 13, y + h - 13)}
      <path d="M${x + 13} ${y + 17} v${Math.min(22, h - 30)} M${x + w - 13} ${y + 17} v${Math.min(14, h - 30)}" stroke="#8A5A3A" stroke-width="2" opacity=".28"/></g>`;
  }
  /* escudo de la prepa (para la placa de la entrada) */
  const escudo = (x, y, c = '#F5CDB8') => `<g transform="translate(${x} ${y})"><path d="M-14 -16 H14 V2 Q14 14 0 20 Q-14 14 -14 2Z" fill="none" stroke="${c}" stroke-width="2.5"/><path d="M-7 -6 h14 M0 -11 v20 M-7 6 q7 -6 14 0" stroke="${c}" stroke-width="2"/></g>`;
  /* cometa del ciber */
  const cometa = (x, y, c) => `<g transform="translate(${x} ${y})" class="neon"><circle r="7" fill="#F2FFFB"/><circle r="11" fill="${c}" opacity=".25"/><path d="M-8 -3 L-40 -16 M-8 0 L-44 0 M-8 3 L-40 14" stroke="${c}" stroke-width="2.5" stroke-linecap="round" opacity=".8"/></g>`;
  /* combi de la ruta (para la lámina de la parada) */
  const combiMini = (x, y, c = '#fff') => `<g transform="translate(${x} ${y})" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"><path d="M-16 6 V-6 Q-16 -10 -12 -10 H8 L16 -2 V6Z"/><path d="M-16 -2 H16 M-6 -10 V-2 M4 -10 V-2"/><circle cx="-9" cy="7" r="3" fill="${c}"/><circle cx="9" cy="7" r="3" fill="${c}"/></g>`;

  /* ---------- Vida: lo que se mueve en cada lugar (para que las pláticas no se sientan desiertas) ----------
     cruza: alguien que pasa caminando de un lado a otro. pausa = cruza y luego tarda en volver a pasar
     (en primer plano, para que no distraiga). El paso dura lo que tarda en avanzar una zancada (no patina). */
  const ZANCADA_Z = 198 / .85;
  function cruza({ semilla, y, esc, dur, r = 0, izq = false, pausa = false, z = .7, cel = false }) {
    const vel = (W + 600) / (dur * (pausa ? .45 : 1));
    const paso = Math.min(1.4, Math.max(.7, ZANCADA_Z * esc * z / vel)).toFixed(2);
    return `<g class="cruza ${pausa ? 'pausa' : ''}" style="--dur:${dur}s;--r:${r}s;--de:${izq ? W + 300 : -300}px;--a:${izq ? -300 : W + 300}px"><g transform="translate(0 ${y}) scale(${(izq ? -esc : esc).toFixed(2)} ${esc.toFixed(2)})" style="--z:${z};--paso:${paso}s">${Personajes.dibujar('gente', { semilla, cel }).replace('class="pj ', 'class="pj camina ')}</g></g>`;
  }
  /* un bicho que pasa rápido, zigzagueando (de noche, una palomilla; de día, una mosca) */
  const bicho = (dur, r, y, esc = 1) => `<g class="bicho" style="--dur:${dur}s;--r:${r}s;--y:${y}px"><g transform="scale(${esc})"><ellipse rx="10" ry="4.5"/><ellipse class="ala" cx="-2" cy="-6" rx="9" ry="6" opacity=".75"/></g></g>`;
  /* palomillas dando vueltas alrededor de una luz */
  const palomillas = (x, y, n = 3) => `<g transform="translate(${x} ${y})" fill="#E9D9C9">${Array.from({ length: n }, (_, i) => `<circle class="palomilla" cx="${16 + i * 9}" cy="0" r="${2 + (i % 2) * .6}" style="--d:${(1.1 + i * .37).toFixed(2)}s;--r:${-i * .4}s" opacity=".75"/>`).join('')}</g>`;
  const pajaros = (y, dur, r) => `<g class="cruza" style="--dur:${dur}s;--r:${r}s;--de:-200px;--a:${W + 200}px"><g transform="translate(0 ${y})" stroke="#3A2840" stroke-width="2.5" fill="none" stroke-linecap="round" opacity=".7"><path class="aleteo" d="M-10 0 q5 -6 10 0 q5 -6 10 0"/><path class="aleteo" d="M14 10 q4 -5 8 0 q4 -5 8 0" style="--r:-.2s"/><path class="aleteo" d="M-28 8 q4 -5 8 0 q4 -5 8 0" style="--r:-.35s"/></g></g>`;
  const vapor = (x, y) => `<g fill="none" stroke="#F4E6D8" stroke-width="5" stroke-linecap="round" opacity=".5">${[0, 1, 2].map(i => `<path class="vapor" d="M${x + (i - 1) * 14} ${y} q-10 -22 0 -44 q10 -22 0 -44" style="--r:${-i * 1.1}s"/>`).join('')}</g>`;
  const reloj = (x, y, r = 30) => `<g><circle cx="${x}" cy="${y}" r="${r}" fill="#EFE3D3" opacity=".85"/><circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#3A2840" stroke-width="4"/>
    <path d="M${x} ${y} L${x} ${y - r * .55}" stroke="#3A2840" stroke-width="4" stroke-linecap="round" class="manecilla lenta" style="transform-origin:${x}px ${y}px"/>
    <path d="M${x} ${y} L${x} ${y - r * .8}" stroke="#C24A5A" stroke-width="1.6" class="manecilla" style="transform-origin:${x}px ${y}px"/></g>`;
  /* primer plano: cosas desenfocadas entre la cámara y los personajes */
  const zacate = (x, n, lado = 1) => Array.from({ length: n }, (_, i) => { const bx = x + i * 16 * lado, h = 90 + ((i * 37) % 80), c = ((i * 29) % 50 - 25); return `<path class="mece" style="--r:${-i * .3}s;transform-origin:${bx}px ${H}px" d="M${bx} ${H + 10} Q${bx + c * .4} ${H - h * .6} ${bx + c} ${H - h} Q${bx + c * .3 + 6} ${H - h * .5} ${bx + 10} ${H + 10}Z"/>`; }).join('');
  const rama = (x, y, l, lado = 1) => `<g class="mece lenta" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y} C${x + l * .3 * lado} ${y + 60} ${x + l * .6 * lado} ${y + 50} ${x + l * lado} ${y + 110}" stroke="#000" stroke-width="16" fill="none" stroke-linecap="round"/>${Array.from({ length: 6 }, (_, i) => `<ellipse cx="${x + l * (.25 + i * .13) * lado}" cy="${y + 60 + (i % 3) * 22}" rx="${46 + (i % 3) * 12}" ry="${26 + (i % 2) * 10}"/>`).join('')}</g>`;
  const marco = (x, ancho) => `<rect x="${x < W / 2 ? x - 90 : x}" y="-20" width="${ancho + 90}" height="${H + 40}"/><rect x="${x + (x < W / 2 ? ancho - 14 : 0)}" y="-20" width="14" height="${H + 40}" opacity=".6"/>`;
  const gato = (dur, r) => `<g class="cruza pausa" style="--dur:${dur}s;--r:${r}s;--de:-160px;--a:${W + 160}px"><g transform="translate(0 ${H - 6})"><path d="M-46 -18 q-4 -26 20 -30 l40 -2 q12 -14 18 -4 l6 -10 l4 14 q6 10 -2 20 l-6 12 h-10 l-2 -10 l-34 0 l-4 10 h-10z"/><path class="cola" d="M-44 -26 q-30 -10 -26 -42" stroke="#000" stroke-width="7" fill="none" stroke-linecap="round" style="transform-origin:-44px -26px"/></g></g>`;
  /* lo que pasa rápido junto a la ventana de la combi: postes, magueyes, una cerca */
  const orillaCarretera = () => { const una = `<rect x="240" y="-20" width="30" height="${H + 40}"/><rect x="180" y="80" width="150" height="14"/>
      <g transform="translate(980 ${H})">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${i * 18 - 50} 0 L${i * 18 - 50 + (i - 2.5) * 22} ${-70 - (i % 3) * 24} L${i * 18 - 42} 0Z"/>`).join('')}</g>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${1200 + i * 80}" y="${H - 110}" width="11" height="120"/>`).join('')}<path d="M1200 ${H - 92} H1530 M1200 ${H - 58} H1530" stroke="#000" stroke-width="3"/>`;
    return `<g class="desliza" style="--v:3.6s">${una}<g transform="translate(${W} 0)">${una}</g></g>`; };

  /* ---------- Escenarios ---------- */
  const E = {};

  /* El Encinal de noche: bruma violeta, encinos y la casa de la abuela. */
  E.encinal = () => ({
    suelo: 800, silueta: '#1F1529', luz: '#F6C177',
    defs: cielo('c-enc', [[0, '#231A36'], [.45, '#4E3657'], [.8, '#8F6274'], [1, '#C79186']]) + defBruma('#B88A99') + defBruma('#6E4C6E'),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-enc)"/>
      ${capa(.005, estrellas(3, 70, 380) + `<circle cx="1250" cy="150" r="46" fill="#FBE3D3"/><circle cx="1272" cy="138" r="44" fill="#2A1F3C"/>`)}
      ${capa(.012, cerros(11, 470, 90, 9, '#6D4C6E', .7) + bruma(420, 140, '#B88A99', .35))}
      ${capa(.02, cerros(12, 560, 70, 12, '#553B5D') + pinos(5, 575, 70, 120, '#4D3556') + bruma(520, 120, '#B88A99', .25))}
      ${capa(.035, cerros(13, 650, 50, 8, '#3E2B4A') + arbol(180, 690, 330, '#35253F', 4) + arbol(1430, 700, 380, '#35253F', 9) + pinos(8, 690, 18, 150, '#35253F', 300, 1300))}
      ${capa(.05, `
        <rect x="1010" y="560" width="290" height="190" fill="#2C1F37"/>
        <polygon points="990,565 1155,480 1320,565" fill="#261A30"/>
        <rect x="1060" y="610" width="70" height="60" fill="#F6C177" class="ventana-luz"/>
        <rect x="1094" y="610" width="3" height="60" fill="#2C1F37"/><rect x="1060" y="638" width="70" height="3" fill="#2C1F37"/>
        <rect x="1190" y="640" width="60" height="110" fill="#1F1529"/>
        <circle cx="1095" cy="640" r="120" fill="url(#halo)" opacity=".35"/>
        <rect x="330" y="410" width="10" height="360" fill="#2C1F37"/><rect x="300" y="430" width="70" height="6" fill="#2C1F37"/>
        <path d="M335 432 Q 700 520 1060 560" stroke="#2C1F37" stroke-width="2" fill="none"/>
        <rect x="760" y="700" width="140" height="50" fill="#2C1F37"/><rect x="770" y="690" width="120" height="14" fill="#35253F"/>
      `)}
      ${capa(.07, `<path d="M0 760 Q 400 735 800 760 T 1600 750 V900 H0Z" fill="#241A30"/>` + bruma(700, 160, '#6E4C6E', .5))}
      ${particulas(21, 22, '#F9D58A', 520, 780)}`,
    extra: `<radialGradient id="halo"><stop offset="0" stop-color="#F6C177"/><stop offset="1" stop-color="#F6C177" stop-opacity="0"/></radialGradient>`
  });

  /* Cocina de la abuela, de noche: foco colgante, ventana y la mesa. */
  E.cocina = () => ({
    suelo: 830, silueta: '#1C1325', luz: '#F6C177',
    defs: cielo('c-coc', [[0, '#2A1E33'], [1, '#4A3349']]) + cielo('c-ven', [[0, '#2C2142'], [1, '#7A5470']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-coc)"/>
      ${capa(.01, `
        <rect x="180" y="200" width="300" height="230" fill="url(#c-ven)"/>
        <path d="M180 430 L180 362 Q 240 330 300 360 T 420 348 Q 450 340 480 352 L480 430Z" fill="#4A3352"/><circle cx="420" cy="250" r="14" fill="#FBE3D3" opacity=".8"/>
        <rect x="180" y="200" width="300" height="230" fill="none" stroke="#3A2840" stroke-width="16"/>
        <rect x="325" y="200" width="10" height="230" fill="#3A2840"/>
        <rect x="1180" y="230" width="230" height="16" fill="#3A2840"/>
        <rect x="1195" y="196" width="34" height="34" rx="6" fill="#5A3E55"/><rect x="1245" y="186" width="30" height="44" rx="6" fill="#6B4A62"/><rect x="1290" y="200" width="40" height="30" rx="6" fill="#5A3E55"/>
        <rect x="1360" y="300" width="110" height="140" fill="#E8D5C4" opacity=".85"/><rect x="1360" y="300" width="110" height="26" fill="#C9483E"/>
        <text x="1415" y="319" font-size="16" text-anchor="middle" fill="#fff" font-family="system-ui" font-weight="700">OCTUBRE</text>
        <g fill="#7A5A6E">${Array.from({ length: 20 }, (_, i) => `<rect x="${1370 + (i % 5) * 19}" y="${340 + Math.floor(i / 5) * 22}" width="12" height="12"/>`).join('')}</g>
      `)}
      ${capa(.02, `
        <line x1="800" y1="0" x2="800" y2="250" stroke="#1A1220" stroke-width="3"/>
        <circle cx="800" cy="300" r="420" fill="url(#halo)" opacity=".45"/>
        <path d="M776 250 h48 l-10 34 h-28z" fill="#1A1220"/><circle cx="800" cy="296" r="16" fill="#FFE2A8"/>
      `)}
      ${capa(.04, `<rect x="0" y="760" width="${W}" height="140" fill="#22172B"/>`)}`,
    frente: `
      <rect x="250" y="700" width="1100" height="34" rx="6" fill="#1A1220"/>
      <rect x="290" y="734" width="22" height="170" fill="#1A1220"/><rect x="1290" y="734" width="22" height="170" fill="#1A1220"/>
      <rect x="640" y="672" width="170" height="28" rx="3" fill="#3B6EA8" transform="rotate(-4 725 686)"/>
      <rect x="648" y="676" width="150" height="20" rx="2" fill="#2D5687" transform="rotate(-4 725 686)"/>
      <rect x="930" y="640" width="26" height="60" rx="5" fill="#4A1C24"/><rect x="975" y="645" width="26" height="55" rx="5" fill="#4A1C24"/>
      <path d="M1110 700 L1104 660 Q1150 652 1196 660 L1190 700Z" fill="#5A3A3A"/><rect x="1098" y="654" width="104" height="10" rx="4" fill="#6B4848"/><rect x="1088" y="664" width="14" height="6" rx="3" fill="#5A3A3A"/><rect x="1198" y="664" width="14" height="6" rx="3" fill="#5A3A3A"/>
      ${vapor(1150, 646)}`,
    extra: `<radialGradient id="halo"><stop offset="0" stop-color="#F6C177"/><stop offset="1" stop-color="#F6C177" stop-opacity="0"/></radialGradient>`
  });

  /* Carretera al amanecer (o atardecer): cerros que pasan, la combi en primer plano. */
  E.combi = (atardecer = false) => {
    const c = atardecer
      ? { cielo: [[0, '#3A2552'], [.5, '#B05A78'], [1, '#F0A27E']], sol: '#FFD9B8', c1: '#9E5874', c2: '#7A4366', c3: '#5A3256', suelo: '#331F3D' }
      : { cielo: [[0, '#6B3D66'], [.55, '#D9757F'], [1, '#F7B79D']], sol: '#FDE6D4', c1: '#C86C7E', c2: '#A95A74', c3: '#7E4568', suelo: '#4B2B4E' };
    const lazo = (prof, vel, cont) => `<g class="capa" data-prof="${prof}"><g class="desliza" style="--v:${vel}s">${cont}<g transform="translate(${W} 0)">${cont}</g></g></g>`;
    return {
      suelo: 860, silueta: '#2A1830', luz: c.sol,
      defs: cielo('c-com', c.cielo),
      fondo: `
        <rect width="${W}" height="${H}" fill="url(#c-com)"/>
        ${capa(.004, `<circle cx="${atardecer ? 420 : 1100}" cy="520" r="170" fill="${c.sol}" opacity=".9"/>
          <rect x="0" y="300" width="900" height="10" rx="5" fill="${c.sol}" opacity=".18"/><rect x="600" y="380" width="1100" height="8" rx="4" fill="${c.sol}" opacity=".14"/>`)}
        ${atardecer ? capa(.003, estrellas(77, 30, 260)) : ''}
        ${lazo(.01, 90, cerros(41, 600, 80, 10, c.c1, .8, true))}
        ${lazo(.02, 50, cerros(42, 660, 70, 12, c.c2, 1, true) + pinos(43, 690, 30, 110, c.c2, 80, W - 80))}
        ${lazo(.03, 22, cerros(44, 740, 40, 8, c.c3, 1, true) + arbol(300, 760, 230, c.c3, 2) + arbol(1100, 770, 280, c.c3, 7) + pinos(45, 770, 10, 160, c.c3, 80, W - 80))}
        ${lazo(.05, 6, `<rect x="0" y="790" width="${W}" height="110" fill="${c.suelo}"/>` + Array.from({ length: 8 }, (_, i) => `<rect x="${i * 200 + 40}" y="842" width="90" height="6" rx="3" fill="${c.sol}" opacity=".35"/>`).join(''))}`,
      /* La combi de la ruta: lámina de dos colores, raspones, parrilla con costales amarrados, letrero de la ruta en el
         parabrisas, espejo, placas, rines con birlos y lodo de la terracería. Se mece sola (combi-cuerpo). */
      frente: `
        <g class="combi-cuerpo">
          <g transform="translate(640 584)"><rect x="0" y="0" width="330" height="8" rx="3" fill="#2A1E2E"/>${[20, 110, 200, 290].map(x => `<rect x="${x}" y="-10" width="6" height="14" fill="#2A1E2E"/>`).join('')}
            <path d="M24 -2 q-4 -30 30 -34 l70 -2 q22 4 20 36z" fill="#B49A7A"/><path d="M40 -30 q30 10 80 -2" stroke="#8A7458" stroke-width="2" fill="none"/>
            <path d="M160 -2 q0 -24 22 -26 l60 0 q18 2 16 28z" fill="#7E8C6A"/><rect x="236" y="-22" width="54" height="20" rx="4" fill="#5E86A0"/>
            <path d="M20 -6 L120 -36 L250 -26 L300 -6" stroke="#E8DCC8" stroke-width="2" fill="none" opacity=".8"/></g>
          <path d="M560 800 V650 Q560 610 600 606 L990 600 Q1040 600 1070 640 L1120 720 V800 Z" fill="#EDE3E6"/>
          <path d="M560 744 H1116 V800 H560Z" fill="#3C7A8C"/><path d="M560 740 H1114 V746 H560Z" fill="#C24A5A"/>
          <path d="M560 790 H1120 V800 H560Z" fill="#2E5E6C"/>
          <path d="M560 772 q60 -10 120 4 q40 8 90 -2 q80 -12 160 4 q60 10 120 -4 q40 -6 70 2 V800 H560Z" fill="#6E5A50" opacity=".35"/>
          <g fill="#2A2034"><rect x="596" y="626" width="128" height="78" rx="10"/><rect x="731" y="626" width="128" height="78" rx="10"/><rect x="866" y="626" width="118" height="78" rx="10"/><path d="M991 626 H1042 L1090 704 H991Z"/></g>
          <g fill="#3A2B44" opacity=".9"><rect x="600" y="630" width="120" height="70" rx="8"/><rect x="735" y="630" width="120" height="70" rx="8"/><rect x="870" y="630" width="110" height="70" rx="8"/><path d="M995 630 H1040 L1085 700 H995Z"/></g>
          <g fill="#fff" opacity=".1"><path d="M604 634 l40 0 l-30 62 l-10 0z"/><path d="M739 634 l26 0 l-30 62 l-6 0z"/><path d="M999 634 l18 0 l30 62 l-48 0z"/></g>
          <g fill="#2A1830"><circle cx="660" cy="672" r="20"/><path d="M640 700 q20 -24 40 0z"/><circle cx="795" cy="676" r="17"/><path d="M778 700 q17 -21 34 0z"/><circle cx="912" cy="668" r="19"/><path d="M893 700 q19 -24 38 0z"/></g>
          <rect x="1004" y="664" width="58" height="26" rx="3" fill="#F4EEE4" transform="rotate(-2 1033 677)"/><text x="1033" y="682" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="12" fill="#9B2C3A" transform="rotate(-2 1033 677)">ENCINAL</text>
          <path d="M735 710 V790 M859 710 V790" stroke="#C9BCC4" stroke-width="2"/><rect x="842" y="716" width="12" height="5" rx="2" fill="#8A7E88"/>
          <path d="M1092 650 l18 -8 v22 l-14 4z" fill="#2A1E2E"/><rect x="1090" y="664" width="6" height="16" fill="#2A1E2E"/>
          <rect x="1094" y="732" width="26" height="14" rx="3" fill="#FFE08A"/><rect x="1094" y="732" width="26" height="14" rx="3" fill="#fff" opacity=".35" class="neon"/><rect x="1112" y="750" width="10" height="8" rx="2" fill="#E8A040"/>
          <rect x="556" y="700" width="10" height="26" rx="3" fill="#B03040"/>
          <path d="M1108 784 H1128 V798 H1104Z" fill="#8A8492"/><path d="M552 784 H572 V798 H548Z" fill="#8A8492"/>
          <rect x="574" y="756" width="70" height="22" rx="3" fill="#F2F0E8"/><text x="609" y="772" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="13" fill="#2A3E6A">TLX-41-27</text>
          <g fill="#7A4A3A" opacity=".4"><circle cx="702" cy="726" r="4"/><circle cx="709" cy="731" r="2.5"/><circle cx="1066" cy="760" r="5"/></g>
          <path d="M920 724 q14 -4 28 2" stroke="#B9AEB6" stroke-width="2" fill="none" opacity=".8"/>
          <text x="850" y="770" text-anchor="middle" fill="#EDE3E6" font-family="system-ui" font-weight="800" font-size="19" letter-spacing="3">EL ENCINAL · TEPETLÁN</text>
          <text x="925" y="728" text-anchor="middle" fill="#9B2C3A" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="17" opacity=".85">La Consentida</text>
          <g fill="#3A2B3A"><path d="M610 806 a50 50 0 0 1 100 0z"/><path d="M980 806 a50 50 0 0 1 100 0z"/></g>
          <g fill="#1E1424"><circle cx="660" cy="806" r="34"/><circle cx="1030" cy="806" r="34"/></g>
          <g fill="#8C8494"><circle cx="660" cy="806" r="15"/><circle cx="1030" cy="806" r="15"/></g>
          <g fill="#4A4250">${[0, 72, 144, 216, 288].map(a => `<circle cx="${660 + 8 * Math.cos(a * Math.PI / 180)}" cy="${806 + 8 * Math.sin(a * Math.PI / 180)}" r="2"/><circle cx="${1030 + 8 * Math.cos(a * Math.PI / 180)}" cy="${806 + 8 * Math.sin(a * Math.PI / 180)}" r="2"/>`).join('')}</g>
          <path d="M572 790 q-14 4 -24 -2" stroke="#2A1E2E" stroke-width="5" fill="none"/>
        </g>`
    };
  };

  /* La prepa en Tepetlán: mañana lila, jacarandas y el edificio. */
  E.prepa = () => ({
    suelo: 820, silueta: '#2E2140', luz: '#FBE3D3',
    defs: cielo('c-pre', [[0, '#9C86B9'], [.6, '#D9A9B5'], [1, '#F5CDB8']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-pre)"/>
      ${capa(.008, `<circle cx="300" cy="200" r="80" fill="#FFF1E4" opacity=".75"/>` + cerros(51, 500, 90, 9, '#B28CB0', .6))}
      ${capa(.018, cerros(52, 560, 50, 10, '#9775A0', .8) + pinos(53, 575, 25, 70, '#8A6896'))}
      ${capa(.03, `
        <rect x="380" y="430" width="860" height="330" fill="#6F5583"/>
        <rect x="360" y="415" width="900" height="24" fill="#5D466F"/>
        <g fill="#F2D7C9" opacity=".75">${Array.from({ length: 16 }, (_, i) => `<rect x="${420 + (i % 8) * 102}" y="${470 + Math.floor(i / 8) * 110}" width="64" height="70" rx="3"/>`).join('')}</g>
        <rect x="740" y="640" width="140" height="120" fill="#4A3659"/>
        ${letrero({ cx: 810, y: 424, w: 560, h: 58, texto: 'PREPARATORIA LÁZARO CÁRDENAS', sub: 'TEPETLÁN, TLAX. · TURNO MATUTINO', size: 18, espacio: 3, fondo: '#4A3659', icono: escudo(562, 453) })}
        <rect x="1330" y="330" width="6" height="430" fill="#4A3659"/><path d="M1336 336 h80 l-10 24 l10 24 h-80z" fill="#C24A5A" class="bandera" style="transform-origin:1336px 360px"/>
      `)}
      ${capa(.045, arbol(220, 790, 330, '#7E5C9B', 3, '#B79AD8') + arbol(1440, 790, 300, '#7E5C9B', 6, '#B79AD8') + `
        <rect x="0" y="740" width="${W}" height="40" fill="#5B4570"/><rect x="0" y="736" width="${W}" height="8" fill="#6C5482"/>
        ${Array.from({ length: 30 }, (_, i) => `<rect x="${i * 56}" y="700" width="6" height="40" fill="#5B4570"/>`).join('')}`)}
      ${capa(.06, `<rect x="0" y="780" width="${W}" height="120" fill="#4C3961"/>` + Array.from({ length: 7 }, (_, i) => {
        const x = 180 + i * 210 + (i % 2) * 40; return `<g fill="#5E4775" opacity=".9"><circle cx="${x}" cy="${712 - (i % 3) * 6}" r="12"/><rect x="${x - 13}" y="${724 - (i % 3) * 6}" width="26" height="56" rx="10"/></g>`;
      }).join(''))}
      ${particulas(61, 14, '#C9A6E8', 300, 780)}`
  });

  /* Calle de Tepetlán al atardecer: tiendas, cables y la parada de la combi. */
  E.calle = () => ({
    suelo: 830, silueta: '#24172E', luz: '#FFC98A',
    defs: cielo('c-cal', [[0, '#3E2856'], [.55, '#C96E78'], [1, '#F7BE8E']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-cal)"/>
      ${capa(.006, `<circle cx="820" cy="560" r="150" fill="#FFE3C2" opacity=".85"/>` + cerros(71, 600, 80, 8, '#A15C78', .75))}
      ${capa(.025, `
        <g fill="#5A3560">
          <rect x="0" y="470" width="280" height="330"/><rect x="290" y="520" width="240" height="280"/><rect x="540" y="450" width="300" height="350"/>
          <rect x="850" y="500" width="260" height="300"/><rect x="1120" y="440" width="230" height="360"/><rect x="1360" y="510" width="260" height="290"/>
        </g>
        <g fill="#FFD9A0" opacity=".8"><rect x="40" y="520" width="50" height="60"/><rect x="150" y="520" width="50" height="60"/><rect x="600" y="500" width="60" height="70"/><rect x="900" y="560" width="50" height="60"/><rect x="1180" y="500" width="50" height="60"/><rect x="1420" y="560" width="50" height="60"/></g>
        ${letrero({ cx: 690, y: 612, w: 290, h: 62, texto: 'CIBER EL COMETA', sub: 'INTERNET · COPIAS · IMPRESIONES', estilo: 'neon', tinta: '#7FF0D8', size: 21, espacio: 2 })}${cometa(842, 606, '#7FF0D8')}
        ${letrero({ cx: 1235, y: 626, w: 270, h: 58, texto: 'ABARROTES LA GÜERA', sub: 'RECARGAS · FRUTA · HIELO', estilo: 'pintado', fondo: '#E9D9C9', tinta: '#9B2C3A', size: 15, espacio: 1 })}
        <path d="M0 400 Q 400 460 800 420 T 1600 430" stroke="#2A1A33" stroke-width="3" fill="none"/><path d="M0 430 Q 500 490 900 450 T 1600 470" stroke="#2A1A33" stroke-width="2" fill="none"/>
      `)}
      ${capa(.05, `
        <rect x="0" y="790" width="${W}" height="110" fill="#2E1E38"/><rect x="0" y="782" width="${W}" height="10" fill="#45304F"/>
        <rect x="1470" y="560" width="8" height="230" fill="#1E1426"/>${letrero({ cx: 1474, y: 548, w: 136, h: 86, texto: 'EL ENCINAL', sub: 'RUTA 14 · PARADA', estilo: 'lamina', fondo: '#2F6E7E', tinta: '#fff', size: 15, espacio: 1, icono: combiMini(1474, 568) })}
        <rect x="150" y="520" width="7" height="270" fill="#1E1426"/><path d="M153 522 q30 -14 60 0" stroke="#1E1426" stroke-width="7" fill="none"/><circle cx="214" cy="530" r="9" fill="#FFE3B0"/>
      `)}
      ${particulas(81, 10, '#FFD9A0', 500, 780)}`
  });

  /* Dentro del Ciber El Cometa: tubos fluorescentes y monitores. */
  E.ciber = () => ({
    suelo: 840, silueta: '#060B10', luz: '#9FF2E2',
    defs: cielo('c-cib', [[0, '#14212B'], [1, '#253A48']]) + `<radialGradient id="pant"><stop offset="0" stop-color="#9FF2E2" stop-opacity=".55"/><stop offset="1" stop-color="#9FF2E2" stop-opacity="0"/></radialGradient>`,
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-cib)"/>
      ${capa(.01, `
        <rect x="200" y="70" width="420" height="10" rx="5" fill="#DFFBF5" class="tubo"/><rect x="900" y="70" width="420" height="10" rx="5" fill="#DFFBF5" class="tubo t2"/>
        <rect x="160" y="80" width="500" height="260" fill="#DFFBF5" opacity=".05"/>
        <rect x="120" y="270" width="150" height="150" fill="#E7D36E" opacity=".85"/><text x="195" y="330" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="30" fill="#3A2A12">COPIAS</text><text x="195" y="380" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="40" fill="#3A2A12">$2</text>
        <rect x="300" y="290" width="150" height="100" fill="#E66A7A" opacity=".85"/><text x="375" y="348" text-anchor="middle" font-family="system-ui" font-weight="900" font-size="24" fill="#fff">RECARGAS</text>
        <g fill="#E8E2C8" opacity=".75">${[[110, 264], [258, 264], [290, 284], [438, 284], [1370, 264], [1498, 264]].map(([tx, ty]) => `<rect x="${tx}" y="${ty}" width="22" height="9" transform="rotate(${tx % 3 ? 12 : -10} ${tx + 11} ${ty + 4})"/>`).join('')}</g><rect x="1380" y="270" width="130" height="150" fill="#BFD7E6" opacity=".7"/><text x="1445" y="330" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="18" fill="#21333F">WIFI</text><text x="1445" y="360" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="16" fill="#21333F">$10 HORA</text>
      `)}
      ${capa(.03, `
        <rect x="0" y="560" width="${W}" height="24" fill="#0F1A22"/>
        ${[160, 420, 680].map((x, i) => `<g><circle cx="${x + 100}" cy="490" r="150" fill="url(#pant)"/>
          <rect x="${x}" y="420" width="200" height="130" rx="8" fill="#0B141A"/><rect x="${x + 10}" y="430" width="180" height="108" rx="4" fill="${i === 1 ? '#3D5868' : '#8FE0D2'}" opacity="${i === 1 ? 1 : .85}"/>
          <rect x="${x + 90}" y="550" width="20" height="14" fill="#0B141A"/><text x="${x + 100}" y="${610}" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="20" fill="#5D8FA0">${i + 2}</text></g>`).join('')}
        <rect x="0" y="584" width="${W}" height="320" fill="#182A35"/>
      `)}`,
    frente: `
      <rect x="880" y="660" width="720" height="240" fill="#0E171E"/><rect x="870" y="645" width="740" height="22" rx="4" fill="#22394A"/>
      <rect x="1200" y="580" width="90" height="66" rx="6" fill="#0B141A"/><rect x="1208" y="586" width="74" height="48" rx="3" fill="#7FD8C9" opacity=".75"/>
      <rect x="930" y="612" width="120" height="34" rx="4" fill="#2C4656"/><text x="990" y="635" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="14" fill="#9FF2E2">CAJA</text>`
  });

  /* La Feria del Bordado en la plaza de Tepetlán: toldos, papel picado, foquitos y el kiosco. */
  const toldo = (x, y, w, c, letreroDe) => `<rect x="${x}" y="${y}" width="${w}" height="${830 - y}" fill="#3A2846" opacity=".55"/>
    <path d="M${x - 10} ${y} L${x + w + 10} ${y} L${x + w} ${y + 36} ${Array.from({ length: 6 }, (_, i) => `Q${x + w - (i + .5) * w / 6} ${y + 56} ${x + w - (i + 1) * w / 6} ${y + 36}`).join(' ')}Z" fill="${c}"/>
    <rect x="${x}" y="${y + 150}" width="${w}" height="16" fill="#2A1C33"/>${letreroDe ? `<path d="M${x + w / 2 - 70} ${y - 8} V${y - 64} M${x + w / 2 + 70} ${y - 8} V${y - 64}" stroke="#2A1C33" stroke-width="2"/>${letrero({ cx: x + w / 2, y: y - 64, w: 200, h: 48, texto: letreroDe, estilo: 'pintado', fondo: '#F2E3CF', tinta: oscuro(c, .15), size: 17, espacio: 2 })}` : ''}`;
  const picado = (y, x0, x1, semilla) => { const r = azar(semilla); const cs = ['#E0303F', '#F2A7C3', '#F6C177', '#B79AD8', '#9FD8C8']; let s = `<path d="M${x0} ${y} Q${(x0 + x1) / 2} ${y + 40} ${x1} ${y}" stroke="#2A1C33" stroke-width="2" fill="none"/>`; for (let x = x0 + 20; x < x1 - 10; x += 46) { const t = (x - x0) / (x1 - x0), yy = y + 160 * t * (1 - t) * .25 * 4 * .5; s += `<path d="M${x} ${yy} h32 v34 l-8 -6 l-8 6 l-8 -6 l-8 6z" fill="${cs[Math.floor(r() * cs.length)]}" opacity=".9"/>`; } return s; };
  const foquitos = (y, x0, x1) => Array.from({ length: Math.floor((x1 - x0) / 60) }, (_, i) => { const x = x0 + 30 + i * 60, t = (x - x0) / (x1 - x0); return `<circle cx="${x}" cy="${y + 60 * t * (1 - t) * 2}" r="6" fill="#FFE3A3" class="foco" style="--r:${-(i % 5) * .4}s"/>`; }).join('');
  E.feria = () => ({
    suelo: 830, silueta: '#24172E', luz: '#FFD9A0',
    defs: cielo('c-fer', [[0, '#4A2F5E'], [.55, '#C9707E'], [1, '#F7C08F']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-fer)"/>
      ${capa(.006, `<circle cx="1180" cy="520" r="120" fill="#FFE3C2" opacity=".8"/>` + cerros(91, 560, 70, 8, '#9E5C79', .7))}
      ${capa(.012, parroquia(330, 760, .95, '#6A3E66', '#FFD9A0'))}
      ${capa(.016, casas(-60, 1660, 790, 92, '#5E3862', '#FFD9A0', .95))}
      ${capa(.02, kiosco(800, 800, 1.15, '#4A2A52', '#FFD9A0') + arbol(470, 800, 300, '#432748', 14) + arbol(1120, 800, 280, '#432748', 15))}
      ${capa(.035, picado(250, -40, 820, 3) + picado(230, 780, 1640, 4) + foquitos(330, -20, 1620))}
      ${capa(.05, toldo(60, 560, 320, '#B0476A', 'LAS ÁNIMAS') + toldo(1180, 560, 360, '#E0303F', 'HILO ROJO') + `<rect x="0" y="800" width="${W}" height="100" fill="#2E1E38"/><rect x="0" y="792" width="${W}" height="10" fill="#45304F"/>`)}
      ${particulas(97, 14, '#FFE3A3', 300, 780)}`
  });

  /* Orientación: oficina chiquita, ventana a las jacarandas, librero y una planta que nadie riega. */
  E.orientacion = () => ({
    suelo: 830, silueta: '#2A1C33', luz: '#FFE3B8',
    defs: cielo('c-ori', [[0, '#5B4466'], [1, '#8C6A7E']]) + cielo('c-ori-v', [[0, '#B79AC9'], [1, '#F2C7B4']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-ori)"/>
      ${capa(.01, `
        <rect x="980" y="150" width="460" height="380" rx="6" fill="#3E2C4A"/>
        <rect x="1000" y="170" width="420" height="340" fill="url(#c-ori-v)"/>
        ${arbol(1150, 520, 300, '#9B78B8', 12, '#C9A6E8')}${arbol(1330, 520, 240, '#8A68A6', 13, '#C9A6E8')}
        <rect x="1206" y="170" width="8" height="340" fill="#3E2C4A"/><rect x="1000" y="336" width="420" height="8" fill="#3E2C4A"/>
        <rect x="970" y="520" width="480" height="16" fill="#4A3557"/>
        <rect x="140" y="160" width="300" height="430" fill="#4A3557"/>
        ${[0, 1, 2, 3].map(i => `<rect x="150" y="${240 + i * 92}" width="280" height="8" fill="#3A2846"/>`).join('')}
        ${Array.from({ length: 22 }, (_, i) => { const r = azar(70 + i); return `<rect x="${158 + (i % 11) * 24}" y="${(i < 11 ? 182 : 274) + r() * 18}" width="${16 + r() * 6}" height="${58 - r() * 18}" fill="${['#C98A9A', '#E8C4A8', '#9B7FB0', '#7D6A8C'][i % 4]}" opacity=".85"/>`; }).join('')}
        <rect x="560" y="210" width="230" height="160" fill="#F4E6D8" opacity=".9"/>
        <text x="675" y="250" text-anchor="middle" font-family="system-ui" font-weight="800" font-size="20" fill="#5B4466">OCTUBRE</text>
        ${Array.from({ length: 28 }, (_, i) => `<rect x="${578 + (i % 7) * 28}" y="${266 + Math.floor(i / 7) * 24}" width="20" height="16" fill="${i === 25 ? '#E0303F' : '#D9C7D6'}"/>`).join('')}
      `)}
      ${capa(.03, `<rect x="0" y="760" width="${W}" height="140" fill="#3A2846"/><rect x="0" y="752" width="${W}" height="10" fill="#4A3557"/>`)}
      ${particulas(91, 8, '#FFE3B8', 200, 700)}`,
    frente: `
      <rect x="480" y="650" width="640" height="26" rx="4" fill="#20152A"/>
      <rect x="500" y="676" width="20" height="160" fill="#20152A"/><rect x="1080" y="676" width="20" height="160" fill="#20152A"/>
      <rect x="500" y="676" width="600" height="110" fill="#2A1C33"/><rect x="530" y="700" width="540" height="4" fill="#3A2846"/>
      <rect x="560" y="618" width="120" height="34" rx="3" fill="#E8DCCF" opacity=".9"/><rect x="700" y="626" width="70" height="26" rx="3" fill="#C98A9A"/>
      <path d="M960 650 q-6 -40 10 -48 h40 q16 8 10 48z" fill="#3A2846"/>
      <g fill="#6A8F6A">${[-30, -12, 6, 22].map((dx, i) => `<path d="M${985 + dx} 604 q${-10 + i * 8} -60 ${8 + i * 2} -${70 + i * 8} q4 ${40 + i * 6} -4 70z" opacity="${i % 2 ? .7 : .9}"/>`).join('')}</g>
      <path d="M965 590 q10 -14 24 -10" stroke="#8C6A4E" stroke-width="3" fill="none"/>`
  });

  /* La jardinera del fondo de la prepa (atrás de la cafetería): la orilla de concreto sirve de banca, una jacaranda
     grande da sombra y al fondo pasa gente por la cancha. La orilla queda a la altura de la cadera de alguien sentado. */
  E.jardinera = () => {
    const suelo = 820, orilla = suelo - 80;
    return {
      suelo, silueta: '#2E2140', luz: '#FBE3D3',
      defs: cielo('c-jar', [[0, '#A58EBF'], [.6, '#DDB0BA'], [1, '#F5D2BD']]) + cielo('c-jar-m', [[0, '#7A6290'], [1, '#6A537E']]),
      fondo: `
        <rect width="${W}" height="${H}" fill="url(#c-jar)"/>
        ${capa(.008, `<circle cx="1260" cy="170" r="70" fill="#FFF1E4" opacity=".7"/>` + cerros(57, 520, 80, 9, '#B595B6', .55))}
        ${capa(.018, `<rect x="0" y="470" width="${W}" height="250" fill="url(#c-jar-m)"/>
          <rect x="0" y="462" width="${W}" height="14" fill="#5D466F"/>
          <g fill="#F2D7C9" opacity=".55">${Array.from({ length: 10 }, (_, i) => `<rect x="${60 + i * 160}" y="510" width="90" height="70" rx="3"/>`).join('')}</g>
          <g fill="#5D466F">${Array.from({ length: 10 }, (_, i) => `<rect x="${103 + i * 160}" y="510" width="4" height="70"/>`).join('')}</g>
          ${letrero({ cx: 330, y: 598, w: 230, h: 46, texto: 'CAFETERÍA', estilo: 'pintado', fondo: '#EBD8C6', tinta: '#7A3E55', size: 18, espacio: 4 })}
          <rect x="0" y="690" width="${W}" height="10" fill="#4E3A62"/>`)}
        ${capa(.03, `<g stroke="#4A3659" stroke-width="2" opacity=".45">${Array.from({ length: 34 }, (_, i) => `<path d="M${i * 50} 640 L${i * 50 + 50} 700 M${i * 50 + 50} 640 L${i * 50} 700"/>`).join('')}</g>
          <rect x="0" y="636" width="${W}" height="5" fill="#4A3659"/>${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 200}" y="630" width="7" height="72" fill="#4A3659"/>`).join('')}`)}
        ${capa(.045, `
          <rect x="1018" y="230" width="34" height="${orilla - 220}" fill="#4A3352"/><path d="M1035 420 q-120 -60 -210 -40 M1035 380 q130 -70 240 -30 M1035 330 q-60 -80 -150 -110" stroke="#4A3352" stroke-width="16" fill="none" stroke-linecap="round"/>
          <g fill="#9A78C0">${Array.from({ length: 26 }, (_, i) => { const r = azar(400 + i); return `<circle cx="${(780 + r() * 540).toFixed(0)}" cy="${(150 + r() * 260).toFixed(0)}" r="${(40 + r() * 46).toFixed(0)}" opacity="${(.55 + r() * .35).toFixed(2)}"/>`; }).join('')}</g>
          <g fill="#B79AD8" opacity=".7">${Array.from({ length: 18 }, (_, i) => { const r = azar(450 + i); return `<circle cx="${(820 + r() * 480).toFixed(0)}" cy="${(170 + r() * 220).toFixed(0)}" r="${(16 + r() * 22).toFixed(0)}"/>`; }).join('')}</g>`)}
        ${capa(.06, `
          <rect x="0" y="${suelo - 30}" width="${W}" height="${H - suelo + 30}" fill="#4C3961"/>
          <rect x="120" y="${orilla - 30}" width="1360" height="40" fill="#5A4433"/>
          <g fill="#4F7A5A">${Array.from({ length: 22 }, (_, i) => { const x = 150 + i * 62, h = 30 + (i * 23) % 40; return `<path d="M${x} ${orilla - 22} q-8 ${-h} 4 ${-h - 10} q2 ${h * .6} 8 ${h + 10}z M${x + 14} ${orilla - 22} q10 ${-h * .8} 18 ${-h * .7} q-6 ${h * .4} -6 ${h * .7}z"/>`; }).join('')}</g>
          <g fill="#6A8F62" opacity=".85">${[260, 520, 1300].map(x => `<ellipse cx="${x}" cy="${orilla - 40}" rx="70" ry="38"/>`).join('')}</g>
          <rect x="110" y="${orilla}" width="1380" height="${suelo - orilla}" fill="#8C7A8E"/>
          <rect x="104" y="${orilla - 8}" width="1392" height="16" rx="3" fill="#A796A6"/><rect x="104" y="${orilla - 8}" width="1392" height="4" fill="#C2B4C0" opacity=".6"/>
          <g stroke="#6E5E72" stroke-width="2" opacity=".55">${Array.from({ length: 23 }, (_, i) => `<path d="M${110 + i * 60} ${orilla + 8} V${suelo}"/>`).join('')}<path d="M110 ${orilla + 44} H1490"/></g>
          <path d="M380 ${orilla + 8} l12 22 l-6 18 M1180 ${orilla + 12} l-8 28" stroke="#5A4A5E" stroke-width="2" fill="none" opacity=".6"/>
          <text x="1240" y="${orilla + 52}" font-family="system-ui" font-weight="800" font-size="15" fill="#5A4A5E" opacity=".55" transform="rotate(-3 1240 ${orilla + 52})">K + B · 3°B</text>
          <rect x="0" y="${suelo - 2}" width="${W}" height="6" fill="#3E2E52"/>`)}
        ${particulas(64, 18, '#C9A6E8', 200, 760)}`
    };
  };

  /* La cima del cerro, de noche: el único lugar con tres rayitas. Abajo se ven las luces de Tepetlán y la carretera;
     a lo lejos, la antena con su foquito. Piedras, una cruz de palo con su veladora y el zacate que mueve el viento. */
  E.cima = () => ({
    suelo: 800, silueta: '#1F1529', luz: '#F6C177',
    defs: cielo('c-cim', [[0, '#16112A'], [.5, '#33264A'], [.8, '#6A4A6A'], [1, '#9A6A78']]) + defBruma('#9A7A9A'),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-cim)"/>
      ${capa(.004, estrellas(91, 140, 520) + `<circle cx="300" cy="140" r="38" fill="#FBE3D3"/><circle cx="318" cy="130" r="36" fill="#1C1530"/>`)}
      ${capa(.01, cerros(93, 560, 60, 10, '#3A2C4E', .9) + `<g transform="translate(1290 480)"><path d="M-30 80 L0 -120 L30 80 M-20 20 H20 M-14 -30 H14 M-8 -80 H8 M-30 80 L20 20 M30 80 L-20 20" stroke="#2A2038" stroke-width="5" fill="none"/><circle cx="0" cy="-126" r="6" fill="#F0607A" class="foco"/></g>`)}
      ${capa(.02, `<path d="M0 640 Q400 600 800 630 T1600 615 V900 H0Z" fill="#2A2038"/>
        <g fill="#FFD9A0">${Array.from({ length: 120 }, (_, i) => { const r = azar(700 + i), x = 380 + r() * 900, y = 652 + r() * 50 + Math.abs(x - 830) * .04; return `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r() * 2).toFixed(1)}" opacity="${(.4 + r() * .6).toFixed(2)}"/>`; }).join('')}</g>
        <path d="M0 700 Q300 690 600 680 T1200 668 T1600 660" stroke="#FFC98A" stroke-width="2" fill="none" opacity=".35" stroke-dasharray="4 10"/>
        ${bruma(600, 140, '#9A7A9A', .3)}`)}
      ${capa(.05, `
        <path d="M0 760 Q200 740 420 762 Q700 790 1000 772 Q1300 750 1600 770 V900 H0Z" fill="#1F1529"/>
        <path d="M80 770 q30 -50 90 -44 q50 10 40 46z" fill="#2E2240"/><path d="M1380 768 q20 -60 80 -60 q60 6 60 64z" fill="#2E2240"/><path d="M1400 726 q30 -14 60 -6" stroke="#46385A" stroke-width="3" fill="none"/>
        <g transform="translate(1180 776)"><rect x="-4" y="-150" width="8" height="150" fill="#3A2C3A"/><rect x="-38" y="-118" width="76" height="8" fill="#3A2C3A"/><path d="M-30 -110 q10 30 0 60" stroke="#B0476A" stroke-width="3" fill="none" opacity=".7"/><circle cx="-8" cy="-8" r="16" fill="url(#halo)" opacity=".7"/><path d="M-13 -6 h10 v8 h-10z" fill="#E9D9C9"/><circle cx="-8" cy="-9" r="2.6" fill="#FFE3A3" class="foco"/></g>
        ${pinos(95, 770, 6, 120, '#1A1224', 0, 260)}${pinos(96, 770, 5, 110, '#1A1224', 1460, 1600)}`)}
      ${particulas(97, 16, '#F9D58A', 420, 760)}`,
    extra: `<radialGradient id="halo"><stop offset="0" stop-color="#F6C177"/><stop offset="1" stop-color="#F6C177" stop-opacity="0"/></radialGradient>`
  });

  /* Las escaleras de atrás del laboratorio: concreto, barandal oxidado, la puerta de lámina con su placa y una
     ventana con rejas. Ahí no llegan ni la señal ni los prefectos. */
  E.escaleras = () => ({
    suelo: 830, silueta: '#2A1C33', luz: '#F5D7C2',
    defs: cielo('c-esc', [[0, '#8A7096'], [1, '#B48E9E']]),
    fondo: `
      <rect width="${W}" height="${H}" fill="url(#c-esc)"/>
      ${capa(.01, `<rect x="0" y="0" width="${W}" height="${H}" fill="#7A6288"/>
        <g stroke="#6A5278" stroke-width="2" opacity=".5">${Array.from({ length: 16 }, (_, i) => `<path d="M0 ${60 + i * 52} H${W}"/>`).join('')}${Array.from({ length: 64 }, (_, i) => `<path d="M${(i % 8) * 200 + (Math.floor(i / 8) % 2) * 100} ${60 + Math.floor(i / 8) * 104} v52"/>`).join('')}</g>
        <rect x="160" y="170" width="250" height="190" fill="#C9B2D2" opacity=".8"/><g stroke="#4A3659" stroke-width="5">${[200, 245, 290, 335, 380].map(x => `<path d="M${x} 170 V360"/>`).join('')}<path d="M160 265 H410"/></g><rect x="150" y="160" width="270" height="12" fill="#5A4468"/><rect x="150" y="358" width="270" height="12" fill="#5A4468"/>
        <path d="M480 330 q30 -20 70 0 q20 30 -10 40 q-50 10 -60 -40z M590 300 q40 4 50 30" stroke="#5A3E6E" stroke-width="5" fill="none" opacity=".35"/>
        <text x="520" y="430" font-family="Georgia, serif" font-style="italic" font-size="26" fill="#4A3659" opacity=".35" transform="rotate(-6 520 430)">aquí estuvo el 6°A</text>`)}
      ${capa(.03, (() => {
        /* Escalera de concreto que sube a un descanso (y = 580) pegado al muro; la puerta del laboratorio está sobre
           el descanso y el barandal se clava en cada escalón. 8 escalones de 30 de alto por 50 de huella. */
        const pie = 820, x0 = 640, huella = 50, peralte = 30, n = 8, desc = pie - n * peralte, xd = x0 + n * huella;
        const esc = Array.from({ length: n }, (_, i) => { const x = x0 + i * huella, y = pie - (i + 1) * peralte; return `<rect x="${x}" y="${y}" width="${xd - x}" height="${peralte}" fill="${i % 2 ? '#A898AC' : '#B2A2B4'}"/><rect x="${x}" y="${y}" width="${huella}" height="4" fill="#CABCCB"/><path d="M${x} ${y} V${y + peralte}" stroke="#8E7E94" stroke-width="2"/>`; }).join('');
        const postes = Array.from({ length: n }, (_, i) => { const x = x0 + i * huella + 25, y = pie - (i + 1) * peralte; return `<rect x="${x - 3}" y="${y - 92}" width="6" height="92" fill="#6A4A3A"/><rect x="${x - 6}" y="${y - 3}" width="12" height="4" fill="#4A3428"/>`; }).join('');
        const tope = (i) => [x0 + i * huella + 25, pie - (i + 1) * peralte - 92];
        const [ax, ay] = tope(0), [bx, by] = tope(n - 1);
        return `
        <rect x="${xd}" y="${desc}" width="360" height="${pie - desc}" fill="#9C8CA2"/>
        <g stroke="#8A7A90" stroke-width="2" opacity=".6">${Array.from({ length: 5 }, (_, k) => `<path d="M${xd} ${desc + 40 + k * 44} H${xd + 360}"/>`).join('')}${Array.from({ length: 12 }, (_, k) => `<path d="M${xd + (k % 3) * 120 + (Math.floor(k / 3) % 2) * 60} ${desc + 40 + Math.floor(k / 3) * 44} v44"/>`).join('')}</g>
        <rect x="${xd - 6}" y="${desc - 8}" width="372" height="12" fill="#C2B4C4"/><rect x="${xd - 6}" y="${desc + 4}" width="372" height="5" fill="#7E6E84" opacity=".7"/>
        <rect x="${xd + 70}" y="${desc - 266}" width="220" height="266" fill="#3E4A58"/>
        <rect x="${xd + 84}" y="${desc - 254}" width="192" height="254" fill="#5A6A7A"/>
        ${[0, 1, 2, 3, 4].map(k => `<path d="M${xd + 92} ${desc - 222 + k * 44} H${xd + 268}" stroke="#4E5C6A" stroke-width="3"/>`).join('')}
        <rect x="${xd + 244}" y="${desc - 130}" width="18" height="9" rx="3" fill="#C9BCC8"/><rect x="${xd + 250}" y="${desc - 120}" width="6" height="10" fill="#8A7E8A"/>
        <rect x="${xd + 84}" y="${desc - 44}" width="192" height="44" fill="#4E5C6A" opacity=".5"/>
        <path d="M${xd + 96} ${desc - 254} l18 220 M${xd + 210} ${desc - 254} l-6 80" stroke="#7A8A98" stroke-width="1.6" opacity=".35"/>
        ${letrero({ cx: xd + 180, y: desc - 336, w: 210, h: 50, texto: 'LABORATORIO', sub: 'NO CORRER', size: 16, espacio: 2, fondo: '#E8E2D8', tinta: '#3E4A58' })}
        <g transform="translate(${xd + 316} ${desc - 290})"><path d="M0 0 h-22 v18" stroke="#3A2C44" stroke-width="4" fill="none"/><path d="M-34 18 h24 l-4 14 h-16z" fill="#3A2C44"/><ellipse cx="-22" cy="34" rx="7" ry="3" fill="#FFE9C9" opacity=".8"/></g>
        ${esc}
        <path d="M${x0} ${pie} L${xd} ${desc}" stroke="#7E6E84" stroke-width="3" opacity=".5"/>
        ${postes}
        <path d="M${ax - 18} ${ay + 11} L${bx} ${by} H${xd + 60}" stroke="#6A4A3A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M${ax} ${ay + 46} L${bx} ${by + 46} H${xd + 60}" stroke="#6A4A3A" stroke-width="4" fill="none"/>
        <rect x="${xd + 57}" y="${by - 2}" width="6" height="${desc - by + 2}" fill="#6A4A3A"/>
        <path d="M${ax - 18} ${ay + 11} q-8 4 -6 16" stroke="#6A4A3A" stroke-width="7" fill="none" stroke-linecap="round"/>
        <path d="M${ax + 40} ${ay - 22} l2 14 M${bx - 120} ${by + 50} l-3 12" stroke="#8A5A3A" stroke-width="2" opacity=".35"/>`;
      })())}
      ${capa(.05, `<rect x="0" y="820" width="${W}" height="${H - 820}" fill="#4A3A54"/><rect x="0" y="818" width="${W}" height="6" fill="#5E4E68"/>
        <path d="M120 860 q40 -10 80 4 M1300 870 q30 -8 60 2" stroke="#3A2C44" stroke-width="3" fill="none"/>
        <g fill="#5E7A5A" opacity=".8"><path d="M1460 820 q6 -40 14 0z M1476 820 q10 -50 18 0z M1494 820 q4 -30 10 0z"/></g>`)}
      ${particulas(98, 8, '#F5D7C2', 200, 760)}`
  });

  /* ---------- Vida de cada lugar ----------
     lejos: lo que se mueve detrás de los personajes. frente: lo que pasa (desenfocado) entre la cámara y ellos. */
  const VIDA = {
    encinal: () => ({
      lejos: palomillas(1095, 625, 3) + `<g transform="translate(1270 752)" fill="#1A1222"><path d="M-40 0 q0 -22 26 -24 l34 -2 q8 -12 16 -6 l8 -8 l2 14 q4 8 -4 14 l-6 12z"/><path class="cola" d="M-38 -8 q-22 -2 -26 -18" stroke="#1A1222" stroke-width="6" fill="none" stroke-linecap="round" style="transform-origin:-38px -8px"/></g>`,
      frente: bicho(8, -2, 360) + bicho(13, -9, 520, .8) + zacate(-20, 9) + zacate(W + 10, 8, -1) + rama(W + 40, -40, 420, -1)
    }),
    cocina: () => ({
      lejos: reloj(620, 300, 28) + palomillas(800, 296, 2),
      frente: marco(-30, 70) + `<g class="mece lenta" style="transform-origin:1420px -10px"><path d="M1420 -10 V150" stroke="#000" stroke-width="3"/>${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${1420 + (i % 2 ? 6 : -6)} ${40 + i * 20} q${i % 2 ? 16 : -16} 8 ${i % 2 ? 4 : -4} 26z"/>`).join('')}</g>` + gato(34, -8)
    }),
    combi: () => ({ lejos: pajaros(220, 40, -12), frente: orillaCarretera() }),
    prepa: () => ({
      lejos: cruza({ semilla: 3, y: 762, esc: .42, dur: 30, r: -6, z: .6 }) + cruza({ semilla: 8, y: 768, esc: .45, dur: 36, r: -20, izq: true, z: .6, cel: true }) + cruza({ semilla: 15, y: 760, esc: .4, dur: 42, r: -31, z: .55 }) + pajaros(160, 46, -20),
      frente: cruza({ semilla: 21, y: H + 300, esc: 1.75, dur: 22, r: -3, pausa: true, z: .8 }) + cruza({ semilla: 34, y: H + 330, esc: 1.9, dur: 31, r: -19, izq: true, pausa: true, z: .8, cel: true }) + rama(-40, -40, 460)
    }),
    calle: () => ({
      lejos: cruza({ semilla: 5, y: 790, esc: .4, dur: 30, r: -4, z: .6 }) + cruza({ semilla: 12, y: 793, esc: .42, dur: 36, r: -17, izq: true, z: .6 }) + pajaros(300, 50, -30),
      frente: cruza({ semilla: 41, y: H + 300, esc: 1.8, dur: 26, r: -11, pausa: true, z: .8 }) + `<rect x="1540" y="-20" width="34" height="${H + 40}"/><path d="M1557 120 q-80 -10 -120 30" stroke="#000" stroke-width="12" fill="none"/>`
    }),
    ciber: () => ({
      lejos: `<g transform="translate(800 40)"><rect x="-4" y="0" width="8" height="40" fill="#0B141A"/><ellipse cx="0" cy="46" rx="22" ry="9" fill="#0B141A"/><g class="aspa"><rect x="-150" y="42" width="300" height="8" rx="4" fill="#0B141A" opacity=".85"/></g></g>`
        + `<g transform="translate(520 600)" fill="#0B141A"><circle cx="0" cy="-118" r="22"/><rect x="-30" y="-100" width="60" height="70" rx="20"/></g>`,
      frente: `<path d="M-40 ${H + 20} L-40 640 Q60 610 150 650 L170 ${H + 20}Z"/>` + cruza({ semilla: 52, y: H + 310, esc: 1.8, dur: 30, r: -14, pausa: true, z: .8 })
    }),
    orientacion: () => ({
      lejos: reloj(895, 300, 30) + `<path d="M1000 170 L1420 170 L1200 900 L520 900Z" fill="url(#c-rayo-ori)" class="rayo-ventana"/>`,
      frente: marco(-20, 60) + bicho(17, -6, 330, .6)
    }),
    jardinera: () => ({
      lejos: cruza({ semilla: 23, y: 700, esc: .3, dur: 34, r: -8, z: .55 }) + cruza({ semilla: 29, y: 702, esc: .32, dur: 41, r: -25, izq: true, z: .55, cel: true }) + pajaros(150, 52, -14),
      frente: cruza({ semilla: 44, y: H + 300, esc: 1.8, dur: 27, r: -9, pausa: true, z: .8 }) + rama(W + 40, -40, 420, -1) + bicho(15, -5, 420, .6)
    }),
    cima: () => ({
      lejos: palomillas(1172, 767, 2) + `<g class="cruza" style="--dur:24s;--r:-6s;--de:-100px;--a:${W + 100}px"><circle cx="0" cy="688" r="3" fill="#FFF3D6"/><circle cx="8" cy="688" r="3" fill="#FFF3D6"/></g>`,
      frente: zacate(-20, 10) + zacate(W + 10, 9, -1) + bicho(9, -3, 420, .8) + rama(-40, -40, 380)
    }),
    escaleras: () => ({
      lejos: bicho(19, -7, 300, .5),
      frente: marco(W - 50, 80) + cruza({ semilla: 48, y: H + 320, esc: 1.85, dur: 36, r: -21, pausa: true, z: .8 })
    }),
    feria: () => ({
      lejos: cruza({ semilla: 6, y: 798, esc: .44, dur: 26, r: -3, z: .6 }) + cruza({ semilla: 9, y: 802, esc: .46, dur: 32, r: -14, izq: true, z: .6, cel: true }) + cruza({ semilla: 14, y: 799, esc: .42, dur: 29, r: -22, z: .6 }) + cruza({ semilla: 17, y: 804, esc: .45, dur: 37, r: -9, izq: true, z: .6 }),
      frente: cruza({ semilla: 61, y: H + 300, esc: 1.8, dur: 18, r: -2, pausa: true, z: .8 }) + cruza({ semilla: 66, y: H + 320, esc: 1.9, dur: 23, r: -14, izq: true, pausa: true, z: .8 }) + `<path d="M-40 30 Q800 130 1640 20" stroke="#000" stroke-width="3" fill="none"/>${Array.from({ length: 15 }, (_, i) => { const x = 40 + i * 110, t = (x + 40) / 1680, y = 30 + 380 * t * (1 - t) * .5; return `<path class="mece" style="--r:${-i * .4}s;transform-origin:${x + 25}px ${y}px" d="M${x} ${y} h50 v54 l-12 -9 l-13 9 l-12 -9 l-13 9z"/>`; }).join('')}`
    })
  };

  /* ---------- Personajes (siluetas) ----------
     Cada figura se dibuja con los pies en (0, 0) y mide unas 340 unidades. */
  const FIG = {
    yare: { escala: 1, extra: (c) => `<path d="M-6 -330 q-40 10 -36 70 q4 50 -10 90" stroke="${c}" stroke-width="16" fill="none" stroke-linecap="round"/><rect x="18" y="-280" width="40" height="80" rx="12" fill="${c}"/>` },
    iker: { escala: 1.04, extra: (c) => `<path d="M-36 -346 q36 -36 72 0 v6 h-72z" fill="${c}"/><rect x="20" y="-346" width="40" height="8" rx="4" fill="${c}"/><path d="M-30 -292 q30 30 60 0 v14 h-60z" fill="${c}"/>` },
    abuela: { escala: .9, falda: true, extra: (c) => `<circle cx="-24" cy="-358" r="16" fill="${c}"/><path d="M-62 -292 L62 -292 L44 -180 L-44 -180Z" fill="${c}"/>` },
    lupita: { escala: .98, extra: (c) => `<ellipse cx="-30" cy="-354" rx="14" ry="26" fill="${c}" transform="rotate(-30 -30 -354)"/>` },
    rocio: { escala: 1, extra: (c) => [[-30, -340], [-14, -360], [8, -362], [28, -344], [-34, -318], [32, -320]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="16" fill="${c}"/>`).join('') },
    tono: { escala: .74, extra: (c) => `<path d="M-34 -346 q34 -36 68 0 v6 h-68z" fill="${c}"/><rect x="-62" y="-346" width="40" height="8" rx="4" fill="${c}"/>` },
    mari: { escala: .95, extra: (c) => `<path d="M-40 -312 q-4 -56 40 -58 q44 2 40 58 v14 h-12 v-30 h-56 v30 h-12z" fill="${c}"/>` },
    ramiro: { escala: 1.05, extra: (c) => `<ellipse cx="0" cy="-358" rx="58" ry="10" fill="${c}"/><path d="M-30 -360 q30 -40 60 0z" fill="${c}"/><path d="M-50 -290 L50 -290 L46 -180 L-46 -180Z" fill="${c}"/>` },
    mama: { escala: 1, extra: (c) => `<circle cx="-30" cy="-326" r="20" fill="${c}"/><path d="M-46 -230 L46 -230 L52 -150 L-52 -150Z" fill="${c}"/>` },
    lucia: { escala: .97, falda: true, extra: (c) => `<circle cx="0" cy="-372" r="18" fill="${c}"/><path d="M-52 -290 L52 -290 L58 -170 L-58 -170Z" fill="${c}"/><rect x="-24" y="-342" width="48" height="5" fill="${c}" opacity=".6"/>` },
    mau: { escala: 1.06, extra: (c) => `<path d="M-34 -352 q34 -26 68 0 l-4 14 h-60z" fill="${c}"/><path d="M-40 -318 q-6 -26 4 -34 M40 -318 q6 -26 -4 -34" stroke="${c}" stroke-width="10" fill="none"/><rect x="-46" y="-300" width="92" height="12" rx="6" fill="${c}"/>` }
  };

  /* Un personaje ilustrado (personajes.js). Si trae `color` es alguien de fondo: se dibuja una persona genérica. */
  function figura(id, x, y, color, opciones = {}) {
    const generico = !!opciones.color;
    const voltea = opciones.voltea ? -1 : 1;
    return `<g class="actor ${opciones.hablando ? 'hablando' : ''} ${generico ? 'gente' : ''}" data-id="${generico ? 'gente' : id}" transform="translate(${x} ${y}) scale(${voltea} 1)">
      ${Personajes.dibujar(generico ? 'gente' : id, { ...opciones, semilla: opciones.semilla || Math.round(x * 7 + (id.length * 13)) })}
    </g>`;
  }

  /* Arma el SVG completo: fondo, personajes y lo que va enfrente de ellos. */
  function componer(id, actores = [], hablando = null, rango = [0, 1], orientar = true) {
    const [nombre, variante] = id.split(':');
    const sc = E[nombre](variante === 'atardecer');
    const [x0, x1] = rango;
    const lista = actores.map(([pid, pos, op = {}]) => ({ pid, op, x: op.abs ?? (x0 + (x1 - x0) * pos) * W })); // abs: posición fija en el lienzo
    /* En una plática cada quien voltea hacia donde están los demás (la gente de fondo y las cinemáticas deciden solas) */
    const nombrados = lista.filter(a => !a.op.color && a.pid !== 'gente');
    if (orientar && nombrados.length > 1) nombrados.forEach(a => {
      if (a.op.fija) return;
      const otros = nombrados.filter(b => b !== a), centro = otros.reduce((t, b) => t + b.x, 0) / otros.length;
      if (Math.abs(centro - a.x) > 20) a.op = { ...a.op, voltea: centro < a.x };
    });
    const figuras = lista.map(({ pid, op, x }) => figura(pid, x, sc.suelo + (op.dy || 0), op.color || sc.silueta, { ...op, hablando: pid === hablando })).join('');
    const vida = VIDA[nombre] ? VIDA[nombre](variante) : {};
    return {
      svg: `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg">
        <defs>${sc.defs || ''}${sc.extra || ''}<linearGradient id="c-rayo-ori" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1DC" stop-opacity=".32"/><stop offset="1" stop-color="#FFF1DC" stop-opacity="0"/></linearGradient></defs>
        ${sc.fondo}
        ${vida.lejos ? `<g class="capa vida" data-prof=".05">${vida.lejos}</g>` : ''}
        <g class="capa actores" data-prof=".06">${figuras}</g>
        ${sc.frente ? `<g class="capa" data-prof=".08">${sc.frente}</g>` : ''}
        ${vida.frente ? `<g class="capa primer-plano" data-prof=".16">${vida.frente}</g>` : ''}
      </svg>`,
      luz: sc.luz,
      tono: ({ encinal: 'noche', cima: 'noche', cocina: 'interior', ciber: 'ciber', calle: 'tarde', feria: 'tarde', orientacion: 'interior', escaleras: 'interior' })[nombre] || (variante === 'atardecer' ? 'tarde' : 'dia')
    };
  }

  return { componer, figura, letrero, escudo, arbol, casas, parroquia, kiosco, rueda, W, H };
})();
