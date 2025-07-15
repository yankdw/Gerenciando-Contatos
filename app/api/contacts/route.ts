// app/api/contacts/route.ts
import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Importa a conexão do banco

// Função para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Função para validar dados do contato
function validateContactData(data: any) {
  const errors: string[] = [];
  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Nome é obrigatório");
  }
  if (!data.email || typeof data.email !== "string" || data.email.trim().length === 0) {
    errors.push("E-mail é obrigatório");
  } else if (!isValidEmail(data.email.trim())) {
    errors.push("E-mail deve ter um formato válido");
  }
  if (!data.phone || typeof data.phone !== "string" || data.phone.trim().length === 0) {
    errors.push("Telefone é obrigatório");
  }
  return errors;
}

// GET /api/contacts - Listar todos os contatos
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM contacts ORDER BY created_at DESC");
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

// POST /api/contacts - Criar novo contato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationErrors = validateContactData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: validationErrors.join(", ") }, { status: 400 });
    }

    const { name, email, phone } = body;

    // Verificar se email já existe
    const [existing] = await pool.query("SELECT id FROM contacts WHERE email = ?", [email.trim().toLowerCase()]);
    if ((existing as any[]).length > 0) {
        return NextResponse.json({ message: "Já existe um contato com este e-mail" }, { status: 400 });
    }

    // Inserir novo contato
    const [result] = await pool.query(
      "INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)",
      [name.trim(), email.trim().toLowerCase(), phone.trim()]
    );
    
    const insertId = (result as any).insertId;

    const [newContactRows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [insertId]);

    const newContact = (newContactRows as any[])[0];

    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}