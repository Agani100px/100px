import { fetchWordPressService, fetchWordPressServices } from "@/lib/wordpress"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { ServiceGallery } from "@/components/service-gallery"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { generateSlug } from "@/lib/utils"

interface AlbumPageProps {
  params: Promise<{ slug: string; albumSlug: string }>
}

// Force dynamic rendering to handle albums that might not be available at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function generateMetadata({
  params,
}: AlbumPageProps): Promise<Metadata> {
  const { slug, albumSlug: rawAlbumSlug } = await params
  const albumSlug = decodeURIComponent(rawAlbumSlug)
  const service = await fetchWordPressService(slug)

  if (!service) {
    return {
      title: "Album Not Found",
    }
  }

  const serviceName = service.acf?.service_name || service.title.rendered
  const albums = service.acf?.albums || []
  const album = albums.find(
    (a) => {
      const generatedSlug = generateSlug(a.album_name)
      return generatedSlug === albumSlug || generatedSlug === rawAlbumSlug
    }
  )
  const albumName = album?.album_name || "Album"

  return {
    title: `${albumName} - ${serviceName}`,
    description: `Gallery for ${albumName} - ${serviceName}`,
  }
}

export default async function AlbumPage({ params }: AlbumPageProps) {
  const { slug, albumSlug: rawAlbumSlug } = await params
  
  // Decode URL-encoded album slug
  const albumSlug = decodeURIComponent(rawAlbumSlug)
  
  const service = await fetchWordPressService(slug)

  if (!service) {
    console.error('Service not found:', slug)
    notFound()
  }

  const serviceName = service.acf?.service_name || service.title.rendered
  const albums = service.acf?.albums || []
  
  // Debug logging
  console.log('Album Page Debug:', {
    slug,
    rawAlbumSlug,
    albumSlug,
    albumsCount: albums.length,
    albumNames: albums.map(a => a.album_name),
    albumSlugs: albums.map(a => generateSlug(a.album_name)),
  })
  
  const album = albums.find(
    (a) => {
      const generatedSlug = generateSlug(a.album_name)
      return generatedSlug === albumSlug || generatedSlug === rawAlbumSlug
    }
  )

  if (!album) {
    console.error('Album not found:', {
      requestedSlug: albumSlug,
      rawSlug: rawAlbumSlug,
      availableSlugs: albums.map(a => generateSlug(a.album_name)),
      availableNames: albums.map(a => a.album_name),
    })
    notFound()
  }

  const albumName = album.album_name || "Album"
  const albumGallery = album.service_gallery || []

  return (
    <div className="bg-black min-h-screen text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 sm:pb-12">
        {/* Back Button */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 sm:mb-8 text-white hover:text-[#B5FF00]"
        >
          <Link href={`/services/${slug}`} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to {serviceName}
          </Link>
        </Button>

        {/* Page Title and Subheading */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-white mb-4" style={{ fontSize: '54px', fontWeight: 400, lineHeight: '54px' }}>
            {serviceName}
          </h1>
          <h2 className="text-white/80" style={{ fontSize: '18px', fontWeight: 400 }}>
            {albumName}
          </h2>
        </div>

        {/* Gallery Section */}
        {albumGallery.length > 0 ? (
          <ServiceGallery gallery={albumGallery} />
        ) : (
          <div className="text-center py-12 sm:py-16">
            <p className="text-white/70">No images in this album yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

