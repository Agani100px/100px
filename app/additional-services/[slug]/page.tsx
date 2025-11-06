import { fetchWordPressAdditionalService, fetchWordPressAdditionalServices } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import Image from "next/image"
import { ServiceGallery } from "@/components/service-gallery"
import { Button } from "@/components/ui/button"
import { CircleArrowRight } from "lucide-react"
import Link from "next/link"

interface AdditionalServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await fetchWordPressAdditionalServices({ per_page: 100 })
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({
  params,
}: AdditionalServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await fetchWordPressAdditionalService(slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  const serviceName = service.acf?.service_name || service.title.rendered

  return {
    title: serviceName,
    description: service.acf?.description || `Professional ${serviceName} services`,
  }
}

export default async function AdditionalServicePage({ params }: AdditionalServicePageProps) {
  const { slug } = await params
  const service = await fetchWordPressAdditionalService(slug)

  if (!service) {
    notFound()
  }

  const serviceName = service.acf?.service_name || service.title.rendered
  const servicePrice = service.acf?.price || service.acf?.additional_service_price || ""
  const serviceDescription = service.acf?.description || ""
  const serviceImage = service.acf?.service_image
  const serviceGallery = service.acf?.gallery || []
  const companyLogo = service.acf?.company_logo
  const companyName = service.acf?.company_name || ""
  
  // Debug: Log the ACF fields to see what we're getting
  console.log('Additional Service ACF fields:', {
    hasACF: !!service.acf,
    buttonText: service.acf?.button_text,
    buttonLink: service.acf?.button_link,
    allACFKeys: service.acf ? Object.keys(service.acf) : [],
  })
  
  const buttonText = service.acf?.button_text || "Contact Us"
  const buttonLink = service.acf?.button_link?.url || "#"

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pb-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16 lg:items-center">
          {/* Left Column - Service Information */}
          <div className="flex flex-col justify-center">
            {/* Company Logo */}
            {companyLogo?.url && (
              <div className="mb-4 bg-white p-4 rounded-lg inline-block w-fit">
                {companyLogo.url.startsWith('http://100px.local') ? (
                  <img
                    src={companyLogo.url}
                    alt={companyName || "Company Logo"}
                    className="h-12 w-auto object-contain max-w-[200px]"
                  />
                ) : (
                  <Image
                    src={companyLogo.url}
                    alt={companyName || "Company Logo"}
                    width={200}
                    height={66}
                    className="h-12 w-auto object-contain max-w-[200px]"
                  />
                )}
              </div>
            )}

            {/* Company Name */}
            {companyName && (
              <p className="text-white/80 mb-6" style={{ fontSize: '15px' }}>
                {companyName}
              </p>
            )}

            {/* Service Name */}
            <h1 className="text-white mb-6" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
              {serviceName}
            </h1>

            <div className="space-y-6">
            {/* Service Price */}
            {servicePrice && (
              <p className="text-white" style={{ fontSize: '15px' }}>
                {servicePrice}
              </p>
            )}

            {/* Service Description */}
            {serviceDescription && (
              <div 
                className="text-white/80 prose prose-invert max-w-none"
                style={{ fontSize: '15px' }}
                dangerouslySetInnerHTML={{ __html: serviceDescription }}
              />
            )}

            {/* Button */}
            <div className="pt-4">
              <Button
                asChild
                size="lg"
                className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 group"
              >
                <Link href={buttonLink} className="flex items-center gap-2">
                  <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <span className="uppercase font-medium">{buttonText}</span>
                </Link>
              </Button>
            </div>
            </div>
          </div>

          {/* Right Column - Service Image */}
          <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[800px] rounded-xl overflow-hidden border border-[#191919]">
            {serviceImage?.url ? (
              serviceImage.url.startsWith('http://100px.local') ? (
                <img
                  src={serviceImage.url}
                  alt={serviceImage.alt || serviceName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={serviceImage.url}
                  alt={serviceImage.alt || serviceName}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              )
            ) : (
              <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <span className="text-white/50">No Image</span>
              </div>
            )}
          </div>
        </div>

        {/* Gallery Section */}
        {serviceGallery.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <h2 className="mb-8 sm:mb-12 text-white" style={{ fontSize: '18px', fontWeight: 400 }}>
              {serviceName} Gallery
            </h2>
            <ServiceGallery gallery={serviceGallery} />
          </div>
        )}
      </div>
    </div>
  )
}

