"use client"

import { useEffect, useRef, useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { gsap } from "gsap"

interface PostContentProps {
  content: string
}

export function PostContent({ content }: PostContentProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [images, setImages] = useState<Array<{ src: string; alt: string }>>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    if (!contentRef.current) return

    // Extract images from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const imgElements = doc.querySelectorAll("img")

    const extractedImages = Array.from(imgElements).map((img) => ({
      src: img.src || img.getAttribute("src") || "",
      alt: img.alt || "",
    }))

    setImages(extractedImages)

    // Add click handlers to images
    const imagesInDOM = contentRef.current.querySelectorAll("img")
    imagesInDOM.forEach((img, index) => {
      img.style.cursor = "pointer"
      img.addEventListener("click", () => {
        setLightboxIndex(index)
        setLightboxOpen(true)
      })
    })

    // GSAP animation for content
    gsap.from(contentRef.current.children, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
    })

    return () => {
      imagesInDOM.forEach((img) => {
        img.removeEventListener("click", () => {})
      })
    }
  }, [content])

  return (
    <>
      <div
        ref={contentRef}
        className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-p:text-base prose-p:leading-7 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-img:shadow-lg prose-img:cursor-pointer prose-img:transition-transform hover:prose-img:scale-[1.02] prose-img:my-8 prose-ul:list-disc prose-ol:list-decimal prose-li:my-2"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={images.map((img) => ({
          src: img.src,
          alt: img.alt,
        }))}
      />
    </>
  )
}

