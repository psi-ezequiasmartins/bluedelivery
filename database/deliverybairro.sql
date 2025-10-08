-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Oct 04, 2025 at 04:41 PM
-- Server version: 8.0.36
-- PHP Version: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bluedelivery`
--

-- --------------------------------------------------------

--
-- Table structure for table `categorias`
--

CREATE TABLE `categorias` (
  `CATEGORIA_ID` int NOT NULL,
  `CATEGORIA_NOME` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ORDEM` tinyint DEFAULT NULL,
  `CHV` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `categorias`
--

INSERT INTO `categorias` (`CATEGORIA_ID`, `CATEGORIA_NOME`, `URL_IMAGEM`, `ORDEM`, `CHV`) VALUES
(101, 'OFERTAS', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fofertas.jpg?alt=media&token=09be1bc9-e1e6-4bfd-96bc-7ddde99f6ca8', 1, '1'),
(102, 'SANDUICHES', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fsanduiches.jpg?alt=media&token=6d5ec164-14f1-4155-b811-68c06817dcf9', 2, '1'),
(103, 'HOTDOGS', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fhotdogs.jpg?alt=media&token=3b5e2cfb-6c14-473e-839c-77d7f2bbc603', 3, '1'),
(104, 'BEBIDAS', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fbebidas.jpg?alt=media&token=483261bf-e614-4595-be00-f28960b76b08', 4, '1'),
(105, 'PRATOS & PORÇÕES', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fpratos-e-porcoes.jpg?alt=media&token=5674c103-599a-4d25-b2ae-67112421d727', 5, '1'),
(106, 'SUSHI', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fsushi.jpg?alt=media&token=2714e481-e100-4032-aca3-5507cdabab10', 6, '1'),
(107, 'FRUTAS & VERDURAS', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Ffrutas-e-verduras.jpg?alt=media&token=96b9fc23-3d36-4a54-be07-efe3c1de0577', 7, '1'),
(108, 'MEDICAMENTOS', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Ffarmarcias-e-drograrias.jpg?alt=media&token=9980f634-d422-4584-a145-c72f13a7e5af', 8, '0'),
(109, 'GÁS DE COZINHA', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fgas-de-cozinha.jpg?alt=media&token=30cc52d5-2aed-4793-afd9-3285b85d733f', 9, '1'),
(110, 'FLORICULTURA', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Ffloricultura.jpg?alt=media&token=25adf89e-4424-4d1e-b936-5b7101f4c8e8', 10, '0'),
(111, 'ÁGUA MINERAL', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fagua-mineral.jpg?alt=media&token=54dae688-bde6-4bd4-9203-cb9b13bbeea6', 11, '1'),
(112, 'MERCADO', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/categorias%2Fsupermercado.jpg?alt=media&token=ae6f286a-8eec-4f67-87c8-9e4a3051882d', 12, '0');

-- --------------------------------------------------------

--
-- Table structure for table `couriers`
--

CREATE TABLE `couriers` (
  `COURIER_ID` int NOT NULL,
  `NOME` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `SOBRENOME` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CPF` varchar(14) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `TELEFONE` varchar(18) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `EMAIL` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ENDERECO` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `NUMERO` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `COMPLEMENTO` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `BAIRRO` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CIDADE` varchar(35) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `UF` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CEP` varchar(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `TRANSPORTE` enum('DRIVING','BICYCLING') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CHV` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `couriers`
--

INSERT INTO `couriers` (`COURIER_ID`, `NOME`, `SOBRENOME`, `CPF`, `TELEFONE`, `EMAIL`, `ENDERECO`, `NUMERO`, `COMPLEMENTO`, `BAIRRO`, `CIDADE`, `UF`, `CEP`, `TRANSPORTE`, `URL_IMAGEM`, `CHV`) VALUES
(200001, 'Zé das Couves', '', '732.093.416-72', '+55 31 98410-7540', '', 'Rua dos Comanches', '870', 'Apto 302', 'Santa Mônica', 'Belo Horizonte', 'MG', '31530-250', 'DRIVING', 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/couriers%2Fzedascouves.png?alt=media&token=efd215ba-70ae-450b-8aa0-7b978c56559e', '');

-- --------------------------------------------------------

--
-- Table structure for table `deliveries`
--

CREATE TABLE `deliveries` (
  `DELIVERY_ID` int NOT NULL,
  `DELIVERY_NOME` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `PLANO` enum('FREE','BASIC','PRO','PREMIUM') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT 'FREE',
  `CATEGORIA_ID` int DEFAULT NULL,
  `RESPONSAVEL` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `EMAIL` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `TELEFONE` varchar(18) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `HORARIO` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `MIN_DELIVERY_TIME` int DEFAULT NULL,
  `MAX_DELIVERY_TIME` int DEFAULT NULL,
  `TAXA_ENTREGA` float DEFAULT NULL,
  `RATING` float DEFAULT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CEP` varchar(9) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ENDERECO` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NUMERO` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `COMPLEMENTO` varchar(30) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `BAIRRO` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CIDADE` varchar(35) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `UF` varchar(2) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `CHV` varchar(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `deliveries`
--

INSERT INTO `deliveries` (`DELIVERY_ID`, `DELIVERY_NOME`, `PLANO`, `CATEGORIA_ID`, `RESPONSAVEL`, `EMAIL`, `TELEFONE`, `HORARIO`, `MIN_DELIVERY_TIME`, `MAX_DELIVERY_TIME`, `TAXA_ENTREGA`, `RATING`, `URL_IMAGEM`, `CEP`, `ENDERECO`, `NUMERO`, `COMPLEMENTO`, `BAIRRO`, `CIDADE`, `UF`, `CHV`) VALUES
(1001, 'Cantin d\'Minas Delivery', 'PRO', 105, 'José Antônio de Oliveira e Cida', 'joseantoniodeoliveira71@gmail.com', '+55 31 98775-9781', 'Aberto das 9h até às 19h de Segunda a Sábado', 15, 30, 4.5, 4.9, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/deliverys%2Fcantindminasdelivery.jpg?alt=media&token=a6259473-4eb1-4f0e-98ce-251b151bab9f', '', 'Rua Antônio Junqueira Júnior, 77 Santa Mônica, Belo Horizonte, MG, 31530-390', '', '', '', '', '', '1'),
(1002, 'Sanduba do Zé', 'PREMIUM', 102, 'Zé das Couves', 'zedascouves@email.com', '+55 31 98410-7540', 'Aberto todos os dias a partir das 19h exceto às segundas feiras (fechado)', 15, 45, 4, 3.5, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/deliverys%2Fsandubadoze.jpg?alt=media&token=3bac7899-904e-4acd-aac8-75506a1d6819', '31525-365', 'Rua Érico Veríssimo', '2267', 'Loja B', 'Santa Mônica', 'Belo Horizonte', 'MG', '1'),
(1003, 'Hotdog da Maria', 'PRO', 103, 'Maria das Graças ', 'mariadg@email.com', '+55 31 9999-9999', 'Aberto a partir das 19h', 15, 30, 3.5, 4.7, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/deliverys%2Fhotdogdamaria.jpg?alt=media&token=93d46c8d-abe3-4008-aa2d-c9a81a6c23fb', '', 'Rua dos Bororós, 629 Santa Mônica, Belo Horizonte, MG, ', '', '', '', '', '', '1'),
(1004, 'Distribuidora Guarani', 'PRO', 104, 'José Carlos dos Santos', 'josecarlosdossantos@gmail.com', '+55 31 98651-1043', 'Aberto das 9 às 19hs, de segunda a sábado', 15, 30, 3.9, 3.9, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/deliverys%2Fdistribuidoraguarani.jpg?alt=media&token=4ed12a92-f1cb-4d28-a7fe-3a4317a8063e', '', 'Rua Jornalista Laércio Campos, 97 Lj A Guarani, Belo Horizonte, MG, 31814-390', '', '', '', '', '', '1'),
(1005, 'Espetinhos da Dinda', 'PRO', NULL, 'Cláudio Silva', 'espetinhosdadinda@gmail.com', NULL, 'Terça a Domingo, das 19h às 23h', NULL, NULL, NULL, NULL, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fespetinhos-da-dinha.jpg?alt=media&token=5cc3520b-dbef-41d3-825f-77e50c216e82', '31160-190', 'Rua Jacuí ', '3930', 'Loja B', 'Ipiranga', 'Belo Horizonte', 'MG', '1'),
(1007, 'Churrascaria do Boi', 'FREE', 1, '', 'churrascariadoboi@gmail.com', '', '', 0, 0, 0, 0, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fchurrascaria-do-boi.jpg?alt=media&token=806e896b-fb0b-48cf-ad00-6c636b5a583a', '', '', '', '', '', '', '', '1');

-- --------------------------------------------------------

--
-- Table structure for table `extras`
--

CREATE TABLE `extras` (
  `EXTRA_ID` int NOT NULL,
  `DESCRICAO` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `VR_UNITARIO` float(9,2) NOT NULL,
  `DELIVERY_ID` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `extras`
--

INSERT INTO `extras` (`EXTRA_ID`, `DESCRICAO`, `VR_UNITARIO`, `DELIVERY_ID`) VALUES
(1, 'Carne Hamburger artezanal 120g', 2.50, 1002),
(2, 'Bacon Fatiado 50g', 3.50, 1002),
(3, 'Ovo (unidade)', 1.00, 1002),
(4, 'Mussarela', 1.50, 1002),
(5, 'Salada Americana', 1.00, 1002),
(6, 'Molho Especial 50g', 2.00, 1002),
(7, 'Molho Barbecue 50g', 3.00, 1002),
(8, 'Porção de farofa temperada c/ bacon', 4.99, 1005),
(9, 'Porção de Vinagrete c/ tomate, pimentão verde e cebola roxa', 4.99, 1005),
(11, 'Molho especial (maionese, mostarda c/ mel e cebola agridoce)', 7.99, 1005),
(13, 'Queijo mussarela + bacon', 4.99, 1005),
(14, 'Batata Palha', 0.50, 1003),
(15, 'Queijo tipo \"Requeijão Catupery\"', 1.50, 1003),
(16, 'Bacon fatiado', 1.50, 1003),
(17, 'Salada Americana (Alface Crespa, Tomate e Cebola Roxa)', 1.00, 1003),
(18, 'Molho Especial (Maionese, Alho, Salsa e Condimentos especiais)', 1.20, 1003);

-- --------------------------------------------------------

--
-- Table structure for table `itens`
--

CREATE TABLE `itens` (
  `ITEM_ID` int NOT NULL,
  `PEDIDO_ID` int NOT NULL,
  `PRODUTO_ID` int NOT NULL,
  `ACRESCIMOS` json DEFAULT NULL,
  `OBS` varchar(300) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `QTD` float(9,2) DEFAULT NULL,
  `VR_UNITARIO` float(9,2) DEFAULT NULL,
  `VR_ACRESCIMOS` float(9,2) DEFAULT NULL,
  `TOTAL` float(9,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `itens`
--

INSERT INTO `itens` (`ITEM_ID`, `PEDIDO_ID`, `PRODUTO_ID`, `ACRESCIMOS`, `OBS`, `QTD`, `VR_UNITARIO`, `VR_ACRESCIMOS`, `TOTAL`) VALUES
(68, 1051, 1017, '[{\"DESCRICAO\": \"Mussarela\", \"VR_UNITARIO\": 1.5}, {\"DESCRICAO\": \"Salada Americana\", \"VR_UNITARIO\": 1}]', 'sendo um sem tomate', 2.00, 33.90, 2.50, 72.80),
(69, 1052, 1018, '[{\"DESCRICAO\": \"Molho Barbecue 50g\", \"VR_UNITARIO\": 3}]', '', 2.00, 24.90, 3.00, 55.80),
(70, 1052, 1025, '[]', '', 2.00, 4.99, 0.00, 9.98),
(71, 1053, 1017, '[{\"DESCRICAO\": \"Ovo (unidade)\", \"VR_UNITARIO\": 1}, {\"DESCRICAO\": \"Molho Barbecue 50g\", \"VR_UNITARIO\": 3}]', 'Sem batata palha', 2.00, 33.90, 4.00, 75.80),
(72, 1053, 1025, '[]', '', 2.00, 4.99, 0.00, 9.98),
(73, 1054, 1018, '[{\"DESCRICAO\": \"Salada Americana\", \"VR_UNITARIO\": 1}]', '', 3.00, 24.90, 1.00, 76.70),
(74, 1054, 1048, '[]', '', 2.00, 4.99, 0.00, 9.98),
(75, 1055, 1018, '[{\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}, {\"DESCRICAO\": \"Ovo (unidade)\", \"VR_UNITARIO\": 1}]', 'Sem alface', 2.00, 24.90, 3.00, 55.80),
(76, 1055, 1025, '[]', '', 1.00, 4.99, 0.00, 4.99),
(84, 1059, 1018, '[{\"DESCRICAO\": \"Salada Americana\", \"VR_UNITARIO\": 1}, {\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}]', 'Sem tomate', 1.00, 24.90, 3.00, 27.90),
(90, 1079, 1018, '[{\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}]', 'Sem batata palha ', 2.00, 24.90, 2.00, 53.80),
(91, 1079, 1025, '[]', '', 1.00, 4.99, 0.00, 4.99),
(92, 1079, 1048, '[]', '', 1.00, 4.99, 0.00, 4.99),
(93, 1080, 1035, '[]', '', 4.00, 7.99, 0.00, 31.96),
(94, 1080, 1017, '[]', '', 2.00, 33.90, 0.00, 67.80),
(101, 1081, 1053, '[]', '', 1.00, 4.50, 0.00, 4.50),
(102, 1081, 1024, '[]', 'Sem batata palha por favor ', 1.00, 31.00, 0.00, 31.00),
(103, 1081, 1023, '[]', '', 1.00, 28.00, 0.00, 28.00),
(104, 1081, 1054, '[]', '', 1.00, 4.50, 0.00, 4.50),
(105, 1082, 1020, '[{\"DESCRICAO\": \"Carne Hamburger artezanal 120g\", \"VR_UNITARIO\": 2.5}, {\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}, {\"DESCRICAO\": \"Salada Americana\", \"VR_UNITARIO\": 1}]', '', 2.00, NULL, 5.50, 62.20),
(106, 1082, 1025, '[]', '', 1.00, NULL, 0.00, 4.80),
(107, 1083, 1020, '[{\"DESCRICAO\": \"Carne Hamburger artezanal 120g\", \"VR_UNITARIO\": 2.5}, {\"DESCRICAO\": \"Salada Americana\", \"VR_UNITARIO\": 1}, {\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}]', '', 1.00, NULL, 5.50, 31.10),
(108, 1084, 1070, '[{\"DESCRICAO\": \"Molho Especial 50g\", \"VR_UNITARIO\": 2}, {\"DESCRICAO\": \"Molho Barbecue 50g\", \"VR_UNITARIO\": 3}]', '', 1.00, NULL, 5.00, 40.00),
(109, 1084, 1069, '[]', '', 1.00, NULL, 0.00, 7.99),
(110, 1085, 1018, '[{\"DESCRICAO\": \"Molho Barbecue 50g\", \"VR_UNITARIO\": 3}]', 'O mesmo molho para ambos itens, porém um sem batata palha por favor ', 2.00, NULL, 3.00, 55.80),
(111, 1085, 1025, '[]', '', 2.00, NULL, 0.00, 9.60),
(112, 1086, 1022, '[]', '', 2.00, NULL, 0.00, 29.00),
(113, 1086, 1053, '[]', '', 1.00, NULL, 0.00, 4.50),
(114, 1086, 1054, '[]', '', 1.00, NULL, 0.00, 4.50),
(115, 1087, 1022, '[{\"EXTRA_ID\": 14, \"DESCRICAO\": \"Batata Palha\", \"DELIVERY_ID\": 1003, \"VR_UNITARIO\": 0.5}, {\"EXTRA_ID\": 15, \"DESCRICAO\": \"Queijo tipo \\\"Requeijão Catupery\\\"\", \"DELIVERY_ID\": 1003, \"VR_UNITARIO\": 1.5}, {\"EXTRA_ID\": 18, \"DESCRICAO\": \"Molho Especial (Maionese, Alho, Salsa e Condimentos especiais)\", \"DELIVERY_ID\": 1003, \"VR_UNITARIO\": 1.2}]', '', 2.00, 14.50, 3.20, 35.40),
(116, 1087, 1053, '[]', '', 2.00, 4.50, 0.00, 9.00);

-- --------------------------------------------------------

--
-- Table structure for table `pedidos`
--

CREATE TABLE `pedidos` (
  `PEDIDO_ID` int NOT NULL,
  `DELIVERY_ID` int DEFAULT NULL,
  `USER_ID` int DEFAULT NULL,
  `DATA` datetime DEFAULT NULL,
  `ENDERECO_ENTREGA` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `LATITUDE` decimal(11,8) NOT NULL,
  `LONGITUDE` decimal(11,8) NOT NULL,
  `VR_SUBTOTAL` float(9,2) DEFAULT NULL,
  `TAXA_ENTREGA` float(9,2) DEFAULT NULL,
  `VR_TOTAL` float(9,2) DEFAULT NULL,
  `STATUS` enum('NOVO','AGUARDANDO','PREPARANDO','PRONTO_PARA_RETIRADA','SAIU_PARA_ENTREGA','ENTREGUE','PGTO_PENDENTE','PGTO_OK','FINALIZADO','CANCELADO') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `PUSH_TOKEN` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pedidos`
--

INSERT INTO `pedidos` (`PEDIDO_ID`, `DELIVERY_ID`, `USER_ID`, `DATA`, `ENDERECO_ENTREGA`, `LATITUDE`, `LONGITUDE`, `VR_SUBTOTAL`, `TAXA_ENTREGA`, `VR_TOTAL`, `STATUS`, `PUSH_TOKEN`) VALUES
(1051, 1002, 100001, '2025-03-20 18:42:05', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250  ', -19.82724000, -43.98316000, 72.80, 4.00, 76.80, 'FINALIZADO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1052, 1002, 100001, '2025-03-20 18:59:01', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250 ', -19.82724000, -43.98316000, 65.78, 4.00, 69.78, 'FINALIZADO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1053, 1002, 100001, '2025-03-20 21:37:15', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250 ', -19.82724000, -43.98316000, 85.78, 4.00, 89.78, 'PGTO_PENDENTE', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1054, 1002, 100001, '2025-03-20 22:34:24', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250 ', -19.82724000, -43.98316000, 86.68, 4.00, 90.68, 'SAIU_PARA_ENTREGA', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1055, 1002, 100001, '2025-03-20 15:58:12', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250 ', -19.82724000, -43.98316000, 60.79, 4.00, 64.79, 'PGTO_OK', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1059, 1002, 100001, '2025-03-21 21:16:44', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250 ', -19.82724000, -43.98316000, 27.90, 4.00, 31.90, 'PRONTO_PARA_RETIRADA', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1079, 1002, 100001, '2025-04-03 17:58:50', 'Rua Alcides Lins, 320, Venda Nova, 31510-030\r\n\r\n', -19.81641497, -43.95921010, 63.78, 4.00, 67.78, 'PREPARANDO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1080, 1002, 100001, '2025-04-22 00:16:25', 'Rua dos Apaches, 870, Santa Monica, 31530-280', -19.82729230, -43.98321370, 99.76, 4.00, 103.76, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1081, 1003, 100001, '2025-05-01 15:42:09', 'Rua dos Comanches, 870, Santa Monica, 31530-250', -19.82725810, -43.98318010, 68.00, 3.50, 71.50, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1082, 1002, NULL, '2025-09-24 21:11:14', 'Rua dos Comanches, 870 Apto 302 Santa Mônica CEP 31530-250', -19.82724370, -43.98307500, 67.00, 4.00, 71.00, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1083, 1002, 100001, '2025-09-24 21:31:13', 'Rua dos Apaches, 870, Santa Monica, 31530-280', -19.82726050, -43.98317840, 31.10, 4.00, 35.10, 'PREPARANDO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1084, 1002, 100001, '2025-09-25 21:08:37', 'Rua dos Comanches, 870, Apto 302, Santa Monica, 31530-250', -19.82719110, -43.98311470, 47.99, 4.00, 51.99, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1085, 1002, 100001, '2025-09-26 15:26:05', 'Rua dos Comanches, 870, Apto 302, Santa Monica, 31530-250', -19.82732730, -43.98320140, 65.40, 4.00, 69.40, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1086, 1003, 100001, '2025-09-26 15:30:52', 'Rua dos Comanches, 870, Apto 302 Santa Monica, 31530-250', -19.82722320, -43.98310900, 38.00, 3.50, 41.50, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]'),
(1087, 1003, 100001, '2025-10-03 15:20:42', 'Rua dos Comanches, 860, Santa Monica, Minas Gerais, 31530-250', -19.82721790, -43.98304120, 44.40, 3.50, 47.90, 'NOVO', 'ExponentPushToken[NORKdoBG3OuOFfyf3Ma6i3]');

-- --------------------------------------------------------

--
-- Table structure for table `pix_transactions`
--

CREATE TABLE `pix_transactions` (
  `id` int NOT NULL,
  `orderId` varchar(50) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `status` varchar(20) NOT NULL,
  `txid` varchar(50) NOT NULL,
  `payload` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `pix_transactions`
--

INSERT INTO `pix_transactions` (`id`, `orderId`, `value`, `status`, `txid`, `payload`, `created_at`, `updated_at`) VALUES
(1, '1079', 67.78, 'GENERATED', 'PSI00001079', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540567.785802BR5912PSI-DELIVERY6014BELO HORIZONTE62150511PSI0000107963049401', '2025-04-19 19:26:52', '2025-04-21 23:48:19'),
(3, '1059', 31.90, 'GENERATED', 'PSI00001059', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540531.905802BR5912PSI-DELIVERY6014BELO HORIZONTE62150511PSI000010596304DFFC', '2025-04-19 19:55:56', '2025-04-19 19:55:56'),
(5, '1080', 103.76, 'GENERATED', 'PSI00001080', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com5204000053039865406103.765802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI000010806304D2E1', '2025-04-24 16:04:21', '2025-05-01 15:15:30'),
(6, '1081', 65.50, 'GENERATED', 'PSI00001081', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540565.505802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI0000108163041D29', '2025-04-25 18:31:19', '2025-04-25 18:31:19'),
(7, '1083', 35.10, 'GENERATED', 'PSI00001083', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540535.105802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI0000108363048BAB', '2025-09-24 21:39:48', '2025-09-24 21:39:48'),
(8, '1084', 51.99, 'GENERATED', 'PSI00001084', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540551.995802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI0000108463049E26', '2025-09-25 21:10:59', '2025-09-25 21:11:00'),
(9, '1085', 69.40, 'GENERATED', 'PSI00001085', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540569.405802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI000010856304F4F5', '2025-09-26 15:43:16', '2025-09-26 15:43:16'),
(10, '1087', 47.90, 'GENERATED', 'PSI00001087', '00020126470014br.gov.bcb.pix0125ezequiasmartins@gmail.com520400005303986540547.905802BR5912Blue Delivery6015BELO HORIZONTE 62150511PSI0000108763040397', '2025-10-03 15:29:21', '2025-10-03 15:29:22');

-- --------------------------------------------------------

--
-- Table structure for table `produtos`
--

CREATE TABLE `produtos` (
  `PRODUTO_ID` int NOT NULL,
  `DELIVERY_ID` int NOT NULL,
  `PRODUTO_NOME` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `DESCRICAO` varchar(1000) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `VR_UNITARIO` float(9,2) DEFAULT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ITENS_EXTRAS` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `ITENS_OBS` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CHV` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `produtos`
--

INSERT INTO `produtos` (`PRODUTO_ID`, `DELIVERY_ID`, `PRODUTO_NOME`, `DESCRICAO`, `VR_UNITARIO`, `URL_IMAGEM`, `ITENS_EXTRAS`, `ITENS_OBS`, `CHV`) VALUES
(1017, 1002, 'X-Tudo', 'Pão, hambúrguer de carne angus, alface, tomate e queijo prato.', 33.90, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fx-cebola-maionese.jpg?alt=media&token=5c279940-5b42-4107-8467-5462189b367b', 'S', 'S', ''),
(1018, 1002, 'X-Egg Bacon', 'Pão, hambúrguer de carne angus, creme cheese, queijo prato, bacon e ovo.', 24.90, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fx-eggbacon.jpg?alt=media&token=c4dfa87f-d48c-4559-8f1b-accf16512b28', 'S', 'S', ''),
(1019, 1002, 'X-Bacon Duplo', 'Pão, 02 hambúrguers de carne angus, salada, queijo prato e bacon.', 27.90, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fxbacon-duplo.jpg?alt=media&token=48f0e6a0-8536-497b-8803-bea76992a583', 'S', 'S', ''),
(1020, 1002, 'X-Filé Frango', 'Pão, filet de frango picado, creme cheese e queijo prato.', 25.60, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fx-frango.png?alt=media&token=4c7f5bfa-dcd8-4bed-a5db-6e982a0c7ea5', 'S', 'S', ''),
(1022, 1003, 'Hot Dog Tradicional', 'Pão de Hot Dog, 1 Salsicha, Ketchup, Maionese e Mostarda', 14.50, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fhotdog-1.png?alt=media&token=63055b8f-b826-4f23-9348-0649a92c0738', 'S', 'S', ''),
(1023, 1003, 'Hot Dog Soja', 'Salsicha de soja, requeijão, oregano, cheddar, vinagrete, milho, maionese, batata palha, pure e parmesão (vegetariano ou vegano)', 28.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fhotdog-2.png?alt=media&token=a4556ff9-6e61-465e-9a1a-3482cea3e6e0', 'S', 'S', ''),
(1024, 1003, 'Hot Dogão', 'Duas salsichas, requeijão, oregano, cheddar, vinagrete, milho, maionese, batata palha, pure e parmesão', 31.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fhotdog-3.png?alt=media&token=00a92e27-fa0e-4ff8-b359-d87e3d5912d6', 'S', 'S', ''),
(1025, 1002, 'Coca-Cola Lata', 'Refrigerante Coca-Cola lata 350ml', 4.80, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fcoca-cola.jpg?alt=media&token=55f1a7a2-8550-4d42-80f5-b6331e593462', 'N', 'N', ''),
(1030, 1001, 'Porção de Fritas + Frango a Passarinho', '300g de Batata Frita a Palito + 300g de Frango Frito a Passarinho + Salada (opcional)', 45.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Ffrango%20a%20passarinho%20%2B%20fritas.jpg?alt=media&token=b56f9fb2-0cd8-4d16-9af3-22a2bd9c4912', 'S', 'S', ''),
(1032, 1001, 'Porção de Frango a Passarinho', '600g de Frango Frito a Passarinho + Salada Americana (opcional)', 38.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Ffrango%20a%20passarinho.jpg?alt=media&token=8b81e72c-2657-49e2-8c71-12052282fced', 'S', 'S', ''),
(1039, 1001, 'Mexidão', 'Arroz, feijão, farofa c/ ovos mexido, calabresa acebolada, ovo frito, bacon', 15.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fmexid%C3%A3o.png?alt=media&token=d2794d1a-367a-42d6-89df-1b10d0ec37e8', 'S', 'S', ''),
(1040, 1001, 'Espaguete a Bolonhesa', 'Espaguete ao molho Bolonhesa c/ Mussarella', 18.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fespaguete-bolonhesa.png?alt=media&token=665e0aa5-9619-4acc-a8c4-b84194760ff4', 'S', 'S', ''),
(1041, 1001, 'Janta', 'A escolha, pernil, frango, omelete, arroz feijão espaguete fritas', 15.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fjanta.png?alt=media&token=e74ef0b5-8875-4f7f-abd6-34efddb9358e', 'S', 'S', ''),
(1048, 1002, 'Guaraná Antárctica Lata', 'Refrigerante de Guaraná, Lata 350ml', 4.50, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fguaran%C3%A1%20antarctica.jpg?alt=media&token=96b03d8a-3b04-4eb6-8329-6c3844ccc2cd', 'N', 'N', ''),
(1053, 1003, 'Guaraná Antártica 350ml', 'Refrigerante de Guaraná, Lata 350ml', 4.50, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Frefri-2.png?alt=media&token=52f4e4fd-ea27-440e-ab70-4521ae1f8d7f', 'N', 'N', ''),
(1054, 1003, 'Coca-Cola 350ml', 'Refrigerante de Cola, Lata 350ml', 4.50, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2FCOCA-COLA.jpg?alt=media&token=69426c3a-8702-482e-bbfe-8671bdd3ab56', 'N', 'N', ''),
(1057, 1001, 'Água Mineral s/ Gás', 'Água Mineral sem Gás, copo 200ml', 2.00, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2F%C3%81GUA%20MINERAL%20SEM%20G%C3%81S%20200ML.jpg?alt=media&token=abc0d91a-ee07-4844-a4e1-a5cc29b07741', 'N', 'N', ''),
(1058, 1001, 'Água Mineral c/ Gás', 'Água Mineral com Gás Natural, garrafa 300ml', 2.80, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2F%C3%81GUA%20MINERAL%20GASOSA.jpg?alt=media&token=fa672ffa-6fe3-4786-bbe8-80db63cf1dea', 'N', 'N', ''),
(1061, 1001, 'Refrigerante Coca-Cola 350ml', 'Refrigerante de Cola, Lata 350ml', 4.80, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2FCOCA-COLA.jpg?alt=media&token=bb15e4ec-18d9-4439-861f-064a623394b6', 'N', 'N', ''),
(1062, 1001, 'Refrigerante Guaraná Antártica 350ml', 'Refrigerante de Guaraná, Lata 350ml', 4.80, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2FGUARAN%C3%81%20ANTARCTICA%20350%20ML.jpg?alt=media&token=89db11b1-2ad1-4026-9913-1fda702d8ef3', 'N', 'N', ''),
(1063, 1001, 'Cerveja Brahma 350ml', 'Cerveja Brahma Chopp Lata 350ml', 7.59, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2FCERVEJA%20BRAHMA%20LATA.jpg?alt=media&token=1ab1d965-a44b-4eae-8086-45bd20b07787', 'N', 'N', ''),
(1064, 1005, 'Espetinho Carne de Boi + Bacon', 'Espetinho de churrasco, carne de Boi e Bacon', 14.99, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fespetinho-carne-boi-bacon.jpg?alt=media&token=90814bdb-9969-46e4-ae74-9db0f49b5c5a', 'S', 'S', ''),
(1065, 1005, 'Espetinho Carne de Frango', 'Espetinho de churrasco, carne de Frango', 14.99, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fespetinho-carne-frango.jpg?alt=media&token=7b4a3cfa-1701-4576-9c5c-5665106d70c0', 'S', 'S', ''),
(1066, 1005, 'Espetinho Carne de Porco', 'Espetinho de churrasco, carne de Porco', 12.99, 'https://firebasestorage.googleapis.com/v0/b/psi-crm-ca846.appspot.com/o/produtos%2Fespetinho-carne-porco.jpg?alt=media&token=e03dc6d2-049f-48c2-b6d9-d618749a0381', 'S', 'S', ''),
(1068, 1002, 'Água Mineral Gasosa 300ml', 'Água Mineral c/ Gás Natural\nGarrafa c/ 300ml', 4.80, 'https://firebasestorage.googleapis.com/v0/b/psi-deliverybairro.firebasestorage.app/o/produtos%2F%C3%81GUA%20MINERAL%20GASOSA.jpg?alt=media&token=81e61c8b-19b8-4713-b079-2893a27d719b', 'S', 'S', ''),
(1069, 1002, 'Cerveja Brahma Lata 355ml', 'Cerveja Brahma Chopp Lata 355ml', 7.99, 'https://firebasestorage.googleapis.com/v0/b/psi-deliverybairro.firebasestorage.app/o/produtos%2Fcerveja%20brahma.jpg?alt=media&token=293ae99f-d010-46cb-bc2d-fcca6a2e342c', 'N', 'N', ''),
(1070, 1002, 'X-Burguer Gourmet', 'Carne de Hamburguer Especial 200gr Grelhado,\nAlface, Rúcula, Cebola Roxa, Tomate, Queijo Cheddar, Pão Especial', 35.00, 'https://firebasestorage.googleapis.com/v0/b/psi-deliverybairro.firebasestorage.app/o/produtos%2Fhamburguer-artezanal.jpg?alt=media&token=a2d0077f-f46a-49fd-bcda-c3709262fa78', 'S', 'S', '');

-- --------------------------------------------------------

--
-- Table structure for table `taxa`
--

CREATE TABLE `taxa` (
  `TAXA_ID` int NOT NULL,
  `DELIVERY_ID` int NOT NULL,
  `TAXA_ENTREGA` float(9,2) DEFAULT NULL,
  `CHV` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `taxa`
--

INSERT INTO `taxa` (`TAXA_ID`, `DELIVERY_ID`, `TAXA_ENTREGA`, `CHV`) VALUES
(1, 1001, 5.50, 'A'),
(2, 1002, 6.50, 'A'),
(3, 1003, 5.75, 'A');

-- --------------------------------------------------------

--
-- Table structure for table `userlog`
--

CREATE TABLE `userlog` (
  `ID` int NOT NULL,
  `USER_ID` int NOT NULL,
  `IP_ADDRESS` varchar(18) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `DT_ACCESS` datetime NOT NULL,
  `TOKEN` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `EXPIRATION_TIME` datetime DEFAULT NULL,
  `CHV` varchar(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `userlog`
--

INSERT INTO `userlog` (`ID`, `USER_ID`, `IP_ADDRESS`, `DT_ACCESS`, `TOKEN`, `EXPIRATION_TIME`, `CHV`) VALUES
(1, 1002, '::ffff:192.168.0.7', '2025-09-24 21:10:47', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNCAyMToxMDo0NyIsImNodiI6MSwiaWF0IjoxNzU4NzU5MDQ3LCJleHAiOjE3NTg3Njk4NDd9.CP22OlXVA3LoM9jNMlC4sGQSRqNrAgxMAb2ig5pYYzA', '2025-09-25 00:10:47', '1'),
(2, 100001, '::ffff:192.168.0.3', '2025-09-24 21:18:04', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI0IDIxOjE4OjA0IiwiY2h2IjoxLCJpYXQiOjE3NTg3NTk0ODQsImV4cCI6MTc1ODc3MDI4NH0.zBh7ltO50kOYM0FTO7jp3yWLm7GwjiVrl55yP_f8Gh0', '2025-09-24 22:18:04', '1'),
(3, 1002, '::ffff:192.168.0.7', '2025-09-25 18:55:26', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNSAxODo1NToyNiIsImNodiI6MSwiaWF0IjoxNzU4ODM3MzI2LCJleHAiOjE3NTg4NDgxMjZ9.UGsKpsZ-SjpfSiQSuWvtsfcl-Mi-Vr9KViHMENv8dMc', '2025-09-25 21:55:26', '1'),
(4, 1002, '::ffff:192.168.0.7', '2025-09-25 19:30:17', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNSAxOTozMDoxNyIsImNodiI6MSwiaWF0IjoxNzU4ODM5NDE3LCJleHAiOjE3NTg4NTAyMTd9.VDIwNVfIy8apo29AOw6WgH4O-vIOtqaKhZfjKqJ5q8A', '2025-09-25 22:30:17', '1'),
(5, 100001, '::ffff:192.168.0.2', '2025-09-25 20:12:52', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI1IDIwOjEyOjUyIiwiY2h2IjoxLCJpYXQiOjE3NTg4NDE5NzIsImV4cCI6MTc1ODg1Mjc3Mn0.LQU7ETvrCAgwjpUhjfyytVcfJco62swnX-5vLGf6N_o', '2025-09-25 21:12:52', '1'),
(6, 100001, '::ffff:192.168.0.2', '2025-09-25 21:09:56', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI1IDIxOjA5OjU2IiwiY2h2IjoxLCJpYXQiOjE3NTg4NDUzOTYsImV4cCI6MTc1ODg1NjE5Nn0.4e9sk3yeUjY8rsKznv-DlrPucA6fJlhdzfwhaxus9js', '2025-09-25 22:09:56', '1'),
(7, 1002, '::ffff:192.168.0.7', '2025-09-26 09:06:02', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNiAwOTowNjowMiIsImNodiI6MSwiaWF0IjoxNzU4ODg4MzYzLCJleHAiOjE3NTg4OTkxNjN9.hsWDUAVyDTbo4FjyDkYVRXaisQGBwc1gpSIwlHVMOo8', '2025-09-26 12:06:02', '1'),
(8, 100001, '::ffff:192.168.0.2', '2025-09-26 10:07:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI2IDEwOjA3OjMyIiwiY2h2IjoxLCJpYXQiOjE3NTg4OTIwNTIsImV4cCI6MTc1ODkwMjg1Mn0.Og0-rAht7hLdt9HQSG8Kj6p7NKM-Eo96_L_IvlC_-GI', '2025-09-26 11:07:32', '1'),
(9, 1002, '::ffff:192.168.0.7', '2025-09-26 10:40:19', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNiAxMDo0MDoxOSIsImNodiI6MSwiaWF0IjoxNzU4ODk0MDE5LCJleHAiOjE3NTg5MDQ4MTl9.x0mffg8Jkp0U65moEUwx8b43KNmxWo4a9uayKh9gLPU', '2025-09-26 13:40:19', '1'),
(10, 1002, '::ffff:192.168.0.7', '2025-09-26 14:03:53', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNiAxNDowMzo1MyIsImNodiI6MSwiaWF0IjoxNzU4OTA2MjMzLCJleHAiOjE3NTg5MTcwMzN9.TS4Ha1_aGfZ4QkKg3SQQBUKGLA3mlCWp79A8ZHxM_Qc', '2025-09-26 17:03:53', '1'),
(11, 100001, '::ffff:192.168.0.2', '2025-09-26 14:15:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI2IDE0OjE1OjMyIiwiY2h2IjoxLCJpYXQiOjE3NTg5MDY5MzIsImV4cCI6MTc1ODkxNzczMn0.lVWYlyBsm4m-aPAB7XZRLSxPvHsvs8mUD_8PeFHkw7I', '2025-09-26 15:15:32', '1'),
(12, 100001, '::ffff:192.168.0.2', '2025-09-26 14:58:39', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI2IDE0OjU4OjM5IiwiY2h2IjoxLCJpYXQiOjE3NTg5MDk1MTksImV4cCI6MTc1ODkyMDMxOX0.XJIcowa6HsdcfxlXKAKfwkmpCgHezwJcbUhtw1E3uXs', '2025-09-26 15:58:39', '1'),
(13, 1002, '::ffff:192.168.0.7', '2025-09-26 17:18:51', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNiAxNzoxODo1MSIsImNodiI6MSwiaWF0IjoxNzU4OTE3OTMxLCJleHAiOjE3NTg5Mjg3MzF9.bIqbdV40T9E3cU7yVDNGPX6WRN-7Dv2W1qKuIinyJ_E', '2025-09-26 20:18:51', '1'),
(14, 100001, '::ffff:192.168.0.2', '2025-09-26 17:29:14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI2IDE3OjI5OjE0IiwiY2h2IjoxLCJpYXQiOjE3NTg5MTg1NTQsImV4cCI6MTc1ODkyOTM1NH0.bJuLxGzRVgsGpsQuGK5lPq4hYPLILybXEE2vpbcN-P4', '2025-09-26 18:29:14', '1'),
(15, 100001, '::ffff:192.168.0.2', '2025-09-26 18:11:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI2IDE4OjExOjIwIiwiY2h2IjoxLCJpYXQiOjE3NTg5MjEwODAsImV4cCI6MTc1ODkzMTg4MH0.6fkeQcxPQL1xi5_e0AChFY74kUsms1KXatF6DyAKyVU', '2025-09-26 19:11:20', '1'),
(16, 1002, '::ffff:192.168.0.7', '2025-09-27 17:45:16', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0wOS0yNyAxNzo0NToxNiIsImNodiI6MSwiaWF0IjoxNzU5MDA1OTE2LCJleHAiOjE3NTkwMTY3MTZ9.D5z4GZuVXHWBw5W1YU5WTLPvLW39hezx752uOz0lGE8', '2025-09-27 20:45:16', '1'),
(17, 100001, '::ffff:192.168.0.2', '2025-09-27 17:45:20', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI3IDE3OjQ1OjIwIiwiY2h2IjoxLCJpYXQiOjE3NTkwMDU5MjAsImV4cCI6MTc1OTAxNjcyMH0.UwyowRFm67OEEv05OAawm9rO2UFRUMHLtLha4kmAEww', '2025-09-27 18:45:20', '1'),
(18, 100001, '::ffff:192.168.0.2', '2025-09-27 18:37:10', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI3IDE4OjM3OjEwIiwiY2h2IjoxLCJpYXQiOjE3NTkwMDkwMzAsImV4cCI6MTc1OTAxOTgzMH0.qPdXSi1BQzL318R24shMyDmVdK8POyFG7fCKG4T79rU', '2025-09-27 19:37:10', '1'),
(19, 100001, '::ffff:192.168.0.2', '2025-09-27 18:43:13', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI3IDE4OjQzOjEzIiwiY2h2IjoxLCJpYXQiOjE3NTkwMDkzOTMsImV4cCI6MTc1OTAyMDE5M30.uRqMnLadccDrX7L6lM2jFu6ipLBxi2PSg7NPdy0Bs40', '2025-09-27 19:43:13', '1'),
(20, 100001, '::ffff:192.168.0.2', '2025-09-27 19:11:33', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTA5LTI3IDE5OjExOjMzIiwiY2h2IjoxLCJpYXQiOjE3NTkwMTEwOTMsImV4cCI6MTc1OTAyMTg5M30.REtzmqJedSApTjPRvCcIeKVZGpjCEyjNvyJU3k9NuPU', '2025-09-27 20:11:33', '1'),
(21, 1002, '::1', '2025-10-02 16:41:12', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDIiLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAyIDE2OjQxOjEyIiwiY2h2IjoiMSIsImlhdCI6MTc1OTQxMjQ3MiwiZXhwIjoxNzU5NDIzMjcyfQ.oNyviLfFfCqOL7l9HhJLfc73NNTcqs7VtxXbB3oEVKQ', '2025-10-02 19:41:12', '1'),
(22, 1002, '::1', '2025-10-02 16:41:30', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDIiLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAyIDE2OjQxOjMwIiwiY2h2IjoiMSIsImlhdCI6MTc1OTQxMjQ5MCwiZXhwIjoxNzU5NDIzMjkwfQ.W4hxfc_0yIqYGAaSOLmdnRHWPMoKv-ysCKlSDSKWMmU', '2025-10-02 19:41:30', '1'),
(23, 100001, '::1', '2025-10-02 16:47:34', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEwMDAwMSIsImR0X2FjY2VzcyI6IjIwMjUtMTAtMDIgMTY6NDc6MzQiLCJjaHYiOiIxIiwiaWF0IjoxNzU5NDEyODU0LCJleHAiOjE3NTk0MjM2NTR9.wzMkA6N5hqxeJqiVf9bPi3y2Na4OeVXPx0ueS3py_-Q', '2025-10-02 17:47:34', '1'),
(24, 1002, '::ffff:192.168.0.7', '2025-10-02 11:31:05', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxMTozMTowNSIsImNodiI6MSwiaWF0IjoxNzU5NDE1NDY1LCJleHAiOjE3NTk0MjYyNjV9.XEDR6x8vSdWF95eii6Pg114lHczMWMhfXTRHQUhOKQY', '2025-10-02 14:31:05', '1'),
(25, 1002, '::ffff:192.168.0.7', '2025-10-02 12:09:30', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxMjowOTozMCIsImNodiI6MSwiaWF0IjoxNzU5NDE3NzcwLCJleHAiOjE3NTk0Mjg1NzB9.MVjPM4tj-MYUUQzCcgQfmA4qdZZ-pAaiiNRXy1BNzU4', '2025-10-02 15:09:30', '1'),
(26, 1003, '::ffff:192.168.0.7', '2025-10-02 12:10:04', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxMjoxMDowNCIsImNodiI6MSwiaWF0IjoxNzU5NDE3ODA0LCJleHAiOjE3NTk0Mjg2MDR9.o_XKTY6O86Davbzmyyvunr8WtxEKW2PGdJ6Co5W8nwM', '2025-10-02 15:10:04', '1'),
(27, 1002, '::ffff:192.168.0.7', '2025-10-02 12:41:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxMjo0MTozMiIsImNodiI6MSwiaWF0IjoxNzU5NDE5NjkyLCJleHAiOjE3NTk0MzA0OTJ9.q6eOv9vgAm5IJxgPeQEn--MHCgrWdhrlJmgkhwRKwNc', '2025-10-02 15:41:32', '1'),
(28, 1002, '::1', '2025-10-02 17:23:08', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMiwiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxNzoyMzowOCIsImNodiI6MSwiaWF0IjoxNzU5NDM2NTg4LCJleHAiOjE3NTk0NDczODh9.V-5oGRqYiTO33UqlSUsTCDVpBgPPEUnIQvMvM97B-Os', '2025-10-02 20:23:08', '1'),
(29, 1003, '::1', '2025-10-02 17:24:21', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxNzoyNDoyMSIsImNodiI6MSwiaWF0IjoxNzU5NDM2NjYxLCJleHAiOjE3NTk0NDc0NjF9.W6PFHvJHUv5KLe9Zi7MKedlbibgRAuouCw99zzZI7VI', '2025-10-02 20:24:21', '1'),
(30, 1003, '::1', '2025-10-02 17:28:32', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMiAxNzoyODozMiIsImNodiI6MSwiaWF0IjoxNzU5NDM2OTEyLCJleHAiOjE3NTk0NDc3MTJ9.wlFReg2Bid8T24GcHeBJP9BEu3Lt-TiZcE0DyBEaSvY', '2025-10-02 20:28:32', '1'),
(31, 100001, '::ffff:192.168.0.2', '2025-10-02 18:13:50', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAyIDE4OjEzOjUwIiwiY2h2IjoxLCJpYXQiOjE3NTk0Mzk2MzAsImV4cCI6MTc1OTQ1MDQzMH0.FGi2xN5sYUV9o3gJpg-xHmXIrhO3gBmPHghmawL9nPA', '2025-10-02 19:13:50', '1'),
(32, 1003, '::ffff:192.168.0.4', '2025-10-03 10:40:44', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMyAxMDo0MDo0NCIsImNodiI6MSwiaWF0IjoxNzU5NDk4ODQ0LCJleHAiOjE3NTk1MDk2NDR9.yEdmOScKpg6ZimC1Tgbg-cys6BxzLFmbixJxnmp6aiI', '2025-10-03 13:40:44', '1'),
(33, 100001, '::ffff:192.168.0.2', '2025-10-03 11:45:50', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDExOjQ1OjUwIiwiY2h2IjoxLCJpYXQiOjE3NTk1MDI3NTAsImV4cCI6MTc1OTUxMzU1MH0.iNxpCZVP7WfMa1ftJmdXlzYOu5MK_BQ6-DzSRHMCqc4', '2025-10-03 12:45:50', '1'),
(34, 1003, '::ffff:192.168.0.4', '2025-10-03 12:19:56', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMyAxMjoxOTo1NiIsImNodiI6MSwiaWF0IjoxNzU5NTA0Nzk2LCJleHAiOjE3NTk1MTU1OTZ9.aQ8r3hbTVuySoc25sVQqyUsrzNNpJoiaGdKCSJl-b0E', '2025-10-03 15:19:56', '1'),
(35, 100001, '::ffff:192.168.0.2', '2025-10-03 12:28:09', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDEyOjI4OjA5IiwiY2h2IjoxLCJpYXQiOjE3NTk1MDUyODksImV4cCI6MTc1OTUxNjA4OX0.gY8nRmixTjDyScZtCtYOwD7jt--FFJ44CJJ_QXVERwU', '2025-10-03 13:28:09', '1'),
(36, 100001, '::ffff:192.168.0.2', '2025-10-03 13:17:48', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDEzOjE3OjQ4IiwiY2h2IjoxLCJpYXQiOjE3NTk1MDgyNjgsImV4cCI6MTc1OTUxOTA2OH0.S26u1JYXiMYGYNnY2H6N8_by52HghoyHOfaOQD8eeTs', '2025-10-03 14:17:48', '1'),
(37, 1003, '::ffff:192.168.0.4', '2025-10-03 14:20:17', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMywiZHRfYWNjZXNzIjoiMjAyNS0xMC0wMyAxNDoyMDoxNyIsImNodiI6MSwiaWF0IjoxNzU5NTEyMDE3LCJleHAiOjE3NTk1MjI4MTd9.cRc2YYjppEmdOnREMS2XApAvfYmm088kUD7ydlTcXeA', '2025-10-03 17:20:17', '1'),
(38, 100001, '::ffff:192.168.0.2', '2025-10-03 14:39:44', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDE0OjM5OjQ0IiwiY2h2IjoxLCJpYXQiOjE3NTk1MTMxODQsImV4cCI6MTc1OTUyMzk4NH0.U9hW0oAvqSa0aPBaIFDw1lmhyYTWkBWo-Bw1XldHVYo', '2025-10-03 15:39:44', '1'),
(39, 100001, '::ffff:192.168.0.2', '2025-10-03 16:44:14', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDE2OjQ0OjE0IiwiY2h2IjoxLCJpYXQiOjE3NTk1MjA2NTQsImV4cCI6MTc1OTUzMTQ1NH0.43krGWmRhXMd2nrrvh5USo68qBUawA14NM9T37KXHUw', '2025-10-03 17:44:14', '1'),
(40, 100001, '::ffff:192.168.0.2', '2025-10-03 17:07:55', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDE3OjA3OjU1IiwiY2h2IjoxLCJpYXQiOjE3NTk1MjIwNzUsImV4cCI6MTc1OTUzMjg3NX0.eU1CyvUSEpd2dXTcaim-9va0va0D8eAsDAP4_gkAgcw', '2025-10-03 18:07:55', '1'),
(41, 100001, '::ffff:192.168.0.2', '2025-10-03 18:13:51', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDE4OjEzOjUxIiwiY2h2IjoxLCJpYXQiOjE3NTk1MjYwMzEsImV4cCI6MTc1OTUzNjgzMX0.zRh_UkN-TVA99me99wqK3f_yVGorgvL-BvdMG8N65eo', '2025-10-03 19:13:51', '1'),
(42, 100001, '::ffff:192.168.0.2', '2025-10-03 18:14:00', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMDAxLCJkdF9hY2Nlc3MiOiIyMDI1LTEwLTAzIDE4OjE0OjAwIiwiY2h2IjoxLCJpYXQiOjE3NTk1MjYwNDAsImV4cCI6MTc1OTUzNjg0MH0.WrEkETpaUy2talECafmJzzv0cDldC35Qfn05dXcqXAM', '2025-10-03 19:14:00', '1');

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `USER_ID` int NOT NULL,
  `FIREBASE_UID` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `NOME` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `SOBRENOME` varchar(60) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `TELEFONE` varchar(18) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `EMAIL` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `SENHA` varchar(100) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `URL_IMAGEM` varchar(240) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `CHV` varchar(1) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`USER_ID`, `FIREBASE_UID`, `NOME`, `SOBRENOME`, `TELEFONE`, `EMAIL`, `SENHA`, `URL_IMAGEM`, `CHV`) VALUES
(100001, 'x1OFq9mZLjWLBYSe37EksjjEzVd2', 'Blue', 'Delivery ', '(31) 98410-7540', 'ezequiasmatins@gmail.com', '*1A030512019B7B4B97167D5515EBB6C7105EB12F', 'file:///data/user/0/host.exp.exponent/cache/ExperienceData/%2540ezequiasmartins%252FUserApp/ImagePicker/d034ca73-1fdb-4d28-a897-50d681b9137a.jpeg', '1'),
(100002, '5Xs6HfzPtETNdM978MZAIvaXTg92', 'Hotdog', 'da Maria', '(31) 99999-9999', 'mariadg@email.com', '*600FE53B55C3FAE8A9FCAB8060125364879C08E3', '', '1'),
(100003, 'BFyauNcPX8VnspEi3wmXMZF7wGH3', 'Zé ', 'das Couves', '(31) 98410-7540', 'zedascouves@email.com', '*600FE53B55C3FAE8A9FCAB8060125364879C08E3', 'file:///data/user/0/com.deliverybairro.userapp/cache/ImagePicker/0d9d75aa-4a93-402e-b25d-44f24a3f94cc.jpeg', '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`CATEGORIA_ID`);

--
-- Indexes for table `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`COURIER_ID`);

--
-- Indexes for table `deliveries`
--
ALTER TABLE `deliveries`
  ADD PRIMARY KEY (`DELIVERY_ID`);

--
-- Indexes for table `extras`
--
ALTER TABLE `extras`
  ADD PRIMARY KEY (`EXTRA_ID`);

--
-- Indexes for table `itens`
--
ALTER TABLE `itens`
  ADD PRIMARY KEY (`ITEM_ID`),
  ADD KEY `id_pedido` (`PEDIDO_ID`),
  ADD KEY `id_produto` (`PRODUTO_ID`);

--
-- Indexes for table `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`PEDIDO_ID`),
  ADD KEY `id_usuario` (`USER_ID`);

--
-- Indexes for table `pix_transactions`
--
ALTER TABLE `pix_transactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `txid` (`txid`),
  ADD KEY `idx_txid` (`txid`);

--
-- Indexes for table `produtos`
--
ALTER TABLE `produtos`
  ADD PRIMARY KEY (`PRODUTO_ID`),
  ADD KEY `CategoriaID` (`DELIVERY_ID`);

--
-- Indexes for table `taxa`
--
ALTER TABLE `taxa`
  ADD PRIMARY KEY (`TAXA_ID`);

--
-- Indexes for table `userlog`
--
ALTER TABLE `userlog`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`USER_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categorias`
--
ALTER TABLE `categorias`
  MODIFY `CATEGORIA_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=113;

--
-- AUTO_INCREMENT for table `couriers`
--
ALTER TABLE `couriers`
  MODIFY `COURIER_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200002;

--
-- AUTO_INCREMENT for table `deliveries`
--
ALTER TABLE `deliveries`
  MODIFY `DELIVERY_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1008;

--
-- AUTO_INCREMENT for table `extras`
--
ALTER TABLE `extras`
  MODIFY `EXTRA_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `itens`
--
ALTER TABLE `itens`
  MODIFY `ITEM_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=117;

--
-- AUTO_INCREMENT for table `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `PEDIDO_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1088;

--
-- AUTO_INCREMENT for table `pix_transactions`
--
ALTER TABLE `pix_transactions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `produtos`
--
ALTER TABLE `produtos`
  MODIFY `PRODUTO_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1071;

--
-- AUTO_INCREMENT for table `taxa`
--
ALTER TABLE `taxa`
  MODIFY `TAXA_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `userlog`
--
ALTER TABLE `userlog`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `USER_ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1000000;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
