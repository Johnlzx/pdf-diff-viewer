'use client';

import { useState } from 'react';
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
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { usePDF } from '@/lib/pdf-context';
import { PDFThumbnail, PDFThumbnailDragOverlay } from './pdf-thumbnail';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PDFPage } from '@/lib/types';

export function EditView() {
  const {
    getCurrentGroup,
    currentGroupId,
    selectedPageId,
    setSelectedPageId,
    reorderPages,
  } = usePDF();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activePage, setActivePage] = useState<PDFPage | null>(null);

  const currentGroup = getCurrentGroup();

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

  if (!currentGroup) {
    return <div className="flex-1 flex items-center justify-center">Please select a document</div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            {currentGroup.name} — Edit Mode
          </h2>
          <p className="text-sm text-gray-500">
            {currentGroup.pages.length} pages · Drag to reorder
          </p>
        </div>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={currentGroup.pages.map((p) => p.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {currentGroup.pages.map((page, index) => (
                <PDFThumbnail
                  key={page.id}
                  page={page}
                  groupId={currentGroupId}
                  isSelected={selectedPageId === page.id}
                  onClick={() => setSelectedPageId(page.id)}
                  size="large"
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
              <PDFThumbnailDragOverlay page={activePage} size="large" />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </ScrollArea>
  );
}
