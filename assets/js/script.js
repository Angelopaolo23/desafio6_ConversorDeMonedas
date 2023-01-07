//DEFINICION DE VARIABLES
const inputAmount = document.querySelector("#amount-input");
const selectCurrency = document.querySelector("#currency-select");
const btnSearch = document.querySelector("#search-button");
const htmlResult = document.querySelector("#conversion-result");
const apiURL = "https://mindicador.cl/api/";

async function getCurrencyData(){
    try {
        const res = await fetch(apiURL)
        const dataCurrency = await res.json();
        return dataCurrency;
    } catch (e) {
        alert(e.message)
    }
}
//FUNCION RENDERIZAR MONEDAS DEL SELECT

async function renderCurrency() {
    const currencies = await getCurrencyData();
    let selectOptions = `
        <option class="text-center" id="${currencies["uf"].codigo}-option" value="${currencies["uf"].valor}">${currencies["uf"].nombre}</option>
        <option class="text-center" id="${currencies["uf"].codigo}-option" value="${currencies["dolar"].valor}">${currencies["dolar"].nombre}</option>
        <option class="text-center" id="${currencies["uf"].codigo}-option" value="${currencies["euro"].valor}">${currencies["euro"].nombre}</option>
    `;
    selectCurrency.innerHTML = selectOptions;
    
}

async function currencyConversion(){
    const currencies = await getCurrencyData();
    const amountValue = inputAmount.value;
    const currencyValue = selectCurrency.value;
    const conversionResult = parseInt(amountValue)/parseFloat(selectCurrency.value);
    if (currencies["uf"].valor == currencyValue) {
        htmlResult.innerHTML = `${conversionResult.toFixed(2)} UF`;
    } else if (currencies["dolar"].valor == currencyValue) {
        htmlResult.innerHTML = `USD $${conversionResult.toFixed(2)}`;
    } else if (currencies["euro"].valor == currencyValue) {
        htmlResult.innerHTML = `${conversionResult.toFixed(2)} €`;
    }
}


btnSearch.addEventListener("click", () => {
    currencyConversion()
})

renderCurrency()

