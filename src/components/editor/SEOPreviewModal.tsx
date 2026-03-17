import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ExternalLink, Search } from 'lucide-react';
import type { SEOPage } from '@/ai/types';
import { cn } from '@/lib/utils';

interface SEOPreviewModalProps {
  pages: SEOPage[];
  onClose: () => void;
}

export const SEOPreviewModal: React.FC<SEOPreviewModalProps> = ({ pages, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const page = pages[activeIndex];

  if (!page) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-4xl h-[85vh] bg-card rounded-xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
          <div className="flex items-center gap-3">
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">SEO Page Preview</span>
            <span className="text-xs text-muted-foreground">
              {activeIndex + 1} / {pages.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
              disabled={activeIndex === 0}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground disabled:opacity-30 transition-smooth"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => Math.min(pages.length - 1, i + 1))}
              disabled={activeIndex === pages.length - 1}
              className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground disabled:opacity-30 transition-smooth"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-smooth">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Page tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-border overflow-x-auto">
          {pages.map((p, i) => (
            <button
              key={p.slug}
              onClick={() => setActiveIndex(i)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-smooth',
                i === activeIndex
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              )}
            >
              /{p.slug}
            </button>
          ))}
        </div>

        {/* Browser chrome mockup */}
        <div className="mx-5 mt-4 rounded-t-lg border border-border border-b-0 bg-secondary/50 px-4 py-2 flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-[hsl(var(--success))]/60" />
            <div className="w-3 h-3 rounded-full bg-primary/40" />
          </div>
          <div className="flex-1 flex items-center gap-2 px-3 py-1 bg-background rounded-md text-xs text-muted-foreground">
            <ExternalLink className="w-3 h-3" />
            <span>yourdomain.com/{page.slug}</span>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 mx-5 mb-5 border border-border rounded-b-lg bg-white overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10" style={{ color: '#1a1a2e' }}>
            {/* SERP preview */}
            <div className="mb-8 p-4 rounded-lg border border-border bg-[hsl(var(--secondary))]">
              <p className="text-xs font-medium text-muted-foreground mb-1">Google Search Preview</p>
              <p className="text-sm font-medium" style={{ color: '#1a0dab' }}>{page.title}</p>
              <p className="text-xs" style={{ color: '#006621' }}>yourdomain.com/{page.slug}</p>
              <p className="text-xs mt-1" style={{ color: '#545454' }}>{page.metaDescription}</p>
            </div>

            {/* Page content */}
            <h1 className="text-2xl font-bold mb-4" style={{ color: '#1a1a2e' }}>{page.h1}</h1>
            <p className="mb-6 leading-relaxed" style={{ color: '#444' }}>{page.bodyContent}</p>

            {page.headings.map((h, i) => {
              const Tag = `h${h.level}` as keyof JSX.IntrinsicElements;
              return (
                <Tag
                  key={i}
                  className={cn(
                    'font-semibold mt-6 mb-2',
                    h.level === 2 ? 'text-xl' : 'text-lg'
                  )}
                  style={{ color: '#1a1a2e' }}
                >
                  {h.text}
                </Tag>
              );
            })}

            {/* FAQ */}
            {page.faq.length > 0 && (
              <div className="mt-8 space-y-4">
                <h2 className="text-xl font-semibold" style={{ color: '#1a1a2e' }}>FAQ</h2>
                {page.faq.map((f, i) => (
                  <div key={i} className="border-b pb-4" style={{ borderColor: '#eee' }}>
                    <h3 className="font-medium mb-1" style={{ color: '#1a1a2e' }}>{f.question}</h3>
                    <p className="text-sm" style={{ color: '#666' }}>{f.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
