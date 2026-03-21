import { nanoid } from 'nanoid';
import type { Block, Page } from '@/types/editor';

export interface IndustryTemplate {
  id: string;
  industry: string;
  name: string;
  description: string;
  /** Layout pattern identifier */
  layout: 'classic' | 'portfolio' | 'landing' | 'minimal';
  /** Color scheme */
  colors: { primary: string; secondary: string; background: string; text: string; accent: string };
  fonts: { heading: string; body: string };
  /** Block definitions (relative to canvas, desktop) */
  blockDefs: BlockDef[];
}

interface BlockDef {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily?: string;
  textColor?: string;
  backgroundColor?: string;
  backgroundOpacity?: number;
}

// ── Helpers ───────────────────────────────────────

function makeBlocks(defs: BlockDef[], colors: IndustryTemplate['colors'], fonts: IndustryTemplate['fonts']): Block[] {
  return defs.map((d, i) => ({
    id: nanoid(),
    x: d.x,
    y: d.y,
    width: d.width,
    height: d.height,
    text: d.text,
    textX: 0,
    textY: 0,
    fontSize: d.fontSize,
    fontFamily: d.fontFamily ?? fonts.body,
    textColor: d.textColor ?? colors.text,
    backgroundColor: d.backgroundColor ?? (i === 0 ? colors.primary : colors.background),
    backgroundOpacity: d.backgroundOpacity ?? 100,
    zIndex: i + 1,
  }));
}

// ── Layout factories ─────────────────────────────

const CANVAS_W = 1200;

function classicLayout(industry: string, category: string): BlockDef[] {
  return [
    { label: 'hero', x: 0, y: 0, width: CANVAS_W, height: 320, text: `Welcome to ${category}`, fontSize: 36 },
    { label: 'services', x: 0, y: 340, width: CANVAS_W, height: 240, text: `Our ${category} Services`, fontSize: 24 },
    { label: 'about', x: 0, y: 600, width: CANVAS_W, height: 200, text: `About Our ${industry} Company`, fontSize: 22 },
    { label: 'contact', x: 0, y: 820, width: CANVAS_W, height: 180, text: 'Contact Us Today', fontSize: 22 },
  ];
}

function portfolioLayout(industry: string, category: string): BlockDef[] {
  return [
    { label: 'hero', x: 0, y: 0, width: CANVAS_W, height: 280, text: `${category} — Portfolio`, fontSize: 34 },
    { label: 'gallery-1', x: 0, y: 300, width: 580, height: 260, text: 'Project Showcase', fontSize: 20 },
    { label: 'gallery-2', x: 620, y: 300, width: 580, height: 260, text: 'Our Best Work', fontSize: 20 },
    { label: 'features', x: 0, y: 580, width: CANVAS_W, height: 200, text: 'Why Choose Us', fontSize: 24 },
    { label: 'cta', x: 200, y: 800, width: 800, height: 140, text: 'Get a Free Quote', fontSize: 26 },
  ];
}

function landingLayout(industry: string, category: string): BlockDef[] {
  return [
    { label: 'hero', x: 0, y: 0, width: CANVAS_W, height: 360, text: `Professional ${category}`, fontSize: 38 },
    { label: 'feature-1', x: 0, y: 380, width: 380, height: 200, text: 'Fast & Reliable', fontSize: 20 },
    { label: 'feature-2', x: 410, y: 380, width: 380, height: 200, text: 'Expert Team', fontSize: 20 },
    { label: 'feature-3', x: 820, y: 380, width: 380, height: 200, text: 'Fair Pricing', fontSize: 20 },
    { label: 'pricing', x: 0, y: 600, width: CANVAS_W, height: 220, text: 'Our Pricing Plans', fontSize: 24 },
    { label: 'cta', x: 200, y: 840, width: 800, height: 140, text: 'Book Now', fontSize: 28 },
  ];
}

function minimalLayout(industry: string, category: string): BlockDef[] {
  return [
    { label: 'hero', x: 0, y: 0, width: CANVAS_W, height: 400, text: category, fontSize: 42 },
    { label: 'services', x: 100, y: 420, width: 1000, height: 200, text: 'What We Offer', fontSize: 22 },
    { label: 'contact', x: 200, y: 640, width: 800, height: 160, text: 'Get In Touch', fontSize: 22 },
  ];
}

const LAYOUT_FNS = {
  classic: classicLayout,
  portfolio: portfolioLayout,
  landing: landingLayout,
  minimal: minimalLayout,
} as const;

// ── Industry themes (mirrored from ai-design) ──

