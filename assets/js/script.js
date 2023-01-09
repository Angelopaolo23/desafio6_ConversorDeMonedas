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

async function renderCurrency() {
    const currencies = await getCurrencyData();
    let selectOptions = `
        <option class="text-center" value="${currencies["uf"].codigo}">${currencies["uf"].nombre}</option>
        <option class="text-center" value="${currencies["dolar"].codigo}">${currencies["dolar"].nombre}</option>
        <option class="text-center" value="${currencies["euro"].codigo}">${currencies["euro"].nombre}</option>
    `;
    selectCurrency.innerHTML = selectOptions;
    
}

async function currencyConversion(){
    const currencies = await getCurrencyData();
    const amountValue = inputAmount.value;
    const currencyType = selectCurrency.value;
    if (currencyType === "uf") {
        let conversionResult = parseInt(amountValue)/parseFloat(currencies[currencyType].valor);
        conversionResult = conversionResult.toFixed(2);
        htmlResult.innerHTML = `Resultado: ${conversionResult} UF`;
    } else if (currencyType === "dolar") {
        let conversionResult = parseInt(amountValue)/parseFloat(currencies[currencyType].valor);
        conversionResult = Intl.NumberFormat('es-US',{style:'currency',currency:'USD'}).format(conversionResult);
        htmlResult.innerHTML = `Resultado: ${conversionResult.toLocaleString('en-US', {style: 'currency',currency: 'USD', minimumFractionDigits: 2})}`;
    } else if (currencyType === "euro") {
        let conversionResult = parseInt(amountValue)/parseFloat(currencies[currencyType].valor);
        conversionResult = Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(conversionResult);
        htmlResult.innerHTML = `Resultado: ${conversionResult} `;
    }
}

//chart configuration
async function getIndexData(){
    try {
        const currencyType = selectCurrency.value;
        if (currencyType === "uf"){
            const res = await fetch ("https://mindicador.cl/api/uf")
            const ufData = await res.json();
            let ufFilter = ufData["serie"];
            ufFilter = ufFilter.splice(0, 10);
            return ufFilter;
        } else if (currencyType === "dolar"){
            const res = await fetch ("https://mindicador.cl/api/dolar")
            const dolarData = await res.json();
            let dolarFilter = dolarData["serie"];
            dolarFilter = dolarFilter.splice(0, 10);
            return dolarFilter;
        } else if (currencyType === "euro"){
            const res = await fetch ("https://mindicador.cl/api/euro")
            const euroData = await res.json();
            let euroFilter = euroData["serie"];
            euroFilter = euroFilter.splice(0, 10);
            return euroData;
        }
    } catch (e) {
        alert(e.message)
    }
}

async function configChart() {
    const datesData = await getIndexData();
    const chartType = "line";
    let datesList = [];
    for (let date in datesData){
        let dateToPush = datesData[date].fecha
        dateToPush = dateToPush.slice(0,10)
        datesList.push(dateToPush);
    }
    let pricesList = [];
    for (let price in datesData){
        let priceToPush = datesData[price].valor
        pricesList.push(priceToPush);
    }
    const title = "Precios de la moneda en los ultimos 10 dias";
    const lineColor = "red";
    const config = {
        type: chartType,
        data: {
            labels: datesList,
            datasets: [
                {
                    label: title,
                    backgroundColor: lineColor,
                    data: pricesList 
                }
            ]
        }
    }
    return config;
}
async function renderChart(){
    const config = configChart();
    const chartCurrency = document.querySelector("#currency-chart");
    new Chart(chartCurrency, config)
}


btnSearch.addEventListener("click", () => {
    if (inputAmount.value == ""){
        alert("DEBE INDICAR UNA CANTIDAD DE PESOS CHILENOS A CONVERTIR")
    } else {
        currencyConversion()
        renderChart()
        configChart()
    } 
})


renderCurrency()
