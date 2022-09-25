const selectMoneda = document.querySelector('#moneda')
const selectCryptos = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const resultadoDiv = document.querySelector('#resultado')
let code, crypto = ""

document.addEventListener('DOMContentLoaded', () => {
    const parameters = new URLSearchParams(window.location.search)
    code = parameters.get('moneda')
    crypto = parameters.get('criptomoneda')
    if (code && crypto) {
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${crypto}&tsyms=${code}`
        llamarAPI(url, true, true)
    }
    llamarAPI('https://openexchangerates.org/api/currencies.json')
    llamarAPI('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD', false)

    formulario.addEventListener('submit', validarFormulario)
})

function llenarMonedas(data) {

    for (const key in data) {
        const value = data[key]

        // create option element for select 
        const option = document.createElement('option')
        option.value = key
        option.textContent = value

        selectMoneda.appendChild(option)
    }
}

function llenarCryptos(data) {
    const { Data } = data

    Data.forEach(crypto => {
        const { CoinInfo: { Name, FullName } } = crypto

        //create option element for select 
        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName

        selectCryptos.appendChild(option)
    })
}


function llamarAPI(url, bol = true, submit = false) {
    if (submit) {
        fetch(url)
            .then(res => res.json())
            .then(data => mostrarInformacion(data.DISPLAY[crypto][code]))
            .catch(e => mostrarAlerta('error', 'Conversion a moneda no encontrado \nSeleccion otra moneda o cryptomoneda'))
    } else {
        fetch(url)
            .then(res => res.json())
            .then(data => bol ? llenarMonedas(data) : llenarCryptos(data))
    }
}

function mostrarInformacion(data) {
    let { PRICE, HIGHDAY, LOWDAY, CHANGEPCTDAY, LASTUPDATE } = data
    PRICE = PRICE.split(' ')[1]
    HIGHDAY = HIGHDAY.split(' ')[1]
    LOWDAY = LOWDAY.split(' ')[1]
    const price = document.createElement('p')
    price.textContent = `El precio es: $ ${PRICE}`
    const highday = document.createElement('p')
    highday.textContent = `Precio mas álto del día: $ ${HIGHDAY}`
    const lowday = document.createElement('p')
    lowday.textContent = `Precio más bajo del día: $ ${LOWDAY} `
    const variation = document.createElement('p')
    variation.textContent = `Variación últimas 24 horas: ${CHANGEPCTDAY}%`
    const lastUpdate = document.createElement('p')
    lastUpdate.textContent = `Última Actualización: ${LASTUPDATE}`


    resultadoDiv.appendChild(price)
    resultadoDiv.appendChild(highday)
    resultadoDiv.appendChild(lowday)
    resultadoDiv.appendChild(variation)
    resultadoDiv.appendChild(lastUpdate)
}


function validarFormulario(e) {
    if (selectCryptos.value === "" || selectMoneda.value === "") {
        e.preventDefault()
        mostrarAlerta('warning', 'Todos los campos son obligatorios')
        return
    }
}

function mostrarAlerta(type, message) {
    Swal.fire({
        position: 'center',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 1500
    })
}