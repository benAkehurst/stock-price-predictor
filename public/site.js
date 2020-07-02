// Document Elements
const stockSymbolInput = document.querySelector('#stockSymbolInput');
const submitButton = document.querySelector('#submitButton');
const resultsSection = document.querySelector('#resultsSection');
const loaderDiv = document.querySelector('#loader');
const resultsDiv = document.querySelector('#results');
const resultsWrapper = document.querySelector('#resultsWrapper');
const autoCompleteWrapper = document.querySelector('#autoCompleteWrapper');
const autoCompleteOption = document.createElement('div');
const singleStockOption = document.querySelector('.singleStockOption');
const getHistoryButton = document.querySelector('#getHistoryButton');
const historyResults = document.querySelector('#historyResults');

// API Urls
const REQUEST_URL = 'http://localhost:8080/api/stocks/get-stock-prediction/';
const AUTOCOMPLETE_URL =
  'http://localhost:8080/api/stocks/get-autocomplete-values/';
const HISTORY_URL = 'http://localhost:8080/api/stocks/get-all-predictions/';

// Set submit button to disabled on init
submitButton.disabled = true;

// Listener for adding text to input field - calls autocomplete method
stockSymbolInput.addEventListener('keyup', (e) => {
  if (e.keyCode === 8 || e.keyCode === 46) {
    clearAutoComplete();
  } else {
    checkForInputValue();
    autoCompleteHandler(e);
  }
});

// Event Listener for prediction history
getHistoryButton.addEventListener('click', () => {
  getPredictionHistoryHandler(HISTORY_URL);
});

autoCompleteHandler = async (event) => {
  let inputValue = event.target.value;
  const reqUrl = `${AUTOCOMPLETE_URL}${inputValue}`;
  getAutocompleteValues(reqUrl);
};

// Changes button disabled if text in input field
checkForInputValue = () => {
  !stockSymbolInput.value
    ? (submitButton.disabled = true)
    : (submitButton.disabled = false);
};

// Get Request handler
submitButton.addEventListener('click', (e) => {
  let stockSymbol = stockSymbolInput.value;
  const reqUrl = `${REQUEST_URL}${stockSymbol}`;
  getRequestHandler(reqUrl);
});

// Get request handler
getRequestHandler = async (url) => {
  showLoaderHandler();
  let request = await fetch(url, { method: 'GET' })
    .then((response) => {
      hideLoaderHandler();
      return response.json();
    })
    .catch((error) => {
      hideLoaderHandler();
      return { error: error, message: 'Failed to get prediction' };
    });
  showResultsDisplay(request);
};

// Get Autocomplete options handler
getAutocompleteValues = async (url) => {
  let request = await fetch(url, { method: 'GET' })
    .then((response) => {
      return response.json();
    })
    .catch((error) => {
      return { error: error, message: 'Failed to get autocomplete options' };
    });
  showAutoCompleteOptions(request);
};

// Get and show the history of predictions
getPredictionHistoryHandler = async (url) => {
  let request = await fetch(url, { method: 'GET' })
    .then((response) => {
      hideLoaderHandler();
      return response.json();
    })
    .catch((error) => {
      hideLoaderHandler();
      return { error: error, message: 'Failed to get prediction' };
    });
  request.data.map((item) => {
    const singleItem = document.createElement('div');
    singleItem.innerText = `
      Stock Symbol - ${item.stockSymbol}
      Initial request date - ${item.createdAt}
      Predictions: Open - ${item.data[0].open.toFixed(2)}
      Predictions: High - ${item.data[0].high.toFixed(2)}
      Predictions: Low - ${item.data[0].low.toFixed(2)}
      Predictions: Close - ${item.data[0].close.toFixed(2)}
    `;
    historyResults.appendChild(singleItem);
  });
};

// Loader Handlers
showLoaderHandler = () => {
  loaderDiv.style.display = 'block';
  // Timer function
  let sec = 0;
  pad = (val) => {
    return val > 9 ? val : '0' + val;
  };
  setInterval(() => {
    document.getElementById('seconds').innerHTML = `${pad(++sec % 60)} seconds`;
    document.getElementById('minutes').innerHTML = `${pad(
      parseInt(sec / 60, 10)
    )} minutes : `;
  }, 1000);
};

hideLoaderHandler = () => {
  loaderDiv.style.display = 'none';
};

// Show result and hide loader
showResultsDisplay = (requestedData) => {
  resultsSection.style.display = 'block';
  resultsDiv.style.display = 'block';
  if (!requestedData.success) {
    resultsWrapper.innerText = requestedData.message;
  } else {
    resultsWrapper.innerText = `
      ${requestedData.message}
      Open: ${requestedData.data[0].open.toFixed(2)}
      High: ${requestedData.data[0].high.toFixed(2)}
      Low: ${requestedData.data[0].low.toFixed(2)}
      Close: ${requestedData.data[0].close.toFixed(2)}
    `;
  }
};

// Shows options for autocomplete
showAutoCompleteOptions = (responseData) => {
  const autoCompleteData = responseData;
  if (!autoCompleteData.success) {
    return;
  } else {
    autoCompleteWrapper.style.display = 'block';
    // make list dynamically
    if (autoCompleteWrapper.childNodes.length > 0) {
      autoCompleteWrapper.innerHTML = '';
      autoCompleteData.data.forEach((item) => {
        let singleOption = document.createElement('div');
        singleOption.className = 'singleStockOption';
        singleOption.innerText = `Name: ${item.name} | Stock Symbol - ${item.symbol}`;
        autoCompleteWrapper.appendChild(singleOption);
      });
    } else {
      autoCompleteData.data.forEach((item) => {
        let singleOption = document.createElement('div');
        singleOption.className = 'singleStockOption';
        singleOption.innerText = `Name: ${item.name} | Stock Symbol - ${item.symbol}`;
        autoCompleteWrapper.appendChild(singleOption);
      });
    }
  }
};

// Clears auto complete
clearAutoComplete = () => {
  autoCompleteWrapper.innerHTML = '';
  autoCompleteWrapper.style.display = 'none';
};

// Get stock symbol when clicking on autocomplete option
document.body.addEventListener('click', (e) => {
  e.preventDefault();
  if (e.srcElement.className === 'singleStockOption') {
    stockSymbolInput.value = e.srcElement.innerText.split('-')[1].trim();
  } else {
    autoCompleteWrapper.style.display = 'none';
  }
});
