/* Hilo Rojo · escena interactiva del Ciber El Cometa (computadora 4).
   El reloj corre: cada 4 segundos reales es un minuto. La última combi sale a las 18:00. */
const Ciber = (() => {
  'use strict';
  const COMBI = 18 * 60, CAMINAR = 4;
  let s, el, listo, est, intervalo;
  const f = (t) => Motor.formato(t);
  const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;
  const espera = (ms) => new Promise(r => setTimeout(r, ms));

  const CHATS = {
    carla: { nombre: 'Carla Méndez', sub: 'Puebla', hora: '15:48', av: 'C',
      entra: [{ texto: 'Hola!! 😍 Quiero el mantel grande de flores rojas y dos servilleteros. ¿Cómo le hago para pagar?' }] },
    fernanda: { nombre: 'Fernanda R.', sub: 'Tlaxcala', hora: '16:05', av: 'F',
      entra: [{ texto: 'Hola, buenas tardes. Están preciosos, pero ya me estafaron una vez con una página de artesanías 😅' }, { texto: '¿Me podrías mandar foto de una INE? La de la dueña o la tuya, nomás para saber que sí son reales.' }] },
    ramiro: { nombre: 'Ramiro Díaz', sub: 'Coordinación · Feria del Bordado Tepetlán', hora: '16:22', av: 'R',
      entra: [{ texto: 'Buenas tardes. Para el registro de puestos del sábado necesito nombre completo, CURP y teléfono de cada una de las artesanas de su cooperativa.' }, { texto: 'La fecha límite es hoy a las 19:00. Si no, se libera el lugar. Gracias.' }] }
  };

  function iniciar(n, estado, elementos, done) {
    s = estado; el = elementos; listo = done;
    est = { min: 17 * 60 + 16, pantalla: 'login', ramiro: 'abierta', guardar: null, catalogo: 0, subiendo: false,
      chats: { carla: null, fernanda: null, ramiro: null }, historial: { carla: [], fernanda: [], ramiro: [] }, abierto: null, final: false, modal: false };
    el.caja.classList.remove('visible');
    el.panel.className = 'panel visible ciber';
    pintar();
    intervalo = setInterval(() => { if (!est.modal) { est.min++; reloj(); revisar(); } }, 4000);
  }
  function detener() { clearInterval(intervalo); }

  function gastar(min) { est.min += min; reloj(); revisar(); }
  function reloj() {
    const r = el.panel.querySelector('.reloj-ciber');
    if (!r) return;
    r.textContent = hhmm(est.min);
    r.classList.toggle('tarde', est.min >= 17 * 60 + 45);
    const t = el.panel.querySelector('.tareas');
    if (t) t.innerHTML = tareas();
  }
  function tareas() {
    const c = Object.values(est.chats).filter(Boolean).length;
    return `<span class="${est.pantalla !== 'login' ? 'ok' : ''}">Entrar</span><span class="${est.catalogo >= 100 ? 'ok' : ''}">Catálogo</span><span class="${c === 3 ? 'ok' : ''}">Mensajes ${c}/3</span>`;
  }
  function revisar() {
    if (est.final) return;
    const todo = est.catalogo >= 100 && Object.values(est.chats).every(Boolean);
    if (est.min >= 17 * 60 + 54 || todo) final(todo); // a esa hora, cerrar bien la sesión ya cuesta la combi
  }

  /* ---------- Pintado ---------- */
  function pintar() {
    if (est.final) return; // la ventana de la combi ya está en pantalla
    el.panel.innerHTML = `
      <div class="monitor">
        <div class="mon-barra">
          <span class="reloj-ciber">${hhmm(est.min)}</span>
          <span class="combi-aviso">${Iconos.svg('combi')} Última combi a El Encinal · <b>18:00</b></span>
          <span class="tareas">${tareas()}</span>
        </div>
        <div class="navegador">
          <div class="nav-url">${Iconos.svg('candado')}${est.pantalla === 'login' ? 'facebook.com' : 'facebook.com/HiloRojoBordados'}</div>
          <div class="nav-cuerpo">${est.pantalla === 'login' ? login() : pagina()}</div>
        </div>
        <div class="mon-pie">PC 4 · Ciber El Cometa · $12 la hora</div>
      </div>
      <div class="ciber-modal" hidden></div>`;
    conectar();
  }

  function login() {
    const r = est.ramiro;
    return `<div class="fb-login">
      <div class="recientes">
        <h3>Inicios de sesión recientes</h3>
        <p class="pista">En esta computadora</p>
        ${r === 'cerrada' ? `<div class="tarjeta-sesion quitada"><span class="av">R</span><div><b>Ramiro Díaz</b><small>Sesión cerrada en este equipo</small></div></div>`
          : `<div class="tarjeta-sesion"><span class="av">R</span><div><b>Ramiro Díaz</b><small>Activo hace 6 h · sesión abierta</small></div>
            <button class="fb-btn sec" data-c="ramiro-ver">Continuar</button><button class="fb-x" data-c="ramiro-quitar" title="Quitar">✕</button></div>`}
        <div class="tarjeta-sesion vacia"><span class="av">+</span><div><b>Agregar cuenta</b></div></div>
      </div>
      <div class="formulario-fb">
        <p class="fb-logo">facebook</p>
        <div class="fb-campo">yarecoronel.bordados@correo.mx</div>
        <div class="fb-campo">••••••••••••</div>
        <button class="fb-btn" data-c="entrar">Iniciar sesión</button>
        <p class="pista">Escribiste tu correo y tu contraseña. Rocío está viendo la tele.</p>
      </div>
    </div>`;
  }

  function pagina() {
    const lista = Object.entries(CHATS).map(([k, c]) => `
      <button class="conv ${est.abierto === k ? 'activa' : ''} ${est.chats[k] ? 'hecha' : 'nueva'}" data-c="abrir" data-k="${k}">
        <span class="av">${c.av}</span><span><b>${c.nombre}</b><small>${est.chats[k] ? 'Respondido' : c.entra[c.entra.length - 1].texto.slice(0, 38) + '…'}</small></span><em>${c.hora}</em>
      </button>`).join('');
    return `<div class="fb-pagina">
      <div class="portada-fb"><div class="logo-fb">${Iconos.svg('hilo')}</div><div><b>Hilo Rojo · Bordados de El Encinal</b><small>Artesanía · 12 me gusta</small></div></div>
      <div class="fb-cols">
        <div class="fb-col">
          <div class="bloque">
            <h4>Catálogo de la feria</h4>
            <p class="pista">30 fotos · tomadas con el celular de la abuela</p>
            ${est.catalogo >= 100 ? `<p class="listo-txt">✓ Catálogo publicado</p>`
              : `<div class="progreso"><span style="width:${est.catalogo}%"></span></div>
                 <button class="fb-btn" data-c="subir" ${est.subiendo ? 'disabled' : ''}>${est.subiendo ? `Subiendo… ${Math.round(est.catalogo)}%` : 'Subir 30 fotos'}</button>`}
          </div>
          <div class="bloque"><h4>Mensajes</h4>${lista}</div>
        </div>
        <div class="fb-col chat-col">${est.abierto ? conversacion(est.abierto) : `<p class="vacio">Elige un mensaje para contestar.</p>`}</div>
      </div>
    </div>`;
  }

  function conversacion(k) {
    const c = CHATS[k];
    const hist = [...c.entra.map(m => ({ de: 'otro', ...m })), ...est.historial[k]];
    return `<div class="conv-cab"><span class="av">${c.av}</span><div><b>${c.nombre}</b><small>${c.sub}${k === 'ramiro' && est.ramiro === 'cerrada' ? ' · activo hace 6 h' : ''}</small></div></div>
      <div class="conv-msjs">${hist.map(m => `<div class="cm ${m.de}">${f(m.texto)}</div>`).join('')}</div>
      <div class="conv-resp">${est.chats[k] ? '' : opciones(k)}</div>`;
  }

  function opciones(k) {
    const pend = est.pendiente?.[k];
    if (k === 'carla') return `<button class="resp" data-c="carla">Responder con los datos de pago</button>`;
    if (k === 'fernanda') return `
      <button class="resp" data-c="fer" data-v="enviada">Mandarle la foto de la INE de la abuela (la tienes en el celular)</button>
      <button class="resp" data-c="fer" data-v="video">Grabar el mantel con un papel que diga “Para Fernanda” y la fecha <small>+6 min</small></button>
      <button class="resp" data-c="fer" data-v="feria">Decirle que, si no confía, pague al recoger en la feria</button>`;
    if (k === 'ramiro' && !pend) return `
      <button class="resp" data-c="ram" data-v="enviar">Copiar la lista del cuaderno (nombre, CURP y teléfono de las diez) y mandarla</button>
      <button class="resp" data-c="ram" data-v="persona">Contestar que mañana van en persona a la oficina del municipio</button>
      <button class="resp" data-c="ram" data-v="preguntar">Preguntarle por qué el registro es por Facebook</button>`;
    if (k === 'ramiro' && pend) return `
      <button class="resp" data-c="ram2" data-v="enviar">Ni modo: mandar la lista para no perder el lugar</button>
      <button class="resp" data-c="ram2" data-v="persona">Insistir: “Mañana a las 9 estamos en la oficina con las credenciales”</button>`;
    return '';
  }

  function textoPago() {
    return { publica: 'Hola Carla! 🙌 Puedes depositar a la cuenta que viene en la publicación y me mandas tu comprobante por aquí.',
      mensaje: 'Hola Carla! Te paso los datos por aquí: BBVA · Graciela Coronel · cuenta terminación 4471. Me mandas tu comprobante 🙌',
      feria: 'Hola Carla! Este año todo se paga al recoger en la feria del sábado en Tepetlán. Te lo aparto 🙌' }[s.m.cobro || 'mensaje'];
  }

  /* ---------- Eventos ---------- */
  function conectar() {
    el.panel.querySelectorAll('[data-c]').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); accion(b.dataset.c, b); }));
  }

  async function responder(k, texto, gasto, respuesta) {
    est.historial[k].push({ de: 'yo', texto });
    gastar(gasto);
    if (est.final) return;
    pintar();
    if (respuesta) {
      await espera(900);
      est.historial[k].push({ de: 'otro', texto: respuesta });
      if (!est.final) pintar();
    }
  }

  async function accion(c, b) {
    if (est.final && !c.startsWith('fin')) return;
    switch (c) {
      case 'ramiro-ver':
        modal(`<h3>Esto abriría el Facebook de Ramiro Díaz</h3><p>Tiene 3 mensajes sin leer y su sesión lleva abierta desde la mañana en esta computadora. No lo conoces.</p>
          <div class="m-btns"><button class="fb-btn" data-m="cerrar">Cerrar su sesión <small>+1 min</small></button><button class="fb-btn sec" data-m="nada">No es mi asunto</button></div>`,
          (m) => { if (m === 'cerrar') { est.ramiro = 'cerrada'; gastar(1); Motor.hilo('Ramiro no sabrá que fuiste tú.'); } else est.ramiro = 'vista'; pintar(); });
        break;
      case 'ramiro-quitar':
        est.ramiro = 'cerrada'; gastar(1); Motor.hilo('Ramiro no sabrá que fuiste tú.'); pintar(); break;
      case 'entrar':
        gastar(3);
        if (est.final) return;
        modal(`<p class="nav-pop">${Iconos.svg('llave')} <b>¿Guardar la contraseña de facebook.com?</b><br><small>El navegador podrá rellenarla la próxima vez en este equipo.</small></p>
          <div class="m-btns"><button class="fb-btn" data-m="guardar">Guardar</button><button class="fb-btn sec" data-m="nunca">Nunca</button></div>`,
          (m) => { est.guardar = m; est.pantalla = 'pagina'; pintar(); });
        break;
      case 'subir': {
        est.subiendo = true; pintar();
        while (est.catalogo < 100 && !est.final) {
          await espera(170);
          est.catalogo = Math.min(100, est.catalogo + 3.4);
          if (Math.round(est.catalogo) % 17 === 0) gastar(2);
          const barra = el.panel.querySelector('.progreso span'), btn = el.panel.querySelector('[data-c="subir"]');
          if (barra) barra.style.width = est.catalogo + '%';
          if (btn) btn.textContent = `Subiendo… ${Math.round(est.catalogo)}%`;
        }
        est.subiendo = false;
        if (!est.final) { reloj(); pintar(); revisar(); }
        break;
      }
      case 'abrir': est.abierto = b.dataset.k; pintar(); break;
      case 'carla':
        est.chats.carla = 'ok';
        await responder('carla', textoPago(), 2, s.m.cobro === 'feria' ? 'Ay, ok. Yo no voy a poder ir, pero se lo encargo a mi prima. Gracias ✨' : '¡Listo! En la noche te mando el comprobante ✨');
        break;
      case 'fer': {
        const v = b.dataset.v;
        est.chats.fernanda = v;
        const r = {
          enviada: ['📷 *INE_Graciela_Coronel.jpg*', 2, 'Ay, gracias!! Ya me dio confianza 🥹 Quiero el camino de mesa azul.'],
          video: ['🎥 *video · 0:12* (el mantel, y un papel que dice “Para Fernanda · lunes”)', 6, 'JAJA qué lindo. Ok, me convenciste: quiero dos 🥹'],
          feria: ['Entiendo 🙏 Si prefieres, lo apartamos y pagas al recoger en la feria del sábado en Tepetlán.', 2, 'Mmm, es que no voy a poder ir 😕 Bueno, gracias.']
        }[v];
        await responder('fernanda', r[0], r[1], r[2]);
        break;
      }
      case 'ram': {
        const v = b.dataset.v;
        if (v === 'enviar') { est.chats.ramiro = 'enviada'; await responder('ramiro', '📎 *Lista: 10 artesanas · nombre completo, CURP y teléfono*', 5, 'Recibido. Quedan registradas. Gracias.'); break; }
        est.pendiente = { ramiro: true };
        await responder('ramiro', v === 'persona' ? 'Buenas tardes. ¿Podemos llevarlos mañana en persona a la oficina del municipio?' : 'Buenas tardes. Disculpe, ¿por qué el registro es por Facebook y no en el municipio?', 2,
          v === 'persona' ? 'Ya no hay tiempo, señorita. Si no me los manda hoy, pierden el lugar.' : 'Por la contingencia, el sistema del municipio está caído. Urge, ya casi cierro la lista.');
        break;
      }
      case 'ram2': {
        const v = b.dataset.v;
        est.chats.ramiro = v === 'enviar' ? 'enviada' : 'persona';
        await responder('ramiro', v === 'enviar' ? '📎 *Lista: 10 artesanas · nombre completo, CURP y teléfono*' : 'Mañana a las 9 estamos en la oficina con las credenciales. Gracias.', v === 'enviar' ? 5 : 2,
          v === 'enviar' ? 'Recibido. Quedan registradas. Gracias.' : null);
        if (v !== 'enviar') { est.historial.ramiro.push({ de: 'nota', texto: 'Visto ✓✓' }); pintar(); }
        break;
      }
    }
  }

  function modal(html, cb) {
    const m = el.panel.querySelector('.ciber-modal');
    est.modal = true;
    m.innerHTML = `<div class="m-caja">${html}</div>`;
    m.hidden = false;
    m.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', (e) => { e.stopPropagation(); m.hidden = true; est.modal = false; cb(b.dataset.m); }));
  }

  /* ---------- Cierre: la combi ---------- */
  function final(todo) {
    est.final = true;
    clearInterval(intervalo);
    const falta = !todo ? '<p>Te faltan cosas, pero ya no hay tiempo.</p>' : '<p>Terminaste. Más o menos.</p>';
    modal(`<h3 class="hora-grande">${hhmm(est.min)}</h3><p>La última combi a El Encinal sale a las <b>18:00</b> de la esquina de La Güera. Caminando son 4 minutos.</p>${falta}
      <div class="m-btns col">
        <button class="fb-btn" data-m="cerro">Cerrar sesión, borrar el historial y salir <small>+3 min</small></button>
        <button class="fb-btn sec" data-m="corrio">Agarrar la mochila y salir corriendo</button>
      </div>`, (m) => cerrar(m));
  }

  function cerrar(salida) {
    if (salida === 'cerro') est.min += 3;
    const llega = est.min + CAMINAR;
    const alcanza = llega <= COMBI;
    const pedidos = (est.chats.carla ? 1 : 0) + ({ enviada: 1, video: 2 }[est.chats.fernanda] || 0) + (est.catalogo >= 100 ? 3 : 0);
    Object.assign(s.m, {
      ramiro: est.ramiro, guardoPass: est.guardar || 'nunca', ine: est.chats.fernanda || 'sin', curp: est.chats.ramiro || 'sin',
      catalogo: est.catalogo >= 100, salida, combi: alcanza, llegada: llega
    });
    s.pedidos += pedidos;
    s.tejido.ramiro = est.ramiro === 'cerrada' ? 'cerrada' : 'abierta';
    s.tejido.guardar = est.guardar || 'nunca';
    s.tejido.ine = est.chats.fernanda || 'sin';
    s.tejido.curp = est.chats.ramiro || 'sin';
    s.tejido.salida = salida;
    s.tejido.combi = alcanza ? 'si' : 'no';
    if (salida === 'corrio') Motor.hilo('La computadora 4 sigue con tu sesión abierta.');
    else if (est.guardar === 'guardar') Motor.hilo('Borraste el historial. La contraseña guardada no se borró.');
    listo();
  }

  return { iniciar, detener };
})();
