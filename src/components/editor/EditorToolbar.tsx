import React from 'react';
import { Plus, Monitor, Smartphone, Undo2, Redo2, Layers, Eye, Rocket, X } from 'lucide-react';
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
    addPage,
    setActivePage,
    deletePage,
    setDeviceMode,
    toggleShowAllBlocks,
    togglePreviewMode,
    undo,
    redo,
  } = useEditorStore();

  if (isPreviewMode) {
    return (
      <div className="h-14 bg-card border-b border-toolbar-border flex items-center justify-between px-4 animate-fade-in">
        <span className="font-mono text-sm text-muted-foreground">Режим предпросмотра</span>
        <button
          onClick={togglePreviewMode}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-smooth"
        >
          <X className="w-4 h-4" />
          Выйти
        </button>
      </div>
    );
  }

  return (
    <div className="h-14 bg-card border-b border-toolbar-border flex items-center gap-2 px-4 animate-fade-in">
      {/* Page tabs */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              'group relative flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm cursor-pointer transition-smooth',
              activePageId === page.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
            onClick={() => setActivePage(page.id)}
          >
            {page.name}
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                className={cn(
                  'opacity-0 group-hover:opacity-100 transition-opacity',
                  activePageId === page.id ? 'hover:text-primary-foreground/70' : 'hover:text-destructive'
                )}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
        <button
          onClick={addPage}
          className="p-1.5 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth"
        >
          <Plus className="w-4 h-4" />
        </button>
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
        Все блоки
      </button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Preview & Publish */}
      <button
        onClick={togglePreviewMode}
        className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium text-sm hover:bg-muted transition-smooth"
      >
        <Eye className="w-4 h-4" />
        Предпросмотр
      </button>
      <button
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:opacity-90 transition-smooth"
      >
        <Rocket className="w-4 h-4" />
        Опубликовать
      </button>
    </div>
  );
};
