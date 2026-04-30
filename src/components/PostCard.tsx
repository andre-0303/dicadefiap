import { Link } from 'react-router-dom'
import type { Post } from '../types'

type Props = {
  post: Post
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

export default function PostCard({ post }: Props) {
  const num = String(post.numero).padStart(2, '0')

  return (
    <Link
      to={`/post/${post.slug}`}
      className="group flex items-baseline gap-0 py-3 px-2 border-b border-[#111] hover:bg-[#0d0d0d] transition-colors duration-100"
    >
      {/* Número */}
      <span className="shrink-0 w-8 text-sm text-[#333] group-hover:text-[#555] transition-colors">
        {num}
      </span>

      {/* Separador */}
      <span className="shrink-0 mr-3 text-sm text-[#333] group-hover:text-[#555] transition-colors">
        //
      </span>

      {/* Título + meta */}
      <span className="flex-1 min-w-0">
        <span className="text-sm text-[#d4d4d4] group-hover:text-white transition-colors break-words">
          {post.titulo}
        </span>
        {post.categoria_nome && (
          <span
            className="ml-2 text-[10px] opacity-60"
            style={{ color: post.categoria_cor }}
          >
            [{post.categoria_nome}]
          </span>
        )}
        <span className="ml-2 text-[10px] text-[#333]">
          {formatDate(post.criado_em)}
        </span>
      </span>

      {/* Seta */}
      <span className="shrink-0 ml-3 text-sm text-[#333] group-hover:text-accent transition-all duration-150 group-hover:translate-x-0.5">
        →
      </span>
    </Link>
  )
}
