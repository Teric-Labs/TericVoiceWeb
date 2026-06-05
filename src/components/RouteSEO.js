import { useLocation } from 'react-router-dom';
import SEO from './SEO';
import { PAGE_SEO } from '../constants/seo';

/**
 * Applies route-specific SEO metadata. Dashboard and private views are noindexed.
 */
export default function RouteSEO() {
  const { pathname } = useLocation();
  const isPrivate =
    pathname.startsWith('/dashboard') ||
    pathname.includes('/audio/') ||
    pathname.includes('/video/') ||
    pathname.includes('/dub/') ||
    pathname.includes('/voiceover/') ||
    pathname.includes('/tts/') ||
    pathname.includes('/chats/');

  if (isPrivate) {
    return <SEO noindex canonicalPath={pathname} title="Avoices Dashboard" />;
  }

  const config = PAGE_SEO[pathname];
  if (!config) {
    return <SEO canonicalPath={pathname} />;
  }

  return (
    <SEO
      title={config.title}
      description={config.description}
      keywords={config.keywords}
      canonicalPath={pathname}
      jsonLd={config.jsonLd}
    />
  );
}
