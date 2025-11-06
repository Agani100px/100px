"use client"

import { useEffect, useLayoutEffect, useRef } from "react"
import { CircleArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface SameDayServiceProps {
  serviceName?: string
  serviceDescription?: string
  serviceImage?: {
    url?: string
    alt?: string
  }
  serviceSubheading?: string
  serviceHeading?: string
  serviceButtonText?: string
  serviceButtonLink?: string
}

export function SameDayService({
  serviceName = "Same Day Service",
  serviceDescription = "Our standard editing process takes 3-4 working days. However, if you require same-day service, it can be arranged after making full payment and selecting your portraits.",
  serviceImage,
  serviceSubheading = "Memories that can time travel",
  serviceHeading = "Your creativity has no boundaries, with us",
  serviceButtonText = "Book Your Session",
  serviceButtonLink = "#",
}: SameDayServiceProps) {
  const imageRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!imageRef.current || !sectionRef.current || !serviceImage?.url) return

    const imageElement = imageRef.current.querySelector('img')
    if (!imageElement) return

    let scrollTrigger: ScrollTrigger | null = null
    let initialWidth = 0
    let initialHeight = 0

    const initScrollTrigger = () => {
      if (!imageRef.current || !sectionRef.current) return

      // Get dimensions after image loads
      initialWidth = imageRef.current.offsetWidth
      initialHeight = imageRef.current.offsetHeight

      if (initialWidth === 0 || initialHeight === 0) {
        // Retry if dimensions not ready
        setTimeout(initScrollTrigger, 50)
        return
      }

      // Kill existing triggers
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill()
        }
      })

      scrollTrigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress
          // Scale from 1x to 1.5x (50% expansion) - clamp between 1 and 1.5
          const scale = Math.min(1 + progress * 0.5, 1.5)
          
          if (imageRef.current && initialWidth > 0 && initialHeight > 0) {
            const newWidth = initialWidth * scale
            const newHeight = initialHeight * scale
            
            // Prevent expansion beyond viewport width (with some padding)
            const maxWidth = typeof window !== 'undefined' ? window.innerWidth * 0.95 : 1920
            const constrainedWidth = Math.min(newWidth, maxWidth)
            const aspectRatio = initialWidth / initialHeight
            const constrainedHeight = constrainedWidth / aspectRatio
            
            gsap.set(imageRef.current, {
              width: constrainedWidth,
              height: constrainedHeight,
              maxWidth: '95vw',
            })
          }
        },
      })

      ScrollTrigger.refresh()
    }

    // Wait for image to load
    const handleLoad = () => {
      setTimeout(initScrollTrigger, 50)
    }

    if (imageElement.complete && imageElement.naturalWidth > 0) {
      handleLoad()
    } else {
      imageElement.addEventListener('load', handleLoad, { once: true })
      // Fallback timeout
      setTimeout(handleLoad, 500)
    }

    return () => {
      if (scrollTrigger) {
        scrollTrigger.kill()
      }
      ScrollTrigger.getAll().forEach(trigger => {
        if (trigger.vars.trigger === sectionRef.current) {
          trigger.kill()
        }
      })
    }
  }, [serviceImage])

  return (
    <section ref={sectionRef} className="relative bg-black text-white py-16 sm:py-24 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
          {/* Service Name Heading */}
          <h2 className="text-white" style={{ fontSize: '40px', fontWeight: 400, lineHeight: '40px' }}>
            {serviceName}
          </h2>

          {/* Service Description */}
          <p className="text-white/80 max-w-2xl mx-auto" style={{ fontSize: '15px' }}>
            {serviceDescription}
          </p>

          {/* Service Image - Expands on scroll */}
          {serviceImage?.url && (
            <div className="relative w-full max-w-2xl mx-auto my-8 sm:my-12 overflow-hidden">
              <div ref={imageRef} className="relative mx-auto" style={{ willChange: 'width, height', maxWidth: '95vw' }}>
                {serviceImage.url.startsWith('http://100px.local') ? (
                  <img
                    src={serviceImage.url}
                    alt={serviceImage.alt || serviceName}
                    className="w-full h-auto block"
                  />
                ) : (
                  <img
                    src={serviceImage.url}
                    alt={serviceImage.alt || serviceName}
                    className="w-full h-auto block"
                  />
                )}
              </div>
            </div>
          )}

          {/* Service Subheading */}
          <p className="text-white/90 subheading" style={{ fontSize: '16px' }}>
            {serviceSubheading}
          </p>

          {/* Service Heading - Split into multiple lines */}
          <h1 className="text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
            {serviceHeading ? (
              (() => {
                // Split "Your creativity has no boundaries, with us" into:
                // Line 1: "Your creativity"
                // Line 2: "has no boundaries,"
                // Line 3: "with us"
                const parts = serviceHeading.split(',')
                if (parts.length === 2) {
                  // Split first part: "Your creativity has no boundaries" -> ["Your creativity", "has no boundaries"]
                  const firstPart = parts[0].trim()
                  const secondPart = parts[1].trim()
                  const firstWords = firstPart.split(' ')
                  const firstLine = firstWords.slice(0, 2).join(' ') // "Your creativity"
                  const secondLine = firstWords.slice(2).join(' ') + ',' // "has no boundaries,"
                  
                  return (
                    <>
                      {firstLine}
                      <br />
                      {secondLine}
                      <br />
                      {secondPart}
                    </>
                  )
                } else {
                  // Fallback: split by comma
                  return serviceHeading.split(',').map((part, index, array) => (
                    <span key={index}>
                      {part.trim()}
                      {index < array.length - 1 && ","}
                      <br />
                    </span>
                  ))
                }
              })()
            ) : null}
          </h1>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              asChild
              size="lg"
              className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 group"
            >
              <Link href={serviceButtonLink} className="flex items-center gap-2">
                <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
                <span className="uppercase font-medium">{serviceButtonText}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

