"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { WordPressFooter } from "@/lib/wordpress"
import { Phone, MapPin, MessageCircle, Mail, Clock, Facebook, Linkedin, Instagram, Share2 } from "lucide-react"
import { mapWordPressUrlToNextRoute } from "@/lib/utils"

interface FooterProps {
  footerData: WordPressFooter | null
}

// Social media icon mapping
const getSocialIcon = (name: string) => {
  const normalizedName = name.toLowerCase()
  if (normalizedName.includes('facebook')) return Facebook
  if (normalizedName.includes('linkedin')) return Linkedin
  if (normalizedName.includes('instagram')) return Instagram
  if (normalizedName.includes('pinterest')) {
    // Pinterest icon - using Share2 as fallback since lucide-react doesn't have Pinterest
    return Share2
  }
  return null
}

// Icon mapping for contact info
const getContactIcon = (name: string) => {
  const normalizedName = name.toLowerCase()
  if (normalizedName.includes('phone')) return Phone
  if (normalizedName.includes('address')) return MapPin
  if (normalizedName.includes('whatsapp')) return MessageCircle
  if (normalizedName.includes('email')) return Mail
  if (normalizedName.includes('open hours') || normalizedName.includes('hours')) return Clock
  return null
}

export function Footer({ footerData }: FooterProps) {
  const pathname = usePathname()

  if (!footerData?.acf) {
    // Fallback footer
    return (
      <footer className="bg-black text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm text-white/70">&copy; {new Date().getFullYear()} 100PX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    )
  }

  const { logo, menu, important_links, icon_groups, social_media } = footerData.acf

  // Map icon groups in order - each group has list_name and list_content
  // The endpoint provides: Address, Phone, Whatsapp, Email, Open Hours

  return (
    <footer className="bg-black text-white py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        {logo?.url && (
          <div className="flex justify-center mb-8">
            {logo.url.startsWith('http://100px.local') ? (
              <img
                src={logo.url}
                alt="100px Logo"
                className="h-12 sm:h-16 w-auto object-contain"
              />
            ) : (
              <Image
                src={logo.url}
                alt="100px Logo"
                width={200}
                height={60}
                className="h-12 sm:h-16 w-auto object-contain"
              />
            )}
          </div>
        )}

        {/* Social Media Icons */}
        {social_media && social_media.length > 0 && (
          <div className="flex justify-center gap-6 mb-8">
            {social_media.map((social, index) => {
              const IconComponent = getSocialIcon(social.social_media_name)
              const href = social.social_media_links_items?.url || "#"
              
              return (
                <Link
                  key={index}
                  href={href}
                  target={social.social_media_links_items?.target || "_self"}
                  className="text-white hover:text-[#B5FF00] transition-colors"
                  aria-label={social.social_media_name}
                >
                  {IconComponent ? (
                    <IconComponent className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    <span className="text-sm">{social.social_media_name}</span>
                  )}
                </Link>
              )
            })}
          </div>
        )}

        {/* Main Navigation Menu */}
        {menu && menu.length > 0 && (
          <nav className="flex justify-center flex-wrap gap-4 sm:gap-6 md:gap-8 mb-8">
            {menu.map((item, index) => {
              const wordPressUrl = item.menu_item_link?.url || "#"
              const href = mapWordPressUrlToNextRoute(wordPressUrl)
              const isActive = pathname === href || (href === "#" && pathname === "/")
              
              return (
                <Link
                  key={index}
                  href={href}
                  target={item.menu_item_link?.target || "_self"}
                  className={`text-white text-[12px] font-medium uppercase transition-colors hover:text-[#B5FF00] whitespace-nowrap ${
                    isActive ? 'text-[#B5FF00]' : ''
                  }`}
                >
                  {item.menu_item_name}
                </Link>
              )
            })}
          </nav>
        )}

        {/* Important Links */}
        {important_links && important_links.length > 0 && (
          <div className="flex justify-center flex-wrap gap-4 sm:gap-6 mb-12">
            {important_links.map((link, index) => {
              const wordPressUrl = link.important_links?.url || "#"
              const href = mapWordPressUrlToNextRoute(wordPressUrl)
              return (
                <div key={index} className="flex items-center gap-4">
                  {index > 0 && <span className="text-white/50">|</span>}
                  <Link
                    href={href}
                    target={link.important_links?.target || "_self"}
                    className="text-white/50 text-[12px] hover:text-[#B5FF00] transition-colors whitespace-nowrap"
                  >
                    {link.important_link_text}
                  </Link>
                </div>
              )
            })}
          </div>
        )}

        {/* Contact Information - 5 Columns */}
        {icon_groups && icon_groups.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 mb-12">
            {icon_groups.map((group, index) => {
              const IconComponent = getContactIcon(group.list_name)
              const normalizedName = group.list_name.toLowerCase()
              
              return (
                <div key={index} className="flex flex-col items-center md:items-start">
                  {IconComponent && (
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className="h-5 w-5 text-white" />
                      <span className="text-white text-sm">{group.list_name}</span>
                    </div>
                  )}
                  
                  {/* Display content based on type */}
                  {normalizedName.includes('phone') ? (
                    <a
                      href={`tel:${group.list_content.replace(/\s/g, '')}`}
                      className="text-white/80 text-sm hover:text-[#B5FF00] transition-colors"
                    >
                      {group.list_content}
                    </a>
                  ) : normalizedName.includes('whatsapp') ? (
                    <a
                      href={`https://wa.me/${group.list_content.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/80 text-sm hover:text-[#B5FF00] transition-colors"
                    >
                      {group.list_content}
                    </a>
                  ) : normalizedName.includes('email') ? (
                    <a
                      href={`mailto:${group.list_content}`}
                      className="text-white/80 text-sm hover:text-[#B5FF00] transition-colors"
                    >
                      {group.list_content}
                    </a>
                  ) : (
                    <p className="text-white/80 text-sm whitespace-pre-line text-center md:text-left">
                      {group.list_content}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Copyright */}
        <div className="text-center pt-8 border-t border-white/10">
          <p className="text-white/70 text-sm">
            Design by Agani with love
          </p>
        </div>
      </div>
    </footer>
  )
}
