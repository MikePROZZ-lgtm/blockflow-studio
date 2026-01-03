import React, { useEffect, useState } from 'react';
import { useEditorStore } from '@/hooks/useEditorStore';

interface ArrowConnectionsProps {
  canvasRef: React.RefObject<HTMLDivElement>;
  pageTabRefs: Map<string, HTMLElement>;
}

interface ConnectionLine {
  blockId: string;
  pageId: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export const ArrowConnections: React.FC<ArrowConnectionsProps> = ({
  canvasRef,
  pageTabRefs,
}) => {
  const { pages, activePageId, isPreviewMode } = useEditorStore();
  const [connections, setConnections] = useState<ConnectionLine[]>([]);

  const activePage = pages.find((p) => p.id === activePageId);
  const blocks = activePage?.blocks || [];

  useEffect(() => {
    const updateConnections = () => {
      if (!canvasRef.current || isPreviewMode) {
        setConnections([]);
        return;
      }

      const canvasRect = canvasRef.current.getBoundingClientRect();
      const newConnections: ConnectionLine[] = [];

      blocks.forEach((block) => {
        if (block.linkedPageId) {
          const pageTab = pageTabRefs.get(block.linkedPageId);
          if (pageTab) {
            const tabRect = pageTab.getBoundingClientRect();

            // Block center-top position
            const blockCenterX = block.x + block.width / 2;
            const blockTopY = block.y;

            // Tab bottom-center position relative to viewport
            const tabCenterX = tabRect.left + tabRect.width / 2 - canvasRect.left;
            const tabBottomY = tabRect.bottom - canvasRect.top;

            newConnections.push({
              blockId: block.id,
              pageId: block.linkedPageId,
              x1: blockCenterX,
              y1: blockTopY,
              x2: tabCenterX,
              y2: tabBottomY + 8,
            });
          }
        }
      });

      setConnections(newConnections);
    };

    updateConnections();

    // Update on scroll/resize
    const handleUpdate = () => requestAnimationFrame(updateConnections);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);

    // Update periodically for smooth experience during drag
    const interval = setInterval(updateConnections, 50);

    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      clearInterval(interval);
    };
  }, [blocks, canvasRef, pageTabRefs, isPreviewMode]);

  if (isPreviewMode || connections.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-50 overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            className="fill-arrow"
          />
        </marker>
        <linearGradient id="lineGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {connections.map((conn) => {
        // Create curved path
        const midY = (conn.y1 + conn.y2) / 2;
        const path = `M ${conn.x1} ${conn.y1} C ${conn.x1} ${midY}, ${conn.x2} ${midY}, ${conn.x2} ${conn.y2}`;

        return (
          <g key={`${conn.blockId}-${conn.pageId}`}>
            {/* Glow effect */}
            <path
              d={path}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="6"
              strokeOpacity="0.15"
              strokeLinecap="round"
            />
            {/* Main line */}
            <path
              d={path}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 4"
              markerEnd="url(#arrowhead)"
              className="animate-pulse"
            />
            {/* Start dot */}
            <circle
              cx={conn.x1}
              cy={conn.y1}
              r="4"
              className="fill-arrow"
            />
          </g>
        );
      })}
    </svg>
  );
};
