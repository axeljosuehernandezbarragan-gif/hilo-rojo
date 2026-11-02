/* Hilo Rojo · cinemáticas mudas (los finales).
   Como en las películas cuando la música tapa todo: los personajes hablan, se ríen o se enojan, pero no se
   oye ninguna voz; solo la música del final. Un guion es una lista de tomas:
   { escena, dura (s), rotulo, camara: [[zoom, x, y], [zoom, x, y]], actores: [[id, x, { voltea, exp, cel, color }]],
     pasos: [[segundo, índice del actor, acción, valor, duración]] }
   Acciones: exp (postura de ánimo: ya no hay caras) · habla · gesto (risa, grita, senala, saluda, asiente, niega, hombros, cubre, aplaude,
   abrazo, suspira, cabizbajo) · camina (a una x) · voltea · cel (sí/no) · aparece · desaparece. */
const Cine = (() => {
  'use strict';
  const espera = (ms) => new Promise(r => setTimeout(r, ms));
  const reducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  let saltado = false, timers = [];

  function reproducir(guion, el) {
    saltado = false; timers = [];
    window.Sonido?.ambiente(null);
    window.Sonido?.musica(guion.musica);
    el.caja.classList.remove('visible');
    el.panel.className = 'panel visible cine';
    el.panel.innerHTML = `<div class="cine"><div class="cine-camara"><div class="cine-escena"></div></div><p class="cine-rotulo"></p><div class="cine-negro"></div><button class="cine-saltar" type="button">Saltar ${Iconos.svg('saltar')}</button>${innerWidth / innerHeight < 1.2 ? `<p class="cine-girar">${Iconos.svg('repetir')} Gira el celular para verlo mejor</p>` : ''}</div>`;
    const raiz = el.panel.querySelector('.cine');
    return new Promise(async (listo) => {
      raiz.querySelector('.cine-saltar').addEventListener('click', (e) => { e.stopPropagation(); saltado = true; timers.forEach(clearTimeout); listo(); });
      setTimeout(() => raiz.classList.add('barras'), 50);
      for (const toma of guion.tomas) { if (saltado) return; await tomar(raiz, toma); }
      if (saltado) return;
      raiz.classList.add('fundido'); await espera(1200);
      listo();
    });
  }

  async function tomar(raiz, toma) {
    const escena = raiz.querySelector('.cine-escena'), camara = raiz.querySelector('.cine-camara'), rotulo = raiz.querySelector('.cine-rotulo');
    const c = Escenarios.componer(toma.escena, toma.actores.map(([id, x, op = {}]) => [id, 0, { ...op, abs: x }]), null, [0, 1], false);
    escena.innerHTML = `<div class="lienzo" data-tono="${c.tono}">${c.svg}</div>`;
    if (innerWidth / innerHeight < 1.2) escena.querySelector('svg').setAttribute('preserveAspectRatio', 'xMidYMid meet'); // en vertical se ve la escena completa
    const actores = [...escena.querySelectorAll('.actor')].map((nodo, i) => ({ nodo, x: toma.actores[i][1], dir: toma.actores[i][2]?.voltea ? -1 : 1, pj: nodo.querySelector('.pj') }));
    const suelo = +(actores[0]?.nodo.getAttribute('transform').match(/translate\([\d.-]+ ([\d.-]+)/) || [0, 830])[1];
    actores.forEach(a => { a.y = suelo; });
    const [c0, c1] = toma.camara || [[1, 0, 0], [1.06, 0, 0]];
    camara.style.transition = 'none';
    camara.style.transform = `scale(${c0[0]}) translate(${c0[1]}px, ${c0[2]}px)`;
    void camara.offsetWidth;
    camara.style.transition = reducido() ? 'none' : `transform ${toma.dura}s ease-in-out`;
    camara.style.transform = `scale(${c1[0]}) translate(${c1[1]}px, ${c1[2]}px)`;
    rotulo.textContent = toma.rotulo || '';
    rotulo.classList.toggle('visible', !!toma.rotulo);
    raiz.classList.remove('fundido');
    for (const [t, i, accion, valor, dur] of (toma.pasos || [])) timers.push(setTimeout(() => !saltado && hacer(actores[i], accion, valor, dur), t * 1000));
    await espera(toma.dura * 1000);
    if (saltado) return;
    raiz.classList.add('fundido');
    await espera(700);
  }

  function hacer(a, accion, valor, dur = 2) {
    if (!a) return;
    const quita = (fn) => timers.push(setTimeout(fn, dur * 1000));
    switch (accion) {
      case 'exp': Personajes.expresion(a.nodo, valor); break;
      case 'habla': a.nodo.classList.add('hablando'); quita(() => a.nodo.classList.remove('hablando')); break;
      case 'gesto': a.pj.classList.add('g-' + valor); quita(() => a.pj.classList.remove('g-' + valor)); break;
      case 'cel': a.pj.classList.toggle('pose-cel', valor !== false); break;
      case 'voltea': a.dir *= -1; pon(a); break;
      case 'aparece': a.nodo.style.opacity = 1; break;
      case 'desaparece': a.nodo.style.transition = 'opacity 1s'; a.nodo.style.opacity = 0; break;
      case 'camina': {
        const x0 = a.x, x1 = valor, t0 = performance.now();
        a.dir = x1 > x0 ? 1 : -1; a.pj.classList.add('camina');
        a.nodo.style.setProperty('--paso', Math.min(1.4, Math.max(.7, 198 / (Math.abs(x1 - x0) / dur || 1))).toFixed(2) + 's'); // que los pies no patinen
        const paso = (t) => {
          const k = Math.min(1, (t - t0) / (dur * 1000));
          a.x = x0 + (x1 - x0) * k; pon(a);
          if (k < 1 && !saltado) requestAnimationFrame(paso); else a.pj.classList.remove('camina');
        };
        requestAnimationFrame(paso);
        break;
      }
    }
  }
  const pon = (a) => a.nodo.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y}) scale(${a.dir} 1)`);

  return { reproducir };
})();
