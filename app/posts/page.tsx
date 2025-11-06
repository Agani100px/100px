import { fetchWordPressPosts } from "@/lib/wordpress"
import { PostCard } from "@/components/post-card"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Posts",
  description: "Browse all posts from our WordPress headless CMS",
}

export default async function PostsPage() {
  const posts = await fetchWordPressPosts({ per_page: 12 })

  return (
    <div className="bg-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="mb-8 sm:mb-12 text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
          All Posts
        </h1>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 sm:py-16">
          <p className="text-lg text-muted-foreground mb-4">
            No posts found. Please configure your WordPress API URL in .env.local
          </p>
        </div>
      )}
      </div>
    </div>
  )
}

