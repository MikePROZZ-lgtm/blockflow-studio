import React, { useRef, useState, useEffect, useCallback } from 'react';
import { X, Link2 } from 'lucide-react';
import { useEditorStore } from '@/hooks/useEditorStore';
import { BlockContextMenu } from './BlockContextMenu';
import type { Block } from '@/types/editor';
import { cn } from '@/lib/utils';

// Convert hex to rgb values
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '255, 255, 255';
};

interface EditorBlockProps {
  block: Block;
  isSelected: boolean;
  isFaded: boolean;
  isPreview: boolean;
  showOutline?: boolean;
}

export const EditorBlock: React.FC<EditorBlockProps> = ({
  block,
  isSelected,
  isFaded,
  isPreview,
  showOutline,
}) => {
  const {
    pages,
    activePageId,
    updateBlock,
    deleteBlock,
    selectBlock,
    bringToFront,
    linkBlockToPage,
    setActivePage,
    saveToHistory,
  } = useEditorStore();

  const blockRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [resizeDir, setResizeDir] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showLinkMenu, setShowLinkMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const linkedPage = pages.find((p) => p.id === block.linkedPageId);

  // Handle block click in preview mode
  const handlePreviewClick = () => {
    if (isPreview && block.linkedPageId) {
      setActivePage(block.linkedPageId);
    }
  };

  // Right-click → context menu
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    selectBlock(block.id);
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    if (e.button === 2) return; // ignore right click
    if ((e.target as HTMLElement).closest('.resize-handle') || 
        (e.target as HTMLElement).closest('.block-controls') ||
        (e.target as HTMLElement).closest('.text-content')) return;
    
    e.preventDefault();
    selectBlock(block.id);
    bringToFront(block.id);
    setIsDragging(true);
    setDragStart({ x: e.clientX - block.x, y: e.clientY - block.y });
  };

  // Text drag handling
  const handleTextMouseDown = (e: React.MouseEvent) => {
    if (isPreview) return;
    if (e.button !== 0) return;
    if (document.activeElement === textRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    selectBlock(block.id);
    setIsDraggingText(true);
    setDragStart({ 
      x: e.clientX - (block.textX || 0), 
      y: e.clientY - (block.textY || 0) 
    });
    saveToHistory();
  };

  // Resize handling
  const handleResizeStart = (e: React.MouseEvent, direction: string) => {
    if (isPreview) return;
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDir(direction);
    setDragStart({ x: e.clientX, y: e.clientY });
    saveToHistory();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateBlock(block.id, {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (isDraggingText) {
      updateBlock(block.id, {
        textX: e.clientX - dragStart.x,
        textY: e.clientY - dragStart.y,
      });
    } else if (isResizing && resizeDir) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      
      let updates: Partial<Block> = {};
      
      if (resizeDir.includes('e')) updates.width = Math.max(50, block.width + dx);
      if (resizeDir.includes('w')) { updates.width = Math.max(50, block.width - dx); updates.x = block.x + dx; }
      if (resizeDir.includes('s')) updates.height = Math.max(30, block.height + dy);
      if (resizeDir.includes('n')) { updates.height = Math.max(30, block.height - dy); updates.y = block.y + dy; }
      
      updateBlock(block.id, updates);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  }, [isDragging, isDraggingText, isResizing, resizeDir, dragStart, block, updateBlock]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) saveToHistory();
    setIsDragging(false);
    setIsResizing(false);
    setIsDraggingText(false);
    setResizeDir(null);
  }, [isDragging, saveToHistory]);

  useEffect(() => {
    if (isDragging || isResizing || isDraggingText) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, isDraggingText, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (isSelected && textRef.current && !isPreview) {
      textRef.current.focus();
    }
  }, [isSelected, isPreview]);

  const handleTextChange = () => {
    if (textRef.current) {
      updateBlock(block.id, { text: textRef.current.innerText });
    }
  };

  const handleLinkPointClick = (e: React.MouseEvent, side: 'top' | 'right' | 'bottom' | 'left') => {
    e.stopPropagation();
    setShowLinkMenu(true);
  };

  const handleLinkToPage = (pageId: string | undefined) => {
    linkBlockToPage(block.id, pageId);
    setShowLinkMenu(false);
  };

  const bgColor = block.backgroundColor;
  const bgOpacity = block.backgroundOpacity / 100;

  return (
    <>
      <div
        ref={blockRef}
        className={cn(
          'absolute group transition-shadow duration-200',
          isSelected && !isPreview && 'ring-2 ring-primary ring-offset-2',
          isFaded && !showOutline && 'opacity-30',
          showOutline && !isSelected && 'ring-2 ring-primary/60 ring-dashed',
          isPreview && block.linkedPageId && 'cursor-pointer hover:scale-[1.02] hover:shadow-block-active',
          isDragging && 'cursor-grabbing',
          !isDragging && !isPreview && 'cursor-grab'
        )}
        style={{
          left: block.x,
          top: block.y,
          width: block.width,
          height: block.height,
          zIndex: block.zIndex,
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onClick={handlePreviewClick}
      >
        {/* Background */}
        <div
          className="absolute inset-0 rounded-lg overflow-hidden"
          style={{
            backgroundColor: block.backgroundImage ? 'transparent' : `rgba(${hexToRgb(bgColor)}, ${bgOpacity})`,
          }}
        >
          {block.backgroundImage && (
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${block.backgroundImage})`,
                backgroundSize: block.backgroundSize || 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                opacity: bgOpacity,
              }}
            />
          )}
        </div>

        {/* Content image */}
        {block.contentImage && (
          <div className="absolute inset-0 flex items-center justify-center p-2 pointer-events-none">
            <img src={block.contentImage} alt="" className="max-w-full max-h-full object-contain" />
          </div>
        )}

        {/* Text Content - draggable */}
        <div
          ref={textRef}
          contentEditable={!isPreview}
          suppressContentEditableWarning
          onBlur={handleTextChange}
          onMouseDown={handleTextMouseDown}
          className={cn(
            "text-content absolute p-3 outline-none overflow-hidden rounded-lg",
            !isPreview && "cursor-move hover:bg-primary/5",
            isDraggingText && "cursor-grabbing"
          )}
          style={{
            fontFamily: block.fontFamily,
            fontSize: block.fontSize,
            color: block.textColor,
            left: block.textX || 0,
            top: block.textY || 0,
            minWidth: 50,
            minHeight: 20,
            zIndex: 10,
          }}
        >
          {block.text}
        </div>

        {/* Link indicator */}
        {linkedPage && !isPreview && (
          <div className="absolute -top-6 left-0 flex items-center gap-1 px-2 py-0.5 bg-primary text-primary-foreground rounded text-xs font-mono z-20">
            <Link2 className="w-3 h-3" />
            {linkedPage.name}
          </div>
        )}

        {!isPreview && (
          <>
            {/* Delete button */}
            <button
              className="block-controls absolute -top-3 -right-3 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:scale-110 z-30"
              onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}
            >
              <X className="w-3 h-3" />
            </button>

            {/* Resize handles */}
            <div className="resize-handle absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={(e) => handleResizeStart(e, 'nw')} />
            <div className="resize-handle absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={(e) => handleResizeStart(e, 'ne')} />
            <div className="resize-handle absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={(e) => handleResizeStart(e, 'sw')} />
            <div className="resize-handle absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={(e) => handleResizeStart(e, 'se')} />
            <div className="resize-handle absolute top-0 left-1/2 -translate-x-1/2 w-6 h-2 cursor-n-resize" onMouseDown={(e) => handleResizeStart(e, 'n')} />
            <div className="resize-handle absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-2 cursor-s-resize" onMouseDown={(e) => handleResizeStart(e, 's')} />
            <div className="resize-handle absolute left-0 top-1/2 -translate-y-1/2 w-2 h-6 cursor-w-resize" onMouseDown={(e) => handleResizeStart(e, 'w')} />
            <div className="resize-handle absolute right-0 top-1/2 -translate-y-1/2 w-2 h-6 cursor-e-resize" onMouseDown={(e) => handleResizeStart(e, 'e')} />

            {/* Link points */}
            {isSelected && (
              <>
                {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
                  <button
                    key={side}
                    className={cn(
                      'absolute w-5 h-5 bg-arrow rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-125 hover:bg-arrow-hover transition-all shadow-md z-30',
                      side === 'top' && 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
                      side === 'bottom' && 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
                      side === 'left' && 'left-0 top-1/2 -translate-x-1/2 -translate-y-1/2',
                      side === 'right' && 'right-0 top-1/2 translate-x-1/2 -translate-y-1/2'
                    )}
                    onClick={(e) => handleLinkPointClick(e, side)}
                  >
                    <Link2 className="w-3 h-3 text-white" />
                  </button>
                ))}
              </>
            )}

            {/* Link menu */}
            {showLinkMenu && (
              <div className="absolute top-full left-0 mt-2 bg-card rounded-lg shadow-lg border border-border p-2 z-50 min-w-48 animate-scale-in">
                <div className="text-xs font-mono text-muted-foreground mb-2 px-2">Link to:</div>
                {pages
                  .filter((p) => p.id !== activePageId)
                  .map((page) => (
                    <button
                      key={page.id}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-sm transition-colors"
                      onClick={() => handleLinkToPage(page.id)}
                    >
                      {page.name}
                    </button>
                  ))}
                {block.linkedPageId && (
                  <button
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-destructive/10 text-destructive text-sm transition-colors"
                    onClick={() => handleLinkToPage(undefined)}
                  >
                    Remove link
                  </button>
                )}
                <button
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-secondary text-muted-foreground text-sm transition-colors"
                  onClick={() => setShowLinkMenu(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Context menu portal */}
      {contextMenu && !isPreview && (
        <BlockContextMenu
          blockId={block.id}
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
        />
      )}
    </>
  );
};
