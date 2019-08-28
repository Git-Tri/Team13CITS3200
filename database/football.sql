-- MySQL dump 10.13  Distrib 8.0.17, for Win64 (x86_64)
--
-- Host: localhost    Database: football
-- ------------------------------------------------------
-- Server version	8.0.17

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
  `editid` int(11) NOT NULL,
  `sid` int(11) DEFAULT NULL,
  `usid` int(11) DEFAULT NULL,
  `iscorpus` tinyint(1) DEFAULT NULL,
  `settings` char(1) DEFAULT NULL,
  `replace` longtext,
  `replace_with` longtext,
  PRIMARY KEY (`editid`),
  KEY `sid` (`sid`),
  KEY `usid` (`usid`),
  CONSTRAINT `edit_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `match` (`id`),
  CONSTRAINT `edit_ibfk_2` FOREIGN KEY (`sid`) REFERENCES `structured data` (`sid`),
  CONSTRAINT `edit_ibfk_3` FOREIGN KEY (`usid`) REFERENCES `unstructured data` (`usid`)
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

DROP TABLE IF EXISTS `match`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `match` (
  `id` int(11) NOT NULL,
  `date` date DEFAULT NULL,
  `home` varchar(100) DEFAULT NULL,
  `away` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
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

DROP TABLE IF EXISTS `structured data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `structured data` (
  `sid` int(11) NOT NULL,
  `data` json DEFAULT NULL,
  PRIMARY KEY (`sid`),
  CONSTRAINT `structured data_ibfk_1` FOREIGN KEY (`sid`) REFERENCES `match` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `structured data`
--

LOCK TABLES `structured data` WRITE;
/*!40000 ALTER TABLE `structured data` DISABLE KEYS */;
/*!40000 ALTER TABLE `structured data` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `unstructured data`
--

DROP TABLE IF EXISTS `unstructured data`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `unstructured data` (
  `usid` int(11) NOT NULL,
  `matchid` int(11) DEFAULT NULL,
  `tittle` char(100) DEFAULT NULL,
  `author` char(20) DEFAULT NULL,
  `url` longtext,
  PRIMARY KEY (`usid`),
  KEY `matchid` (`matchid`),
  CONSTRAINT `unstructured data_ibfk_1` FOREIGN KEY (`matchid`) REFERENCES `match` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `unstructured data`
--

LOCK TABLES `unstructured data` WRITE;
/*!40000 ALTER TABLE `unstructured data` DISABLE KEYS */;
/*!40000 ALTER TABLE `unstructured data` ENABLE KEYS */;
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
