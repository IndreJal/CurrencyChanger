var http = require('http');

//The url we want is: 'www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrencyList?'
var options = {
  host: 'www.lb.lt',
  path: '/webservices/FxRates/FxRates.asmx/getCurrentFxRates?tp=LT'
};

callback = function(response) {
  var str = '';

  //another chunk of data has been received, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been received, so we just print it out here
  response.on('end', function () {
    loadDataToDatabase(str)
    console.log("Loaded!");
  });
}

function loadDataToDatabase(xmlString) {
  var res;
  var parseString = require('xml2js').parseString;
  parseString(xmlString, function (err, result) {  
    res = result['FxRates']['FxRate'];
  });

  var i;
  var currencyArr = [];
  for(i=0; i < res.length; i++) {
    currencyArr.push([res[i].CcyAmt[1].Ccy, res[i].CcyAmt[1].Amt, res[i].Dt]);
  }

  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "ExchangerUser",
    password: "ExchangerUserPassword101"
  });


  con.connect(function(err) {
    if (err) throw err;

    var TRUNCATE_QUERY = "call CurrencyExchange.TruncateData;";
    con.query(TRUNCATE_QUERY, function (err, result){
      if (err) throw err;
    })

    var INSERT_QUERY = "INSERT INTO CurrencyExchange.ExchangeRatesLoader (CurrencyCode, ExchangeRate, CurrencyFixedDate) VALUES ?";
    con.query(INSERT_QUERY, [currencyArr], function (err, result){
      if (err) throw err;
    });

    var UPDATE_QUERY = "call CurrencyExchange.LoadExchangeRates;";
    con.query(UPDATE_QUERY, function (err, result){
      if (err) throw err;
    });
});

}

http.request(options, callback).end();




