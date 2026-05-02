import { useParams } from 'react-router-dom'
import Header from '../components/Header'
import PostCard from '../components/PostCard'
import { SkeletonPostList } from '../components/Skeleton'
import { getPosts, getPostBySlug } from '../lib/db'
import { fetchWithCache } from '../lib/cache'
import { useQuery } from '../hooks/useQuery'

export default function Home() {
  const { slug: categorySlug } = useParams<{ slug?: string }>()

  const { data: posts, loading, error } = useQuery(
    `posts:${categorySlug ?? '__all__'}`,
    () => getPosts(categorySlug),
    [categorySlug]
  )

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-2xl mx-auto px-4">
        <Header />

        <main className="pb-20">
          {loading && <SkeletonPostList count={5} />}

          {error && (
            <p className="text-center text-xs text-red-500/60 py-12 font-mono">
              {error}
            </p>
          )}

          {!loading && !error && (posts ?? []).length === 0 && (
            <p className="text-center text-xs text-[#333] py-12 font-mono">
              nenhum post publicado ainda.
            </p>
          )}

          {!loading && !error && (posts ?? []).map(post => (
            <PostCard
              key={post.id}
              post={post}
              onPrefetch={() => fetchWithCache(`post:${post.slug}`, () => getPostBySlug(post.slug))}
            />
          ))}
        </main>

        <footer className="py-8 text-center text-[10px] text-[#222] font-mono">
          © {new Date().getFullYear()} dica da fiap
        </footer>
      </div>
    </div>
  )
}