const INDUSTRY_COLORS: Record<string, IndustryTemplate['colors']> = {
  'Home Services':          { primary: '#2563eb', secondary: '#f59e0b', background: '#f8fafc', text: '#1e293b', accent: '#0ea5e9' },
  'Health & Wellness':      { primary: '#059669', secondary: '#14b8a6', background: '#f0fdf4', text: '#1a2e1a', accent: '#10b981' },
  'Professional Services':  { primary: '#1e3a5f', secondary: '#64748b', background: '#f8fafc', text: '#0f172a', accent: '#3b82f6' },
  'Automotive':             { primary: '#dc2626', secondary: '#1e293b', background: '#fafafa', text: '#171717', accent: '#f97316' },
  'Beauty & Personal Care': { primary: '#be185d', secondary: '#e879a8', background: '#fdf2f8', text: '#1f1f1f', accent: '#ec4899' },
  'Food & Hospitality':     { primary: '#b45309', secondary: '#d97706', background: '#fffbeb', text: '#1c1917', accent: '#f59e0b' },
  'Education & Training':   { primary: '#4f46e5', secondary: '#7c3aed', background: '#f5f3ff', text: '#1e1b4b', accent: '#6366f1' },
  'Fitness & Sports':       { primary: '#059669', secondary: '#f97316', background: '#f0fdf4', text: '#064e3b', accent: '#10b981' },
};

const INDUSTRY_FONTS: Record<string, IndustryTemplate['fonts']> = {
  'Home Services':          { heading: 'Poppins', body: 'Inter' },
  'Health & Wellness':      { heading: 'Playfair Display', body: 'Lato' },
  'Professional Services':  { heading: 'Merriweather', body: 'Source Sans Pro' },
  'Automotive':             { heading: 'Oswald', body: 'Roboto' },
  'Beauty & Personal Care': { heading: 'Cormorant Garamond', body: 'Nunito' },
  'Food & Hospitality':     { heading: 'Playfair Display', body: 'Open Sans' },
  'Education & Training':   { heading: 'Nunito', body: 'Inter' },
  'Fitness & Sports':       { heading: 'Oswald', body: 'Roboto' },
};

// ── Layout display names ─────────────────────────

const LAYOUT_META: Record<string, { name: string; desc: string }> = {
  classic:   { name: 'Classic',   desc: 'Hero + Services + About + Contact' },
  portfolio: { name: 'Portfolio', desc: 'Hero + Gallery + Features + CTA' },
  landing:   { name: 'Landing',  desc: 'Hero + Features + Pricing + CTA' },
  minimal:   { name: 'Minimal',  desc: 'Hero + Services + Contact' },
};

// ── Generate all templates ───────────────────────

function generateTemplatesForIndustry(industry: string, categories: string[]): IndustryTemplate[] {
  const colors = INDUSTRY_COLORS[industry] ?? INDUSTRY_COLORS['Home Services'];
  const fonts = INDUSTRY_FONTS[industry] ?? INDUSTRY_FONTS['Home Services'];
  const mainCategory = categories[0] ?? industry;

  return (['classic', 'portfolio', 'landing', 'minimal'] as const).map((layout) => ({
    id: `${industry.toLowerCase().replace(/\s+/g, '-')}-${layout}`,
    industry,
    name: `${LAYOUT_META[layout].name}`,
    description: LAYOUT_META[layout].desc,
    layout,
    colors,
    fonts,
    blockDefs: LAYOUT_FNS[layout](industry, mainCategory),
  }));
}

// Map of industries to their representative first category
const INDUSTRY_CATEGORIES: Record<string, string[]> = {
  'Home Services':          ['Plumbing', 'Electrical', 'HVAC', 'Cleaning'],
  'Health & Wellness':      ['Dental', 'Physiotherapy', 'Chiropractic', 'Mental Health'],
  'Professional Services':  ['Legal', 'Accounting', 'IT Services', 'Marketing Agency'],
  'Automotive':             ['Auto Repair', 'Auto Detailing', 'Towing'],
  'Beauty & Personal Care': ['Hair Salon', 'Spa', 'Barbershop', 'Tattoo & Piercing'],
  'Food & Hospitality':     ['Catering', 'Restaurant', 'Bakery'],
  'Education & Training':   ['Tutoring', 'Music School', 'Driving School'],
  'Fitness & Sports':       ['Personal Training', 'Yoga Studio', 'Martial Arts'],
};

export const INDUSTRY_TEMPLATES: IndustryTemplate[] = Object.entries(INDUSTRY_CATEGORIES).flatMap(
  ([industry, cats]) => generateTemplatesForIndustry(industry, cats)
);

export function getTemplatesByIndustry(industry: string): IndustryTemplate[] {
  return INDUSTRY_TEMPLATES.filter((t) => t.industry === industry);
}

export function getTemplateIndustries(): string[] {
  return Object.keys(INDUSTRY_CATEGORIES);
}

/** Convert a template into pages + blocks ready for the editor */
export function templateToPages(template: IndustryTemplate): Page[] {
  const blocks = makeBlocks(template.blockDefs, template.colors, template.fonts);
  return [
    {
      id: nanoid(),
      name: 'Home',
      blocks,
    },
  ];
}
