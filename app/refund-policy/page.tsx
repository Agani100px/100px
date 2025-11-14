import { fetchWordPressPage } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { AnimatedSection } from "@/components/animated-section"

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Refund Policy for 100px Photography - Learn about our refund and rescheduling policies",
}

export default async function RefundPolicyPage() {
  const page = await fetchWordPressPage('refund-policy')

  if (!page) {
    notFound()
  }

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <AnimatedSection delay={0.1}>
            <h1 className="text-white mb-8 sm:mb-12" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
              {page.title.rendered}
            </h1>
          </AnimatedSection>

          {/* Page Content */}
          <AnimatedSection delay={0.2}>
            <div 
              className="prose prose-invert max-w-none
                [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-medium [&_h2]:mt-8 [&_h2]:mb-4 [&_h2]:leading-tight
                [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-medium [&_h3]:mt-6 [&_h3]:mb-3 [&_h3]:leading-tight
                [&_p]:text-white/80 [&_p]:text-[15px] [&_p]:leading-7 [&_p]:mb-4
                [&_ul]:text-white/80 [&_ul]:text-[15px] [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                [&_li]:text-white/80 [&_li]:text-[15px] [&_li]:leading-7 [&_li]:mb-2
                [&_strong]:text-white [&_strong]:font-medium
                [&_hr]:border-white/20 [&_hr]:my-8
                [&_a]:text-[#B5FF00] [&_a]:no-underline hover:[&_a]:underline [&_a]:transition-colors"
              dangerouslySetInnerHTML={{ __html: page.content.rendered }}
            />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

