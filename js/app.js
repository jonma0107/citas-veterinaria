// @ts-check
// Campos del formulario
const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');
// UI
const formulario = document.querySelector('#nueva-cita');
const contenedorCitas = document.querySelector('#citas');

let editando;

// Registrar eventos
eventListeners();
function eventListeners() {
  mascotaInput.addEventListener('change', datosCita);
  propietarioInput.addEventListener('change', datosCita);
  telefonoInput.addEventListener('change', datosCita);
  fechaInput.addEventListener('change', datosCita);
  horaInput.addEventListener('change', datosCita);
  sintomasInput.addEventListener('change', datosCita);

  formulario.addEventListener('submit', nuevaCita);
};

// **********************************  CLASES  ***********************************

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

/********************************************************************************/

class UI {
  imprimirAlerta(mensaje, tipo) {
    // Crear el Div del alerta
    const divAlerta = document.createElement('div');
    divAlerta.classList.add('alert', 'text-center', 'd-block', 'col-12');
    // Agregar clase en base al tipo
    if (tipo === 'error') {
      divAlerta.classList.add('alert-danger')
    } else {
      divAlerta.classList.add('alert-success')
    };
    // Pasar el mensaje al div de alerta
    divAlerta.textContent = mensaje;
    // Agregar al DOM
    document.querySelector('#contenido').insertBefore(divAlerta, document.querySelector('.agregar-cita'));
    // Temporizador del mensaje
    setTimeout(() => {
      divAlerta.remove();
    }, 3000);
  };

  /********************************************************************************/

  imprimirCitas({ citas }) {

    this.limpiarHTML();

    citas.forEach(cita => {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

      const divCita = document.createElement('div');
      divCita.classList.add('cita', 'p-3');
      divCita.dataset.id = id;

      // Scripting de los elementos de la cita
      const mascotaParrafo = document.createElement('h2');
      mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement('p');
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement('p');
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">telefono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement('p');
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement('p');
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement('p');
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">sintomas: </span> ${sintomas}
      `;

      // Botón para eliminar Cita
      const btnEliminar = document.createElement('button');
      btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
      btnEliminar.innerHTML = 'Eliminar <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

      btnEliminar.onclick = () => {
        eliminarCita(id)
      };

      // Botón para editar Cita
      const btnEditar = document.createElement('button');
      btnEditar.classList.add('btn', 'btn-info');
      btnEditar.innerHTML = 'Editar <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path></svg>';

      btnEditar.onclick = () => editandoCita(cita);

      // Agregar los párrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // Agregar las citas al HTML
      contenedorCitas.appendChild(divCita);
    });

  }; // Fin método imprimirCitas

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    };
  };

}; // Fin clase UI

/*********************************************************************************/

// Instanciamos las Clases
const ui = new UI();
const citas = new Citas();

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
function datosCita(e) {
  citaObj[e.target.name] = e.target.value;
  // console.log(citaObj);
}; // fin función datosCita que se ejecuta después de escuchar el evento 'change'

// Valida y agrega una nueva cita a la clase de Citas
function nuevaCita(e) {
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

function reiniciarObj() {
  citaObj.mascota = '';
  citaObj.propietario = '';
  citaObj.telefono = '';
  citaObj.fecha = '';
  citaObj.hora = '';
  citaObj.sintomas = '';
}

function eliminarCita(id) {
  // Eliminar Citas
  citas.eliminarCita(id);
  // Mostrar Mensaje de Alerta
  ui.imprimirAlerta('La cita se eliminó correctamente');
  // Refrescar
  ui.imprimirCitas(citas);
}

function editandoCita(cita) {
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


