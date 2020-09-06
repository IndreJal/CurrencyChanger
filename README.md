# CurrencyChanger
## MySql folder
Folder contains MySQL database tables and procedures creation scripts.
## nodejs folder
1. __exchanger-server__ folder - script to create API from database tables.
2. __load-exchange-rates-data__ - scripts to load Currency list and Exchange rates data from www.lb.lt rest into database tables CurrencyExchange.Currency and CurrencyExchange.ExchangeRates
## React folder
Folder contains react app files.
## To run
1. Create database named CurrencyExchange and run scripts from MySQL folder
2. Load exchange rates data:
* Load currency list __nodejs/load-exchange-rates-data/LoadCurrency.js__ (node LoadCurrency.js)
* Load exchange rates __nodejs/load-exchange-rates-data/LoadExchangeRates.js__ (node LoadExchangeRates.js)
3. Create API by running __nodejs/exchanger-server__/index.js (node index.js)
4. Run react app __react/exchanger__ (npm start)
