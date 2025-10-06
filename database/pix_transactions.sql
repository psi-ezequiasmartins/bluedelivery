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
-- Table structure for table `pix_transactions`
--

CREATE TABLE `pix_transactions` (
  `id` int(11) NOT NULL,
  `orderId` varchar(50) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `txid` varchar(50) NOT NULL,
  `payload` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `pix_transactions`
--

INSERT INTO `pix_transactions` (`id`, `orderId`, `value`, `status`, `txid`, `payload`, `created_at`, `updated_at`) VALUES
(1, '1079', '67.78', 'GENERATED', 'PSI00001079', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540567.785802BR5912PSI-DELIVERY6014BELO HORIZONTE62150511PSI0000107963049401', '2025-04-19 19:26:52', '2025-04-21 23:48:19'),
(3, '1059', '31.90', 'GENERATED', 'PSI00001059', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540531.905802BR5912PSI-DELIVERY6014BELO HORIZONTE62150511PSI000010596304DFFC', '2025-04-19 19:55:56', '2025-04-19 19:55:56'),
(5, '1080', '103.76', 'GENERATED', 'PSI00001080', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com5204000053039865406103.765802BR5912PSI-SOFTWARE6015BELO HORIZONTE 62150511PSI000010806304D2E1', '2025-04-24 16:04:21', '2025-05-01 15:15:30'),
(6, '1081', '65.50', 'GENERATED', 'PSI00001081', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540565.505802BR5912PSI-SOFTWARE6015BELO HORIZONTE 62150511PSI0000108163041D29', '2025-04-25 18:31:19', '2025-04-25 18:31:19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `pix_transactions`
--
ALTER TABLE `pix_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `txid` (`txid`),
  ADD KEY `idx_txid` (`txid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `pix_transactions`
--
ALTER TABLE `pix_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
