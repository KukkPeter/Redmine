-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 17, 2024 at 12:13 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `team_3_redmine`
--
CREATE DATABASE IF NOT EXISTS `team_3_redmine` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `team_3_redmine`;

-- --------------------------------------------------------

--
-- Table structure for table `developers`
--

CREATE TABLE `developers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `developers`:
--

--
-- Dumping data for table `developers`
--

INSERT INTO `developers` (`id`, `name`, `email`, `createdAt`, `updatedAt`) VALUES
(1, 'Fejleszt Elek', 'fejleszt@elek.hu', '2024-04-12 21:10:14', '2024-04-12 21:10:14'),
(2, 'Fejleszt János', 'fejleszt@janos.hu', '2024-04-12 21:10:14', '2024-04-12 21:10:14'),
(3, 'Fejleszt Gergely', 'fejleszt@gergely.hu', '2024-04-12 21:10:14', '2024-04-12 21:10:14'),
(4, 'Fejleszt Tamás', 'fejleszt@tamas.hu', '2024-04-12 21:10:14', '2024-04-12 21:10:14'),
(5, 'Fejleszt Péter', 'fejleszt@peter.hu', '2024-04-12 21:10:14', '2024-04-12 21:10:14'),
(6, 'Fejleszt Ödön', 'fejleszt@odon.hu', '2024-04-12 19:54:26', '2024-04-12 19:54:26');

-- --------------------------------------------------------

--
-- Table structure for table `managers`
--

CREATE TABLE `managers` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `managers`:
--

--
-- Dumping data for table `managers`
--

INSERT INTO `managers` (`id`, `name`, `email`, `password`, `createdAt`, `updatedAt`) VALUES
(1, 'Teszt Elek', 'teszt@elek.hu', '$2b$10$OwN8bCbjYQi45eih/6e9h.mIb1DMd78mEBXkdYziPVbLSP7fyV3ky', '2024-04-12 21:08:55', '2024-04-12 21:08:55'),
(2, 'Teszt Tamás', 'teszt@tamas.hu', '$2b$10$bCebFpysNMgCuLjnNHILw.1SIfEfEHY1xFULYsFaDasufB8QSYrwW', '2024-04-12 21:08:55', '2024-04-12 21:08:55'),
(3, 'Teszt Béla', 'teszt@bela.hu', '$2b$10$PklOPXnOyW4sG2TOFfasBuHNX81p.B5xkqhbJyqHJo3xBQzT0XeLG', '2024-04-12 21:08:55', '2024-04-12 21:08:55');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `type_id` int(11) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `projects`:
--   `type_id`
--       `project_types` -> `id`
--

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `type_id`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Mikrokontroller', 1, 'Szoftveres cucc a kormányműhöz. Nem microsoftos.', '2024-04-12 21:12:51', '2024-04-12 21:12:51'),
(2, 'Kormánymű', 2, 'Mechanikus cucc. Kocsikban használják. Steer-by-wire.', '2024-04-12 21:12:51', '2024-04-12 21:12:51'),
(3, 'Prímszám generátor', 3, 'Prímszámokat kéne generálni programokkal.', '2024-04-12 21:25:50', '2024-04-12 21:25:50'),
(4, 'Atomi részecskék programozása', 4, 'Durva cucc. Nem tudom mit jelent, de biztosan igen.', '2024-04-12 21:26:55', '2024-04-12 21:26:55'),
(5, 'Automatikus hátvakarás', 5, 'Szenzorok és programok alapján tudja majd hogy mikor kell vakarni. Igen, illogikus.', '2024-04-12 21:27:34', '2024-04-12 21:27:34');

-- --------------------------------------------------------

--
-- Table structure for table `project_developers`
--

CREATE TABLE `project_developers` (
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `developerId` int(11) NOT NULL,
  `projectId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `project_developers`:
--   `developerId`
--       `developers` -> `id`
--   `projectId`
--       `projects` -> `id`
--

--
-- Dumping data for table `project_developers`
--

