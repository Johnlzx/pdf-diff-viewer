'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PDFPage, PageDiffStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface PDFThumbnailProps {
  page: PDFPage;
  groupId: string;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
  displayIndex?: number;
  diffStatus?: PageDiffStatus;
}

export function PDFThumbnail({
  page,
  isSelected = false,
  onClick,
  size = 'medium',
  displayIndex,
  diffStatus,
}: PDFThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: page.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || 'transform 150ms cubic-bezier(0.25, 1, 0.5, 1)',
  };

  const sizeClasses = {
    small: 'w-16 h-[90px]',
    medium: 'w-24 h-[136px]',
    large: 'w-40 h-[226px]',
  };

  const displayNumber = displayIndex !== undefined ? displayIndex : page.pageNumber;

  const effectiveDiffStatus = diffStatus || page.diffStatus;
  const isRemoved = effectiveDiffStatus === 'removed';
  const isNew = effectiveDiffStatus === 'new';

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        'relative rounded-lg overflow-hidden cursor-pointer',
        'transition-all duration-150 ease-out',
        'border-2',
        sizeClasses[size],
        // Diff status styles
        isRemoved && 'border-red-400 opacity-70',
        isNew && 'border-green-400 ring-2 ring-green-200',
        // Normal styles (when no diff status)
        !isRemoved && !isNew && 'hover:border-[#0E4268] hover:shadow-md',
        !isRemoved && !isNew && (isSelected ? 'border-[#0E4268] ring-2 ring-[#0E4268]/30 shadow-lg' : 'border-gray-200'),
        isDragging && 'opacity-60 scale-105 shadow-2xl ring-2 ring-[#0E4268] z-50'
      )}
    >
      {/* Diff status badge */}
      {effectiveDiffStatus && effectiveDiffStatus !== 'normal' && (
        <div className={cn(
          'absolute top-1 left-1/2 -translate-x-1/2 z-10',
          'px-1.5 py-0.5 rounded-full',
          'text-[9px] font-semibold uppercase tracking-wide',
          'shadow-sm',
          isRemoved ? 'bg-red-500 text-white' : 'bg-green-500 text-white',
          size === 'large' && 'text-[10px] px-2 py-0.5'
        )}>
          {isRemoved ? 'Removed' : 'New'}
        </div>
      )}

      {/* Page content - no text */}
      <div
        className="w-full h-full"
        style={{ backgroundColor: page.color }}
      />

      {/* Removed overlay effect */}
      {isRemoved && (
        <div className="absolute inset-0 bg-red-500/10 pointer-events-none" />
      )}

      {/* Position badge */}
      <div className={cn(
        'absolute bottom-1 left-1/2 -translate-x-1/2 bg-black/60 text-white rounded px-1.5',
        size === 'small' ? 'text-[10px]' : 'text-xs'
      )}>
        {displayNumber}
      </div>
    </div>
  );
}

export function PDFThumbnailDragOverlay({ page, size = 'small' }: { page: PDFPage; size?: 'small' | 'medium' | 'large' }) {
  const sizeClasses = {
    small: 'w-16 h-[90px]',
    medium: 'w-24 h-[136px]',
    large: 'w-40 h-[226px]',
  };

  return (
    <div
      className={cn(
        'relative rounded-lg overflow-hidden',
        'border-2 border-[#0E4268]',
        'shadow-2xl shadow-[#0E4268]/25',
        'ring-4 ring-[#0E4268]/30',
        'rotate-3 scale-105',
        sizeClasses[size]
      )}
    >
      <div
        className="w-full h-full"
        style={{ backgroundColor: page.color }}
      />
    </div>
  );
}
