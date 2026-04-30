import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import { getPosts } from '../lib/db'
import type { Post } from '../types'

export default function Home() {
  const { slug: categorySlug } = useParams<{ slug?: string }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    getPosts(categorySlug)
      .then(setPosts)
      .catch(err => {
        console.error(err)
        setError('Erro ao carregar posts.')
      })
      .finally(() => setLoading(false))
  }, [categorySlug])

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4">
        <Header />

        <main className="pb-20">
          {loading && (
            <p className="text-center text-xs text-[#333] py-12 font-mono">
              carregando<span className="animate-pulse">...</span>
            </p>
          )}

          {error && (
            <p className="text-center text-xs text-red-500/60 py-12 font-mono">
              {error}
            </p>
          )}

          {!loading && !error && posts.length === 0 && (
            <p className="text-center text-xs text-[#333] py-12 font-mono">
              nenhum post publicado ainda.
            </p>
          )}

          {!loading && !error && posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </main>

        <footer className="py-8 text-center text-[10px] text-[#222] font-mono">
          © {new Date().getFullYear()} dica da fiap
        </footer>
      </div>
    </div>
  )
}
