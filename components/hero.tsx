"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { CircleArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { gsap } from "gsap"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface HeroProps {
  preHeadline?: string
  headline?: string
  bodyText?: string
  heroImage?: string
  heroImageAlt?: string
  ctaText?: string
  ctaLink?: string
}

export function Hero({
  preHeadline = "Capturing Life's Precious Moments with Artistic Excellence",
  headline = "Your Story, Our Lens",
  bodyText = "From stunning portraits to timeless family memories, corporate headshots to vibrant fashion shoots—every image tells your unique story. Discover professional photography services in Colombo, designed to beautifully preserve your most cherished moments.",
  heroImage,
  heroImageAlt = "Hero background",
  ctaText = "BOOK YOUR SESSION",
  ctaLink = "#contact",
}: HeroProps) {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!heroRef.current) return

    // Animate text content using fromTo for reliable start/end states
    if (textRef.current && textRef.current.children.length > 0) {
      gsap.fromTo(
        textRef.current.children,
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          overwrite: true,
        }
      )
    }

    // Animate background image
    if (backgroundRef.current && heroImage) {
      gsap.fromTo(
        backgroundRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          overwrite: true,
        }
      )
    }

    return () => {
      // Cleanup any running animations
      if (textRef.current) {
        gsap.killTweensOf(textRef.current.children)
      }
      if (backgroundRef.current) {
        gsap.killTweensOf(backgroundRef.current)
      }
    }
  }, [heroImage, preHeadline, headline, bodyText])

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white"
    >
      {/* Background Image - Full Screen */}
      {heroImage ? (
        <div
          ref={backgroundRef}
          className="absolute inset-0 z-0 w-full h-full"
        >
          {/* Use regular img tag for local development */}
          <img
            src={heroImage}
            alt={heroImageAlt}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center' }}
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ) : (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          {/* Debug: Show if heroImage is missing */}
          {process.env.NODE_ENV === 'development' && (
            <div className="absolute top-4 left-4 bg-red-500 text-white p-2 rounded text-xs z-50 max-w-xs">
              No background image loaded. heroImage: {heroImage || 'undefined'}
            </div>
          )}
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Side - Text Content */}
          <div 
            ref={textRef} 
            className={cn(
              "space-y-6 sm:space-y-8",
              "lg:pr-8"
            )}
          >
            <p className="subheading text-white/90 font-medium tracking-wide uppercase">
              {preHeadline}
            </p>
            
            <h1 className="text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
              {headline.includes(".") && !headline.endsWith(".") ? (
                // Split by period if there are multiple sentences
                headline.split(".").filter(p => p.trim()).map((part, index, array) => (
                  <span key={index}>
                    {part.trim()}
                    {index < array.length - 1 && "."}
                    <br />
                  </span>
                ))
              ) : headline.includes(",") ? (
                // Split by comma
                headline.split(",").map((part, index, array) => (
                  <span key={index}>
                    {part.trim()}
                    {index < array.length - 1 && ","}
                    <br />
                  </span>
                ))
              ) : (
                // Display as is (e.g., "Your Story, Our Lens.")
                headline
              )}
            </h1>
            
            <p className="text-white/80 leading-relaxed max-w-2xl" style={{ fontSize: '15px' }}>
              {bodyText}
            </p>
            
            <div className="pt-2">
              <Button
                asChild
                size="lg"
                className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 hover:shadow-xl group"
              >
                <a href={ctaLink} className="flex items-center gap-2">
                  <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <span className="uppercase font-medium">{ctaText}</span>
                </a>
              </Button>
            </div>
          </div>

          {/* Right Side - Can be used for additional content or kept empty */}
          <div className="hidden lg:block" />
        </div>
      </div>
    </section>
  )
}

