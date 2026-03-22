/**
 * Programmatic SEO Page Generator
 * Generates pages from service × city × district × intent combinations.
 */

import { nanoid } from 'nanoid';
import type { SEOGeneratedPage, PageGenerationConfig } from './types';

interface Combo {
  service: string;
  serviceSlug: string;
  city: string;
  citySlug: string;
  district?: string;
  districtSlug?: string;
  intent?: string;
}

function buildSlug(combo: Combo): string {
  let slug = `${combo.serviceSlug}-${combo.citySlug}`;
  if (combo.districtSlug) slug += `-${combo.districtSlug}`;
  if (combo.intent) slug = `${combo.intent}-${slug}`;
  return slug;
}

function buildTitle(combo: Combo, categoryName: string): string {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  if (combo.intent === 'emergency') return `Emergency ${combo.service} in ${loc} — 24/7 Fast Response`;
  if (combo.intent === 'cheap') return `Affordable ${combo.service} in ${loc} — Best Prices`;
  if (combo.intent === '24-7') return `24/7 ${combo.service} in ${loc} — Always Available`;
  return `${combo.service} in ${loc} — Professional ${categoryName} Services`;
}

function buildH1(combo: Combo): string {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  if (combo.intent === 'emergency') return `Emergency ${combo.service} in ${loc}`;
  if (combo.intent === 'cheap') return `Affordable ${combo.service} in ${loc}`;
  if (combo.intent === '24-7') return `24/7 ${combo.service} in ${loc}`;
  return `Professional ${combo.service} in ${loc}`;
}

function buildMeta(combo: Combo): string {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  if (combo.intent === 'emergency') {
    return `Need emergency ${combo.service.toLowerCase()} in ${loc}? Our licensed team responds within 30 minutes. Available 24/7. Call now!`;
  }
  return `Looking for ${combo.service.toLowerCase()} in ${loc}? Professional, reliable service at competitive prices. Get a free quote today!`;
}

function buildBody(combo: Combo, keywords: string[], commonPhrases: string[], subServiceNames: string[]): string {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  const svc = combo.service.toLowerCase();

  const subList = subServiceNames.length > 0
    ? `Our services include ${subServiceNames.join(', ')}.`
    : '';

  const phraseInsert = commonPhrases.length > 0
    ? `Whether you're dealing with ${commonPhrases.slice(0, 2).join(' or ')}, we've got you covered.`
    : '';

  return `We are ${loc}'s trusted ${svc} experts with years of experience and hundreds of satisfied customers. ${phraseInsert} ${subList} Our team delivers quality workmanship at competitive prices across ${combo.city}${combo.district ? `, especially in the ${combo.district} area` : ''}.`;
}

function buildHeadings(combo: Combo, subServiceNames: string[]): { level: 2 | 3; text: string }[] {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  const headings: { level: 2 | 3; text: string }[] = [
    { level: 2, text: `Why Choose Our ${combo.service} in ${loc}` },
    { level: 2, text: `Our ${combo.service} Services` },
  ];
  for (const sub of subServiceNames.slice(0, 4)) {
    headings.push({ level: 3, text: sub });
  }
  headings.push({ level: 2, text: 'Service Areas' });
  headings.push({ level: 2, text: 'Pricing & Estimates' });
  headings.push({ level: 2, text: 'Frequently Asked Questions' });
  return headings;
}

function buildFAQ(combo: Combo): { question: string; answer: string }[] {
  const loc = combo.district ? `${combo.district}, ${combo.city}` : combo.city;
  const svc = combo.service.toLowerCase();
  return [
    {
      question: `How much does ${svc} cost in ${loc}?`,
      answer: `Prices vary depending on the scope of work. Contact us for a free, no-obligation estimate.`,
    },
    {
      question: `Do you offer emergency ${svc} services in ${loc}?`,
      answer: `Yes! We provide 24/7 emergency ${svc} in ${loc} and surrounding areas.`,
    },
    {
      question: `Are your ${svc} professionals licensed?`,
      answer: `Absolutely. All our technicians are fully licensed, insured, and background-checked.`,
    },
    {
      question: `How fast can you respond in ${loc}?`,
      answer: `We typically arrive within 30-60 minutes in the ${combo.city} area.`,
    },
  ];
}

