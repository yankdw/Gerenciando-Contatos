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

// GET /api/contacts - List all contacts
export async function GET() {
  let connection

  try {
    connection = await getConnection()

    const [rows] = await connection.execute(
      "SELECT id, name, email, phone, created_at, updated_at FROM contacts ORDER BY created_at DESC",
    )

    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// POST /api/contacts - Create new contact
export async function POST(request: NextRequest) {
  let connection

  try {
    const body = await request.json()

    // Validate input data
    const validationErrors = validateContactData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: "Dados inválidos", errors: validationErrors }, { status: 400 })
    }

    connection = await getConnection()

    // Check if email already exists
    const [existingContacts] = await connection.execute("SELECT id FROM contacts WHERE email = ?", [body.email.trim()])

    if (Array.isArray(existingContacts) && existingContacts.length > 0) {
      return NextResponse.json({ message: "Email já está em uso" }, { status: 409 })
    }

    // Insert new contact
    const [result] = await connection.execute(
      "INSERT INTO contacts (name, email, phone, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
      [body.name.trim(), body.email.trim(), body.phone.trim()],
    )

    const insertResult = result as mysql.ResultSetHeader

    // Fetch the created contact
    const [newContact] = await connection.execute(
      "SELECT id, name, email, phone, created_at, updated_at FROM contacts WHERE id = ?",
      [insertResult.insertId],
    )

    return NextResponse.json(Array.isArray(newContact) ? newContact[0] : newContact, { status: 201 })
  } catch (error) {
    console.error("Error creating contact:", error)
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}
