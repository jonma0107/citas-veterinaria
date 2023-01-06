//@ts-check
import Citas from "./class/Citas.js";
import UI from "./class/UI.js";

import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from "./selectors.js";

// Instanciamos las Clases
const ui = new UI();
const citas = new Citas();

let editando;

// Objeto principal, con info de la cita
const citaObj = {
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: ''
};

/**********************************  FUNCIONES  *************************************/

// Función para leer el objeto principal, y agrega datos de la cita al objeto
export function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
  // console.log(citaObj);
}; // fin función datosCita que se ejecuta después de escuchar el evento 'change'

// Valida y agrega una nueva cita a la clase de Citas
export function nuevaCita(e) {
  e.preventDefault();

  // Extraer la info del Objeto de citas
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // Validar
  if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === '') {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
    return;
  };

  // Despues de pasar la anterior validación, se crea una nueva cita

  if (editando) {
    ui.imprimirAlerta('EDITADO correctamente')
    // PASAR EL OBJETO DE LA CITA A EDICIÓN
    citas.editarCita({ ...citaObj })

    // Regresar el estado del botón a su estado original
    formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

    editando = false;
  } else {
    // Generar un id único
    citaObj.id = Date.now();

    // Agregar cita
    citas.agregarCita({ ...citaObj });

    // Mensajes de agregado correctamente
    ui.imprimirAlerta('Se agregó correctamente');
  };

  // reiniciar el Objeto para la validación
  reiniciarObj()

  // Reiniciar formulario
  formulario.reset();

  // MOSTRAR EL HTML DE LAS CITAS
  ui.imprimirCitas(citas);

}; // fin función nuevaCita que se ejecuta después del evento 'submit'

export function reiniciarObj() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

export function eliminarCita(id) {
  // Eliminar Citas
  citas.eliminarCita(id);
  // Mostrar Mensaje de Alerta
  ui.imprimirAlerta('La cita se eliminó correctamente');
  // Refrescar
  ui.imprimirCitas(citas);
}

export function editandoCita(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;
  // Llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // LLenar el objeto!
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // Cambiar el botón verde de crear cita
  formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

  editando = true;

}
