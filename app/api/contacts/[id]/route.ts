// app/api/contacts/[id]/route.ts
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

// PUT /api/contacts/[id] - Atualizar contato existente
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }

    const body = await request.json();
    const validationErrors = validateContactData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: validationErrors.join(", ") }, { status: 400 });
    }
    
    const { name, email, phone } = body;

    // Verificar se o contato existe
    const [contactRows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
    if ((contactRows as any[]).length === 0) {
        return NextResponse.json({ message: "Contato não encontrado" }, { status: 404 });
    }

    // Verificar se o email já existe em outro contato
    const [existingEmail] = await pool.query("SELECT id FROM contacts WHERE email = ? AND id != ?", [email.trim().toLowerCase(), id]);
    if ((existingEmail as any[]).length > 0) {
        return NextResponse.json({ message: "Já existe outro contato com este e-mail" }, { status: 400 });
    }

    // Atualizar contato
    await pool.query(
      "UPDATE contacts SET name = ?, email = ?, phone = ? WHERE id = ?",
      [name.trim(), email.trim().toLowerCase(), phone.trim(), id]
    );

    const [updatedContactRows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
    const updatedContact = (updatedContactRows as any[])[0];

    return NextResponse.json(updatedContact);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}

// DELETE /api/contacts/[id] - Excluir contato
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID inválido" }, { status: 400 });
    }
    
    // Verificar se o contato existe
    const [contactRows] = await pool.query("SELECT * FROM contacts WHERE id = ?", [id]);
    if ((contactRows as any[]).length === 0) {
        return NextResponse.json({ message: "Contato não encontrado" }, { status: 404 });
    }

    // Remover contato
    await pool.query("DELETE FROM contacts WHERE id = ?", [id]);

    return NextResponse.json({ message: "Contato excluído com sucesso" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 });
  }
}