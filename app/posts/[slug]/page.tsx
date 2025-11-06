import { fetchWordPressPost, fetchWordPressPosts } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Calendar, User, ArrowLeft, CircleArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { Metadata } from "next"
import { PostContent } from "@/components/post-content"

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await fetchWordPressPosts({ per_page: 100 })
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await fetchWordPressPost(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url

  return {
    title: post.title.rendered,
    description: post.excerpt?.rendered
      ? post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)
      : post.title.rendered,
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt?.rendered
        ? post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)
        : post.title.rendered,
      images: featuredImage ? [featuredImage] : [],
      type: "article",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: post._embedded?.author?.[0]?.name
        ? [post._embedded.author[0].name]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title.rendered,
      description: post.excerpt?.rendered
        ? post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 160)
        : post.title.rendered,
      images: featuredImage ? [featuredImage] : [],
    },
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params
  const post = await fetchWordPressPost(slug)

  if (!post) {
    notFound()
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
  const imageAlt =
    post._embedded?.['wp:featuredmedia']?.[0]?.alt_text || post.title.rendered

  return (
    <article className="bg-black min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
      <Button
        asChild
        variant="ghost"
        className="mb-6 sm:mb-8"
      >
        <Link href="/posts" className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Posts
        </Link>
      </Button>

      <header className="mb-8 sm:mb-12">
        <h1 className="mb-4 sm:mb-6 text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
          {post.title.rendered}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDate(post.date)}
          </span>
          {post._embedded?.author?.[0] && (
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post._embedded.author[0].name}
            </span>
          )}
        </div>

        {featuredImage && (
          <div className="relative w-full h-64 sm:h-96 lg:h-[500px] rounded-lg overflow-hidden mb-8">
            <Image
              src={featuredImage}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 896px"
            />
          </div>
        )}

        <Separator />
      </header>

      <PostContent content={post.content.rendered} />

      <Separator className="my-8 sm:my-12" />

      <footer className="text-center">
        <Button asChild variant="outline" className="group">
          <Link href="/posts" className="flex items-center gap-2">
            <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
            <span className="uppercase font-medium">View All Posts</span>
          </Link>
        </Button>
      </footer>
      </div>
    </article>
  )
}

