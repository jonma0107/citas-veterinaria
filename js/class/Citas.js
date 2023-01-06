class Citas {
  constructor() {
    this.citas = [];
  }

  agregarCita(cita) {
    this.citas = [...this.citas, cita]; // Spreed operator, hace una copia del Obj
  }

  eliminarCita(id) {
    this.citas = this.citas.filter(cita => cita.id !== id) // este código elimina CITA
  }

  editarCita(citaActualizada) {
    this.citas = this.citas.map(cita => cita.id === citaActualizada.id ? citaActualizada : cita)
  }

}; // Fin clase Citas

export default Citas;
