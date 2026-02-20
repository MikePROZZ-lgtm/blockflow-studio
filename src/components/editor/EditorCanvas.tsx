import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { EditorBlock } from './EditorBlock';
import { BlockContextMenu } from './BlockContextMenu';
import { cn } from '@/lib/utils';

export const EditorCanvas: React.FC = () => {
  const {
    pages,
    activePageId,
    selectedBlockId,
    deviceMode,
    showAllBlocks,
    isPreviewMode,
    addBlock,
    selectBlock,
    bringToFront,
  } = useEditorStore();

  const [svgContextMenu, setSvgContextMenu] = useState<{ blockId: string; x: number; y: number } | null>(null);

  const activePage = pages.find((p) => p.id === activePageId);
  const blocks = activePage?.blocks || [];

  // Find the last (topmost) block
  const lastBlock = blocks.length > 0 
    ? blocks.reduce((max, b) => b.zIndex > max.zIndex ? b : max, blocks[0])
    : null;

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      selectBlock(null);
    }
  };

  return (
    <div
      className={cn(
        'flex-1 overflow-auto flex justify-center p-8',
        isPreviewMode ? 'bg-background' : 'bg-canvas'
      )}
      onClick={handleCanvasClick}
    >
      <div
        className={cn(
          'relative bg-card shadow-xl rounded-lg transition-all duration-300',
          !isPreviewMode && 'canvas-grid',
          deviceMode === 'desktop' ? 'w-[1200px] min-h-[800px]' : 'w-[375px] min-h-[667px]'
        )}
        style={{ minHeight: '100%' }}
      >
        {blocks.map((block) => {
          const isFaded = !showAllBlocks && !isPreviewMode && lastBlock && block.id !== lastBlock.id && block.id !== selectedBlockId;
          
          return (
            <EditorBlock
              key={block.id}
              block={block}
              isSelected={block.id === selectedBlockId}
              isFaded={!!isFaded}
              isPreview={isPreviewMode}
              showOutline={showAllBlocks && !isPreviewMode}
            />
          );
        })}

        {/* Outline overlay for selecting covered blocks */}
        {showAllBlocks && !isPreviewMode && (
          <svg
            className="absolute inset-0 z-[9998]"
            width="100%"
            height="100%"
          >
             {blocks.map((b) => (
              <rect
                key={b.id}
                x={b.x}
                y={b.y}
                width={b.width}
                height={b.height}
                fill="transparent"
                className="stroke-primary cursor-pointer"
                strokeWidth={b.id === selectedBlockId ? 3 : 2}
                strokeOpacity={b.id === selectedBlockId ? 1 : 0.55}
                strokeDasharray="6 4"
                vectorEffect="non-scaling-stroke"
                pointerEvents="all"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectBlock(b.id);
                  bringToFront(b.id);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  selectBlock(b.id);
                  bringToFront(b.id);
                  setSvgContextMenu({ blockId: b.id, x: e.clientX, y: e.clientY });
                }}
              />
            ))}
          </svg>
        )}

        {/* Context menu triggered from SVG overlay */}
        {svgContextMenu && !isPreviewMode && (
          <BlockContextMenu
            blockId={svgContextMenu.blockId}
            x={svgContextMenu.x}
            y={svgContextMenu.y}
            onClose={() => setSvgContextMenu(null)}
          />
        )}

        {/* Add block button */}
        {!isPreviewMode && blocks.length === 0 && (
          <button
            onClick={addBlock}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-3 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
              <Plus className="w-7 h-7 text-primary" />
            </div>
            <span className="font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Add Block
            </span>
          </button>
        )}

      </div>

      {/* Floating add button - always above blocks */}
      {!isPreviewMode && blocks.length > 0 && (
        <button
          onClick={addBlock}
          className="fixed bottom-8 right-8 z-[9999] flex items-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 transition-transform font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Block
        </button>
      )}
    </div>
  );
};
