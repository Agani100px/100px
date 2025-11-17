"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CircleArrowRight, X } from "lucide-react"

interface BookingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function BookingModal({ open, onOpenChange }: BookingModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    businessName: "",
    website: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const WORDPRESS_API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL
      
      if (!WORDPRESS_API_URL) {
        throw new Error('WordPress API URL is not configured')
      }

      // Build message from booking form data
      const message = [
        formData.businessType && `Business Type: ${formData.businessType}`,
        formData.businessName && `Business Name: ${formData.businessName}`,
        formData.website && `Website: ${formData.website}`,
      ].filter(Boolean).join('\n') || 'Booking appointment request'

      const response = await fetch(`${WORDPRESS_API_URL}/wp-json/hundredpx/v1/form-submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: 'Booking Appointment Request',
          message: message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Failed to submit booking request')
      }

      if (result.success) {
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          businessType: "",
          businessName: "",
          website: "",
        })
        
        // Close modal
        onOpenChange(false)
        
        // Show success message
        alert("Thank you! We'll get back to you soon.")
      } else {
        throw new Error(result.message || 'Failed to submit booking request')
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Something went wrong. Please try again."
      alert(errorMessage)
      setErrors({ submit: errorMessage })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl p-8 sm:p-10 max-w-md w-full mx-4 [&>button]:hidden">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-white text-2xl sm:text-3xl font-normal mb-2">
            Book an Appointment
          </DialogTitle>
          <p className="text-white/70 text-sm">
            Fill in your details and we'll get back to you
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name - Required */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-white text-sm">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="Enter your name"
              required
            />
            {errors.name && (
              <p className="text-red-500 text-xs">{errors.name}</p>
            )}
          </div>

          {/* Email - Required */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white text-sm">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="Enter your email"
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
          </div>

          {/* Phone - Required */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-white text-sm">
              Phone <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="Enter your phone number"
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-xs">{errors.phone}</p>
            )}
          </div>

          {/* Business Type - Optional */}
          <div className="space-y-2">
            <Label htmlFor="businessType" className="text-white text-sm">
              Business Type
            </Label>
            <Input
              id="businessType"
              name="businessType"
              type="text"
              value={formData.businessType}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="e.g., Photography, E-commerce"
            />
          </div>

          {/* Business Name - Optional */}
          <div className="space-y-2">
            <Label htmlFor="businessName" className="text-white text-sm">
              Business Name
            </Label>
            <Input
              id="businessName"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="Enter your business name"
            />
          </div>

          {/* Website - Optional */}
          <div className="space-y-2">
            <Label htmlFor="website" className="text-white text-sm">
              Website
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-[#B5FF00] focus:ring-[#B5FF00]"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-3">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="bg-[#B5FF00] hover:bg-[#9FE000] text-black font-semibold shadow-lg hover:shadow-[#B5FF00]/50 group flex-1"
            >
              <div className="flex items-center gap-2">
                <CircleArrowRight className="group-hover:translate-x-1 transition-transform" />
                <span className="uppercase font-medium">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </span>
              </div>
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-white hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

