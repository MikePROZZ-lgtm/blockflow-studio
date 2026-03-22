/**
 * AI Growth Module
 * Analyzes generated pages and suggests improvements.
 */

import type { SEOGeneratedPage, GrowthRecommendation } from '@/seo/types';

export function analyzePages(pages: SEOGeneratedPage[]): GrowthRecommendation[] {
  const recommendations: GrowthRecommendation[] = [];

  for (const page of pages) {
    // Check content length
    if (page.bodyContent.length < 150) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Low content length',
        suggestion: `Page "${page.title}" has thin content (${page.bodyContent.length} chars). Add more detailed, unique content to improve ranking.`,
        priority: 'high',
      });
    }

    // Check meta description length
    if (page.metaDescription.length < 100) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Short meta description',
        suggestion: `Meta description for "${page.slug}" is only ${page.metaDescription.length} chars. Aim for 140-160 characters.`,
        priority: 'medium',
      });
    }
    if (page.metaDescription.length > 160) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Long meta description',
        suggestion: `Meta description for "${page.slug}" is ${page.metaDescription.length} chars. Trim to under 160 characters to avoid truncation.`,
        priority: 'low',
      });
    }

    // Check FAQ count
    if (page.faq.length < 3) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Few FAQ entries',
        suggestion: `Add more FAQ entries to "${page.slug}". Pages with 4+ FAQs tend to rank better for voice search.`,
        priority: 'medium',
      });
    }

    // Check internal links
    if (page.internalLinks.length === 0) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'No internal links',
        suggestion: `Page "${page.slug}" is an orphan — add internal links to and from other pages to boost crawlability.`,
        priority: 'high',
      });
    }

    // Check title length
    if (page.title.length > 60) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Title too long',
        suggestion: `Title for "${page.slug}" is ${page.title.length} chars. Keep under 60 for best SERP display.`,
        priority: 'medium',
      });
    }

    // Check headings
    if (page.headings.length < 3) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Insufficient heading structure',
        suggestion: `Page "${page.slug}" has only ${page.headings.length} headings. Add more H2/H3 headings to improve content structure.`,
        priority: 'medium',
      });
    }

    // Check for CTA in body
    const ctaWords = ['call', 'book', 'contact', 'free', 'quote', 'schedule', 'get started'];
    const hasWeakCTA = !ctaWords.some((w) => page.bodyContent.toLowerCase().includes(w));
    if (hasWeakCTA) {
      recommendations.push({
        pageSlug: page.slug,
        issue: 'Weak CTA',
        suggestion: `Page "${page.slug}" body content lacks a clear call-to-action. Add phrases like "Call now", "Get a free quote", etc.`,
        priority: 'high',
      });
    }
  }

  return recommendations.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });
}

export function getGrowthSummary(pages: SEOGeneratedPage[], recommendations: GrowthRecommendation[]) {
  return {
    totalPages: pages.length,
    totalIssues: recommendations.length,
    highPriority: recommendations.filter((r) => r.priority === 'high').length,
    mediumPriority: recommendations.filter((r) => r.priority === 'medium').length,
    lowPriority: recommendations.filter((r) => r.priority === 'low').length,
    averageContentLength: pages.length > 0
      ? Math.round(pages.reduce((sum, p) => sum + p.bodyContent.length, 0) / pages.length)
      : 0,
    averageFAQCount: pages.length > 0
      ? Math.round((pages.reduce((sum, p) => sum + p.faq.length, 0) / pages.length) * 10) / 10
      : 0,
  };
}
