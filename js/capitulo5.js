/* Hilo Rojo · Capítulo 5: Sábado («La feria») y los cinco finales.
   Se camina por la feria: cada persona que aparece trae lo que pasó con ella en la semana.
   Al final se calcula el desenlace con los dos hilos: la página (seguridad) y Mari (acoso). */
const CAPITULO5 = (() => {
  const { COLOR_GENTE } = CAPITULO2.util;
  const paginaOk = (s) => !s.m.paginaPerdida || !!s.m.recupero;
  const pruebasAlgunas = (s) => !!(s.m.mariCapturas || s.m.capCom || s.m.capGemela || s.m.evidencia || s.m.capFalsa || s.m.evidenciaYare);
  /* El final secreto: juntar todo (Mari, Ramiro, Orientación) y llevarlo a la Policía Cibernética. */
  const telarPosible = (s) => (s.m.ramiro === 'cerrada' || s.m.confeso) && pruebasAlgunas(s) && (s.rel.mari || 0) >= 2 && (s.m.mari3 === 'orientacion' || s.m.lucia4 === 'ayuda');
  const tienePuesto = (s) => s.m.puesto !== 'perdido' || s.m.rescate;

  const FINALES = {
    telar: { titulo: 'Telar', texto: 'El lunes, Mari, la maestra Lucía, Ramiro y yo nos sentamos frente a una computadora de la Policía Cibernética con todo: la cuenta 4471, los CURP, la página gemela, mari.ventura.real, los comentarios con mi dirección. Tardaron semanas. Cayó una red que estafaba a cooperativas de tres municipios. Nadie nos dio una medalla. La abuela bordó un mantel con cuatro nombres.' },
    hilo: { titulo: 'Hilo Rojo', texto: 'La página sigue. Ahora cada bordadora entra con su propia cuenta y la contraseña no vive en ningún cuaderno. En diciembre di un taller en el salón de la cooperativa: doce señoras y sus celulares. En la prepa, Mari y yo dimos otro. Ella habló primero.' },
    puntada: { titulo: 'Puntada suelta', texto: 'Ya no tenemos página. Las bordadoras decidieron volver al cuaderno y a la feria; vendemos menos. Mari y yo nos sentamos juntas en la jardinera del fondo. A veces no hablamos. No hace falta.' },
    nudo: { titulo: 'Nudo', texto: s => `Las cuentas de la prepa se cerraron: confesiones, memes, la cuenta falsa. Lo que conté sirvió. Iker se cambió de lugar en el salón y no me ha vuelto a hablar. Hice lo correcto. No sabía que lo correcto también se extraña. ${paginaOk(s) ? 'La página sigue, con verificación en dos pasos.' : 'La página ya no es nuestra.'}` },
    bajo: { titulo: 'Bajo otro nombre', texto: s => `La página gemela sigue activa, con otro nombre. La cuenta falsa de Mari también. Mari se cambió a una prepa de Huamantla en noviembre. Yo cerré mis redes. ${paginaOk(s) ? 'A veces abro la de la cooperativa, nomás para ver si alguien más está usando nuestras fotos.' : 'A veces busco «Hilo Rojo» y veo nuestras fotos al revés, vendiendo cosas que no existen.'}` }
  };
  /* ---------- Cinemáticas de los finales (mudas: solo música) ----------
     actores: [id, x, opciones]; pasos: [segundo, actor, acción, valor, duración]. Ver cine.js. */
  const G = '#5A4466'; // gente de fondo
  const CINE = {
    telar: { musica: 'telar', tomas: [
      { escena: 'orientacion', dura: 9, rotulo: 'Lunes · Policía Cibernética, Tlaxcala', camara: [[1.05, 0, 10], [1.12, -20, 20]],
        actores: [['yare', 230, {}], ['mari', 360, { cel: true }], ['gente', 820, { color: G, voltea: true }], ['ramiro', 1250, { voltea: true }], ['lucia', 1390, { voltea: true }]],
        pasos: [[.5, 2, 'habla', 0, 2.4], [3, 0, 'gesto', 'senala', 2.4], [3, 0, 'habla', 0, 2.6], [4.2, 1, 'exp', 'preocupa'], [5.8, 3, 'gesto', 'asiente', 1.8], [6.5, 2, 'exp', 'sorpresa'], [7, 4, 'exp', 'feliz'], [7.4, 1, 'exp', 'feliz']] },
      { escena: 'prepa', dura: 8, rotulo: 'Tres semanas después', camara: [[1.1, 40, 10], [1.02, 0, 0]],
        actores: [['yare', 600, {}], ['mari', 740, { voltea: true, cel: true }], ['gente', 1260, { color: G }], ['gente', 1380, { color: G, voltea: true }]],
        pasos: [[.6, 1, 'habla', 0, 1.6], [2.2, 0, 'exp', 'sorpresa'], [2.2, 1, 'exp', 'sorpresa'], [3.4, 0, 'exp', 'risa'], [3.4, 0, 'gesto', 'risa', 2.6], [3.6, 1, 'exp', 'risa'], [3.6, 1, 'gesto', 'risa', 2.4], [6.2, 1, 'cel', false], [6.4, 0, 'gesto', 'abrazo', 1.6]] },
      { escena: 'feria', dura: 9, rotulo: 'Diciembre', camara: [[1, 0, 0], [1.08, 0, 14]],
        actores: [['abuela', 800, {}], ['yare', 560, {}], ['mari', 440, {}], ['ramiro', 1060, { voltea: true }], ['lucia', 1180, { voltea: true }], ['lupita', 1300, { voltea: true }]],
        pasos: [[1, 0, 'habla', 0, 2.4], [1, 0, 'gesto', 'abrazo', 3], [2.4, 1, 'exp', 'sorpresa'], [3.4, 1, 'exp', 'feliz'], [3.6, 2, 'exp', 'feliz'], [4, 3, 'gesto', 'aplaude', 2.5], [4.2, 4, 'gesto', 'aplaude', 2.5], [4.2, 5, 'gesto', 'aplaude', 2.5], [4, 5, 'exp', 'risa'], [5.6, 1, 'gesto', 'risa', 2]] },
      { escena: 'encinal', dura: 8, camara: [[1.06, 0, 0], [1, 0, 0]],
        actores: [['yare', 300, {}], ['mari', 180, {}]],
        pasos: [[.5, 0, 'camina', 1050, 7], [.6, 1, 'camina', 930, 7], [3, 0, 'habla', 0, 2], [4, 1, 'exp', 'risa'], [4, 1, 'gesto', 'risa', 1.5], [5.6, 0, 'exp', 'feliz']] }
    ] },
    hilo: { musica: 'hilo', tomas: [
      { escena: 'cocina', dura: 9, rotulo: 'Diciembre · salón de la cooperativa', camara: [[1.04, 0, 0], [1.1, -30, 10]],
        actores: [['yare', 1180, { voltea: true }], ['abuela', 420, { cel: true }], ['gente', 560, { color: G, cel: true }], ['gente', 700, { color: G, cel: true }], ['gente', 840, { color: G }]],
        pasos: [[.4, 0, 'habla', 0, 2.6], [.6, 0, 'gesto', 'senala', 2.4], [2.6, 1, 'exp', 'preocupa'], [3.2, 4, 'exp', 'sorpresa'], [4, 0, 'gesto', 'hombros', 1.6], [4.6, 0, 'exp', 'risa'], [5, 1, 'exp', 'risa'], [5, 1, 'gesto', 'risa', 2.2], [5.2, 2, 'gesto', 'risa', 2], [5.4, 3, 'exp', 'feliz'], [6.8, 1, 'gesto', 'asiente', 1.6]] },
      { escena: 'prepa', dura: 8, rotulo: 'En la prepa', camara: [[1.08, 0, 10], [1, 0, 0]],
        actores: [['mari', 700, {}], ['yare', 840, { voltea: true }], ['gente', 260, { color: G }], ['gente', 380, { color: G }], ['gente', 1240, { color: G, voltea: true }], ['gente', 1370, { color: G, voltea: true }]],
        pasos: [[.6, 0, 'habla', 0, 3.4], [.8, 0, 'exp', 'preocupa'], [2.4, 1, 'gesto', 'asiente', 1.6], [3.6, 0, 'exp', 'feliz'], [4.4, 2, 'gesto', 'aplaude', 2.6], [4.5, 3, 'gesto', 'aplaude', 2.6], [4.6, 4, 'gesto', 'aplaude', 2.6], [4.4, 5, 'gesto', 'aplaude', 2.6], [5, 1, 'exp', 'feliz'], [5.4, 0, 'exp', 'risa']] },
      { escena: 'encinal', dura: 8, camara: [[1, 0, 0], [1.1, -10, 20]],
        actores: [['yare', 520, {}], ['tono', 700, { voltea: true, cel: true }]],
        pasos: [[.5, 1, 'habla', 0, 2], [.6, 1, 'exp', 'feliz'], [2.6, 0, 'exp', 'sorpresa'], [3.6, 0, 'gesto', 'saluda', 1.4], [3.6, 0, 'exp', 'risa'], [4, 1, 'gesto', 'risa', 2.4], [4, 1, 'exp', 'risa'], [5.6, 0, 'gesto', 'abrazo', 1.8]] }
    ] },
    puntada: { musica: 'puntada', tomas: [
      { escena: 'cocina', dura: 8, rotulo: 'Una semana después', camara: [[1.06, 0, 0], [1.12, 20, 10]],
        actores: [['abuela', 640, {}], ['lupita', 860, { voltea: true }], ['yare', 1040, { voltea: true }]],
        pasos: [[.6, 1, 'gesto', 'hombros', 2], [.6, 1, 'exp', 'triste'], [2.4, 1, 'gesto', 'suspira', 2.2], [3.4, 2, 'exp', 'triste'], [4.8, 0, 'habla', 0, 1.8], [5, 0, 'exp', 'feliz'], [6, 2, 'exp', 'feliz'], [6.2, 1, 'exp', 'neutral']] },
      { escena: 'jardinera', dura: 9, rotulo: 'La jardinera del fondo', camara: [[1.12, 0, 20], [1.18, 0, 26]],
        actores: [['mari', 740, {}], ['yare', 880, { voltea: true }]],
        pasos: [[2, 1, 'exp', 'triste'], [3.6, 0, 'voltea'], [3.6, 0, 'voltea'], [4.2, 0, 'exp', 'feliz'], [4.6, 0, 'gesto', 'abrazo', 1.2], [5.6, 1, 'exp', 'feliz'], [6.8, 1, 'gesto', 'asiente', 1.4]] },
      { escena: 'feria', dura: 8, rotulo: 'La feria del próximo año', camara: [[1, 0, 0], [1.06, 0, 10]],
        actores: [['abuela', 760, {}], ['gente', 960, { color: G, voltea: true }], ['yare', 560, {}], ['lupita', 440, {}]],
        pasos: [[.6, 1, 'habla', 0, 1.6], [2.2, 0, 'habla', 0, 1.6], [2.4, 0, 'exp', 'feliz'], [3.8, 1, 'exp', 'feliz'], [4.2, 2, 'gesto', 'aplaude', 1.6], [4.4, 3, 'gesto', 'aplaude', 1.6], [4.6, 2, 'exp', 'risa']] }
    ] },
    nudo: { musica: 'nudo', tomas: [
      { escena: 'prepa', dura: 8, rotulo: 'Lunes', camara: [[1.06, 0, 0], [1.02, 0, 0]],
        actores: [['yare', 700, {}], ['iker', 1380, { voltea: true }]],
        pasos: [[.4, 1, 'camina', 160, 6.4], [2.2, 0, 'gesto', 'saluda', 1.2], [2.2, 0, 'exp', 'feliz'], [3.6, 0, 'exp', 'triste'], [4.4, 0, 'gesto', 'cabizbajo', 3]] },
      { escena: 'prepa', dura: 9, rotulo: 'Recreo', camara: [[1, 0, 0], [1.08, 40, 10]],
        actores: [['yare', 360, {}], ['iker', 1120, { voltea: true }], ['gente', 1250, { color: G, voltea: true }], ['gente', 1000, { color: G }], ['mari', 1500, { voltea: true }]],
        pasos: [[.5, 1, 'gesto', 'risa', 2.4], [.5, 1, 'exp', 'risa'], [.7, 2, 'gesto', 'risa', 2], [.4, 0, 'exp', 'triste'], [3, 4, 'camina', 500, 3.6], [5, 0, 'gesto', 'suspira', 2], [6.8, 4, 'exp', 'feliz'], [7.2, 0, 'exp', 'neutral']] },
      { escena: 'orientacion', dura: 6, camara: [[1.08, 0, 0], [1.12, 0, 6]],
        actores: [['yare', 300, {}], ['lucia', 820, { voltea: true }]],
        pasos: [[.6, 1, 'habla', 0, 2], [2.8, 1, 'gesto', 'asiente', 1.6], [3.4, 0, 'exp', 'feliz']] },
      { escena: 'encinal', dura: 8, camara: [[1.1, 0, 10], [1.16, 0, 16]],
        actores: [['yare', 600, { cel: true }]],
        pasos: [[.5, 0, 'exp', 'triste'], [3.8, 0, 'cel', false], [4, 0, 'gesto', 'suspira', 2.2], [6, 0, 'exp', 'cerrados']] }
    ] },
    bajo: { musica: 'bajo', tomas: [
      { escena: 'prepa', dura: 8, rotulo: 'Noviembre', camara: [[1.04, 0, 0], [1.1, -20, 8]],
        actores: [['yare', 640, {}], ['gente', 1200, { color: G, voltea: true }], ['gente', 1320, { color: G, voltea: true }]],
        pasos: [[.6, 0, 'exp', 'triste'], [1.2, 1, 'gesto', 'risa', 2], [1.4, 2, 'habla', 0, 2], [4, 0, 'gesto', 'cabizbajo', 3.4]] },
      { escena: 'calle', dura: 9, camara: [[1, 0, 0], [1.06, 20, 6]],
        actores: [['yare', 300, {}], ['mari', 760, {}], ['gente', 900, { color: G }]],
        pasos: [[.5, 2, 'camina', 1500, 5.5], [1, 1, 'camina', 1180, 3.4], [4.6, 1, 'voltea'], [4.8, 1, 'exp', 'triste'], [5, 0, 'gesto', 'saluda', 1.4], [6.6, 1, 'voltea'], [6.8, 1, 'camina', 1600, 2.4], [7, 0, 'exp', 'triste']] },
      { escena: 'encinal', dura: 9, camara: [[1.1, 0, 10], [1.18, 0, 20]],
        actores: [['yare', 600, { cel: true }]],
        pasos: [[.6, 0, 'exp', 'preocupa'], [2.6, 0, 'gesto', 'niega', 1.6], [4.4, 0, 'cel', false], [4.6, 0, 'exp', 'cerrados'], [5.4, 0, 'gesto', 'cabizbajo', 3.4]] }
    ] }
  };

  const calcularFinal = (s) => {
    const mariSostiene = (s.rel.mari || 0) >= 2 || s.m.mari5 === 'juntas';
    const perdioIker = (s.rel.iker || 0) <= -1 && (s.m.ikerExpuesto || s.m.iker4 === 'no' || s.m.iker3b === 'verdad');
    if (s.m.telar && s.m.mari5 === 'juntas') return 'telar';
    if (!mariSostiene) return 'bajo';
    if (perdioIker && (s.m.mauSuspendido || s.m.ikerExpuesto)) return 'nudo';
    return paginaOk(s) ? 'hilo' : 'puntada';
  };

  const nodos = {
    s0: { tipo: 'titulo', sup: 'Capítulo 5', titulo: 'Sábado', sub: 'La feria', sig: 's1' },
    s1: { tipo: 'narra', escena: 'cocina', actores: [['yare', .25], ['abuela', .5, { voltea: true }], ['lupita', .75, { voltea: true }]],
      alEntrar: s => { if (s.m.recuperando && s.m.paginaPerdida && !s.m.recupero && !s.m._s1) { s.m._s1 = true; s.m.recupero = true; s.m.recuperoSabado = true; } },
      texto: s => (s.m.recuperoSabado ? 'A las seis llegó el correo: «Recuperaste el acceso a Hilo Rojo». Cambié la contraseña antes de lavarme la cara. ' : '')
        + ({ seguro: 'Cargamos tres cajas en la camioneta de don Beto. La abuela llevaba el mantel de flores rojas doblado en el regazo, como si fuera un bebé.',
          condicional: 'Cargamos tres cajas y un letrero que pintamos en la noche con Lupita: «Solo cobramos aquí, en el puesto. Nuestra cuenta termina en 0932. Si te pidieron depósito a otra, no fuimos nosotras». La abuela llevaba su INE en el monedero, por si acaso.',
          perdido: 'No teníamos puesto. Fuimos de todos modos, con dos cajas y una manta para tender en el suelo, junto a la entrada. La abuela dijo que así empezó, hace cuarenta años.' })[s.m.puesto || 'condicional'], sig: 's2' },
    s2: { tipo: 'narra', escena: 'feria', actores: [['yare', .3, { voltea: true }]], texto: 'La plaza de Tepetlán olía a elote, a pólvora de la noche anterior y a tela nueva. Había más gente que nunca. Y una parte de esa gente, lo sabía, había leído los comentarios.', sig: 's3' },

    /* ----- La feria se recorre caminando ----- */
    s3: { tipo: 'caminar', mundo: 'feria', acompana: s => (s.rel.tono || 0) >= 1 ? ['tono', {}] : null,
      intro: 'La Feria del Bordado. Nuestro puesto está al fondo, pasando la fuente.',
      puntos: s => [
        { x: 640, figuras: [['abuela', -40, { color: COLOR_GENTE }], ['rocio', 60, { color: COLOR_GENTE, voltea: true }]],
          ambiente: ['¡Elotes, esquites!', '¿Esas no son las de la página que estafaba?', 'Dicen que a ellas también les robaron', '¡Lleve sus manteles, güera!'] },
        s.m.visita && { x: 1280, figuras: [['lupita', -40, { color: COLOR_GENTE }], ['rocio', 40, { color: COLOR_GENTE, voltea: true }]],
          ambiente: ({ explica: ['Ellas son las de los bordados', 'A ellas también les robaron la cara'], paga: ['Rosy, ¿ya te dieron tu mantel?', 'Ahorita voy por él'], sinpruebas: ['Ahí va la de los bordados', 'Eso dicen todos'], adentro: ['Ahí va la de los bordados', 'Ni salió a dar la cara'] })[s.m.visita],
          interaccion: { etiqueta: 'Saludar a Rosy', texto: 'Rosy está con dos amigas, frente al puesto de barro.', opciones: [
            s.m.visita === 'explica' && { t: '«¿Vienen al puesto? La abuela les guardó algo.»', tej: ['rosy5', 'compra'], fx: s => { s.m.rosy5 = 'compra'; s.m.ventasExtra = (s.m.ventasExtra || 0) + 3; }, hilo: 'Rosy recordará esto.', tras: [[0, 'sale', 1], [1, 'sale', 1]],
              dice: [['rosy', 'Ya íbamos para allá. Y traigo a mi comadre, que también le vieron la cara.']] },
            s.m.visita === 'paga' && { t: '«Tu mantel ya está listo. Pásate al puesto.»', tej: ['rosy5', 'compra'], fx: s => { s.m.rosy5 = 'compra'; }, tras: [[0, 'sale', 1], [1, 'sale', 1]], dice: [['rosy', '¿Neta lo bordaron? …Gracias. De verdad.']] },
            (s.m.visita === 'sinpruebas' || s.m.visita === 'adentro') && pruebasAlgunas(s) && { t: 'Enseñarle las capturas que ahora sí tienes.', tej: ['rosy5', 'explica'], fx: s => { s.m.rosy5 = 'explica'; }, hilo: 'Rosy recordará esto.',
              dice: [['rosy', '…Ah, caray. O sea que la de la cuenta 4471 ni las conoce.'], [null, 'No me pidió perdón. Pero les dijo a sus amigas que nosotras no fuimos.']] },
            { t: 'Seguir caminando.', tej: ['rosy5', 'nada'], fx: s => { s.m.rosy5 = 'nada'; } }
          ].filter(Boolean) } },
        { x: 1580, mira: 'Un puesto de lotería. «¡El valiente!», canta el señor. Nadie levanta la mano.', etiqueta: 'Mirar la lotería', alto: 135, objeto: 'loteria' },
        { x: 1940, figuras: [['abuela', -70, { color: COLOR_GENTE }], ['mari', 40, { voltea: true }]],
          ambiente: s => (s.rel.mari || 0) >= 2 ? ['Yare. Por acá.'] : ['Lleve sus servilleteros de Las Ánimas'], claro: true,
          interaccion: { etiqueta: 'Ir al puesto de Las Ánimas', texto: s => (s.rel.mari || 0) >= 2 ? 'Mari está atrás del mostrador, con su tía. Te ve llegar antes de que llegues.' : (s.rel.mari || 0) >= 0 ? 'Mari acomoda servilleteros sin mirar a nadie.' : 'Mari te ve y voltea hacia otro lado.',
            opciones: s => [
              (s.rel.mari || 0) >= 2 && { t: '«Quiero hacer algo con todo esto. Contigo.»', tej: ['mari5', 'juntas'], fx: s => { s.m.mari5 = 'juntas'; }, hilo: 'Mari recordará esto.',
                dice: [['mari', '¿Algo como qué?'], ['yare', 'Como que no le vuelva a pasar a nadie. O que por lo menos sepan qué hacer.'], ['mari', '…Va. Pero tú hablas primero. Otra vez.']] },
              (s.rel.mari || 0) >= 0 && { t: 'Comprarle un servilletero a su tía.', tej: ['mari5', 'amable'], fx: s => { s.m.mari5 = 'amable'; s.rel.mari++; },
                dice: [['mari', 'Ese es de los que bordé yo.'], [null, 'Lo pagué en efectivo. Mari sonrió con la mitad de la boca.']] },
              (s.rel.mari || 0) < 2 && { t: '«Perdón, Mari. Por toda la semana.»', tej: ['mari5', 'disculpa'], fx: s => { s.m.mari5 = 'disculpa'; s.rel.mari++; }, hilo: 'Mari recordará esto.',
                dice: s => (s.rel.mari || 0) >= 1 ? [['mari', 'Ya. Ya sé.'], [null, 'No dijo nada más. Pero me pasó un esquite que tenía en el mostrador.']] : [['mari', 'Hoy no, Yare.']] },
              { t: 'Pasar de largo.', tej: ['mari5', 'lejos'], fx: s => { s.m.mari5 = 'lejos'; } }
            ].filter(Boolean) } },
        s.m.mauSuspendido
          ? { x: 2640, figuras: [['iker', -40, { color: COLOR_GENTE }], ['lupita', 40, { color: COLOR_GENTE, voltea: true }]], ambiente: ['Dicen que a Mau lo suspendieron', 'Ya ni hay stickers, qué aburrido', 'Ay, ya, mejor'] }
          : { x: 2640, figuras: [['mau', 0, { voltea: true, cel: true }],['iker', 90, { color: COLOR_GENTE, voltea: true }]],
            ambiente: ['Ahí va la estafadora', 'Sonríe pa la historia', 'Sale en vivo, saluden'], claro: true,
            interaccion: { etiqueta: 'Mau está grabando', texto: 'Mau te graba desde el puesto de los juegos. Está transmitiendo en vivo.', opciones: [
              { t: 'Pasar sin voltear.', tej: ['mau5', 'pasa'], fx: s => { s.m.mau5 = 'pasa'; }, dice: [[null, 'Doce segundos de mi nuca en su transmisión. Nadie comentó nada.']] },
              { t: 'Grabarlo tú a él: su cara, su celular, la hora.', tej: ['mau5', 'graba'], fx: s => { s.m.mau5 = 'graba'; s.m.evidenciaYare = true; }, hilo: 'Tu video tiene fecha y hora.', tras: [['mau', 'baja']], dice: [['mau', '¿Qué haces?'], ['yare', 'Lo mismo que tú. Nomás que yo sí se lo voy a enseñar a alguien.'], [null, 'Bajó el celular.']] },
              { t: '«Ya supérenlo.»', tej: ['mau5', 'contesta'], fx: s => { s.m.mau5 = 'contesta'; }, dice: [['mau', '¡Uy! Ya salió en el live, saluden a la abogada.']] }
            ] } },
        { x: 3300, figuras: [['iker', 0, { voltea: true }]],
          ambiente: s => (s.rel.iker || 0) <= -1 ? ['…'] : ['¡Yare! Te traje algo'], claro: true,
          interaccion: { etiqueta: 'Hablar con Iker', texto: s => (s.rel.iker || 0) <= -1 ? 'Iker está solo, recargado en el puesto de dulces. Te ve y no se mueve.' : 'Iker trae dos esquites. Uno es para ti.',
            opciones: s => (s.rel.iker || 0) <= -1 ? [
              { t: '«Lo que hice no fue contra ti.»', tej: ['iker5', 'intenta'], fx: s => { s.m.iker5 = 'intenta'; }, tras: [['iker', 'sale', -1]], dice: [['iker', 'Ya sé. Eso es lo peor.'], [null, 'Se fue caminando hacia la salida. No me siguió nadie, ni yo.']] },
              { t: 'Dejarlo en paz.', tej: ['iker5', 'deja'], fx: s => { s.m.iker5 = 'deja'; } }
            ] : [
              { t: '«Gracias. ¿Ya cerraste confesiones de verdad?»', tej: ['iker5', 'pregunta'], fx: s => { s.m.iker5 = 'pregunta'; }, dice: [['iker', 'De verdad. Ya ni la contraseña me sé. La cambié por una que no me acuerdo, a propósito.'], ['iker', 'No es disculpa, eh. Es esquite.']] },
              { t: 'Aceptar el esquite sin preguntar nada.', tej: ['iker5', 'esquite'], fx: s => { s.m.iker5 = 'esquite'; s.rel.iker++; }, dice: [['iker', 'Con chile, como te gusta.']] }
            ] } },
        { x: 4010, figuras: [['ramiro', 0, { voltea: true }]], ambiente: ['A ver, los de Las Ánimas, ¿ya tienen su gafete?'], claro: true,
          interaccion: { etiqueta: 'Hablar con Ramiro', texto: s => s.m.puesto === 'perdido' ? 'Ramiro está en la mesa del comité, con una lista de puestos llena de tachones.' : 'Ramiro está en la mesa del comité. Te reconoce por la voz.',
            opciones: s => [
              s.m.puesto === 'perdido' && pruebasAlgunas(s) && { t: 'Enseñarle las capturas que juntaste desde el jueves.', tej: ['ramiro5', 'rescate'], fx: s => { s.m.ramiro5 = 'rescate'; s.m.rescate = true; }, hilo: 'Ramiro recordará esto.',
                dice: [['ramiro', '…Esto no me lo mandaste el jueves.'], ['yare', 'No lo tenía. Me lo pasaron.'], ['ramiro', 'Pónganse junto a la fuente. Hay un hueco que dejó un puesto de dulces. Nomás por hoy.']] },
              telarPosible(s) && { t: '«Tengo capturas de la página falsa, de los comentarios y de la cuenta falsa de Mari. Usted tiene lo de los CURP. ¿Lo llevamos juntos a la Policía Cibernética?»', tej: ['ramiro5', 'telar'], fx: s => { s.m.ramiro5 = 'telar'; s.m.telar = true; },
                dice: [['ramiro', 'El lunes a primera hora. Que venga tu amiga, y la orientadora si puede. Yo llevo lo de las cooperativas.'], [null, 'Lo dijo como quien apunta un pedido. Así se hacen las cosas en Tepetlán.']] },
              { t: '«Gracias por lo del jueves.»', tej: ['ramiro5', 'gracias'], fx: s => { s.m.ramiro5 = 'gracias'; }, dice: s => [['ramiro', s.m.puesto === 'perdido' ? 'No me agradezcas nada. Hice lo que me tocaba. Ojalá el próximo año.' : 'Agradécele a tu abuela. Cuarenta años sin una queja; eso pesa.']] }
            ].filter(Boolean) } },
        { x: 4400, mira: 'La fuente de la plaza. Tiene monedas de diez, de cinco y un botón. Alguien pidió algo con un botón.', etiqueta: 'Mirar la fuente', alto: 150, objeto: 'fuente' },
        { x: 4720, radio: 240, figuras: [['abuela', -60, {}], ['lupita', 70, { voltea: true }]], interaccion: { etiqueta: 'Llegar al puesto', fin: true } }
      ].filter(Boolean),
      alSalir: s => { if (s.m.rescate) s.tejido.ramiro5 = 'rescate'; }, sig: 's4' },

    /* ----- En el puesto ----- */
    s4: { tipo: 'narra', escena: 'feria', actores: [['yare', .3], ['abuela', .52, { voltea: true }], ['lupita', .72, { voltea: true }]],
      alEntrar: s => { s.m.ventasFeria = Math.max(2, (tienePuesto(s) ? 14 : 5) - (s.m.enojo || 0) + (s.m.ventasExtra || 0) + (s.m.aclaro ? 2 : 0) + (s.m.gemAviso ? 2 : 0)); },
      texto: s => `${tienePuesto(s) ? (s.m.rescate ? 'Tendimos todo junto a la fuente, en el hueco que nos dio Ramiro.' : 'El puesto quedó como lo soñaba la abuela: el mantel de flores rojas colgado al frente.') : 'Tendimos la manta junto a la entrada. La gente pasaba de largo, o se detenía a ver si éramos «las de la página».'} Al mediodía llevábamos ${s.m.ventasFeria} piezas vendidas, en efectivo o con transferencia a la cuenta de la abuela, frente a nosotras.`,
      sig: s => paginaOk(s) ? 's6' : 's5' },
    s5: { tipo: 'tel', app: 'fb', chat: 'Hilo Rojo · Bordados de El Encinal', sub: 'Publicación nueva', avatar: '🧵', hora: '12:40', mensajes: [
      { de: 'Hilo Rojo · Bordados de El Encinal', texto: '🎉 ¡Hoy estamos en la Feria del Bordado! Aparta con depósito a la cuenta con terminación 4471 y recoge en el puesto sin hacer fila 💌' },
      { de: 'Hilo Rojo · Bordados de El Encinal', texto: '❤️ 86 · 23 comentarios: «¡ya deposité!»' }
    ], opciones: [
      { t: 'Escribir un letrero grande: «Aquí no se aparta con depósito. Esa página ya no es nuestra».', yo: false, tej: ['impostora', 'letrero'], fx: s => { s.m.impostora = 'letrero'; }, hilo: 'La gente que llega al puesto lee el letrero.' },
      { t: 'Pedirle a Ramiro que lo anuncie por el micrófono.', si: tienePuesto, yo: false, tej: ['impostora', 'micro'], fx: s => { s.m.impostora = 'micro'; }, hilo: 'Toda la plaza lo escuchó.' },
      { t: 'Ignorarlo. Ya no es nuestra.', yo: false, tej: ['impostora', 'nada'], fx: s => { s.m.impostora = 'nada'; }, hilo: 'Alguien más va a depositar hoy.' }
    ], sig: 's6' },
    s6: { tipo: 'dice', quien: 'abuela', texto: 'Mija, ¿y la página? ¿Qué hacemos con ella después de esto?', sig: 's6b' },
    s6b: { tipo: 'elige', opciones: [
      { t: 'Seguir con ella, pero bien: cada quien con su cuenta, verificación en dos pasos y la cuenta del banco solo frente a la clienta.', si: paginaOk, tej: ['futuro', 'pagina'], fx: s => { s.m.futuro = 'pagina'; }, dice: [['abuela', 'Eso de los dos pasos me lo vas a tener que explicar con calma.']] },
      { t: 'Que las bordadoras aprendan a usarla. Yo les enseño.', si: paginaOk, tej: ['futuro', 'taller'], fx: s => { s.m.futuro = 'taller'; }, hilo: 'Las bordadoras recordarán esto.', dice: [['abuela', '¿A doña Tere también? Ay, mija. Valiente.']] },
      { t: 'Volver al cuaderno. Sin página.', tej: ['futuro', 'cuaderno'], fx: s => { s.m.futuro = 'cuaderno'; }, dice: [['abuela', 'El cuaderno nunca me ha robado nada. Nomás no le escribas contraseñas atrás.']] }
    ], sig: 's7' },

    /* ----- El castillo: el final ----- */
    s7: { tipo: 'narra', escena: 'encinal', actores: s => [['yare', .32], ...(s.m.mari5 === 'juntas' ? [['mari', .48]] : [])],
      alEntrar: s => { s.m.final = calcularFinal(s); },
      texto: s => s.m.mari5 === 'juntas'
        ? 'En la noche prendieron el castillo. Mari se sentó junto a mí en la banqueta. No dijimos nada mientras giraban las ruedas de fuego. Al final ella dijo: «Mañana empezamos». No pregunté qué.'
        : 'En la noche prendieron el castillo. Lo vi desde la banqueta, con las manos oliendo a pólvora y a tela. Pensé en todo lo que había dejado a la vista esa semana. Y en lo que no.', sig: 's8' },
    s8: { tipo: 'diario', fecha: 'Sábado', parrafos: s => [
      ({ seguro: 'Tuvimos puesto, el de siempre, junto a la fuente.', condicional: 'Tuvimos puesto, con letrero y la INE de la abuela en el monedero.', perdido: s.m.rescate ? 'No teníamos puesto, pero Ramiro vio las capturas y nos dio un hueco junto a la fuente.' : 'No tuvimos puesto. Tendimos una manta junto a la entrada.' })[s.m.puesto || 'condicional'],
      `Vendimos ${s.m.ventasFeria} piezas.${s.m.regalo ? ` Entregamos ${s.m.regalo} que nadie nos pagó.` : ''}`,
      ({ compra: 'Rosy vino al puesto con su comadre.', explica: 'Le enseñé a Rosy las capturas. Les dijo a sus amigas que no fuimos nosotras.' })[s.m.rosy5] || '',
      ({ juntas: 'Le dije a Mari que quiero hacer algo con todo esto. Con ella. Dijo que sí, pero que yo hablo primero.', amable: 'Le compré a Mari un servilletero que bordó ella.', disculpa: 'Le pedí perdón a Mari por toda la semana.', lejos: 'Pasé de largo por el puesto de Las Ánimas.' })[s.m.mari5] || '',
      ({ graba: 'Mau me grabó. Lo grabé yo a él. Bajó el celular.', contesta: 'Mau me grabó en vivo. Le contesté. Salí en su live.', pasa: 'Mau me grabó. Pasé sin voltear.' })[s.m.mau5] || '',
      ({ intenta: 'Le dije a Iker que no fue contra él. «Eso es lo peor.»', deja: 'Vi a Iker solo, en el puesto de dulces. No me acerqué.', pregunta: 'Iker cerró confesiones de verdad. Me trajo un esquite.', esquite: 'Iker me trajo un esquite con chile. No le pregunté nada.' })[s.m.iker5] || '',
      s.m.telar ? 'El lunes vamos a la Policía Cibernética: Mari, la maestra Lucía, Ramiro y yo.' : '',
      ({ letrero: 'La página que ya no es nuestra pidió depósitos durante la feria. Pusimos un letrero.', micro: 'La página que ya no es nuestra pidió depósitos durante la feria. Ramiro lo anunció por el micrófono.', nada: 'La página que ya no es nuestra pidió depósitos durante la feria. No hicimos nada.' })[s.m.impostora] || '',
      ({ pagina: 'La página sigue, pero bien.', taller: 'Les voy a enseñar a las bordadoras a usar la página.', cuaderno: 'Volvemos al cuaderno.' })[s.m.futuro] || '',
      'Hace una semana pensaba que el riesgo era que alguien adivinara una contraseña. Era eso, y era todo lo demás: lo que compartimos, lo que reenviamos, de quién nos reímos, a quién le contamos.'
    ], sig: 's9' },
    s9: { tipo: 'tejido', titulo: 'El tejido de tu sábado', proximo: 'Tu final', filas: () => CAPITULO5.tejido, sueltos: s => [
      s.m.recupero && 'Recuperaste la página.',
      s.m.telar && 'El lunes llevan todo a la Policía Cibernética.',
      s.m.rescate && 'Ramiro les dio un hueco junto a la fuente.',
      s.m.regalo && `La abuela entregó ${s.m.regalo} piezas que nadie les pagó.`
    ].filter(Boolean), sig: 's9c' },
    s9c: { tipo: 'cine', guion: s => CINE[s.m.final], sig: 's10' },
    s10: { tipo: 'fin', sup: s => `Final · ${['telar', 'hilo', 'puntada', 'nudo', 'bajo'].indexOf(s.m.final) + 1} de 5`, titulo: s => FINALES[s.m.final].titulo, texto: s => Motor.val(FINALES[s.m.final].texto) }
  };

  const tejido = [
    { clave: 'rosy5', titulo: 'Sábado · Rosy', opciones: [['compra', 'Vino al puesto'], ['explica', 'Le enseñaste'], ['nada', 'Seguiste']] },
    { clave: 'mari5', titulo: 'Sábado · Mari', opciones: [['juntas', 'Juntas'], ['amable', 'Servilletero'], ['disculpa', 'Perdón'], ['lejos', 'De largo']] },
    { clave: 'mau5', titulo: 'Sábado · Mau en vivo', opciones: [['pasa', 'Pasaste'], ['graba', 'Lo grabaste'], ['contesta', 'Contestaste']] },
    { clave: 'iker5', titulo: 'Sábado · Iker', opciones: [['intenta', '«No fue contra ti»'], ['deja', 'Lo dejaste'], ['pregunta', 'Preguntaste'], ['esquite', 'Esquite']] },
    { clave: 'ramiro5', titulo: 'Sábado · Ramiro', opciones: [['rescate', 'Puesto rescatado'], ['telar', 'Policía Cibernética'], ['gracias', 'Gracias']] },
    { clave: 'impostora', titulo: 'Sábado · La página impostora', opciones: [['letrero', 'Letrero'], ['micro', 'Micrófono'], ['nada', 'Nada']] },
    { clave: 'futuro', titulo: 'Sábado · Lo que sigue', opciones: [['pagina', 'Página, bien'], ['taller', 'Taller'], ['cuaderno', 'Cuaderno']] }
  ];

  return { nodos, tejido, FINALES, calcularFinal };
})();
