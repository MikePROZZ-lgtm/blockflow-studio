/**
 * Types for the programmatic SEO engine.
 */

export interface SEOGeneratedPage {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  headings: { level: 2 | 3; text: string }[];
  bodyContent: string;
  faq: { question: string; answer: string }[];
  structuredData?: Record<string, unknown>;
  internalLinks: { slug: string; anchor: string }[];
  /** Page generation metadata */
  meta: {
    service: string;
    city: string;
    district?: string;
    intent?: string;
    generatedAt: string;
  };
}

export interface PageGenerationConfig {
  serviceSlug: string;
  serviceName: string;
  categoryName: string;
  industryName: string;
  keywords: string[];
  commonPhrases: string[];
  ctaPatterns: string[];
  subServiceNames: string[];
  cities: { name: string; slug: string; districts: { name: string; slug: string }[] }[];
  intents: string[];
  /** How many pages to generate (cap) */
  limit?: number;
}

export interface GrowthRecommendation {
  pageSlug: string;
  issue: string;
  suggestion: string;
  priority: 'high' | 'medium' | 'low';
}
