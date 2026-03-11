import React, { useState } from 'react';
import { Palette, X, Check } from 'lucide-react';
import { templatePresets, TemplatePreset } from '@/data/templatePresets';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

export const TemplatePresetPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { pages, activePageId, saveToHistory } = useEditorStore();
  const updateBlock = useEditorStore((s) => s.updateBlock);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const activePage = pages.find((p) => p.id === activePageId);

  const applyPreset = (preset: TemplatePreset) => {
    if (!activePage) return;
    saveToHistory();

    activePage.blocks.forEach((block) => {
      updateBlock(block.id, {
        backgroundColor: preset.styles.backgroundColor,
        backgroundOpacity: preset.styles.backgroundOpacity,
        textColor: preset.styles.textColor,
        fontFamily: preset.styles.fontFamily,
        fontSize: preset.styles.fontSize,
      });
    });

    setAppliedId(preset.id);
    setTimeout(() => setAppliedId(null), 1500);
  };

  return (
    <div className="absolute top-14 right-4 z-[9999] w-80 bg-card border border-border rounded-xl shadow-2xl animate-scale-in overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm">Templates</span>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-secondary transition-smooth">
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      <div className="p-3 max-h-[400px] overflow-y-auto space-y-2">
        {templatePresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset)}
            className={cn(
              'w-full text-left rounded-lg border border-border p-3 hover:border-primary/50 transition-all group',
              appliedId === preset.id && 'border-primary bg-primary/5'
            )}
          >
            <div className="flex items-center gap-3">
              {/* Color preview */}
              <div className="flex-shrink-0 flex gap-1">
                <div
                  className="w-6 h-6 rounded-md border border-border/50"
                  style={{ backgroundColor: preset.preview.bg }}
                />
                <div
                  className="w-6 h-6 rounded-md border border-border/50"
                  style={{ backgroundColor: preset.preview.accent }}
                />
                <div
                  className="w-6 h-6 rounded-md border border-border/50"
                  style={{ backgroundColor: preset.preview.text }}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground">{preset.name}</span>
                  {appliedId === preset.id && (
                    <Check className="w-3.5 h-3.5 text-primary animate-scale-in" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{preset.description}</p>
              </div>
            </div>

            {/* Live mini-preview */}
            <div
              className="mt-2 rounded-md h-10 flex items-center justify-center text-xs border border-border/30"
              style={{
                backgroundColor: preset.preview.bg,
                color: preset.preview.text,
                fontFamily: preset.styles.fontFamily,
              }}
            >
              <span>Пример текста</span>
              <span
                className="ml-2 px-2 py-0.5 rounded text-white text-[10px]"
                style={{ backgroundColor: preset.preview.accent }}
              >
                Кнопка
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="px-4 py-2 border-t border-border">
        <p className="text-[11px] text-muted-foreground text-center">
          Applies to all blocks on the current page
        </p>
      </div>
    </div>
  );
};
