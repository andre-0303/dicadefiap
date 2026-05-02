function SkeletonPostCard() {
  return (
    <div className="flex items-center gap-4 px-5 py-4 mb-3 border border-[#1a1a1a] rounded animate-pulse">
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
      </div>
      <div className="w-6 h-3 rounded bg-[#1a1a1a] shrink-0" />
      <div className="w-5 h-3 rounded bg-[#141414] shrink-0" />
      <div className="flex-1 h-3 rounded bg-[#1a1a1a]" style={{ maxWidth: '75%' }} />
      <div className="w-3 h-3 rounded bg-[#141414] shrink-0" />
    </div>
  )
}

export function SkeletonPostList({ count = 5 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <SkeletonPostCard key={i} />
      ))}
    </>
  )
}

export function SkeletonPostPage() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-1.5 mb-7">
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
        <div className="w-3 h-3 rounded-full bg-[#1a1a1a]" />
      </div>

      <div className="w-2/3 h-6 rounded bg-[#1a1a1a] mb-3" />
      <div className="w-1/4 h-3 rounded bg-[#141414] mb-8" />

      <div className="border border-[#1e1e1e] rounded bg-[#0d0d0d] px-6 py-6 space-y-3">
        <div className="h-3 rounded bg-[#1a1a1a] w-full" />
        <div className="h-3 rounded bg-[#1a1a1a] w-5/6" />
        <div className="h-3 rounded bg-[#1a1a1a] w-4/5" />
        <div className="h-3 rounded bg-[#141414] w-1/2 mt-5" />
        <div className="h-3 rounded bg-[#1a1a1a] w-full" />
        <div className="h-3 rounded bg-[#1a1a1a] w-3/4" />
      </div>
    </div>
  )
}
