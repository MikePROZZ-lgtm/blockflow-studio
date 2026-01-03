import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { BlockStylePanel } from './BlockStylePanel';
import { useEditorStore } from '@/hooks/useEditorStore';

export const Editor: React.FC = () => {
  const { isPreviewMode } = useEditorStore();

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        <EditorCanvas />
        {!isPreviewMode && <BlockStylePanel />}
      </div>
    </div>
  );
};
