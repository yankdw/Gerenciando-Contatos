-- Create database
CREATE DATABASE IF NOT EXISTS contact_management;
USE contact_management;

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- Insert sample data
INSERT INTO contacts (name, email, phone) VALUES
('João Silva', 'joao.silva@email.com', '(11) 99999-1234'),
('Maria Santos', 'maria.santos@email.com', '(11) 98888-5678'),
('Pedro Oliveira', 'pedro.oliveira@email.com', '(11) 97777-9012'),
('Ana Costa', 'ana.costa@email.com', '(11) 96666-3456'),
('Carlos Ferreira', 'carlos.ferreira@email.com', '(11) 95555-7890');
