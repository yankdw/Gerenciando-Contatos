import { type NextRequest, NextResponse } from "next/server"
import { verify } from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token não fornecido" }, { status: 401 })
    }

    const token = authHeader.substring(7)

    try {
      const decoded = verify(token, JWT_SECRET) as any

      return NextResponse.json({
        valid: true,
        user: {
          userId: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        },
      })
    } catch (jwtError) {
      return NextResponse.json({ message: "Token inválido" }, { status: 401 })
    }
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
