-- MySQL dump 10.13  Distrib 5.7.23, for Win32 (AMD64)
--
-- Host: 127.0.0.1    Database: dcardindex
-- ------------------------------------------------------
-- Server version	5.7.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `area_avf`
--

DROP TABLE IF EXISTS `area_avf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `area_avf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `area_avf`
--

LOCK TABLES `area_avf` WRITE;
/*!40000 ALTER TABLE `area_avf` DISABLE KEYS */;
INSERT INTO `area_avf` VALUES (1,'без воспалений'),(2,'воспалена');
/*!40000 ALTER TABLE `area_avf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `d_procedures`
--

DROP TABLE IF EXISTS `d_procedures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `d_procedures` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `d_procedures`
--

LOCK TABLES `d_procedures` WRITE;
/*!40000 ALTER TABLE `d_procedures` DISABLE KEYS */;
INSERT INTO `d_procedures` VALUES (1,'ГД'),(2,'ГДФ');
/*!40000 ALTER TABLE `d_procedures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `devices`
--

DROP TABLE IF EXISTS `devices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `devices` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `devices`
--

LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'2001'),(2,'4001');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialysates`
--

DROP TABLE IF EXISTS `dialysates`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialysates` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialysates`
--

LOCK TABLES `dialysates` WRITE;
/*!40000 ALTER TABLE `dialysates` DISABLE KEYS */;
INSERT INTO `dialysates` VALUES (1,'ст'),(2,'гл'),(3,'са');
/*!40000 ALTER TABLE `dialysates` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialysis_cards`
--

DROP TABLE IF EXISTS `dialysis_cards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialysis_cards` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `date` date NOT NULL,
  `patient_id` int(10) NOT NULL,
  `d_procedure_id` int(10) NOT NULL,
  `device_id` int(10) NOT NULL DEFAULT '1',
  `dry_weight` decimal(5,2) DEFAULT NULL,
  `room` varchar(50) DEFAULT NULL,
  `dialyzer_id` int(10) NOT NULL DEFAULT '1',
  `ktv` decimal(7,2) DEFAULT NULL,
  `v_perf_blood` decimal(7,2) DEFAULT NULL,
  `v_replacement` decimal(7,2) DEFAULT NULL,
  `gd_period_minutes` int(10) DEFAULT NULL,
  `heparin_dose` decimal(7,2) DEFAULT NULL,
  `bolus` decimal(7,2) DEFAULT NULL,
  `inject_speed` decimal(7,2) DEFAULT NULL,
  `vr_heparin_complete` int(10) DEFAULT NULL,
  `dialysate_id` int(10) NOT NULL DEFAULT '1',
  `na` int(10) DEFAULT NULL,
  `bicarbonate` int(10) DEFAULT NULL,
  `stream_dita` int(10) DEFAULT NULL,
  `v_uf` int(10) DEFAULT NULL,
  `sk_k` int(10) DEFAULT NULL,
  `pre_weight` decimal(5,2) DEFAULT NULL,
  `post_weight` decimal(5,2) DEFAULT NULL,
  `pre_ap_up` int(10) DEFAULT NULL,
  `pre_ap_low` int(10) DEFAULT NULL,
  `post_ap_up` int(10) DEFAULT NULL,
  `post_ap_low` int(10) DEFAULT NULL,
  `pre_pulse` int(10) DEFAULT NULL,
  `post_pulse` int(10) DEFAULT NULL,
  `pre_complaint` int(10) NOT NULL DEFAULT '0',
  `pre_state_id` int(10) NOT NULL DEFAULT '1',
  `pre_edema` int(10) NOT NULL DEFAULT '0',
  `pre_breath_changes` int(10) NOT NULL DEFAULT '0',
  `pre_wheeze` int(10) NOT NULL DEFAULT '0',
  `pre_wheeze_local` varchar(255) DEFAULT NULL,
  `pre_heart_rhythm_id` int(10) NOT NULL DEFAULT '1',
  `pre_stomach_soft_id` int(10) NOT NULL DEFAULT '1',
  `pre_stomach_pain_id` int(10) NOT NULL DEFAULT '1',
  `pre_stomach_pain_local` varchar(255) DEFAULT NULL,
  `pre_area_avf_id` int(10) NOT NULL DEFAULT '1',
  `pre_noise_avf_id` int(10) NOT NULL DEFAULT '1',
  `pre_additions` text,
  `pre_glucose` decimal(7,2) DEFAULT NULL,
  `post_glucose` decimal(7,2) DEFAULT NULL,
  `body_temp` decimal(5,2) DEFAULT NULL,
  `electrolyte_ca` decimal(7,2) DEFAULT NULL,
  `electrolyte_k` decimal(7,2) DEFAULT NULL,
  `electrolyte_na` decimal(7,2) DEFAULT NULL,
  `ekg` varchar(255) DEFAULT NULL,
  `epoetin_alfa` int(10) DEFAULT NULL,
  `epoetin_beta` int(10) DEFAULT NULL,
  `aranesp` int(10) DEFAULT NULL,
  `mircera` int(10) DEFAULT NULL,
  `post_injection_id` int(10) NOT NULL DEFAULT '1',
  `ferrum_dextran` int(10) DEFAULT NULL,
  `ferrum_sacch` int(10) DEFAULT NULL,
  `vit_b` int(10) NOT NULL DEFAULT '0',
  `vit_c` int(10) DEFAULT NULL,
  `post_complaint` int(10) NOT NULL DEFAULT '0',
  `post_state_id` int(10) NOT NULL DEFAULT '1',
  `post_gd_difficulties` int(10) NOT NULL DEFAULT '0',
  `post_change_required` int(10) NOT NULL DEFAULT '0',
  `post_additions` text,
  `changelog` text NOT NULL,
  `deleted` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialysis_cards`
--

LOCK TABLES `dialysis_cards` WRITE;
/*!40000 ALTER TABLE `dialysis_cards` DISABLE KEYS */;
/*!40000 ALTER TABLE `dialysis_cards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `dialyzers`
--

DROP TABLE IF EXISTS `dialyzers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `dialyzers` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `dialyzers`
--

LOCK TABLES `dialyzers` WRITE;
/*!40000 ALTER TABLE `dialyzers` DISABLE KEYS */;
INSERT INTO `dialyzers` VALUES (1,'Fx 60'),(2,'Fx 80'),(3,'Fx 100');
/*!40000 ALTER TABLE `dialyzers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `heart_rhythm`
--

DROP TABLE IF EXISTS `heart_rhythm`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `heart_rhythm` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `heart_rhythm`
--

LOCK TABLES `heart_rhythm` WRITE;
/*!40000 ALTER TABLE `heart_rhythm` DISABLE KEYS */;
INSERT INTO `heart_rhythm` VALUES (1,'ритмичные'),(2,'аритмичные');
/*!40000 ALTER TABLE `heart_rhythm` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `injection_types`
--

DROP TABLE IF EXISTS `injection_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `injection_types` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `injection_types`
--

LOCK TABLES `injection_types` WRITE;
/*!40000 ALTER TABLE `injection_types` DISABLE KEYS */;
INSERT INTO `injection_types` VALUES (1,'подкожно'),(2,'внутривенно');
/*!40000 ALTER TABLE `injection_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `noise_avf`
--

DROP TABLE IF EXISTS `noise_avf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `noise_avf` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `noise_avf`
--

LOCK TABLES `noise_avf` WRITE;
/*!40000 ALTER TABLE `noise_avf` DISABLE KEYS */;
INSERT INTO `noise_avf` VALUES (1,'удовлетворительное'),(2,'ослабленное'),(3,'не выслушивается');
/*!40000 ALTER TABLE `noise_avf` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient_state`
--

DROP TABLE IF EXISTS `patient_state`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patient_state` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient_state`
--

LOCK TABLES `patient_state` WRITE;
/*!40000 ALTER TABLE `patient_state` DISABLE KEYS */;
INSERT INTO `patient_state` VALUES (1,'удовлетворительное'),(2,'относительно удовлетворительное'),(3,'средней тяжести'),(4,'тяжелое');
/*!40000 ALTER TABLE `patient_state` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patients`
--

DROP TABLE IF EXISTS `patients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `patients` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fio` varchar(255) NOT NULL,
  `ambulance_num` varchar(50) DEFAULT NULL,
  `birthdate` date DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `deleted` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patients`
--

LOCK TABLES `patients` WRITE;
/*!40000 ALTER TABLE `patients` DISABLE KEYS */;
/*!40000 ALTER TABLE `patients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stomach_pain`
--

DROP TABLE IF EXISTS `stomach_pain`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stomach_pain` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stomach_pain`
--

LOCK TABLES `stomach_pain` WRITE;
/*!40000 ALTER TABLE `stomach_pain` DISABLE KEYS */;
INSERT INTO `stomach_pain` VALUES (1,'безболезненный'),(2,'болезненный');
/*!40000 ALTER TABLE `stomach_pain` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stomach_soft`
--

DROP TABLE IF EXISTS `stomach_soft`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stomach_soft` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stomach_soft`
--

LOCK TABLES `stomach_soft` WRITE;
/*!40000 ALTER TABLE `stomach_soft` DISABLE KEYS */;
INSERT INTO `stomach_soft` VALUES (1,'мягкий'),(2,'твердый');
/*!40000 ALTER TABLE `stomach_soft` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fio` varchar(255) NOT NULL,
  `login` varchar(50) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `role` int(10) unsigned NOT NULL DEFAULT '1',
  `locked` int(10) unsigned NOT NULL DEFAULT '0',
  `first_login` int(10) unsigned NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `login_UNIQUE` (`login`)
) ENGINE=MyISAM DEFAULT CHARSET=cp1251;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-10-10 20:49:17
