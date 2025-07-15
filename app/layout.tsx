import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gerenciador de Contatos',
  description: 'Criado por Brayan',
  generator: 'Brayan',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
