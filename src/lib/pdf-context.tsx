'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { PDFGroup, PDFPage, ViewMode } from './types';
import { initialGroups } from './mock-data';

interface PDFContextType {
  groups: PDFGroup[];
  currentGroupId: string;
  selectedPageId: string | null;
  viewMode: ViewMode;
  setCurrentGroupId: (id: string) => void;
  setSelectedPageId: (id: string | null) => void;
  setViewMode: (mode: ViewMode) => void;
  reorderPages: (groupId: string, oldIndex: number, newIndex: number) => void;
  movePageByDirection: (groupId: string, pageId: string, direction: 'up' | 'down') => void;
  movePageToGroup: (pageId: string, sourceGroupId: string, targetGroupId: string) => void;
  confirmChanges: () => void;
  getCurrentGroup: () => PDFGroup | undefined;
  getSelectedPage: () => PDFPage | undefined;
  getPageIndex: (groupId: string, pageId: string) => number;
}

const PDFContext = createContext<PDFContextType | undefined>(undefined);

export function PDFProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<PDFGroup[]>(initialGroups);
  const [currentGroupId, setCurrentGroupId] = useState<string>(initialGroups[0].id);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('preview');

  const getCurrentGroup = useCallback(() => {
    return groups.find((g) => g.id === currentGroupId);
  }, [groups, currentGroupId]);

  const getSelectedPage = useCallback(() => {
    const group = getCurrentGroup();
    if (!group || !selectedPageId) return undefined;
    return group.pages.find((p) => p.id === selectedPageId);
  }, [getCurrentGroup, selectedPageId]);

  const getPageIndex = useCallback((groupId: string, pageId: string) => {
    const group = groups.find((g) => g.id === groupId);
    if (!group) return -1;
    return group.pages.findIndex((p) => p.id === pageId);
  }, [groups]);

  const reorderPages = useCallback((groupId: string, oldIndex: number, newIndex: number) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;
        const newPages = [...group.pages];
        const [removed] = newPages.splice(oldIndex, 1);
        newPages.splice(newIndex, 0, removed);
        return { ...group, pages: newPages };
      })
    );
  }, []);

  const movePageByDirection = useCallback((groupId: string, pageId: string, direction: 'up' | 'down') => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id !== groupId) return group;
        const currentIndex = group.pages.findIndex((p) => p.id === pageId);
        if (currentIndex === -1) return group;

        const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
        if (newIndex < 0 || newIndex >= group.pages.length) return group;

        const newPages = [...group.pages];
        const [removed] = newPages.splice(currentIndex, 1);
        newPages.splice(newIndex, 0, removed);
        return { ...group, pages: newPages };
      })
    );
  }, []);

  const movePageToGroup = useCallback(
    (pageId: string, sourceGroupId: string, targetGroupId: string) => {
      if (sourceGroupId === targetGroupId) return;

      setGroups((prevGroups) => {
        let pageToMove: PDFPage | undefined;
        let isSourcePageNew = false;
        let isMovingBackToOrigin = false;

        // Find the source page first
        const sourceGroup = prevGroups.find((g) => g.id === sourceGroupId);
        const sourcePage = sourceGroup?.pages.find((p) => p.id === pageId);

        if (!sourcePage) return prevGroups;

        pageToMove = sourcePage;
        isSourcePageNew = sourcePage.diffStatus === 'new';

        // Check if moving back to original location
        const originalGroupId = sourcePage.originalGroupId || sourceGroupId;
        const originalId = sourcePage.originalId || sourcePage.id;

        if (isSourcePageNew && targetGroupId === originalGroupId) {
          // Check if there's a corresponding 'removed' page in target
          const targetGroup = prevGroups.find((g) => g.id === targetGroupId);
          const removedPage = targetGroup?.pages.find(
            (p) => p.id === originalId && p.diffStatus === 'removed'
          );
          if (removedPage) {
            isMovingBackToOrigin = true;
          }
        }

        if (isMovingBackToOrigin) {
          // Restore the original page and remove the 'new' page
          return prevGroups.map((group) => {
            if (group.id === sourceGroupId) {
              // Remove the 'new' page from source
              return {
                ...group,
                pages: group.pages.filter((p) => p.id !== pageId),
              };
            }
            if (group.id === targetGroupId) {
              // Restore the 'removed' page (clear diffStatus)
              return {
                ...group,
                pages: group.pages.map((p) => {
                  if (p.id === originalId && p.diffStatus === 'removed') {
                    const { diffStatus, ...rest } = p;
                    return rest as PDFPage;
                  }
                  return p;
                }),
              };
            }
            return group;
          });
        }

        // Normal move logic
        // First pass: handle source page
        const updatedGroups = prevGroups.map((group) => {
          if (group.id === sourceGroupId) {
            // If source page is 'new', remove it entirely (cancel the add)
            // Otherwise, mark as 'removed'
            if (isSourcePageNew) {
              return {
                ...group,
                pages: group.pages.filter((p) => p.id !== pageId),
              };
            } else {
              return {
                ...group,
                pages: group.pages.map((p) => {
                  if (p.id === pageId) {
                    return { ...p, diffStatus: 'removed' as const };
                  }
                  return p;
                }),
              };
            }
          }
          return group;
        });

        // Second pass: add page copy with 'new' status to target
        return updatedGroups.map((group) => {
          if (group.id === targetGroupId) {
            const newPage: PDFPage = {
              ...pageToMove!,
              id: `${pageToMove!.id}-moved-${Date.now()}`,
              diffStatus: 'new' as const,
              // Track original location for potential move-back
              originalId: pageToMove!.originalId || pageToMove!.id,
              originalGroupId: pageToMove!.originalGroupId || sourceGroupId,
            };
            return {
              ...group,
              pages: [...group.pages, newPage],
            };
          }
          return group;
        });
      });

      if (selectedPageId === pageId) {
        setSelectedPageId(null);
      }
    },
    [selectedPageId]
  );

  const confirmChanges = useCallback(() => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => ({
        ...group,
        pages: group.pages
          // Remove pages marked as 'removed'
          .filter((p) => p.diffStatus !== 'removed')
          // Clear diff-related fields from all remaining pages
          .map((p) => {
            if (p.diffStatus || p.originalId || p.originalGroupId) {
              const { diffStatus, originalId, originalGroupId, ...rest } = p;
              return rest as PDFPage;
            }
            return p;
          }),
      }))
    );
    setSelectedPageId(null);
  }, []);

  return (
    <PDFContext.Provider
      value={{
        groups,
        currentGroupId,
        selectedPageId,
        viewMode,
        setCurrentGroupId,
        setSelectedPageId,
        setViewMode,
        reorderPages,
        movePageByDirection,
        movePageToGroup,
        confirmChanges,
        getCurrentGroup,
        getSelectedPage,
        getPageIndex,
      }}
    >
      {children}
    </PDFContext.Provider>
  );
}

export function usePDF() {
  const context = useContext(PDFContext);
  if (context === undefined) {
    throw new Error('usePDF must be used within a PDFProvider');
  }
  return context;
}
