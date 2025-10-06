-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Sep 19, 2025 at 08:29 AM
-- Server version: 5.7.40-log
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `deliverybairro`
--

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `USER_ID` int(11) NOT NULL,
  `FIREBASE_UID` varchar(128) DEFAULT NULL,
  `NOME` varchar(60) CHARACTER SET utf8 NOT NULL,
  `SOBRENOME` varchar(60) CHARACTER SET utf8 NOT NULL,
  `TELEFONE` varchar(18) CHARACTER SET utf8 NOT NULL,
  `EMAIL` varchar(100) CHARACTER SET utf8 NOT NULL,
  `SENHA` varchar(100) NOT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8 NOT NULL,
  `CHAVE` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`USER_ID`, `FIREBASE_UID`, `NOME`, `SOBRENOME`, `TELEFONE`, `EMAIL`, `SENHA`, `URL_IMAGEM`, `CHAVE`) VALUES
(100001, 'x1OFq9mZLjWLBYSe37EksjjEzVd2', 'Ezequias', 'Martins', '(31) 98410-7540', 'ezequiasmartins@gmail.com', '*1A030512019B7B4B97167D5515EBB6C7105EB12F', 'https://placeholder.go/300x240', b'1'),
(999999, 'BFyauNcPX8VnspEi3wmXMZF7wGH3', 'Zé ', 'das Couves', '(31) 98410-7540', 'zedascouves@email.com', '*600FE53B55C3FAE8A9FCAB8060125364879C08E3', 'file:///data/user/0/com.deliverybairro.userapp/cache/ImagePicker/0d9d75aa-4a93-402e-b25d-44f24a3f94cc.jpeg', b'1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`USER_ID`),
  ADD UNIQUE KEY `uq_usuarios_firebase_uid` (`FIREBASE_UID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `USER_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000000;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
