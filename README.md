# 🎬 Sistema de Reservas de Ingressos de Cinema

Este é um sistema full stack para **reserva de ingressos de cinema**, onde usuários podem escolher filmes, sessões e assentos, realizar reservas com nome e CPF, visualizar bilhetes e até gerenciar/remover suas reservas.

---

## 🧩 Tecnologias Utilizadas

### 🔹 Front-end (React + Vite)
- React 
- Vite
- React Router DOM
- SCSS (modularizado)
- JavaScript (ES6+)

### 🔹 Back-end (Node.js + Express)
- Node.js
- Express.js
- Prisma ORM
- SQLite (banco de dados local)

### 🔹 Banco de Dados
- SQLite (via Prisma)

#### Estrutura das Tabelas:
- `Movie`
- `Session`
- `Seat`
- `User`

---

## 📁 Estrutura de Pastas

```bash
/
├── frontend/         # Aplicação React (interface do usuário)
└── backend/            # API Node.js + Express + Prisma
    └── prisma/         # Schema e migrações do banco de dados

👨‍💻 Desenvolvido por
Renato
💼 GitHub: [github.com/renatoveludo]

Teste WebPage (Hospedado Vercel): https://cinema-ticketing-5o87p25r2-renato-veludos-projects.vercel.app/