INSERT INTO `project_developers` (`createdAt`, `updatedAt`, `developerId`, `projectId`) VALUES
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 1, 1),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 1, 2),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 1, 4),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 2, 2),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 2, 5),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 3, 2),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 3, 3),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 3, 4),
('2024-04-12 21:58:23', '2024-04-12 21:58:23', 4, 1),
('2024-04-12 21:58:23', '2024-04-12 21:58:23', 4, 3),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 4, 5),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 5, 5),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 6, 1),
('2024-04-12 21:56:54', '2024-04-12 21:56:54', 6, 4);

-- --------------------------------------------------------

--
-- Table structure for table `project_types`
--

CREATE TABLE `project_types` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `project_types`:
--

--
-- Dumping data for table `project_types`
--

INSERT INTO `project_types` (`id`, `name`, `createdAt`, `updatedAt`) VALUES
(1, 'Szoftveres', '2024-04-12 21:11:43', '2024-04-12 21:11:43'),
(2, 'Hardveres', '2024-04-12 21:11:43', '2024-04-12 21:11:43'),
(3, 'Logikai', '2024-04-12 21:11:43', '2024-04-12 21:11:43'),
(4, 'Kvantum szintű', '2024-04-12 21:11:43', '2024-04-12 21:11:43'),
(5, 'Illogikus', '2024-04-12 21:11:43', '2024-04-12 21:11:43');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `project_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `deadline` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- RELATIONSHIPS FOR TABLE `tasks`:
--   `project_id`
--       `projects` -> `id`
--   `user_id`
--       `managers` -> `id`
--

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `description`, `project_id`, `user_id`, `deadline`, `createdAt`, `updatedAt`) VALUES
(1, 'Atomi részecskek süritése', 'Sűrűbb legyen a részecskék elhelyezkedése', 4, 2, '1713341027000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(2, 'Atomi részecskek programozasa', 'Szinkronban tudjanak mozogni', 4, 2, '1716192227000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(3, 'Kormánymű tesztelése', 'Tesztesetek készítése', 2, 3, '1713600227000', '2024-03-27 21:29:34', '2024-04-03 21:27:34'),
(4, 'Mikrokontroller alap szoftver', 'A szoftver legyen fejlesztő képes', 1, 3, '1713168227000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(5, 'Kormánymű részletes áttekintése', 'Logfile-ok generálása ', 2, 3, '1710925427000', '2024-03-29 21:29:34', '2024-04-05 21:27:34'),
(6, 'Mikrokontroller kész szoftver', 'A szoftver legyen tesztre kész', 1, 1, '1712736227000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(7, 'Prímszámok elemzése', 'Részletesen egyeztetni az alkalmazottak között, hogy mi számít ténylegesen prímszámnak.', 3, 1, '1713513827000', '2024-03-28 12:27:31', '2024-04-03 11:11:34'),
(8, 'Hátvakaró 3D-s megtervezése', 'Legyen minnél kompaktabb és újrahasznosított anyagokból készüljön', 5, 1, '1713859427000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(9, 'Hátvakaró 3D nyomtatása', 'Nyomtatás, tesztelés', 5, 2, '1713513827000', '2024-04-12 21:27:34', '2024-04-12 21:27:34'),
(10, 'Prím generáló algoritmus készítése', 'generatePrimeNumber() metódus megírása', 3, 2, '1712736227000', '2024-03-30 10:27:31', '2024-04-06 06:01:34');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `developers`
--
ALTER TABLE `developers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `managers`
--
ALTER TABLE `managers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Indexes for table `project_developers`
--
ALTER TABLE `project_developers`
  ADD PRIMARY KEY (`developerId`,`projectId`),
  ADD KEY `projectId` (`projectId`);

--
-- Indexes for table `project_types`
--
ALTER TABLE `project_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `developers`
--
ALTER TABLE `developers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `managers`
--
ALTER TABLE `managers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `project_types`
--
ALTER TABLE `project_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `project_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `project_developers`
--
ALTER TABLE `project_developers`
  ADD CONSTRAINT `project_developers_ibfk_1` FOREIGN KEY (`developerId`) REFERENCES `developers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `project_developers_ibfk_2` FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `managers` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
