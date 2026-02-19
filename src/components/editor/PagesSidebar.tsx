import React, { useState, useRef, useEffect } from 'react';
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
    renamePage,
  } = useEditorStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  const startRename = (e: React.MouseEvent, pageId: string, currentName: string) => {
    e.stopPropagation();
    setEditingId(pageId);
    setEditingName(currentName);
  };

  const commitRename = () => {
    if (editingId && editingName.trim()) {
      renamePage(editingId, editingName.trim());
    }
    setEditingId(null);
    setEditingName('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commitRename();
    if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
  };

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
            onDoubleClick={(e) => startRename(e, page.id, page.name)}
          >
            <FileText className="w-4 h-4 shrink-0" />

            {editingId === page.id ? (
              <input
                ref={inputRef}
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={commitRename}
                onKeyDown={handleKeyDown}
                onClick={(e) => e.stopPropagation()}
                className={cn(
                  'flex-1 bg-transparent outline-none border-b text-sm min-w-0',
                  activePageId === page.id
                    ? 'border-primary-foreground text-primary-foreground'
                    : 'border-primary text-foreground'
                )}
              />
            ) : (
              <span className="truncate flex-1">{page.name}</span>
            )}

            {pages.length > 1 && editingId !== page.id && (
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
