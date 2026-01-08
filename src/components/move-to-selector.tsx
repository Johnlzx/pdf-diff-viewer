'use client';

import { useState } from 'react';
import { usePDF } from '@/lib/pdf-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MoveToSelectorProps {
  disabled?: boolean;
}

export function MoveToSelector({ disabled = false }: MoveToSelectorProps) {
  const [open, setOpen] = useState(false);
  const { groups, currentGroupId, selectedPageId, movePageToGroup, getPageIndex } = usePDF();

  const otherGroups = groups.filter((g) => g.id !== currentGroupId);
  const currentGroup = groups.find((g) => g.id === currentGroupId);
  const selectedPage = currentGroup?.pages.find((p) => p.id === selectedPageId);
  const selectedPageIndex = selectedPageId ? getPageIndex(currentGroupId, selectedPageId) : -1;
  const isPageRemoved = selectedPage?.diffStatus === 'removed';

  const handleMove = (targetGroupId: string) => {
    if (selectedPageId && !isPageRemoved) {
      movePageToGroup(selectedPageId, currentGroupId, targetGroupId);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          disabled={disabled || isPageRemoved}
          className={cn(
            'group flex items-center gap-2 px-4 py-2 rounded-lg',
            'bg-white',
            'border border-gray-200',
            'transition-all duration-200 ease-out',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            !disabled && !isPageRemoved && 'hover:bg-[#0E4268]/5 hover:border-[#0E4268]/30',
            'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30 focus:border-[#0E4268]/50'
          )}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'text-gray-500 transition-all duration-200',
              !disabled && !isPageRemoved && 'group-hover:text-[#0E4268] group-hover:translate-x-0.5'
            )}
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>

          <span className={cn(
            'text-sm font-medium text-gray-600 transition-colors',
            !disabled && !isPageRemoved && 'group-hover:text-[#0E4268]'
          )}>
            Move to
          </span>

          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn(
              'text-gray-400 transition-transform duration-200',
              open && 'rotate-180'
            )}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={6}
        className={cn(
          'w-72 p-0 overflow-hidden',
          'bg-white',
          'border border-gray-200',
          'rounded-xl',
          'shadow-xl shadow-gray-200/50',
          'animate-in fade-in-0 zoom-in-95 duration-150'
        )}
      >
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            {selectedPage && (
              <div
                className="w-7 h-10 rounded-md shadow-sm"
                style={{ backgroundColor: selectedPage.color }}
              />
            )}
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Select destination
              </p>
              <p className="text-sm text-gray-700 mt-0.5">
                {selectedPage ? `Page ${selectedPageIndex + 1}` : 'No page selected'}
              </p>
            </div>
          </div>
        </div>

        {/* Document Options */}
        <div className="p-1.5 space-y-0.5">
          {otherGroups.length === 0 ? (
            <div className="px-3 py-4 text-center">
              <p className="text-sm text-gray-400">No other documents available</p>
            </div>
          ) : (
            otherGroups.map((group, index) => (
              <button
                key={group.id}
                onClick={() => handleMove(group.id)}
                style={{
                  animationDelay: `${index * 40}ms`,
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                  'bg-white hover:bg-[#0E4268]/5',
                  'border border-transparent hover:border-[#0E4268]/20',
                  'transition-all duration-150',
                  'animate-in slide-in-from-left-1 fade-in-0',
                  'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30'
                )}
              >
                {/* Document Icon */}
                <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-gray-500"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <line x1="9" y1="13" x2="15" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="9" y1="17" x2="13" y2="17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Document info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {group.name}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {group.pages.length} {group.pages.length === 1 ? 'page' : 'pages'}
                  </p>
                </div>

                {/* Arrow */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-300"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))
          )}
        </div>

        {/* Footer hint */}
        <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">
            Page will be added to the end of the document
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
