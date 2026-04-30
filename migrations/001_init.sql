CREATE TABLE IF NOT EXISTS categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  cor TEXT NOT NULL DEFAULT '#a78bfa'
);

CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero SERIAL UNIQUE,
  titulo TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  conteudo_md TEXT NOT NULL DEFAULT '',
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  publicado BOOLEAN NOT NULL DEFAULT false,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  atualizado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_session (
  token TEXT PRIMARY KEY,
  criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
  expira_em TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '7 days'
);

INSERT INTO categorias (nome, slug, cor) VALUES
  ('Rotina de Estudos', 'rotina', '#4ade80'),
  ('Challenges', 'challenges', '#a78bfa'),
  ('Notas & Avaliações', 'notas', '#fb923c'),
  ('GitHub Education', 'github', '#38bdf8'),
  ('Livros & Links', 'livros', '#fbbf24'),
  ('Ferramentas', 'ferramentas', '#f472b6')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO posts (titulo, slug, conteudo_md, categoria_id, publicado) VALUES (
  'Bem-vindo ao Dica da FIAP',
  'bem-vindo',
  '# Bem-vindo ao Dica da FIAP

Este é o primeiro post da plataforma. Aqui você vai encontrar dicas práticas para sobreviver (e prosperar) na FIAP.

## O que você vai encontrar aqui

- **Rotina de estudos** — como organizar seu tempo e não se afogar nas matérias
- **Challenges** — como funciona o sistema de projetos práticos da FIAP
- **Notas** — como é calculada a nota final e o que conta pra recuperação
- **GitHub Education** — como conseguir o Student Pack e usar tudo de graça
- **Livros & Links** — recursos gratuitos pra cada linguagem e área
- **Ferramentas** — o que instalar no seu computador antes de começar o semestre

## Por que isso existe?

A FIAP tem um jeito próprio de funcionar e muita coisa não está escrita em lugar nenhum. Esse site é o manual não-oficial que eu gostaria de ter tido quando entrei.

Boa leitura.',
  (SELECT id FROM categorias WHERE slug = 'rotina'),
  true
) ON CONFLICT (slug) DO NOTHING;
