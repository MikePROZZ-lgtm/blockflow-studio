/**
 * Internal Linking Engine
 * Automatically creates links between generated pages.
 */

import type { SEOGeneratedPage } from './types';

export interface LinkMap {
  [fromSlug: string]: { slug: string; anchor: string; relation: 'parent' | 'child' | 'sibling' | 'intent' }[];
}

export function buildLinkMap(pages: SEOGeneratedPage[]): LinkMap {
  const map: LinkMap = {};

  const cityPages = pages.filter((p) => !p.meta.district && !p.meta.intent);
  const districtPages = pages.filter((p) => !!p.meta.district && !p.meta.intent);
  const intentPages = pages.filter((p) => !!p.meta.intent);

  for (const page of pages) {
    const links: LinkMap[string] = [];

    if (!page.meta.district && !page.meta.intent) {
      // City page → children (districts) + intent variants
      const children = districtPages.filter((dp) => dp.meta.city === page.meta.city && dp.meta.service === page.meta.service);
      for (const child of children) {
        links.push({ slug: child.slug, anchor: `${child.meta.service} in ${child.meta.district}`, relation: 'child' });
      }
      const intents = intentPages.filter((ip) => ip.meta.city === page.meta.city && ip.meta.service === page.meta.service);
      for (const ip of intents) {
        links.push({ slug: ip.slug, anchor: `${ip.meta.intent} ${ip.meta.service}`, relation: 'intent' });
      }
      // Sibling: same service, other cities
      const siblings = cityPages.filter((cp) => cp.meta.service === page.meta.service && cp.meta.city !== page.meta.city);
      for (const sib of siblings.slice(0, 3)) {
        links.push({ slug: sib.slug, anchor: `${sib.meta.service} in ${sib.meta.city}`, relation: 'sibling' });
      }
    }

    if (page.meta.district) {
      // District page → parent city page
      const parent = cityPages.find((cp) => cp.meta.city === page.meta.city && cp.meta.service === page.meta.service);
      if (parent) links.push({ slug: parent.slug, anchor: `All ${page.meta.service} in ${page.meta.city}`, relation: 'parent' });
      // Sibling districts
      const sibDistricts = districtPages.filter((dp) =>
        dp.meta.city === page.meta.city && dp.meta.service === page.meta.service && dp.slug !== page.slug
      );
      for (const sib of sibDistricts.slice(0, 4)) {
        links.push({ slug: sib.slug, anchor: `${sib.meta.service} in ${sib.meta.district}`, relation: 'sibling' });
      }
    }

    if (page.meta.intent) {
      // Intent page → parent city page
      const parent = cityPages.find((cp) => cp.meta.city === page.meta.city && cp.meta.service === page.meta.service);
      if (parent) links.push({ slug: parent.slug, anchor: `${page.meta.service} in ${page.meta.city}`, relation: 'parent' });
    }

    map[page.slug] = links;
  }

  return map;
}

/** Get stats about link coverage */
export function getLinkStats(pages: SEOGeneratedPage[], linkMap: LinkMap) {
  const orphans = pages.filter((p) => (linkMap[p.slug]?.length ?? 0) === 0);
  const avgLinks = pages.length > 0
    ? pages.reduce((sum, p) => sum + (linkMap[p.slug]?.length ?? 0), 0) / pages.length
    : 0;

  return {
    totalPages: pages.length,
    totalLinks: Object.values(linkMap).reduce((sum, links) => sum + links.length, 0),
    orphanPages: orphans.length,
    averageLinksPerPage: Math.round(avgLinks * 10) / 10,
  };
}
