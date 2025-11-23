CREATE DATABASE IF NOT EXISTS controle_financeiro;
USE controle_financeiro;

CREATE TABLE lancamentos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 descricao VARCHAR(255),
 valor DECIMAL(10,2),
 data DATE
);
