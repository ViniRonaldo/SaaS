<div align="center">

# FilaSaude

### Sistema Inteligente de Gestao de Filas e Agendamentos para a Saude Publica

**Prefeitura Municipal de Bambui - MG**

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-316192?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

</div>

---

## Sobre

O **FilaSaude** e um sistema SaaS completo para gestao de filas, agendamentos e atendimentos nas unidades de saude publica do municipio de Bambui-MG. Desenvolvido com tecnologias modernas e arquitetura escalavel, o sistema resolve problemas reais como longas esperas, consultas perdidas e falta de informacao para o cidadao.

### Principais Funcionalidades

- **Fila Inteligente** - Priorizacao automatica (idosos, gestantes, PCD, emergencia) com painel em tempo real via WebSocket
- **Agendamento Digital** - Consultas, exames e vacinas com verificacao de disponibilidade e conflitos
- **Painel TV (Totem)** - Exibicao de senhas chamadas e proximas em paineis nas unidades
- **Notificacoes** - Alertas via WhatsApp/SMS (Twilio) para lembretes e chamadas
- **Dashboard Administrativo** - Indicadores em tempo real, graficos e relatorios
- **Multi-Unidade** - Suporte a multiplas UBS, UPA e centros de saude
- **Acessibilidade** - Modo idoso (fonte grande), alto contraste, navegacao simplificada
- **Seguranca LGPD** - Criptografia, auditoria, controle de acesso por perfil

---

## Arquitetura

```
filasaude/
├── apps/
│   ├── api/          # NestJS Backend (REST + WebSocket)
│   └── web/          # Next.js 15 Frontend (App Router)
├── packages/
│   ├── types/        # TypeScript types compartilhados
│   └── config/       # Configuracoes compartilhadas
├── docker-compose.yml
├── turbo.json
└── README.md
```

### Stack Tecnologica

| Camada     | Tecnologias                                              |
| ---------- | -------------------------------------------------------- |
| Frontend   | Next.js 15, React 19, TailwindCSS, Shadcn/UI, Zustand   |
| Backend    | NestJS, Prisma ORM, PostgreSQL, Redis, JWT, WebSocket    |
| Infra      | Docker, Docker Compose, GitHub Actions CI/CD             |
| Qualidade  | TypeScript Strict, ESLint, Prettier, Turbo               |

### Padroes de Projeto

- Clean Architecture
- SOLID Principles
- Domain-Driven Design (DDD)
- Repository Pattern
- Service Layer
- DTO Pattern
- Modular Architecture

---

## Pre-requisitos

- **Node.js** >= 20
- **npm** >= 10
- **Docker** e **Docker Compose** (para banco de dados)
- **PostgreSQL** 16+ (ou via Docker)
- **Redis** 7+ (ou via Docker)

---

## Instalacao

### 1. Clonar o repositorio

```bash
git clone https://github.com/prefeitura-bambui/filasaude.git
cd filasaude
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Subir banco de dados e Redis

```bash
docker-compose up -d postgres redis
```

### 4. Configurar variaveis de ambiente

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local
```

Edite `apps/api/.env` com suas credenciais:

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/filasaude?schema=public
REDIS_URL=redis://localhost:6379
JWT_SECRET=sua-chave-secreta
JWT_REFRESH_SECRET=sua-chave-refresh
PORT=3333
```

### 5. Rodar migrations e seed

```bash
cd apps/api
npx prisma migrate dev --name init
npx prisma generate
cd ../..
```

### 6. Iniciar em desenvolvimento

```bash
npm run dev
```

| Servico    | URL                           |
| ---------- | ----------------------------- |
| Frontend   | http://localhost:3000          |
| Backend    | http://localhost:3333          |
| Swagger    | http://localhost:3333/api/docs |

---

## Docker (Producao)

```bash
docker-compose up -d --build
```

Todos os servicos (PostgreSQL, Redis, API, Web) serao iniciados automaticamente.

---

## Modulos da API

| Modulo          | Endpoints                  | Descricao                           |
| --------------- | -------------------------- | ----------------------------------- |
| Auth            | `/api/v1/auth/*`           | Login, registro, refresh, logout    |
| Users           | `/api/v1/users/*`          | CRUD de usuarios com RBAC           |
| Patients        | `/api/v1/patients/*`       | Gestao de pacientes e prontuarios   |
| Queues          | `/api/v1/queues/*`         | Filas, senhas, chamada, painel TV   |
| Appointments    | `/api/v1/appointments/*`   | Agendamentos e horarios disponiveis |
| Health Units    | `/api/v1/health-units/*`   | Unidades de saude e horarios        |
| Notifications   | `/api/v1/notifications/*`  | Notificacoes do usuario             |
| Dashboard       | `/api/v1/dashboard/*`      | Indicadores e estatisticas          |

### Perfis de Acesso (RBAC)

| Perfil        | Permissoes                                          |
| ------------- | --------------------------------------------------- |
| PATIENT       | Ver propria fila, agendamentos e notificacoes       |
| RECEPTIONIST  | Gerenciar filas, senhas e agendamentos               |
| DOCTOR        | Chamar senhas, visualizar pacientes                  |
| NURSE         | Chamar senhas, triagem                               |
| ADMIN         | Acesso total ao sistema                              |
| PREFECTURE    | Dashboard, relatorios e gestao de unidades           |

---

## Banco de Dados (Prisma)

Modelos principais: `User`, `Patient`, `HealthUnit`, `Queue`, `QueueTicket`, `Appointment`, `MedicalRecord`, `Notification`, `AuditLog`, `OperatingHours`.

```bash
npx prisma studio --schema=apps/api/prisma/schema.prisma
```

---

## Scripts

```bash
npm run dev          # Inicia frontend + backend em dev
npm run build        # Build de producao
npm run lint         # Lint em todos os workspaces
npm run format       # Formata com Prettier
```

---

## Licenca

Propriedade da **Prefeitura Municipal de Bambui - MG**. Todos os direitos reservados.

---

<div align="center">

Desenvolvido com dedicacao para a saude publica de **Bambui - MG**

</div>