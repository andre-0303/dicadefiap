import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllPosts, deletePost, togglePublish } from '../../lib/db'
import type { Post } from '../../types'

function checkAuth(): boolean {
  const token = localStorage.getItem('admin_token')
  if (!token) return false
  return Date.now() - parseInt(token) < 7 * 24 * 60 * 60 * 1000
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  })
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!checkAuth()) { navigate('/admin'); return }
    getAllPosts().then(setPosts).finally(() => setLoading(false))
  }, [navigate])

  async function handleToggle(post: Post) {
    await togglePublish(post.id, !post.publicado)
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, publicado: !p.publicado } : p))
  }

  async function handleDelete(post: Post) {
    if (!confirm(`Deletar "${post.titulo}"?`)) return
    await deletePost(post.id)
    setPosts(prev => prev.filter(p => p.id !== post.id))
  }

  function handleLogout() {
    localStorage.removeItem('admin_token')
    navigate('/admin')
  }

  return (
    <div className="min-h-screen bg-black font-mono">
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header admin */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#ff605c]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd44]" />
              <div className="w-2.5 h-2.5 rounded-full bg-[#00ca4e]" />
            </div>
            <h1 className="text-sm font-bold text-white">
              <span className="text-green-400 mr-2">{'>'}</span>
              dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/posts/new"
              className="text-xs px-3 py-1.5 border border-[#2a2a2a] hover:border-green-400/40 hover:text-green-400 text-[#888] rounded transition-colors"
            >
              + novo post
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs text-[#444] hover:text-[#777] transition-colors"
            >
              sair
            </button>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex items-center gap-2 text-xs text-[#444] mb-6">
          <Link to="/" className="hover:text-[#777] transition-colors">home</Link>
          <span>/</span>
          <span className="text-[#666]">admin</span>
          <span>/</span>
          <span className="text-[#666]">posts</span>
        </div>

        {loading && (
          <p className="text-xs text-[#333]">carregando<span className="animate-pulse">...</span></p>
        )}

        {!loading && posts.length === 0 && (
          <p className="text-xs text-[#444]">nenhum post ainda.</p>
        )}

        {!loading && posts.length > 0 && (
          <div className="border border-[#1a1a1a] rounded overflow-hidden">
            {posts.map(post => (
              <div
                key={post.id}
                className="flex flex-col gap-2 px-4 py-3.5 border-b border-[#111] last:border-0 hover:bg-[#0a0a0a] transition-colors"
              >
                {/* Título */}
                <span className="text-sm text-white">{post.titulo}</span>

                {/* Metadados abaixo do título */}
                <div className="flex items-center gap-3 flex-wrap">
                  {/* Categoria */}
                  {post.categoria_slug ? (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded border"
                      style={{
                        color: post.categoria_cor ?? '#555',
                        borderColor: (post.categoria_cor ?? '#555') + '44',
                      }}
                    >
                      {post.categoria_slug}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#333]">sem categoria</span>
                  )}

                  {/* Data */}
                  <span className="text-[10px] text-[#444]">{formatDate(post.criado_em)}</span>

                  {/* Status */}
                  <button
                    onClick={() => handleToggle(post)}
                    className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                      post.publicado
                        ? 'text-green-400 border-green-400/30 hover:bg-green-400/10'
                        : 'text-[#555] border-[#222] hover:text-[#888]'
                    }`}
                  >
                    {post.publicado ? 'público' : 'rascunho'}
                  </button>

                  {/* Ações */}
                  <div className="flex items-center gap-2 ml-auto">
                    <Link
                      to={`/admin/posts/${post.id}/edit`}
                      className="text-[10px] text-[#555] hover:text-white transition-colors"
                    >
                      editar
                    </Link>
                    <button
                      onClick={() => handleDelete(post)}
                      className="text-[10px] text-[#555] hover:text-red-400 transition-colors"
                    >
                      deletar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-[10px] text-[#2a2a2a]">
          {posts.length} post{posts.length !== 1 ? 's' : ''} no total
        </p>
      </div>
    </div>
  )
}
