let horariosDB = [];
const generarId = () => 't-' + Math.random().toString(36).substring(2, 6);

class HorarioEntity {
  constructor({ fecha, hora, duracionMinutos }) {
    this.id = generarId();
    this.fecha = fecha;
    this.hora = hora;
    this.duracionMinutos = parseInt(duracionMinutos);
    this.disponible = true;
    this.estudianteId = null;
  }
}

export { horariosDB as HorariosDB, HorarioEntity };