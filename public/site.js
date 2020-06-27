// Document Elements
const stockSymbolInput = document.querySelector('#stockSymbolInput');
const submitButton = document.querySelector('#submitButton');
const resultsSection = document.querySelector('#resultsSection');
const loaderDiv = document.querySelector('#loader');
const resultsDiv = document.querySelector('#results');
const resultsWrapper = document.querySelector('#resultsWrapper');
const REQUEST_URL = 'http://localhost:8080/api/stocks/get-stock-prediction/';

// Set submit button to disabled on init
submitButton.disabled = true;

// Listener for adding text to input field
stockSymbolInput.addEventListener('keyup', (e) => {
  checkForInputValue();
});

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
