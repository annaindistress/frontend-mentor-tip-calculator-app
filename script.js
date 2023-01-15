'use strict';

/* Variables */

const form = document.querySelector('.calculator__form');

const billInput = form.querySelector('#bill-amount-input');
const billLabel = form.querySelector('.calculator__field--bill .calculator__label');

const peopleInput = form.querySelector('#people-amount-input');
const peopleLabel = form.querySelector('.calculator__field--people .calculator__label');

const tipList = form.querySelector('.calculator__list');
const tipInput = form.querySelector('#tip-amount-custom');

const resultTipElement = form.querySelector('.result__item--tip .result__amount');
const resultTotalElement = form.querySelector('.result__item--total .result__amount');

const resetButton = form.querySelector('.result__button');

let bill;
let people;
let tip;
let selectedTip;

/* Functions */

const init = () => {
  displayResults();
  resetButton.disabled = true;
};

const displayResults = (bill = 0, people = 0, tip = 0) => {
  let resultTips = 0;
  let resultTotal = 0;

  const billNum = parseInt(bill);
  const peopleNum = parseInt(people);
  const tipNum = parseInt(tip);

  if (billNum !== 0 && peopleNum !== 0) {
    if (tipNum !== 0) {
      resultTips = ((billNum / 100) * tipNum) / peopleNum;
    }

    resultTotal = billNum / peopleNum + resultTips;
  }

  resultTipElement.textContent = `$${resultTips.toFixed(2)}`;
  resultTotalElement.textContent = `$${resultTotal.toFixed(2)}`;
};

const displayError = (input, label) => {
  if (!input.classList.contains('calculator__input--error')) {
    const errorMessage = document.createElement('span');
    errorMessage.classList.add('calculator__error');
    errorMessage.textContent = 'Can’t be zero';
    label.after(errorMessage);

    input.classList.add('calculator__input--error');
  }
};

const removeError = (input, label) => {
  if (label.nextElementSibling.classList.contains('calculator__error')) {
    label.nextElementSibling.remove();
    input.classList.remove('calculator__input--error');
  }
};

const inputHandler = () => {
  bill = billInput.value;
  people = peopleInput.value;
  tip = tipInput.value;
  selectedTip = tipList.querySelector('.calculator__radio:checked');

  if (bill !== '' && people === '') {
    displayResults();
    displayError(peopleInput, peopleLabel);
  }

  if (bill === '' && people !== '') {
    displayResults();
    displayError(billInput, billLabel);
  }

  if (bill === '' && people === '') {
    removeError(billInput, billLabel);
    removeError(peopleInput, peopleLabel);
  }

  if ((bill !== '') & (people !== '')) {
    let tip = 0;

    if (tip !== '') tip = parseInt(tip);
    if (selectedTip !== null) tip = parseInt(selectedTip.value);

    displayResults(bill, people, tip);
  }
};

const resetHandler = () => {
  bill = billInput.value;
  people = peopleInput.value;
  tip = tipInput.value;
  selectedTip = tipList.querySelector('.calculator__radio:checked');

  resetButton.disabled =
    bill === '' && people === '' && tip === '' && selectedTip === null;
};

/* Initialize */

init();

/* Event listeners */

form.addEventListener('reset', init);

billInput.addEventListener('change', () => {
  if (
    billInput.classList.contains('calculator__input--error') &&
    billInput.value !== ''
  )
    removeError(billInput, billLabel);
  inputHandler();
  resetHandler();
});

peopleInput.addEventListener('input', () => {
  if (
    peopleInput.classList.contains('calculator__input--error') &&
    peopleInput.value !== ''
  )
    removeError(peopleInput, peopleLabel);
  inputHandler();
  resetHandler();
});

tipInput.addEventListener('input', () => {
  const selectedTip = tipList.querySelector('.calculator__radio:checked');
  if (tipInput.value !== '' && selectedTip !== null)
    selectedTip.checked = false;
  if (billInput.value !== '' && peopleInput.value !== '')
    displayResults(billInput.value, peopleInput.value, tipInput.value);
  resetHandler();
});

tipList.addEventListener('change', (evt) => {
  const target = evt.target;
  if (target.name === 'tip-amount') {
    if (tipInput.value !== '') tipInput.value = '';
    if (billInput.value !== '' && peopleInput.value !== '')
      displayResults(billInput.value, peopleInput.value, target.value);
    resetHandler();
  }
});
