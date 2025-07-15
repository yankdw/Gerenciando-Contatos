# Sistema de Gerenciamento de Contatos

Uma aplicação web fullstack para gerenciamento de contatos, desenvolvida para uso interno de equipes de vendas.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React + TypeScript + Next.js
- **Backend**: Next.js API Routes + TypeScript
- **Banco de Dados**: MySQL (simulado em memória para demonstração)
- **UI**: Tailwind CSS + shadcn/ui
- **Validações**: Validação no backend com feedback visual

## 📋 Funcionalidades

### ✅ Funcionalidades Obrigatórias
- ✅ API RESTful com todos os endpoints solicitados
- ✅ CRUD completo de contatos (Criar, Listar, Editar, Excluir)
- ✅ Validações obrigatórias no backend
- ✅ Interface React funcional e responsiva
- ✅ Feedback visual para todas as operações
- ✅ Campos obrigatórios: nome, email, telefone
- ✅ Validação de email válido

### 🎯 Funcionalidades Bônus Implementadas
- ✅ Filtro de contatos por nome, email ou telefone
- ✅ Interface limpa e moderna com shadcn/ui
- ✅ Confirmação antes de excluir contatos
- ✅ Timestamps automáticos (created_at, updated_at)
- ✅ Validação de email duplicado
- ✅ Responsividade completa
- ✅ Loading states e tratamento de erros

## 🏗️ Arquitetura da API

### Endpoints Implementados

\`\`\`
GET    /api/contacts     → Listar todos os contatos
POST   /api/contacts     → Criar novo contato
PUT    /api/contacts/:id → Atualizar contato existente
DELETE /api/contacts/:id → Excluir contato
\`\`\`

### Modelo de Dados

\`\`\`typescript
interface Contact {
  id: number              // Auto-incremento
  name: string           // Obrigatório
  email: string          // Obrigatório, deve ser email válido
  phone: string          // Obrigatório
  created_at: string     // Timestamp automático
  updated_at: string     // Timestamp automático
}
\`\`\`

## 🛠️ Como Executar Localmente

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### Passos para Execução

1. **Clone o repositório**
\`\`\`bash
git clone <url-do-repositorio>
cd contacts-manager
\`\`\`

2. **Instale as dependências**
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

3. **Execute em modo de desenvolvimento**
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

4. **Acesse a aplicação**
Abra [http://localhost:3000](http://localhost:3000) no seu navegador

### Scripts Disponíveis

\`\`\`bash
npm run dev    # Executa em modo desenvolvimento
npm run build  # Gera build de produção
npm run start  # Executa build de produção
npm run lint   # Executa linting do código
\`\`\`

## 🗄️ Configuração do Banco de Dados

### Para Ambiente de Produção (MySQL)

1. **Execute o script SQL**
\`\`\`bash
mysql -u root -p < scripts/database-setup.sql
\`\`\`

2. **Configure as variáveis de ambiente**
Crie um arquivo \`.env.local\`:
\`\`\`env
DATABASE_URL="mysql://usuario:senha@localhost:3306/contacts_manager"
\`\`\`

3. **Substitua a simulação em memória**
Nos arquivos de API (\`app/api/contacts/route.ts\` e \`app/api/contacts/[id]/route.ts\`), substitua a simulação em memória por conexão real com MySQL usando uma biblioteca como \`mysql2\` ou \`prisma\`.

### Demonstração Atual
A aplicação atual usa um banco de dados simulado em memória para facilitar a demonstração, mas está estruturada para fácil migração para MySQL real.

## 🎨 Interface do Usuário

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Componentes Modernos**: Utiliza shadcn/ui para uma interface profissional
- **Feedback Visual**: Toasts para sucesso/erro, loading states, confirmações
- **Busca em Tempo Real**: Filtro instantâneo por nome, email ou telefone
- **Operações Intuitivas**: Botões claros para todas as ações CRUD

## 🔒 Validações Implementadas

### Backend (API)
- ✅ Todos os campos obrigatórios
- ✅ Validação de formato de email
- ✅ Verificação de email duplicado
- ✅ Sanitização de dados de entrada
- ✅ Tratamento de erros com mensagens claras

### Frontend
- ✅ Validação HTML5 nativa
- ✅ Feedback visual imediato
- ✅ Prevenção de submissão com dados inválidos

## 📱 Capturas de Tela

A interface inclui:
- Lista de contatos em cards responsivos
- Formulário modal para criar/editar
- Barra de busca com filtro em tempo real
- Confirmação de exclusão
- Toasts de feedback para todas as operações

## 🚀 Próximos Passos (Roadmap)

Para uma implementação completa em produção, considere:

- [ ] Integração real com MySQL
- [ ] Autenticação JWT
- [ ] Paginação para grandes volumes
- [ ] Upload de avatar
- [ ] Testes unitários e de integração
- [ ] Docker para containerização
- [ ] Deploy em produção (Vercel/Railway)
- [ ] Área de relatórios
- [ ] Backup automático

## 👨‍💻 Desenvolvedor

Desenvolvido seguindo as melhores práticas de:
- Clean Code e organização
- TypeScript para type safety
- Validações robustas
- UX/UI intuitiva
- Arquitetura escalável

---

**Nota**: Esta é uma demonstração técnica. Para uso em produção, implemente as funcionalidades de segurança e persistência adequadas.
\`\`\`
