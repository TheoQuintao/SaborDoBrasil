-- Projeto: Sabor do Brasil

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `saborDoBrasil` DEFAULT CHARACTER SET utf8 ;
USE `saborDoBrasil` ;

-- ---------------------------
-- Tabela: usuarios
-- ---------------------------
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `apelido` VARCHAR(100) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `foto` VARCHAR(255),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `email_UNIQUE` (`email`),
  UNIQUE INDEX `apelido_UNIQUE` (`apelido`)
) ENGINE = InnoDB;

-- ---------------------------
-- Tabela: empresas
-- ---------------------------
CREATE TABLE IF NOT EXISTS `empresas` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(100) NOT NULL,
  `logo` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE = InnoDB;

-- ---------------------------
-- Tabela: empresas_endereco
-- ---------------------------
CREATE TABLE IF NOT EXISTS `empresas_endereco` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `estado` VARCHAR(3) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `rua` VARCHAR(100) NOT NULL,
  `numero` VARCHAR(5) NOT NULL,
  `empresa_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`empresa_id`),
  CONSTRAINT `fk_empresa_endereco`
    FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- ---------------------------
-- Tabela: publicacoes 
-- ---------------------------
CREATE TABLE IF NOT EXISTS `publicacoes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(100) NOT NULL,
  `imagem` VARCHAR(255),
  `descricao` TEXT,
  `local` VARCHAR(100) NOT NULL,
  `empresa_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `imagem_UNIQUE` (`imagem`),
  INDEX (`empresa_id`),
  INDEX (`usuario_id`),
  CONSTRAINT `fk_publicacoes_empresa`
    FOREIGN KEY (`empresa_id`) REFERENCES `empresas` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_publicacoes_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- ---------------------------
-- Tabela: interacoes
-- ---------------------------
CREATE TABLE IF NOT EXISTS `interacoes` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` ENUM("like", "deslike") NOT NULL,
  `publicacao_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX (`publicacao_id`),
  INDEX (`usuario_id`),
  CONSTRAINT `fk_interacoes_publicacao`
    FOREIGN KEY (`publicacao_id`) REFERENCES `publicacoes` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_interacoes_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- ---------------------------
-- Tabela: comentarios
-- ---------------------------
CREATE TABLE IF NOT EXISTS `comentarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `texto` TEXT NOT NULL,
  `date` DATE NOT NULL,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `usuario_id` INT NOT NULL,
  `publicacao_id` INT NOT NULL,
  `foto` VARCHAR(255),
  PRIMARY KEY (`id`),
  INDEX (`usuario_id`),
  INDEX (`publicacao_id`),
  CONSTRAINT `fk_comentarios_usuario`
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_comentarios_publicacao`
    FOREIGN KEY (`publicacao_id`) REFERENCES `publicacoes` (`id`)
    ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB;

-- Restaura os modos antigos
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;