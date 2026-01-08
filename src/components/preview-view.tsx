'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { usePDF } from '@/lib/pdf-context';
import { PDFThumbnail, PDFThumbnailDragOverlay } from './pdf-thumbnail';
import { MoveToSelector } from './move-to-selector';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PDFPage } from '@/lib/types';
import { cn } from '@/lib/utils';

export function PreviewView() {
  const {
    getCurrentGroup,
    currentGroupId,
    selectedPageId,
    setSelectedPageId,
    reorderPages,
    movePageByDirection,
    getPageIndex,
    confirmChanges,
  } = usePDF();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<PDFPage | null>(null);

  const currentGroup = getCurrentGroup();
  const selectedPage = currentGroup?.pages.find((p) => p.id === selectedPageId);
  const selectedPageIndex = selectedPageId ? getPageIndex(currentGroupId, selectedPageId) : -1;
  const isFirst = selectedPageIndex === 0;
  const isLast = selectedPageIndex === (currentGroup?.pages.length ?? 0) - 1;
  const isPageRemoved = selectedPage?.diffStatus === 'removed';

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (currentGroup && currentGroup.pages.length > 0 && !selectedPageId) {
      setSelectedPageId(currentGroup.pages[0].id);
    }
  }, [currentGroup, selectedPageId, setSelectedPageId]);

  useEffect(() => {
    if (selectedPageId && currentGroup) {
      const pageExists = currentGroup.pages.some((p) => p.id === selectedPageId);
      if (!pageExists && currentGroup.pages.length > 0) {
        setSelectedPageId(currentGroup.pages[0].id);
      }
    }
  }, [currentGroup, selectedPageId, setSelectedPageId]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    const page = currentGroup?.pages.find((p) => p.id === active.id);
    setActivePage(page || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActivePage(null);

    if (!over || !currentGroup) return;

    if (active.id !== over.id) {
      const oldIndex = currentGroup.pages.findIndex((p) => p.id === active.id);
      const newIndex = currentGroup.pages.findIndex((p) => p.id === over.id);
      reorderPages(currentGroupId, oldIndex, newIndex);
    }
  };

  const handleMoveUp = () => {
    if (selectedPageId && !isFirst) {
      movePageByDirection(currentGroupId, selectedPageId, 'up');
    }
  };

  const handleMoveDown = () => {
    if (selectedPageId && !isLast) {
      movePageByDirection(currentGroupId, selectedPageId, 'down');
    }
  };

  if (!currentGroup) {
    return <div className="flex-1 flex items-center justify-center">Please select a document</div>;
  }

  return (
    <div className="flex h-full">
      {/* Left sidebar - thumbnails */}
      <div className="w-28 border-r bg-gray-50 flex flex-col">
        <div className="p-2 border-b bg-white">
          <h3 className="text-sm font-medium text-gray-600 text-center">Thumbnails</h3>
        </div>
        <ScrollArea className="flex-1">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={currentGroup.pages.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="p-3 space-y-2">
                {currentGroup.pages.map((page, index) => (
                  <PDFThumbnail
                    key={page.id}
                    page={page}
                    groupId={currentGroupId}
                    isSelected={selectedPageId === page.id}
                    onClick={() => setSelectedPageId(page.id)}
                    size="small"
                    displayIndex={index + 1}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay dropAnimation={{
              duration: 200,
              easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
              {activeId && activePage ? (
                <PDFThumbnailDragOverlay page={activePage} size="small" />
              ) : null}
            </DragOverlay>
          </DndContext>
        </ScrollArea>
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Toolbar */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-gray-200 bg-white">
          {/* Left side - Up/Down buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleMoveUp}
              disabled={!selectedPageId || isFirst || isPageRemoved}
              className={cn(
                'w-20 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg',
                'bg-white border border-gray-200',
                'text-sm font-medium',
                'transition-all duration-150',
                !selectedPageId || isFirst || isPageRemoved
                  ? 'opacity-40 cursor-not-allowed text-gray-400'
                  : 'hover:bg-[#0E4268]/5 hover:border-[#0E4268]/30 hover:text-[#0E4268] active:scale-[0.98] text-gray-600'
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="18 15 12 9 6 15" />
              </svg>
              <span>Up</span>
            </button>

            <button
              onClick={handleMoveDown}
              disabled={!selectedPageId || isLast || isPageRemoved}
              className={cn(
                'w-20 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg',
                'bg-white border border-gray-200',
                'text-sm font-medium',
                'transition-all duration-150',
                !selectedPageId || isLast || isPageRemoved
                  ? 'opacity-40 cursor-not-allowed text-gray-400'
                  : 'hover:bg-[#0E4268]/5 hover:border-[#0E4268]/30 hover:text-[#0E4268] active:scale-[0.98] text-gray-600'
              )}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              <span>Down</span>
            </button>
          </div>

          {/* Right side - Move to button */}
          <MoveToSelector disabled={!selectedPageId} />
        </div>

        {/* Preview area */}
        <div className="flex-1 flex items-center justify-center p-8">
          {selectedPage ? (
            <div
              className="w-[420px] h-[594px] rounded-lg shadow-2xl"
              style={{ backgroundColor: selectedPage.color }}
            />
          ) : (
            <div className="text-gray-400">Select a page to preview</div>
          )}
        </div>

        {/* Footer */}
        <div className="h-16 px-6 flex items-center justify-end gap-3 border-t border-gray-200 bg-white">
          <button
            className={cn(
              'px-6 py-2.5 rounded-lg',
              'bg-white border border-gray-300',
              'text-sm font-medium text-gray-700',
              'transition-all duration-150',
              'hover:bg-gray-50 hover:border-gray-400',
              'active:scale-[0.98]'
            )}
          >
            Cancel
          </button>
          <button
            onClick={confirmChanges}
            className={cn(
              'px-6 py-2.5 rounded-lg',
              'bg-[#0E4268] border border-[#0E4268]',
              'text-sm font-medium text-white',
              'transition-all duration-150',
              'hover:bg-[#0a3250]',
              'active:scale-[0.98]',
              'shadow-sm hover:shadow'
            )}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
