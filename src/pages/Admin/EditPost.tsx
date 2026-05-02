import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PostForm from './PostForm'
import { getAllPosts, updatePost, deletePost } from '../../lib/db'
import { invalidate } from '../../lib/cache'
import type { Post, PostInput } from '../../types'

function checkAuth(): boolean {
  const token = localStorage.getItem('admin_token')
  if (!token) return false
  return Date.now() - parseInt(token) < 7 * 24 * 60 * 60 * 1000
}

export default function EditPost() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!checkAuth()) { navigate('/admin'); return }
    if (!id) return
    // getAllPosts já é admin-only (retorna todos, publicados ou não)
    getAllPosts()
      .then(posts => {
        const found = posts.find(p => p.id === id)
        if (!found) navigate('/admin/posts')
        else setPost(found)
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-mono flex items-center justify-center">
        <p className="text-xs text-[#333]">carregando<span className="animate-pulse">...</span></p>
      </div>
    )
  }

  if (!post) return null

  return (
    <PostForm
      title="editar post"
      initialValues={{
        titulo: post.titulo,
        slug: post.slug,
        conteudo_md: post.conteudo_md,
        categoria_id: post.categoria_id,
        publicado: post.publicado,
      }}
      onSave={(data: PostInput) => updatePost(post.id, data).then(() => {
        invalidate('posts:')
        invalidate(`post:${post.slug}`)
      })}
      onDelete={() => deletePost(post.id).then(() => {
        invalidate('posts:')
        invalidate(`post:${post.slug}`)
      })}
    />
  )
}
