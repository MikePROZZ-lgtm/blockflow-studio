import React from 'react';
import { Plus, X, FileText } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { cn } from '@/lib/utils';

export const PagesSidebar: React.FC = () => {
  const {
    pages,
    activePageId,
    isPreviewMode,
    addPage,
    setActivePage,
    deletePage,
  } = useEditorStore();

  if (isPreviewMode) return null;

  return (
    <div className="w-48 bg-card border-r border-toolbar-border flex flex-col">
      <div className="p-3 border-b border-border">
        <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
          Pages
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {pages.map((page) => (
          <div
            key={page.id}
            className={cn(
              'group relative flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-smooth text-sm',
              activePageId === page.id
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted text-foreground'
            )}
            onClick={() => setActivePage(page.id)}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span className="truncate flex-1">{page.name}</span>
            {pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deletePage(page.id);
                }}
                className={cn(
                  'opacity-0 group-hover:opacity-100 transition-opacity shrink-0',
                  activePageId === page.id
                    ? 'hover:text-primary-foreground/70'
                    : 'hover:text-destructive'
                )}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border">
        <button
          onClick={addPage}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-muted text-muted-foreground hover:text-foreground transition-smooth text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Page
        </button>
      </div>
    </div>
  );
};
