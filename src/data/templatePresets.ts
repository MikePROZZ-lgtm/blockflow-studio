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
    name: 'Минимализм',
    description: 'Чистый дизайн, много воздуха, спокойные тона',
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
    name: 'Корпоративный',
    description: 'Строгий и профессиональный, синие акценты',
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
    name: 'Креативный',
    description: 'Яркий и смелый, градиенты и насыщенные цвета',
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
    name: 'Тёмный',
    description: 'Элегантная тёмная тема с контрастным текстом',
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
    name: 'Природа',
    description: 'Натуральные зелёные тона, тёплая палитра',
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
    name: 'Ретро',
    description: 'Винтажный стиль с тёплыми приглушёнными цветами',
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
