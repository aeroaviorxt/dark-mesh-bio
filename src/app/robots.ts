import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/me/admin',
                '/docs/admin',
                '/api/',
                '/auth/',
                '/cloud/success',
                '/login',
                '/_next/',
                '/private/',
            ],
        },
        sitemap: 'https://www.avrxt.in/sitemap.xml',
    };
}
