"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Search, Plus, Edit, Trash2, Phone, Mail, User } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { Header } from "@/components/header"

interface Contato {
  id: number
  nome: string
  email: string
  telefone: string
  criado_em: string
  atualizado_em: string
}

interface ContatoFormData {
  nome: string
  email: string
  telefone: string
}

export default function GerenciadorDeContatos() {
  const [contatos, setContatos] = useState<Contato[]>([])
  const [contatosFiltrados, setContatosFiltrados] = useState<Contato[]>([])
  const [termoBusca, setTermoBusca] = useState("")
  const [carregando, setCarregando] = useState(false)
  const [dialogoAberto, setDialogoAberto] = useState(false)
  const [contatoEditando, setContatoEditando] = useState<Contato | null>(null)
  const [formData, setFormData] = useState<ContatoFormData>({
    nome: "",
    email: "",
    telefone: "",
  })

  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  useEffect(() => {
    buscarContatos()
  }, [])

  useEffect(() => {
    if (termoBusca.trim() === "") {
      setContatosFiltrados(contatos)
    } else {
      const filtrados = contatos.filter(
        (contato) =>
          contato.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
          contato.email.toLowerCase().includes(termoBusca.toLowerCase()) ||
          contato.telefone.includes(termoBusca),
      )
      setContatosFiltrados(filtrados)
    }
  }, [contatos, termoBusca])

  const buscarContatos = async () => {
    setCarregando(true)
    try {
      const response = await fetch("/api/contatos", {
        headers: getAuthHeaders(),
      })
      if (response.ok) {
        const data = await response.json()
        setContatos(data)
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar contatos",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão",
        variant: "destructive",
      })
    } finally {
      setCarregando(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCarregando(true)

    try {
      const url = contatoEditando ? `/api/contatos/${contatoEditando.id}` : "/api/contatos"
      const method = contatoEditando ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: contatoEditando ? "Contato atualizado com sucesso!" : "Contato criado com sucesso!",
        })
        setDialogoAberto(false)
        resetForm()
        buscarContatos()
      } else {
        const error = await response.json()
        toast({
          title: "Erro",
          description: error.message || "Falha ao salvar contato",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão",
        variant: "destructive",
      })
    } finally {
      setCarregando(false)
    }
  }

  const handleDelete = async (id: number) => {
    setCarregando(true)
    try {
      const response = await fetch(`/api/contatos/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` },
      })

      if (response.ok) {
        toast({
          title: "Sucesso",
          description: "Contato excluído com sucesso!",
        })
        buscarContatos()
      } else {
        toast({
          title: "Erro",
          description: "Falha ao excluir contato",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão",
        variant: "destructive",
      })
    } finally {
      setCarregando(false)
    }
  }

  const openEditDialog = (contato: Contato) => {
    setContatoEditando(contato)
    setFormData({
      nome: contato.nome,
      email: contato.email,
      telefone: contato.telefone,
    })
    setDialogoAberto(true)
  }

  const resetForm = () => {
    setFormData({ nome: "", email: "", telefone: "" })
    setContatoEditando(null)
  }

  const handleDialogClose = () => {
    setDialogoAberto(false)
    resetForm()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto p-6 max-w-6xl">
          <div className="flex flex-col gap-6">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold">Gerenciamento de Contatos</h1>
                <p className="text-muted-foreground">Sistema interno para a equipe de vendas</p>
              </div>

              <Dialog open={dialogoAberto} onOpenChange={setDialogoAberto}>
                <DialogTrigger asChild>
                  <Button onClick={() => setDialogoAberto(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Contato
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{contatoEditando ? "Editar Contato" : "Novo Contato"}</DialogTitle>
                    <DialogDescription>
                      {contatoEditando ? "Atualize as informações do contato." : "Adicione um novo contato ao sistema."}
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input
                        id="nome"
                        value={formData.nome}
                        onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                        placeholder="Digite o nome completo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Digite o e-mail"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={formData.telefone}
                        onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                        placeholder="Digite o telefone"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                      <Button type="button" variant="outline" onClick={handleDialogClose}>
                        Cancelar
                      </Button>
                      <Button type="submit" disabled={carregando}>
                        {carregando ? "Salvando..." : contatoEditando ? "Atualizar" : "Criar"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </header>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar contatos por nome, e-mail ou telefone..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="pl-10"
              />
            </div>

            <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {carregando && contatos.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">Carregando contatos...</p>
                </div>
              ) : contatosFiltrados.length === 0 ? (
                <div className="col-span-full text-center py-8">
                  <p className="text-muted-foreground">
                    {termoBusca ? "Nenhum contato encontrado para sua busca." : "Nenhum contato cadastrado ainda."}
                  </p>
                </div>
              ) : (
                contatosFiltrados.map((contato) => (
                  <Card key={contato.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <CardTitle className="text-lg">{contato.nome}</CardTitle>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(contato)}
                            className="h-8 w-8"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir o contato "{contato.nome}"? Esta ação não pode ser
                                  desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(contato.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span>{contato.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{contato.telefone}</span>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2">
                        Criado em: {new Date(contato.criado_em).toLocaleDateString("pt-BR")}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>

            {contatos.length > 0 && (
              <footer className="text-center text-sm text-muted-foreground">
                {termoBusca ? (
                  <p>
                    Mostrando {contatosFiltrados.length} de {contatos.length} contatos
                  </p>
                ) : (
                  <p>Total de {contatos.length} contatos cadastrados</p>
                )}
              </footer>
            )}
          </div>
        </main>
      </div>
      <Toaster />
    </AuthGuard>
  )
}