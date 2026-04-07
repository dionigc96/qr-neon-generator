import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/q/', '/expired/', '/share/'], // Evitamos que Google indexe los enlaces dinámicos generados
    },
    sitemap: 'https://qr-neon-generator.com/sitemap.xml',
  };
}
