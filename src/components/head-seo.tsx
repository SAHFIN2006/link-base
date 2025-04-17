
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface HeadSEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
}

export function HeadSEO({
  title = 'LinkBase - Organize & Discover Technology Resources',
  description = 'Your personal gateway to the best technology resources, curated for developers and tech enthusiasts.',
  image = '/og-image.jpg',
  url,
  type = 'website',
  twitterCard = 'summary_large_image'
}: HeadSEOProps) {
  const location = useLocation();
  const currentUrl = url || `${window.location.origin}${location.pathname}`;

  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Open Graph meta tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:url', currentUrl);
    updateMetaTag('property', 'og:type', type);
    if (image) updateMetaTag('property', 'og:image', getAbsoluteUrl(image));

    // Twitter meta tags
    updateMetaTag('name', 'twitter:card', twitterCard);
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    if (image) updateMetaTag('name', 'twitter:image', getAbsoluteUrl(image));

    // Additional SEO meta tags
    updateMetaTag('name', 'robots', 'index, follow');
    updateMetaTag('name', 'googlebot', 'index, follow');
    
    // Canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);
  }, [title, description, image, currentUrl, type, twitterCard]);

  // Helper functions
  function updateMetaTag(attribute: string, name: string, content: string) {
    let metaTag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!metaTag) {
      metaTag = document.createElement('meta');
      metaTag.setAttribute(attribute, name);
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute('content', content);
  }

  function getAbsoluteUrl(path: string) {
    if (path.startsWith('http')) return path;
    return `${window.location.origin}${path.startsWith('/') ? '' : '/'}${path}`;
  }

  return null; // This component doesn't render anything visible
}
