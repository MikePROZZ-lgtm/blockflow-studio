import React, { useRef } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImagePlus, X } from 'lucide-react';

const fontFamilies = [
  { value: 'Inter', label: 'Inter' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Georgia', label: 'Georgia' },
  { value: 'Arial', label: 'Arial' },
  { value: 'Times New Roman', label: 'Times New Roman' },
];

const fontSizes = [12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 64];

export const BlockStylePanel: React.FC = () => {
  const { pages, activePageId, selectedBlockId, updateBlock, saveToHistory } = useEditorStore();
  const bgImageInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const activePage = pages.find((p) => p.id === activePageId);
  const selectedBlock = activePage?.blocks.find((b) => b.id === selectedBlockId);

  if (!selectedBlock) {
    return (
      <div className="w-64 bg-card border-l border-toolbar-border p-4 flex flex-col items-center justify-center text-center">
        <div className="text-muted-foreground text-sm">
          Select a block to edit
        </div>
      </div>
    );
  }

  const handleChange = (field: string, value: string | number) => {
    saveToHistory();
    updateBlock(selectedBlock.id, { [field]: value });
  };

  const handleImageUpload = (field: 'backgroundImage' | 'contentImage') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      handleChange(field, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-64 bg-card border-l border-toolbar-border p-4 space-y-6 overflow-y-auto">
      <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
        Block Styles
      </div>

      {/* Text settings */}
      <div className="space-y-4">
        <div className="font-medium text-sm">Text</div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Font</Label>
          <Select
            value={selectedBlock.fontFamily}
            onValueChange={(v) => handleChange('fontFamily', v)}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontFamilies.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  <span style={{ fontFamily: font.value }}>{font.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Size</Label>
          <Select
            value={String(selectedBlock.fontSize)}
            onValueChange={(v) => handleChange('fontSize', Number(v))}
          >
            <SelectTrigger className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {fontSizes.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Text Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedBlock.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="w-12 h-9 p-1 cursor-pointer"
            />
            <Input
              value={selectedBlock.textColor}
              onChange={(e) => handleChange('textColor', e.target.value)}
              className="flex-1 h-9 font-mono text-xs"
            />
          </div>
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Background settings */}
      <div className="space-y-4">
        <div className="font-medium text-sm">Background</div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={selectedBlock.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-9 p-1 cursor-pointer"
            />
            <Input
              value={selectedBlock.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 h-9 font-mono text-xs"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs text-muted-foreground">Opacity</Label>
            <span className="text-xs text-muted-foreground">{selectedBlock.backgroundOpacity}%</span>
          </div>
          <Slider
            value={[selectedBlock.backgroundOpacity]}
            onValueChange={([v]) => handleChange('backgroundOpacity', v)}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Image</Label>
          <input
            ref={bgImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload('backgroundImage')}
          />
          {selectedBlock.backgroundImage ? (
            <div className="space-y-2">
              <div className="relative w-full h-20 rounded-lg overflow-hidden bg-muted">
                <img
                  src={selectedBlock.backgroundImage}
                  alt="Background"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleChange('backgroundImage', '')}
                  className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <button
                onClick={() => bgImageInputRef.current?.click()}
                className="w-full text-xs text-primary hover:underline"
              >
                Change Image
              </button>
            </div>
          ) : (
            <button
              onClick={() => bgImageInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              <ImagePlus className="w-4 h-4" />
              Upload Image
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Content image */}
      <div className="space-y-4">
        <div className="font-medium text-sm">Content Image</div>
        <input
          ref={contentImageInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload('contentImage')}
        />
        {selectedBlock.contentImage ? (
          <div className="space-y-2">
            <div className="relative w-full h-20 rounded-lg overflow-hidden bg-muted">
              <img
                src={selectedBlock.contentImage}
                alt="Content"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleChange('contentImage', '')}
                className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full hover:opacity-80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={() => contentImageInputRef.current?.click()}
              className="w-full text-xs text-primary hover:underline"
            >
              Change Image
            </button>
          </div>
        ) : (
          <button
            onClick={() => contentImageInputRef.current?.click()}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 border-2 border-dashed border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-foreground"
          >
            <ImagePlus className="w-4 h-4" />
            Upload Image
          </button>
        )}
      </div>

      <div className="h-px bg-border" />

      {/* Size info */}
      <div className="space-y-2">
        <div className="font-medium text-sm">Size</div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-secondary rounded px-2 py-1.5 font-mono">
            W: {Math.round(selectedBlock.width)}px
          </div>
          <div className="bg-secondary rounded px-2 py-1.5 font-mono">
            H: {Math.round(selectedBlock.height)}px
          </div>
          <div className="bg-secondary rounded px-2 py-1.5 font-mono">
            X: {Math.round(selectedBlock.x)}px
          </div>
          <div className="bg-secondary rounded px-2 py-1.5 font-mono">
            Y: {Math.round(selectedBlock.y)}px
          </div>
        </div>
      </div>
    </div>
  );
};
