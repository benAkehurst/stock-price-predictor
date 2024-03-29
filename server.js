// Server Dependencies
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

// Models Imports
const User = require('./api/models/userModel');
const Stock = require('./api/models/stockModel');

// Init Express
const app = express();
require('dotenv').config();

// DB Connection
mongoose
  .connect(
    process.env.DB_HOST,
    () => {
      console.log(`Connected to MongoDB Successfully`);
    },
    { useNewUrlParser: true },
    { useUnifiedTopology: true }
  )
  .catch((err) => {
    console.log(err);
  });

// Server Config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cors Controls
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'POST, GET, PATCH, DELETE, OPTIONS'
  );
  next();
});
app.use(cors());

// Routes Definitions
const authRoutes = require('./api/routes/authRoutes');
const stocksRoutes = require('./api/routes/stocksRoutes');
authRoutes(app);
stocksRoutes(app);

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.get('/', (req, res) => {
  let exampleSymbols = [
    {
      symbol: 'AAPL',
      company: 'Apple',
    },
    {
      symbol: 'MSFT',
      company: 'Microsoft',
    },
    {
      symbol: 'AMZN',
      company: 'Amazon',
    },
  ];
  res.render('index', {
    pageTitle: 'Stock Price Predictor',
    message1: `Using machine learning we're going to try and predict tomorrows stock price for a chosen company`,
    message2:
      'All you need to do is enter a valid stock symbol below and wait for about 40 - 50 seconds',
    message3: 'Then you should see a prediction of tomorrows price',
    message4: 'Why not try one of the examples bellow:',
    exampleSymbols: exampleSymbols,
  });
});

// 404 Handling
app.use((req, res) => {
  res.status(404).send({ url: req.originalUrl + ' not found' });
});

// Server Port Controls
const port = process.env.PORT || '8080';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));
