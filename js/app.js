// Variables & Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;

// Eventos
eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);
}

// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [... this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto(cantidad) {
        const { presupuesto, restante } = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta( mensaje, tipo ) {
        const pMensaje = document.createElement('p');
        pMensaje.classList.add('alert','text-center');

        if (tipo === 'error') {
            pMensaje.classList.add('alert-danger')
        } else {
            pMensaje.classList.add('alert-success');
        }

        pMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(pMensaje,formulario);

        setTimeout(() => {
            pMensaje.remove();
        },3000)
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        if ( (presupuesto / 4) > restante ) {
            document.querySelector('.restante').className = 'restante alert alert-danger';
        } else if( (presupuesto / 2) > restante ) {
            document.querySelector('.restante').className = 'restante alert alert-warning';
        } else {
            document.querySelector('.restante').className = 'restante alert alert-success';
        }

        if (restante < 0) {
            ui.imprimirAlerta('Ya superó el límite de su presupuesto','error');
        }
    }

    imprimirGastos(gastos) {
        this.limpiarHTML();

        gastos.forEach( nombre => {
            const { cantidad, gasto, id } = nombre;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.id = id;

            nuevoGasto.innerHTML = `${gasto} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`;

            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = 'Eliminar';
            btnBorrar.className = 'btn btn-danger borrar-gasto';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }

            nuevoGasto.appendChild(btnBorrar);

            gastoListado.appendChild(nuevoGasto);
        })
    }

    limpiarHTML() {
        while ( gastoListado.firstChild ) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }
}

// Instanciar
const ui = new UI();

// Funciones
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    if (presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(Number(presupuestoUsuario)) || presupuestoUsuario <= 0) {
        window.location.reload();
    } else {
        presupuesto = new Presupuesto(presupuestoUsuario);
        ui.insertarPresupuesto(presupuesto);
    }
}

function agregarGasto(e) {
   e.preventDefault();

   const gasto = document.querySelector('#gasto').value;
   const cantidad = Number(document.querySelector('#cantidad').value);

   if (gasto === '' || cantidad === null) {

       ui.imprimirAlerta('Todos los campos son obligatorios','error');

   } else if( cantidad <= 0 || isNaN(cantidad)) {

      ui.imprimirAlerta('Cantidad no válida','error');

   } else if(!isNaN(gasto)) {

       ui.imprimirAlerta('Gasto no válido','error');

   } else {
        const gastoObj = { gasto, cantidad, id: Date.now() };

        presupuesto.nuevoGasto(gastoObj);

        ui.imprimirAlerta('Gasto agregado correctamente');

        const { gastos, restante } = presupuesto;

        ui.imprimirGastos(gastos);

        ui.actualizarRestante(restante);

        ui.comprobarPresupuesto(presupuesto);

        formulario.reset();
   }
}

function eliminarGasto(id) {
    presupuesto.eliminarGasto(id);
    ui.imprimirGastos(presupuesto.gastos);
    ui.actualizarRestante(presupuesto.restante);
    ui.comprobarPresupuesto(presupuesto);
}