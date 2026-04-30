# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev       # Inicia servidor de desenvolvimento (http://localhost:5173)
npm run build     # Type-check + build de produção (saída em dist/)
npm run lint      # Executa ESLint em todos os arquivos .ts/.tsx
npm run preview   # Serve o build de produção localmente
```

## Stack

- **React 19** + **TypeScript 6** via **Vite 8**
- **Tailwind CSS v4** — integrado pelo plugin `@tailwindcss/vite` (sem `tailwind.config.js` nem `postcss.config.js`)
- **React Router v6** — roteamento SPA com rotas protegidas (`/admin/*`)
- **react-markdown** — renderização de markdown nos posts
- **Neon (PostgreSQL serverless)** — banco de dados via connection string em `.env.local`
- ESLint com `typescript-eslint`, `eslint-plugin-react-hooks` e `eslint-plugin-react-refresh`

## Configuração do Tailwind CSS v4

O Tailwind é carregado como plugin Vite em [`vite.config.ts`](vite.config.ts):

```ts
import tailwindcss from '@tailwindcss/vite'
plugins: [react(), tailwindcss()]
```

A entrada CSS em [`src/index.css`](src/index.css) usa a sintaxe v4:

```css
@import "tailwindcss";
```

Não há arquivo de configuração separado do Tailwind — customizações de tema devem ser feitas via diretiva `@theme` dentro do CSS.

## TypeScript

O `tsconfig.app.json` usa `erasableSyntaxOnly: true` (TypeScript 6), o que significa que `enums` e `namespaces` não são permitidos — use objetos ou tipos literais no lugar.

Nunca use `any` — todos os dados do banco devem ter tipos definidos em `src/types/index.ts`.

## Projeto: Dica da FIAP

Blog de dicas para estudantes da FIAP com visual estilo terminal/hacker.

### Visual

Inspirado no dicadeia.com:

- Fundo `#000` / `#0a0a0a`
- Fonte monospace em todo o site (`font-mono`)
- Posts listados numerados com separador `//` e seta `→`
- Os três pontinhos 🔴🟡🟢 no topo (decoração de terminal)
- Cores de destaque: roxo `#a78bfa`, verde `#4caf50`, laranja `#ef9f27`

### Decisões Arquiteturais

- **Login admin simples**: senha única em `VITE_ADMIN_PASSWORD` (`.env.local`), sem JWT, token salvo em `localStorage` por 7 dias
- **Sem backend separado**: queries SQL executadas via Neon HTTP API ou pooler direto do frontend
- **Categorias como FK**: tabela `categorias` separada, posts têm `categoria_id`; filtro por `/categoria/:slug`
- **Markdown no frontend**: `react-markdown` renderiza `conteudo_md` armazenado no banco

### O Que NÃO Fazer

- NÃO usar Supabase Auth — login com senha em `.env` é suficiente
- NÃO criar backend Node separado ainda — frontend acessa Neon diretamente
- NÃO commitar `.env.local` — variáveis sensíveis ficam fora do git
- NÃO usar `enum` ou `namespace` TypeScript — use objetos ou tipos literais
- NÃO fazer deploy antes de testar Home + Category + Post localmente

### Schema do Banco

```sql
CREATE TABLE categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cor TEXT DEFAULT '#a78bfa'
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero SERIAL UNIQUE,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  conteudo_md TEXT NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  publicado BOOLEAN DEFAULT false,
  criado_em TIMESTAMP DEFAULT NOW(),
  atualizado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE admin_session (
  token TEXT PRIMARY KEY,
  criado_em TIMESTAMP DEFAULT NOW(),
  expira_em TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);
```

### Variáveis de Ambiente

```env
VITE_DATABASE_URL=postgresql://user:pass@ep-xxxxx.neon.tech/dica_da_fiap
VITE_ADMIN_PASSWORD=sua_senha_super_secreta_aqui
```
