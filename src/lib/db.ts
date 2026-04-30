import { neon } from '@neondatabase/serverless'
import type { Post, Category, PostInput } from '../types'

const sql = neon(import.meta.env.VITE_DATABASE_URL)

export async function getPosts(categorySlug?: string): Promise<Post[]> {
  const rows = categorySlug
    ? await sql`
        SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, c.cor as categoria_cor
        FROM posts p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.publicado = true AND c.slug = ${categorySlug}
        ORDER BY p.numero DESC
      `
    : await sql`
        SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, c.cor as categoria_cor
        FROM posts p
        LEFT JOIN categorias c ON p.categoria_id = c.id
        WHERE p.publicado = true
        ORDER BY p.numero DESC
      `
  return rows as Post[]
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const rows = await sql`
    SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, c.cor as categoria_cor
    FROM posts p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    WHERE p.slug = ${slug} AND p.publicado = true
  `
  return (rows[0] as Post) ?? null
}

export async function getCategories(): Promise<Category[]> {
  const rows = await sql`SELECT * FROM categorias ORDER BY nome`
  return rows as Category[]
}

// --- Admin ---

export async function getAllPosts(): Promise<Post[]> {
  const rows = await sql`
    SELECT p.*, c.nome as categoria_nome, c.slug as categoria_slug, c.cor as categoria_cor
    FROM posts p
    LEFT JOIN categorias c ON p.categoria_id = c.id
    ORDER BY p.numero DESC
  `
  return rows as Post[]
}

export async function createPost(input: PostInput): Promise<Post> {
  const rows = await sql`
    INSERT INTO posts (titulo, slug, conteudo_md, categoria_id, publicado)
    VALUES (${input.titulo}, ${input.slug}, ${input.conteudo_md}, ${input.categoria_id}, ${input.publicado})
    RETURNING *
  `
  return rows[0] as Post
}

export async function updatePost(id: string, input: Partial<PostInput>): Promise<Post> {
  const rows = await sql`
    UPDATE posts SET
      titulo = COALESCE(${input.titulo ?? null}, titulo),
      slug = COALESCE(${input.slug ?? null}, slug),
      conteudo_md = COALESCE(${input.conteudo_md ?? null}, conteudo_md),
      categoria_id = COALESCE(${input.categoria_id ?? null}, categoria_id),
      publicado = COALESCE(${input.publicado ?? null}, publicado),
      atualizado_em = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  return rows[0] as Post
}

export async function deletePost(id: string): Promise<void> {
  await sql`DELETE FROM posts WHERE id = ${id}`
}

export async function togglePublish(id: string, publicado: boolean): Promise<void> {
  await sql`UPDATE posts SET publicado = ${publicado}, atualizado_em = NOW() WHERE id = ${id}`
}
