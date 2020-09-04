const express = require('express');
const cors = require('cors');
const mysql = require('mysql');

const app = express();

const SELECT_CURRENCY_QUERY = 'SELECT CurrencyId, CurrencyCode FROM CurrencyExchange.Currency WHERE IsActive = 1';
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
    res.send('go to /curenciejkjks to see currencies')
});

app.get('/currencies', (req, res) => {
    connection.query(SELECT_CURRENCY_QUERY, (err, results) => {
        if(err) {
            return err;
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