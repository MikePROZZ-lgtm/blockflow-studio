import React, { useState } from 'react';
import { LayoutTemplate, X, ChevronRight, Check } from 'lucide-react';
import { getTemplateIndustries, getTemplatesByIndustry, templateToPages, type IndustryTemplate } from '@/data/industryTemplates';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

export const IndustryTemplatesPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { saveToHistory, loadPages } = useEditorStore();
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const industries = getTemplateIndustries();
  const templates = selectedIndustry ? getTemplatesByIndustry(selectedIndustry) : [];

  const applyTemplate = (template: IndustryTemplate) => {
    saveToHistory();
    const pages = templateToPages(template);
    loadPages(pages);
    setAppliedId(template.id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="absolute top-14 right-4 z-[9999] w-96 bg-card border border-border rounded-xl shadow-2xl animate-scale-in overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">
            {selectedIndustry ?? 'Industry Templates'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {selectedIndustry && (
            <button
              onClick={() => setSelectedIndustry(null)}
              className="px-2 py-1 text-xs rounded-md hover:bg-secondary text-muted-foreground transition-smooth"
            >
              ← Back
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary transition-smooth">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="max-h-[440px] overflow-y-auto">
        {/* Industry list */}
        {!selectedIndustry && (
          <div className="p-2 space-y-1">
            {industries.map((industry) => (
              <button
                key={industry}
                onClick={() => setSelectedIndustry(industry)}
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-secondary text-left transition-smooth group"
              >
                <div>
                  <span className="text-sm font-medium text-foreground">{industry}</span>
                  <p className="text-xs text-muted-foreground">4 layouts</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-smooth" />
              </button>
            ))}
          </div>
        )}

        {/* Templates for selected industry */}
        {selectedIndustry && (
          <div className="p-3 space-y-3">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => applyTemplate(tpl)}
                className={cn(
                  'w-full text-left rounded-lg border border-border p-3 hover:border-primary/50 transition-all',
                  appliedId === tpl.id && 'border-primary bg-primary/5'
                )}
              >
                {/* Color strip */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    {[tpl.colors.primary, tpl.colors.secondary, tpl.colors.accent, tpl.colors.background].map((c, i) => (
                      <div
                        key={i}
                        className="w-5 h-5 rounded border border-border/50"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{tpl.name}</span>
                      {appliedId === tpl.id && <Check className="w-3.5 h-3.5 text-primary animate-scale-in" />}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mb-2">{tpl.description}</p>

                {/* Mini preview */}
                <div
                  className="rounded-md p-2 border border-border/30 space-y-1"
                  style={{ backgroundColor: tpl.colors.background }}
                >
                  {tpl.blockDefs.slice(0, 4).map((bd, i) => (
                    <div
                      key={i}
                      className="rounded text-[9px] px-2 py-1 truncate"
                      style={{
                        backgroundColor: i === 0 ? tpl.colors.primary : `${tpl.colors.secondary}22`,
                        color: i === 0 ? '#fff' : tpl.colors.text,
                        fontFamily: i === 0 ? tpl.fonts.heading : tpl.fonts.body,
                      }}
                    >
                      {bd.text}
                    </div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-2 border-t border-border">
        <p className="text-[11px] text-muted-foreground text-center">
          Replaces current page with selected template layout
        </p>
      </div>
    </div>
  );
};
