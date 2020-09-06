-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: localhost    Database: currencyexchange
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping routines for database 'currencyexchange'
--
/*!50003 DROP PROCEDURE IF EXISTS LoadCurrency */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=root@localhost PROCEDURE LoadCurrency()
BEGIN
	INSERT INTO CurrencyExchange.Currency(CurrencyCode, CurrencyName, CurrencyNameLt)
    SELECT CL.CurrencyCode, CL.CurrencyName, CL.CurrencyNameLt
    FROM CurrencyExchange.CurrencyLoader AS CL
    LEFT JOIN CurrencyExchange.Currency AS C
		ON C.CurrencyCode = CL.CurrencyCode
	WHERE C.CurrencyCode IS NULL;
    
    UPDATE CurrencyExchange.Currency AS C
    INNER JOIN CurrencyExchange.CurrencyLoader AS CL
		ON CL.CurrencyCode = C.CurrencyCode
	SET C.CurrencyName = CL.CurrencyName,
		C.CurrencyNameLt = CL.CurrencyNameLT,
        C.IsACtive = 0
	WHERE C.CurrencyName <> CL.CurrencyName
		OR C.CurrencyNameLt <> CL.CurrencyNameLt;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS LoadExchangeRates */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=root@localhost PROCEDURE LoadExchangeRates()
BEGIN
	DECLARE ExchangeRatesCount INT;
    
	SELECT COUNT(*) 
    INTO ExchangeRatesCount
    FROM CurrencyExchange.ExchangeRatesLoader;
    
	IF ExchangeRatesCount > 0 THEN
		INSERT INTO CurrencyExchange.ExchangeRates (CurrencyIdFrom, CurrencyIdTo, ExchangeRate, CurrencyFixedDate)
        SELECT EUR.CurrencyId AS CurrencyIdFrom, C.CurrencyId AS CurrencyIdTo, L.exchangeRate, L.CurrencyFixedDate
        FROM CurrencyExchange.ExchangeRatesLoader AS L
        INNER JOIN CurrencyExchange.Currency AS C
			ON C.CurrencyCode = L.CurrencyCode
		CROSS JOIN CurrencyExchange.Currency AS EUR
        WHERE EUR.CurrencyCode = 'EUR';
        
        INSERT INTO CurrencyExchange.ExchangeRates (CurrencyIdFrom, CurrencyIdTo, ExchangeRate, CurrencyFixedDate)
        SELECT C.CurrencyId AS CurrencyIdFrom, EUR.CurrencyId AS CurrencyIdTo, 1/L.exchangeRate, L.CurrencyFixedDate
        FROM CurrencyExchange.ExchangeRatesLoader AS L
        INNER JOIN CurrencyExchange.Currency AS C
			ON C.CurrencyCode = L.CurrencyCode
		CROSS JOIN CurrencyExchange.Currency AS EUR
        WHERE EUR.CurrencyCode = 'EUR';
        
        INSERT INTO CurrencyExchange.ExchangeRates (CurrencyIdFrom, CurrencyIdTo, ExchangeRate)
        SELECT C.CurrencyId AS CurrencyIdFrom, C.CurrencyId AS CurrencyIdTo, 1
        FROM CurrencyExchange.ExchangeRatesLoader AS L
        INNER JOIN CurrencyExchange.Currency AS C
			ON C.CurrencyCode = L.CurrencyCode;
            
		INSERT INTO CurrencyExchange.ExchangeRates (CurrencyIdFrom, CurrencyIdTo, ExchangeRate)
        SELECT C.CurrencyId AS CurrencyIdFrom, C.CurrencyId AS CurrencyIdTo, 1
        FROM CurrencyExchange.Currency AS C
		WHERE C.CurrencyCode = 'EUR';
        
        INSERT INTO CurrencyExchange.ExchangeRates (CurrencyIdFrom, CurrencyIdTo, ExchangeRate)
        SELECT ER1.CurrencyIdFrom, ER2.CurrencyIdTo, ER1.ExchangeRate * ER2.ExchangeRate
        FROM CurrencyExchange.ExchangeRates AS ER1
        INNER JOIN CurrencyExchange.ExchangeRates AS ER2
			ON ER2.CurrencyIdFrom = ER1.CurrencyIdTo
		INNER JOIN CurrencyExchange.Currency AS C
			ON C.CurrencyId = ER1.CurrencyIdTo
		WHERE C.CurrencyCode = 'EUR'
        AND ER1.CurrencyIdFrom <> ER2.CurrencyIdTo
        AND ER1.CurrencyIdFrom <> C.CurrencyId
        AND ER2.CurrencyIdTo <> C.CurrencyId;
        
        UPDATE CurrencyExchange.Currency AS C
        SET C.IsActive = 1
        WHERE EXISTS (	SELECT 1
						FROM CurrencyExchange.ExchangeRates AS ER
						WHERE ER.CurrencyIdFrom = C.CurrencyId );
	END IF;

END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS TruncateData */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'STRICT_TRANS_TABLES,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=root@localhost PROCEDURE TruncateData()
BEGIN
	TRUNCATE TABLE CurrencyExchange.ExchangeRatesLoader;
    TRUNCATE TABLE CurrencyExchange.ExchangeRates;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed
