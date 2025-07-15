import { NextResponse } from "next/server"

export async function POST() {
  try {
    // Em uma implementação real, você poderia invalidar o token no servidor
    // Por enquanto, apenas retornamos sucesso
    return NextResponse.json({
      message: "Logout realizado com sucesso",
    })
  } catch (error) {
    return NextResponse.json({ message: "Erro interno do servidor" }, { status: 500 })
  }
}
