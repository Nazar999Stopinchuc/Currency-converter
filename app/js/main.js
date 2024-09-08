const url = 'https://v6.exchangerate-api.com/v6/';
const key = 'dd8fac2b8f50d5031a77e3e1';
const input = document.querySelector('#have-input');
const output = document.querySelector('#get-input');
const allCurrenciesBox = document.querySelector('.all-currencies');
const allCurrencies = document.querySelector('.all-currencies__list');
const symbolFrom = document.querySelector('#symbol-from');
const symbolTo = document.querySelector('#symbol-to');

const currencyFromBtn = document.querySelector('#show-currencies_from');
const currencyToBtn = document.querySelector('#show-currencies_to');
const changeValueBtn = document.querySelector('.converter__change');

let currenciesData;
let countriesInfo;
let exchangeCurrencyTemp;


async function getCurrencies() {

  if (currenciesData) {
    return currenciesData;
  };

  let currencyTo = currencyToBtn.dataset.value;

  try {
    const response = await fetch(`${url}${key}/latest/${currencyTo}`);
    const res = await response.json();

    currenciesData = res;
    return currenciesData;
  } 
  catch (error) {
    console.log(error);
  };
};

async function getСountriesInfo() {

  if (countriesInfo) {
    return countriesInfo;
  }

  try {
    const response = await fetch(` https://restcountries.com/v3.1/all`);
    const res = await response.json();
    countriesInfo = {};

    for (k of res) {
      let currencies = k.currencies;
      let flag = k.flags.png;

      for (j in currencies) {
        countriesInfo[j] = {};
        countriesInfo[j].flag = flag;
        countriesInfo[j].name = currencies[j].name;
        countriesInfo[j].symbol = currencies[j].symbol;
      };
    };

    return countriesInfo;
  } catch (error) {
    console.log(error);
  };
};

async function currencyCalc(exchangeСur, exchangeToСur, inputFrom, inputTo) {
  const data = await getCurrencies();
  const dataCurrency = data.conversion_rates;

  let result = (parseFloat(inputFrom.value) / dataCurrency[exchangeСur]) * dataCurrency[exchangeToСur];
  let formattedResult = result.toFixed(2);


  inputTo.value = formattedResult;
};

async function currencyRender() {
  const data = await getCurrencies();
  const countriesData = await getСountriesInfo();
  const dataCurrency = data.conversion_rates;


  const commonKeys = Object.keys(dataCurrency).filter(k => k in countriesData);

  allCurrencies.innerHTML = '';
  commonKeys.forEach(k => {
    let item = document.createElement('li');
    item.className = 'all-currencies__item';
    item.dataset.value = k;
    item.dataset.symbol = countriesData[k].symbol;

    item.innerHTML = `${k} <span class="all-currencies__name">${countriesData[k].name}</span>
               <img class="all-currencies__flag" src="${countriesData[k].flag}" alt="country flag">`;

    allCurrencies.append(item);
  });
};

function swapAndUpdate(element1, element2, property, textElement1, textElement2) {
  [element1.dataset[property], element2.dataset[property]] = [element2.dataset[property], element1.dataset[property]];
  textElement1.textContent = element1.dataset[property];
  textElement2.textContent = element2.dataset[property];
};

function inputValidation(input) {
  let value = input.value;
  value = value.replace(/[^0-9.,]/g, '');

  if (value.length > 1) {
    if (value[0] === '0' && (value[1] === '.' || value[1] === ',')) {
      input.value = value;
    } else if (value[0] === '0') {
      input.value = value.substring(1);
    };
  };
};


window.addEventListener('DOMContentLoaded', () => {
  
  changeValueBtn.addEventListener('click', () => {
    swapAndUpdate(currencyFromBtn, currencyToBtn, 'value', currencyFromBtn, currencyToBtn);
    swapAndUpdate(currencyFromBtn, currencyToBtn, 'symbol', symbolFrom, symbolTo);

    [input.value, output.value] = [output.value, input.value];
  });

  allCurrenciesBox.addEventListener('click', (e) => {
    let target = e.target;
    if (target.tagName !== 'LI') {
      allCurrenciesBox.classList.remove('to-show');
      return;
    }

    const button = exchangeCurrencyTemp === 'from' ? currencyFromBtn : currencyToBtn;
    const сurrencySymbol = exchangeCurrencyTemp === 'from' ? symbolFrom : symbolTo;
    let targetValue = target.dataset.value;
    let targetSymbol = target.dataset.symbol;

    button.dataset.value = targetValue;
    button.textContent = targetValue;
    button.dataset.symbol = targetSymbol;
    сurrencySymbol.textContent = targetSymbol;

    allCurrenciesBox.classList.remove('to-show');
    currencyCalc(currencyFromBtn.dataset.value, currencyToBtn.dataset.value, input, output);
  });

  currencyFromBtn.addEventListener('click', function () {
    allCurrenciesBox.classList.toggle('to-show');
    exchangeCurrencyTemp = this.dataset.temp;
  });

  currencyToBtn.addEventListener('click', function () {
    allCurrenciesBox.classList.toggle('to-show');
    exchangeCurrencyTemp = this.dataset.temp;
  });

  input.addEventListener('input', function () {
    inputValidation(this);
    currencyCalc(currencyFromBtn.dataset.value, currencyToBtn.dataset.value, input, output);
  });

  output.addEventListener('input', function () {
    inputValidation(this);
    currencyCalc(currencyToBtn.dataset.value, currencyFromBtn.dataset.value, output, input);
  });


  currencyRender();
  currencyCalc(currencyFromBtn.dataset.value, currencyToBtn.dataset.value, input, output);
});











