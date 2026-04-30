import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Markdown from 'react-markdown'
import { getPostBySlug } from '../lib/db'
import type { Post } from '../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function PostPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    getPostBySlug(slug)
      .then(p => {
        if (!p) setNotFound(true)
        else setPost(p)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Botão voltar estilo terminal */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-green-400 hover:text-green-300 transition-colors mb-10"
        >
          <span className="text-green-500">{'>'}</span>
          <span>voltar</span>
        </button>

        {loading && (
          <p className="text-xs text-[#333]">carregando<span className="animate-pulse">...</span></p>
        )}

        {notFound && (
          <p className="text-xs text-[#555]">post não encontrado.</p>
        )}

        {post && (
          <>
            {/* Três bolinhas macOS */}
            <div className="flex items-center gap-1.5 mb-7">
              <div className="w-3 h-3 rounded-full bg-[#ff605c]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd44]" />
              <div className="w-3 h-3 rounded-full bg-[#00ca4e]" />
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold leading-snug text-white mb-3">
              <span className="text-green-400 mr-2">{'>'}</span>
              {post.titulo}
            </h1>

            {/* Data */}
            <p className="text-sm text-[#555] mb-8">
              {formatDate(post.criado_em)}
            </p>

            {/* Conteúdo markdown */}
            <div className="border border-[#1e1e1e] rounded bg-[#0d0d0d] px-6 py-6 prose">
              <Markdown
                components={{
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-green-400 hover:text-green-300 border-b border-green-400/30 hover:border-green-300"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                }}
              >
                {post.conteudo_md}
              </Markdown>
            </div>

            {/* Rodapé */}
            <div className="mt-10 pt-6 border-t border-[#111]">
              <button
                onClick={() => navigate('/')}
                className="text-xs text-[#444] hover:text-[#666] transition-colors"
              >
                ← todos os posts
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
