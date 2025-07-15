-- Script para criação do banco de dados MySQL
-- Execute este script para configurar o banco de dados

CREATE DATABASE IF NOT EXISTS gerenciar_contatos;
USE gerenciar_contatos;

-- Tabela de contatos
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX idx_contacts_name ON contacts(name);
CREATE INDEX idx_contacts_email ON contacts(email);

-- Dados de exemplo (opcional)
INSERT INTO contacts (name, email, phone) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-9999'),
('Maria Santos', 'maria.santos@email.com', '(11) 88888-8888'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 77777-7777'),
('Ana Costa', 'ana.costa@email.com', '(11) 66666-6666');
