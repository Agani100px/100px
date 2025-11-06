"use client"

import { useState } from "react"
import { WordPressAdditionalService } from "@/lib/wordpress"
import { Button } from "@/components/ui/button"
import { CircleArrowRight } from "lucide-react"
import Link from "next/link"
import { BookingModal } from "@/components/booking-modal"

interface AdditionalServicesProps {
  services: WordPressAdditionalService[]
}

export function AdditionalServices({ services }: AdditionalServicesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!services || services.length === 0) {
    return null
  }

  return (
    <>
      <div className="w-full py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 lg:gap-12 lg:items-center">
          {/* Left Column - Heading, Description, Button */}
          <div className="space-y-6">
            <h2 className="text-white" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
              Additional Services
            </h2>
            
            <p className="text-white/80" style={{ fontSize: '15px' }}>
              We offer solutions for your business. Reach to us and find out the best solution for your need.
            </p>
            
            <div className="pt-2">
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 group"
              >
                <div className="flex items-center gap-2">
                  <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
                  <span className="uppercase font-medium">Book an Appointment</span>
                </div>
              </Button>
            </div>
          </div>

          {/* Right Column - Service Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 sm:gap-8">
            {services.map((service) => {
              const serviceImage = service.acf?.service_image?.url
              const serviceName = service.acf?.service_name || service.title.rendered
              const servicePrice = service.acf?.price || service.acf?.additional_service_price || ""

              return (
                <Link
                  href={`/additional-services/${service.slug}`}
                  key={service.id}
                  className="relative rounded-xl overflow-hidden bg-black group border border-[#191919] block"
                >
                  {/* Service Image */}
                  <div className="relative w-full h-[400px] sm:h-[500px] lg:h-[600px]">
                    {serviceImage ? (
                      serviceImage.startsWith('http://100px.local') ? (
                        <img
                          src={serviceImage}
                          alt={serviceName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img
                          src={serviceImage}
                          alt={serviceName}
                          className="w-full h-full object-cover"
                        />
                      )
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white/50 text-sm">No Image</span>
                      </div>
                    )}
                    
                    {/* Dark overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                      <div className="max-w-md">
                        {/* Service Name */}
                        <h2 className="text-white mb-2 sm:mb-3" style={{ fontSize: '25px', fontWeight: 400, lineHeight: '25px' }}>
                          {serviceName}
                        </h2>
                        
                        {/* Service Price */}
                        {servicePrice && (
                          <p className="text-white mb-4 sm:mb-6" style={{ fontSize: '15px' }}>
                            {servicePrice}
                          </p>
                        )}
                        
                        {/* CTA Button */}
                        <Button
                          size="lg"
                          className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 group/button"
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <CircleArrowRight className="group-hover/button:translate-x-1 transition-transform" />
                            <span className="uppercase font-medium">VIEW DETAILS</span>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <BookingModal open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}

