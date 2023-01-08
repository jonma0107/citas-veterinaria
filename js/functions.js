import Citas from "./class/Citas.js";
import UI from "./class/UI.js";

import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from "./selectors.js";

export let DB;

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
    // PASAR EL OBJETO DE LA CITA A EDICIÓN
    citas.editarCita({ ...citaObj })

    //  ************************* EDITAR REGISTRO EN IndexedDB *************************
    const transaction = DB.transaction(['bd'], 'readwrite');
    const objectStore = transaction.objectStore('bd');
    objectStore.put(citaObj);
    transaction.oncomplete = () => {
      ui.imprimirAlerta('EDITADO correctamente');

      // Regresar el estado del botón a su estado original
      formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

      editando = false;
    }

    //*********************************************************************************/

  } else {
    // Generar un id único
    citaObj.id = Date.now();

    // Agregar cita
    citas.agregarCita({ ...citaObj });

    //  ************************ INSERTAR REGISTRO EN IndexedDB ***********************
    let transaction = DB.transaction(['bd'], 'readwrite');
    // crear el objectStore
    const objectStore = transaction.objectStore('bd');// le decimos que estamos utilizando bd como base de datos
    // vamos a pasarle los datos del objeto de la cita a la base de datos
    objectStore.add(citaObj)

    transaction.oncomplete = function () {
      // Mensajes de agregado correctamente
      ui.imprimirAlerta('Se agregó correctamente');
    }
    //*********************************************************************************/

  };

  // reiniciar el Objeto para la validación
  reiniciarObj()

  // Reiniciar formulario
  formulario.reset();

  // MOSTRAR EL HTML DE LAS CITAS
  ui.imprimirCitas();

}; // fin función nuevaCita que se ejecuta después del evento 'submit'

export function reiniciarObj() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
};

export function eliminarCita(id) {
  // Eliminar Citas
  citas.eliminarCita(id);

  //  ************************ ELIMINAR REGISTRO EN IndexedDB ***********************
  const transaction = DB.transaction(['bd'], 'readwrite');
  const objectStore = transaction.objectStore('bd');
  objectStore.delete(id);

  transaction.oncomplete = () => {
    // Mostrar Mensaje de Alerta
    ui.imprimirAlerta('La cita se eliminó correctamente');
    // Refrescar
    ui.imprimirCitas();
  }
  //*********************************************************************************/

};

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
};

//****************************  BASE DE DATOS (IndexedDB)  ************************/

export function crearBD() {
  let citasDB = window.indexedDB.open('bd', 1);

  citasDB.onerror = function () {
    console.log('La base de datos no se ha creado');
  }

  citasDB.onsuccess = function () {
    console.log('BD creada...');
    DB = citasDB.result;
    // MOSTRAR CITAS AL CARGAR (Pero indexedDB ya está listo)
    ui.imprimirCitas();
  }

  // definir base de datos
  citasDB.onupgradeneeded = (e) => {
    const resultBD = e.target.result;
    // habilitar el objectStore
    const objectStore = resultBD.createObjectStore('bd', {
      keyPath: 'id',
      autoIncrement: true
    });
    // crear columnas
    objectStore.createIndex('mascota', 'mascota', { unique: false });
    objectStore.createIndex('propietario', 'propietario', { unique: false });
    objectStore.createIndex('telefono', 'telefono', { unique: false });
    objectStore.createIndex('fecha', 'fecha', { unique: false });
    objectStore.createIndex('hora', 'hora', { unique: false });
    objectStore.createIndex('sintomas', 'sintomas', { unique: false });
    objectStore.createIndex('id', 'id', { unique: true });

    console.log('columnas creadas y bd lista');
  };
}
