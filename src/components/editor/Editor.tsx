import React from 'react';
import { EditorToolbar } from './EditorToolbar';
import { EditorCanvas } from './EditorCanvas';
import { PagesSidebar } from './PagesSidebar';

export const Editor: React.FC = () => {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <EditorToolbar />
      <div className="flex-1 flex overflow-hidden">
        <PagesSidebar />
        <EditorCanvas />
      </div>
    </div>
  );
};
