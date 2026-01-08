'use client';

import { usePDF } from "@/lib/pdf-context";
import { DocumentSwitcher } from "@/components/document-switcher";
import { ViewSwitcher } from "@/components/view-switcher";
import { PreviewView } from "@/components/preview-view";
import { EditView } from "@/components/edit-view";

export default function Home() {
  const { viewMode } = usePDF();

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center gap-4">
          <DocumentSwitcher />
        </div>
        <ViewSwitcher />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {viewMode === 'preview' ? <PreviewView /> : <EditView />}
      </main>
    </div>
  );
}
