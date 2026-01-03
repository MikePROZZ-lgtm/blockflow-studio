import React, { useState, useCallback } from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { BlockStylePanel } from './BlockStylePanel';
import { useEditorStore } from '@/hooks/useEditorStore';

export const Editor: React.FC = () => {
  const { isPreviewMode } = useEditorStore();
  const [pageTabRefs, setPageTabRefs] = useState<Map<string, HTMLElement>>(new Map());

  const handlePageTabsUpdate = useCallback((refs: Map<string, HTMLElement>) => {
    setPageTabRefs(refs);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar onPageTabsUpdate={handlePageTabsUpdate} />
      <div className="flex-1 flex overflow-hidden">
        <EditorCanvas pageTabRefs={pageTabRefs} />
        {!isPreviewMode && <BlockStylePanel />}
      </div>
    </div>
  );
};
