export interface TemplatePreset {
  id: string;
  name: string;
  description: string;
  preview: {
    bg: string;
    accent: string;
    text: string;
  };
  styles: {
    backgroundColor: string;
    backgroundOpacity: number;
    textColor: string;
    fontFamily: string;
    fontSize: number;
  };
}

export const templatePresets: TemplatePreset[] = [
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean design, lots of whitespace, calm tones',
    preview: { bg: '#f8f9fa', accent: '#212529', text: '#495057' },
    styles: {
      backgroundColor: '#f8f9fa',
      backgroundOpacity: 100,
      textColor: '#212529',
      fontFamily: 'Inter',
      fontSize: 16,
    },
  },
  {
    id: 'corporate',
    name: 'Corporate',
    description: 'Strict and professional, blue accents',
    preview: { bg: '#ffffff', accent: '#1e40af', text: '#1e3a5f' },
    styles: {
      backgroundColor: '#ffffff',
      backgroundOpacity: 100,
      textColor: '#1e3a5f',
      fontFamily: 'Georgia',
      fontSize: 16,
    },
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and vibrant, gradients and rich colors',
    preview: { bg: '#fef3c7', accent: '#f59e0b', text: '#78350f' },
    styles: {
      backgroundColor: '#fef3c7',
      backgroundOpacity: 100,
      textColor: '#78350f',
      fontFamily: 'Poppins',
      fontSize: 18,
    },
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Elegant dark theme with high-contrast text',
    preview: { bg: '#1a1a2e', accent: '#e94560', text: '#eaeaea' },
    styles: {
      backgroundColor: '#1a1a2e',
      backgroundOpacity: 100,
      textColor: '#eaeaea',
      fontFamily: 'JetBrains Mono',
      fontSize: 15,
    },
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Natural green tones, warm palette',
    preview: { bg: '#f0fdf4', accent: '#16a34a', text: '#14532d' },
    styles: {
      backgroundColor: '#f0fdf4',
      backgroundOpacity: 100,
      textColor: '#14532d',
      fontFamily: 'Georgia',
      fontSize: 16,
    },
  },
  {
    id: 'retro',
    name: 'Retro',
    description: 'Vintage style with warm muted colors',
    preview: { bg: '#fdf6e3', accent: '#cb4b16', text: '#586e75' },
    styles: {
      backgroundColor: '#fdf6e3',
      backgroundOpacity: 100,
      textColor: '#586e75',
      fontFamily: 'Courier New',
      fontSize: 16,
    },
  },
];
