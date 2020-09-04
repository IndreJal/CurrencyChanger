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
    //console.log(str);
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
    console.log("CurrencyCode: " + res[i].CcyAmt[1].Ccy);
    console.log("ExchangeRate: " + res[i].CcyAmt[1].Amt);
    console.log("FixedDate: " + res[i].Dt);
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
    console.log("Connected!");
    var sql = "INSERT INTO CurrencyExchange.ExchangeRatesLoader (CurrencyCode, ExchangeRate, CurrencyFixedDate) VALUES ?";
    
    con.query(sql, [currencyArr], function (err, result){
      if (err) throw err;
      //console.log(result);
    })

    con.query("call CurrencyExchange.LoadExchangeRates;", function (err, result){
      if (err) throw err;
      //console.log(result);
    });
});

}

http.request(options, callback).end();




