/**
 * Keyword Engine
 * Generates keyword variations for SEO targeting.
 */

import type { ServiceEntry } from '@/data/serviceTaxonomy';

export interface KeywordCluster {
  primary: string;
  secondary: string[];
  longTail: string[];
  localModifiers: string[];
}

export function generateKeywordCluster(
  service: ServiceEntry,
  city: string,
  district?: string,
): KeywordCluster {
  const loc = district ? `${district}, ${city}` : city;
  const svc = service.name.toLowerCase();

  const primary = `${svc} ${city.toLowerCase()}`;

  const secondary = [
    `${svc} in ${city}`,
    `${city} ${svc}`,
    `best ${svc} ${city}`,
    `professional ${svc} ${city}`,
    ...service.keywords.map((kw) => `${kw} ${city.toLowerCase()}`),
  ];

  const longTail = [
    `affordable ${svc} in ${loc}`,
    `${svc} near me in ${loc}`,
    `licensed ${svc} ${loc}`,
    `top rated ${svc} in ${loc}`,
    `${svc} services in ${loc}`,
    ...service.commonPhrases.map((p) => `${p} ${city.toLowerCase()}`),
  ];

  const localModifiers = [
    city,
    `near ${city}`,
    `in ${city}`,
    ...(district ? [district, `in ${district}`, `near ${district}`] : []),
  ];

  return { primary, secondary, longTail, localModifiers };
}

/** Generate keyword density report for a page's content */
export function analyzeKeywordDensity(
  content: string,
  targetKeywords: string[],
): { keyword: string; count: number; density: number }[] {
  const words = content.toLowerCase().split(/\s+/).length;
  return targetKeywords.map((kw) => {
    const regex = new RegExp(kw.toLowerCase(), 'gi');
    const matches = content.match(regex);
    const count = matches?.length ?? 0;
    return {
      keyword: kw,
      count,
      density: words > 0 ? (count / words) * 100 : 0,
    };
  });
}
