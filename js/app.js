//Variables

const formulario = document.querySelector('#agregar-gasto');
const listado = document.querySelector('#gastos');

//Clases

class Presupuesto {
    constructor(Presupuesto){
        this.presupuesto = Number(Presupuesto);
        this.restante = Number(Presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos.push(gasto);
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    removerBtn(id){
        this.gastos = this.gastos.filter(gasto=>gasto.id != id);
        this.calcularRestante();
    }
}

class UI {
    InsertarPresupuestoInicial(cantidad){
        document.querySelector('#total').textContent = cantidad;
        document.querySelector('#restante').textContent = cantidad;
    }

    MostrarMensaje(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error'){

            divMensaje.classList.add('alert-danger');

        }else{

            divMensaje.classList.add('alert-success');

        }

        divMensaje.textContent = mensaje;
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante} = presupuestoObj;
        const restanteDiv = document.querySelector('.restante');

        
        // Comprobar el 25% 
        if( (presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if( (presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si presupuesta es igual a 0 
        if(restante <= 0 ) {
            interfaz.MostrarMensaje('El presupuesto se ha agotado', 'error');
            formulario.querySelector('button[type="submit"]').disabled = true;
        } 
    }

    actualizarRestante(restante){
        document.querySelector('#restante').textContent = restante;
    }

    mostrarHTML(){
        this.limpiarHTML();
        const lista_gastos = presupuesto.gastos;
        lista_gastos.forEach(gasto => {
            const {etiqueta, cantidad, id} = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;

            nuevoGasto.innerHTML = `
                ${etiqueta}
                <span class="badge badge-primary badge-pill">$ ${cantidad}</span>
            `;

            const btn_eliminar = document.createElement('button');
            btn_eliminar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btn_eliminar.textContent = 'Borrar';
            nuevoGasto.appendChild(btn_eliminar);

            btn_eliminar.onclick = ()=>{
                presupuesto.removerBtn(gasto.id);
                this.mostrarHTML();
                this.actualizarRestante(presupuesto.restante);
                this.comprobarPresupuesto(presupuesto.restante);
            }
            listado.appendChild(nuevoGasto);
            
        });
    }

    limpiarHTML(){
        while (listado.firstChild) {
            listado.firstChild.remove();
        }
    }

}

presupuesto = new Presupuesto();
interfaz = new UI();
//Eventos

document.addEventListener('DOMContentLoaded',ValidarEntrada);
formulario.addEventListener('submit',ValidarFormulario);
//Funciones

function ValidarEntrada(){
    const numero = prompt('Introduzca un número');
    if(numero <= 0 || isNaN(numero) || numero === '' || numero === null){
        window.location.reload();
    }else{
        presupuesto = new Presupuesto(Number(numero));
        interfaz.InsertarPresupuestoInicial(Number(numero));

    }
}

function ValidarFormulario(e){
    e.preventDefault();
    const nombre = formulario.querySelector('#gasto').value;
    const cantidad = Number( document.querySelector('#cantidad').value);
    if(nombre === '' || cantidad === ''){
        interfaz.MostrarMensaje('Debes rellenar los campos','error');
    }else if(isNaN(cantidad) || cantidad <= 0){
        interfaz.MostrarMensaje('Cantidad no válida','error');

    }else{
        interfaz.MostrarMensaje('Correcto', 'correcto');
        const gasto = {
            id: Date.now(),
            etiqueta: nombre,
            cantidad: Number(cantidad)
        }
        presupuesto.nuevoGasto(gasto);
        interfaz.comprobarPresupuesto(presupuesto);
        interfaz.actualizarRestante(presupuesto.restante);
        interfaz.mostrarHTML();

        formulario.reset();

    }
}