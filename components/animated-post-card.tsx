"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { PostCard } from "./post-card"
import { WordPressPost } from "@/lib/wordpress"

interface AnimatedPostCardProps {
  post: WordPressPost
  index: number
}

export function AnimatedPostCard({ post, index }: AnimatedPostCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.from(entry.target, {
              opacity: 0,
              y: 50,
              duration: 0.6,
              delay: index * 0.1,
              ease: "power2.out",
            })
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(cardRef.current)

    return () => {
      observer.disconnect()
    }
  }, [index])

  return (
    <div ref={cardRef}>
      <PostCard post={post} />
    </div>
  )
}

