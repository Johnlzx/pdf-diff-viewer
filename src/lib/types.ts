export type PageDiffStatus = 'normal' | 'removed' | 'new';

export interface PDFPage {
  id: string;
  pageNumber: number;
  thumbnail: string;
  color: string;
  diffStatus?: PageDiffStatus;
  originalId?: string;      // Original page ID before move
  originalGroupId?: string; // Original document ID before move
}

export type DocumentStatus = 'ready' | 'pending review';

export interface PDFGroup {
  id: string;
  name: string;
  pages: PDFPage[];
  status: DocumentStatus;
}

export type ViewMode = 'preview' | 'edit';
