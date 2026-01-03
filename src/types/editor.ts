export interface Block {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  textColor: string;
  backgroundColor: string;
  backgroundOpacity: number;
  backgroundImage?: string;
  zIndex: number;
  linkedPageId?: string;
}

export interface Page {
  id: string;
  name: string;
  blocks: Block[];
}

export interface EditorState {
  pages: Page[];
  activePageId: string;
  selectedBlockId: string | null;
  deviceMode: 'desktop' | 'mobile';
  showAllBlocks: boolean;
  isPreviewMode: boolean;
  history: {
    past: Page[][];
    future: Page[][];
  };
}

export interface Arrow {
  fromBlockId: string;
  toPageId: string;
  fromSide: 'top' | 'right' | 'bottom' | 'left';
}
