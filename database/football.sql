-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: football
-- ------------------------------------------------------
-- Server version	8.0.17
CREATE DATABASE IF NOT EXISTS  football;

use football;


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
-- Table structure for table `edit`
--

DROP TABLE IF EXISTS `edit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edit` (
  `editid` int(11) AUTO_INCREMENT NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `usid` int(11) DEFAULT NULL,
  `iscorpus` boolean DEFAULT FALSE,
  `settings` json DEFAULT NULL,
  `replace_text` longtext DEFAULT NULL,
  `replace_with` longtext DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`editid`),
  KEY `sid` (`sid`),
  KEY `usid` (`usid`),
  CONSTRAINT `edit_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `match` (`id`) ON DELETE CASCADE ,
  CONSTRAINT `edit_ibfk_3` FOREIGN KEY (`usid`) REFERENCES `unstructured_data` (`usid`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edit`
--

LOCK TABLES `edit` WRITE;
/*!40000 ALTER TABLE `edit` DISABLE KEYS */;
/*!40000 ALTER TABLE `edit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `match`
--

DROP TABLE IF EXISTS `competition`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `competition` (
  `id` int(11) NOT NULL,
  `name` varchar(50) not null,
  `countryName` varchar(50) default null,
  `countryId` int(11) default null,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `competition` WRITE;
/*!40000 ALTER TABLE `competition` DISABLE KEYS */;
/*!40000 ALTER TABLE `competition` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match` (
  `id` int(11) AUTO_INCREMENT NOT NULL,  
  `competitionID` int(11),
  `date` date,
  `home` varchar(100),
  `away` varchar(100),
  `data` json,
  PRIMARY KEY (`id`),
  KEY `competitionID` (`competitionID`),
  CONSTRAINT `competitionID_ibfk_1` FOREIGN KEY (`competitionID`) REFERENCES `competition` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;
--
-- Dumping data for table `match`
--

LOCK TABLES `match` WRITE;
/*!40000 ALTER TABLE `match` DISABLE KEYS */;
/*!40000 ALTER TABLE `match` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `structured data`


--
--
-- Table structure for table `unstructured_data`
--

DROP TABLE IF EXISTS `unstructured_data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unstructured_data` (
  `usid` int(11) AUTO_INCREMENT NOT NULL,
  `matchid` int(11) NOT NULL,
  `title` char(100),
  `author` char(20),
  `url` longtext,
  `published` date,
  `extracted` date,  
  `data` longtext,
  PRIMARY KEY (`usid`),
  KEY `matchid` (`matchid`),
  CONSTRAINT `unstructured_data_ibfk_1` FOREIGN KEY (`matchid`) REFERENCES `match` (`id`)
	ON DELETE CASCADE	
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unstructured_data`
--

LOCK TABLES `unstructured_data` WRITE;
/*!40000 ALTER TABLE `unstructured_data` DISABLE KEYS */;
/*!40000 ALTER TABLE `unstructured_data` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-08-28 22:15:38
drop view  if exists `structured_data`;

CREATE VIEW `structured_data` AS 
SELECT football.match.id,football.match.date,football.match.home,football.match.away,football.match.competitionID,football.competition.name ,football.match.data
FROM football.match 
Inner join football.competition on football.match.competitionID = football.competition.id;

-- Adding data
INSERT INTO `competition` (  `id`, `name`, `countryName`, `countryId` ) VALUES ( 1, "Grand Foo", "Bar", 1 );

INSERT INTO `match` ( `id` , `competitionID`, `date`, `home`, `away` ) VALUES 
	( 1, 1, "1991-04-20", "team A", "team B" ),
    ( 2, 1, "1991-04-21", "team C", "team D" ),
    ( 3, 1, "1991-04-22", "team E", "team F" );
    
SELECT * FROM `match`

