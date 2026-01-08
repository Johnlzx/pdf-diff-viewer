'use client';

import { useState } from 'react';
import { usePDF } from '@/lib/pdf-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export function DocumentSwitcher() {
  const [open, setOpen] = useState(false);
  const { groups, currentGroupId, setCurrentGroupId, setSelectedPageId } = usePDF();

  const currentGroup = groups.find((g) => g.id === currentGroupId);

  const handleSwitch = (groupId: string) => {
    setCurrentGroupId(groupId);
    setSelectedPageId(null);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            'group flex items-center gap-2.5 px-3 py-2 rounded-lg',
            'bg-white hover:bg-[#0E4268]/5',
            'border border-gray-200 hover:border-[#0E4268]/30',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30 focus:border-[#0E4268]/50'
          )}
        >
          {/* Document Icon */}
          <div className="relative">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              className="text-gray-500 group-hover:text-[#0E4268] transition-colors"
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

          {/* Document Name */}
          <span className="text-sm font-medium text-gray-700 group-hover:text-[#0E4268] transition-colors">
            {currentGroup?.name || 'Select Document'}
          </span>

          {/* Page Count Badge */}
          <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-md">
            {currentGroup?.pages.length || 0}
          </span>

          {/* Chevron */}
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
        align="start"
        sideOffset={6}
        className={cn(
          'w-auto min-w-[280px] p-1.5',
          'bg-white',
          'border border-gray-200',
          'rounded-xl',
          'shadow-xl shadow-gray-200/50',
          'animate-in fade-in-0 zoom-in-95 duration-150'
        )}
      >
        <div className="px-2 py-1.5 mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            Documents
          </p>
        </div>

        <div className="space-y-0.5">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleSwitch(group.id)}
              className={cn(
                'w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg',
                'transition-all duration-150',
                group.id === currentGroupId
                  ? 'bg-[#0E4268]/10 text-[#0E4268]'
                  : 'hover:bg-gray-50 text-gray-700',
                'focus:outline-none focus:ring-2 focus:ring-[#0E4268]/30'
              )}
            >
              {/* Document Icon */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                group.id === currentGroupId
                  ? 'bg-[#0E4268]/20'
                  : 'bg-gray-100'
              )}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  className={group.id === currentGroupId ? 'text-[#0E4268]' : 'text-gray-500'}
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

              {/* Document Info */}
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn(
                    'text-sm font-medium whitespace-nowrap',
                    group.id === currentGroupId ? 'text-[#0E4268]' : 'text-gray-700'
                  )}>
                    {group.name}
                  </p>
                  <span className={cn(
                    'text-[10px] font-medium px-1.5 py-0.5 rounded-full capitalize whitespace-nowrap shrink-0',
                    group.status === 'ready'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  )}>
                    {group.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 whitespace-nowrap">
                  {group.pages.length} {group.pages.length === 1 ? 'page' : 'pages'}
                </p>
              </div>

              {/* Check Mark */}
              {group.id === currentGroupId && (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#0E4268] shrink-0"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
