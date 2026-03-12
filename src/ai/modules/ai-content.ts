import type { AIContext, AIContentResult, AIModule, BlockContent, BlockType } from '../types';

const BLOCK_TEMPLATES: Record<string, Record<BlockType, (ctx: AIContext) => Omit<BlockContent, 'page' | 'blockId' | 'blockType'>>> = {
  en: {
    hero: (ctx) => ({
      headline: `Professional ${ctx.serviceCategory} in ${ctx.targetCity}`,
      subheadline: `Trusted ${ctx.industry.toLowerCase()} experts serving ${ctx.targetCity} and surrounding areas`,
      description: `We provide top-quality ${ctx.serviceCategory.toLowerCase()} services with fast response times and competitive pricing. Available 24/7 for your convenience.`,
      cta: 'Get a Free Quote',
    }),
    features: (ctx) => ({
      headline: `Why Choose Our ${ctx.serviceCategory} Services`,
      subheadline: 'What sets us apart',
      description: `Licensed professionals, transparent pricing, and guaranteed satisfaction. We bring years of experience in ${ctx.serviceCategory.toLowerCase()} to every job.`,
      cta: 'Learn More',
    }),
    services: (ctx) => ({
      headline: `Our ${ctx.serviceCategory} Services`,
      subheadline: `Complete ${ctx.serviceCategory.toLowerCase()} solutions`,
      description: ctx.subServices.map((s) => `• ${s}`).join('\n'),
      cta: 'View All Services',
    }),
    gallery: (ctx) => ({
      headline: 'Our Recent Work',
      subheadline: `${ctx.serviceCategory} projects in ${ctx.targetCity}`,
      description: `Browse our portfolio of completed ${ctx.serviceCategory.toLowerCase()} projects. Quality workmanship you can trust.`,
      cta: 'See More Projects',
    }),
    pricing: (ctx) => ({
      headline: 'Transparent Pricing',
      subheadline: `Fair rates for ${ctx.serviceCategory.toLowerCase()}`,
      description: `No hidden fees. We provide upfront estimates before any work begins. Contact us for a personalized quote.`,
      cta: 'Request a Quote',
    }),
    cta: (ctx) => ({
      headline: `Ready to Get Started?`,
      subheadline: `Book your ${ctx.serviceCategory.toLowerCase()} service today`,
      description: `Don't wait — our team in ${ctx.targetCity} is ready to help. Fast, reliable, and affordable.`,
      cta: 'Call Now',
    }),
    contact: (ctx) => ({
      headline: 'Contact Us',
      subheadline: `Reach our ${ctx.targetCity} team`,
      description: `Have questions about our ${ctx.serviceCategory.toLowerCase()} services? Get in touch — we respond within 1 hour.`,
      cta: 'Send Message',
    }),
    about: (ctx) => ({
      headline: `About Our ${ctx.serviceCategory} Company`,
      subheadline: `Serving ${ctx.targetCity} with excellence`,
      description: `With over 10 years of experience, we are ${ctx.targetCity}'s trusted ${ctx.serviceCategory.toLowerCase()} provider. Our certified team handles every project with care.`,
      cta: 'Meet the Team',
    }),
    testimonials: (ctx) => ({
      headline: 'What Our Clients Say',
      subheadline: `Trusted by ${ctx.targetCity} residents`,
      description: `"Excellent ${ctx.serviceCategory.toLowerCase()} service! Fast, professional, and great value." — Satisfied Customer`,
      cta: 'Read More Reviews',
    }),
    faq: (ctx) => ({
      headline: 'Frequently Asked Questions',
      subheadline: `Common ${ctx.serviceCategory.toLowerCase()} questions`,
      description: `Find answers to common questions about our ${ctx.serviceCategory.toLowerCase()} services in ${ctx.targetCity}.`,
      cta: 'Ask a Question',
    }),
  },
};

// For non-English, produce English-like placeholders (real AI will translate)
function getTemplates(lang: string) {
  return BLOCK_TEMPLATES[lang] ?? BLOCK_TEMPLATES.en;
}

const BLOCK_TYPE_KEYWORDS: Record<string, BlockType> = {
  hero: 'hero', header: 'hero', banner: 'hero',
  feature: 'features', features: 'features', benefit: 'features',
  service: 'services', services: 'services',
  gallery: 'gallery', portfolio: 'gallery', work: 'gallery',
  pricing: 'pricing', price: 'pricing', plan: 'pricing',
  cta: 'cta', action: 'cta', 'call to action': 'cta',
  contact: 'contact', form: 'contact',
  about: 'about', 'about us': 'about', team: 'about',
  testimonial: 'testimonials', review: 'testimonials', testimonials: 'testimonials',
  faq: 'faq', question: 'faq',
};

function inferBlockType(block: { text: string; y: number }, index: number, total: number): BlockType {
  const text = block.text.toLowerCase();
  for (const [keyword, type] of Object.entries(BLOCK_TYPE_KEYWORDS)) {
    if (text.includes(keyword)) return type;
  }
  // Position-based fallback
  if (index === 0) return 'hero';
  if (index === total - 1) return 'cta';
  if (index === 1) return 'features';
  if (index === 2) return 'services';
  return 'about';
}

export const aiContentModule: AIModule<AIContentResult> = {
  name: 'AI Content',
  run: async (context: AIContext): Promise<AIContentResult> => {
    await new Promise((r) => setTimeout(r, 1000));

    const templates = getTemplates(context.language);
    const blocks: BlockContent[] = [];

    for (const page of context.pages) {
      const sorted = [...page.blocks].sort((a, b) => a.y - b.y);
      sorted.forEach((block, idx) => {
        const blockType = inferBlockType(block, idx, sorted.length);
        const template = templates[blockType](context);
        blocks.push({
          page: page.name,
          blockId: block.id,
          blockType,
          ...template,
        });
      });
    }

    return { blocks };
  },
};
