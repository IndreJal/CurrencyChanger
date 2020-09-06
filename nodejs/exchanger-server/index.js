const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const app = express();

const SELECT_CURRENCY_QUERY = 'SELECT CurrencyId, CurrencyCode FROM CurrencyExchange.Currency WHERE IsActive = 1';
const SELECT_RATES_QUERY = 'SELECT CurrencyIdFrom, CurrencyIdTo, ExchangeRate FROM CurrencyExchange.ExchangeRates';
const SELECT_LOGS_QUERY = 'SELECT * FROM CurrencyExchange.UsageLog';

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ExchangerUser',
    password: 'ExchangerUserPassword101',
    database: 'CurrencyExchange'
});


connection.connect(err => {
    if(err){
        return err;
    }
});

app.use(cors());

app.get('/', (req, res) => {
    res.send('go to /curencies to see currencies')
});

app.get('/currencies', (req, res) => {
    connection.query(SELECT_CURRENCY_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/currencies/get', (req, res) => {
    const {CurrencyCode} = req.query;
    const GET_CURRENCYID_QUERY = `SELECT CurrencyId, CurrencyCode FROM CurrencyExchange.Currency WHERE CurrencyCode = "${CurrencyCode}"`;

    connection.query(GET_CURRENCYID_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/exchangeRates/get', (req, res) => {
    const {CurrencyFrom, CurrencyTo} = req.query;
    const GET_EXCHANGERATE_QUERY = `SELECT ExchangeRate FROM CurrencyExchange.ExchangeRates WHERE CurrencyIdFrom = ${CurrencyFrom} AND CurrencyIdTo = ${CurrencyTo}`;

    connection.query(GET_EXCHANGERATE_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/exchangeRates', (req, res) => {
    connection.query(SELECT_LOGS_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});


app.get('/logs', (req, res) => {
    connection.query(SELECT_LOGS_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.get('/logs/log', (req, res) => {
    const {AmountToConvert, AmountConverted, CurrencyIdFrom, CurrencyIdTo, ExchangeRate} = req.query;
    const INSERT_LOG_QUERY = `INSERT INTO CurrencyExchange.UsageLog (AmountToConvert, AmountConverted, CurrencyIdFrom, CurrencyIdTo, ExchangeRate) VALUES (${AmountToConvert}, ${AmountConverted}, '${CurrencyIdFrom}', '${CurrencyIdTo}', ${ExchangeRate})`;

    connection.query(INSERT_LOG_QUERY, (err, results) => {
        if(err) {
            return res.send(err);
        }
        else {
            return res.json({
                data: results
            })
        }
    });
});

app.listen(4000, () => {
    console.log('exchanger servers listening on 4000')
});