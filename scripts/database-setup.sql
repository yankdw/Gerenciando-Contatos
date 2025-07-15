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
-- Tabela de usuários para autenticação
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'vendedor') DEFAULT 'vendedor',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Usuários de exemplo (senhas devem ser hash em produção)
-- admin123 e vend123 são as senhas em texto plano
INSERT INTO users (name, email, password_hash, role) VALUES
('Administrador', 'admin@techstudio.com', '$2b$10$hash_admin123', 'admin'),
('Vendedor Silva', 'vendedor@techstudio.com', '$2b$10$hash_vend123', 'vendedor');

-- Adicionar coluna user_id na tabela contacts para relacionar com usuários
ALTER TABLE contacts ADD COLUMN user_id INT;
ALTER TABLE contacts ADD FOREIGN KEY (user_id) REFERENCES users(id);

-- Índice para a nova coluna
CREATE INDEX idx_contacts_user_id ON contacts(user_id);

-- Dados de exemplo (opcional)
INSERT INTO contacts (name, email, phone) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-9999'),
('Maria Santos', 'maria.santos@email.com', '(11) 88888-8888'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 77777-7777'),
('Ana Costa', 'ana.costa@email.com', '(11) 66666-6666');
