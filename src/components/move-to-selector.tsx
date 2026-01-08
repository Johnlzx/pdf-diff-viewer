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
  const { groups, currentGroupId, selectedPageId, movePageToGroup, getCurrentGroup } = usePDF();

  const otherGroups = groups.filter((g) => g.id !== currentGroupId);
  const currentGroup = getCurrentGroup();
  const selectedPage = currentGroup?.pages.find((p) => p.id === selectedPageId);
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
          'w-auto min-w-[200px] p-1.5',
          'bg-white',
          'border border-gray-200',
          'rounded-xl',
          'shadow-xl shadow-gray-200/50',
          'animate-in fade-in-0 zoom-in-95 duration-150'
        )}
      >
        {otherGroups.length === 0 ? (
          <div className="px-3 py-4 text-center">
            <p className="text-sm text-gray-400">No other documents available</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            {otherGroups.map((group, index) => (
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
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <svg
                    width="16"
                    height="16"
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
                  </svg>
                </div>

                {/* Document info */}
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    {group.name}
                  </p>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {group.pages.length} {group.pages.length === 1 ? 'page' : 'pages'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
