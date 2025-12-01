import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.edurelieflk.org'

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/', // Disallow API routes from being indexed
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    }
}
