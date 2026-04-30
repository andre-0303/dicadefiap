# Dica da FIAP

Plataforma de dicas para estudantes da FIAP — visual estilo terminal/hacker (dark mode, fonte monospace), inspirado no dicadeia.com.

## Sobre o Projeto

Blog de conteúdo com artigos sobre:

- Rotina de estudos na FIAP
- Como funcionam os Challenges
- Sistema de notas e avaliações
- Como conseguir GitHub Education
- Livros de programação gratuitos
- Ferramentas úteis

## Stack

| Camada         | Tecnologia                                |
|----------------|-------------------------------------------|
| Frontend       | React 19 + Vite + TypeScript              |
| CSS            | Tailwind CSS v4                           |
| Banco de dados | Neon (PostgreSQL serverless)              |
| Roteamento     | React Router v6                           |
| Markdown       | react-markdown                            |
| Deploy         | VPS Hetzner + PM2 + Nginx + Let's Encrypt |

## Comandos

```bash
npm run dev       # Inicia servidor de desenvolvimento (http://localhost:5173)
npm run build     # Type-check + build de produção (saída em dist/)
npm run lint      # Executa ESLint em todos os arquivos .ts/.tsx
npm run preview   # Serve o build de produção localmente
```

## Estrutura de Pastas

```text
src/
├── pages/
│   ├── Home.tsx
│   ├── Post.tsx
│   ├── Category.tsx
│   └── Admin/
│       ├── Login.tsx
│       ├── Dashboard.tsx
│       ├── NewPost.tsx
│       └── EditPost.tsx
├── components/
│   ├── Header.tsx
│   ├── PostCard.tsx
│   ├── MarkdownEditor.tsx
│   └── MarkdownPreview.tsx
├── hooks/
│   └── useAdmin.ts
├── types/
│   └── index.ts
├── lib/
│   └── db.ts
└── App.tsx
```

## Banco de Dados (Neon)

Schema em `migrations/001_init.sql`. Tabelas: `posts`, `categorias`, `admin_session`.

Categorias padrão: Rotina de Estudos, Challenges, Notas & Avaliações, GitHub Education, Livros & Links, Ferramentas.

## Painel Admin

Acesse `/admin` e insira a senha definida em `VITE_ADMIN_PASSWORD`. Sessão válida por 7 dias via `localStorage`.

## Status do Projeto

- [x] Planejamento e stack definidos
- [x] Fase 1: Setup inicial + banco de dados
- [x] Fase 2: Frontend público (Home, Post, Category)
- [x] Fase 3: Painel admin (Login, Dashboard, Editor)
- [ ] Fase 4: Deploy em VPS
