import { create } from 'zustand';
import { nanoid } from 'nanoid';
import type { Block, Page, EditorState } from '@/types/editor';

interface EditorStore extends EditorState {
  addPage: () => void;
  setActivePage: (pageId: string) => void;
  renamePage: (pageId: string, name: string) => void;
  deletePage: (pageId: string) => void;
  addBlock: () => void;
  updateBlock: (blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (blockId: string) => void;
  selectBlock: (blockId: string | null) => void;
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  toggleShowAllBlocks: () => void;
  togglePreviewMode: () => void;
  undo: () => void;
  redo: () => void;
  bringToFront: (blockId: string) => void;
  linkBlockToPage: (blockId: string, pageId: string | undefined) => void;
  saveToHistory: () => void;
}

const createDefaultPage = (name: string): Page => ({
  id: nanoid(),
  name,
  blocks: [],
});

const initialState: EditorState = {
  pages: [createDefaultPage('Страница 1')],
  activePageId: '',
  selectedBlockId: null,
  deviceMode: 'desktop',
  showAllBlocks: false,
  isPreviewMode: false,
  history: {
    past: [],
    future: [],
  },
};

initialState.activePageId = initialState.pages[0].id;

export const useEditorStore = create<EditorStore>((set, get) => ({
  ...initialState,

  saveToHistory: () => {
    const { pages, history } = get();
    set({
      history: {
        past: [...history.past.slice(-49), JSON.parse(JSON.stringify(pages))],
        future: [],
      },
    });
  },

  addPage: () => {
    const { pages } = get();
    get().saveToHistory();
    const newPage = createDefaultPage(`Страница ${pages.length + 1}`);
    set({
      pages: [...pages, newPage],
      activePageId: newPage.id,
    });
  },

  setActivePage: (pageId: string) => {
    set({ activePageId: pageId, selectedBlockId: null });
  },

  renamePage: (pageId: string, name: string) => {
    const { pages } = get();
    get().saveToHistory();
    set({
      pages: pages.map((p) => (p.id === pageId ? { ...p, name } : p)),
    });
  },

  deletePage: (pageId: string) => {
    const { pages, activePageId } = get();
    if (pages.length <= 1) return;
    get().saveToHistory();
    const newPages = pages.filter((p) => p.id !== pageId);
    set({
      pages: newPages,
      activePageId: activePageId === pageId ? newPages[0].id : activePageId,
    });
  },

  addBlock: () => {
    const { pages, activePageId } = get();
    get().saveToHistory();
    const activePage = pages.find((p) => p.id === activePageId);
    if (!activePage) return;

    const maxZ = activePage.blocks.reduce((max, b) => Math.max(max, b.zIndex), 0);
    const newBlock: Block = {
      id: nanoid(),
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 100,
      width: 200,
      height: 100,
      text: '',
      fontSize: 16,
      fontFamily: 'Inter',
      textColor: '#1a1a2e',
      backgroundColor: '#ffffff',
      backgroundOpacity: 100,
      zIndex: maxZ + 1,
    };

    set({
      pages: pages.map((p) =>
        p.id === activePageId ? { ...p, blocks: [...p.blocks, newBlock] } : p
      ),
      selectedBlockId: newBlock.id,
    });
  },

  updateBlock: (blockId: string, updates: Partial<Block>) => {
    const { pages, activePageId } = get();
    set({
      pages: pages.map((p) =>
        p.id === activePageId
          ? {
              ...p,
              blocks: p.blocks.map((b) =>
                b.id === blockId ? { ...b, ...updates } : b
              ),
            }
          : p
      ),
    });
  },

  deleteBlock: (blockId: string) => {
    const { pages, activePageId, selectedBlockId } = get();
    get().saveToHistory();
    set({
      pages: pages.map((p) =>
        p.id === activePageId
          ? { ...p, blocks: p.blocks.filter((b) => b.id !== blockId) }
          : p
      ),
      selectedBlockId: selectedBlockId === blockId ? null : selectedBlockId,
    });
  },

  selectBlock: (blockId: string | null) => {
    set({ selectedBlockId: blockId });
  },

  setDeviceMode: (mode: 'desktop' | 'mobile') => {
    set({ deviceMode: mode });
  },

  toggleShowAllBlocks: () => {
    set((state) => ({ showAllBlocks: !state.showAllBlocks }));
  },

  togglePreviewMode: () => {
    set((state) => ({ isPreviewMode: !state.isPreviewMode, selectedBlockId: null }));
  },

  undo: () => {
    const { history, pages } = get();
    if (history.past.length === 0) return;
    const previous = history.past[history.past.length - 1];
    set({
      pages: previous,
      history: {
        past: history.past.slice(0, -1),
        future: [JSON.parse(JSON.stringify(pages)), ...history.future],
      },
    });
  },

  redo: () => {
    const { history, pages } = get();
    if (history.future.length === 0) return;
    const next = history.future[0];
    set({
      pages: next,
      history: {
        past: [...history.past, JSON.parse(JSON.stringify(pages))],
        future: history.future.slice(1),
      },
    });
  },

  bringToFront: (blockId: string) => {
    const { pages, activePageId } = get();
    const activePage = pages.find((p) => p.id === activePageId);
    if (!activePage) return;

    const maxZ = activePage.blocks.reduce((max, b) => Math.max(max, b.zIndex), 0);
    get().updateBlock(blockId, { zIndex: maxZ + 1 });
  },

  linkBlockToPage: (blockId: string, pageId: string | undefined) => {
    get().saveToHistory();
    get().updateBlock(blockId, { linkedPageId: pageId });
  },
}));