/** Generate all combos from config */
function generateCombos(config: PageGenerationConfig): Combo[] {
  const combos: Combo[] = [];

  for (const city of config.cities) {
    // service × city
    combos.push({
      service: config.serviceName,
      serviceSlug: config.serviceSlug,
      city: city.name,
      citySlug: city.slug,
    });

    // service × city × intent
    for (const intent of config.intents) {
      combos.push({
        service: config.serviceName,
        serviceSlug: config.serviceSlug,
        city: city.name,
        citySlug: city.slug,
        intent,
      });
    }

    // service × city × district
    for (const district of city.districts) {
      combos.push({
        service: config.serviceName,
        serviceSlug: config.serviceSlug,
        city: city.name,
        citySlug: city.slug,
        district: district.name,
        districtSlug: district.slug,
      });
    }
  }

  return combos;
}

export function generateSEOPages(config: PageGenerationConfig): SEOGeneratedPage[] {
  const combos = generateCombos(config);
  const limited = config.limit ? combos.slice(0, config.limit) : combos;

  const pages: SEOGeneratedPage[] = limited.map((combo) => ({
    id: nanoid(),
    slug: buildSlug(combo),
    title: buildTitle(combo, config.categoryName),
    metaDescription: buildMeta(combo),
    h1: buildH1(combo),
    headings: buildHeadings(combo, config.subServiceNames),
    bodyContent: buildBody(combo, config.keywords, config.commonPhrases, config.subServiceNames),
    faq: buildFAQ(combo),
    internalLinks: [],
    meta: {
      service: config.serviceName,
      city: combo.city,
      district: combo.district,
      intent: combo.intent,
      generatedAt: new Date().toISOString(),
    },
  }));

  // Add internal links
  return addInternalLinks(pages);
}

/** Calculate how many pages a config would generate (without actually generating) */
export function estimatePageCount(config: PageGenerationConfig): number {
  let count = 0;
  for (const city of config.cities) {
    count += 1; // service × city
    count += config.intents.length; // + intents
    count += city.districts.length; // + districts
  }
  return config.limit ? Math.min(count, config.limit) : count;
}

function addInternalLinks(pages: SEOGeneratedPage[]): SEOGeneratedPage[] {
  // Build a map of city pages for linking
  const cityPages = pages.filter((p) => !p.meta.district && !p.meta.intent);
  const districtPages = pages.filter((p) => p.meta.district);
  const intentPages = pages.filter((p) => p.meta.intent);

  return pages.map((page) => {
    const links: { slug: string; anchor: string }[] = [];

    if (page.meta.district) {
      // District page → link to main city page
      const cityPage = cityPages.find((cp) => cp.meta.city === page.meta.city);
      if (cityPage) links.push({ slug: cityPage.slug, anchor: `${page.meta.service} in ${page.meta.city}` });
    }

    if (!page.meta.district && !page.meta.intent) {
      // Main city page → link to district pages + intent pages
      const related = districtPages.filter((dp) => dp.meta.city === page.meta.city);
      for (const rp of related.slice(0, 5)) {
        links.push({ slug: rp.slug, anchor: `${page.meta.service} in ${rp.meta.district}` });
      }
      const intents = intentPages.filter((ip) => ip.meta.city === page.meta.city);
      for (const ip of intents) {
        links.push({ slug: ip.slug, anchor: `${ip.meta.intent} ${page.meta.service} in ${page.meta.city}` });
      }
    }

    if (page.meta.intent) {
      // Intent page → link to main city page
      const cityPage = cityPages.find((cp) => cp.meta.city === page.meta.city);
      if (cityPage) links.push({ slug: cityPage.slug, anchor: `${page.meta.service} in ${page.meta.city}` });
    }

    return { ...page, internalLinks: links };
  });
}
