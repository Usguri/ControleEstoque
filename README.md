# Controle de Estoque

Aplicação web para gerenciamento de produtos, categorias, clientes, empresas e listas de compras. O projeto é dividido em uma API REST e uma interface web.

## Estrutura

```text
.
|-- backend/   # API NestJS, TypeORM e PostgreSQL
|-- frontend/  # Interface React, TypeScript e Vite
|-- .gitignore # Regras de ignore compartilhadas
`-- README.md
```

## Tecnologias

- **Backend:** NestJS, TypeScript, TypeORM, PostgreSQL e Swagger.
- **Frontend:** React, TypeScript, Vite, Material UI e Axios.
- **Gerenciador de pacotes:** pnpm, com lockfiles separados em cada aplicação.

## Requisitos

- Node.js e Corepack habilitados.
- pnpm.
- PostgreSQL em execução e um banco criado para a aplicação.

Ative o pnpm com `corepack enable` caso ainda não esteja disponível.

## Configuração

Crie `backend/.env` com as configurações do banco e da API:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=sua_senha
DB_NAME=controle_estoque
JWT_SECRET=defina_um_segredo_local
FRONTEND_URL=http://localhost:5173
PORT=3000
```

Crie previamente o banco `controle_estoque` no PostgreSQL. Em ambiente local, o TypeORM sincroniza o schema automaticamente; em produção, `NODE_ENV=production` desativa essa sincronização. Nunca publique o arquivo `.env` nem segredos reais.

## Instalação e execução

Instale as dependências de cada aplicação na raiz do projeto:

```bash
pnpm --dir backend install
pnpm --dir frontend install
```

Inicie o backend e o frontend em terminais separados:

```bash
pnpm --dir backend start:dev
```

```bash
pnpm --dir frontend dev
```

O frontend em modo de desenvolvimento usa a API em `http://localhost:3000`.

| Serviço  | Endereço local            |
| -------- | ------------------------- |
| Frontend | http://localhost:5173     |
| API      | http://localhost:3000     |
| Swagger  | http://localhost:3000/api |

## Comandos úteis

```bash
# Backend
pnpm --dir backend test
pnpm --dir backend test:e2e
pnpm --dir backend build

# Frontend
pnpm --dir frontend lint
pnpm --dir frontend build
```
