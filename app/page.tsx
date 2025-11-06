import { fetchHeroContent, fetchWordPressServices, fetchSameDayServiceContent, fetchWordPressAdditionalServices, fetchWordPressTestimonials } from "@/lib/wordpress"
import { Hero } from "@/components/hero"
import { AnimatedSection } from "@/components/animated-section"
import { ServicesGrid } from "@/components/services-grid"
import { SameDayService } from "@/components/same-day-service"
import { AdditionalServices } from "@/components/additional-services"
import { Testimonials } from "@/components/testimonials"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home",
  description: "Capturing Life's Precious Moments with Artistic Excellence - Professional photography services",
}

export default async function Home() {
  const [heroContent, services, sameDayServiceContent, additionalServices, testimonials] = await Promise.all([
    fetchHeroContent(),
    fetchWordPressServices({ fetchAll: true }),
    fetchSameDayServiceContent(),
    fetchWordPressAdditionalServices({ fetchAll: true }),
    fetchWordPressTestimonials({ fetchAll: true }),
  ])

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <Hero
        preHeadline={heroContent.preHeadline}
        headline={heroContent.headline}
        bodyText={heroContent.bodyText}
        heroImage={heroContent.heroImage}
        heroImageAlt={heroContent.heroImageAlt}
        ctaText={heroContent.ctaText}
        ctaLink={heroContent.ctaLink}
      />

      {/* Services Section */}
      {services.length > 0 && (
        <section className="bg-black text-white py-16 sm:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection delay={0.2}>
              <ServicesGrid services={services} />
            </AnimatedSection>
          </div>
        </section>
      )}

          {/* Same Day Service Section */}
          {sameDayServiceContent.serviceName && (
            <AnimatedSection delay={0.3}>
              <SameDayService
                serviceName={sameDayServiceContent.serviceName}
                serviceDescription={sameDayServiceContent.serviceDescription}
                serviceImage={sameDayServiceContent.serviceImage}
                serviceSubheading={sameDayServiceContent.serviceSubheading}
                serviceHeading={sameDayServiceContent.serviceHeading}
                serviceButtonText={sameDayServiceContent.serviceButtonText}
                serviceButtonLink={sameDayServiceContent.serviceButtonLink}
              />
            </AnimatedSection>
          )}

          {/* Additional Services Section */}
          {additionalServices.length > 0 && (
            <section className="bg-black text-white py-16 sm:py-24">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <AnimatedSection delay={0.4}>
                  <AdditionalServices services={additionalServices} />
                </AnimatedSection>
              </div>
            </section>
          )}

          {/* Testimonials Section */}
          {testimonials.length > 0 && (
            <AnimatedSection delay={0.5}>
              <Testimonials testimonials={testimonials} />
            </AnimatedSection>
          )}
    </div>
  )
}
