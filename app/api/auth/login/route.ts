import { type NextRequest, NextResponse } from "next/server"
import { sign } from "jsonwebtoken"

// Usuários simulados (em produção seria no banco de dados)
const users = [
  {
    id: 1,
    name: "Administrador",
    email: "admin@techstudio.com",
    password: "admin123", // Em produção seria hash
    role: "admin",
  },
  {
    id: 2,
    name: "Vendedor Silva",
    email: "vendedor@techstudio.com",
    password: "vend123", // Em produção seria hash
    role: "vendedor",
  },
]

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validar dados
    if (!email || !password) {
      return NextResponse.json({ message: "E-mail e senha são obrigatórios" }, { status: 400 })
    }

    // Buscar usuário
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar JWT token
    const token = sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "24h" },
    )

    // Retornar dados do usuário (sem senha)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Login realizado com sucesso",
      token,
      user: userWithoutPassword,
    })
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
