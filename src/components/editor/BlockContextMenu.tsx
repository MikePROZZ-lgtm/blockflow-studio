import React, { useRef, useEffect, useState } from 'react';
import { X, ImagePlus, Trash2 } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import type { Block } from '@/types/editor';

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'JetBrains Mono', label: 'Mono' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times' },
];

const fontSizes = [10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

const bgSizes: { value: Block['backgroundSize']; label: string }[] = [
  { value: 'cover', label: 'Cover' },
  { value: 'contain', label: 'Contain' },
  { value: '50%', label: '50%' },
  { value: '75%', label: '75%' },
  { value: '100%', label: '100%' },
  { value: '125%', label: '125%' },
  { value: '150%', label: '150%' },
  { value: 'auto', label: 'Auto' },
];

interface BlockContextMenuProps {
  blockId: string;
  x: number;
  y: number;
  onClose: () => void;
}

export const BlockContextMenu: React.FC<BlockContextMenuProps> = ({ blockId, x, y, onClose }) => {
  const { pages, activePageId, updateBlock, deleteBlock, saveToHistory } = useEditorStore();
  const menuRef = useRef<HTMLDivElement>(null);
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  const [adjustedPos, setAdjustedPos] = useState({ x, y });

  const activePage = pages.find((p) => p.id === activePageId);
  const block = activePage?.blocks.find((b) => b.id === blockId);

  // Adjust position so menu doesn't overflow viewport
  useEffect(() => {
    if (!menuRef.current) return;
    const rect = menuRef.current.getBoundingClientRect();
    let newX = x;
    let newY = y;
    if (newX + rect.width > window.innerWidth - 8) newX = window.innerWidth - rect.width - 8;
    if (newY + rect.height > window.innerHeight - 8) newY = window.innerHeight - rect.height - 8;
    if (newX < 8) newX = 8;
    if (newY < 8) newY = 8;
    setAdjustedPos({ x: newX, y: newY });
  }, [x, y]);

  // Close on outside click or Escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  if (!block) return null;

  const handleChange = (field: string, value: string | number) => {
    saveToHistory();
    updateBlock(blockId, { [field]: value });
  };

  const handleImageUpload = (field: 'backgroundImage' | 'contentImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      saveToHistory();
      updateBlock(blockId, { [field]: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '255, 255, 255';
  };

  return (
    <div
      ref={menuRef}
      className="fixed z-[99999] bg-card border border-border rounded-xl shadow-2xl w-64 flex flex-col"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Block Style</span>
        <button onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto max-h-[80vh]">
        {/* ── Text ── */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground">Text</div>

          {/* Font family */}
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">Font</div>
            <div className="flex flex-wrap gap-1">
              {fontFamilies.map((f) => (
                <button
                  key={f.value}
                  onClick={() => handleChange('fontFamily', f.value)}
                  className={`px-2 py-1 rounded text-xs border transition-colors ${
                    block.fontFamily === f.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-secondary text-foreground'
                  }`}
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">Size</div>
            <div className="flex flex-wrap gap-1">
              {fontSizes.map((s) => (
                <button
                  key={s}
                  onClick={() => handleChange('fontSize', s)}
                  className={`px-2 py-1 rounded text-xs border transition-colors ${
                    block.fontSize === s
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border hover:bg-secondary text-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Text color */}
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">Color</div>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer p-0.5 bg-card"
              />
              <Input
                value={block.textColor}
                onChange={(e) => handleChange('textColor', e.target.value)}
                className="flex-1 h-9 font-mono text-xs"
                placeholder="#1a1a2e"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* ── Background ── */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground">Background</div>

          {/* BG color */}
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">Color</div>
            <div className="flex gap-2">
              <input
                type="color"
                value={block.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="w-9 h-9 rounded border border-border cursor-pointer p-0.5 bg-card"
              />
              <Input
                value={block.backgroundColor}
                onChange={(e) => handleChange('backgroundColor', e.target.value)}
                className="flex-1 h-9 font-mono text-xs"
              />
            </div>
          </div>

          {/* Opacity */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="text-[10px] text-muted-foreground">Opacity</div>
              <div className="text-[10px] text-muted-foreground">{block.backgroundOpacity}%</div>
            </div>
            <Slider
              value={[block.backgroundOpacity]}
              onValueChange={([v]) => handleChange('backgroundOpacity', v)}
              max={100}
              step={1}
              className="w-full"
            />
          </div>

          {/* BG Image */}
          <div className="space-y-1">
            <div className="text-[10px] text-muted-foreground">Background Image</div>
            <input ref={bgImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload('backgroundImage')} />
            {block.backgroundImage ? (
              <div className="space-y-1.5">
                <div
                  className="relative w-full h-16 rounded-lg overflow-hidden bg-muted"
                  style={{
                    backgroundImage: `url(${block.backgroundImage})`,
                    backgroundSize: block.backgroundSize || 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  <button
                    onClick={() => handleChange('backgroundImage', '')}
                    className="absolute top-1 right-1 p-0.5 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <button onClick={() => bgImageInputRef.current?.click()} className="w-full text-[10px] text-primary hover:underline">
                  Change image
                </button>
                {/* BG image size */}
                <div className="space-y-1">
                  <div className="text-[10px] text-muted-foreground">Image size</div>
                  <div className="flex flex-wrap gap-1">
                    {bgSizes.map((s) => (
                      <button
                        key={s.value}
                        onClick={() => handleChange('backgroundSize', s.value!)}
                        className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${
                          (block.backgroundSize || 'cover') === s.value
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'border-border hover:bg-secondary text-foreground'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => bgImageInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-xs text-muted-foreground hover:text-foreground"
              >
                <ImagePlus className="w-3.5 h-3.5" />
                Upload image
              </button>
            )}
          </div>
        </div>

        <div className="h-px bg-border" />

        {/* ── Content Image ── */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-foreground">Content Image</div>
          <input ref={contentImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload('contentImage')} />
          {block.contentImage ? (
            <div className="space-y-1.5">
              <div className="relative w-full h-16 rounded-lg overflow-hidden bg-muted">
                <img src={block.contentImage} alt="Content" className="w-full h-full object-contain" />
                <button
                  onClick={() => handleChange('contentImage', '')}
                  className="absolute top-1 right-1 p-0.5 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <button onClick={() => contentImageInputRef.current?.click()} className="w-full text-[10px] text-primary hover:underline">
                Change image
              </button>
            </div>
          ) : (
            <button
              onClick={() => contentImageInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-xs text-muted-foreground hover:text-foreground"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              Upload image
            </button>
          )}
        </div>

        <div className="h-px bg-border" />

        {/* Delete */}
        <button
          onClick={() => { deleteBlock(blockId); onClose(); }}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-destructive hover:bg-destructive/10 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete block
        </button>
      </div>
    </div>
  );
};
