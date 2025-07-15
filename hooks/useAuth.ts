"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface Usuario {
  id: number
  nome: string
  email: string
  perfil: string
}

export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [autenticado, setAutenticado] = useState(false)
  const router = useRouter()

  useEffect(() => {
    verificarAutenticacao()
  }, [])

  const verificarAutenticacao = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const dadosUsuario = localStorage.getItem("dados_usuario")

      if (!token || !dadosUsuario) {
        setCarregando(false)
        return
      }

      // Verificar se o token ainda é válido
      const response = await fetch("/api/auth/verificar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const usuarioParseado = JSON.parse(dadosUsuario)
        setUsuario(usuarioParseado)
        setAutenticado(true)
      } else {
        // Token inválido, limpar dados
        localStorage.removeItem("auth_token")
        localStorage.removeItem("dados_usuario")
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("dados_usuario")
    } finally {
      setCarregando(false)
    }
  }

  const login = (token: string, dadosUsuario: Usuario) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("dados_usuario", JSON.stringify(dadosUsuario))
    setUsuario(dadosUsuario)
    setAutenticado(true)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Erro no logout:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("dados_usuario")
      setUsuario(null)
      setAutenticado(false)
      router.push("/login")
    }
  }

  const getAuthToken = () => {
    return localStorage.getItem("auth_token")
  }

  return {
    usuario,
    carregando,
    autenticado,
    login,
    logout,
    getAuthToken,
    verificarAutenticacao,
  }
}