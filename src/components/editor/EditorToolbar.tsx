import React from 'react';
import { Monitor, Smartphone, Undo2, Redo2, Layers, Eye, Rocket, X } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

export const EditorToolbar: React.FC = () => {
  const {
    pages,
    activePageId,
    deviceMode,
    showAllBlocks,
    isPreviewMode,
    history,
    setDeviceMode,
    toggleShowAllBlocks,
    togglePreviewMode,
    undo,
    redo,
  } = useEditorStore();

  const activePage = pages.find((p) => p.id === activePageId);

  if (isPreviewMode) {
    return (
      <div className="h-14 bg-card border-b border-toolbar-border flex items-center justify-between px-4 animate-fade-in">
        <span className="font-mono text-sm text-muted-foreground">Preview Mode</span>
        <button
          onClick={togglePreviewMode}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-smooth"
        >
          <X className="w-4 h-4" />
          Exit
        </button>
      </div>
    );
  }

  return (
    <div className="h-14 bg-card border-b border-toolbar-border flex items-center gap-2 px-4 animate-fade-in">
      {/* Current page indicator */}
      <div className="font-mono text-sm text-muted-foreground">
        {activePage?.name || 'No page'}
      </div>

      <div className="flex-1" />

      {/* Device toggle */}
      <div className="flex items-center bg-secondary rounded-lg p-0.5">
        <button
          onClick={() => setDeviceMode('desktop')}
          className={cn(
            'p-2 rounded-md transition-smooth',
            deviceMode === 'desktop' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Monitor className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDeviceMode('mobile')}
          className={cn(
            'p-2 rounded-md transition-smooth',
            deviceMode === 'mobile' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          <Smartphone className="w-4 h-4" />
        </button>
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Undo/Redo */}
      <button
        onClick={undo}
        disabled={history.past.length === 0}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={history.future.length === 0}
        className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-smooth"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Show all blocks */}
      <button
        onClick={toggleShowAllBlocks}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-smooth',
          showAllBlocks ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground hover:bg-muted'
        )}
      >
        <Layers className="w-4 h-4" />
        All Blocks
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Preview & Publish */}
      <button
        onClick={togglePreviewMode}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-muted transition-smooth"
      >
        <Eye className="w-4 h-4" />
        Preview
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-smooth"
      >
        <Rocket className="w-4 h-4" />
        Publish
      </button>
    </div>
  );
};
