import type { AIContext, AIDesignResult, AIModule, DesignTheme } from '../types';

const INDUSTRY_THEMES: Record<string, Partial<DesignTheme>> = {
  'Home Services': {
    colors: { primary: '#2563eb', secondary: '#f59e0b', background: '#f8fafc', accent: '#0ea5e9', text: '#1e293b' },
    fonts: { heading: 'Poppins', body: 'Inter' },
    buttonStyle: { radius: '8px', hoverEffect: 'shadow' },
  },
  'Health & Wellness': {
    colors: { primary: '#059669', secondary: '#14b8a6', background: '#f0fdf4', accent: '#10b981', text: '#1a2e1a' },
    fonts: { heading: 'Playfair Display', body: 'Lato' },
    buttonStyle: { radius: '24px', hoverEffect: 'glow' },
  },
  'Professional Services': {
    colors: { primary: '#1e3a5f', secondary: '#64748b', background: '#f8fafc', accent: '#3b82f6', text: '#0f172a' },
    fonts: { heading: 'Merriweather', body: 'Source Sans Pro' },
    buttonStyle: { radius: '4px', hoverEffect: 'darken' },
  },
  'Automotive': {
    colors: { primary: '#dc2626', secondary: '#1e293b', background: '#fafafa', accent: '#f97316', text: '#171717' },
    fonts: { heading: 'Oswald', body: 'Roboto' },
    buttonStyle: { radius: '6px', hoverEffect: 'scale' },
  },
  'Beauty & Personal Care': {
    colors: { primary: '#be185d', secondary: '#e879a8', background: '#fdf2f8', accent: '#ec4899', text: '#1f1f1f' },
    fonts: { heading: 'Cormorant Garamond', body: 'Nunito' },
    buttonStyle: { radius: '20px', hoverEffect: 'glow' },
  },
  'Food & Hospitality': {
    colors: { primary: '#b45309', secondary: '#d97706', background: '#fffbeb', accent: '#f59e0b', text: '#1c1917' },
    fonts: { heading: 'Playfair Display', body: 'Open Sans' },
    buttonStyle: { radius: '12px', hoverEffect: 'shadow' },
  },
  'Education & Training': {
    colors: { primary: '#4f46e5', secondary: '#7c3aed', background: '#f5f3ff', accent: '#6366f1', text: '#1e1b4b' },
    fonts: { heading: 'Nunito', body: 'Inter' },
    buttonStyle: { radius: '10px', hoverEffect: 'scale' },
  },
  'Fitness & Sports': {
    colors: { primary: '#059669', secondary: '#f97316', background: '#f0fdf4', accent: '#10b981', text: '#064e3b' },
    fonts: { heading: 'Oswald', body: 'Roboto' },
    buttonStyle: { radius: '6px', hoverEffect: 'scale' },
  },
};

const DEFAULT_THEME: DesignTheme = {
  colors: { primary: '#3b82f6', secondary: '#64748b', background: '#ffffff', accent: '#8b5cf6', text: '#1a1a2e' },
  fonts: { heading: 'Inter', body: 'Inter' },
  buttonStyle: { radius: '8px', hoverEffect: 'shadow' },
  animations: { pageTransition: 'fade', blockEntrance: 'fade-up' },
};

export const aiDesignModule: AIModule<AIDesignResult> = {
  name: 'AI Design',
  run: async (context: AIContext): Promise<AIDesignResult> => {
    await new Promise((r) => setTimeout(r, 800));

    const industryTheme = INDUSTRY_THEMES[context.industry] ?? {};

    const theme: DesignTheme = {
      ...DEFAULT_THEME,
      ...industryTheme,
      colors: { ...DEFAULT_THEME.colors, ...industryTheme.colors },
      fonts: { ...DEFAULT_THEME.fonts, ...industryTheme.fonts },
      buttonStyle: { ...DEFAULT_THEME.buttonStyle, ...industryTheme.buttonStyle },
    };

    return { theme };
  },
};
