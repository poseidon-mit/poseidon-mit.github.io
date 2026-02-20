import React from 'react';
import { Surface, Button } from '@/design-system';

export default function SpectacularPage() {
  return (
    <>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <main
        id="main-content"
        role="main"
        className="flex min-h-screen flex-col items-center justify-start py-20 bg-[var(--bg-oled)] px-6"
      >
      <div className="w-full max-w-5xl grid gap-6 md:grid-cols-2">
        <Surface variant="elevated" interactive className="p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-white">Creator Studio Preview</h1>
          <p className="text-sm text-slate-300">
            Spectacular primitives are now absorbed into the design system.
          </p>
          <Button variant="glass" className="w-fit">Open Dashboard</Button>
        </Surface>
        <Surface variant="sunken" className="p-6">
          <p className="text-sm text-slate-300">Apple glass + spring button behavior is now reusable via DS primitives.</p>
        </Surface>
      </div>
      </main>
    </>
  );
}
