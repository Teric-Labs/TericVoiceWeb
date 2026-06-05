import { useEffect } from 'react';
import {
  SITE_NAME,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_OG_IMAGE,
  ORGANIZATION_JSON_LD,
  WEBSITE_JSON_LD,
  SOFTWARE_JSON_LD,
} from '../constants/seo';

const MANAGED_ATTR = 'data-seo-managed';

function upsertMeta(selector, attributes) {
  let el = document.head.querySelector(`${selector}[${MANAGED_ATTR}]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value == null) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, value);
    }
  });
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"][${MANAGED_ATTR}]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute(MANAGED_ATTR, 'true');
    document.head.appendChild(el);
  }
  el.setAttribute('rel', rel);
  if (href) {
    el.setAttribute('href', href);
  } else {
    el.removeAttribute('href');
  }
}

function upsertJsonLd(id, data) {
  let el = document.head.querySelector(`script[data-seo-jsonld="${id}"]`);
  if (!data) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.setAttribute('data-seo-jsonld', id);
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/**
 * Updates document head tags for SEO and social sharing.
 */
export default function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  canonicalPath = '/',
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  jsonLd = null,
}) {
  useEffect(() => {
    const pageTitle = title || `${SITE_NAME} — AI Voice Platform`;
    const canonicalUrl = `${SITE_URL}${canonicalPath === '/' ? '' : canonicalPath}`;
    const robots = noindex ? 'noindex, nofollow' : 'index, follow';

    document.title = pageTitle;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="keywords"]', { name: 'keywords', content: keywords });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: robots });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'PhosAI' });

    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
    upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: SITE_NAME });
    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: pageTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: 'en_US' });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: pageTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    upsertLink('canonical', canonicalUrl);

    if (jsonLd === 'home') {
      upsertJsonLd('organization', ORGANIZATION_JSON_LD);
      upsertJsonLd('website', WEBSITE_JSON_LD);
      upsertJsonLd('software', SOFTWARE_JSON_LD);
    } else if (jsonLd) {
      upsertJsonLd('organization', null);
      upsertJsonLd('website', null);
      upsertJsonLd('software', null);
      upsertJsonLd('page', jsonLd);
    } else {
      upsertJsonLd('organization', null);
      upsertJsonLd('website', null);
      upsertJsonLd('software', null);
      upsertJsonLd('page', null);
    }
  }, [title, description, keywords, canonicalPath, ogImage, noindex, jsonLd]);

  return null;
}
