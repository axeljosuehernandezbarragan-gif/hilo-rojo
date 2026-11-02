/* Hilo Rojo · Capítulo 3: Miércoles («Reflejo»).
   Hilo 1 (página): la página gemela cobra a nombre de la cooperativa (si la página se perdió el martes, la usa la impostora).
   Hilo 2 (ciberacoso): aparece una cuenta que se hace pasar por Mari; juntar pruebas y, si se puede, ir a Orientación.
   Lee lo que dejó el martes (s.m) y deja calculado lo que necesita el jueves. */
const CAPITULO3 = (() => {
  const { fila, MANTEL, STICKER_MARI, COLOR_GENTE } = CAPITULO2.util;
  const perdida = (s) => !!s.m.paginaPerdida;
  const hora = (min) => `6:${String(min).padStart(2, '0')}`;
  const COMBI = 20; // la combi pasa a las 6:20

  /* Cada cosa que haces con una rayita de señal cuesta minutos. */
  const gasta = (min, s, api) => {
    s.m.reloj = (s.m.reloj || 3) + min;
    if (s.m.reloj >= COMBI) { api.pensar('a:tarde', '¿Ya son las seis veinte? ¡La combi!', false); api.elegir('tarde'); }
  };
  /* Pruebas que se pueden enseñar en Orientación. */
  const pruebas = (s) => [
    s.m.evidencia && 'las capturas del grupo del salón, con fecha y hora',
    s.m.capFalsa && 'las capturas del perfil falso: el nombre de usuario, la fecha y las reacciones',
    (s.rel.mari || 0) >= 2 && 'las capturas de Mari, que guarda todo desde que estafaron a su tía'
  ].filter(Boolean);
  const mariDolida = (s) => (s.m.grupo === 'risa' || s.m.patio === 'rio') && !s.m.disculpa;

  const MANTEL_ESPEJO = MANTEL.replace('class="ap-foto"', 'class="ap-foto espejo"');
  /* Sticker de burla con la cara de Yare: recorte con borde blanco (como los de WhatsApp), derecho, y el apodo
     abajo en letras de meme que siempre caben (textLength). El dibujito de la esquina va hecho a mano, no con emoji. */
  const BALANZA = '<g transform="translate(160 44)" stroke="#3A2A12" stroke-width="3" stroke-linecap="round" fill="none"><path d="M0 -16 V14 M-10 14 H10 M-18 -10 H18"/><path d="M-18 -10 L-25 4 H-11Z M18 -10 L11 4 H25Z" fill="#F2C94C"/><circle cx="0" cy="-18" r="3" fill="#3A2A12"/></g>';
  const BILLETE = '<g transform="translate(158 44) rotate(-12)"><rect x="-22" y="-13" width="44" height="26" rx="3" fill="#8FCB8A" stroke="#2E5A2C" stroke-width="2.5"/><circle r="7" fill="none" stroke="#2E5A2C" stroke-width="2.5"/><path d="M0 -4 V4" stroke="#2E5A2C" stroke-width="2.5"/></g>';
  const stickerYare = (apodo, dibujito, desc) => `<svg viewBox="0 0 200 200" aria-label="Sticker con la cara de una chica y la palabra ${desc}"><defs><clipPath id="st-yare-${desc}"><circle cx="100" cy="100" r="84"/></clipPath></defs><circle cx="100" cy="100" r="96" fill="#fff"/><g clip-path="url(#st-yare-${desc})"><rect width="200" height="200" fill="#E8C9C0"/><circle cx="100" cy="74" r="60" fill="#F4DCD2"/>${Personajes.retratoG('yare', { x: 100, y: 114, escala: 1.12, exp: 'enojo' })}</g><circle cx="100" cy="100" r="84" fill="none" stroke="#fff" stroke-width="6"/>${dibujito}<rect x="24" y="142" width="152" height="36" rx="9" fill="#E0303F" stroke="#fff" stroke-width="4"/><text x="100" y="168" text-anchor="middle" font-family="Impact, 'Arial Black', system-ui" font-weight="900" font-size="22" fill="#fff" textLength="128" lengthAdjust="spacingAndGlyphs">${apodo}</text></svg>`;
  const STICKER_YARE = stickerYare('LA ABOGADA', BALANZA, 'abogada');
  const STICKER_ESTAFA = stickerYare('LA ESTAFADORA', BILLETE, 'estafadora');
  const PERFIL_FALSO = `<svg viewBox="0 0 260 150" aria-label="Captura de un perfil llamado mari.ventura.real"><rect width="260" height="150" rx="10" fill="#fff"/><rect width="260" height="44" rx="10" fill="#C5A7D8"/><circle cx="40" cy="58" r="27" fill="#fff"/>${STICKER_MARI.replace('<svg ', '<svg x="15" y="33" width="50" height="50" ')}<text x="76" y="66" font-family="system-ui" font-weight="800" font-size="15" fill="#1C1E21">mari.ventura.real</text><text x="76" y="84" font-family="system-ui" font-size="11" fill="#65676B">la que ronca 😴 cuenta oficial</text><text x="14" y="116" font-family="system-ui" font-size="11" fill="#65676B">312 seguidores · 3 publicaciones</text><rect x="14" y="126" width="232" height="14" rx="4" fill="#F0F2F5"/></svg>`;
  const COMPROBANTE = `<svg viewBox="0 0 240 170" aria-label="Comprobante de transferencia"><rect width="240" height="170" rx="10" fill="#fff"/><rect width="240" height="36" rx="10" fill="#0F6E5A"/><text x="14" y="23" font-family="system-ui" font-weight="800" font-size="13" fill="#fff">BanCampo · Transferencia</text><text x="14" y="60" font-family="system-ui" font-size="11" fill="#65676B">Monto</text><text x="14" y="82" font-family="system-ui" font-weight="900" font-size="22" fill="#1C1E21">$850.00</text><text x="14" y="104" font-family="system-ui" font-size="11" fill="#65676B">Cuenta destino</text><text x="14" y="120" font-family="system-ui" font-weight="700" font-size="13" fill="#1C1E21">**** **** 4471</text><text x="14" y="140" font-family="system-ui" font-size="11" fill="#65676B">Beneficiario: H ROJO BORD</text><text x="14" y="158" font-family="system-ui" font-size="11" fill="#0F6E5A">✓ Operación exitosa · 27/10 22:41</text></svg>`;
  const STICKER_MINI = STICKER_MARI.replace('<svg ', '<svg class="ap-mini" ');

  /* ---------- Mañana: la página gemela (celular explorable con reloj) ---------- */
  const botonHecho = (hecho, txtHecho, html) => hecho ? `<span class="ap-hecho chico">✓ ${txtHecho}</span>` : html;
  const REFLEJO = {
    tipo: 'app', marca: 'pistasGemela', pila: ['buscar'],
    alEntrar: s => { if (s.m.reloj === undefined) s.m.reloj = s.m.madrugada === 'recupero' ? 10 : 3; },
    texto: s => perdida(s)
      ? 'Carla pagó a una cuenta que no es de la abuela. En la página que ya no es tuya hay publicaciones que tú no escribiste.'
      : 'Carla pagó a una cuenta que no es de la abuela. En el buscador de Facebook escribes «hilo rojo bordados».',
    indica: 'Revisa lo que quieras, pero todo toma su tiempo: en El Encinal la señal es de una rayita.',
    barra: s => `<span>${Iconos.svg('reloj')} ${hora(Math.min(s.m.reloj, COMBI))}</span><span class="${s.m.reloj >= 15 ? 'urge' : ''}">La combi pasa a las 6:20</span>`,
    tabs: [['buscar', '🔍 Buscar'], ['chats', '💬 Chats'], ['mia', '🧵 Mi página']],
    pantallas: {
      buscar: { titulo: 'Buscar', tab: 'buscar', recordar: true,
        pensar: s => perdida(s) ? 'Nuestra página tiene dos mil seguidores. El domingo tenía catorce.' : 'Dos «Hilo Rojo». La otra tiene dos mil seguidores. Nosotras, catorce.',
        cuerpo: s => `<div class="ap-buscar">🔍 hilo rojo bordados</div><div class="ap-lista">
          ${perdida(s) ? fila('gemela', '🧵', 'Hilo Rojo · Bordados de El Encinal', 'Artesanías · 2.3 mil seguidores', '', false, 'hilo')
            : fila('mia', '🧵', 'Hilo Rojo · Bordados de El Encinal', 'Artesanías · 14 seguidores', '', false, 'hilo') + fila('gemela', '🧵', 'Hilo Rojo Bordados El Encinal', 'Tienda · 2.3 mil seguidores', '', false, 'hilo espejo')}
          ${fila('otra', '🧶', 'Hilos y Telas Rojo', 'Mercería · Puebla', '')}</div>` },
      otra: { titulo: 'Hilos y Telas Rojo', tab: 'buscar', pensar: 'Una mercería de Puebla. Venden la madeja de hilo a doce pesos. La abuela diría que es un robo.', cuerpo: `
        <div class="ap-perfil"><span class="ap-av">🧶</span><b>Hilos y Telas Rojo</b><small>Mercería · Puebla · 860 seguidores</small></div>
        <div class="ap-articulo">Madejas, agujas, bastidores y manta. Envíos a todo Puebla.</div>` },
      mia: { titulo: 'Mi página', tab: 'mia', cuerpo: s => perdida(s) ? `
        <div class="ap-perfil"><span class="ap-av hilo">🧵</span><b>Hilo Rojo · Bordados de El Encinal</b><small>Ya no eres administradora de esta página</small></div>
        <div class="ap-articulo">Tu acceso a esta página se eliminó el 27 de octubre. Si crees que alguien entró sin permiso, puedes pedir ayuda para recuperarla.</div>
        ${botonHecho(s.m.recuperando, 'Solicitud enviada', '<button class="ap-btn" data-ir="recuperar">Recuperar la página</button>')}
        ${botonHecho(s.m.gemAviso, 'Aviso publicado en tu perfil', '<button class="ap-btn sec" data-ir="avisoPerfil">Avisar desde mi perfil y mi estado</button>')}
        <button class="ap-btn sec" data-ir="gemela">Ver cómo se ve la página ahora</button>` : `
        <div class="ap-perfil"><span class="ap-av hilo">🧵</span><b>Hilo Rojo · Bordados de El Encinal</b><small>Artesanías · 14 seguidores · Eres administradora</small></div>
        ${s.m.gemAviso ? `<div class="ap-post-real"><div class="ap-cab-chat"><span class="ap-av hilo">🧵</span><span><b>Hilo Rojo · Bordados de El Encinal</b><small>📌 Fijada · Ahora</small></span></div><p>Aviso: esta es nuestra única página. No pedimos depósitos a ninguna otra cuenta. Si alguien te escribió desde otra página, repórtala 🙏</p></div>`
          : '<button class="ap-btn" data-ir="publicar">✏️ Escribir publicación</button>'}
        <div class="ap-post-real"><div class="ap-cab-chat"><span class="ap-av hilo">🧵</span><span><b>Hilo Rojo · Bordados de El Encinal</b><small>Domingo · 🌎</small></span></div><p>Mantel de flores rojas, bordado a mano por doña Chela 🌺</p>${MANTEL}<p class="ap-reac">❤️ 9 · 3 comentarios</p></div>` },
      publicar: { titulo: 'Crear publicación', tab: 'mia', cuerpo: `
        <div class="ap-articulo"><b>Hilo Rojo · Bordados de El Encinal</b><p class="ap-borrador">Aviso: esta es nuestra única página. No pedimos depósitos a ninguna otra cuenta. Si alguien te escribió desde otra página, repórtala 🙏</p><small>📌 Fijar arriba · 🌎 Público</small></div>
        <button class="ap-btn" data-a="aviso">Publicar</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      avisoPerfil: { titulo: 'Crear publicación', tab: 'mia', cuerpo: `
        <div class="ap-articulo"><b>Yare Coronel</b><p class="ap-borrador">Nos robaron la página de Hilo Rojo · Bordados de El Encinal. NO depositen a ninguna cuenta que publique. Pedidos solo conmigo o con Lupita, en persona 🙏 Compartan porfa.</p><small>🌎 Público · también en tu estado de WhatsApp</small></div>
        <button class="ap-btn" data-a="avisoPersonal">Publicar</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      recuperar: { titulo: 'Recuperar una página', tab: 'mia', recordar: true, pensar: 'Una foto de mi INE y un video de mi cara. ¿Y si se tarda una semana? La feria es el sábado.', cuerpo: `
        <div class="ap-articulo"><h4>Alguien entró sin permiso</h4>Para comprobar que eres tú, te pediremos una foto de una identificación oficial y un video corto de tu cara. La revisión puede tardar varios días.</div>
        <button class="ap-btn" data-a="recuperar">Empezar</button><button class="ap-btn sec" data-atras>Ahora no</button>` },
      gemela: { titulo: s => perdida(s) ? 'Hilo Rojo · Bordados…' : 'Hilo Rojo Bordados…', tab: 'buscar', cuerpo: s => s.m.gemBloqueo ? `
        <div class="ap-articulo"><h4>Este contenido no está disponible</h4>Puede que el propietario lo haya compartido solo con un grupo reducido de personas o que lo haya eliminado.</div>` : `
        <div class="ap-perfil"><span class="ap-av hilo espejo">🧵</span><b>${perdida(s) ? 'Hilo Rojo · Bordados de El Encinal' : 'Hilo Rojo Bordados El Encinal'}</b><button class="pz" data-p="seguidores"><small>${perdida(s) ? 'Artesanías' : 'Tienda'} · 2.3 mil seguidores</small></button></div>
        <div class="ap-acciones">${botonHecho(s.m.capGemela, 'Captura', '<button class="ap-btn sec chico" data-a="capturaGem">📷 Captura</button>')}
          <button class="ap-btn sec chico" data-ir="transp">Transparencia</button>
          ${perdida(s) ? '' : botonHecho(s.m.gemReporte, 'Reportada', '<button class="ap-btn sec chico" data-ir="reportar">··· Reportar</button>')}</div>
        <div class="ap-post-real"><div class="ap-cab-chat"><span class="ap-av hilo espejo">🧵</span><span><b>${perdida(s) ? 'Hilo Rojo · Bordados de El Encinal' : 'Hilo Rojo Bordados El Encinal'}</b><small>Ayer · 🌎</small></span></div>
          <button class="ap-post" data-p="gemCuenta">📢 ${perdida(s) ? '¡Nueva cuenta para apartados!' : '¡Ya puedes apartar con depósito!'} BanCampo <b>****4471</b> a nombre de H. Rojo Bord. Manda tu comprobante por inbox 💌</button>
          <p class="ap-reac">❤️ 128 · 46 comentarios</p></div>
        <div class="ap-comentarios">
          <button class="pz ap-com" data-p="gemEnvios"><b>Rosy Hdz</b> ¿Hacen envíos?</button>
          <p class="resp"><b>${perdida(s) ? 'Hilo Rojo · Bordados de El Encinal' : 'Hilo Rojo Bordados El Encinal'}</b> ¡Sí, a todo México! 📦</p>
          <p><b>Carla Méndez</b> Listo, ya deposité 🙌</p>
          ${s.m.gemComento ? '' : '<button class="ap-btn sec chico" data-ir="comentar">💬 Comentar</button>'}
        </div>
        <div class="ap-post-real"><button class="ap-post" data-p="gemFoto">Mantel de flores rojas, bordado a mano 🌺</button>${MANTEL_ESPEJO}<p class="ap-reac">❤️ 311</p></div>` },
      transp: { titulo: 'Transparencia de la página', tab: 'buscar', cuerpo: s => perdida(s) ? `
        <button class="ap-dato" data-p="mismaFecha">📅 Página creada el 25 de octubre de 2026</button>
        <div class="ap-dato">✏️ Cambios de nombre: ninguno</div>
        <button class="ap-dato" data-p="perdidaCorreo">👤 Administradores: 1 · correo de contacto cambiado el 27 de octubre</button>` : `
        <button class="ap-dato" data-p="gemCreada">📅 Página creada el 26 de octubre de 2026</button>
        <button class="ap-dato" data-p="gemNombre">✏️ Cambios de nombre: 1 · antes «Ofertas Tlaxcala 2x1»</button>
        <button class="ap-dato" data-p="gemPais">🌎 Administrada desde: México, Colombia</button>` },
      reportar: { titulo: 'Reportar página', tab: 'buscar', cuerpo: `
        <p class="ap-seccion">¿Qué está pasando?</p>
        <button class="ap-fila" data-a="reportarGem"><span class="ap-av">💸</span><span><b>Estafa o fraude</b><small>Pide dinero o datos con engaños</small></span></button>
        <button class="ap-fila" data-a="reportarGem"><span class="ap-av">🎭</span><span><b>Se hace pasar por otra persona o negocio</b><small>Mi negocio: Hilo Rojo · Bordados de El Encinal</small></span></button>
        <button class="ap-fila" data-atras><span class="ap-av">✕</span><span><b>Cancelar</b></span></button>` },
      comentar: { titulo: 'Comentar', tab: 'buscar', cuerpo: `
        <div class="ap-articulo"><b>Yare Coronel</b><p class="ap-borrador">¡ESTO ES UNA ESTAFA! La página real es Hilo Rojo · Bordados de El Encinal. No depositen aquí.</p></div>
        <button class="ap-btn" data-a="comentar">Publicar comentario</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      chats: { titulo: 'Chats', tab: 'chats', cuerpo: s => `<div class="ap-lista">
        ${fila('chatCarla3', 'C', 'Carla Méndez', s.m.carla3 === 'banco' ? '¡¿Cómo que no es su cuenta?!' : '¡Buenos días! Ya hice el depósito…', '6:01', s.m.carla3 !== 'banco')}
        ${fila('chatLupita3', 'L', 'Lupita', s.m.lupita3 ? (perdida(s) ? 'Si ni puedo entrar desde ayer 😭' : '¿QUÉ? No. ¿Cuál?') : 'buenas noches prima 😴', s.m.lupita3 ? 'Ahora' : 'Ayer')}</div>` },
      chatCarla3: { titulo: 'Carla Méndez', tab: 'chats', cuerpo: s => `
        <div class="ap-msjs"><div class="ap-burbuja cliente">¡Buenos días! Ya hice el depósito de los $850 🙌</div><div class="ap-burbuja cliente ap-img">${COMPROBANTE}</div>
        ${s.m.carla3 === 'banco' ? '<div class="ap-burbuja cliente yo">Esa cuenta no es nuestra. Llama a tu banco ahorita: entre más rápido, más chance de que detengan el depósito.</div><div class="ap-burbuja cliente">¡¿CÓMO QUE NO ES SU CUENTA?!</div><div class="ap-burbuja cliente">ya le marqué al banco</div>' : ''}</div>
        ${s.m.carla3 === 'banco' ? '' : '<button class="ap-btn" data-a="avisarCarla">Enviar: «Esa cuenta no es nuestra. Llama a tu banco ahorita.»</button>'}` },
      chatLupita3: { titulo: 'Lupita', tab: 'chats', cuerpo: s => `
        <div class="ap-msjs"><div class="ap-burbuja cliente">buenas noches prima 😴</div>
        ${s.m.lupita3 ? `<div class="ap-burbuja cliente yo">${perdida(s) ? '¿Tú publicaste algo en la página?' : '¿Tú abriste otra página de Hilo Rojo?'}</div><div class="ap-burbuja cliente">${perdida(s) ? '¿Yo? Si ni puedo entrar desde ayer 😭' : '¿QUÉ? No. ¿Cuál?'}</div>` : ''}</div>
        ${s.m.lupita3 ? '' : `<button class="ap-btn" data-a="preguntarLupita">Enviar: «${perdida(s) ? '¿Tú publicaste algo en la página?' : '¿Tú abriste otra página de Hilo Rojo?'}»</button>`}` }
    },
    piezas: {
      seguidores: '2.3 mil seguidores en dos días. Iker dice que se pueden comprar. Iker dice muchas cosas.',
      gemCuenta: s => perdida(s) ? 'La cuenta de la abuela termina en 0932. Esta, en 4471. Y la publicó «nuestra» página.' : 'La cuenta de la abuela termina en 0932. Esta, en 4471. ¿Y si Lupita abrió otra? Habló de abrir una «para el negocio».',
      gemEnvios: '«A todo México». Nosotras no enviamos ni a Tepetlán.',
      gemFoto: 'Es nuestro mantel. Pero al revés, como en un espejo: la firma de la abuela se lee al revés. ¿Para qué voltea alguien una foto?',
      gemCreada: 'Creada el lunes. La nuestra, el domingo. ¿Lupita habrá abierto una de respaldo? Dijo algo de «por si las dudas».',
      gemNombre: 'Antes se llamaba «Ofertas Tlaxcala 2x1». ¿Las páginas se reciclan? Supongo. Pero ¿quién recicla una página de ofertas para vender bordados?',
      gemPais: '¿Colombia? A lo mejor contrataron a alguien para manejarla. Las tiendas grandes hacen eso. ¿No?',
      mismaFecha: 'Es la nuestra. La misma que hice el domingo en la noche, con Lupita encima.',
      perdidaCorreo: 'El correo cambió el martes. A la hora en que yo estaba en clase de mate, sin entender nada.'
    },
    acciones: {
      capturaGem: (s, e, api) => { s.m.capGemela = true; api.pensar('a:capg', 'Captura: la publicación, la cuenta y la fecha. No sé para qué. Por si acaso.'); gasta(1, s, api); },
      reportarGem: (s, e, api) => { s.m.gemReporte = true; api.hilo('Facebook dijo que revisaría la página.'); api.pensar('a:rep', 'Mientras cargaba el formulario se fue la señal dos veces. Ya quedó. Creo.'); api.atras(); gasta(5, s, api); },
      comentar: (s, e, api) => { s.m.gemComento = true; s.m.gemBloqueo = true; api.hilo('La otra página sabe que la viste.'); api.pensar('a:com', 'Lo publiqué. Al minuto ya no estaba. Y luego ya no pude ver la página: me bloquearon.'); api.atras(); gasta(1, s, api); },
      aviso: (s, e, api) => { s.m.gemAviso = true; api.hilo('El aviso quedó fijado en tu página.'); api.pensar('a:aviso', 'La foto tardó cinco minutos en subir. Una rayita. Pero ahí está, hasta arriba.'); api.atras(); gasta(6, s, api); },
      avisoPersonal: (s, e, api) => { s.m.gemAviso = true; api.hilo('Tus contactos vieron el aviso.'); api.pensar('a:aviso', 'Lo puse en mi perfil y en mi estado. Mis contactos son mi familia y la prepa. ¿Las clientas lo verán?'); api.atras(); gasta(4, s, api); },
      recuperar: (s, e, api) => { s.m.recuperando = true; api.hilo('Facebook revisará tu solicitud. Puede tardar días.'); api.pensar('a:rec', 'Grabé el video en el patio, despeinada, con las gallinas atrás. Dice que puede tardar días.'); api.atras(); gasta(7, s, api); },
      avisarCarla: (s, e, api) => { s.m.carla3 = 'banco'; s.tejido.carla3 = 'banco'; api.hilo('Carla recordará esto.'); api.pensar('a:carla', 'Carla contestó con puros signos de admiración. Luego: «ya le marqué al banco».'); gasta(2, s, api); },
      preguntarLupita: (s, e, api) => { s.m.lupita3 = true; api.pensar('a:lupe', perdida(s) ? 'Lupita no ha podido entrar desde ayer. Ninguna de nosotras escribió eso.' : 'No fue Lupita. Eso, de alguna forma, es peor.'); gasta(2, s, api); }
    },
    opciones: [
      { id: 'combi', t: 'Guardar el celular y correr a la combi.', tej: ['combi3', 'alcanzo'], fx: s => { s.m.combi3 = 'alcanzo'; }, ir: 'w6' },
      { id: 'tarde', si: () => false, t: 'Se fue la combi.', tej: ['combi3', 'perdio'], fx: s => { s.m.combi3 = 'perdio'; }, ir: 'w6' }
    ]
  };

  /* ---------- Tarde: la cuenta que se hace pasar por Mari ---------- */
  const cerrarMaris = (s) => { s.tejido.capFalsa = s.m.capFalsa ? 'si' : 'no'; s.tejido.repFalsa = s.m.repFalsa ? 'si' : 'no'; };
  const DOS_MARIS = {
    tipo: 'app', marca: 'pistasMari', pila: ['buscar'],
    texto: 'Buscas «mari ventura». Te salen dos.',
    indica: 'Puedes revisar los dos perfiles, guardar capturas o reportar. Lo que Yare piensa aparece aquí.',
    tabs: [['buscar', '🔍 Buscar'], ['falsa', '👤 mari.ventura.real'], ['real', '👤 Mari Ventura']],
    pantallas: {
      buscar: { titulo: 'Buscar', tab: 'buscar', recordar: true, pensar: 'Dos Maris. Una me sigue desde ayer. La otra ni sabía que tenía Facebook.', cuerpo: `<div class="ap-buscar">🔍 mari ventura</div><div class="ap-lista">
        ${fila('falsa', STICKER_MINI, 'mari.ventura.real', '312 seguidores · Te sigue', '', false, 'foto')}
        ${fila('real', 'M', 'Mari Ventura', 'Las Ánimas, Tepetlán · 3 amigos en común', '')}</div>` },
      falsa: { titulo: 'mari.ventura.real', tab: 'falsa', cuerpo: s => `
        <div class="ap-perfil"><span class="ap-av foto">${STICKER_MINI}</span><b>mari.ventura.real</b><button class="pz" data-p="falSigue"><small>312 seguidores · sigue a 289</small></button></div>
        <button class="ap-dato" data-p="falBio">💬 «la que ronca 😴 cuenta oficial · 3°B»</button>
        <button class="ap-dato" data-p="falFecha">📅 Se unió en octubre de 2026</button>
        <div class="ap-acciones">${botonHecho(s.m.capFalsa, 'Captura', '<button class="ap-btn sec chico" data-a="capturaFalsa">📷 Captura</button>')}
          ${botonHecho(s.m.repFalsa, 'Reportado', '<button class="ap-btn sec chico" data-ir="repFalsa">··· Reportar</button>')}
          ${botonHecho(s.m.compartio, 'Compartido', '<button class="ap-btn sec chico" data-ir="compFalsa">↗ Compartir</button>')}</div>
        <div class="ap-post-real"><button class="ap-post" data-p="falConf1">Confesión #1: me hago la dormida en clase pa que me tomen fotos 😴📸 jajaja</button><p class="ap-reac">😂 41 · 19 comentarios</p></div>
        <div class="ap-comentarios"><p><b>Brandon G.</b> al menos lo acepta 💀</p><p><b>Kari Sol</b> jajaja noo</p>
          ${s.m.comFalsa ? '<p><b>Yare Coronel</b> Esta no es Mari. Quien la hizo, da pena.</p><p class="resp"><b>mari.ventura.real</b> uy la abogada 🤡</p>' : '<button class="ap-btn sec chico" data-ir="comFalsa">💬 Comentar</button>'}</div>
        <div class="ap-post-real"><button class="ap-post" data-p="falConf3">Confesión #3: en Las Ánimas no tenemos ni baño 🤣🤣</button><p class="ap-reac">😂 63 · 30 comentarios</p></div>
        <div class="ap-post-real"><button class="ap-post" data-p="falFoto">yo en la clase de mate 😴</button><div class="ap-foto-sticker">${STICKER_MARI}</div><p class="ap-reac">😂 88</p></div>` },
      real: { titulo: 'Mari Ventura', tab: 'real', pensar: 'Su última publicación es de hace un año. Bordados de su tía. Ni una sola foto de ella.', cuerpo: `
        <div class="ap-perfil"><span class="ap-av">M</span><b>Mari Ventura</b><small>Las Ánimas, Tepetlán</small></div>
        <button class="ap-dato" data-p="realFecha">📅 Se unió en marzo de 2021 · 3 amigos en común</button>
        <button class="ap-btn sec" data-ir="chatMari">💬 Mensaje</button>
        <div class="ap-post-real"><button class="ap-post" data-p="realPost">Feria de Las Ánimas 2025 🌸 Los bordados de mi tía.</button>${MANTEL.replace(/#E0303F/g, '#7A5AA8')}<p class="ap-reac">❤️ 14</p></div>` },
      chatMari: { titulo: 'Mari Ventura', tab: 'real', cuerpo: s => `
        <div class="ap-msjs">${s.m.grupo === 'avisoMari' ? `<div class="ap-burbuja cliente yo">Oye, están pasando un sticker tuyo en el grupo del salón. No estás sola en esto, ¿va?</div><div class="ap-burbuja cliente">${s.m.mari2 === 'verdad' ? 'Ya lo vi. Gracias por decirme.' : '¿Y tú por qué me avisas?'}</div>` : '<p class="ap-fecha">Todavía no se han escrito</p>'}
        ${s.m.escribioMari3 ? '<div class="ap-burbuja cliente yo">¿Ya viste la cuenta que se hace pasar por ti?</div><div class="ap-burbuja cliente">Ya. No es mía.</div><div class="ap-burbuja cliente">¿Tú qué haces viéndola?</div>' : ''}</div>
        ${s.m.escribioMari3 ? '' : '<button class="ap-btn" data-a="escribirMari">Enviar: «¿Ya viste la cuenta que se hace pasar por ti?»</button>'}` },
      repFalsa: { titulo: 'Reportar perfil', tab: 'falsa', cuerpo: `
        <p class="ap-seccion">¿Qué está pasando?</p>
        <button class="ap-fila" data-ir="repFalsa2"><span class="ap-av">🎭</span><span><b>Se hace pasar por otra persona</b></span></button>
        <button class="ap-fila" data-ir="repFalsa2"><span class="ap-av">🚫</span><span><b>Acoso o bullying</b></span></button>
        <button class="ap-fila" data-atras><span class="ap-av">✕</span><span><b>Cancelar</b></span></button>` },
      repFalsa2: { titulo: 'Reportar perfil', tab: 'falsa', recordar: true, pensar: 'Dice que si la reporta la misma Mari, es más rápido. ¿Mari sabrá?', cuerpo: `
        <p class="ap-seccion">¿A quién afecta?</p>
        <div class="ap-fila apagada"><span class="ap-av">🙋</span><span><b>A mí</b><small>No es tu caso</small></span></div>
        <button class="ap-fila" data-a="reportarFalsa"><span class="ap-av">👥</span><span><b>A alguien que conozco</b><small>Mari Ventura</small></span></button>
        <div class="ap-articulo"><small>Si la persona afectada también envía un reporte desde su cuenta, la revisión puede ser más rápida.</small></div>` },
      comFalsa: { titulo: 'Comentar', tab: 'falsa', cuerpo: `
        <div class="ap-articulo"><b>Yare Coronel</b><p class="ap-borrador">Esta no es Mari. Quien la hizo, da pena.</p></div>
        <button class="ap-btn" data-a="comentarFalsa">Publicar comentario</button><button class="ap-btn sec" data-atras>Cancelar</button>` },
      compFalsa: { titulo: 'Compartir', tab: 'falsa', cuerpo: s => `
        <div class="ap-articulo"><b>${s.m.grupo === 'evidencia' ? 'Compartir en tu perfil' : 'Compartir en 3°B 🔥'}</b><p class="ap-borrador">qué asco quien haga esto 🤮</p><small>Con el perfil de mari.ventura.real adjunto</small></div>
        <button class="ap-btn" data-a="compartirFalsa">Compartir</button><button class="ap-btn sec" data-atras>Cancelar</button>` }
    },
    piezas: {
      falBio: '«Cuenta oficial». ¿Y si sí es ella? Hay gente que se burla de sí misma primero, para que ya no duela.',
      falFecha: s => perdida(s) ? 'Se unió este mes. Bueno, hay gente que abre cuentas nuevas cuando le roban la otra. Yo debería saberlo.' : 'Se unió este mes. Bueno, mucha gente abre cuentas nuevas. ¿No?',
      falSigue: 'Sigue a 289 personas. A todo 3°B, a 3°A, hasta a los prefectos. Mari no le habla ni a la mitad.',
      falConf1: s => (s.m.grupo === 'avisoMari' || s.m.escribioMari3) ? '«Pa que me tomen fotos». Mari me escribió con acentos y todo. ¿O escribirá así cuando está enojada?' : '¿Mari escribe «pa»? No sé cómo escribe Mari. Nunca le he escrito.',
      falConf3: '¿En Las Ánimas no hay baño? Yo qué voy a saber. Nunca he ido. Nadie de aquí ha ido.',
      falFoto: 'Es la foto del sticker. La que le tomaron dormida. ¿Quién sube una foto suya que odia?',
      realPost: 'Bordados de su tía. Puntada de cruz, como la de la abuela.',
      realFecha: 'Desde 2021. Tres amigos en común. Uno soy yo.'
    },
    acciones: {
      capturaFalsa: (s, e, api) => { s.m.capFalsa = true; api.pensar('a:capf', 'La captura tiene el nombre de usuario, la fecha y las 41 caritas de risa. No sé si eso sirve. Ahí está.'); },
      reportarFalsa: (s, e, api) => { s.m.repFalsa = true; api.hilo('Facebook revisará el perfil.'); api.atras(); api.atras(); },
      comentarFalsa: (s, e, api) => { s.m.comFalsa = true; s.m.yareMarcada = true; api.hilo('Tu nombre quedó en los comentarios de esa cuenta.'); api.pensar('a:comf', 'Me contestaron en menos de un minuto. Doce respuestas. Ninguna era para Mari.'); api.atras(); },
      compartirFalsa: (s, e, api) => { s.m.compartio = true; api.hilo('Tu publicación llegó a gente que no conocía esa cuenta.'); api.pensar('a:comp', 'Lo compartí para que vieran qué asco. En diez minutos ya tenía más reacciones que cualquier cosa que haya publicado.'); api.atras(); },
      escribirMari: (s, e, api) => { s.m.escribioMari3 = true; s.rel.mari++; api.pensar('a:mari', 'Contestó rápido. Y luego preguntó qué hacía yo viéndola. Buena pregunta.'); }
    },
    opciones: [
      { t: 'Ir a buscar a Mari.', fx: cerrarMaris, ir: 'w11' },
      { t: 'Ya hice lo que pude. Irme a clase.', tej: ['mari3', 'clase'], fx: s => { cerrarMaris(s); s.m.mari3 = 'clase'; }, ir: 'w20' }
    ]
  };

  const nodos = {
    w0: { tipo: 'titulo', sup: 'Capítulo 3', titulo: 'Miércoles', sub: 'Reflejo · faltan tres días para la feria', sig: 'w1' },
    w1: { tipo: 'narra', escena: 'encinal', actores: [['yare', .3, { cel: true }]], texto: 'El celular vibró a las 5:48, antes que la alarma. En El Encinal la señal llega de madrugada, cuando nadie más la está usando.',
      sig: s => s.m.tono === 'robado' ? 'w2' : 'w4' },

    /* ----- Madrugada: el WhatsApp de Toño ya no es de Toño ----- */
    w2: { tipo: 'tel', chat: 'Abuela Chela', sub: 'en línea', avatar: 'A', hora: '5:48', boton: 'Voltear a ver a Toño', mensajes: s => [
      { de: 'Abuela Chela', audio: '0:12', texto: perdida(s) ? 'Mija, Toño me escribió. Que si le presto seiscientos pesos para una tarjeta, que es urgente y que no te diga.' : 'Mija, Toño me escribió. Que le pase la contraseña de la página para ayudarte a subir fotos. Que es sorpresa, que no te diga.' },
      { de: 'Abuela Chela', audio: '0:07', texto: perdida(s) ? '¿Se los mando? Tengo lo de los servilleteros.' : (s.m.reparto === 'cuaderno' && s.m.cuaderno !== 'arranco' ? 'Yo no me la sé, pero está en el cuaderno, ¿verdad? ¿Le tomo foto?' : 'Yo no me la sé. ¿Tú se la pasas?') }
    ], sig: 'w3' },
    w3: { tipo: 'elige', escena: 'cocina', actores: [['yare', .35, { cel: true }], ['tono', .7, { voltea: true }]], tiempo: 9,
      texto: 'Toño duerme en el catre junto a la estufa, destapado. Su celular está en el piso, cargando, con la pantalla apagada.',
      silencio: { tej: ['madrugada', 'nada'], hilo: 'La abuela recordará esta mañana.',
        fx: s => { s.m.madrugada = 'nada'; if (perdida(s)) s.m.abuelaDeposito = true; else if (s.m.reparto === 'cuaderno' && s.m.cuaderno !== 'arranco') s.m.fotoCuaderno = true; },
        dice: s => [[null, 'Me quedé viendo la pantalla hasta que se apagó sola. Cuando volví a abrir los ojos, la abuela ya había contestado.'],
          [null, s.m.abuelaDeposito ? 'Le depositó seiscientos pesos a «Toño». Lo de tres servilleteros.' : s.m.fotoCuaderno ? 'Le mandó a «Toño» una foto de la hoja de atrás del cuaderno azul.' : 'Le mandó a «Toño» una nota de voz: «No me la sé, mijo. Pregúntale a tu hermana». Del otro lado, nadie volvió a escribir.']] },
      opciones: [
        { t: '«Abuela, no le mande nada. Ese no es Toño.»', tej: ['madrugada', 'abuela'], fx: s => { s.m.madrugada = 'abuela'; s.rel.abuela++; s.m.tonoSigue = true; }, hilo: 'La abuela recordará esto.',
          dice: [[null, 'Le mandé una nota de voz en susurros. Tardó un minuto en irse: una rayita de señal.'], ['abuela', '¿Cómo que no es Toño, si dice Toño? …Ah, caray. Bueno, no le mando nada.']] },
        { t: 'Despertar a Toño y recuperar su WhatsApp juntos.', tej: ['madrugada', 'recupero'], fx: s => { s.m.madrugada = 'recupero'; s.rel.tono = (s.rel.tono || 0) + 1; }, hilo: 'Toño recordará esto.',
          dice: [['tono', '¿Qué…? ¿Qué hora es?'], [null, 'Reinstalamos WhatsApp con su número. Llegó un SMS con un código, el de verdad, el que no se le da a nadie, y su cuenta volvió a su celular. Del otro lado, alguien se quedó a media plática con mi abuela.'],
            ['tono', '…¿Entonces el xGhost ese no me iba a dar diamantes?'], [null, 'Ya eran las 6:10.']] },
        { t: 'Escribirle a «Toño» a ver qué contesta.', tej: ['madrugada', 'pregunto'], fx: s => { s.m.madrugada = 'pregunto'; s.m.tonoSigue = true; }, hilo: 'Del otro lado saben que ya te diste cuenta.',
          dice: [[null, '«¿Toño? ¿Para qué quieres la contraseña?». Contestó en un segundo: «pa ayudarte we es sorpresa». Toño nunca escribe «we». Y nunca, nunca, se despierta antes de las siete.'],
            [null, 'Le escribí a la abuela que no mandara nada. El falso Toño siguió escribiéndole a medio mundo: a mi tía, a la madrina, al grupo de la familia.']] }
      ], sig: 'w4' },

    /* ----- Carla pagó a otra cuenta ----- */
    w4: { tipo: 'narra', escena: s => s.m.madrugada ? 'cocina' : 'encinal', actores: s => s.m.madrugada ? [['yare', .35, { cel: true }], ['tono', .7, { voltea: true }]] : [['yare', .3, { cel: true }]],
      texto: s => s.m.madrugada ? 'Y entonces llegó otro mensaje. Carla, la del mantel de flores rojas.' : 'Era Carla, la del mantel de flores rojas.', sig: 'w4c' },
    w4c: { tipo: 'tel', app: 'fb', chat: 'Carla Méndez', sub: 'Messenger', avatar: 'C', hora: '6:01', mensajes: s => [
      { de: 'Carla Méndez', texto: '¡Buenos días! Ya hice el depósito de los $850 🙌' },
      { de: 'Carla Méndez', img: COMPROBANTE },
      { de: 'Carla Méndez', texto: s.m.cobro === 'publica' ? 'A la cuenta nueva que pusieron, ¿verdad? La otra publicación ya ni me aparece'
        : s.m.cobro === 'feria' ? 'Vi en la página que ahora sí se aparta con depósito, entonces mejor ya lo dejé pagado 😊' : 'A la cuenta que sale en la página ✨' },
      perdida(s) && { de: 'Carla Méndez', texto: 'Por cierto, ¿cambiaron la foto de perfil? Se ve más profesional jaja' }
    ].filter(Boolean), opciones: [
      { t: '«¿Cuál publicación? ¿Me la pasas?»', tej: ['carla3', 'pregunto'], fx: s => { s.m.carla3 = 'pregunto'; },
        respuesta: s => [{ de: 'Carla Méndez', texto: 'Esta 👇' }, { de: 'Carla Méndez', texto: perdida(s) ? 'facebook.com/hilorojo.bordados.encinal' : 'facebook.com/hilorojobordados.elencinal' }] },
      { t: '«Esa cuenta no es nuestra. Llama a tu banco ahorita.»', tej: ['carla3', 'banco'], fx: s => { s.m.carla3 = 'banco'; }, hilo: 'Carla recordará esto.',
        respuesta: [{ de: 'Carla Méndez', texto: '¡¿CÓMO QUE NO ES SU CUENTA?!' }, { de: 'Carla Méndez', texto: 'ahorita le marco al banco' }] },
      { t: '«Déjame checar y te digo.»', tej: ['carla3', 'espera'], fx: s => { s.m.carla3 = 'espera'; }, respuesta: [{ de: 'Carla Méndez', texto: 'Ok 😊' }] }
    ], sig: 'w5' },
    w5: REFLEJO,
    w6: { tipo: 'narra', escena: s => s.m.combi3 === 'perdio' ? 'encinal' : 'combi', actores: s => s.m.combi3 === 'perdio' ? [['yare', .4, { cel: true }]] : [],
      alEntrar: s => {
        s.tejido.capGemela = s.m.capGemela ? 'si' : 'no';
        if (!perdida(s)) s.tejido.gemReporte = s.m.gemReporte ? 'si' : 'no';
        s.tejido.gemAviso = s.m.gemAviso ? 'si' : 'no';
        if (s.m.combi3 === 'perdio' && !s.m._mamaTarde) { s.m._mamaTarde = true; s.rel.mama--; }
      },
      texto: s => s.m.combi3 === 'perdio'
        ? 'Cuando llegué a la carretera, la combi ya iba en la curva del panteón. La siguiente pasaba a las 7:10. Mamá me vio regresar y no dijo nada; nomás sacó las llaves de la moto.'
        : 'Alcancé la combi corriendo, con el celular todavía caliente en la mano. En la subida del cerro la señal se fue y ya no supe si alguien más había depositado.',
      sig: s => s.m.curp === 'enviada' ? 'w7' : 'w8' },
    w7: { tipo: 'tel', chat: 'Abuela Chela', sub: 'en línea', avatar: 'A', hora: '7:32', mensajes: [
      { de: 'Abuela Chela', audio: '0:21', texto: 'Mija, a doña Tere y a Lencha les llegó un mensaje de una financiera. Que les depositaron un préstamo que nunca pidieron y que ya les están cobrando intereses. Con su nombre y su CURP, dicen.' },
      { de: 'Abuela Chela', audio: '0:06', texto: '¿Tú crees que fue por lo del municipio?' }
    ], opciones: [
      { t: 'Decirle la verdad: los CURP los mandaste tú, el lunes.', yo: '🎙️ *Nota de voz · 0:31*', tej: ['curp3', 'verdad'], fx: s => { s.m.curp3 = 'verdad'; }, hilo: 'La abuela recordará esto.',
        respuesta: [{ de: 'Abuela Chela', audio: '0:15', texto: 'Ay, mija. Bueno. Lo hiciste por ayudar. En la tarde vamos con ellas a la Condusef y a levantar la denuncia. Tú vienes, para que expliques.' }] },
      { t: '«Quién sabe, abuela. Pudo ser cualquier cosa.»', tej: ['curp3', 'calla'], fx: s => { s.m.curp3 = 'calla'; }, hilo: 'Tú sabes de dónde salieron esos CURP.',
        respuesta: [{ de: 'Abuela Chela', audio: '0:04', texto: 'Pues sí, ¿verdad? Hay mucho sinvergüenza.' }] }
    ], sig: 'w8' },

    /* ----- La prepa: otra Mari ----- */
    w8: { tipo: 'narra', escena: 'prepa', actores: [['yare', .35, { voltea: true, cel: true }]], texto: s => (s.m.combi3 === 'perdio'
      ? 'Llegué en el segundo módulo, con un retardo firmado por el prefecto. Nadie hablaba de mi retardo. '
      : 'En la entrada nadie hablaba de la feria ni de páginas. ') + 'Hablaban de Mari. De otra Mari.', sig: 'w9' },
    w9: { tipo: 'tel', grupo: true, chat: s => s.m.grupo === 'evidencia' ? 'Kari Sol' : '3°B 🔥', sub: s => s.m.grupo === 'evidencia' ? 'Te reenvió unos mensajes' : '38 participantes',
      avatar: s => s.m.grupo === 'evidencia' ? 'K' : '🔥', hora: '9:40', boton: 'Buscar la cuenta', mensajes: s => s.m.grupo === 'evidencia' ? [
        { de: 'Kari', texto: 'ya viste esto?? 💀' },
        { de: 'Kari', img: PERFIL_FALSO },
        { de: 'Kari', texto: 'dicen que es su cuenta oficial jajaja' },
        s.m.yareMarcada && { de: 'Kari', texto: 'oye y ya hay uno tuyo 😬' },
        s.m.yareMarcada && { de: 'Kari', img: STICKER_YARE }
      ].filter(Boolean) : [
        { de: 'Brandon', img: PERFIL_FALSO },
        { de: 'Kari', texto: 'dice que es su cuenta oficial jajaja' },
        { de: 'Mau', texto: 'confesión #3: "en las ánimas no hay ni baño" 💀💀' },
        { de: 'Kari', texto: 'no manches ya se pasó' },
        { de: 'Brandon', texto: 'pues ella lo escribió no?' },
        s.m.yareMarcada && { de: 'Mau', img: STICKER_YARE },
        s.m.yareMarcada && { de: 'Mau', texto: 'y ya salió el de la abogada ⚖️' },
        s.m.yareMarcada && { de: 'Kari', texto: 'JAJAJAJA' }
      ].filter(Boolean), sig: 'w10' },
    w10: DOS_MARIS,
    w11: { tipo: 'narra', escena: 'escaleras', actores: [['yare', .28], ['mari', .52]],
      texto: 'La encontré en las escaleras de atrás del laboratorio, donde no llegan ni la señal ni los prefectos. Tenía el celular en la mano y la cuenta falsa abierta.', sig: 'w11b' },
    w11b: { tipo: 'dice', quien: 'mari', texto: s => mariDolida(s)
      ? (s.m.grupo === 'risa' ? 'Tú te reíste de mi sticker en el grupo. ¿Vienes a ver si estoy llorando?' : 'Tú te reíste ayer en el patio. Te oí. ¿Vienes a ver si estoy llorando?')
      : (s.m.mari2 === 'verdad' || s.m.grupo === 'avisoMari' || s.m.escribioMari3) ? 'Ya la vi. Mi mamá también: se la mandó una vecina. Me preguntó si es cierto lo del baño.' : 'Ah. Tú. ¿También la viste?', sig: 'w12' },
    w12: { tipo: 'elige', opciones: [
      { t: '«Perdón por la carita de risa. Fue de cobarde.»', si: mariDolida, fx: s => { s.m.disculpa = true; s.rel.mari++; }, hilo: 'Mari recordará esto.',
        dice: [['mari', '…'], ['mari', 'Ok. Al menos lo dices.']], ir: 'w12' },
      { t: '«Vamos a Orientación. Yo voy contigo.»', fx: s => { s.m.mari3 = mariDolida(s) ? 'rechazo' : 'orientacion'; s.tejido.mari3 = s.m.mari3; },
        dice: s => s.m.mari3 === 'rechazo' ? [['mari', 'Contigo no.'], [null, 'Se levantó y se fue por el otro lado de la escalera. Me quedé sentada en su escalón, todavía tibio.']]
          : [['mari', 'La maestra Lucía nomás me va a decir que lo reporte. Ya lo reporté.'], ['yare', 'Entonces que lo vea ella. Que vea que no es solo un reporte.'], ['mari', '…Bueno. Pero tú hablas primero.']],
        ir: s => s.m.mari3 === 'orientacion' ? 'w13' : 'w20' },
      { t: '«Repórtala tú. Si la reporta la persona suplantada, es más rápido.»', si: s => (s.m.pistasMariVistas || []).includes('repFalsa2'), tej: ['mari3', 'reporta'], fx: s => { s.m.mari3 = 'reporta'; s.rel.mari++; },
        dice: [['mari', '¿Neta? …Ok. Ahorita.'], [null, 'La reportó ahí mismo, sentada en el escalón. Luego guardó el celular y se fue a clase sin decir nada más.']], ir: 'w20' },
      { t: '«Ignórala. En dos días se les olvida.»', tej: ['mari3', 'ignora'], fx: s => { s.m.mari3 = 'ignora'; s.rel.mari--; }, hilo: 'Mari recordará esto.',
        dice: [['mari', 'A ti se te va a olvidar.']], ir: 'w20' },
      { t: '«¿Quieres que les conteste? Yo sí les digo sus verdades.»', tej: ['mari3', 'pelear'], fx: s => { s.m.mari3 = 'pelear'; s.m.yareMarcada = true; },
        dice: [['mari', 'Haz lo que quieras. Igual van a seguir.'], [null, 'Les contesté en la publicación. Treinta respuestas en diez minutos. Ninguna era para Mari: todas eran para mí.']], ir: 'w20' }
    ] },

    /* ----- El pasillo a Orientación: se camina, Mari va detrás ----- */
    w13: { tipo: 'caminar', mundo: 'pasillo', acompana: ['mari', {}], intro: 'El pasillo de la planta baja, hasta Orientación. Mari camina detrás de ti, sin levantar la vista.',
      puntos: [
        { x: 760, figuras: [['iker', -80, { color: COLOR_GENTE, voltea: true }], ['lupita', 10, { color: COLOR_GENTE, voltea: true, cel: true }], ['rocio', 90, { color: COLOR_GENTE, voltea: true, escala: .97 }]],
          ambiente: s => ['Ahí va la que ronca', '¿Ya viste su «cuenta oficial»?', s.m.yareMarcada ? 'Y su abogada, jajaja' : '¿Y esa por qué va con ella?', 'Shhh, que te oyen'],
          interaccion: { etiqueta: 'Voltear a verlos', texto: 'Tres de 3°A se callan cuando pasan y se ríen cuando ya pasaron.', opciones: [
            { t: '«Esa cuenta no es de ella. Y ustedes lo saben.»', tej: ['pasillo', 'encara'], fx: s => { s.m.pasillo = 'encara'; s.m.yareMarcada = true; }, hilo: 'El grupito de 3°A recordará esto.',
              dice: [['Uno de 3°A', 'Uy, ya, perdón.'], [null, 'Nadie más dijo nada hasta que doblamos la esquina.']] },
            { t: 'Seguir caminando, más rápido.', tej: ['pasillo', 'sigue'], fx: s => { s.m.pasillo = 'sigue'; } }
          ] } },
        { x: 1450, mira: 'Periódico mural: «Semana de la convivencia». Alguien le pintó bigotes a la foto del director. Hay una hoja con el número de Orientación; está medio arrancada.', etiqueta: 'Mirar el periódico mural', alto: 311, objeto: 'mural' },
        { x: 2150, figuras: [['mau', 0, { voltea: true, cel: true }]], ambiente: ['Sonrían', 'Esto va pa las historias', 'Saluden a la cámara'], claro: true,
          interaccion: { etiqueta: 'Mau está grabando', texto: 'Mau, el de 3°B, las graba con el celular recargado en un casillero.', opciones: s => [
            { t: '«Bájale al celular, Mau.»', tej: ['mauGraba', 'encara'], fx: s => { s.m.mauGraba = 'encara'; }, tras: [['mau', 'baja']], dice: [['mau', 'Es un pasillo público, abogada.'], [null, 'Pero lo bajó.']] },
            s.m.celular === 'fisgo' && { t: '«Sé que tú manejas @prepalc.memes.»', tej: ['mauGraba', 'amenaza'], fx: s => { s.m.mauGraba = 'amenaza'; s.m.mauSabe = true; }, hilo: 'Mau recordará esto.', tras: [['mau', 'baja']],
              dice: [['mau', '…¿Y tú cómo sabes eso?'], [null, 'No contesté. Bajó el celular, pero se me quedó viendo hasta que entramos.']] },
            { t: 'Taparle la cara a Mari con tu mochila y pasar.', tej: ['mauGraba', 'tapa'], fx: s => { s.m.mauGraba = 'tapa'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
              dice: [[null, 'Mari se dejó tapar. Sentí cómo se le aflojaban los hombros.']] }
          ].filter(Boolean) } },
        { x: 2395, mira: 'Un casillero con una calcomanía: «Si lo ves, dilo». Alguien escribió abajo con plumón: «y te dicen chismosa».', etiqueta: 'Mirar el casillero', alto: 246, objeto: 'casillero' },
        { x: 2860, figuras: [['iker', 0, { voltea: true }]], ambiente: ['¿A dónde van?'], claro: true,
          interaccion: { etiqueta: 'Hablar con Iker', texto: 'Iker está recargado en los casilleros. Ve a Mari, luego a ti.', opciones: [
            { t: '«A Orientación. Por la cuenta falsa de Mari.»', tej: ['iker3', 'dijo'], fx: s => { s.m.iker3 = 'dijo'; }, dice: [['iker', 'Esa no es mía, eh. Lo juro.'], ['iker', '…¿Van a hablar de las cuentas de la prepa? ¿De todas?']] },
            { t: '«A ningún lado. Ahorita te veo.»', tej: ['iker3', 'evade'], fx: s => { s.m.iker3 = 'evade'; }, dice: [['iker', 'Ok…'], [null, 'Sabía perfectamente a dónde íbamos. La puerta tiene letrero.']] }
          ] } },
        { x: 3635, radio: 200, interaccion: { etiqueta: 'Tocar la puerta', fin: true } }
      ],
      alSalir: s => { s.m.pasillo = s.m.pasillo || 'sigue'; s.tejido.pasillo = s.m.pasillo; },
      sig: 'w14' },

    /* ----- Orientación ----- */
    w14: { tipo: 'narra', escena: 'orientacion', actores: [['yare', 0, { abs: 250 }], ['mari', 0, { abs: 390 }], ['lucia', 0, { abs: 820, voltea: true }]],
      texto: 'La oficina de la maestra Lucía olía a café de olla. Tenía una planta que alguien le regaló y que nadie regaba, y un calendario con un día marcado en rojo.', sig: 'w15' },
    w15: { tipo: 'dice', quien: 'lucia', texto: 'A ver, siéntense. Coronel, Ventura. ¿Qué pasó?', sig: 'w16' },
    w16: { tipo: 'elige', texto: 'Mari no levanta la vista.', opciones: [
      { t: 'Contarle todo tú: el sticker, la cuenta falsa, quién se ríe.', tej: ['orient', 'todo'], fx: s => { s.m.orient = 'todo'; },
        dice: [['yare', 'Hay una cuenta que se hace pasar por Mari. Sube «confesiones». Antes estaba el sticker, en el grupo del salón. Y antes, la foto.'], ['lucia', '¿Y tú, Mari? ¿Es así?'], ['mari', '…Sí.']] },
      { t: 'Dejar que Mari cuente lo suyo. Tú nomás estás ahí.', tej: ['orient', 'acompana'], fx: s => { s.m.orient = 'acompana'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
        dice: [[null, 'No dije nada. Mari tardó. Luego habló bajito, sin parar, como quien suelta algo que traía cargando desde el lunes.'], ['mari', 'Mi mamá ya la vio. Me preguntó si es cierto lo del baño. Que si eso ando diciendo de mi casa.']] }
    ], sig: 'w17' },
    w17: { tipo: 'dice', quien: 'lucia', texto: 'Gracias por venir. Lo que me cuentan es serio. Pero para que dirección actúe y para hablar con las familias, necesito pruebas: capturas con fecha, el nombre de la cuenta, el enlace. ¿Tienen algo?', sig: 'w18' },
    w18: { tipo: 'narra', alEntrar: s => { const n = pruebas(s).length; s.m.pruebas = n; s.m.orient3 = n >= 2 ? 'actua' : n === 1 ? 'parcial' : 'sinpruebas'; },
      texto: s => { const p = pruebas(s); return p.length ? `Pusimos los celulares sobre el escritorio: ${p.join('; ')}.${s.m.grupo === 'risa' && (s.rel.mari || 0) >= 2 ? ' En una de las capturas de Mari, debajo de su cara, estaba mi carita de risa.' : ''}` : 'Mari y yo nos vimos. No teníamos nada. Ni una captura.'; }, sig: 'w18b' },
    w18b: { tipo: 'dice', quien: 'lucia', texto: s => ({
      actua: 'Con esto sí puedo. Hoy mismo hablo con dirección y con las familias. Y reporto la cuenta por el canal que tiene la escuela con la plataforma: así la revisan antes que un reporte suelto.',
      parcial: 'Esto ayuda. Pero con una sola cosa no sé bien quién hizo qué. Traigan lo que tengan, aunque les parezca poco. Mientras, hablo con el grupo.',
      sinpruebas: 'Sin pruebas solo puedo dar una plática en los salones. Y las pláticas sin nombres no detienen a nadie. Si vuelve a pasar, captura antes de hacer cualquier otra cosa.'
    })[s.m.orient3], sig: 'w19' },
    w19: { tipo: 'elige', quien: 'lucia', texto: '¿Saben quién está detrás de la cuenta?', opciones: [
      { t: '«Ayer llevé a prefectura un celular que tenía abierta @prepalc.memes.»', si: s => s.m.celular === 'prefectura', tej: ['quien', 'prefectura'], fx: s => { s.m.quien = 'prefectura'; s.m.mauExpuesto = true; },
        dice: [['lucia', 'Ese celular sigue en prefectura. Ahí dice de quién es la sesión. Y nadie tuvo que fisgonear para saberlo.']] },
      { t: '«Creo que es Mau, de 3°B. Lo vi en su celular.»', si: s => s.m.celular === 'fisgo', tej: ['quien', 'mau'], fx: s => { s.m.quien = 'mau'; s.m.mauExpuesto = 'palabra'; },
        dice: [['lucia', '¿Lo viste cómo?'], ['yare', '…Lo dejó en una banca. Desbloqueado.'], ['lucia', 'Eso lo tengo que manejar con cuidado. Sin una prueba, es tu palabra contra la suya.']] },
      { t: '«Las confesiones las maneja Iker. La cuenta falsa no sé.»', si: s => !!s.m.mariSabe || s.m.ikerPatio === 'aviso' || s.m.orient === 'todo', tej: ['quien', 'iker'], fx: s => { s.m.quien = 'iker'; s.m.ikerExpuesto = true; }, hilo: 'Iker se va a enterar de que fuiste tú.',
        dice: [['lucia', 'Salcedo. Va. Lo voy a llamar.'], [null, 'Mari me miró de lado. No supe si era agradecimiento o sorpresa.']] },
      { t: '«No sabemos.»', tej: ['quien', 'nose'], fx: s => { s.m.quien = 'nose'; }, dice: [['lucia', 'Está bien. Es mejor un «no sé» que un nombre a lo loco.']] }
    ], sig: 'w19b' },
    w19b: { tipo: 'dice', quien: 'lucia', texto: 'Mari, si te vuelven a escribir, no contestes: captura y me la traes. Tú también, Coronel. La puerta está abierta.', sig: 'w20' },

    /* ----- De regreso ----- */
    w20: { tipo: 'narra', escena: 'combi:atardecer', actores: [], texto: s => s.m.orient3 === 'actua'
      ? 'De regreso, el perfil falso ya no aparecía: «Este contenido no está disponible». Mari me mandó la captura, sin texto. Fue lo primero que me mandó en su vida.'
      : s.m.repFalsa && s.m.mari3 === 'reporta' ? 'De regreso, el perfil falso seguía ahí, pero ya no subía nada nuevo. Facebook decía «en revisión». Dos reportes, el de Mari y el mío.'
        : 'De regreso, el perfil falso seguía ahí. Ya tenía cuatrocientos seguidores.', sig: s => s.m.yareMarcada ? 'w21' : 'w22' },
    w21: { tipo: 'tel', chat: '+52 246 118 0397', sub: 'Número desconocido', avatar: '?', hora: '16:02', mensajes: [
      { de: '+52 246 118 0397', img: STICKER_YARE },
      { de: '+52 246 118 0397', texto: 'ya cállate abogada 🤡 nadie te pidió nada' },
      { de: '+52 246 118 0397', texto: 'a ver si así se te quita lo valiente' }
    ], opciones: [
      { t: '«¿Quién eres, cobarde?»', tej: ['acoso3', 'responde'], fx: s => { s.m.acoso3 = 'responde'; }, hilo: 'Tu respuesta ya tiene captura. No es tuya.',
        respuesta: [{ de: '+52 246 118 0397', texto: 'uy se enojó 🤣🤣' }, { de: '+52 246 118 0397', texto: '📷 *Captura de tu mensaje*' }] },
      { t: 'Hacer captura, bloquear el número y reportarlo.', yo: '📷 *Captura guardada* · *Bloqueaste y reportaste este número*', tej: ['acoso3', 'bloquea'], fx: s => { s.m.acoso3 = 'bloquea'; s.m.evidenciaYare = true; }, hilo: 'La captura tiene la fecha, la hora y el número.' },
      { t: 'Escribirle a mamá.', chat: { chat: 'Mamá', sub: 'en línea', avatar: 'M' }, yo: 'Mamá, ¿puedo hablar contigo en la noche? Es algo de la prepa.', tej: ['acoso3', 'mama'], fx: s => { s.m.acoso3 = 'mama'; s.rel.mama++; }, hilo: 'Mamá recordará esto.',
        respuesta: [{ de: 'Mamá', texto: 'Claro, mija. Te espero despierta.' }, { de: 'Mamá', texto: '¿Estás bien?' }] },
      { t: 'Borrar el chat y hacer como que no pasó.', yo: false, tej: ['acoso3', 'borra'], fx: s => { s.m.acoso3 = 'borra'; } }
    ], sig: 'w22' },

    /* ----- En la noche: las que depositaron ----- */
    w22: { tipo: 'tel', chat: 'Lupita', sub: 'en línea', avatar: 'L', hora: '19:30',
      alEntrar: s => { s.m.estafadas = Math.max(1, 3 + (s.m.cobro === 'publica' ? 2 : 0) + (perdida(s) ? 2 : 0) - (s.m.gemAviso ? 2 : 0) - (s.m.carla3 === 'banco' ? 1 : 0) - (s.m.gemReporte ? 1 : 0)); },
      mensajes: s => [
        { de: 'Lupita', texto: perdida(s) ? 'Nuestra página sigue publicando lo de la cuenta 😭 y con las fotos de la abuela' : 'Ya vi lo de la otra página 😡' },
        { de: 'Lupita', texto: `Me han escrito ${s.m.estafadas} personas que dicen que nos depositaron. ¿Qué les digo??` },
        s.m.carla3 === 'banco' && { de: 'Lupita', texto: 'Carla dice que su banco alcanzó a detener el depósito. A ella sí le van a regresar su dinero.' }
      ].filter(Boolean), opciones: [
        { t: 'Que reporten la cuenta a su banco y levanten denuncia. Nosotras les ayudamos con los pasos.', tej: ['lupe3', 'denuncia'], fx: s => { s.m.lupe3 = 'denuncia'; },
          respuesta: [{ de: 'Lupita', texto: 'Va. Les mando cómo hacerlo. Y les digo que estamos con ellas.' }] },
        { t: 'Que les damos su pedido aunque no nos haya llegado el dinero.', tej: ['lupe3', 'paga'], fx: s => { s.m.lupe3 = 'paga'; s.m.regalo = s.m.estafadas; }, hilo: 'La abuela va a bordar piezas que nadie les pagó.',
          respuesta: [{ de: 'Lupita', texto: '¿Neta? …Está bien. ¿Y quién le dice a la abuela?' }] },
        { t: 'Que no es nuestro problema. Nosotras no les pedimos nada.', tej: ['lupe3', 'nada'], fx: s => { s.m.lupe3 = 'nada'; }, hilo: 'Las que depositaron recordarán cómo les contestaron.',
          respuesta: [{ de: 'Lupita', texto: 'Ok… pero se van a enojar con nosotras, no con los otros.' }] }
      ], sig: 'w23' },
    w23: { tipo: 'tel', chat: 'Iker', sub: 'en línea', avatar: 'I', hora: '21:05', alEntrar: s => { s.m.ikerCerro = true; },
      mensajes: s => s.m.quien === 'iker' ? [{ de: 'Iker', texto: 'Me mandaron llamar a Orientación mañana a primera hora' }, { de: 'Iker', texto: 'La maestra Lucía dijo «confesiones». ¿Fuiste tú?' }]
        : (s.m.iker3 === 'dijo' || s.m.mari3 === 'orientacion') ? [{ de: 'Iker', texto: 'Oye, ¿qué les dijeron en Orientación?' }, { de: 'Iker', texto: 'Si les preguntan por las cuentas de la prepa, ustedes no saben nada de confesiones, ¿va? Ya la cerré. Lo juro.' }]
          : [{ de: 'Iker', texto: 'Oye, ¿ya viste lo de la cuenta falsa de Mari?' }, { de: 'Iker', texto: 'Esa no fui yo, eh. Neta.' }, { de: 'Iker', texto: 'Ya cerré confesiones. Por si te importa.' }],
      opciones: s => s.m.quien === 'iker' ? [
        { t: '«Sí. Fui yo.»', tej: ['iker3b', 'verdad'], fx: s => { s.m.iker3b = 'verdad'; s.rel.iker--; }, hilo: 'Iker recordará esto.', respuesta: [{ de: 'Iker', texto: 'Ok.' }, { de: 'Iker', texto: 'Nomás quería saber.' }] },
        { t: '«No sé de qué hablas.»', tej: ['iker3b', 'mentira'], fx: s => { s.m.iker3b = 'mentira'; }, hilo: 'Iker recordará esto.', respuesta: [{ de: 'Iker', texto: 'Ok. Si tú dices.' }] },
        { t: 'Dejarlo en visto.', yo: false, tej: ['iker3b', 'visto'], fx: s => { s.m.iker3b = 'visto'; s.rel.iker--; } }
      ] : (s.m.iker3 === 'dijo' || s.m.mari3 === 'orientacion') ? [
        { t: '«Va.»', tej: ['iker3b', 'cubre'], fx: s => { s.m.iker3b = 'cubre'; s.rel.iker++; }, hilo: 'Iker recordará esto.', respuesta: [{ de: 'Iker', texto: 'Gracias. Neta.' }] },
        { t: '«Si me preguntan, no voy a mentir.»', tej: ['iker3b', 'verdad'], fx: s => { s.m.iker3b = 'verdad'; s.rel.iker--; }, hilo: 'Iker recordará esto.', respuesta: [{ de: 'Iker', texto: '…Ok.' }] },
        { t: 'Dejarlo en visto.', yo: false, tej: ['iker3b', 'visto'], fx: s => { s.m.iker3b = 'visto'; } }
      ] : null, sig: 'w24' },
    w24: { tipo: 'narra', escena: 'encinal', actores: s => [['yare', .25], ...(s.m.madrugada === 'recupero' || s.m.tono === 'explicado' ? [['tono', .6]] : [])],
      alEntrar: s => {
        // Para el jueves: la foto del cuaderno abre una puerta más si la contraseña no se cambió.
        if (s.m.fotoCuaderno && !s.m.cambio && !s.m.dosPasos && !perdida(s)) { s.m.puertas = [...new Set([...(s.m.puertas || []), 'foto'])]; s.m.comprometida = true; }
      },
      texto: s => (s.m.madrugada === 'recupero' || s.m.tono === 'explicado')
        ? 'En la noche, junto al lavadero, Toño me prestó su cargador sin que se lo pidiera. Se sentó a mi lado a ver cómo agarraba la señal.'
        : 'En la noche, junto al lavadero, abrí la libreta. La señal iba y venía, como yo.', sig: 'w25' },
    w25: { tipo: 'diario', fecha: 'Miércoles', parrafos: s => [
      ({ abuela: 'A las 5:48 alguien le escribió a la abuela desde el WhatsApp de Toño. Le dije que no le mandara nada. «¿Cómo que no es Toño, si dice Toño?» No supe qué contestarle.',
        recupero: 'A las 5:48 alguien le escribía a la abuela desde el WhatsApp de Toño. Lo desperté y lo recuperamos juntos. Llegué tarde a todo lo demás, pero Toño ya tiene su WhatsApp.',
        pregunto: 'Le escribí al falso Toño. Me contestó «we». Toño nunca dice «we». Ahora le escribe a toda la familia.',
        nada: s.m.abuelaDeposito ? 'Me quedé dormida con el celular en la mano. La abuela le depositó seiscientos pesos a «Toño».' : s.m.fotoCuaderno ? 'Me quedé dormida con el celular en la mano. La abuela le mandó a «Toño» la foto de la hoja de atrás del cuaderno.' : 'Me quedé dormida con el celular en la mano. La abuela no se sabía la contraseña. Por primera vez me dio gusto.' })[s.m.madrugada] || '',
      perdida(s) ? 'Nuestra página, la que ya no es nuestra, publicó una cuenta para depósitos. Carla pagó ahí.' : 'Hay otra página que se llama casi como la nuestra, con nuestras fotos al revés. Carla pagó ahí.',
      [s.m.carla3 === 'banco' && 'Le dije a Carla que llamara a su banco.', s.m.capGemela && 'Guardé capturas.', s.m.gemReporte && 'La reporté.', s.m.gemAviso && 'Publiqué un aviso.', s.m.recuperando && 'Pedí recuperar la página con mi INE y un video de mi cara.', s.m.gemComento && 'Le comenté «ESTAFA» y me bloquearon.'].filter(Boolean).join(' '),
      s.m.combi3 === 'perdio' ? 'Perdí la combi. Mamá me llevó en la moto sin decir una palabra. A veces el silencio de mamá pesa más que sus regaños.' : '',
      ({ verdad: 'A doña Tere y a Lencha les cayeron préstamos que no pidieron. Le dije a la abuela que los CURP los mandé yo. En la tarde fuimos a la Condusef. Expliqué todo. Me temblaba la voz.',
        calla: 'A doña Tere y a Lencha les cayeron préstamos que no pidieron. La abuela cree que fue «algún sinvergüenza». Yo sé cuál.' })[s.m.curp3] || '',
      'En la prepa apareció una cuenta que se llama *mari.ventura.real*. Sube «confesiones». Mari no escribe así.',
      [s.m.capFalsa && 'Guardé capturas del perfil.', s.m.repFalsa && 'Lo reporté.', s.m.compartio && 'Lo compartí para que vieran qué asco. Lo vieron. Muchos.', s.m.comFalsa && 'Les comenté que esa no era Mari. Me contestaron a mí.'].filter(Boolean).join(' '),
      ({ orientacion: s.m.orient3 === 'actua' ? 'Fui con Mari a Orientación. Llevamos pruebas. La maestra Lucía dijo «con esto sí puedo». En la tarde la cuenta ya no estaba.' : s.m.orient3 === 'parcial' ? 'Fui con Mari a Orientación. Teníamos poco. La maestra Lucía dijo que trajéramos lo que fuera, aunque nos pareciera poco.' : 'Fui con Mari a Orientación. No teníamos ni una captura. La maestra Lucía nos escuchó, pero sin pruebas no puede hacer mucho.',
        rechazo: 'Le dije a Mari que fuéramos a Orientación. «Contigo no.» Tiene razón. Yo también me acuerdo de la carita de risa.',
        reporta: 'Le dije a Mari que la reportara ella. La reportó ahí mismo, sin mirarme.',
        ignora: 'Le dije a Mari que lo ignorara. «A ti se te va a olvidar.» No se me va a olvidar.',
        pelear: 'Les contesté a todos desde mi cuenta. Ahora hablan de mí.',
        clase: 'Vi la cuenta y me fui a clase. Mari no fue a la última hora.' })[s.m.mari3] || '',
      s.m.pasillo === 'encara' ? 'En el pasillo les dije a los de 3°A que esa cuenta no es de Mari. Se callaron.' : '',
      ({ encara: 'Mau nos grababa. Le dije que le bajara. Le bajó.', amenaza: 'Le dije a Mau que sé lo de @prepalc.memes. Ahora él sabe que yo sé.', tapa: 'Mau nos grababa. Le tapé la cara a Mari con mi mochila.' })[s.m.mauGraba] || '',
      ({ responde: 'Me llegó un sticker mío desde un número desconocido. Le contesté. Ya tienen captura de mi enojo.',
        bloquea: 'Me llegó un sticker mío desde un número desconocido. Captura, bloquear, reportar. Me temblaban las manos igual.',
        mama: 'Me llegó un sticker mío desde un número desconocido. Le escribí a mamá. Me está esperando despierta.',
        borra: 'Me llegó un sticker mío desde un número desconocido. Lo borré. Sigue aquí, en la cabeza.' })[s.m.acoso3] || '',
      ({ denuncia: `${s.m.estafadas} personas depositaron a la cuenta falsa. Les dijimos cómo reportar y denunciar.`, paga: `${s.m.estafadas} personas depositaron a la cuenta falsa. Les vamos a dar su pedido igual. La abuela todavía no lo sabe.`, nada: `${s.m.estafadas} personas depositaron a la cuenta falsa. Les dijimos que no es nuestro problema. Lupita dice que se van a enojar con nosotras.` })[s.m.lupe3] || '',
      ({ verdad: 'Iker me preguntó si fui yo. Le dije que sí.', mentira: 'Iker me preguntó si fui yo. Le dije que no sabía de qué hablaba.', visto: 'Dejé a Iker en visto.', cubre: 'Le dije a Iker que sí, que no sabemos nada.' })[s.m.iker3b] || '',
      'Faltan dos días para la feria.'
    ], sig: 'w26' },
    w26: { tipo: 'tejido', titulo: 'El tejido de tu miércoles', proximo: 'Jueves', filas: () => CAPITULO3.tejido, sueltos: s => [
      s.m.fotoCuaderno && 'Alguien que no es Toño tiene una foto de la hoja de atrás del cuaderno azul.',
      s.m.abuelaDeposito && 'La abuela le depositó seiscientos pesos a «Toño».',
      s.m.tonoSigue && 'El falso Toño sigue escribiéndole a la familia.',
      s.m.gemBloqueo && 'La otra página te bloqueó.',
      s.m.recuperando && 'Facebook está revisando tu solicitud para recuperar la página.',
      s.m.estafadas && `${s.m.estafadas} personas depositaron a la cuenta ****4471.`,
      s.m.regalo && 'La abuela va a bordar piezas que nadie les pagó.',
      s.m.compartio && 'Tu publicación hizo que más gente viera la cuenta falsa.',
      s.m.mauSabe && 'Mau sabe que sabes.',
      s.m.ikerExpuesto && 'Orientación sabe quién maneja @confesiones.prepalc.',
      s.m.mauExpuesto === true && 'El celular de Mau sigue en prefectura.',
      s.m.evidenciaYare && 'Tienes capturas de los mensajes que te mandaron.',
      s.m.yareMarcada && 'Ya hay un sticker tuyo.',
      s.m.ikerCerro && 'Iker dice que cerró @confesiones.prepalc.'
    ].filter(Boolean), sig: 'j0' }
  };

  const tejido = [
    { clave: 'madrugada', titulo: 'Miércoles · El WhatsApp de Toño', opciones: [['abuela', '«Ese no es Toño»'], ['recupero', 'Lo recuperaron'], ['pregunto', 'Le escribiste'], ['nada', 'Te dormiste']] },
    { clave: 'carla3', titulo: 'Miércoles · Carla depositó', opciones: [['pregunto', '«¿Cuál publicación?»'], ['banco', '«Llama a tu banco»'], ['espera', '«Déjame checar»']] },
    { clave: 'capGemela', titulo: 'Miércoles · Capturas de la otra página', opciones: [['si', 'Guardadas'], ['no', 'Ninguna']] },
    { clave: 'gemReporte', titulo: 'Miércoles · Reportar la otra página', opciones: [['si', 'Reportada'], ['no', 'Sin reportar']] },
    { clave: 'gemAviso', titulo: 'Miércoles · Avisar a las clientas', opciones: [['si', 'Aviso publicado'], ['no', 'Sin aviso']] },
    { clave: 'combi3', titulo: 'Miércoles · La combi de las 6:20', opciones: [['alcanzo', 'La alcanzaste'], ['perdio', 'Se te fue']] },
    { clave: 'curp3', titulo: 'Miércoles · Los préstamos', opciones: [['verdad', 'Le dijiste a la abuela'], ['calla', 'Te callaste']] },
    { clave: 'capFalsa', titulo: 'Miércoles · Capturas del perfil falso', opciones: [['si', 'Guardadas'], ['no', 'Ninguna']] },
    { clave: 'repFalsa', titulo: 'Miércoles · Reportar el perfil falso', opciones: [['si', 'Reportado'], ['no', 'Sin reportar']] },
    { clave: 'mari3', titulo: 'Miércoles · Con Mari', opciones: [['orientacion', 'A Orientación'], ['rechazo', '«Contigo no»'], ['reporta', 'Que la reporte'], ['ignora', '«Ignórala»'], ['pelear', 'Contestar'], ['clase', 'A clase']] },
    { clave: 'pasillo', titulo: 'Miércoles · El pasillo', opciones: [['encara', 'Los encaraste'], ['sigue', 'Seguiste']] },
    { clave: 'mauGraba', titulo: 'Miércoles · Mau graba', opciones: [['encara', '«Bájale»'], ['amenaza', '«Sé lo de memes»'], ['tapa', 'Tapaste a Mari']] },
    { clave: 'iker3', titulo: 'Miércoles · Iker en el pasillo', opciones: [['dijo', 'Le dijiste'], ['evade', '«A ningún lado»']] },
    { clave: 'orient', titulo: 'Miércoles · Quién habla', opciones: [['todo', 'Tú'], ['acompana', 'Mari']] },
    { clave: 'quien', titulo: 'Miércoles · ¿Quién está detrás?', opciones: [['prefectura', 'El celular'], ['mau', 'Mau'], ['iker', 'Iker'], ['nose', '«No sabemos»']] },
    { clave: 'acoso3', titulo: 'Miércoles · Tu sticker', opciones: [['responde', 'Respondiste'], ['bloquea', 'Captura y bloqueo'], ['mama', 'Mamá'], ['borra', 'Lo borraste']] },
    { clave: 'lupe3', titulo: 'Miércoles · Las que depositaron', opciones: [['denuncia', 'Denuncia'], ['paga', 'Pedido igual'], ['nada', '«No es nuestro problema»']] },
    { clave: 'iker3b', titulo: 'Miércoles · Iker en la noche', opciones: [['verdad', 'La verdad'], ['mentira', 'Mentiste'], ['cubre', 'Lo cubres'], ['visto', 'Visto']] }
  ];

  return { nodos, tejido, util: { STICKER_YARE, STICKER_ESTAFA, perdida } };
})();
