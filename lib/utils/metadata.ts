import type { Metadata } from 'next';

interface PageMetadata {
  title: string;
  description?: string;
  ogImage?: string;
  keywords?: string[];
}

/**
 * Generate Next.js 16 metadata object
 * Replaces the old MetaHead component with native metadata API
 */
export function generateMetadata({
  title,
  description = 'Commonwealth (CMNW) - WoW Classic Trade and Market Intelligence',
  ogImage = '/static/cmnw.png',
  keywords = ['wow', 'classic', 'trade', 'market', 'commonwealth', 'cmnw'],
}: PageMetadata): Metadata {
  const fullTitle = `${title} | CMNW`;

  return {
    title: fullTitle,
    description,
    keywords,
    openGraph: {
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}
