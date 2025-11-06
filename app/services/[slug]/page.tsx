import { fetchWordPressService, fetchWordPressServices } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CircleArrowRight } from "lucide-react"
import Link from "next/link"
import { Metadata } from "next"
import Image from "next/image"
import { ServiceGallery } from "@/components/service-gallery"
import { generateSlug } from "@/lib/utils"

interface ServicePageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const services = await fetchWordPressServices({ per_page: 100 })
  return services.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params
  const service = await fetchWordPressService(slug)

  if (!service) {
    return {
      title: "Service Not Found",
    }
  }

  const serviceName = service.acf?.service_name || service.title.rendered

  return {
    title: serviceName,
    description: service.acf?.service_description || `Professional ${serviceName} photography services`,
  }
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { slug } = await params
  const service = await fetchWordPressService(slug)

  if (!service) {
    notFound()
  }

  const serviceName = service.acf?.service_name || service.title.rendered
  const servicePrice = service.acf?.service_price || ""
  const additionalCharges = service.acf?.additional_charges || ""
  const serviceDescription = service.acf?.service_description || ""
  const serviceImage = service.acf?.service_image
  const serviceGallery = service.acf?.service_gallery || []
  const albums = service.acf?.albums || []
  const buttonText = service.acf?.service_button_text || "BOOK YOUR SESSION"
  const buttonLink = service.acf?.service_button_link?.url || "#"

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pb-12">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12 sm:mb-16 lg:items-center">
          {/* Left Column - Service Information */}
          <div className="flex flex-col justify-center">
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

            {/* Additional Charges */}
            {additionalCharges && (
              <p className="text-white/80" style={{ fontSize: '15px' }}>
                {additionalCharges}
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

            {/* Booking Button */}
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

        {/* Albums Section - Show album covers if albums exist, otherwise show direct gallery */}
        {albums.length > 0 ? (
          <div className="mt-12 sm:mt-16">
            <h2 className="mb-8 sm:mb-12 text-white" style={{ fontSize: '18px', fontWeight: 400 }}>
              {serviceName} Albums
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {albums.map((album, index) => {
                const albumSlug = generateSlug(album.album_name) || `album-${index}`
                return (
                  <Link
                    key={index}
                    href={`/services/${slug}/${albumSlug}`}
                    className="relative rounded-xl overflow-hidden bg-black group border border-[#191919] block"
                  >
                    <div className="relative w-full h-[300px] sm:h-[400px]">
                      {album.album_cover?.url ? (
                        album.album_cover.url.startsWith('http://100px.local') ? (
                          <img
                            src={album.album_cover.url}
                            alt={album.album_name || "Album Cover"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image
                            src={album.album_cover.url}
                            alt={album.album_name || "Album Cover"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )
                      ) : (
                        <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                          <span className="text-white/50 text-sm">No Album Cover</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-end p-6">
                        <h3 className="text-white text-xl font-semibold">
                          {album.album_name}
                        </h3>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : serviceGallery.length > 0 ? (
          <div className="mt-12 sm:mt-16">
            <h2 className="mb-8 sm:mb-12 text-white" style={{ fontSize: '18px', fontWeight: 400 }}>
              {serviceName} Gallery
            </h2>
            <ServiceGallery gallery={serviceGallery} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

