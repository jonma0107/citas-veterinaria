import { datosCita, nuevaCita, crearBD } from "../functions.js";

import { mascotaInput, propietarioInput, telefonoInput, fechaInput, horaInput, sintomasInput, formulario } from "../selectors.js";

class App {
  constructor() {
    this.initApp();
  }


  initApp() {

    window.onload = () => {
      crearBD();
    }

    mascotaInput.addEventListener('change', datosCita);
    propietarioInput.addEventListener('change', datosCita);
    telefonoInput.addEventListener('change', datosCita);
    fechaInput.addEventListener('change', datosCita);
    horaInput.addEventListener('change', datosCita);
    sintomasInput.addEventListener('change', datosCita);

    formulario.addEventListener('submit', nuevaCita);
  }
} // Fin clase App

export default App;
