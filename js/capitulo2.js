/* Hilo Rojo · Capítulo 2: Martes («Señales»).
   Lee los hilos del domingo y del lunes (s.m) y deja calculado, al final, si la página
   quedó comprometida (s.m.comprometida) y por qué puertas (s.m.puertas) para el miércoles (capitulo3.js).
   Dos hilos con el mismo peso: la página (seguridad) y la foto de Mari (ciberacoso). */
const CAPITULO2 = (() => {
  /* ¿Quedó una llave en la computadora del ciber? (salió corriendo o el navegador guardó la contraseña) */
  const accesoCiber = (s) => s.m.salida === 'corrio' || s.m.guardoPass === 'guardar';
  const cambiada = (s) => !!s.m.cambio;
  /* La sesión del ciber sigue viva si nadie la cerró: ni con el aviso, ni cambiando la contraseña, ni desde el celular. */
  const sesionCiberViva = (s) => accesoCiber(s) && s.m.alerta !== 'atendida' && !s.m.cambio && !s.m.cerroCiber;
  const COLOR_GENTE = '#4A3659';

  const STICKER_MARI = `<svg viewBox="0 0 200 200" aria-label="Sticker con la cara de una chica dormida"><defs><clipPath id="st-mari"><circle cx="100" cy="100" r="86"/></clipPath></defs><circle cx="100" cy="100" r="96" fill="#fff"/><g clip-path="url(#st-mari)"><rect width="200" height="200" fill="#CDBFE0"/>${Personajes.retratoG('mari', { x: 98, y: 146, escala: 1.95, inclina: -14, exp: 'cerrados' })}</g><circle cx="100" cy="100" r="86" fill="none" stroke="#fff" stroke-width="6"/><text x="150" y="58" font-family="system-ui" font-weight="900" font-size="34" fill="#7A5AA8" stroke="#fff" stroke-width="5" paint-order="stroke">Z</text><text x="172" y="32" font-family="system-ui" font-weight="900" font-size="24" fill="#7A5AA8" stroke="#fff" stroke-width="4" paint-order="stroke">z</text></svg>`;

  /* ---------- El celular explorable (mensaje de «Meta») ---------- */
  const fila = (ir, av, nombre, texto, hora, nueva = false, clase = '') => `<button class="ap-fila ${nueva ? 'nueva' : ''}" data-ir="${ir}"><span class="ap-av ${clase}">${av}</span><span><b>${nombre}</b>${texto ? `<small>${texto}</small>` : ''}</span><em>${hora}</em></button>`;
  const ultimoCarla = (s) => s.m.cobro === 'feria' ? 'Se lo encargo a mi prima ✨' : '¡Listo! En la noche te mando el comprobante ✨';
  const MANTEL = `<svg class="ap-foto" viewBox="0 0 320 180" aria-label="Foto de un mantel bordado con flores rojas"><rect width="320" height="180" fill="#F4ECE1"/><rect x="18" y="16" width="284" height="148" rx="4" fill="#FBF6EE" stroke="#E0303F" stroke-width="3" stroke-dasharray="7 5"/>${[60, 160, 260].map(x => `<g transform="translate(${x} 90)">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="9" ry="20" cy="-18" fill="#E0303F" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#F2B880"/><path d="M-30 30 q15 -14 30 0 q15 14 30 0" stroke="#5B8C5A" stroke-width="3" fill="none"/></g>`).join('')}<text x="290" y="154" text-anchor="end" font-family="Georgia, serif" font-style="italic" font-size="15" fill="#E0303F">Chela</text></svg>`;
  const chatCliente = (nombre, av, msjs) => `<div class="ap-cab-chat"><span class="ap-av">${av}</span><span><b>${nombre}</b><small>Clienta de la página</small></span></div>
    <div class="ap-msjs">${msjs.map(([yo, t]) => `<div class="ap-burbuja cliente ${yo ? 'yo' : ''}">${t}</div>`).join('')}</div><div class="ap-input">Escribe un mensaje…</div>`;

  /* Un chat con candado en la bandeja. Dentro del juego no hay ninguna pista de la clave: el código no la guarda,
     solo su huella, y el mensaje se descifra con lo que se escribe. */
  const CANDADO = { huella: 'xuh8cy', sello: 'KRRPHgAuPSKa4E0YEUVmJ2JhYteM3ZO5v762oY6cmQ==' };
  const huella = (t) => { let h = 0x811c9dc5; for (const c of t) { h ^= c.charCodeAt(0); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(36); };
  const abrirSello = (k) => { const kb = new TextEncoder().encode(k); return new TextDecoder().decode(Uint8Array.from(atob(CANDADO.sello), (c, i) => c.charCodeAt(0) ^ kb[i % kb.length] ^ (i * 7 & 255))); };
  const enfocarClave = () => setTimeout(() => document.querySelector('.app-cuerpo .ap-clave')?.focus(), 30);
  /* lo que Yare piensa en este chat no cuenta como pista del mensaje de «Meta» */
  const pensarAparte = (est, api, id, texto) => { api.pensar(id, texto, false, true); est.pensados.delete(id); };

  const APP_META = {
    tipo: 'app', marca: 'pistas', pila: ['bandeja', 'chatMeta'],
    texto: 'Antes de la última clase te llega un mensaje a la página. Uno con palomita azul.',
    indica: 'Puedes moverte por la app: chats, perfiles, notificaciones, el menú. Lo que Yare piensa aparece aquí.',
    tabs: [['bandeja', '💬 Mensajes'], ['notifs', '🔔 Avisos'], ['menu', '☰ Menú']],
    pantallas: {
      bandeja: { titulo: 'Mensajes · Hilo Rojo', tab: 'bandeja', pensar: 'Ahí está, entre Sofía y Ernesto. Como un mensaje más.', cuerpo: s => `<div class="ap-lista">
        ${fila('chatMeta', '∞', 'Meta Pro Support <span class="ap-palomita">✔</span>', 'Tu página infringe nuestras normas de derechos…', '13:02', true, 'meta')}
        ${fila('chatSofia', 'S', 'Sofía G.', '¿Precio del mantel grande? 😍', '12:40', true)}
        ${fila('chatErnesto', 'E', 'Ernesto Cal', '¿Hacen envíos a Puebla?', '11:15')}
        <button class="ap-fila" data-a="verArtur"><span class="ap-av artur">A</span><span><b>Artur</b><small>🔒 Chat con contraseña</small></span><em>2:47</em></button>
        ${fila('chatCarla', 'C', 'Carla Méndez', ultimoCarla(s), 'Ayer')}
      </div>` },
      chatMeta: { titulo: 'Meta Pro Support', tab: 'bandeja', cuerpo: `
        <div class="ap-cab-chat"><span class="ap-av meta">∞</span><span><button class="pz" data-p="palomita">Meta Pro Support <span class="ap-palomita">✔</span></button><small>Servicio de asistencia</small></span><button class="ap-btn sec chico" data-ir="perfilMeta">Ver perfil</button></div>
        <div class="ap-msjs">
          <p class="ap-fecha">Hoy 13:02</p>
          <button class="ap-burbuja" data-p="texto">Tu página <b>Hilo Rojo · Bordados de El Encinal</b> infringe nuestras normas de derechos de autor por el uso de imágenes protegidas.</button>
          <button class="ap-burbuja" data-p="prisa">Si crees que se trata de un error, apela en las próximas <b>24 horas</b> o la página se desactivará de forma permanente.</button>
          <button class="ap-burbuja ap-link" data-ir="enlace">🔗 meta-business.help/appeal/hilorojo<small>Apelación · Meta Business</small></button>
        </div><div class="ap-input">Escribe un mensaje…</div>` },
      enlace: { titulo: 'Enlace', tab: 'bandeja', pensar: 'meta-business.help… ¿Meta tiene páginas con otros nombres? Supongo que las empresas grandes tienen muchas.', cuerpo: `
        <div class="ap-hoja"><p class="ap-url">https://meta-business.help/appeal/hilorojo</p>
        <button class="ap-btn" data-elige="abrir">Abrir enlace</button><button class="ap-btn sec" data-p="copiar">Copiar enlace</button><button class="ap-btn sec" data-atras>Cancelar</button></div>` },
      perfilMeta: { titulo: 'Meta Pro Support', tab: 'bandeja', pensar: 'Treinta y un seguidores. Bueno, la página de la abuela tiene doce y es de verdad.', cuerpo: `
        <div class="ap-perfil"><span class="ap-av meta">∞</span><b>Meta Pro Support <span class="ap-palomita">✔</span></b><small>Servicio de asistencia · 31 seguidores</small></div>
        <p class="ap-seccion">Información</p>
        <button class="ap-dato" data-p="creada">📅 Página creada el 23 de octubre de 2026</button>
        <button class="ap-dato" data-p="categoria">🏷️ Categoría: Videojuego</button>
        <p class="ap-seccion">Publicaciones</p>
        <button class="ap-post" data-p="post"><b>Meta Pro Support</b><br>🔒 Protegemos a los creadores. Si recibiste un aviso, apela a tiempo para conservar tu página.</button>` },
      chatSofia: { titulo: 'Sofía G.', tab: 'bandeja', pensar: 'Sofía pregunta un precio. «Meta» amenaza con cerrar todo. Los dos mensajes llegan al mismo lugar.', cuerpo: chatCliente('Sofía G.', 'S', [[0, 'Hola! ¿Precio del mantel grande? 😍'], [0, '¿Lo tienen en azul?']]) },
      chatErnesto: { titulo: 'Ernesto Cal', tab: 'bandeja', cuerpo: chatCliente('Ernesto Cal', 'E', [[0, '¿Hacen envíos a Puebla?'], [1, 'Hola! Por ahora solo entregamos en la feria de Tepetlán 🙏']]) },
      chatArtur: { titulo: 'Artur', tab: 'bandeja', cuerpo: (s, est) => est.artur ? `
        <div class="ap-cab-chat"><span class="ap-av artur">A</span><span><b>Artur</b><small>Activo hace 2 min</small></span></div>
        <div class="ap-msjs"><p class="ap-fecha">Hoy 2:47</p><div class="ap-burbuja cliente">${est.artur}</div><p class="ap-escribe">Artur está escribiendo…</p></div><div class="ap-input">Escribe un mensaje…</div>` : `
        <div class="ap-candado"><span class="ap-av artur">A</span><b>Artur</b><small>🔒 Este chat tiene contraseña</small>
          <input class="ap-clave" type="password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Contraseña" aria-label="Contraseña del chat" onkeydown="if (event.key === 'Enter') { event.preventDefault(); this.nextElementSibling.click(); }">
          <button class="ap-btn" data-a="artur">Entrar</button>
          ${est.arturMal ? '<p class="ap-error">Contraseña incorrecta</p>' : ''}</div>` },
      chatCarla: { titulo: 'Carla Méndez', tab: 'bandeja', cuerpo: s => chatCliente('Carla Méndez', 'C', [[0, 'Quiero el mantel grande de flores rojas y dos servilleteros'], [1, 'Te lo aparto 🙌'], [0, ultimoCarla(s)]]) },
      notifs: { titulo: 'Avisos', tab: 'notifs', recordar: true, pensar: 'Puros me gusta y comentarios. Si hubiera un problema con la página, ¿no saldría aquí?', cuerpo: s => `<div class="ap-lista">
        ${fila('postFlores', '❤', 'A Sofía G. le gustó tu foto', '«Mantel de flores rojas»', '12:38')}
        ${fila('postFlores', '💬', 'Ernesto Cal comentó tu foto', '«¿Hacen envíos?»', '11:14')}
        ${fila('pagina', '⭐', 'Tu página llegó a 12 me gusta', 'Sigue publicando', 'Ayer')}
        ${fila('chatCarla', '✉', 'Carla Méndez te envió un mensaje', `«${ultimoCarla(s)}»`, 'Ayer')}</div>` },
      postFlores: { titulo: 'Publicación', tab: 'notifs', pensar: 'Nueve me gusta en una foto que tomé con el celular rayado. La abuela no me lo va a creer.', cuerpo: `
        <div class="ap-post-real"><div class="ap-cab-chat"><span class="ap-av hilo">🧵</span><span><b>Hilo Rojo · Bordados de El Encinal</b><small>Domingo · 🌎</small></span></div>
        <p>Mantel de flores rojas, bordado a mano por doña Chela 🌺 Lo apartamos por mensaje y lo entregamos en la Feria del Bordado de Tepetlán.</p>${MANTEL}
        <p class="ap-reac">❤️ 9 · 3 comentarios</p></div>
        <div class="ap-comentarios">
          <p><b>Ernesto Cal</b> ¿Hacen envíos?</p>
          <p class="resp"><b>Hilo Rojo · Bordados de El Encinal</b> Por ahora solo en la feria de Tepetlán 🙏</p>
          <p><b>Sofía G.</b> Qué bonito 😍 ¿lo tienen en azul?</p>
        </div>` },
      pagina: { titulo: 'Hilo Rojo', tab: 'notifs', pensar: 'Doce me gusta. Mi tía, Lupita, Sofía… y unas personas que no conozco y que sí quieren un mantel.', cuerpo: `
        <div class="ap-perfil"><span class="ap-av hilo">🧵</span><b>Hilo Rojo · Bordados de El Encinal</b><small>Artesanías · 12 me gusta · 14 seguidores</small></div>
        <p class="ap-seccion">Información</p>
        <div class="ap-dato">📅 Página creada el 25 de octubre de 2026</div>
        <div class="ap-dato">📍 El Encinal, Tepetlán</div>
        <p class="ap-seccion">Publicaciones</p>
        <button class="ap-fila" data-ir="postFlores"><span class="ap-av hilo">🧵</span><span><b>Mantel de flores rojas</b><small>Domingo · ❤️ 9</small></span></button>` },
      menu: { titulo: 'Menú · Hilo Rojo', tab: 'menu', cuerpo: `<div class="ap-lista">
        ${fila('calidad', '✓', 'Calidad de la página', 'Restricciones e infracciones', '')}
        ${fila('seguridad', '🔐', 'Configuración y seguridad', 'Contraseña, verificación, sesiones', '')}
        ${fila('ayuda', '?', 'Centro de ayuda', 'Buscar en la ayuda', '')}</div>` },
      calidad: { titulo: 'Calidad de la página', tab: 'menu', recordar: true, pensar: 'Aquí dice que todo está bien. ¿O será que el aviso todavía no se actualiza?', cuerpo: `
        <div class="ap-estado"><span class="ok">✅</span><span><b>Tu página no tiene restricciones</b><small>Hilo Rojo · Bordados de El Encinal</small></span></div>
        <div class="ap-estado"><span>🗂️</span><span><b>Contenido eliminado</b><small>Ninguno</small></span></div>
        <div class="ap-estado"><span>©️</span><span><b>Infracciones de derechos de autor</b><small>Ninguna</small></span></div>` },
      seguridad: { titulo: 'Configuración y seguridad', tab: 'menu', cuerpo: s => `
        <p class="ap-seccion">Inicio de sesión</p>
        <div class="ap-estado"><span>🔑</span><span><b>Contraseña</b><small>${s.m.cambio ? 'Cambiada hoy' : 'Cambiada hace 2 días'}</small></span>${s.m.cambio ? '<span class="ap-hecho">✓</span>' : '<button class="ap-btn sec chico" data-ir="cambiar">Cambiar</button>'}</div>
        <div class="ap-estado"><span>📲</span><span><b>Verificación en dos pasos</b><small>${s.m.dosPasos ? 'Activada · te pedirá un código por SMS' : 'Desactivada'}</small></span>${s.m.dosPasos ? '<span class="ap-hecho">✓</span>' : '<button class="ap-btn sec chico" data-a="dos">Activar</button>'}</div>
        <button class="ap-fila" data-ir="sesiones"><span class="ap-av">💻</span><span><b>Dónde iniciaste sesión</b><small>Dispositivos con tu cuenta abierta</small></span></button>` },
      cambiar: { titulo: 'Cambiar contraseña', tab: 'menu', cuerpo: `
        <div class="ap-articulo">Facebook cerrará la sesión en los demás dispositivos al guardar la nueva contraseña.</div>
        <button class="ap-btn" data-a="fuerte">Una nueva y larga que solo yo sepa</button>
        <button class="ap-btn sec" data-a="numero">La misma con un número más al final</button>
        <button class="ap-btn sec" data-atras>Cancelar</button>` },
      sesiones: { titulo: 'Dónde iniciaste sesión', tab: 'menu', recordar: true, pensar: s => sesionCiberViva(s) ? '¿Windows? Yo no tengo computadora.' : 'Solo mi celular. Eso creo.', cuerpo: s => `
        <div class="ap-estado"><span>📱</span><span><b>Este teléfono · Android</b><small>Tepetlán · Activo ahora</small></span></div>
        ${sesionCiberViva(s) ? `<div class="ap-estado"><span>💻</span><span><b>Windows · Chrome</b><small>Tepetlán · ${s.m.salida === 'corrio' ? 'Ayer 19:12' : 'Hoy 6:31'}</small></span><button class="ap-btn sec chico" data-a="cerrarCiber">Cerrar sesión</button></div>` : ''}
        ${s.m.cerroCiber ? '<div class="ap-estado"><span>💻</span><span><b>Windows · Chrome</b><small>Sesión cerrada</small></span></div>' : ''}` },
      ayuda: { titulo: 'Centro de ayuda', tab: 'menu', cuerpo: `<div class="ap-lista">
        ${fila('ayudaApelar', '📄', 'Cómo apelar una decisión sobre tu página', 'Calidad de la página', '')}
        ${fila('ayudaMensajes', '📄', 'Mensajes que dicen ser de Meta', 'Seguridad', '')}
        ${fila('ayudaContrasena', '📄', 'Cómo crear una contraseña segura', 'Seguridad', '')}</div>` },
      ayudaApelar: { titulo: 'Ayuda', tab: 'menu', cuerpo: `<div class="ap-articulo"><h4>Cómo apelar una decisión</h4>Si tu página tiene una restricción, la verás en <b>Calidad de la página</b>. Desde ahí puedes solicitar una revisión.</div>` },
      ayudaMensajes: { titulo: 'Ayuda', tab: 'menu', recordar: true, pensar: 'Eso dice la ayuda. Aunque el mensaje también dice que es de Meta.', cuerpo: `<div class="ap-articulo"><h4>Mensajes que dicen ser de Meta</h4>Algunas personas se hacen pasar por Meta para robar cuentas. Meta no te pedirá tu contraseña por mensaje. Los avisos sobre tu página aparecen en <b>Calidad de la página</b> y en tus notificaciones.</div>` },
      ayudaContrasena: { titulo: 'Ayuda', tab: 'menu', cuerpo: `<div class="ap-articulo"><h4>Contraseñas seguras</h4>Usa una contraseña larga, distinta para cada cuenta y que no incluya datos que otras personas conozcan de ti. Activa la verificación en dos pasos.</div>` }
    },
    piezas: {
      palomita: '¿La palomita de verificado se veía así? Juraría que era un círculo azul… o no. Nunca me había fijado.',
      texto: 'Las fotos son del mantel de la abuela. ¿Y si alguien las reportó como suyas? He visto que pasa.',
      prisa: 'Veinticuatro horas. Si de verdad la cierran, nos quedamos sin feria.',
      copiar: 'Copiar el enlace no me dice nada nuevo. Sigue siendo el mismo enlace.',
      creada: 'Creada hace cuatro días. ¿Las páginas de ayuda se crean así de nuevas? Igual la abrieron para esta temporada.',
      categoria: '¿Videojuego? Seguro lo pusieron sin fijarse. O no.',
      post: 'Una sola publicación. Dice lo mismo que el mensaje, pero con más emojis.'
    },
    acciones: {
      fuerte: (s, e, api) => { s.m.cambio = 'fuerte'; api.hilo('La contraseña nueva solo está en tu cabeza.'); api.pensar('a:fuerte', 'Listo. Una que ni Lupita va a poder adivinar.'); api.atras(); },
      numero: (s, e, api) => { s.m.cambio = 'numero'; api.hilo('La contraseña nueva se parece mucho a la vieja.'); api.pensar('a:numero', 'Un número más. Con eso basta. ¿Verdad?'); api.atras(); },
      dos: (s, e, api) => { s.m.dosPasos = true; api.hilo('Desde hoy, entrar a la página pide un código que llega a tu celular.'); api.pensar('a:dos', 'El código llegó al tercer intento. La señal en la prepa tampoco perdona.'); },
      cerrarCiber: (s, e, api) => { s.m.cerroCiber = true; api.hilo('Cerraste la sesión de esa computadora.'); api.pensar('a:ciber', 'Cerrada. Ojalá no sea tarde.'); },
      verArtur: (s, est, api) => {
        api.ir('chatArtur');
        if (!est.artur) { pensarAparte(est, api, 'artur:abre', 'Cierto, no me acordaba que le puse contraseña a este chat. ¿Cómo era…?'); enfocarClave(); }
      },
      artur: (s, est, api) => {
        const k = (document.querySelector('.app-cuerpo .ap-clave')?.value || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
        if (!k) { pensarAparte(est, api, 'artur:vacia', 'Primero tendría que acordarme.'); enfocarClave(); return; }
        if (huella(k) === CANDADO.huella) { est.artur = abrirSello(k); est.arturMal = 0; pensarAparte(est, api, 'artur:si', 'Ay, Artur. Otra vez.'); return; }
        est.arturMal = (est.arturMal || 0) + 1;
        pensarAparte(est, api, 'artur:no', ['No. Esa no era.', 'Tampoco. ¿Qué le habré puesto?', 'Ni me acuerdo para qué le puse candado.'][Math.min(est.arturMal, 3) - 1]);
        enfocarClave();
      }
    },
    opciones: [
      { id: 'abrir', t: 'Abrir el enlace y apelar.', tej: ['meta', 'enlace'], fx: s => { s.m.meta = 'enlace'; }, ir: 'm11' },
      { t: 'Mandárselo a Lupita para ver qué opina.', ir: 'm10l' },
      { t: 'Reportar el chat como estafa.', tej: ['meta', 'reporto'], fx: s => { s.m.meta = 'reporto'; }, hilo: 'Facebook dijo que revisaría el chat.', ir: 'm12r' },
      { t: 'Dejarlo así y guardar el celular.', tej: ['meta', 'ignoro'], fx: s => { s.m.meta = 'ignoro'; }, ir: 'm13' }
    ]
  };

  const nodos = {
    m0: { tipo: 'titulo', sup: 'Capítulo 2', titulo: 'Martes', sub: 'Señales · faltan cuatro días para la feria', sig: 'm1' },
    m1: { tipo: 'narra', escena: 'combi', actores: [], texto: s => {
      let t = '';
      if (s.m.combi === false) t = s.m.mintio
        ? 'Mamá desayunó parada, sin mirarme. Lo de «la tarea con Iker» no se le olvidó; a mamá no se le olvida nada. '
        : 'Mamá desayunó parada, sin mirarme. No estaba enojada por la combi: estaba cansada de ir por mí. ';
      return t + 'En la combi de las 6:20 el celular despertó en la subida del cerro, como siempre, y empezó a escupir notificaciones atrasadas.';
    }, sig: s => accesoCiber(s) ? 'm2' : 'm4' },

    /* ----- Hilo del ciber: alguien entró con tu cuenta ----- */
    m2: { tipo: 'tel', app: 'fb', chat: 'Facebook', sub: 'Seguridad de la cuenta', avatar: 'f', hora: '6:52', mensajes: [
      { de: 'Facebook', texto: s => `Nuevo inicio de sesión en tu cuenta.\n**Windows · Chrome · Tepetlán**\n${s.m.salida === 'corrio' ? 'Ayer a las 19:12' : 'Hoy a las 6:31'}\n\n¿Fuiste tú?` }
    ], opciones: [
      { t: 'Sí, fui yo.', tej: ['alerta', 'ignorada'], fx: s => { s.m.alerta = 'ignorada'; }, hilo: 'Facebook recordará tu respuesta.' },
      { t: 'No fui yo.', tej: ['alerta', 'atendida'], fx: s => { s.m.alerta = 'atendida'; s.m._volver = 'm3'; }, ir: 'mc' }
    ], sig: 'm3' },
    m3: { tipo: 'narra', texto: s => s.m.alerta === 'ignorada'
      ? 'Guardé el celular. A esa hora de la mañana ya no sabía bien qué había hecho ayer y qué no.'
      : 'Tardé el resto del camino. La señal se fue dos veces en la curva del panteón y en las dos pensé lo mismo: ¿quién?', sig: 'm4' },

    /* Cambio de contraseña: se llega desde la alerta o desde el cuaderno (también se puede hacer en el celular explorable). */
    mc: { tipo: 'elige', texto: 'Facebook te pide una contraseña nueva y ofrece cerrar la sesión en los demás dispositivos.', opciones: [
      { t: 'Una nueva y larga que solo yo sepa, y activar la verificación en dos pasos.', fx: s => { s.m.cambio = 'fuerte'; s.m.dosPasos = true; }, hilo: 'Desde hoy, entrar a la página pide un código que llega a tu celular.',
        dice: [[null, 'El código llegó al tercer intento. La señal no perdona, ni siquiera cuando haces las cosas bien.']] },
      { t: 'Una nueva y larga que solo yo sepa.', fx: s => { s.m.cambio = 'fuerte'; }, hilo: 'La contraseña nueva solo está en tu cabeza.' },
      { t: 'La de siempre con un número más al final. No tengo cabeza para otra.', fx: s => { s.m.cambio = 'numero'; }, hilo: 'La contraseña nueva se parece mucho a la vieja.',
        dice: [[null, 'Un número más. Listo. Me dije que con eso bastaba, como quien le pone otro candado chiquito a la misma puerta.']] }
    ], sig: s => s.m._volver },

    /* ----- La prepa: la foto de Mari, un día después ----- */
    m4: { tipo: 'narra', escena: 'prepa', actores: [['yare', .35, { voltea: true }]], texto: s => ({
      publicada: 'En la entrada alguien hizo un ronquido cuando pasó Mari. Tres se rieron. Ella se acomodó la mochila y siguió caminando, como si caminar rápido la hiciera invisible.',
      tapada: 'En la entrada alguien hizo un ronquido cuando pasó Mari. El gatito no había servido de nada: en los comentarios ya habían escrito su nombre completo.',
      defendida: 'Iker no me esperó en la reja. Lo encontré en las escaleras, con el celular en la mano y cara de «te lo dije».'
    })[s.m.mari || 'publicada'], sig: s => s.m.mari === 'defendida' ? 'm5' : 'mw' },
    m5: { tipo: 'dice', quien: 'iker', actores: [['yare', .3, { voltea: true }], ['iker', .7, { voltea: true }]], texto: 'La subió @prepalc.memes anoche. La misma foto, otro texto. ¿Ves? Si no la subo yo, la sube otro. Y ellos ni la taparon.', sig: 'm5b' },
    m5b: { tipo: 'elige', opciones: [
      { t: '«Repórtala conmigo. Ahorita.»', tej: ['iker2', 'reportar'], fx: s => { s.m.iker2 = 'reportar'; s.rel.iker++; },
        dice: [['iker', '…Va. Pero nomás porque me lo pides tú.'], [null, 'La reportamos los dos. A la hora del recreo ya no estaba. Alguien, seguro, ya la había guardado.']] },
      { t: '«Que la suba otro no la hace menos mala.»', tej: ['iker2', 'reclamo'], fx: s => { s.m.iker2 = 'reclamo'; s.rel.iker--; }, hilo: 'Iker recordará esto.',
        dice: [['iker', 'Ay, ya, Yare. No soy el villano de tu película.']] }
    ], sig: 'mw' },

    /* ----- El recreo: se camina libremente por el patio hasta la jardinera de Mari ----- */
    mw: { tipo: 'caminar', mundo: 'patio', intro: 'Recreo. Mari está sentada en la jardinera del fondo, sola.',
      puntos: [
        { x: 900, figuras: [['iker', -80, { color: COLOR_GENTE, escala: .95 }], ['lupita', 5, { color: COLOR_GENTE, voltea: true, cel: true }], ['rocio', 90, { color: COLOR_GENTE, voltea: true, escala: .97 }]],
          ambiente: ['¿Ya viste el sticker?', 'Jajaja ronca bien feo', 'Ya lo pusieron en el de 3°C también', 'Es la de Las Ánimas, ¿no?'],
          interaccion: { etiqueta: 'Decir algo', texto: 'Tres de 3°A se pasan un celular. En la pantalla, la cara de Mari dormida, con un «ZZZ» encima.', opciones: [
            { t: '«Ya bájenle. Ella ni se puede defender.»', tej: ['patio', 'defendio'], fx: s => { s.m.patio = 'defendio'; s.m.yareMarcada = true; }, hilo: 'El grupito de 3°A recordará esto.', tras: [[1, 'baja']],
              dice: [['Uno de 3°A', 'Uy, perdón, la abogada.'], ['Otra de 3°A', 'Ya pues, ni que fuera tu amiga.']] },
            { t: 'Reírte, para no desentonar.', tej: ['patio', 'rio'], fx: s => { s.m.patio = 'rio'; },
              dice: [['Otra de 3°A', '¿Verdad que sí parece?'], [null, 'Me reí. Una risa corta, de esas que una hace para que no la miren raro.']] },
            { t: 'Seguir caminando.', tej: ['patio', 'nada'], fx: s => { s.m.patio = 'nada'; } }
          ] } },
        { x: 1410, svg: '<rect x="1398" y="749" width="24" height="9" rx="2" fill="#CFEFFF"/><circle cx="1410" cy="753" r="22" fill="#CFEFFF" opacity=".22"/>',
          interaccion: { etiqueta: 'Ver el celular de la banca', texto: 'Alguien dejó un celular en la banca, boca arriba y desbloqueado. En la pantalla: «@prepalc.memes · 3 solicitudes nuevas».', opciones: [
            { t: 'Ver de quién es la cuenta.', tej: ['celular', 'fisgo'], fx: s => { s.m.celular = 'fisgo'; }, hilo: 'Sabes algo que no deberías saber.',
              dice: [[null, 'La sesión era de «Mauricio R.», de 3°B. El que el lunes gritaba «SÍ SÚBELA» en el grupo. Bloqueé la pantalla y lo dejé donde estaba, como si nada.']] },
            { t: 'Llevarlo a prefectura sin abrir nada.', tej: ['celular', 'prefectura'], fx: s => { s.m.celular = 'prefectura'; }, hilo: 'En prefectura recordarán quién lo llevó.', tras: [['svg', 'oculta']],
              dice: [['Prefecto', 'A ver… ¿y esto? Ahorita veo de quién es. Gracias, Coronel.']] },
            { t: 'Dejarlo ahí. No es mío.', tej: ['celular', 'dejo'], fx: s => { s.m.celular = 'dejo'; } }
          ] } },
        { x: 1150, mira: 'El tablero de avisos: «Concurso de ofrendas», «Se busca USB negra», «Taller de ciudadanía digital: cupo limitado». Nadie se ha inscrito.', etiqueta: 'Mirar el tablero', alto: 318, objeto: 'tablero' },
        { x: 2080, figuras: [['lupita', -45, { color: COLOR_GENTE, voltea: true }], ['rocio', 45, { color: COLOR_GENTE }]],
          ambiente: ['Dicen que Mari ya ni quiere venir', 'Pobre… pero tampoco es para tanto, ¿no?', 'Si fuera yo, me cambio de escuela', 'Ayer le escribieron cosas en su Face'] },
        { x: 3150, figuras: [['iker', 0, { voltea: true }]],
          ambiente: s => [s.m.mari === 'defendida' ? '¡Yare! ¿A dónde vas tan seria?' : '¡Yare! Ven tantito'], claro: true,
          interaccion: { etiqueta: 'Hablar con Iker', texto: 'Iker ve hacia la jardinera, luego a ti. Baja la voz.', opciones: [
            { t: '«Voy con Mari. Si me pregunta algo, no le voy a mentir.»', tej: ['ikerPatio', 'aviso'], fx: s => { s.m.ikerPatio = 'aviso'; s.rel.iker--; }, hilo: 'Iker recordará esto.', dice: [['iker', '…Ok. Haz lo que quieras, Yare.']] },
            { t: '«Tranquilo. No voy a decir nada.»', tej: ['ikerPatio', 'cubre'], fx: s => { s.m.ikerPatio = 'cubre'; s.rel.iker++; }, hilo: 'Iker recordará esto.', dice: [['iker', 'Eres la mejor. Neta.']] },
            { t: '«Bórrala. La foto, la cuenta, todo.»', tej: ['ikerPatio', 'borrar'], fx: s => { s.m.ikerPatio = 'borrar'; },
              dice: [['iker', '¿Y luego? Ya la tiene medio mundo. Borrarla no la desaparece.'], [null, 'Tenía razón otra vez. Odio cuando tiene razón.']] }
          ] } },
        { x: 2560, mira: 'El bebedero lleva roto desde que entré. Alguien le pegó un papel: «no sirve». Abajo, con otra letra: «como el de la dire».', etiqueta: 'Mirar el bebedero', alto: 86, objeto: 'bebedero' },
        { x: 3990, radio: 220, figuras: [['mari', 0, { voltea: true, pose: 'sentada' }]], interaccion: { etiqueta: 'Sentarte junto a Mari', fin: true } }
      ],
      alSalir: s => { s.m.patio = s.m.patio || 'nada'; s.tejido.patio = s.m.patio; s.m.celular = s.m.celular || 'dejo'; s.tejido.celular = s.m.celular; },
      sig: 'm6' },
    m6: { tipo: 'narra', escena: 'jardinera', actores: [['yare', .4, { pose: 'sentada', abs: 690 }], ['mari', .6, { pose: 'sentada', come: true, abs: 900 }]], texto: 'Me senté junto a ella. Mari comía despacio, a mordidas chiquitas, como quien no tiene hambre. Dejó la torta a un lado y me miró.', sig: 'm7' },
    m7: { tipo: 'dice', quien: 'mari', texto: s => s.m.mari === 'defendida'
      ? 'Tú te juntas con Iker, ¿verdad? Alguien subió una foto mía a @prepalc.memes. ¿Sabes quién maneja esas cuentas?'
      : 'Tú te juntas con Iker, ¿verdad? ¿Sabes quién maneja @confesiones.prepalc? Nomás quiero que la bajen.', sig: 'm8' },
    m8: { tipo: 'elige', tiempo: 8, texto: 'Mari espera. No parpadea.',
      silencio: { tej: ['mari2', 'silencio'], fx: s => { s.m.mari2 = 'silencio'; s.rel.mari--; }, hilo: 'Mari recordará esto.', dice: [['mari', 'Ok. Gracias de todos modos.'], [null, 'Se fue antes de que sonara el timbre.']] },
      opciones: [
        { t: s => s.m.mari === 'defendida' ? '«La de confesiones la maneja Iker. Esta no sé de quién es.»' : '«Es Iker.»', tej: ['mari2', 'verdad'], fx: s => { s.m.mari2 = 'verdad'; s.m.mariSabe = true; s.rel.mari += 2; }, hilo: 'Mari recordará esto.',
          dice: [['mari', '…Gracias.'], [null, 'No dijo nada más. Guardó el celular como quien guarda algo que va a necesitar después.']] },
        { t: '«No sé, pero te ayudo a reportar la publicación.»', tej: ['mari2', 'ayuda'], fx: s => { s.m.mari2 = 'ayuda'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
          dice: [['mari', 'Ya la reporté como veinte veces. Dicen que «no infringe las normas».'], ['mari', 'Igual gracias.']] },
        { t: '«Ni idea, perdón.»', tej: ['mari2', 'mintio'], fx: s => { s.m.mari2 = 'mintio'; }, hilo: 'Mari recordará esto.',
          dice: [['mari', 'Ok.'], [null, 'Lo dijo como si ya supiera la respuesta y nomás quisiera ver qué decía yo.']] }
      ], sig: 'm10' },

    /* ----- El mensaje con palomita azul: celular explorable ----- */
    m10: APP_META,
    m10l: { tipo: 'tel', chat: 'Lupita', sub: 'en línea', avatar: 'L', hora: '13:05', mensajes: [
      { de: 'yo', texto: '📷 *Captura del mensaje*' },
      { de: 'Lupita', texto: 'AY NO 😱' },
      { de: 'Lupita', texto: 'Apela rápido, no nos vayan a cerrar la página justo esta semana' },
      { de: 'Lupita', texto: '¿Quieres que lo haga yo? Pásame el link, estoy en mi descanso' }
    ], opciones: [
      { t: 'Mejor lo veo yo.', respuesta: [{ de: 'Lupita', texto: 'Ok pero rápido 🙏' }], ir: 'm10' },
      { t: 'Va, hazlo tú.', yo: 'meta-business.help/appeal/hilorojo', tej: ['meta', 'lupita'], fx: s => { s.m.meta = 'lupita'; s.m.phish = 'lupita'; }, hilo: 'Lupita dijo que ya quedó.',
        respuesta: [{ de: 'Lupita', texto: 'Listo, ya apelé 😮‍💨' }, { de: 'Lupita', texto: 'Me pidió la contraseña y todo, se ve bien oficial' }], ir: 'm11x' }
    ] },
    m11: { tipo: 'revisar', marca: 'pistasLogin', app: 'web', cabecera: '🔒 meta-business.help/appeal/login',
      texto: 'Se abre una página azul, limpia, con tu correo ya escrito.', indica: 'Toca cualquier parte de la página para fijarte mejor.',
      partes: [
        { id: 'url', html: '<span class="barra-url">🔒 meta-business.help/appeal/login</span>', nota: 'Tiene candadito. Eso es bueno… ¿o nomás quiere decir otra cosa?' },
        { id: 'logo', html: '<span class="logo-meta">∞ Meta</span>', nota: 'El logo se ve medio borroso. Será mi pantalla: está rayada desde que se me cayó en la combi.' },
        { id: 'form', html: 'Para continuar con tu apelación, confirma que eres la administradora de la página.<div class="campo-f">yarecoronel.bordados@correo.mx</div><div class="campo-f">Contraseña</div>', nota: 'Ya tiene mi correo escrito. Bueno, si es Meta, claro que lo tiene. ¿No?' }
      ],
      opciones: [
        { t: 'Escribir la contraseña y continuar.', tej: ['enlace', 'contraseña'], fx: s => { s.m.enlace = 'contraseña'; }, ir: s => s.m.dosPasos ? 'm11c' : 'm11x' },
        { t: 'Cerrar la pestaña.', tej: ['enlace', 'cerro'], fx: s => { s.m.enlace = 'cerro'; }, hilo: 'No sabes bien por qué la cerraste.', ir: 'm13' }
      ] },
    m11c: { tipo: 'elige', texto: 'La página dice: «Te enviamos un código de 6 dígitos. Escríbelo para terminar tu apelación». En ese momento llega un SMS: «Tu código de Facebook es 739 214. No lo compartas».', opciones: [
      { t: 'Escribir el código.', tej: ['codigo', 'escrito'], fx: s => { s.m.phish = 'codigo'; }, ir: 'm11x' },
      { t: '¿Por qué una apelación necesita mi código para entrar? Cerrar todo.', tej: ['codigo', 'no'], fx: s => { s.m.phish = 'casi'; }, hilo: 'Tienen tu contraseña. No tienen tu código.', ir: 'm11y' }
    ] },
    m11y: { tipo: 'narra', texto: 'Cerré todo y volví a cambiar la contraseña con las manos frías. La verificación en dos pasos acababa de salvarme, y en la mañana yo ni sabía bien para qué servía.', sig: 'm13' },
    m11x: { tipo: 'tel', app: 'fb', chat: 'Facebook', sub: 'Seguridad de la cuenta', avatar: 'f', hora: '13:11',
      alEntrar: s => { s.m.phish = s.m.phish || 'contraseña'; s.m.paginaPerdida = true; },
      mensajes: [
        { de: 'Facebook', texto: 'Se cambió el correo electrónico de la página **Hilo Rojo · Bordados de El Encinal**. Si no fuiste tú, protege tu cuenta.' },
        { de: 'Facebook', texto: 'Se cerró tu sesión en este dispositivo.' }
      ], boton: 'Intentar entrar', sig: 'm11z' },
    m11z: { tipo: 'narra', texto: s => s.m.phish === 'lupita'
      ? 'Le marqué a Lupita. Ella tampoco podía entrar. «Pero si era de Meta», dijo, y se le quebró la voz. En el salón el profe explicaba funciones y yo no entendí ni una palabra.'
      : 'La contraseña ya no servía. El correo ya no era el mío. En el salón el profe explicaba funciones y yo no entendí ni una palabra.', sig: 'm13' },
    m12r: { tipo: 'narra', texto: 'Lo reporté. Facebook me dio las gracias y prometió revisarlo. El chat desapareció de la bandeja; de mi cabeza, no.', sig: 'm13' },

    /* ----- De regreso: el grupo del salón ----- */
    m13: { tipo: 'narra', escena: 'combi:atardecer', actores: [], texto: s => s.m.paginaPerdida
      ? 'Me subí a la combi sin ver a nadie. No tenía cabeza para nada más. Igual el celular siguió vibrando.'
      : 'De regreso, la combi iba llena de señoras con bolsas del mercado. Una traía un mantel muy parecido a los de la abuela, pero hecho a máquina. El celular vibró: el grupo del salón.', sig: 'mg' },
    mg: { tipo: 'tel', grupo: true, chat: '3°B 🔥', sub: '38 participantes', avatar: '🔥', hora: '15:10', mensajes: [
      { de: 'Mau', img: STICKER_MARI },
      { de: 'Mau', texto: 'nuevo sticker oficial del salón 😴😴' },
      { de: 'Kari', texto: 'JAJAJAJAJA' },
      { de: 'Brandon', texto: 'hagan uno de cuando ronca' },
      { de: 'Kari', texto: '¿creen que lo vea?' },
      { de: 'Mau', texto: 'ni está en el grupo 💀' }
    ], opciones: [
      { t: 'Reaccionar con 😂 y seguir viendo videos.', yo: '😂', tej: ['grupo', 'risa'], fx: s => { s.m.grupo = 'risa'; }, hilo: 'Tu carita de risa quedó debajo de su cara.',
        respuesta: [{ de: 'Mau', texto: 'hasta la Yare se rió 😂😂' }] },
      { t: '«Ya bájenle. Ni está en el grupo para defenderse.»', tej: ['grupo', 'defendio'], fx: s => { s.m.grupo = 'defendio'; s.m.yareMarcada = true; }, hilo: 'El grupo del salón recordará esto.',
        respuesta: [{ de: 'Mau', texto: 'uy, llegó la abogada' }, { de: 'Kari', texto: 'ya pues era broma' }, { de: 'Brandon', texto: '🤡' }] },
      { t: 'Tomar capturas del chat y salirme del grupo.', yo: '📷 *3 capturas guardadas* · *Saliste del grupo*', tej: ['grupo', 'evidencia'], fx: s => { s.m.grupo = 'evidencia'; s.m.evidencia = true; }, hilo: 'Las capturas tienen fecha y hora.' },
      { t: 'Escribirle a Mari por privado.', chat: { chat: 'Mari', sub: 'en línea', avatar: 'M' }, yo: 'Oye, están pasando un sticker tuyo en el grupo del salón. No estás sola en esto, ¿va?', tej: ['grupo', 'avisoMari'], fx: s => { s.m.grupo = 'avisoMari'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
        respuesta: s => [{ de: 'Mari', texto: s.m.mari2 === 'verdad' ? 'Ya lo vi. Gracias por decirme.' : '¿Y tú por qué me avisas?' }] }
    ], sig: s => cambiada(s) && ['cuaderno', 'whatsapp'].includes(s.m.reparto) && !s.m.paginaPerdida ? 'm14' : 'm15' },
    m14: { tipo: 'tel', chat: 'Lupita', sub: 'en línea', avatar: 'L', hora: '17:48', mensajes: [
      { de: 'Lupita', texto: 'Oye no puedo entrar a la página 😡' },
      { de: 'Lupita', texto: '¿Le cambiaste la contraseña? ¿Cuál es la nueva?' }
    ], opciones: [
      { t: 'Te la mando por aquí.', yo: '••••••••••••••', tej: ['lupe', 'whatsapp'], fx: s => { s.m.reparto2 = 'whatsapp'; s.m.nuevaExpuesta = true; s.rel.lupita++; }, hilo: 'Lupita guarda todo en sus chats.',
        respuesta: [{ de: 'Lupita', texto: 'Gracias 🙏 ya entré' }] },
      { t: 'Te agrego como administradora con tu propia cuenta. Hoy en la noche.', tej: ['lupe', 'cuentas'], fx: s => { s.m.reparto2 = 'cuentas'; s.m.reparto = 'cuentas'; },
        respuesta: [{ de: 'Lupita', texto: 'Uf, ok. Pero hoy sí, eh' }] },
      { t: 'Te la digo en persona. Por aquí no.', tej: ['lupe', 'persona'], fx: s => { s.m.reparto2 = 'persona'; s.rel.lupita--; }, hilo: 'Lupita recordará esto.',
        respuesta: [{ de: 'Lupita', texto: '¿Neta? Ni que fuera la del banco 🙄' }] }
    ], sig: 'm15' },

    /* ----- En casa: el cuaderno, el municipio, Fernanda ----- */
    m15: { tipo: 'narra', escena: 'cocina', actores: [['yare', .3, { voltea: true }], ['abuela', .7, { voltea: true }]],
      alEntrar: s => { if (!s.m.pedidosMartes) { s.pedidos += s.m.paginaPerdida ? 1 : 6; s.m.pedidosMartes = true; } },
      texto: 'La abuela estaba en la cocina contando servilleteros. Cuando me vio, sonrió como cuando le salen bien las cuentas.', sig: 'm16' },
    m16: { tipo: 'dice', quien: 'abuela', texto: s => `Ya van ${s.pedidos} pedidos, mija. Doña Tere ya no cree que esto del Facebook sea cosa del diablo.`,
      sig: s => s.m.paginaPerdida ? 'm16b' : (s.m.reparto === 'cuaderno' ? 'm17' : 'm19x') },
    m16b: { tipo: 'narra', texto: 'No le dije nada. Todavía no sabía cómo se dice «ya no es nuestra» en el idioma de la abuela.', sig: s => s.m.reparto === 'cuaderno' ? 'm17' : 'm19x' },
    m17: { tipo: 'dice', quien: 'abuela', texto: 'Ah, y vino la señora de la tienda de Los Pinos. Pidió doce servilleteros. Le enseñé el cuaderno para que viera los precios; estuvo un buen rato viéndolo, bien amable.', sig: 'm18' },
    m18: { tipo: 'elige', texto: 'El cuaderno azul está en la mesa. La hoja de atrás también.', opciones: [
      { t: 'Arrancar la hoja y cambiar la contraseña ahora mismo.', si: s => !cambiada(s) && !s.m.paginaPerdida, tej: ['cuaderno', 'arranco'], fx: s => { s.m.cuaderno = 'arranco'; s.m._volver = 'm19x'; }, ir: 'mc' },
      { t: 'Arrancar la hoja. Con eso basta.', si: s => !cambiada(s), tej: ['cuaderno', 'arranco'], fx: s => { s.m.cuaderno = 'arranco'; }, hilo: 'La hoja ya no está en el cuaderno.' },
      { t: 'Dejarla. Es una señora de Los Pinos, no una hacker.', si: s => !cambiada(s), tej: ['cuaderno', 'dejo'], fx: s => { s.m.cuaderno = 'dejo'; }, hilo: 'El cuaderno azul se queda como estaba.' },
      { t: 'Arrancarla de todos modos.', si: s => cambiada(s), tej: ['cuaderno', 'arranco'], fx: s => { s.m.cuaderno = 'arranco'; } },
      { t: 'Dejarla. Ya no sirve: la cambiaste hoy.', si: s => cambiada(s), tej: ['cuaderno', 'dejo'], fx: s => { s.m.cuaderno = 'dejo'; } }
    ], sig: 'm19x' },
    m19x: { tipo: 'salto', sig: s => s.m.curp === 'persona' ? 'm19' : 'mF' },
    m19: { tipo: 'dice', quien: 'abuela', texto: 'Fuimos al municipio con doña Tere. La muchacha de ventanilla dice que el registro de puestos es ahí mismo, en papel, y que nadie ha pedido nada por Facebook. Que ya van tres cooperativas preguntando lo mismo. ¿Pues quién te escribió, mija?', sig: 'm19b' },
    m19b: { tipo: 'narra', texto: s => `Me acordé del mensaje: «Si no me los manda hoy, pierden el lugar». Y de la sesión de Ramiro Díaz${s.m.ramiro === 'cerrada' ? ', que yo misma había cerrado en la computadora 4' : ', abierta desde la mañana en la computadora 4'}.`, sig: 'mF' },
    mF: { tipo: 'salto', sig: s => s.m.ine === 'enviada' ? 'm20' : 'm21' },
    m20: { tipo: 'tel', app: 'fb', chat: 'Fernanda R.', sub: 'Tlaxcala', avatar: 'F', hora: '19:20', mensajes: [
      { de: 'Fernanda R.', texto: 'Holaa 😊 ya te deposité lo del camino de mesa' },
      { de: 'Fernanda R.', texto: 'Oye, ¿me pasas el CURP de tu abuelita? Es que lo pedí con factura y me lo piden en mi trabajo 🙏' }
    ], opciones: [
      { t: 'Mandarle el CURP de la abuela.', yo: '📎 *CURP_Graciela_Coronel.pdf*', tej: ['fer', 'enviado'], fx: s => { s.m.fer = 'enviado'; }, hilo: 'Fernanda ya tiene dos documentos de tu abuela.',
        respuesta: [{ de: 'Fernanda R.', texto: '¡Mil gracias! 💕' }] },
      { t: 'Para factura se usa el RFC, no el CURP. Y no facturamos, perdón.', tej: ['fer', 'no'], fx: s => { s.m.fer = 'no'; }, hilo: 'Fernanda recordará esto.',
        respuesta: [{ de: 'Fernanda R.', texto: 'Ah ok, no te preocupes 😊' }] }
    ], sig: 'm21' },

    /* ----- La noche: el live de Toño ----- */
    m21: { tipo: 'narra', escena: 'encinal', actores: [['yare', .25], ['tono', .62, { cel: true }]], texto: 'En la noche, Toño estaba en el patio, junto al lavadero, donde agarra la señal. Tenía el celular parado en una cubeta y hablaba solo, en voz alta, con una emoción que yo no le conocía.', sig: 'm22' },
    m22: { tipo: 'dice', quien: 'tono', texto: '¡Ya somos cuarenta y dos en el live! Saluden a mi hermana, la que sabe de celulares.', sig: 'm23' },
    m23: { tipo: 'tel', grupo: true, app: 'ig', chat: '🔴 EN VIVO · tono.ff', sub: '42 espectadores', avatar: '🎮', hora: '21:14', boton: 'Levantar la vista', mensajes: [
      { de: 'kevin_ff', texto: 'jajaja saludos a tu hermana' },
      { de: 'xGhost.mx', texto: 'qué onda toño buen juego 🔥 de dónde eres?' },
      { de: '🎙️ Toño', texto: '¡De El Encinal! Aquí atrasito de la tienda de don Beto' },
      { de: 'xGhost.mx', texto: 'va te voy a regalar 1000 diamantes 💎 te va a llegar un código por mensaje, nomás dímelo pa mandártelos' },
      { de: 'kevin_ff', texto: 'NO MAMES 1000' }
    ], sig: 'm24' },
    m24: { tipo: 'dice', quien: 'tono', texto: 'Ya me llegó, ya me llegó. Son seis números. Espérame, xGhost…', sig: 'm25' },
    m25: { tipo: 'elige', tiempo: 6, texto: 'Toño ya está escribiendo con el pulgar.',
      silencio: { tej: ['tono', 'robado'], fx: s => { s.m.tono = 'robado'; }, hilo: 'Toño recordará esta noche.',
        dice: [['tono', '¡Ya está! Dice que ahorita me caen.'], [null, 'A los dos minutos, su WhatsApp le pidió verificar el número otra vez. Toño no le dio importancia. Yo sí.']] },
      opciones: [
        { t: 'Quitarle el celular.', tej: ['tono', 'quitado'], fx: s => { s.m.tono = 'quitado'; s.rel.tono = (s.rel.tono || 0) - 1; }, hilo: 'Toño recordará esto.',
          dice: [['tono', '¡¿QUÉ TE PASA?! ¡Estaba en vivo!'], [null, 'El live se quedó viendo la cubeta. Cuarenta y dos personas oyeron a mi hermano gritarme.'], ['yare', 'Ese código es la llave de tu WhatsApp, Toño. No son diamantes.']] },
        { t: '«Toño. Ese código no es de diamantes. Es tu WhatsApp.»', tej: ['tono', 'explicado'], fx: s => { s.m.tono = 'explicado'; s.rel.tono = (s.rel.tono || 0) + 1; }, hilo: 'Toño recordará esto.',
          dice: s => [['tono', ['contraseña', 'codigo', 'lupita'].includes(s.m.phish) ? '¿Y tú cómo sabes? ¿Ya te pasó o qué?' : '¿Neta? …¿Y tú cómo sabes?'],
            ['yare', ['contraseña', 'codigo', 'lupita'].includes(s.m.phish) ? 'Algo así.' : 'Porque así le robaron el suyo a media prepa.'],
            [null, 'Toño se quedó callado. Luego le escribió a xGhost: «nel, gracias». xGhost lo bloqueó en un segundo.']] },
        { t: 'Gritarle a mamá.', tej: ['tono', 'mama'], fx: s => { s.m.tono = 'mama'; s.rel.tono = (s.rel.tono || 0) - 2; }, hilo: 'Toño recordará esto.',
          dice: [[null, 'Mamá salió con la cuchara en la mano y apagó el live sin preguntar. Toño no me habló el resto de la noche. En la grabación se oye mi voz diciendo «¡mamá!» como si tuviera seis años.']] }
      ], sig: 'm26' },

    /* ----- Cierre: se calcula cómo quedó la página para el miércoles ----- */
    m26: { tipo: 'salto', alEntrar: s => {
      const puertas = [];
      if (['contraseña', 'codigo', 'lupita'].includes(s.m.phish)) s.m.paginaPerdida = true;
      if (s.m.phish === 'casi' && !s.m.cambio) s.m.cambio = 'fuerte';
      if (!s.m.paginaPerdida && !s.m.dosPasos) {
        if (!s.m.cambio) {
          if (s.m.clave === 'debil') puertas.push('adivinable');
          if (s.m.reparto === 'cuaderno') puertas.push('cuaderno');
          if (s.m.reparto === 'whatsapp') puertas.push('whatsapp');
          if (sesionCiberViva(s)) puertas.push('ciber');
        } else if (s.m.cambio === 'numero') {
          puertas.push('adivinable');
          if (s.m.reparto2 === 'whatsapp') puertas.push('whatsapp');
        } else if (s.m.nuevaExpuesta) puertas.push('whatsapp');
      }
      s.tejido.cambio = s.m.cambio || 'ninguno';
      s.tejido.dos = s.m.dosPasos ? 'si' : 'no';
      s.m.puertas = puertas;
      s.m.comprometida = !!s.m.paginaPerdida || puertas.length > 0;
    }, sig: 'm27' },
    m27: { tipo: 'narra', escena: 'encinal', actores: [['yare', .28]], texto: 'Junto al lavadero, con dos rayitas de señal, abrí la libreta.', sig: 'm28' },
    m28: { tipo: 'diario', fecha: 'Martes', parrafos: s => [
      s.m.alerta === 'atendida' ? 'En la mañana Facebook me avisó de un inicio de sesión que no era mío. Cambié todo en la combi. Todavía se me revuelve el estómago pensando quién fue.'
        : s.m.alerta === 'ignorada' ? (s.m.salida === 'corrio'
          ? 'En la mañana Facebook me preguntó si había entrado ayer a las 19:12, desde Tepetlán. Dije que sí. Ahora que lo escribo: a las 19:12 yo iba en la combi.'
          : 'En la mañana Facebook me preguntó si había entrado hoy a las 6:31, desde Tepetlán. Dije que sí. Ahora que lo escribo: a las 6:31 yo estaba aquí, en El Encinal, sin señal.') : '',
      s.m.cerroCiber ? 'En «Dónde iniciaste sesión» había una computadora con Windows. Yo no tengo computadora. La cerré.' : '',
      ({ defendio: 'En el patio le dije a un grupito que ya le bajaran. Me dijeron «la abogada». No me arrepiento, pero me temblaron las piernas.',
        rio: 'En el patio me reí con los de 3°A. Mari estaba a veinte metros.',
        nada: 'En el patio pasé junto a los que tenían el sticker y seguí caminando. Como si no fuera conmigo.' })[s.m.patio] || '',
      ({ fisgo: 'Vi un celular olvidado en una banca. Ahora sé quién maneja @prepalc.memes. No debería saberlo, pero lo sé.',
        prefectura: 'Llevé a prefectura un celular que alguien olvidó en la banca. Tenía abierta @prepalc.memes.' })[s.m.celular] || '',
      ({ verdad: 'Le dije a Mari que es Iker. No sé si fue valentía o venganza.',
        ayuda: 'Mari ya había reportado la foto veinte veces. Le ofrecí ayuda como quien ofrece un paraguas cuando ya pasó la lluvia.',
        mintio: 'Le dije a Mari que no sabía. Ella sabía que yo sabía.',
        silencio: 'Mari me preguntó algo y no le contesté. Me quedé ahí, con la boca abierta, como en la foto.' })[s.m.mari2 || 'silencio'],
      ({ ignoro: s.m.pistasVistas?.includes('calidad') ? 'Me llegó un mensaje de «Meta» con palomita azul. Fui a «Calidad de la página» y todo estaba bien. Lo dejé ahí.' : 'Me llegó un mensaje de «Meta» con palomita azul. Lo dejé ahí. No sé si fue prudencia o flojera.',
        reporto: 'Me llegó un mensaje de «Meta» con palomita azul. Lo reporté. Ojalá a las de Las Ánimas no les llegue uno igual.',
        enlace: ({ cerro: 'Abrí el enlace de «Meta». Me pidió la contraseña y algo me hizo cerrar la pestaña. Todavía no sé qué fue.',
          casi: 'Escribí mi contraseña en una página falsa. El código de dos pasos fue lo único que hubo entre ellos y la página.',
          contraseña: 'Escribí mi contraseña en una página que no era de Meta. A los siete minutos ya no era dueña de la página de la abuela.',
          codigo: 'Les di mi contraseña y luego el código. Les abrí la puerta y les sostuve la reja.' })[s.m.phish || s.m.enlace || 'cerro'],
        lupita: 'Le pasé el enlace a Lupita. Ella hizo lo que yo iba a hacer, nomás más rápido. Ya no tenemos la página.' })[s.m.meta || 'ignoro'],
      ({ risa: 'En el grupo del salón pasaron un sticker de Mari. Le puse la carita de risa. No sé por qué. Bueno, sí sé: para no ser la rara.',
        defendio: 'Les dije en el grupo que ya le bajaran. «La abogada», otra vez. Mañana el sticker quizá sea mío.',
        evidencia: 'Guardé capturas del grupo y me salí. No sé para qué las voy a usar. Por si acaso.',
        avisoMari: 'Le escribí a Mari por privado. No sé si la ayudé o si nomás le arruiné la tarde.' })[s.m.grupo] || '',
      s.m.reparto === 'cuaderno' || s.m.cuaderno ? (s.m.cuaderno === 'arranco' ? 'Arranqué la hoja de atrás del cuaderno azul. La señora de Los Pinos lo tuvo en sus manos un buen rato. Bien amable.' : 'La señora de Los Pinos vio el cuaderno un buen rato. Bien amable, dice la abuela.') : '',
      s.m.curp === 'persona' ? 'En el municipio nadie pidió los CURP por Facebook. Alguien los quería. A nosotras no nos los sacó.' : '',
      ({ enviado: 'Fernanda ya tiene la INE y el CURP de la abuela. Dice que es para factura.', no: 'Fernanda pidió el CURP de la abuela «para factura». Le dije que no. Me contestó con una carita feliz.' })[s.m.fer] || '',
      ({ quitado: 'Le quité el celular a Toño en pleno live. Tenía razón y aun así fui la mala.',
        explicado: 'Toño me preguntó cómo sabía lo del código. Me dio gusto que preguntara.',
        mama: 'Le grité a mamá como cuando éramos chiquitos. Toño no me va a perdonar el «¡mamá!» en la grabación.',
        robado: 'No hice nada cuando Toño leyó el código en voz alta. Me quedé viendo, como cuarenta y dos personas más.' })[s.m.tono || 'robado'],
      s.m.paginaPerdida ? `Ya van ${s.pedidos} pedidos. La abuela no sabe que la página ya no es nuestra.` : `Ya van ${s.pedidos} pedidos.`,
      'Faltan cuatro días para la feria.'
    ], sig: 'm29' },
    m29: { tipo: 'tejido', titulo: 'El tejido de tu martes', proximo: 'Miércoles', filas: () => CAPITULO2.tejido, sueltos: s => [
      s.m.paginaPerdida && 'El correo de la página ya no es el tuyo.',
      !s.m.paginaPerdida && s.m.comprometida && 'Hay al menos una puerta de la página que sigue abierta.',
      s.m.dosPasos && 'Desde hoy, para entrar a la página hace falta tu celular.',
      s.m.cuaderno === 'dejo' && 'La señora de Los Pinos tuvo el cuaderno azul en sus manos un buen rato.',
      s.m.nuevaExpuesta && 'La contraseña nueva ya está en el WhatsApp de Lupita.',
      s.m.tono === 'robado' && 'El WhatsApp de Toño pidió verificar el número otra vez.',
      s.m.fer === 'enviado' && 'Fernanda tiene la INE y el CURP de tu abuela. ¿Depositó?',
      s.m.mariSabe && 'Mari sabe quién maneja @confesiones.prepalc.',
      s.m.celular === 'fisgo' && 'Sabes quién administra @prepalc.memes.',
      s.m.celular === 'prefectura' && 'Prefectura tiene el celular de quien administra @prepalc.memes.',
      s.m.evidencia && 'Tienes capturas del grupo del salón, con fecha y hora.',
      s.m.yareMarcada && 'En la prepa ya hay quien te dice «la abogada».',
      s.m.curp === 'enviada' && 'Diez CURP siguen en una bandeja que no es del municipio.',
      s.m.ramiro === 'cerrada' && 'Ramiro sigue sin saber quién cerró su sesión.'
    ].filter(Boolean), sig: 'w0' }
  };

  const tejido = [
    { clave: 'alerta', titulo: 'Martes · El aviso de inicio de sesión', opciones: [['atendida', '«No fui yo»'], ['ignorada', '«Sí, fui yo»']] },
    { clave: 'iker2', titulo: 'Martes · La foto, otra vez', opciones: [['reportar', 'La reportaron'], ['reclamo', 'Le reclamaste']] },
    { clave: 'patio', titulo: 'Martes · El grupito del patio', opciones: [['defendio', '«Ya bájenle»'], ['rio', 'Te reíste'], ['nada', 'Seguiste de largo']] },
    { clave: 'celular', titulo: 'Martes · El celular de la banca', opciones: [['fisgo', 'Viste de quién era'], ['prefectura', 'A prefectura'], ['dejo', 'Lo dejaste']] },
    { clave: 'ikerPatio', titulo: 'Martes · Iker en el patio', opciones: [['aviso', 'No le mentirás a Mari'], ['cubre', 'Lo cubres'], ['borrar', '«Bórrala»']] },
    { clave: 'mari2', titulo: 'Martes · Mari pregunta', opciones: [['verdad', 'La verdad'], ['ayuda', 'Ayuda'], ['mintio', '«Ni idea»'], ['silencio', 'Silencio']] },
    { clave: 'meta', titulo: 'Martes · El mensaje de «Meta»', opciones: [['ignoro', 'Lo dejaste así'], ['reporto', 'Lo reportaste'], ['enlace', 'Abriste el enlace'], ['lupita', 'Se lo pasaste a Lupita']] },
    { clave: 'enlace', titulo: 'Martes · La página de «Meta»', opciones: [['cerro', 'Cerraste la pestaña'], ['contraseña', 'Escribiste la contraseña']] },
    { clave: 'codigo', titulo: 'Martes · El código', opciones: [['no', 'No lo diste'], ['escrito', 'Lo diste']] },
    { clave: 'grupo', titulo: 'Martes · El sticker en el grupo', opciones: [['risa', 'La carita de risa'], ['defendio', '«Ya bájenle»'], ['evidencia', 'Capturas y salir'], ['avisoMari', 'Avisarle a Mari']] },
    { clave: 'cambio', titulo: 'Martes · Contraseña', opciones: [['fuerte', 'Nueva'], ['numero', 'Un número más'], ['ninguno', 'Sin cambiar']] },
    { clave: 'dos', titulo: 'Martes · Verificación en dos pasos', opciones: [['si', 'Activada'], ['no', 'Desactivada']] },
    { clave: 'lupe', titulo: 'Martes · Lupita no puede entrar', opciones: [['whatsapp', 'Por WhatsApp'], ['cuentas', 'Cuenta propia'], ['persona', 'En persona']] },
    { clave: 'cuaderno', titulo: 'Martes · La hoja del cuaderno', opciones: [['arranco', 'La arrancaste'], ['dejo', 'La dejaste']] },
    { clave: 'fer', titulo: 'Martes · El CURP de la abuela', opciones: [['enviado', 'Lo mandaste'], ['no', 'No lo mandaste']] },
    { clave: 'tono', titulo: 'Martes · El live de Toño', opciones: [['quitado', 'Le quitaste el celular'], ['explicado', 'Le explicaste'], ['mama', 'Le gritaste a mamá'], ['robado', 'Silencio']] }
  ];

  return { nodos, tejido, util: { fila, MANTEL, STICKER_MARI, COLOR_GENTE } };
})();
