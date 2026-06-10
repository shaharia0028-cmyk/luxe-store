import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://luxe-store-58ny.vercel.app'
  return [
    { url: base,                   lastModified: new Date(), changeFrequency: 'daily',   priority: 1 },
    { url: `${base}/shop`,         lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/categories`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${base}/about`,        lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/contact`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/faq`,          lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]
}
