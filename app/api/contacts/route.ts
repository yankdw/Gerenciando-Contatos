import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get("authorization")

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Token não fornecido")
  }

  const token = authHeader.substring(7)

  try {
    return verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error("Token inválido")
  }
}

// Simulação de banco de dados em memória (em produção seria MySQL)
const contacts: Array<{
  id: number
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}> = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@email.com",
    phone: "(11) 99999-9999",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Maria Santos",
    email: "maria.santos@email.com",
    phone: "(11) 88888-8888",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

let nextId = 3

// Função para validar email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para validar dados do contato
function validateContactData(data: any) {
  const errors: string[] = []

  if (!data.name || typeof data.name !== "string" || data.name.trim().length === 0) {
    errors.push("Nome é obrigatório")
  }

  if (!data.email || typeof data.email !== "string" || data.email.trim().length === 0) {
    errors.push("E-mail é obrigatório")
  } else if (!isValidEmail(data.email.trim())) {
    errors.push("E-mail deve ter um formato válido")
  }

  if (!data.phone || typeof data.phone !== "string" || data.phone.trim().length === 0) {
    errors.push("Telefone é obrigatório")
  }

  return errors
}

// GET /api/contacts - Listar todos os contatos
export async function GET(request: NextRequest) {
  try {
    verifyToken(request)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }
  try {
    return NextResponse.json(contacts)
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}

// POST /api/contacts - Criar novo contato
export async function POST(request: NextRequest) {
  try {
    verifyToken(request)
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 401 })
  }
  try {
    const body = await request.json()

    // Validar dados
    const validationErrors = validateContactData(body)
    if (validationErrors.length > 0) {
      return NextResponse.json({ message: validationErrors.join(", ") }, { status: 400 })
    }

    // Verificar se email já existe
    const existingContact = contacts.find((contact) => contact.email.toLowerCase() === body.email.trim().toLowerCase())
    if (existingContact) {
      return NextResponse.json({ message: "Já existe um contato com este e-mail" }, { status: 400 })
    }

    // Criar novo contato
    const newContact = {
      id: nextId++,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    contacts.push(newContact)

    return NextResponse.json(newContact, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
