/* Hilo Rojo · Capítulo 4: Jueves («Ecos»). 40 / 60.
   Las que depositaron a la cuenta falsa llenan de insultos la página (o el perfil de Yare) y alguien publica dónde vive.
   Yare pasa a ser el blanco: en redes, en la prepa y en la puerta de su casa. En la noche hay que subir al cerro
   para tener señal y llamarle a Ramiro, que decide si la cooperativa conserva su puesto en la feria.
   Si la página quedó con alguna puerta abierta el martes o el miércoles, el jueves alguien entra por ella. */
const CAPITULO4 = (() => {
  const { fila, COLOR_GENTE } = CAPITULO2.util;
  const { STICKER_ESTAFA, perdida } = CAPITULO3.util;
  /* las rayitas de señal, arriba a la derecha mientras se sube al cerro */
  const senal = (n, txt) => `<span class="senal-ico" aria-hidden="true">${[1, 2, 3, 4].map(k => `<i class="${k <= n ? 'on' : ''}" style="height:${3 + k * 3}px"></i>`).join('')}</span>${txt}`;

  /* Por dónde entraron, en el orden en que se revisa (la lección llega tarde, en la bitácora). */
  const ORDEN_PUERTAS = ['foto', 'ciber', 'whatsapp', 'cuaderno', 'adivinable'];
  const PUERTA = {
    foto: 'Entraron con la foto de la hoja del cuaderno. La que la abuela le mandó al falso Toño a las seis de la mañana del miércoles.',
    ciber: 'Entraron por la computadora 4 del ciber. Mi sesión seguía abierta desde el lunes.',
    whatsapp: 'Entraron con la contraseña que vivía en el chat de Lupita. Lupita tenía su WhatsApp abierto en la computadora de la papelería donde trabaja.',
    cuaderno: 'Entraron con la contraseña de la hoja de atrás del cuaderno azul. La señora de Los Pinos lo tuvo en sus manos un buen rato. Bien amable.',
    adivinable: s => s.m.cambio === 'numero' ? 'Adivinaron la contraseña. Era la de antes con un número más al final. Probaron 1, 2, 3…' : 'Adivinaron la contraseña. El nombre de la cooperativa y el año. No tuvieron que esforzarse.'
  };
  const tienePruebas = (s) => !!(s.m.capGemela || s.m.capCom || s.m.mariCapturas || s.m.gemAviso || s.m.aclaro);
  const tieneCapturas = (s) => !!(s.m.evidencia || s.m.capFalsa || s.m.capCom || s.m.evidenciaYare || s.m.capGemela);
  const tonoViene = (s) => (s.rel.tono || 0) >= 1;
  const CAPTURA_COMENTARIOS = `<svg viewBox="0 0 260 150" aria-label="Captura de comentarios con insultos"><rect width="260" height="150" rx="10" fill="#fff"/>${[['Rosy Hdz', 'RATAS. Deposité $850 😡'], ['Lety Morales', 'la viejita esa es la que estafa'], ['Juan Carlos R.', 'Viven atrás de la tienda de don Beto…']].map(([a, t], i) => `<rect x="12" y="${12 + i * 44}" width="236" height="36" rx="14" fill="#F0F2F5"/><text x="24" y="${27 + i * 44}" font-family="system-ui" font-weight="800" font-size="10" fill="#1C1E21">${a}</text><text x="24" y="${41 + i * 44}" font-family="system-ui" font-size="11" fill="#1C1E21">${t}</text>`).join('')}</svg>`;

  /* ---------- Madrugada: los comentarios (celular explorable) ---------- */
  const comentarios = (s) => [
    { id: 'rosy', autor: 'Rosy Hdz', texto: 'RATAS. Deposité $850 y nadie me contesta 😡', malo: true },
    { id: 'viejita', autor: 'Lety Morales', texto: 'la viejita esa es la que estafa, la he visto en la feria con sus manteles 🤮', malo: true },
    { id: 'direccion', autor: 'Juan Carlos R.', texto: 'Viven en El Encinal, atrás de la tienda de don Beto. A ver si abren cuando vayamos a cobrar 😡', malo: true },
    { id: 'nieta', autor: '🔒 m.r.', texto: 'y la nieta va en la Lázaro Cárdenas, en 3°B 😏', malo: true },
    s.m.enojo >= 6 && { id: 'profeco', autor: 'Gaby Torres', texto: 'ya los reporté a Profeco y a la policía, rateras 🚨', malo: true },
    s.m.carla3 === 'banco' && { id: 'carla', autor: 'Carla Méndez', texto: 'A mí me ayudaron a reportarlo con mi banco. No fueron ellas, fue una página falsa.' },
    s.m.lupe3 === 'denuncia' && { id: 'bety', autor: 'Bety Rmz', texto: 'A mí me explicaron cómo denunciar. Ojo: la cuenta falsa terminaba en 4471.' }
  ].filter(Boolean);
  const pintaComentario = (s, c) => {
    if (c.malo && s.m.moderar === 'elimino') return '';
    const reportar = c.id === 'direccion' ? botonHecho(s.m.repDir, 'Reportado', '<button class="ap-btn sec chico" data-ir="repDir">··· Reportar comentario</button>') : ''; // oculto todavía se puede reportar; borrado, ya no
    if (c.malo && s.m.moderar === 'oculto') return `<p class="ap-oculto">Comentario oculto · ${c.autor}</p>${reportar}`;
    return `<button class="pz ap-com" data-p="${c.id}"><b>${c.autor}</b>${c.texto}</button>${reportar}`;
  };
  const botonHecho = (hecho, txt, html) => hecho ? `<span class="ap-hecho chico">✓ ${txt}</span>` : html;
  const ECOS = {
    tipo: 'app', marca: 'pistasEcos', pila: ['post'],
    texto: s => perdida(s) ? 'La página ya no es tuya, así que vinieron a tu perfil. Ciento cuarenta notificaciones.' : 'Ciento cuarenta notificaciones en la página. La señal llegó a las tres de la mañana y trajo todo junto.',
    indica: 'Puedes revisar los comentarios, guardarlos, ocultarlos, borrarlos, cambiar quién comenta o contestar.',
    tabs: [['post', '💬 Comentarios'], ['chats', '✉ Mensajes'], ['ajustes', '⚙ Ajustes']],
    pantallas: {
      post: { titulo: s => perdida(s) ? 'Tu perfil' : 'Hilo Rojo · Bordados…', tab: 'post', recordar: true,
        pensar: s => `Ciento cuarenta. Ayer eran catorce personas. Hoy ${s.m.enojo >= 6 ? 'parece que todo Tepetlán' : 'parece medio Tepetlán'}.`,
        cuerpo: s => `
        <div class="ap-post-real"><div class="ap-cab-chat"><span class="ap-av hilo">${perdida(s) ? 'Y' : '🧵'}</span><span><b>${perdida(s) ? 'Yare Coronel' : 'Hilo Rojo · Bordados de El Encinal'}</b><small>${s.m.gemAviso ? 'Ayer · 📌' : 'Domingo · 🌎'}</small></span></div>
          <p>${s.m.gemAviso ? (perdida(s) ? 'Nos robaron la página de Hilo Rojo. NO depositen a ninguna cuenta que publique.' : 'Aviso: esta es nuestra única página. No pedimos depósitos a ninguna otra cuenta.') : 'Mantel de flores rojas, bordado a mano por doña Chela 🌺'}</p>
          <p class="ap-reac">😡 ${30 + s.m.enojo * 9} · ${40 + s.m.enojo * 11} comentarios</p></div>
        <div class="ap-acciones">${botonHecho(s.m.capCom, 'Captura', '<button class="ap-btn sec chico" data-a="captura">📷 Captura</button>')}
          ${s.m.moderar ? '' : '<button class="ap-btn sec chico" data-a="ocultar">🙈 Ocultar insultos</button><button class="ap-btn sec chico" data-a="eliminar">🗑 Eliminar insultos</button>'}
          ${s.m.respondio ? '' : '<button class="ap-btn sec chico" data-ir="responder">↩ Responder</button>'}
          ${s.m.aclaro ? '' : '<button class="ap-btn sec chico" data-ir="aclarar">✏️ Aclaración</button>'}</div>
        <div class="ap-comentarios">${comentarios(s).map(c => pintaComentario(s, c)).join('')}
          ${s.m.respondio ? `<p><b>${perdida(s) ? 'Yare Coronel' : 'Hilo Rojo · Bordados de El Encinal'}</b> Ni nos conocen. Nosotras no les robamos nada, aprendan a fijarse dónde depositan 🙄</p><p class="resp"><b>Rosy Hdz</b> encima cínicas 😡😡</p>` : ''}
          ${s.m.aclaro ? `<p><b>${perdida(s) ? 'Yare Coronel' : 'Hilo Rojo · Bordados de El Encinal'}</b> Lamentamos mucho lo que pasó. Una página falsa usó nuestras fotos. Si depositaste a ****4471, repórtalo a tu banco y levanta denuncia; te ayudamos con los pasos.</p>` : ''}</div>` },
      responder: { titulo: 'Responder', tab: 'post', cuerpo: s => `
        <div class="ap-articulo"><b>${perdida(s) ? 'Yare Coronel' : 'Hilo Rojo · Bordados de El Encinal'}</b><p class="ap-borrador">Ni nos conocen. Nosotras no les robamos nada, aprendan a fijarse dónde depositan 🙄</p></div>
        <button class="ap-btn" data-a="responder">Publicar</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      aclarar: { titulo: 'Escribir comentario', tab: 'post', cuerpo: s => `
        <div class="ap-articulo"><b>${perdida(s) ? 'Yare Coronel' : 'Hilo Rojo · Bordados de El Encinal'}</b><p class="ap-borrador">Lamentamos mucho lo que pasó. Una página falsa usó nuestras fotos. Si depositaste a ****4471, repórtalo a tu banco y levanta denuncia; te ayudamos con los pasos.</p><small>Se fijará hasta arriba de los comentarios</small></div>
        <button class="ap-btn" data-a="aclarar">Publicar</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      repDir: { titulo: 'Reportar comentario', tab: 'post', cuerpo: `
        <p class="ap-seccion">¿Qué pasa con este comentario?</p>
        <button class="ap-fila" data-a="reportarDir"><span class="ap-av">🏠</span><span><b>Comparte información privada</b><small>Una dirección, un teléfono, documentos</small></span></button>
        <button class="ap-fila" data-a="reportarDir"><span class="ap-av">⚠️</span><span><b>Amenaza o violencia</b><small>«A ver si abren cuando vayamos»</small></span></button>
        <button class="ap-fila" data-atras><span class="ap-av">✕</span><span><b>Cancelar</b></span></button>` },
      ajustes: { titulo: 'Ajustes de privacidad', tab: 'ajustes', cuerpo: s => `
        <p class="ap-seccion">¿Quién puede comentar tus publicaciones?</p>
        <div class="ap-estado"><span>🌎</span><span><b>Público</b><small>Cualquier persona en Facebook</small></span>${s.m.limito ? '' : '<span class="ap-hecho">●</span>'}</div>
        <div class="ap-estado"><span>👥</span><span><b>Solo quienes te siguen desde hace más de 2 semanas</b><small>Las cuentas nuevas no podrán comentar</small></span>${s.m.limito ? '<span class="ap-hecho">●</span>' : '<button class="ap-btn sec chico" data-a="limitar">Elegir</button>'}</div>
        ${perdida(s) && !s.m.recuperando ? '<p class="ap-seccion">La página</p><button class="ap-btn" data-a="recuperar">Pedir ayuda para recuperar la página</button>' : ''}` },
      chats: { titulo: 'Mensajes', tab: 'chats', cuerpo: `<div class="ap-lista">
        ${fila('chatAbuela4', 'A', 'Abuela Chela', '🎙️ Nota de voz · 0:18', '6:02', true)}
        ${fila('chatLupita4', 'L', 'Lupita', 'ya viste?? 😭😭', '5:40', true)}</div>` },
      chatAbuela4: { titulo: 'Abuela Chela', tab: 'chats', recordar: true, pensar: '«Rateras». La abuela lleva cuarenta años bordando para que nadie le diga así.', cuerpo: `
        <div class="ap-msjs"><div class="ap-burbuja cliente">🎙️ «Mija, doña Tere vino a tocarme bien temprano. Dice que en el Facebook nos dicen rateras. ¿Es cierto que alguien está cobrando a nuestro nombre?»</div></div>` },
      chatLupita4: { titulo: 'Lupita', tab: 'chats', cuerpo: `
        <div class="ap-msjs"><div class="ap-burbuja cliente">ya viste?? 😭😭</div><div class="ap-burbuja cliente">pusieron dónde vive la abuela</div><div class="ap-burbuja cliente">no les contestes, te lo ruego</div></div>` }
    },
    piezas: {
      rosy: 'Rosy perdió ochocientos cincuenta pesos. Yo también estaría furiosa. ¿Con quién? Con quien tuviera enfrente.',
      viejita: '«La viejita esa». La abuela no sabe ni abrir el Facebook. ¿Le enseño esto? ¿Para qué?',
      direccion: 'La tienda de don Beto. ¿Cómo saben eso? ¿Lo dijo alguien? ¿Lo dije yo en algún lado?',
      nieta: '3°B. Eso no sale en ninguna página. Eso lo sabe alguien de mi salón.',
      profeco: '¿Y si de verdad nos denuncian a nosotras? ¿Le pueden hacer algo a la abuela?',
      carla: 'Carla. Una sola persona del otro lado. Basta para respirar tantito.',
      bety: 'Bety cuenta lo de la cuenta 4471. Nadie le contesta. Los insultos tienen más likes.'
    },
    acciones: {
      captura: (s, e, api) => { s.m.capCom = true; api.pensar('a:cap', 'Captura de todo: los nombres, las horas, la dirección. Me temblaba el dedo.'); },
      ocultar: (s, e, api) => { s.m.moderar = 'oculto'; api.hilo('Los comentarios siguen ahí, ocultos.'); api.pensar('a:ocu', 'Ocultos. Quien los escribió y sus amigos todavía los ven; los demás, ya no. ¿Eso cuenta como borrar?'); },
      eliminar: (s, e, api) => { s.m.moderar = 'elimino'; if (!s.m.capCom) s.m.borroSinCaptura = true; api.hilo('Los comentarios ya no existen.');
        api.pensar('a:eli', s.m.capCom ? 'Borrados. Las capturas siguen en mi galería.' : 'Borrados. Por un segundo sentí alivio. Luego me acordé de que no tenía ni una captura.'); },
      limitar: (s, e, api) => { s.m.limito = true; api.hilo('Ya no cualquiera puede comentar.'); api.pensar('a:lim', 'Ahora solo comentan los que nos siguen desde antes. Catorce personas. Silencio.'); },
      reportarDir: (s, e, api) => { s.m.repDir = true; api.hilo('Facebook revisará el comentario con tu dirección.'); api.pensar('a:dir', '«Comparte información privada». No sabía que eso se podía reportar.'); api.atras(); },
      responder: (s, e, api) => { s.m.respondio = true; s.m.enojo += 2; api.hilo('Tu respuesta ya tiene captura. No es tuya.'); api.pensar('a:resp', 'Lo escribí rápido. Me sentí bien tres segundos. Luego llegaron cuarenta respuestas.'); api.atras(); },
      aclarar: (s, e, api) => { s.m.aclaro = true; s.m.enojo = Math.max(1, s.m.enojo - 2); api.hilo('La aclaración quedó hasta arriba.'); api.pensar('a:acl', 'Tres personas le dieron like. Una escribió «gracias por avisar». Las demás siguieron.'); api.atras(); },
      recuperar: (s, e, api) => { s.m.recuperando = true; api.hilo('Facebook revisará tu solicitud. Puede tardar días.'); api.pensar('a:rec', 'INE, video de mi cara, otra vez. Ahora con las ojeras de las tres de la mañana.'); }
    },
    opciones: [
      { t: 'Despertar a mamá y enseñarle todo.', tej: ['familia', 'conto'], fx: s => { s.m.familia = 'conto'; cerrarEcos(s); }, ir: 'j3' },
      { t: 'Guardar el celular. Ya veré cómo lo arreglo yo sola.', tej: ['familia', 'sola'], fx: s => { s.m.familia = 'sola'; cerrarEcos(s); }, ir: 'j3b' }
    ]
  };
  const cerrarEcos = (s) => {
    s.tejido.capCom = s.m.capCom ? 'si' : 'no';
    s.tejido.moderar = s.m.moderar || 'nada';
    s.tejido.limito = s.m.limito ? 'si' : 'no';
    s.tejido.repDir = s.m.repDir ? 'si' : 'no';
    s.tejido.respondio = s.m.respondio ? 'si' : 'no';
  };

  const nodos = {
    j0: { tipo: 'titulo', sup: 'Capítulo 4', titulo: 'Jueves', sub: 'Ecos · faltan dos días para la feria', sig: 'j1' },
    j1: { tipo: 'narra', escena: 'encinal', actores: [['yare', .3, { cel: true }]],
      alEntrar: s => {
        if (s.m._j1) return; s.m._j1 = true;
        const puertas = s.m.puertas || [];
        if (!s.m.paginaPerdida && puertas.length) { s.m.perdidaJueves = true; s.m.paginaPerdida = true; s.m.puertaUsada = ORDEN_PUERTAS.find(p => puertas.includes(p)); }
        s.m.enojo = Math.max(1, (s.m.estafadas || 2) + (s.m.lupe3 === 'nada' ? 3 : 0) - (s.m.lupe3 === 'paga' ? 2 : 0) - (s.m.gemAviso ? 1 : 0));
      },
      texto: 'Desperté con el celular caliente debajo de la almohada. La señal había llegado de madrugada y había traído todo junto.',
      sig: s => s.m.perdidaJueves ? 'j1f' : 'j2' },
    j1f: { tipo: 'tel', app: 'fb', chat: 'Facebook', sub: 'Seguridad de la cuenta', avatar: 'f', hora: '3:12', boton: 'Ver lo demás', mensajes: [
      { de: 'Facebook', texto: 'Se cambió el correo electrónico de la página **Hilo Rojo · Bordados de El Encinal**. Si no fuiste tú, protege tu cuenta.' },
      { de: 'Facebook', texto: 'Se eliminó tu acceso como administradora de la página.' }
    ], sig: 'j2' },
    j2: ECOS,

    /* ----- La familia ----- */
    j3: { tipo: 'dice', quien: 'mama', escena: 'cocina', actores: [['yare', .3, { voltea: true }], ['mama', .66, { voltea: true }]],
      texto: 'Mamá leyó todo sin decir nada, con el café enfriándose. Luego: «¿Desde cuándo pasa esto, Yaretzi?»', sig: 'j3c' },
    j3c: { tipo: 'elige', opciones: [
      { t: '«Desde el domingo. Te cuento todo.»', tej: ['cuenta', 'todo'], fx: s => { s.m.cuenta = 'todo'; s.rel.mama++; s.m.familiaSabe = true; }, hilo: 'Mamá recordará esto.',
        dice: [[null, 'Le conté todo: la contraseña, el ciber, Lupita, la página gemela, Mari. Tardé lo que tarda en hervir el agua dos veces.'],
          ['mama', 'Hoy tu abuela no le abre la puerta a nadie que no conozca. Y tú me mandas mensaje cada que llegues a un lado. ¿Entendiste?'], ['yare', 'Sí.'], ['mama', 'Y no estás sola en esto, mija. Nunca lo estuviste. Nomás no me habías dicho.']] },
      { t: '«Desde ayer. Ya lo estoy arreglando.»', tej: ['cuenta', 'medias'], fx: s => { s.m.cuenta = 'medias'; s.m.familiaSabe = true; },
        dice: [['mama', 'Ajá.'], ['mama', 'Hoy tu abuela no le abre a nadie. Y en la noche me cuentas lo demás, porque esto no empezó ayer.']] }
    ], sig: 'j4' },
    j3b: { tipo: 'tel', chat: 'Abuela Chela', sub: 'en línea', avatar: 'A', hora: '7:05', alEntrar: s => { if (!s.m._j3b) { s.m._j3b = true; s.rel.abuela--; s.m.familiaSabe = false; } },
      mensajes: [{ de: 'Abuela Chela', audio: '0:22', texto: 'Mija, doña Tere me enseñó lo que dicen de nosotras en el Facebook. Y que pusieron dónde vivimos. ¿Por qué no me dijiste? Yo me entero por la vecina…' }],
      boton: 'Guardar el celular', sig: 'j4' },
    j4: { tipo: 'narra', escena: 'combi', actores: [], texto: s => s.m.familia === 'sola'
      ? 'En la combi nadie me veía, pero yo sentía que todos sabían. Una señora traía un mantel bordado en la bolsa. Me dieron ganas de bajarme.'
      : 'En la combi, mamá me mandó tres mensajes seguidos: «¿Ya llegaste?», «¿Ya?», «Avísame». Nunca me había dado tanto gusto que me molestaran.', sig: 'j5' },

    /* ----- La prepa: ahora el blanco es Yare ----- */
    j5: { tipo: 'narra', escena: 'prepa', actores: [['yare', .35, { voltea: true, cel: true }]], texto: s => 'En la prepa ya no hablaban de Mari. Hablaban de mí.' + (s.m.yareMarcada ? ' «La abogada» había cambiado de apodo.' : ''), sig: 'j6' },
    j6: { tipo: 'tel', grupo: true, chat: s => s.m.grupo === 'evidencia' ? 'Kari Sol' : '3°B 🔥', sub: s => s.m.grupo === 'evidencia' ? 'Te reenvió unos mensajes' : '38 participantes', avatar: s => s.m.grupo === 'evidencia' ? 'K' : '🔥', hora: '9:12',
      mensajes: s => { const q = s.m.mauExpuesto === true && s.m.orient3 === 'actua' ? 'Brandon' : 'Mau'; return [
        { de: q, img: CAPTURA_COMENTARIOS },
        { de: q, texto: s.m.yareMarcada ? 'la abogada salió estafadora 💸💸' : 'la de los bordados salió estafadora 💸💸' },
        { de: q, img: STICKER_ESTAFA },
        { de: 'Kari', texto: 'no manches 😬' },
        { de: 'Brandon', texto: 'pues por algo será no?' }
      ]; },
      opciones: [
        { t: '«No saben nada. Nos robaron la página, igual que les pueden robar la suya.»', tej: ['acoso4', 'responde'], fx: s => { s.m.acoso4 = 'responde'; }, hilo: 'El grupo recordará cómo contestaste.',
          respuesta: [{ de: 'Mau', texto: 'uy la ofendida 🤡' }, { de: 'Kari', texto: 'ya déjenla' }, { de: 'Brandon', texto: '📷 *Captura de tu mensaje*' }] },
        { t: 'Hacer captura y no contestar.', yo: false, tej: ['acoso4', 'captura'], fx: s => { s.m.acoso4 = 'captura'; s.m.evidenciaYare = true; }, hilo: 'Las capturas tienen fecha y hora.' },
        { t: 'Silenciar el grupo y dejar el celular boca abajo.', yo: false, tej: ['acoso4', 'silencia'], fx: s => { s.m.acoso4 = 'silencia'; } },
        { t: 'Escribirle a Mau por privado.', chat: { chat: 'Mau', sub: 'en línea', avatar: 'M' }, yo: 'Ya párale.', tej: ['acoso4', 'mau'], fx: s => { s.m.acoso4 = 'mau'; }, hilo: 'Mau recordará esto.',
          respuesta: s => [{ de: 'Mau', texto: s.m.mauSabe ? '¿o qué? ¿me vas a acusar? 🙄' : 'jaja ok abogada' }, { de: 'Mau', texto: 'no es mi culpa que tu página robe' }] }
      ], sig: 'j7' },
    j7: { tipo: 'dice', quien: 'iker', actores: [['yare', .3, { voltea: true }], ['iker', .68, { voltea: true }]],
      texto: s => (s.m.ikerExpuesto ? 'Me llamaron a Orientación. Ya sé que fuiste tú. No vine a pelear. ' : 'Yare. Tantito. ') + 'La escuela está revisando todas las cuentas de la prepa.', sig: 'j7b' },
    j7b: { tipo: 'dice', quien: 'iker', texto: s => tieneCapturas(s)
      ? 'Si tienes capturas de lo de confesiones, de Mari, de lo que sea… bórralas. Por fa. Si me expulsan, mi mamá me mata.'
      : 'Si te preguntan algo de confesiones, tú no viste nada, ¿va? Por fa. Si me expulsan, mi mamá me mata.', sig: 'j7c' },
    j7c: { tipo: 'elige', opciones: [
      { t: 'Borrarlas enfrente de él.', si: tieneCapturas, tej: ['iker4', 'borro'], hilo: 'Iker recordará esto.',
        fx: s => { s.m.iker4 = 'borro'; s.m.borroPorIker = true; s.rel.iker += 2; ['evidencia', 'capFalsa', 'capCom', 'evidenciaYare', 'capGemela'].forEach(k => { s.m[k] = false; }); },
        dice: [['iker', 'Gracias. Neta.'], [null, 'Borré todo lo que tenía de las cuentas de la prepa. Y ya encarrerada, también las de la página. Iker no las pidió. Yo las borré igual.']] },
      { t: '«No las borro. Pero no voy a enseñar nada donde salgas tú.»', si: tieneCapturas, tej: ['iker4', 'pacto'], fx: s => { s.m.iker4 = 'pacto'; }, dice: [['iker', '…Ok. Te creo.']] },
      { t: '«No. Si me las piden, las doy.»', si: tieneCapturas, tej: ['iker4', 'no'], fx: s => { s.m.iker4 = 'no'; s.rel.iker--; }, hilo: 'Iker recordará esto.', dice: [['iker', 'Pensé que éramos amigos.'], ['yare', 'Por eso.']] },
      { t: '«Va. No vi nada.»', si: s => !tieneCapturas(s), tej: ['iker4', 'cubre'], fx: s => { s.m.iker4 = 'cubre'; s.rel.iker++; }, dice: [['iker', 'Eres la mejor.']] },
      { t: '«Si me preguntan, digo la verdad.»', si: s => !tieneCapturas(s), tej: ['iker4', 'no'], fx: s => { s.m.iker4 = 'no'; s.rel.iker--; }, hilo: 'Iker recordará esto.', dice: [['iker', 'Ok. Ya veré.']] }
    ], sig: 'j8' },

    /* ----- Mari: lo que hiciste por ella, regresa ----- */
    j8: { tipo: 'elige', quien: 'mari', actores: [['yare', .3, { voltea: true }], ['mari', .68, { voltea: true }]],
      texto: s => (s.rel.mari || 0) >= 2 ? 'Vi los comentarios de tu página en la madrugada. Antes de que pasara nada, guardé capturas. De todos. También del que puso dónde vives.'
        : (s.rel.mari || 0) >= 0 ? 'Ah. Hola. …¿Estás bien?' : 'Ahora sabes qué se siente.',
      opciones: [
        { t: '«Gracias. No sé ni qué decir.»', si: s => (s.rel.mari || 0) >= 2, tej: ['mari4', 'ofrecio'], fx: s => { s.m.mari4 = 'ofrecio'; s.m.mariCapturas = true; s.m.pistaMau = true; },
          dice: [['mari', 'No digas nada. Nomás no las borres tú.'], ['mari', 'Otra cosa: el del candado que puso «3°B»… tiene la misma foto de perfil que la cuenta de memes, nomás recortada.']] },
        { t: '«¿Viste los comentarios de mi página?»', si: s => (s.rel.mari || 0) >= 0 && (s.rel.mari || 0) < 2, tej: ['mari4', 'pidio'], fx: s => { s.m.mari4 = 'pidio'; s.m.mariCapturas = true; s.rel.mari++; },
          dice: [['mari', 'Sí. Guardé capturas. Guardo todo, ¿no te acuerdas? Por lo de mi tía.'], ['mari', 'Te las paso. No por ti. Bueno… también por ti.']] },
        { t: '«Perdón. Por el lunes, por el martes. Por todo.»', si: s => (s.rel.mari || 0) < 0, tej: ['mari4', 'disculpa'], fx: s => { s.m.mari4 = 'disculpa'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
          dice: [['mari', '…Ya veremos.'], [null, 'No me pasó nada. Pero tampoco se fue.']] },
        { t: 'Dejarla en paz.', tej: ['mari4', 'nada'], fx: s => { s.m.mari4 = 'nada'; } }
      ], sig: s => s.m.mari3 === 'orientacion' ? 'j9' : 'j10' },
    j9: { tipo: 'dice', quien: 'lucia', escena: 'orientacion', actores: [['yare', 0, { abs: 300 }], ['lucia', 0, { abs: 820, voltea: true }]],
      alEntrar: s => { if (s.m.mauExpuesto === true && s.m.orient3 === 'actua') s.m.mauSuspendido = true; },
      texto: s => [
        s.m.mauSuspendido ? 'Mauricio está suspendido tres días y la cuenta de memes ya no existe.' : s.m.mauExpuesto === 'palabra' ? 'Hablé con Mauricio. Lo negó todo. Sin pruebas, ahí se queda.' : '',
        s.m.ikerExpuesto ? 'Hablé con Salcedo. Va a cerrar su cuenta y a disculparse con Mari, con su mamá presente.' : '',
        'Y lo tuyo, Coronel: ya vi lo de tu página. Lo de la dirección ya no es nada más asunto de la escuela.'
      ].filter(Boolean).join(' '), sig: 'j9b' },
    j9b: { tipo: 'elige', opciones: [
      { t: 'Pedirle ayuda con lo de la dirección.', tej: ['lucia4', 'ayuda'], fx: s => { s.m.lucia4 = 'ayuda'; },
        dice: [['lucia', 'La Policía Cibernética del estado recibe reportes en línea. Lleva capturas: el comentario, el perfil, la fecha. Y que tu mamá firme contigo.'], ['lucia', 'Si alguien de aquí está metido, eso sí me toca a mí.']] },
      { t: '«Ya lo tengo controlado, maestra.»', tej: ['lucia4', 'sola'], fx: s => { s.m.lucia4 = 'sola'; }, dice: [['lucia', 'Ajá. La puerta sigue abierta, Coronel.']] }
    ], sig: 'j10' },

    /* ----- La tarde: la puerta de la casa ----- */
    j10: { tipo: 'narra', escena: 'combi:atardecer', actores: [],
      alEntrar: s => { if (s.m.recuperando && s.m.paginaPerdida && !s.m.perdidaJueves && !s.m.recupero) { s.m.recupero = true; s.m.paginaPerdida = false; } },
      texto: s => s.m.recupero ? 'En la combi me llegó un correo de Facebook: «Recuperaste el acceso a Hilo Rojo · Bordados de El Encinal». Lo leí tres veces. Lo primero que hice fue cambiar la contraseña y activar la verificación en dos pasos.'
        : 'De regreso, la combi iba casi vacía. El chofer traía la radio a todo volumen; agradecí no tener que oír mis pensamientos.', sig: 'j11' },
    j11: { tipo: 'narra', escena: 'encinal', actores: [['yare', .2], ['mama', .36], ['lupita', .7, { color: COLOR_GENTE, voltea: true }], ['rocio', .84, { color: COLOR_GENTE, voltea: true }]],
      texto: 'Una camioneta blanca se paró frente a la casa. Bajaron dos señoras de Tepetlán. A una la reconocí por la foto de perfil: Rosy.', sig: 'j11b' },
    j11b: { tipo: 'dice', quien: 'rosy', texto: '¿Aquí viven las de los bordados? Venimos por nuestro dinero.', sig: 'j11c' },
    j11c: { tipo: 'elige', opciones: [
      { t: 'Salir con mamá y enseñarles las capturas y el aviso.', si: tienePruebas, tej: ['visita', 'explica'], fx: s => { s.m.visita = 'explica'; s.m.enojo = Math.max(1, s.m.enojo - 3); }, hilo: 'Rosy recordará esto.',
        dice: [['rosy', '…O sea que nos vieron la cara a todas.'], [null, 'Se quedaron una hora en la cocina. La abuela les sirvió café. Rosy se fue con el número de la Policía Cibernética y con un servilletero que la abuela le regaló.']] },
      { t: 'Explicarles lo que pasó, aunque no tengas cómo probarlo.', si: s => !tienePruebas(s), tej: ['visita', 'sinpruebas'], fx: s => { s.m.visita = 'sinpruebas'; s.m.enojo++; },
        dice: [['rosy', 'Eso dicen todos.'], [null, 'Se fueron sin gritar, pero sin creerme. Los vecinos vieron todo desde sus ventanas.']] },
      { t: 'Prometerles su pedido aunque el dinero nunca nos llegó.', tej: ['visita', 'paga'], fx: s => { s.m.visita = 'paga'; s.m.regalo = (s.m.regalo || 0) + 2; }, hilo: 'La abuela recordará esto.',
        dice: [['abuela', 'Pues ni modo, mija. Bordamos dos más.'], [null, 'Lo dijo sonriendo. Esa noche se quedó bordando hasta la una.']] },
      { t: 'Quedarte adentro. Que hable mamá.', tej: ['visita', 'adentro'], fx: s => { s.m.visita = 'adentro'; if (!s.m.familiaSabe) s.rel.mama -= 2; }, hilo: 'Mamá recordará esto.',
        dice: s => s.m.familiaSabe ? [[null, 'Mamá salió con la calma con la que sale a corretear a los perros. No sé qué les dijo; se fueron sin gritar.']]
          : [[null, 'Mamá no sabía nada. Se enteró ahí, en la puerta, frente a los vecinos. Cuando entró, no me dijo nada. Fue peor.']] }
    ], sig: 'j12' },
    j12: { tipo: 'tel', chat: 'Lupita', sub: 'en línea', avatar: 'L', hora: '20:40', boton: 'Subir al cerro', mensajes: [
      { de: 'Lupita', texto: 'Me marcó Ramiro, el de la feria 😰' },
      { de: 'Lupita', texto: 'Llegaron quejas al comité. Hoy a las 10 deciden si nos quitan el puesto' },
      { de: 'Lupita', texto: 'Dice que le marques tú, que tú eres la de la página' },
      { de: 'Lupita', texto: 'Ahí no tienes señal, ¿verdad? 😭' }
    ], sig: s => tonoViene(s) ? 'j12t' : 'j12s' },
    j12t: { tipo: 'dice', quien: 'tono', escena: 'encinal', actores: [['yare', .3], ['tono', .55]], texto: 'Yo voy contigo. Me sé el camino de las piedras.', sig: 'j13' },
    j12s: { tipo: 'narra', escena: 'encinal', actores: [['yare', .3]], texto: 'Agarré la linterna y salí sola. Toño ni levantó la vista del celular.', sig: 'j13' },

    /* ----- El cerro: subir saltando piedras hasta tener señal ----- */
    j13: { tipo: 'caminar', mundo: 'cerro', acompana: s => tonoViene(s) ? ['tono', {}] : null,
      intro: s => tonoViene(s) ? 'El cerro de la cruz. Allá arriba agarra señal. Son las 9:31. Toño va detrás de ti, platicando solo.' : 'El cerro de la cruz. Allá arriba agarra señal. Son las 9:31.',
      hud: (x) => x < 1500 ? senal(0, 'Sin señal') : x < 2800 ? senal(1, 'Una rayita… a veces') : x < 3400 ? senal(2, 'Dos rayitas') : senal(3, 'Tres rayitas'),
      puntos: [
        { x: 620, svg: '<g transform="translate(620 820)" fill="#140E1E"><rect x="-34" y="-46" width="68" height="28" rx="12"/><rect x="24" y="-66" width="26" height="26" rx="8"/><path d="M42 -66 l8 -14 l4 16z"/><rect x="-28" y="-20" width="8" height="20"/><rect x="18" y="-20" width="8" height="20"/><path d="M-34 -40 q-20 -6 -22 -24" stroke="#140E1E" stroke-width="6" fill="none"/></g>',
          ambiente: ['Grrr…', 'Guau', 'Guau, guau'], claro: true },
        { x: 1640, mira: 'Un nicho con la Virgen y una veladora prendida. Alguien subió hoy. En El Encinal siempre sube alguien.', etiqueta: 'Mirar el nicho', alto: 150, objeto: 'nicho' },
        { x: 1150, ambiente: s => tonoViene(s) ? ['Aguas, esa piedra se mueve', 'Por aquí subía con papá'] : ['(Una rayita. Ninguna. Una.)'], claro: true, voz: s => tonoViene(s) ? 'acomp' : 'yare' },
        { x: 2540, ambiente: s => tonoViene(s) ? ['¿Les van a quitar el puesto?', 'Yo le digo a Ramiro que tú no robaste nada'] : ['(¿Y si no contesta?)', '(¿Y si ya decidieron?)'], claro: true, voz: s => tonoViene(s) ? 'acomp' : 'yare' },
        { x: 2860, mira: 'Desde aquí se ven las luces de Tepetlán. Allá abajo hay ciento cuarenta personas que creen que somos rateras. Desde aquí parecen luciérnagas.', etiqueta: 'Mirar hacia Tepetlán', alto: 50, objeto: 'mirador', pose: 'lejos' },
        { x: 4120, radio: 260, interaccion: { etiqueta: 'Marcarle a Ramiro', fin: true } }
      ], sig: 'j14' },
    j14: { tipo: 'elige', quien: 'ramiro', escena: 'cima', actores: s => [['yare', .45, { cel: true }], ...(tonoViene(s) ? [['tono', .62]] : [])],
      texto: s => `¿Bueno? ¿Yaretzi? Mira, te voy a ser directo: llegaron ${4 + s.m.enojo} quejas al comité. Dicen que su página estafa. Tú dime qué pasó.`,
      opciones: [
        { t: '«Antes: el lunes, en el ciber, yo cerré su sesión. La computadora 4.»', si: s => s.m.ramiro === 'cerrada' && !s.m.confeso, fx: s => { s.m.confeso = true; },
          dice: [['ramiro', '¿Tú? …Esa misma noche alguien intentó entrar a mi cuenta desde Puebla. Si hubiera seguido abierta, los que pedían CURP habrían escrito con mi nombre.'], ['ramiro', 'Bueno. Ahora sí, cuéntame lo de tu página.']], ir: 'j14' },
        { t: 'Explicarle todo con lo que tengo.', tej: ['ramiro4', 'explica'], fx: s => { s.m.ramiro4 = 'explica'; } },
        { t: 'Decirle que nos hackearon y que ya quedó arreglado.', tej: ['ramiro4', 'hackeo'], fx: s => { s.m.ramiro4 = 'hackeo'; } }
      ], sig: 'j14b' },
    j14b: { tipo: 'dice', quien: 'ramiro',
      alEntrar: s => {
        const pruebas = ['capGemela', 'capCom', 'mariCapturas', 'gemAviso', 'aclaro', 'gemReporte', 'recupero', 'evidenciaYare'].filter(k => s.m[k]).length
          + (s.m.lupe3 === 'denuncia' ? 1 : 0) + (s.m.carla3 === 'banco' ? 1 : 0) + (s.m.visita === 'explica' ? 1 : 0);
        const puntos = pruebas + (s.m.ramiro4 === 'explica' ? 1 : -1) + (s.m.confeso ? 2 : 0) - (s.m.ramiro === 'abierta' ? 1 : 0) - (s.m.respondio ? 1 : 0);
        s.m.puntosRamiro = puntos;
        s.m.puesto = puntos >= 5 ? 'seguro' : puntos >= 3 ? 'condicional' : 'perdido';
        s.tejido.puesto = s.m.puesto;
      },
      texto: s => (s.m.ramiro4 === 'explica'
        ? (tienePruebas(s) ? 'Mándame lo que tengas. …Ajá. …Ajá. Ya lo estoy viendo. ' : 'Te creo que me lo cuentas en serio. Pero no me mandas nada. ')
        : 'Ya. «Nos hackearon.» Eso me lo dicen tres cooperativas al año. ')
        + (s.m.ramiro === 'abierta' ? 'Y te digo una cosa: el lunes a mí también me usaron el Facebook para pedir CURP. Ya ni sé en quién confiar.' : ''), sig: 'j15' },
    j15: { tipo: 'dice', quien: 'ramiro', texto: s => ({
      seguro: 'Con eso me basta. El sábado tienen su puesto, el de siempre, junto a la fuente. Y voy a pedir que en la entrada pongan un aviso: que ninguna cooperativa cobra a cuentas que no conozcan.',
      condicional: 'Les dejo el puesto, pero el sábado tu abuela trae su INE y ustedes ponen un letrero con la cuenta real y la aclaración. Si hay una queja más, se lo damos a otra cooperativa.',
      perdido: 'Lo siento, Yaretzi. Con lo que tengo, el comité no se puede arriesgar. El puesto se lo damos a las de Las Ánimas. Si consigues algo más antes del sábado, me marcas.'
    })[s.m.puesto], sig: 'j16' },
    j16: { tipo: 'narra', actores: s => [['yare', .45, { cel: true }], ...(tonoViene(s) ? [['tono', .62]] : [])], alEntrar: s => { if (s.m.puesto === 'perdido') s.m.sinPuesto = true; },
      texto: s => (tonoViene(s) ? 'Bajamos despacio. Toño iba adelante con la linterna, como si el cerro fuera suyo. ' : 'Bajé sola, contando las piedras para no pensar. ')
        + ({ seguro: 'Abajo, la abuela seguía bordando. Le dije que el sábado sí íbamos. Se persignó.', condicional: 'Abajo, le dije a la abuela que mañana teníamos que hacer un letrero. «¿Y qué le ponemos?», preguntó. «La verdad», le dije.', perdido: 'Abajo, la abuela seguía bordando. No supe cómo decirle. No le dije.' })[s.m.puesto], sig: 'j17' },
    j17: { tipo: 'diario', fecha: 'Jueves', parrafos: s => [
      s.m.perdidaJueves ? `A las 3:12 de la mañana alguien cambió el correo de la página. ${typeof PUERTA[s.m.puertaUsada] === 'function' ? PUERTA[s.m.puertaUsada](s) : PUERTA[s.m.puertaUsada] || ''}` : '',
      `La señal trajo ciento cuarenta notificaciones. ${s.m.enojo >= 6 ? 'Rateras, estafadoras, la viejita esa.' : 'Rateras, estafadoras.'} Alguien escribió dónde vivimos.`,
      [s.m.capCom && 'Guardé capturas de todo.', s.m.moderar === 'oculto' && 'Oculté los insultos.', s.m.moderar === 'elimino' && (s.m.borroSinCaptura ? 'Los borré sin guardar ni una captura.' : 'Los borré, pero ya tenía capturas.'), s.m.limito && 'Cambié quién puede comentar.', s.m.repDir && 'Reporté el comentario con la dirección.', s.m.respondio && 'Les contesté. Se pusieron peor.', s.m.aclaro && 'Publiqué una aclaración.'].filter(Boolean).join(' '),
      ({ conto: s.m.cuenta === 'todo' ? 'Le conté todo a mamá. Todo. Dice que nunca estuve sola, que nomás no le había dicho.' : 'Le conté a mamá la mitad. Ella sabe que es la mitad.', sola: 'No le dije a nadie. La abuela se enteró por doña Tere. «¿Por qué no me dijiste, mija?» No tuve respuesta.' })[s.m.familia] || '',
      ({ responde: 'En el grupo me dicen «la estafadora». Contesté. Ya tienen captura de eso también.', captura: 'En el grupo me dicen «la estafadora». Hice captura y no contesté.', silencia: 'En el grupo me dicen «la estafadora». Lo silencié. El celular boca abajo pesa.', mau: 'Le escribí a Mau que ya le parara. No le paró.' })[s.m.acoso4] || '',
      ({ borro: 'Iker me pidió que borrara mis capturas y las borré. Todas. Hasta las que no tenían que ver con él.', pacto: 'Iker me pidió que borrara mis capturas. No las borré, pero le prometí no enseñar las suyas.', no: 'Iker me pidió que borrara las capturas. Le dije que no. «Pensé que éramos amigos.» Yo también.', cubre: 'Le dije a Iker que yo no vi nada.' })[s.m.iker4] || '',
      ({ ofrecio: 'Mari guardó capturas de los comentarios antes de que yo hiciera nada. Me las pasó. «Nomás no las borres tú.»', pidio: 'Le pregunté a Mari por los comentarios. Tenía capturas. Me las pasó.', disculpa: 'Le pedí perdón a Mari. «Ya veremos.» Es más de lo que esperaba.', nada: 'Vi a Mari en el pasillo. No le dije nada.' })[s.m.mari4] || '',
      s.m.mauSuspendido ? 'Mau está suspendido. @prepalc.memes ya no existe. No sentí alegría. Sentí cansancio.' : '',
      s.m.recupero ? 'Recuperé la página. Contraseña nueva, verificación en dos pasos. Todavía me tiemblan las manos cuando entro.' : '',
      ({ explica: 'Rosy vino a la casa. Le enseñamos las capturas. Se tomó un café con la abuela.', sinpruebas: 'Rosy vino a la casa. Le expliqué, pero no tenía cómo probar nada.', paga: 'Rosy vino a la casa. Le prometimos su pedido. La abuela bordó hasta la una.', adentro: s.m.familiaSabe ? 'Rosy vino a la casa. Habló mamá.' : 'Rosy vino a la casa. Mamá se enteró de todo ahí, en la puerta.' })[s.m.visita] || '',
      ({ seguro: 'Subí al cerro a marcarle a Ramiro. Tenemos puesto.', condicional: 'Subí al cerro a marcarle a Ramiro. Tenemos puesto, con condiciones: la INE de la abuela y un letrero con la verdad.', perdido: 'Subí al cerro a marcarle a Ramiro. Nos quitaron el puesto.' })[s.m.puesto],
      s.m.confeso ? 'Le dije a Ramiro que yo cerré su sesión en el ciber. No sé por qué se lo dije justo hoy. Ayudó.' : '',
      'Falta un día para la feria. Bueno: falta el viernes, y el viernes no cuenta.'
    ], sig: 'j18' },
    j18: { tipo: 'tejido', titulo: 'El tejido de tu jueves', proximo: 'Sábado · La feria', filas: () => CAPITULO4.tejido, sueltos: s => [
      s.m.perdidaJueves && 'La página ya no es tuya desde las 3:12 del jueves.',
      s.m.recupero && 'Recuperaste la página.',
      s.m.borroSinCaptura && 'Borraste los comentarios sin guardar ni una captura.',
      s.m.mariCapturas && 'Mari tiene capturas de los comentarios, incluido el de tu dirección.',
      s.m.pistaMau && 'El perfil del candado tiene la misma foto que la cuenta de memes.',
      s.m.borroPorIker && 'Borraste tus capturas por Iker.',
      s.m.mauSuspendido && 'Mau está suspendido y @prepalc.memes ya no existe.',
      s.m.confeso && 'Ramiro sabe que fuiste tú quien cerró su sesión.',
      s.m.regalo && `La abuela tiene que bordar ${s.m.regalo} piezas que nadie les pagó.`,
      s.m.lucia4 === 'ayuda' && 'Tienes los datos de la Policía Cibernética.'
    ].filter(Boolean), sig: 's0' }
  };

  const tejido = [
    { clave: 'capCom', titulo: 'Jueves · Capturas de los comentarios', opciones: [['si', 'Guardadas'], ['no', 'Ninguna']] },
    { clave: 'moderar', titulo: 'Jueves · Los insultos', opciones: [['oculto', 'Ocultos'], ['elimino', 'Eliminados'], ['nada', 'Ahí siguen']] },
    { clave: 'limito', titulo: 'Jueves · Quién comenta', opciones: [['si', 'Solo seguidores'], ['no', 'Público']] },
    { clave: 'repDir', titulo: 'Jueves · El comentario con tu dirección', opciones: [['si', 'Reportado'], ['no', 'Sin reportar']] },
    { clave: 'respondio', titulo: 'Jueves · Contestar', opciones: [['si', 'Contestaste'], ['no', 'No contestaste']] },
    { clave: 'familia', titulo: 'Jueves · La familia', opciones: [['conto', 'Le contaste a mamá'], ['sola', 'Sola']] },
    { clave: 'cuenta', titulo: 'Jueves · Cuánto le contaste', opciones: [['todo', 'Todo'], ['medias', 'A medias']] },
    { clave: 'acoso4', titulo: 'Jueves · «La estafadora»', opciones: [['responde', 'Respondiste'], ['captura', 'Captura'], ['silencia', 'Silencio'], ['mau', 'A Mau']] },
    { clave: 'iker4', titulo: 'Jueves · Iker y las capturas', opciones: [['borro', 'Las borraste'], ['pacto', 'Pacto'], ['no', '«No»'], ['cubre', 'Lo cubres']] },
    { clave: 'mari4', titulo: 'Jueves · Mari', opciones: [['ofrecio', 'Te las dio'], ['pidio', 'Se las pediste'], ['disculpa', 'Perdón'], ['nada', 'Nada']] },
    { clave: 'lucia4', titulo: 'Jueves · Orientación', opciones: [['ayuda', 'Pediste ayuda'], ['sola', '«Ya lo tengo»']] },
    { clave: 'visita', titulo: 'Jueves · Rosy en la puerta', opciones: [['explica', 'Pruebas'], ['sinpruebas', 'Sin pruebas'], ['paga', 'Su pedido'], ['adentro', 'Habló mamá']] },
    { clave: 'ramiro4', titulo: 'Jueves · La llamada', opciones: [['explica', 'Todo'], ['hackeo', '«Ya quedó»']] },
    { clave: 'puesto', titulo: 'Jueves · El puesto en la feria', opciones: [['seguro', 'Seguro'], ['condicional', 'Con condiciones'], ['perdido', 'Perdido']] }
  ];

  return { nodos, tejido };
})();
