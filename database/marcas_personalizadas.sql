-- Cria só a tabela nova, sem apagar os dados já cadastrados.
-- Use este arquivo se o banco já existe; o dump.sql completo também já contém esta tabela.
SET NAMES utf8mb4;
USE `sistema_norteador`;

CREATE TABLE IF NOT EXISTS `marcas_personalizadas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(50) NOT NULL UNIQUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
