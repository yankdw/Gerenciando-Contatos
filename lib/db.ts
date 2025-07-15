// lib/db.ts
import mysql from 'mysql2/promise';

// Cria um pool de conexões com o banco de dados
const pool = mysql.createPool(process.env.DATABASE_URL || '');

export default pool;