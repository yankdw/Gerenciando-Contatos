"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  name: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")

      if (!token || !userData) {
        setIsLoading(false)
        return
      }

      // Verificar se o token ainda é válido
      const response = await fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } else {
        // Token inválido, limpar dados
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string, userData: User) => {
    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_data", JSON.stringify(userData))
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (error) {
      console.error("Erro no logout:", error)
    } finally {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_data")
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
    }
  }

  const getAuthToken = () => {
    return localStorage.getItem("auth_token")
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    getAuthToken,
    checkAuth,
  }
}
