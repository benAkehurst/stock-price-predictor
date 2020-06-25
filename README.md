# Stock Price Predictor

A project to start learning about machine learning in Javascript. Utilizing the [Brain.js](https://brain.js.org/) library and the stock prices API provided by [Alphavantage](https://www.alphavantage.co/).

The aim of the server will take a stock symbol, pull the last 100 days of stock data from Alphavantage then make a prediction on what the stock price will be today!

## Getting Started

- Clone the repo
- Run `npm i`
- Add a `.env` file and add:

```javascript
JWT_SECRET=<anything you want>
ALPHA_VANTAGE_KEY=<API key from Alphavantage>
```

- `npm run start` in the terminal to get the project running on port:8080

## Calling the API

Currently the only route that can be called on the api is:

```javascript
http://localhost:8080/api/stocks/get-stock-prediction/:stock

params:
stock - needs to be a valid stock symbol e.g AAPL or MSFT
```

You will then get a response back that looks like this:

```javascript
{
    "success": true,
    "message": "Prediction made successfully!",
    "data": [
        {
            "open": 196.95269326686858,
            "high": 200.28645069122314,
            "low": 195.04503690719602,
            "close": 195.04503690719602
        }
    ]
}

```
