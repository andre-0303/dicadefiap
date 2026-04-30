export type Category = {
  id: string
  nome: string
  slug: string
  cor: string
}

export type Post = {
  id: string
  numero: number
  titulo: string
  slug: string
  conteudo_md: string
  categoria_id: string | null
  publicado: boolean
  criado_em: string
  atualizado_em: string
  // joined from categorias
  categoria_nome?: string
  categoria_slug?: string
  categoria_cor?: string
}

export type PostInput = {
  titulo: string
  slug: string
  conteudo_md: string
  categoria_id: string | null
  publicado: boolean
}
