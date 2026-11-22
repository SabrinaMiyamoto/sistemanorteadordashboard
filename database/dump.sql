-- Garante que os acentos sejam lidos como UTF-8 (evita "├ôleo" ao importar pelo terminal do Windows)
SET NAMES utf8mb4;

-- DESATIVA a verificação de chaves estrangeiras temporariamente
SET FOREIGN_KEY_CHECKS = 0;


CREATE DATABASE IF NOT EXISTS `sistema_norteador` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `sistema_norteador`;


DROP TABLE IF EXISTS `agendamentos`;
DROP TABLE IF EXISTS `automoveis`;
DROP TABLE IF EXISTS `clientes`;
DROP TABLE IF EXISTS `marcas_personalizadas`;


-- Marcas que não existem na Tabela FIPE, adicionadas pelo modal "Adicionar marca"
CREATE TABLE `marcas_personalizadas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(50) NOT NULL UNIQUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `clientes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(100) NOT NULL,
  `endereco` VARCHAR(255) DEFAULT NULL,
  `celular` VARCHAR(20) DEFAULT NULL,
  `email` VARCHAR(100) NOT NULL,
  `usuario` VARCHAR(50) NOT NULL UNIQUE,
  `senha` VARCHAR(255) NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `automoveis` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `marca` VARCHAR(50) NOT NULL,
  `modelo` VARCHAR(50) NOT NULL,
  `placa` VARCHAR(10) NOT NULL UNIQUE,
  `cliente_id` INT NOT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`cliente_id`) REFERENCES `clientes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `agendamentos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `servico` VARCHAR(150) NOT NULL,
  `data_agendada` DATE NOT NULL,
  `horario` TIME NOT NULL,
  `marca` VARCHAR(50) NOT NULL,
  `modelo` VARCHAR(50) NOT NULL,
  `placa` VARCHAR(10) NOT NULL,
  `observacoes` TEXT DEFAULT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


INSERT INTO `clientes` (`id`, `nome`, `endereco`, `celular`, `email`, `usuario`, `senha`) VALUES 
(1, 'Lucas', 'Rua do IFSC, 123', '(48) 99999-1111', 'lucas@teste.com', 'lucas', '1234'),
(2, 'João Silva', 'Av Central, 456', '(48) 98888-2222', 'joao@teste.com', 'joaosilva', 'senha456');

INSERT INTO `automoveis` (`id`, `marca`, `modelo`, `placa`, `cliente_id`) VALUES
(1, 'Chevrolet', 'Onix', 'IFS2C26', 1),
(2, 'Fiat', 'Uno', 'BRA2E19', 1),
(3, 'Volkswagen', 'Gol', 'ABC1234', 2);

INSERT INTO `agendamentos` (`servico`, `data_agendada`, `horario`, `marca`, `modelo`, `placa`, `observacoes`) VALUES
('Lavação Completa', '2026-11-10', '09:00:00', 'Chevrolet', 'Onix', 'IFS2C26', 'Aspirar bem o porta-malas.'),
('Higienização de Motor', '2026-11-18', '14:00:00', 'Volkswagen', 'Gol', 'ABC1234', 'Proteger a parte elétrica, motor com bastante poeira.'),
('Polimento e Enceramento', '2026-12-02', '10:00:00', 'Fiat', 'Uno', 'BRA2E19', 'Riscos leves na porta do motorista.'),
('Limpeza Detalhada Interna', '2026-12-05', '15:00:00', 'Chevrolet', 'Onix', 'IFS2C26', 'Mancha de café no banco do passageiro.'),
('Vidrificação', '2026-12-10', '08:00:00', 'Volkswagen', 'Gol', 'ABC1234', NULL),
('Lavagem a Seco', '2026-12-12', '11:00:00', 'Fiat', 'Uno', 'BRA2E19', 'Cliente prefere serviço sem uso de água.');

-- REATIVE a verificação de chaves estrangeiras por segurança
SET FOREIGN_KEY_CHECKS = 1;