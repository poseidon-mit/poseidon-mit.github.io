# Crystallize Components - Quick Reference

## Import All Components

```tsx
// Orchestration components
import { ModeSelector, ModelPicker, PromptTemplateSelector } from '@/components/orchestration';

// Session components
import { SessionList, SessionItem } from '@/components/sessions';

// Command palette
import { CommandPalette } from '@/components/command';
```

## Component Quick Reference

### ModeSelector
```tsx
<ModeSelector
  mode="parallel"
  onChange={(mode) => setMode(mode)}
/>
```
- Shows current orchestration mode with icon
- Dropdown with all 6 modes
- Each mode shows label + description

### ModelPicker
```tsx
<ModelPicker
  activeModels={['claude', 'gpt']}
  onToggle={(model) => handleToggle(model)}
  mode="parallel"
/>
```
- Toggleable pill buttons for each model
- Single mode restricts to one selection
- Shows model colors and short labels

### PromptTemplateSelector
```tsx
<PromptTemplateSelector
  templates={templateList}
  onApply={(id) => applyTemplate(id)}
/>
```
- Dropdown showing template list
- Groups built-in and custom templates
- Shows mode badge + model dots + info

### SessionList
```tsx
<SessionList
  sessions={allSessions}
  activeSessionId={currentId}
  onSelect={(id) => setCurrentSession(id)}
  onCreate={() => createNewSession()}
  onDelete={(id) => deleteSession(id)}
  onRename={(id, title) => renameSession(id, title)}
/>
```
- Left sidebar with new chat button
- Search to filter sessions
- Sorted by recent (updatedAt desc)
- Full 100% height container

### SessionItem
```tsx
<SessionItem
  session={session}
  isActive={isActive}
  onSelect={() => selectSession()}
  onDelete={() => deleteSession()}
  onRename={(title) => renameSession(title)}
/>
```
- Individual session entry
- Shows title, models, timestamp
- Hover menu with rename/delete
- Active state with border highlight

### CommandPalette
```tsx
<CommandPalette
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onAction={(action, payload) => handleCommand(action, payload)}
/>
```
- Full-screen overlay modal
- Search input + command list
- Grouped by category (Chat, Models, Modes, Interface)
- ESC to close

---

## Common Integration Patterns

### Top Navigation Bar
```tsx
<div className="flex gap-4 items-center">
  <ModeSelector mode={mode} onChange={setMode} />
  <ModelPicker activeModels={models} onToggle={toggleModel} mode={mode} />
  <PromptTemplateSelector templates={templates} onApply={applyTemplate} />
</div>
```

### Left Sidebar
```tsx
<div className="w-64 border-r border-neutral-700 p-4">
  <SessionList
    sessions={sessions}
    activeSessionId={activeSessionId}
    onSelect={setActiveSessionId}
    onCreate={createSession}
    onDelete={deleteSession}
    onRename={renameSession}
  />
</div>
```

### With Command Palette
```tsx
// Handle Cmd+K or Ctrl+K to open
useEffect(() => {
  const down = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandOpen(true);
    }
  };
  document.addEventListener('keydown', down);
  return () => document.removeEventListener('keydown', down);
}, []);

return (
  <CommandPalette
    isOpen={commandOpen}
    onClose={() => setCommandOpen(false)}
    onAction={(action) => {
      // Handle: new-chat, clear-chat, export-chat
      // Handle: switch-claude, switch-gpt, switch-gemini
      // Handle: mode-single, mode-parallel, etc.
      // Handle: toggle-sidebar
    }}
  />
);
```

---

## Type Definitions

From `@/lib/types.ts`:

```tsx
type OrchestrationMode = 'single' | 'parallel' | 'debate' | 'review' | 'refine' | 'custom';
type ModelId = 'claude' | 'gpt' | 'gemini';

interface Session {
  id: string;
  title: string;
  messages: Message[];
  models: ModelId[];
  mode: OrchestrationMode;
  createdAt: number;
  updatedAt: number;
}

interface PromptTemplate {
  id: string;
  name: string;
  mode: OrchestrationMode;
  models: ModelId[];
  systemPrompt: string;
  outputFormat?: string;
  rounds: number;
  isBuiltIn?: boolean;
}
```

---

## Styling

All components use:
- **Dark theme** by default
- **Glass surface** styling (blur + semi-transparent background)
- **Model colors** for visual coding (cyan, green, violet)
- **Framer Motion** for smooth animations
- **Lucide React** icons (16-18px)

No additional CSS needed - everything is in Tailwind + global theme.

---

## Files Created

```
src/components/
├── orchestration/
│   ├── ModeSelector.tsx
│   ├── ModelPicker.tsx
│   ├── PromptTemplate.tsx
│   └── index.ts
├── sessions/
│   ├── SessionList.tsx
│   ├── SessionItem.tsx
│   └── index.ts
└── command/
    ├── CommandPalette.tsx
    └── index.ts
```

Total: 9 files, ~700 lines of production code

---

## Verified

✅ TypeScript compilation passes
✅ All imports resolve correctly
✅ All types are correct
✅ Dependencies available
✅ No lint errors
✅ Animations smooth
✅ Accessibility patterns included
✅ Dark mode ready

Ready for integration!
