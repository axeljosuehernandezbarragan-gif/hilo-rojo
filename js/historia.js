/* La historia completa: todos los capítulos en un solo mapa de nodos (es lo que arranca Motor.iniciar). */
const HISTORIA = {
  inicio: CAPITULO1.inicio,
  tejido: CAPITULO1.tejido,
  nodos: Object.assign({}, CAPITULO1.nodos, CAPITULO2.nodos, CAPITULO3.nodos, CAPITULO4.nodos, CAPITULO5.nodos)
};
