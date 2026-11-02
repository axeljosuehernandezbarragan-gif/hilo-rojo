/* Hilo Rojo · iconos propios (SVG de línea, 24 × 24, trazo redondeado), para que fuera de los chats no haya emojis.
   Iconos.svg('menu') devuelve el <svg> listo para meter en un botón; toma el color del texto (currentColor). */
const Iconos = (() => {
  'use strict';
  const P = {
    /* controles del juego */
    rapido: '<path d="M4 6l7 6-7 6z"/><path d="M12 6l7 6-7 6z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    izq: '<path d="M15 5l-7 7 7 7"/>',
    der: '<path d="M9 5l7 7-7 7"/>',
    oir: '<path d="M7 10a5 5 0 0 1 10 0c0 3-2.4 4-3.4 5.6-.8 1.3-.9 3.4-3.1 3.4a2.6 2.6 0 0 1-2.5-2"/><path d="M10 10.5a2 2 0 0 1 4 0c0 1.2-1 1.6-1.6 2.3"/>',
    hablar: '<path d="M5 6h14v9H10l-4 3v-3H5z"/>',
    mando: '<path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.6 3a2 2 0 0 1-3.4 1L15 15.5H9l-1.9 1.9a2 2 0 0 1-3.4-1l-.6-3A4.5 4.5 0 0 1 7.5 8z"/><path d="M8 10.5v3M6.5 12h3"/><path d="M15.5 11h.01M17.5 13h.01"/>',
    play: '<path d="M8 5.5v13l10.5-6.5z"/>',
    saltar: '<path d="M6 6l8 6-8 6z"/><path d="M18 6v12"/>',
    repetir: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4h4"/>',
    cerrar: '<path d="M6 6l12 12M18 6L6 18"/>',
    sonido: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/>',
    mudo: '<path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z"/><path d="M16 10l4 4M20 10l-4 4"/>',
    /* cosas del mundo */
    lupa: '<circle cx="10.5" cy="10.5" r="5.5"/><path d="M15 15l4.5 4.5"/>',
    celular: '<rect x="7" y="3" width="10" height="18" rx="2.4"/><path d="M11 18h2"/>',
    pensar: '<path d="M6.5 15.5A4.5 4.5 0 0 1 7 6.6a5 5 0 0 1 9.4 1.2 3.8 3.8 0 0 1 .6 7.6z"/><circle cx="7.5" cy="19" r="1.2"/><circle cx="4.6" cy="21.2" r=".7"/>',
    bateria: '<rect x="3" y="8" width="16" height="8" rx="2"/><path d="M21 11v2"/><path d="M5.5 10.5h9v3h-9z" fill="currentColor" stroke="none"/>',
    senal: '<path d="M5 19v-2M9.5 19v-5M14 19v-8M18.5 19V8"/>',
    reloj: '<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>',
    combi: '<path d="M3 16V9.5A2.5 2.5 0 0 1 5.5 7H16l4 4.5V16z"/><path d="M3 12h17M8 7v5M13 7v5"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16" cy="17" r="1.8"/>',
    candado: '<rect x="5.5" y="10.5" width="13" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
    llave: '<circle cx="8" cy="12" r="3.6"/><path d="M11.6 12H20M17 12v3M20 12v2.4"/>',
    /* tarjetas de la propuesta */
    hilo: '<circle cx="9" cy="9" r="5"/><path d="M6 6.5c2 1 4 3.5 5.6 6.6M5.2 10.4c2 .2 4.3 1.4 6 3"/><path d="M12.8 12.6c2.5 1.5 3 4.2 5 5.4 1.2.7 2.4.5 2.7-.3"/>',
    libreta: '<path d="M6 3.5h11a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H6z"/><path d="M6 3.5v17M3.8 7.5h4.4M3.8 12h4.4M3.8 16.5h4.4M11 8h4.5M11 11.5h4.5"/>',
    tejido: '<path d="M4 7c2.7 2.7 5.3 2.7 8 0s5.3-2.7 8 0M4 12c2.7 2.7 5.3 2.7 8 0s5.3-2.7 8 0M4 17c2.7 2.7 5.3 2.7 8 0s5.3-2.7 8 0"/><path d="M8 4v16M16 4v16" opacity=".55"/>',
    caminar: '<circle cx="13" cy="4.6" r="1.9"/><path d="M12.5 8l-2.3 5 3.2 2.8-1 5"/><path d="M12.5 8l3 3.3 3-1M10.2 13l-3.2 7.5M12 8.6L8.6 10.5 7.4 13.6"/>',
    finales: '<path d="M3 18h18"/><path d="M3 18l5.5-7 3.5 4 3-3.5L21 18"/><circle cx="16.5" cy="6.5" r="2.2"/>',
    tiempo: '<path d="M7 3.5h10M7 20.5h10"/><path d="M8 3.5c0 4.5 8 4.5 8 8.5s-8 4-8 8.5M16 3.5c0 4.5-8 4.5-8 8.5s8 4 8 8.5"/>'
  };
  function svg(nombre, clase = 'ico') {
    return `<svg class="${clase}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${P[nombre] || ''}</svg>`;
  }
  return { svg, P };
})();
