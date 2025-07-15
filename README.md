# Sistema de Gerenciamento de Contatos

Sistema web fullstack para gerenciamento de contatos desenvolvido para equipes de vendas. Permite cadastrar, editar, consultar e excluir informações de clientes de forma rápida e eficiente.

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Next.js API Routes** (RESTful API)
- **MySQL** como banco de dados
- **mysql2** para conexão com o banco

### Frontend
- **React** com **TypeScript**
- **Next.js** (App Router)
- **Tailwind CSS** para estilização
- **shadcn/ui** para componentes
- **Lucide React** para ícones

## 📋 Funcionalidades

### API Endpoints
- \`POST /api/contacts\` → Criar contato
- \`GET /api/contacts\` → Listar todos os contatos
- \`PUT /api/contacts/:id\` → Atualizar contato existente
- \`DELETE /api/contacts/:id\` → Excluir contato

### Interface Web
- ✅ Listagem de contatos com informações organizadas
- ✅ Formulário para cadastro de novos contatos
- ✅ Edição de contatos existentes
- ✅ Exclusão de contatos com confirmação
- ✅ Validação de dados em tempo real
- ✅ Feedback visual para todas as operações
- ✅ Interface responsiva e intuitiva

### Validações Implementadas
- ✅ Todos os campos são obrigatórios
- ✅ Validação de formato de email
- ✅ Verificação de email único
- ✅ Validações no frontend e backend
- ✅ Tratamento de erros com mensagens claras

## 🛠️ Configuração e Instalação

### Pré-requisitos
- Node.js (versão 18 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

### 1. Clone o repositório
\`\`\`bash
git clone <repository-url>
cd contact-management-system
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
# ou
yarn install
\`\`\`

### 3. Configure o banco de dados

#### Opção A: Configuração manual
1. Crie um banco MySQL
2. Execute o script SQL:
\`\`\`bash
mysql -u root -p < scripts/setup-database.sql
\`\`\`

#### Opção B: Via linha de comando MySQL
\`\`\`sql
mysql -u root -p
CREATE DATABASE contact_management;
USE contact_management;
source scripts/setup-database.sql;
\`\`\`

### 4. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env
\`\`\`

Edite o arquivo \`.env\` com suas configurações:
\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=contact_management
DB_PORT=3306
\`\`\`

### 5. Execute a aplicação

#### Desenvolvimento
\`\`\`bash
npm run dev
# ou
yarn dev
\`\`\`

#### Produção
\`\`\`bash
npm run build
npm start
# ou
yarn build
yarn start
\`\`\`

A aplicação estará disponível em: \`http://localhost:3000\`

## 📊 Estrutura do Banco de Dados

### Tabela: contacts
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | INT (PK, AUTO_INCREMENT) | Identificador único |
| name | VARCHAR(255) NOT NULL | Nome do contato |
| email | VARCHAR(255) NOT NULL UNIQUE | Email do contato |
| phone | VARCHAR(50) NOT NULL | Telefone do contato |
| created_at | TIMESTAMP | Data de criação |
| updated_at | TIMESTAMP | Data da última atualização |

### Índices
- \`idx_email\` - Índice no campo email para buscas rápidas
- \`idx_created_at\` - Índice na data de criação para ordenação

## 🏗️ Arquitetura do Projeto

\`\`\`
contact-management-system/
├── app/
│   ├── api/
│   │   └── contacts/
│   │       ├── route.ts          # GET, POST /api/contacts
│   │       └── [id]/
│   │           └── route.ts      # PUT, DELETE /api/contacts/:id
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Interface principal
├── components/
│   └── ui/                       # Componentes shadcn/ui
├── scripts/
│   └── setup-database.sql        # Script de criação do banco
├── .env.example
├── package.json
└── README.md
\`\`\`

## 🔒 Validações e Segurança

### Backend
- Validação de tipos de dados
- Sanitização de inputs
- Verificação de email único
- Tratamento de erros SQL
- Validação de IDs numéricos

### Frontend
- Validação em tempo real
- Confirmação para exclusões
- Feedback visual para operações
- Tratamento de estados de loading
- Validação de formato de email

## 🚀 Scripts Disponíveis

- \`npm run dev\` - Inicia o servidor de desenvolvimento
- \`npm run build\` - Gera build de produção
- \`npm start\` - Inicia servidor de produção
- \`npm run lint\` - Executa linting do código
- \`npm run type-check\` - Verifica tipos TypeScript

## 📱 Interface do Usuário

### Características da UI/UX
- **Design Responsivo**: Funciona em desktop, tablet e mobile
- **Feedback Visual**: Toasts para sucesso/erro das operações
- **Confirmações**: Diálogos de confirmação para ações destrutivas
- **Estados de Loading**: Indicadores visuais durante operações
- **Validação em Tempo Real**: Feedback imediato nos formulários
- **Acessibilidade**: Componentes com suporte a screen readers

### Componentes Principais
- **Tabela de Contatos**: Listagem organizada com ações
- **Modal de Formulário**: Criação e edição de contatos
- **Sistema de Toasts**: Notificações de feedback
- **Botões de Ação**: Editar, excluir e criar contatos

## 🔧 Personalização

### Adicionando Novos Campos
1. Atualize a tabela no banco de dados
2. Modifique as interfaces TypeScript
3. Atualize as validações
4. Ajuste os formulários na interface

### Configurações de Banco
As configurações podem ser ajustadas via variáveis de ambiente no arquivo \`.env\`.

## 📈 Melhorias Futuras

- [ ] Paginação para grandes volumes de dados
- [ ] Filtros e busca avançada
- [ ] Importação/exportação de contatos
- [ ] Histórico de alterações
- [ ] Autenticação de usuários
- [ ] Logs de auditoria
- [ ] Backup automático

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (\`git checkout -b feature/nova-feature\`)
3. Commit suas mudanças (\`git commit -am 'Adiciona nova feature'\`)
4. Push para a branch (\`git push origin feature/nova-feature\`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 📞 Suporte

Para dúvidas ou suporte, entre em contato através dos issues do GitHub.
\`\`\`
