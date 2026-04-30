import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import { getPosts, getCategories } from '../lib/db'
import type { Post, Category } from '../types'

export default function Home() {
  const { slug: categorySlug } = useParams<{ slug?: string }>()
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    Promise.all([getPosts(categorySlug), getCategories()])
      .then(([p, c]) => {
        setPosts(p)
        setCategories(c)
      })
      .catch(err => {
        console.error(err)
        setError('Erro ao carregar posts. Tente novamente.')
      })
      .finally(() => setLoading(false))
  }, [categorySlug])

  const currentCategory = categorySlug
    ? categories.find(c => c.slug === categorySlug)
    : null

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto">
        <Header categories={categories} />

        <main className="px-6 pb-20">
          {currentCategory && (
            <div className="mb-4 flex items-center gap-2 text-xs text-[#525252]">
              <span>filtrando por</span>
              <span
                className="px-2 py-0.5 rounded border"
                style={{ color: currentCategory.cor, borderColor: currentCategory.cor + '44' }}
              >
                {currentCategory.nome}
              </span>
            </div>
          )}

          {loading && (
            <div className="py-12 text-center text-xs text-[#333]">
              carregando<span className="animate-pulse">...</span>
            </div>
          )}

          {error && (
            <div className="py-12 text-center text-xs text-red-500/70">
              {error}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-xs text-[#333]">nenhum post encontrado.</p>
              {categorySlug && (
                <p className="mt-1 text-xs text-[#333]">
                  tente outra categoria ou{' '}
                  <a href="/" className="text-accent hover:underline">veja todos</a>.
                </p>
              )}
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <div className="border border-[#111] rounded">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>

        <footer className="px-6 py-6 border-t border-[#111] text-center text-[10px] text-[#2a2a2a]">
          © {new Date().getFullYear()} dica da fiap — feito por estudantes, pra estudantes
        </footer>
      </div>
    </div>
  )
}
