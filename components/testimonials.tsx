"use client"

import { WordPressTestimonial } from "@/lib/wordpress"
import Image from "next/image"

interface TestimonialsProps {
  testimonials: WordPressTestimonial[]
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  if (!testimonials || testimonials.length === 0) {
    return null
  }

  return (
    <section className="bg-black text-white py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading and Subheading */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-white mb-4" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
            Testimonials
          </h2>
          <p className="text-white/80" style={{ fontSize: '15px' }}>
            What customer say about us
          </p>
        </div>

        {/* Testimonials Grid - 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => {
            const clientName = testimonial.acf?.client_name || testimonial.title.rendered
            const designation = testimonial.acf?.designation || ""
            const profilePicture = testimonial.acf?.profile_picture
            const testimonialHeading = testimonial.acf?.testimonial_heading || ""
            const testimonialText = testimonial.acf?.testimonial || ""

            return (
              <div
                key={testimonial.id}
                className="relative rounded-xl overflow-hidden backdrop-blur-xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 border border-white/20 p-6 sm:p-8 shadow-2xl"
              >
                {/* Profile Picture */}
                {profilePicture?.url && (
                  <div className="mb-6 flex justify-center">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-white/30">
                      {profilePicture.url.startsWith('http://100px.local') ? (
                        <img
                          src={profilePicture.url}
                          alt={clientName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Image
                          src={profilePicture.url}
                          alt={clientName}
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Testimonial Heading */}
                {testimonialHeading && (
                  <h3 className="text-white mb-4 text-center" style={{ fontSize: '25px', fontWeight: 400, lineHeight: '25px' }}>
                    {testimonialHeading}
                  </h3>
                )}

                {/* Testimonial Text */}
                {testimonialText && (
                  <p className="text-white/80 mb-6 text-center" style={{ fontSize: '15px' }}>
                    {testimonialText}
                  </p>
                )}

                {/* Client Info */}
                <div className="text-center">
                  <p className="text-white font-medium" style={{ fontSize: '16px' }}>
                    {clientName}
                  </p>
                  {designation && (
                    <p className="text-white/60 text-sm mt-1">
                      {designation}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

