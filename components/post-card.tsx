"use client"

import Link from "next/link"
import Image from "next/image"
import { Calendar, User, CircleArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { WordPressPost, getFeaturedImage, getImageAlt } from "@/lib/wordpress"
import { formatDate } from "@/lib/utils"

interface PostCardProps {
  post: WordPressPost
}

export function PostCard({ post }: PostCardProps) {
  const featuredImage = getFeaturedImage(post)
  const imageAlt = getImageAlt(post)
  const excerpt = post.excerpt?.rendered
    ? post.excerpt.rendered.replace(/<[^>]*>/g, '').substring(0, 150)
    : ''

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-gray-900 border-gray-800 text-white">
      {featuredImage && (
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <Image
            src={featuredImage}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="line-clamp-2 group-hover:text-[#B5FF00] transition-colors text-white">
          <Link href={`/posts/${post.slug}`}>
            {post.title.rendered}
          </Link>
        </CardTitle>
        <CardDescription className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/70">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDate(post.date)}
          </span>
          {post._embedded?.author?.[0] && (
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {post._embedded.author[0].name}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {excerpt && (
          <p className="text-sm text-white/70 mb-4 line-clamp-3">
            {excerpt}...
          </p>
        )}
        <Button 
          asChild 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:text-[#B5FF00] group"
        >
          <Link href={`/posts/${post.slug}`} className="flex items-center gap-2">
            <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
            <span className="uppercase font-medium">Read More</span>
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

