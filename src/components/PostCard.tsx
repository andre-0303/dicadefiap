import { Link } from 'react-router-dom'
import type { Post } from '../types'

type Props = {
  post: Post
}

export default function PostCard({ post }: Props) {
  const num = String(post.numero).padStart(2, '0')

  return (
    <Link
      to={`/post/${post.slug}`}
      className="flex items-center gap-4 px-5 py-4 mb-3 border border-[#1a1a1a] rounded hover:border-[#333] transition-colors duration-100 group"
    >
      {/* Bolinhas estilo macOS */}
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#ff605c]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd44]" />
        <div className="w-3 h-3 rounded-full bg-[#00ca4e]" />
      </div>

      {/* Número */}
      <span className="shrink-0 text-sm font-bold text-[#fb923c]">
        {num}
      </span>

      {/* Separador */}
      <span className="shrink-0 text-sm text-[#444]">//</span>

      {/* Título */}
      <span className="flex-1 min-w-0 text-sm text-white truncate">
        {post.titulo}
      </span>

      {/* Seta */}
      <span className="shrink-0 text-sm text-[#555] group-hover:text-white transition-colors duration-100">
        →
      </span>
    </Link>
  )
}
