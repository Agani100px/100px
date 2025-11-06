import { fetchWordPressServices, fetchWordPressServicesPage } from "@/lib/wordpress"
import { ServicesGrid } from "@/components/services-grid"
import { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Services",
  description: "Our Prestige Services - We offer the best services to our customers",
}

export default async function ServicesPage() {
  const [servicesPage, services] = await Promise.all([
    fetchWordPressServicesPage(),
    fetchWordPressServices({ fetchAll: true }),
  ])

  const acf = servicesPage?.acf as any
  const backgroundImage = acf?.background_image
  const heading = acf?.heading || "Our Services"
  const subHeading = acf?.sub_heading || "We offer the best services to our customers"

  return (
    <div className="bg-black min-h-screen text-white">
      {/* Header Image Section */}
      {backgroundImage?.url && (
        <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px] overflow-hidden">
          {backgroundImage.url.startsWith('http://100px.local') || backgroundImage.url.startsWith('https://website.100px.lk') ? (
            <img
              src={backgroundImage.url}
              alt={backgroundImage.alt || "Services"}
              className="w-full h-full object-cover"
            />
          ) : (
            <Image
              src={backgroundImage.url}
              alt={backgroundImage.alt || "Services"}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Header Content Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 z-10">
            <h1 className="text-white mb-4" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
              {heading}
            </h1>
            <p className="text-white/90 subheading max-w-2xl" style={{ fontSize: '16px' }}>
              {subHeading}
            </p>
          </div>
        </div>
      )}

      {/* Services Grid */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        {services.length > 0 ? (
          <ServicesGrid services={services} />
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-lg text-white/70 mb-4">
              No services found. Please configure your WordPress API URL in .env.local
            </p>
            <p className="text-sm text-white/50">
              Check console logs for debugging information.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
