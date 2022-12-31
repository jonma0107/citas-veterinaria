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
    this.citas = [...this.citas, cita];

    console.log(this.citas);
  }

  eliminarCita(id) {
    this.citas = this.citas.filter(cita => cita.id !== id) // este código se elimina
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
      }

      // Agregar los párrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);

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
  }

  // Despues de pasar la anterior validación, se crea una nueva cita

  // Generar un id único
  citaObj.id = Date.now();

  // Agregar cita
  citas.agregarCita({ ...citaObj });

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


