import { type NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "contact_management",
  port: Number.parseInt(process.env.DB_PORT || "3306"),
}

// Create database connection
async function getConnection() {
  try {
    const connection = await mysql.createConnection(dbConfig)
    return connection
  } catch (error) {
    console.error("Database connection error:", error)
    throw new Error("Failed to connect to database")
  }
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validateContactData(data: any) {
  const errors: string[] = []

  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push("Nome é obrigatório")
  }

  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push("Email é obrigatório")
  } else if (!validateEmail(data.email)) {
    errors.push("Email deve ser válido")
  }

  if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
    errors.push("Telefone é obrigatório")
  }

  return errors
}

// PUT /api/contacts/[id] - Update contact
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const contactId = Number.parseInt(params.id)
    if (isNaN(contactId)) {
      return NextResponse.json({ message: "ID do contato inválido" }, { status: 400 })
    }

    const body = await request.json()

    // Validate input data
    const validationErrors = validateContactData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: "Dados inválidos", errors: validationErrors }, { status: 400 })
    }

    connection = await getConnection()

    // Check if contact exists
    const [existingContact] = await connection.execute("SELECT id FROM contacts WHERE id = ?", [contactId])

    if (!Array.isArray(existingContact) || existingContact.length === 0) {
      return NextResponse.json({ message: "Contato não encontrado" }, { status: 404 })
    }

    // Check if email is already used by another contact
    const [emailCheck] = await connection.execute("SELECT id FROM contacts WHERE email = ? AND id != ?", [
      body.email.trim(),
      contactId,
    ])

    if (Array.isArray(emailCheck) && emailCheck.length > 0) {
      return NextResponse.json({ message: "Email já está em uso por outro contato" }, { status: 409 })
    }

    // Update contact
    await connection.execute("UPDATE contacts SET name = ?, email = ?, phone = ?, updated_at = NOW() WHERE id = ?", [
      body.name.trim(),
      body.email.trim(),
      body.phone.trim(),
      contactId,
    ])

    // Fetch updated contact
    const [updatedContact] = await connection.execute(
      "SELECT id, name, email, phone, created_at, updated_at FROM contacts WHERE id = ?",
      [contactId],
    )

    return NextResponse.json(Array.isArray(updatedContact) ? updatedContact[0] : updatedContact)
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// DELETE /api/contacts/[id] - Delete contact
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  let connection

  try {
    const contactId = Number.parseInt(params.id)
    if (isNaN(contactId)) {
      return NextResponse.json({ message: "ID do contato inválido" }, { status: 400 })
    }

    connection = await getConnection()

    // Check if contact exists
    const [existingContact] = await connection.execute("SELECT id FROM contacts WHERE id = ?", [contactId])

    if (!Array.isArray(existingContact) || existingContact.length === 0) {
      return NextResponse.json({ message: "Contato não encontrado" }, { status: 404 })
    }

    // Delete contact
    await connection.execute("DELETE FROM contacts WHERE id = ?", [contactId])

    return NextResponse.json({ message: "Contato excluído com sucesso" })
  } catch (error) {
    console.error("Error deleting contact:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
