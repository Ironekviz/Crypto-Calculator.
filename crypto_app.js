const criptoSelect = document.querySelector('#criptomoneda');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#form1');

const objBusq = {
    moneda: '',
    criptomoneda: ''
}

//promise
const obtenerCripto = criptomoneda => new Promise( resolve =>{
    resolve(criptomoneda);
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCripto();
    formulario.addEventListener('submit', submitFormulario);

    criptoSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
})

function consultarCripto(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

    fetch(url)
        .then ( respuesta => respuesta.json() )
        .then ( resultado => obtenerCripto(resultado.Data) )
        .then ( criptomoneda => selectCripto(criptomoneda) )
}

function selectCripto (criptomoneda){
    criptomoneda.forEach( cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptoSelect.appendChild(option);
    })
}

function leerValor(e){
    objBusq [e.target.name] = e.target.value;
    console.log(objBusq);
}

function submitFormulario(e){
 e.preventDefault();

 //validar
 const { moneda, criptomoneda} = objBusq;

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos Campos son Obligatorios.');
        return;   
    }

    //consultamos la API
    consultarAPI();
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error');

    if(!existeError){   
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('error');

        divMensaje.textContent = msg;
        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

function consultarAPI (){
    const { moneda, criptomoneda} = objBusq;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda},EUR`;

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacionhtml(cotizacion.DISPLAY[criptomoneda][moneda]);
        })
}

function mostrarCotizacionhtml(cotizacion){
    console.log(cotizacion);

    limpiar();

    const {PRICE, HIGHDAY, LOWDAY} = cotizacion;

    const precio = document.createElement('p');
    precio.classList.add('precio');
    precio.innerHTML = `Precio actual: <span>${PRICE}</span>`;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `<p>Precio mas alto del dia: <span>${HIGHDAY}</span>`;
    
    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `<p>Precio mas bajo del dia: <span>${LOWDAY}</span>`;
    

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
}

function limpiar (){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}