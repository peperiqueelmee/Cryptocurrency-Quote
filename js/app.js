//Variables
const form = document.querySelector('#form');
const currencySelect = document.querySelector('#currency');
const cryptocurrencySelect = document.querySelector('#cryptocurrency');
const result = document.querySelector('#result');

const searchObject = {
    currency: '',
    cryptocurrency: ''
}


//Listeners
document.addEventListener('DOMContentLoaded', () => {
    consultCryptocurrencies();

    form.addEventListener('submit', submitForm)

    cryptocurrencySelect.addEventListener('change', readValue);
    currencySelect.addEventListener('change', readValue);
});


//Functions
async function consultCryptocurrencies() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=CLP'

    try {
        const response = await fetch(url);
        const result = await response.json();
        loadCryptocurrencies(result.Data);
    } catch (error) {
        console.log(error);
    }
}

function loadCryptocurrencies(cryptocurrencies) {
    cryptocurrencies.forEach(cryptocurrency => {
        const { FullName, Name } = cryptocurrency.CoinInfo;

        //Create cryptocurrency options
        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        cryptocurrencySelect.appendChild(option);
    });
}

function readValue(e) {
    searchObject[e.target.name] = e.target.value;
}

function submitForm(e) {
    e.preventDefault();
    const { currency, cryptocurrency } = searchObject;

    //Validation of all completed fields
    if (currency === '' || cryptocurrency === '') {
        showAlert('Ambos campos son obligatorios');
        return;
    }

    getQuotationCryptocurrency();
}

function showAlert(msg) {
    const errorExist = document.querySelector('.error');
    if (!errorExist) {
        //Create message error
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('error');
        messageDiv.textContent = msg;
        form.appendChild(messageDiv);

        //Remove message error after three seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

async function getQuotationCryptocurrency() {
    const { currency, cryptocurrency } = searchObject;

    showSpinner();

    try {
        const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${cryptocurrency}&tsyms=${currency}`
        const response = await fetch(url);
        const quotation = await response.json();
        showQuotationHTML(quotation.DISPLAY[cryptocurrency][currency]);
    } catch (error) {
        console.log(error)
    }
}

function showQuotationHTML(quotation) {
    cleanHTML();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = quotation;

    //Create result paragraphs
    const currentPrice = document.createElement('p');
    currentPrice.classList.add('precio');
    currentPrice.innerHTML = `El precio es de: <span>${PRICE}</span>`;

    const highestPriceOfTheDay = document.createElement('p');
    highestPriceOfTheDay.innerHTML = `El precio más alto del dia: <span>${HIGHDAY}</span>`;

    const lowestPriceOfTheDay = document.createElement('p');
    lowestPriceOfTheDay.innerHTML = `El precio más bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('p');
    ultimasHoras.innerHTML = `Variacion últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const lastUpdate = document.createElement('p');
    lastUpdate.innerHTML = `Ultima actualización: <span>${LASTUPDATE}</span>`;

    //Assigning paragraphs to parent Div
    result.appendChild(currentPrice);
    result.appendChild(highestPriceOfTheDay);
    result.appendChild(lowestPriceOfTheDay);
    result.appendChild(ultimasHoras);
    result.appendChild(lastUpdate);
}

function cleanHTML() {
    while (result.firstChild) {
        result.removeChild(result.firstChild);
    }
}

function showSpinner() {
    cleanHTML();

    const spinner = document.createElement('div');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    result.appendChild(spinner);
}