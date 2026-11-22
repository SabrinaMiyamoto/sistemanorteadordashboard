-- Executado automaticamente pelo Spring Boot ao iniciar (spring.sql.init.mode=always).
-- Cria só o que ainda não existe; não apaga nem altera dados.
CREATE TABLE IF NOT EXISTS `marcas_personalizadas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(50) NOT NULL UNIQUE,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
