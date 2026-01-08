'use client';

import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePDF } from '@/lib/pdf-context';

export function GroupTabs() {
  const { groups, currentGroupId, setCurrentGroupId, setSelectedPageId } = usePDF();

  const handleGroupChange = (groupId: string) => {
    setCurrentGroupId(groupId);
    setSelectedPageId(null);
  };

  return (
    <Tabs value={currentGroupId} onValueChange={handleGroupChange}>
      <TabsList className="h-10">
        {groups.map((group) => (
          <TabsTrigger key={group.id} value={group.id} className="px-4">
            {group.name}
            <span className="ml-2 text-xs text-gray-400">({group.pages.length})</span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
