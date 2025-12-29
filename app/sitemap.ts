import { MetadataRoute } from 'next'
import { 
  fetchWordPressServices, 
  fetchWordPressPosts, 
  fetchWordPressAdditionalServices 
} from '@/lib/wordpress'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.100px.lk'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/refund-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Fetch dynamic content
  const [services, posts, additionalServices] = await Promise.all([
    fetchWordPressServices({ fetchAll: true }).catch(() => []),
    fetchWordPressPosts({ per_page: 100 }).catch(() => []),
    fetchWordPressAdditionalServices({ fetchAll: true }).catch(() => []),
  ])

  // Generate service URLs
  const serviceUrls: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.modified ? new Date(service.modified) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Generate post URLs
  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.modified ? new Date(post.modified) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Generate additional service URLs
  const additionalServiceUrls: MetadataRoute.Sitemap = additionalServices.map((service) => ({
    url: `${baseUrl}/additional-services/${service.slug}`,
    lastModified: service.modified ? new Date(service.modified) : new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  // Combine all URLs
  return [
    ...staticPages,
    ...serviceUrls,
    ...postUrls,
    ...additionalServiceUrls,
  ]
}

