  var mysql = require('mysql');

  var con = mysql.createConnection({
    host: "localhost",
    user: "ExchangerUser",
    password: "ExchangerUserPassword101"
  });

  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    var sql = "call CurrencyExchange.TruncateData";

    con.query(sql, function (err, result){
      if (err) throw err;
    });
  });





