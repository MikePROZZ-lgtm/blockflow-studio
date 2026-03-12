import type { Block, Page } from '@/types/editor';

// ─── Language ─────────────────────────────────────────────
export type ContentLanguage = 'en' | 'de' | 'fr' | 'es' | 'ru';

export const LANGUAGE_LABELS: Record<ContentLanguage, string> = {
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  ru: 'Русский',
};

// ─── Service Taxonomy ─────────────────────────────────────
export interface ServiceTaxonomy {
  industry: string;
  serviceCategory: string;
  subServices: string[];
}

// ─── AI Context (shared across all modules) ───────────────
export interface AIContext {
  pages: Page[];
  activePageId: string;
  siteTopic: string;
  targetCity: string;
  serviceCategory: string;
  industry: string;
  subServices: string[];
  language: ContentLanguage;
}

// ─── Design Theme ─────────────────────────────────────────
export interface DesignTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  buttonStyle: {
    radius: string;
    hoverEffect: 'scale' | 'glow' | 'shadow' | 'darken';
  };
  animations: {
    pageTransition: 'fade' | 'slide' | 'none';
    blockEntrance: 'fade-up' | 'fade-in' | 'scale' | 'none';
  };
}

// ─── Content Block Output ─────────────────────────────────
export type BlockType = 'hero' | 'features' | 'services' | 'gallery' | 'pricing' | 'cta' | 'contact' | 'about' | 'testimonials' | 'faq';

export interface BlockContent {
  page: string;
  blockId: string;
  blockType: BlockType;
  headline: string;
  subheadline: string;
  description: string;
  cta: string;
}

// ─── SEO Page Output ──────────────────────────────────────
export interface SEOPage {
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  headings: { level: 2 | 3; text: string }[];
  bodyContent: string;
  faq: { question: string; answer: string }[];
  structuredData?: Record<string, unknown>;
}

// ─── SMM Post Output ─────────────────────────────────────
export type SocialPlatform = 'instagram' | 'facebook' | 'linkedin';

export interface SMMPost {
  platform: SocialPlatform;
  caption: string;
  hashtags: string[];
  suggestedImagePrompt?: string;
}

// ─── Module Results ───────────────────────────────────────
export interface AIDesignResult {
  theme: DesignTheme;
}

export interface AIContentResult {
  blocks: BlockContent[];
}

export interface AISEOResult {
  pages: SEOPage[];
}

export interface AISMMResult {
  posts: SMMPost[];
}

export interface AIPipelineResult {
  design?: AIDesignResult;
  content?: AIContentResult;
  seo?: AISEOResult;
  smm?: AISMMResult;
}

// ─── Module Interface ─────────────────────────────────────
export interface AIModule<T> {
  name: string;
  run: (context: AIContext) => Promise<T>;
}
