import type { AIContext, AISEOResult, AIModule, SEOPage } from '../types';

function generateSEOPages(ctx: AIContext): SEOPage[] {
  const { serviceCategory, targetCity, subServices } = ctx;
  const cat = serviceCategory.toLowerCase();
  const city = targetCity;

  const pages: SEOPage[] = [];

  // Main service + city page
  pages.push({
    slug: `${cat.replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`,
    title: `${serviceCategory} in ${city} — Professional ${serviceCategory} Services`,
    metaDescription: `Looking for reliable ${cat} in ${city}? Our licensed team offers fast, affordable ${cat} services. Call now for a free quote!`,
    h1: `Professional ${serviceCategory} Services in ${city}`,
    headings: [
      { level: 2, text: `Why Choose Our ${serviceCategory} in ${city}` },
      { level: 2, text: `Our ${serviceCategory} Services` },
      { level: 3, text: 'Service Areas' },
      { level: 2, text: 'Pricing & Estimates' },
      { level: 2, text: 'Frequently Asked Questions' },
    ],
    bodyContent: `We are ${city}'s trusted ${cat} experts. With years of experience and hundreds of satisfied customers, we deliver quality workmanship at competitive prices.`,
    faq: [
      { question: `How much does ${cat} cost in ${city}?`, answer: `Prices vary depending on the scope of work. Contact us for a free, no-obligation estimate.` },
      { question: `Do you offer emergency ${cat} services?`, answer: `Yes! We provide 24/7 emergency ${cat} in ${city} and surrounding areas.` },
      { question: `Are your ${cat} professionals licensed?`, answer: `Absolutely. All our technicians are fully licensed, insured, and background-checked.` },
    ],
  });

  // Emergency page
  pages.push({
    slug: `emergency-${cat.replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`,
    title: `Emergency ${serviceCategory} ${city} — 24/7 Fast Response`,
    metaDescription: `Need emergency ${cat} in ${city}? We're available 24/7 with fast response times. Licensed professionals ready to help now.`,
    h1: `Emergency ${serviceCategory} in ${city}`,
    headings: [
      { level: 2, text: '24/7 Emergency Service' },
      { level: 2, text: 'Fast Response Times' },
      { level: 2, text: 'Common Emergency Situations' },
    ],
    bodyContent: `When ${cat} emergencies happen, you need fast, reliable service. Our ${city} team responds within 30 minutes.`,
    faq: [
      { question: `How fast can you respond to a ${cat} emergency?`, answer: `We typically arrive within 30-60 minutes in the ${city} area.` },
      { question: `Is emergency ${cat} more expensive?`, answer: `We keep our emergency rates competitive. You'll receive a clear estimate before we begin.` },
    ],
  });

  // Sub-service pages
  for (const sub of subServices.slice(0, 3)) {
    const slug = `${sub.toLowerCase().replace(/\s+/g, '-')}-${city.toLowerCase().replace(/\s+/g, '-')}`;
    pages.push({
      slug,
      title: `${sub} in ${city} — Expert ${serviceCategory} Service`,
      metaDescription: `Professional ${sub.toLowerCase()} services in ${city}. Fast, reliable, and affordable. Get a free estimate today.`,
      h1: `${sub} Services in ${city}`,
      headings: [
        { level: 2, text: `About ${sub}` },
        { level: 2, text: 'Our Process' },
        { level: 2, text: 'Pricing' },
      ],
      bodyContent: `Our ${city} team specializes in ${sub.toLowerCase()}. We use the latest techniques and equipment for optimal results.`,
      faq: [
        { question: `How much does ${sub.toLowerCase()} cost in ${city}?`, answer: `Prices depend on the specifics. Contact us for a personalized quote.` },
      ],
    });
  }

  return pages;
}

export const aiSEOModule: AIModule<AISEOResult> = {
  name: 'AI SEO',
  run: async (context: AIContext): Promise<AISEOResult> => {
    await new Promise((r) => setTimeout(r, 900));
    return { pages: generateSEOPages(context) };
  },
};
