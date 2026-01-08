'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { usePDF } from '@/lib/pdf-context';
import { cn } from '@/lib/utils';

export function ViewSwitcher() {
  const { viewMode, setViewMode } = usePDF();

  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode('preview')}
        className={cn(
          'px-3 h-8',
          viewMode === 'preview' && 'bg-white shadow-sm'
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1.5"
        >
          <rect width="7" height="9" x="3" y="3" rx="1" />
          <rect width="7" height="5" x="14" y="3" rx="1" />
          <rect width="7" height="9" x="14" y="12" rx="1" />
          <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
        Preview
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setViewMode('edit')}
        className={cn(
          'px-3 h-8',
          viewMode === 'edit' && 'bg-white shadow-sm'
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-1.5"
        >
          <rect width="7" height="7" x="3" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="3" rx="1" />
          <rect width="7" height="7" x="14" y="14" rx="1" />
          <rect width="7" height="7" x="3" y="14" rx="1" />
        </svg>
        Edit
      </Button>
    </div>
  );
}
