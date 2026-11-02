/* Hilo Rojo · Prólogo (domingo) y Capítulo 1 (lunes).
   Cada nodo: tipo, texto o mensajes, escena/actores opcionales y sig (o una función que decide).
   Las marcas (s.m) son los “hilos”: se leen en capítulos posteriores. */
const CAPITULO1 = (() => {
  const hhmm = (m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

  const FOTO_MARI = `<svg viewBox="0 0 240 150" aria-label="Foto de una chica dormida contra la ventana de una combi"><defs><clipPath id="foto-mari"><rect width="240" height="150"/></clipPath><linearGradient id="foto-mari-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B4CC"/><stop offset="1" stop-color="#F2C7AE"/></linearGradient></defs><g clip-path="url(#foto-mari)"><rect width="240" height="150" fill="#3A3550"/><rect x="6" y="8" width="138" height="104" rx="14" fill="url(#foto-mari-v)"/><path d="M6 78 Q44 60 86 74 T144 68 V112 H6Z" fill="#9A86A6"/><path d="M6 92 Q60 80 144 90 V112 H6Z" fill="#7A6890"/><rect x="6" y="8" width="138" height="104" rx="14" fill="none" stroke="#2B2538" stroke-width="6"/><rect x="152" y="30" width="96" height="130" rx="20" fill="#4A3C5E"/><rect x="152" y="30" width="96" height="16" rx="8" fill="#5A4A70"/>${Personajes.retratoG('mari', { x: 112, y: 100, escala: 1.3, inclina: -25, exp: 'cerrados' })}<rect x="0" y="134" width="240" height="16" fill="#2B2538" opacity=".85"/><circle cx="196" cy="22" r="40" fill="#fff" opacity=".07"/></g></svg>`;

  /* La decisión sobre la foto de Mari aparece dos veces (si preguntas quién la mandó, Iker insiste). */
  const MARI_NO = { t: '«No. Ella ni sabe que alguien le tomó esa foto.»', tej: ['mari', 'defendida'], fx: s => { s.m.mari = 'defendida'; s.rel.iker--; }, hilo: 'Iker recordará esto.',
    dice: [['iker', 'Ash. Ok, ok. Qué aburrida te pones los lunes.'], ['iker', 'Pero si no la subo yo, la sube otra cuenta, eh. Ya sabes cómo es esto.'], [null, 'Tenía razón. Eso fue lo peor.']] };
  const MARI_TAPADA = { t: '«Súbela, pero tápale la cara.»', tej: ['mari', 'tapada'], fx: s => { s.m.mari = 'tapada'; }, hilo: 'Alguien en Las Ánimas reconocerá esa ventana.',
    dice: [['iker', 'Listo, con un sticker de gatito. ¿Contenta?'], [null, 'La subió a las 7:58. A las 8:10 alguien comentó: «es la de Las Ánimas, ¿no?». Un gatito no tapa una ventana de combi.']] };
  const MARI_SILENCIO = { tej: ['mari', 'publicada'], fx: s => { s.m.mari = 'publicada'; }, hilo: 'Mari no sabe que estuviste ahí. Todavía.',
    dice: [['iker', 'El que calla otorga.'], [null, 'A las 8:10 ya tenía ciento cuarenta likes. Mari entró al salón a las 8:12, sin saber nada, y se sentó junto a la ventana. Yo me senté lejos. No sé por qué me dio vergüenza a mí.']] };

  const nodos = {
    /* ================= PRÓLOGO · DOMINGO ================= */
    p0: { tipo: 'titulo', sup: 'Prólogo', titulo: 'Domingo, 19:40', sub: 'El Encinal · faltan seis días para la feria', sig: 'p1' },
    p1: { tipo: 'narra', escena: 'encinal', actores: [['yare', .28]], texto: 'En El Encinal la señal llega por rachas. Hay que pararse junto al lavadero, levantar el celular como quien ofrece algo al cielo, y esperar.', sig: 'p2' },
    p2: { tipo: 'narra', texto: 'Me llamo Yaretzi. Aquí todos me dicen Yare. Desde que la abuela fundó la cooperativa, también me dicen «la que sabe de celulares». Como si fuera un oficio. Como si alguien me hubiera enseñado.', sig: 'p3' },
    p3: { tipo: 'tel', chat: 'Abuela Chela', sub: 'en línea', avatar: 'C', hora: '19:41', mensajes: [
      { de: 'Abuela Chela', audio: '0:41', texto: 'Mija, ya hablé con las muchachas. Si juntamos cuarenta pedidos antes de la feria, nos alcanza para el hilo de todo el año. Tú ponle al Facebook ese que se vea bonito, como tú sabes. Y no te desveles, ¿eh?' }
    ], sig: 'p4' },
    p4: { tipo: 'narra', texto: '«Como tú sabes». La abuela cree que internet es un lugar. Que yo voy y vengo de ahí como quien va al molino.', sig: 'p5' },
    p5: { tipo: 'tel', grupo: true, chat: 'Hilo Rojo 🧵', sub: 'Abuela, Lupita, Doña Tere y 7 más', avatar: '🧵', hora: '19:44', mensajes: [
      { de: 'Doña Tere', texto: '¿Y cómo nos van a pagar los de la ciudad? Yo no tengo tarjeta' },
      { de: 'Lupita', texto: 'Pues que depositen, tía. Ponemos la cuenta de la abuela en la publicación y ya' },
      { de: 'Doña Tere', texto: '¿Y toda la gente va a ver el número?' },
      { de: 'Lupita', texto: 'Así lo hacen todas las páginas. ¿Quién nos va a robar a nosotras? jaja' },
      { de: 'Doña Rosa', texto: 'Que diga Yare' },
      { de: 'Abuela Chela', audio: '0:04', texto: 'Lo que diga Yare.' }
    ], opciones: [
      { t: 'Pongo la cuenta en la publicación. Así es más rápido.', tej: ['cobro', 'publica'], pedidos: 4, fx: s => { s.m.cobro = 'publica'; s.rel.lupita++; }, hilo: 'Las bordadoras recordarán cómo decidiste cobrar.',
        respuesta: [{ de: 'Lupita', texto: 'Esooo 🙌 mañana amanecemos con pedidos' }, { de: 'Doña Tere', texto: 'Bueno… ustedes saben de eso' }] },
      { t: 'La cuenta la doy por mensaje, a cada quien que pida.', tej: ['cobro', 'mensaje'], pedidos: 2, fx: s => { s.m.cobro = 'mensaje'; }, hilo: 'Las bordadoras recordarán cómo decidiste cobrar.',
        respuesta: [{ de: 'Lupita', texto: 'Vas a tener que contestarle a todo el mundo, eh' }, { de: 'Doña Rosa', texto: '👍' }] },
      { t: 'Que paguen al recoger en la feria. Sin depósitos.', tej: ['cobro', 'feria'], fx: s => { s.m.cobro = 'feria'; s.rel.lupita--; }, hilo: 'Las bordadoras recordarán cómo decidiste cobrar.',
        respuesta: [{ de: 'Doña Tere', texto: 'Así sí me gusta' }, { de: 'Lupita', texto: 'Así nadie va a pedir nada, Yare…' }] }
    ], sig: 'p6' },
    p6: { tipo: 'narra', escena: 'cocina', actores: [['yare', .3, { voltea: true }], ['lupita', .72, { voltea: true }]], texto: 'Lupita llegó a las nueve con dos refrescos y el cuaderno de pedidos de la abuela: el de pasta azul, que tiene treinta años de nombres, medidas, teléfonos y fiados.', sig: 'p7' },
    p7: { tipo: 'dice', quien: 'lupita', texto: 'Ya quedó la página. Nomás falta la contraseña. Ponle una que todas nos acordemos, ¿no? Como «bordados2024».', sig: 'p8' },
    p8: { tipo: 'dice', quien: 'yare', texto: 'Estamos en 2026, Lupe.', sig: 'p9' },
    p9: { tipo: 'dice', quien: 'lupita', texto: 'Pues «bordados2026». ¿Ves? Fácil. Hasta doña Tere.', sig: 'p10' },
    p10: { tipo: 'clave', sig: 'p11' },
    p11: { tipo: 'dice', quien: 'lupita', texto: s => s.m.clave === 'debil' ? 'Bueno. ¿Y dónde la anotamos? Porque aunque esté fácil, a mí se me olvida todo.' : 'Bueno, genia. ¿Y dónde la anotamos? Porque yo eso no me lo aprendo ni en un año.', sig: 'p12' },
    p12: { tipo: 'elige', texto: 'Lupita ya tiene la pluma en la mano.', opciones: [
      { t: '«Atrás del cuaderno de pedidos. Ahí nadie se fija.»', tej: ['reparto', 'cuaderno'], fx: s => { s.m.reparto = 'cuaderno'; }, hilo: 'El cuaderno azul pasa por muchas manos.',
        dice: [['lupita', 'Eso. Junto a los fiados, que nadie los lee.']] },
      { t: '«Te la mando por WhatsApp y la borras luego.»', tej: ['reparto', 'whatsapp'], fx: s => { s.m.reparto = 'whatsapp'; }, hilo: 'Lupita dijo que la borraría.',
        dice: [['lupita', 'Sí, sí, ahorita la borro.'], [null, 'No la borró. Yo tampoco.']] },
      { t: '«Nadie la anota. Te agrego como administradora con tu propia cuenta.»', tej: ['reparto', 'cuentas'], fx: s => { s.m.reparto = 'cuentas'; s.m.desvelo = true; s.rel.lupita--; }, hilo: 'Esa noche dormiste cuatro horas.',
        dice: [['lupita', '¿Y eso cuánto tarda?'], [null, 'Tardamos hasta la una. La señal se fue cuatro veces. Lupita se durmió en la silla con la boca abierta y yo pensé, sin querer, que ojalá nadie le tomara una foto así.']] }
    ], sig: 'p13' },
    p13: { tipo: 'narra', escena: 'encinal', actores: [['yare', .28]], texto: s => `A las 23:52 subí la primera foto: el mantel de la abuela, el de las flores con hilo rojo. A la medianoche tenía doce me gusta y ${s.m.cobro === 'publica' ? 'dos personas preguntando si ya podían depositar.' : 'tres personas preguntando precio.'}`, sig: 'p14' },
    p14: { tipo: 'narra', texto: 'Me dormí con el celular en la mano. Soñé que bordaba algo que no se terminaba nunca, y que alguien del otro lado jalaba el hilo.', sig: 'l0' },

    /* ================= CAPÍTULO 1 · LUNES ================= */
    l0: { tipo: 'titulo', sup: 'Capítulo 1', titulo: 'Lunes', sub: 'Tepetlán · faltan cinco días para la feria', sig: 'l1' },
    l1: { tipo: 'narra', escena: 'combi', actores: [], texto: s => `${s.m.desvelo ? 'Dormí cuatro horas y lo sentí en cada curva. ' : ''}La combi de las 6:20 es la única que llega a tiempo a la prepa: treinta y ocho minutos de curvas, cumbia bajita y la señal que regresa justo en la subida del cerro.`, sig: 'l2' },
    l2: { tipo: 'tel', grupo: true, app: 'fb', chat: 'Hilo Rojo · Bordados', sub: 'Mensajes de la página', avatar: '🧵', hora: '6:51', boton: 'Guardar el celular', mensajes: [
      { de: 'Sofía G.', texto: 'Hola! ¿Precio del mantel grande? 😍' },
      { de: 'Ernesto Cal', texto: '¿Hacen envíos a Puebla?' },
      { de: 'Bety Rmz', si: s => s.m.cobro === 'publica', texto: 'Ya deposité 💸 te mando comprobante en un rato' },
      { de: 'Lupita', texto: s => `YA LLEVAMOS ${s.pedidos + 3} PEDIDOS 😭🧵` }
    ], sig: 'l3' },
    l3: { tipo: 'narra', escena: 'prepa', actores: [['yare', .3, { voltea: true }], ['iker', .7, { voltea: true }]], texto: 'Iker me estaba esperando en la reja, como siempre, con la cara de quien trae un chisme que no le cabe en el cuerpo.', sig: 'l4' },
    l4: { tipo: 'dice', quien: 'iker', texto: 'Te tengo que enseñar algo. Pero júrame que no le dices a nadie. Ni a tu abuela.', sig: 'l5' },
    l5: { tipo: 'dice', quien: 'iker', texto: '¿Ubicas @confesiones.prepalc? Dos mil trescientos seguidores. Adivina quién la maneja.', sig: 'l6' },
    l6: { tipo: 'elige', opciones: [
      { t: '«¿Tú? ¿Desde cuándo?»', fx: s => { s.m.sabiaIker = false; }, dice: [['iker', 'Desde agosto. Es lo más divertido que he hecho en la vida. La gente manda de todo.']] },
      { t: '«Ya sabía. Escribes igual que hablas.»', fx: s => { s.m.sabiaIker = true; s.rel.iker++; }, dice: [['iker', '¿Neta? Chale. Bueno, nomás tú sabes. La gente manda de todo, Yare. De todo.']] }
    ], sig: 'l7' },
    l7: { tipo: 'tel', app: 'ig', chat: '@confesiones.prepalc', sub: 'Solicitudes de mensaje', avatar: '🤫', hora: '7:41', boton: 'Devolverle el celular', mensajes: [
      { de: 'Anónimo', img: FOTO_MARI, texto: 'la bella durmiente de Las Ánimas 😴 ronca más fuerte que la combi jajaja' }
    ], sig: 'l8' },
    l8: { tipo: 'narra', texto: 'Era Mari. Mari Ventura, la de Las Ánimas, la que se sienta junto a la ventana y no le habla a nadie. Dormida, con la boca abierta, la cabeza contra el vidrio. La foto era de hoy en la mañana. No de mi combi: de la otra.', sig: 'l9' },
    l9: { tipo: 'dice', quien: 'iker', texto: 'No es para tanto, ¿eh? Todos nos dormimos en la combi. Hasta es tierno. ¿La subo? La gente se va a morir de risa.', sig: 'l10' },
    l10: { tipo: 'elige', tiempo: 7, texto: 'Iker ya tiene el dedo sobre «Publicar».', silencio: MARI_SILENCIO, opciones: [
      MARI_NO, MARI_TAPADA,
      { t: '«¿Quién te la mandó?»', fx: s => { s.m.pregunto = true; }, ir: 'l10b' }
    ], sig: 'l11' },
    l10b: { tipo: 'dice', quien: 'iker', texto: 'Es anónimo, wey. Ese es el chiste. Pudo ser cualquiera de su combi. O el chofer, jaja.', sig: 'l10c' },
    l10c: { tipo: 'elige', tiempo: 5, texto: 'Iker vuelve a poner el dedo sobre «Publicar».', silencio: MARI_SILENCIO, opciones: [MARI_NO, MARI_TAPADA], sig: 'l11' },
    l11: { tipo: 'narra', texto: 'Las clases pasaron como pasan los lunes: lentas, y sin señal en el salón del fondo.', sig: 'l12' },
    l12: { tipo: 'narra', escena: 'calle', actores: [['yare', .42, { voltea: true }]], texto: 'En El Encinal no hay internet para subir treinta fotos. Hay que hacerlo en Tepetlán, en el Ciber El Cometa: doce pesos la hora, dos computadoras que sirven y una que «tiene virus».', sig: 'l13' },
    l13: { tipo: 'narra', texto: 'La última combi a El Encinal sale de la esquina de Abarrotes La Güera a las seis en punto. Si la pierdes, o te quedas en Tepetlán, o alguien tiene que ir por ti.', sig: 'l14' },
    l14: { tipo: 'dice', quien: 'rocio', escena: 'ciber', actores: [['yare', .2, { voltea: true }], ['rocio', 0, { abs: 1090, voltea: true }]], texto: '¿Te pongo en la 4, mija? La 3 anda rara. Son doce la hora; si imprimes es aparte.', sig: 'l15' },
    l15: { tipo: 'dice', quien: 'rocio', texto: 'Ah, y si ves algo abierto de alguien, no le muevas. Aquí entra medio Tepetlán y luego me vienen a reclamar a mí.', sig: 'l16' },
    l16: { tipo: 'ciber', sig: 'l17' },
    l17: { tipo: 'salto', sig: s => s.m.combi ? 'l18a' : 'l18b' },
    l18a: { tipo: 'narra', escena: 'combi:atardecer', actores: [], texto: s => s.m.salida === 'cerro'
      ? 'Llegué a la esquina con el corazón en la garganta. El chofer ya tenía el motor prendido; me esperó porque conoce a la abuela. Me senté atrás, sudada, con la sensación rara de haber hecho todo bien y aun así ir tarde.'
      : 'Alcancé la combi corriendo, con la mochila abierta. Me senté atrás. A medio cerro, cuando se fue la señal, me acordé: no cerré sesión.', sig: s => s.m.salida === 'corrio' ? 'l18c' : 'l19' },
    l18c: { tipo: 'narra', texto: s => s.m.ramiro === 'cerrada'
      ? 'Me dije que nadie se mete a un Facebook ajeno. Luego me acordé de Ramiro, y de que yo sí había cerrado la suya.'
      : 'Me dije que nadie se mete a un Facebook ajeno. Luego me acordé de Ramiro.', sig: 'l19' },
    l18b: { tipo: 'narra', escena: 'calle', actores: [['yare', .5]], texto: s => `Llegué a la esquina a las ${hhmm(s.m.llegada)}. Vi las luces de la combi doblar en la curva del panteón.`, sig: 'l18d' },
    l18d: { tipo: 'tel', chat: 'Mamá', sub: 'en línea', avatar: 'M', hora: s => hhmm(s.m.llegada + 1), mensajes: [
      { de: 'Mamá', texto: '¿Dónde estás? Ya pasó la combi y no venías' }
    ], opciones: [
      { t: 'Me quedé en el ciber. Perdón, ma.', fx: s => { s.rel.mama--; }, respuesta: [{ de: 'Mamá', texto: 'Voy por ti en la moto de don Beto. No te muevas de La Güera.' }] },
      { t: 'Me quedé haciendo tarea con Iker, ahorita veo cómo me voy.', fx: s => { s.m.mintio = true; s.rel.mama -= 2; }, hilo: 'Mamá sabe dónde vive Iker.', respuesta: [{ de: 'Mamá', texto: 'Iker vive del otro lado de Tepetlán. Voy por ti a La Güera.' }] }
    ], sig: 'l18e' },
    l18e: { tipo: 'narra', texto: s => `Mamá llegó en la moto del vecino. No habló en todo el camino. Eso fue peor que cualquier regaño.${s.m.salida === 'cerro' ? ' Hice lo correcto y aun así me sentí regañada.' : ''}`, sig: 'l19' },
    l19: { tipo: 'narra', escena: 'encinal', actores: [['yare', .28]], texto: 'En la noche, junto al lavadero, abrí la libreta. La abuela dice que lo que no se escribe se desbarata.', sig: 'l20' },
    l20: { tipo: 'diario', fecha: 'Lunes', parrafos: s => [
      ({ publica: `Llevamos ${s.pedidos} pedidos. Lupita dice que es gracias a poner la cuenta en la publicación. Puede ser. Doña Tere todavía pregunta quién más ve ese número.`,
        mensaje: `Llevamos ${s.pedidos} pedidos. Contesto uno por uno con la misma frase. Ya me la sé de memoria, como el Padre Nuestro.`,
        feria: `Llevamos ${s.pedidos} pedidos apartados. Pocos. Lupita no me lo dijo, pero lo pensó muy fuerte.` })[s.m.cobro || 'mensaje'],
      ({ defendida: 'Hoy le dije que no a Iker. Me miró como si lo hubiera traicionado a él. Mari nunca se va a enterar de que alguien la defendió, y está bien. Creo.',
        tapada: 'La foto de Mari salió con un gatito en la cara. En los comentarios ya decían de qué comunidad es. Le dije a Iker que la tapara como si eso fuera hacer algo.',
        publicada: 'No dije nada. Iker la subió. Mari se sentó junto a la ventana, como siempre. Todavía no sé si eso fue no hacer nada o hacer algo.' })[s.m.mari || 'publicada'],
      s.m.ramiro === 'cerrada' ? 'En el ciber había una sesión abierta de un tal Ramiro Díaz. La cerré. No sé quién es.' : 'En el ciber había una sesión abierta de un tal Ramiro Díaz. No era mi problema. ¿O sí?',
      ({ enviada: 'Mandé los CURP de las diez para el registro de la feria. Ojalá alcancemos lugar.', persona: 'Mañana vamos a la oficina del municipio con las credenciales. Doña Tere va a protestar por la caminata. El señor ya no me contestó.', sin: 'No alcancé a contestar lo del registro de la feria. Mañana sin falta.' })[s.m.curp || 'sin'],
      ({ enviada: 'A una señora de Tlaxcala le mandé la INE de la abuela para que confiara. Confió.', video: 'Grabé el mantel con un papelito que decía «Para Fernanda». Me sentí ridícula. Pidió dos.', feria: 'Una señora quería una INE para confiar. Le dije que pagara en la feria. No va a venir.', sin: '' })[s.m.ine || 'sin'],
      s.m.salida === 'corrio' ? 'Salí corriendo del ciber. La computadora 4 sigue esperando a que alguien la use.' : (s.m.guardoPass === 'guardar' ? 'Cerré sesión y borré el historial. ¿Le di «Guardar contraseña» al principio? Creo que sí.' : 'Cerré sesión y borré todo. Me costó la prisa, pero quedó limpio.'),
      ({ debil: 'La contraseña de la página es fácil. Para todas. Para cualquiera.', media: 'La contraseña de la página no es mala. Tampoco es buena.', fuerte: 'La contraseña de la página es buena.' })[s.m.clave || 'debil'] + ' ' + ({ cuaderno: 'Está escrita atrás del cuaderno azul, junto a los fiados.', whatsapp: 'Está en el WhatsApp de Lupita.', cuentas: 'Y nadie más la sabe: cada quien entra con su cuenta. Me costó una desvelada.' })[s.m.reparto || 'cuaderno'],
      'Faltan cinco días para la feria.'
    ], sig: 'l21' },
    l21: { tipo: 'tejido', titulo: 'El tejido de tu domingo y tu lunes', proximo: 'Martes · Señales', sueltos: s => [
      s.m.reparto === 'cuaderno' && 'El cuaderno azul guarda una contraseña junto a los fiados. Mañana alguien irá a tu casa a dejar un pedido.',
      s.m.reparto === 'whatsapp' && 'La contraseña sigue en el chat de Lupita. Lupita le presta el celular a su novio.',
      s.m.cobro === 'publica' && 'El número de cuenta de la abuela está en una publicación que cualquiera puede copiar.',
      s.m.mari !== 'defendida' && 'La foto de Mari ya circula. Iker no sabe quién se la mandó.',
      s.m.mari === 'defendida' && 'La foto de Mari sigue en la bandeja de Iker.',
      s.m.ramiro !== 'cerrada' ? 'La sesión de Ramiro sigue abierta en la computadora 4.' : 'Ramiro no sabe que alguien cerró su sesión.',
      s.m.salida === 'corrio' && 'Tu sesión también sigue abierta en la computadora 4.',
      s.m.salida === 'cerro' && s.m.guardoPass === 'guardar' && 'Borraste el historial, pero el navegador del ciber recuerda tu contraseña.',
      s.m.curp === 'enviada' && 'Diez CURP viajaron a una cuenta que estuvo abierta todo el día en un ciber.',
      s.m.ine === 'enviada' && 'Una foto de la INE de tu abuela vive en el celular de una desconocida.'
    ].filter(Boolean), sig: 'm0' }, // sigue el Capítulo 2
  };

  const tejido = [
    { clave: 'cobro', titulo: 'Domingo · Cómo cobrar', opciones: [['publica', 'Cuenta en el post'], ['mensaje', 'Por mensaje'], ['feria', 'En la feria']] },
    { clave: 'clave', titulo: 'Domingo · La contraseña', opciones: [['debil', 'Fácil'], ['media', 'Regular'], ['fuerte', 'Difícil']] },
    { clave: 'reparto', titulo: 'Domingo · ¿Dónde quedó?', opciones: [['cuaderno', 'En el cuaderno'], ['whatsapp', 'Por WhatsApp'], ['cuentas', 'Cuentas propias']] },
    { clave: 'mari', titulo: 'Lunes · La foto de Mari', opciones: [['defendida', 'Dijiste que no'], ['tapada', 'Cara tapada'], ['publicada', 'Silencio']] },
    { clave: 'ramiro', titulo: 'Lunes · La sesión de Ramiro', opciones: [['cerrada', 'La cerraste'], ['abierta', 'Siguió abierta']] },
    { clave: 'guardar', titulo: 'Lunes · ¿Guardar contraseña?', opciones: [['guardar', 'Guardar'], ['nunca', 'Nunca']] },
    { clave: 'ine', titulo: 'Lunes · La INE', opciones: [['enviada', 'La mandaste'], ['video', 'Video'], ['feria', 'Pago en feria'], ['sin', 'Sin responder']] },
    { clave: 'curp', titulo: 'Lunes · Los CURP', opciones: [['enviada', 'Los mandaste'], ['persona', 'En persona'], ['sin', 'Sin responder']] },
    { clave: 'salida', titulo: 'Lunes · Al salir del ciber', opciones: [['cerro', 'Cerraste todo'], ['corrio', 'Saliste corriendo']] },
    { clave: 'combi', titulo: 'Lunes · La última combi', opciones: [['si', 'La alcanzaste'], ['no', 'La perdiste']] }
  ];

  return { inicio: 'p0', nodos, tejido };
})();
