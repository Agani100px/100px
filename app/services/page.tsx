import { fetchWordPressServices } from "@/lib/wordpress"
import { ServicesGrid } from "@/components/services-grid"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description: "Professional photography services including individual portraits, couple portraits, and special packages",
}

export default async function ServicesPage() {
  const services = await fetchWordPressServices({ fetchAll: true })

  // Debug logging
  console.log('Services fetched:', services.length)
  if (services.length > 0) {
    console.log('First service:', {
      id: services[0].id,
      title: services[0].title.rendered,
      hasACF: !!services[0].acf,
      hasImage: !!services[0].acf?.service_image?.url,
      imageUrl: services[0].acf?.service_image?.url,
    })
  }

  return (
    <div className="bg-black min-h-screen text-white pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <h1 className="mb-8 sm:mb-12 text-center text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
          Our Services
        </h1>
        
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

