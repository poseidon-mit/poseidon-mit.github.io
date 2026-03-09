# Crystallize Components - Created Files

## Summary

Created 6 React 19 + TypeScript components for the Crystallize multi-model orchestration app:
- **3 Orchestration Components**: Mode selection, model management, template system
- **2 Session Components**: Session sidebar with list and individual items
- **1 Command Palette**: Full-screen command system using cmdk

All components use:
- React 19 + TypeScript 5.9
- Tailwind CSS 4.1 with dark mode theme
- Framer Motion 12 for animations
- Lucide React for icons
- Radix UI primitives for accessibility

---

## File Structure

```
src/components/
├── orchestration/
│   ├── ModeSelector.tsx          (Mode dropdown)
│   ├── ModelPicker.tsx           (Model pills/toggles)
│   ├── PromptTemplate.tsx        (Template selector)
│   └── index.ts                  (Public exports)
├── sessions/
│   ├── SessionList.tsx           (Session sidebar with search)
│   ├── SessionItem.tsx           (Individual session entry)
│   └── index.ts                  (Public exports)
└── command/
    ├── CommandPalette.tsx        (Full command palette)
    └── index.ts                  (Public exports)
```

---

## Component Details

### 1. ModeSelector.tsx

**Location**: `src/components/orchestration/ModeSelector.tsx`

**Props**:
```tsx
interface ModeSelectorProps {
  mode: OrchestrationMode;
  onChange: (mode: OrchestrationMode) => void;
}
```

**Features**:
- Dropdown button showing current mode with icon
- List of all 6 modes (single, parallel, debate, review, refine, custom)
- Each mode shows icon, label, and short description
- Active mode gets a checkmark
- Click-outside detection to close dropdown
- Glass-surface styling with smooth transitions

**Icons Used**:
- Single: `MessageSquare`
- Parallel: `Columns3`
- Debate: `Swords`
- Review: `ClipboardCheck`
- Refine: `Layers`
- Custom: `Settings2`

**Example Usage**:
```tsx
import { ModeSelector } from '@/components/orchestration';
import { useState } from 'react';

export function MyComponent() {
  const [mode, setMode] = useState<OrchestrationMode>('single');

  return <ModeSelector mode={mode} onChange={setMode} />;
}
```

---

### 2. ModelPicker.tsx

**Location**: `src/components/orchestration/ModelPicker.tsx`

**Props**:
```tsx
interface ModelPickerProps {
  activeModels: ModelId[];
  onToggle: (model: ModelId) => void;
  mode: OrchestrationMode;
}
```

**Features**:
- Row of model pills (Claude, GPT, Gemini)
- Each pill shows colored dot + short model label
- Active pills: solid background (model color at 15% opacity) + border
- Inactive pills: muted/ghost style
- Click to toggle model on/off
- In 'single' mode, visually indicates only one can be selected
- Framer Motion hover/tap animations

**Model Colors**:
- Claude: `#00F0FF` (cyan)
- GPT: `#22C55E` (green)
- Gemini: `#8B5CF6` (violet)

**Example Usage**:
```tsx
import { ModelPicker } from '@/components/orchestration';
import { useState } from 'react';

export function MyComponent() {
  const [models, setModels] = useState<ModelId[]>(['claude']);
  const [mode, setMode] = useState<OrchestrationMode>('single');

  return (
    <ModelPicker
      activeModels={models}
      onToggle={(m) => setModels(...)}
      mode={mode}
    />
  );
}
```

---

### 3. PromptTemplateSelector.tsx

**Location**: `src/components/orchestration/PromptTemplate.tsx`

**Props**:
```tsx
interface PromptTemplateSelectorProps {
  templates: PromptTemplate[];
  onApply: (templateId: string) => void;
}
```

**Features**:
- Dropdown button with Sparkles icon + "Templates" label
- Shows list of templates with:
  - Template name
  - Mode badge (Single, Parallel, etc.)
  - Small colored dots for each model
  - Round count and output format info
- Groups templates: "Built-in" section first, then "Custom"
- Click to apply template
- Click-outside detection to close

**Template Display**:
```tsx
{
  name: "Template Name",
  mode: "parallel",           // Shows mode badge
  models: ["claude", "gpt"],  // Shows model dots
  rounds: 3,
  outputFormat: "JSON"
}
```

**Example Usage**:
```tsx
import { PromptTemplateSelector } from '@/components/orchestration';

const templates: PromptTemplate[] = [
  {
    id: '1',
    name: 'Code Review',
    mode: 'parallel',
    models: ['claude', 'gpt'],
    systemPrompt: '...',
    rounds: 1,
    isBuiltIn: true,
  },
];

export function MyComponent() {
  return (
    <PromptTemplateSelector
      templates={templates}
      onApply={(id) => console.log('Apply template', id)}
    />
  );
}
```

---

### 4. SessionList.tsx

**Location**: `src/components/sessions/SessionList.tsx`

**Props**:
```tsx
interface SessionListProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}
```

**Features**:
- Left sidebar content component
- "New Chat" button at top (Plus icon, full width, cyan border)
- Search input to filter sessions by title
- Session list sorted by `updatedAt` descending (most recent first)
- Filtered by search query in real-time
- Active session has highlighted background
- Smooth animations with Framer Motion
- Empty state when no sessions exist
- Search input shows X button to clear

**Layout**:
1. New Chat button (full width)
2. Search input (with icon)
3. Scrollable session list

**Example Usage**:
```tsx
import { SessionList } from '@/components/sessions';
import { useState } from 'react';

export function Sidebar() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <SessionList
      sessions={sessions}
      activeSessionId={activeId}
      onSelect={setActiveId}
      onCreate={() => { /* create new */ }}
      onDelete={(id) => { /* delete session */ }}
      onRename={(id, title) => { /* rename session */ }}
    />
  );
}
```

---

### 5. SessionItem.tsx

**Location**: `src/components/sessions/SessionItem.tsx`

**Props**:
```tsx
interface SessionItemProps {
  session: Session;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (title: string) => void;
}
```

**Features**:
- Single session entry in sidebar
- Displays:
  - Session title (truncated to 32 chars)
  - Small colored dots for each model used (Claude, GPT, Gemini)
  - Relative timestamp (e.g., "3:45 PM" or "Mar 8 2:30 PM")
- Hover shows "..." (MoreVertical) menu button
- Menu options: Rename, Delete
- Click title to select session
- Active state: highlighted background + cyan border
- Inline rename mode:
  - Click menu → Rename
  - Input appears with Save/Cancel buttons
  - Press Enter to save, Escape to cancel
  - Edit input auto-focuses and selects text

**Visual States**:
- Normal: semi-transparent, readable
- Hover: slightly brighter background
- Active: cyan-bordered, bright background
- Editing: input field replaces title, show Save/Cancel icons

**Example Usage**:
```tsx
import { SessionItem } from '@/components/sessions';

export function Session() {
  const session: Session = {
    id: '123',
    title: 'Q4 Planning Discussion',
    models: ['claude', 'gpt'],
    mode: 'debate',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  return (
    <SessionItem
      session={session}
      isActive={true}
      onSelect={() => console.log('select')}
      onDelete={() => console.log('delete')}
      onRename={(title) => console.log('rename', title)}
    />
  );
}
```

---

### 6. CommandPalette.tsx

**Location**: `src/components/command/CommandPalette.tsx`

**Props**:
```tsx
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: string, payload?: any) => void;
}
```

**Features**:
- Full-screen overlay using Framer Motion
- Centered modal dialog with max-width 500px
- Uses `cmdk` library for command system
- Input field at top with placeholder "Type a command or search..."
- Results below input with icons and descriptions
- Grouped commands by category:
  - **Chat**: New Chat, Clear Chat, Export Chat
  - **Models**: Switch to Claude, GPT, Gemini
  - **Modes**: All 6 orchestration modes
  - **Interface**: Toggle Sidebar

**Keyboard Shortcuts**:
- ESC: Close palette
- Enter: Execute selected command
- Arrow keys: Navigate commands (cmdk handles this)

**Command Structure**:
```tsx
{
  id: 'new-chat',
  label: 'New Chat',
  description: 'Start a new conversation',
  icon: Plus,    // lucide-react icon
  category: 'Chat'
}
```

**Styling**:
- Glassmorphic panel (backdrop blur)
- Dark background with subtle borders
- Icons on left (16px)
- Title + description stacked
- Hover: highlights item
- Footer shows "Press ESC to close"

**Example Usage**:
```tsx
import { CommandPalette } from '@/components/command';
import { useState } from 'react';

export function App() {
  const [cmdOpen, setCmdOpen] = useState(false);

  // Open with keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onAction={(action) => {
          console.log('Command executed:', action);
          // Handle command: route to appropriate action
        }}
      />
    </>
  );
}
```

---

## Integration Examples

### Complete Sidebar + Command Palette

```tsx
import { SessionList } from '@/components/sessions';
import { CommandPalette } from '@/components/command';
import { ModeSelector, ModelPicker, PromptTemplateSelector } from '@/components/orchestration';
import { useState, useEffect } from 'react';

export function CrystallizeApp() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<OrchestrationMode>('single');
  const [models, setModels] = useState<ModelId[]>(['claude']);
  const [cmdOpen, setCmdOpen] = useState(false);

  // Open command palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 border-r border-neutral-700 p-4">
        <SessionList
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSelect={setActiveSessionId}
          onCreate={() => { /* ... */ }}
          onDelete={(id) => { /* ... */ }}
          onRename={(id, title) => { /* ... */ }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-neutral-700 p-4 flex gap-4">
          <ModeSelector mode={mode} onChange={setMode} />
          <ModelPicker activeModels={models} onToggle={...} mode={mode} />
          <PromptTemplateSelector templates={[]} onApply={...} />
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {/* Chat messages here */}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onAction={(action) => {
          // Handle commands
        }}
      />
    </div>
  );
}
```

---

## Styling & Theming

All components use the global theme variables defined in `src/styles/index.css`:

**Dark Mode Colors**:
- Background: `#09090b`
- Foreground: `#fafafa`
- Muted: `#a1a1aa`
- Surface: `rgba(255, 255, 255, 0.03)` (with hover state)
- Border: `rgba(255, 255, 255, 0.06)`
- Accent: `rgba(255, 255, 255, 0.08)`

**Model Colors**:
- Claude: `#00F0FF` (cyan)
- GPT: `#22C55E` (green)
- Gemini: `#8B5CF6` (violet)

**CSS Classes**:
- `.glass-surface` - Standard glass card with blur
- `.glass-surface-hover` - Hover state for glass cards
- `.border-model-*` - Left border colored by model
- `.text-model-*` - Text colored by model
- `.bg-model-*` - Background colored by model

---

## Dependencies

All components use the following installed packages (already in package.json):

- **React 19**: Core framework
- **TypeScript 5.9**: Type safety
- **Tailwind CSS 4.1**: Styling
- **Framer Motion 12**: Animations
- **Lucide React 0.577**: Icons
- **cmdk 1.1.1**: Command palette
- **Radix UI**: Dropdown, Dialog, Popover, ScrollArea primitives
- **clsx + tailwind-merge**: Class name utilities

---

## Type Imports

All components import types from `@/lib/types.ts`:

```tsx
// Orchestration Types
type OrchestrationMode = 'single' | 'parallel' | 'debate' | 'review' | 'refine' | 'custom';
type ModelId = 'claude' | 'gpt' | 'gemini';

interface Message { /* ... */ }
interface Session { /* ... */ }
interface PromptTemplate { /* ... */ }
```

And models/constants from `@/lib/models.ts`:

```tsx
const MODELS: Record<ModelId, ModelConfig>;
const ALL_MODELS: ModelId[];
const MODE_LABELS: Record<string, { label: string; description: string }>;
```

---

## Testing Notes

All components have been verified to:
- ✅ Have correct TypeScript types (no compilation errors)
- ✅ Use correct import paths with `@/` alias
- ✅ Follow established Tailwind CSS patterns
- ✅ Use consistent glass-surface styling
- ✅ Include proper Framer Motion animations
- ✅ Handle keyboard interactions (ESC, Enter, etc.)
- ✅ Include proper accessibility patterns
- ✅ Follow React 19 patterns and hooks

---

## Next Steps for Integration

1. **Connect to State Management**: Wire components to your app's state (Redux, Zustand, Context, etc.)
2. **Add Command Handlers**: Map command palette actions to app functions
3. **Implement Session Storage**: Persist sessions to localStorage or backend
4. **Add Chat Area**: Integrate existing chat components below the top bar
5. **Keyboard Shortcuts**: Set up Cmd+K to open command palette
6. **Model Integration**: Connect to real LLM APIs (Claude, GPT, Gemini)
7. **Error Handling**: Add error boundaries and loading states
8. **Analytics**: Track user interactions and command usage

---

## File Manifest

```
✅ src/components/orchestration/ModeSelector.tsx        (100 lines)
✅ src/components/orchestration/ModelPicker.tsx         (70 lines)
✅ src/components/orchestration/PromptTemplate.tsx      (115 lines)
✅ src/components/orchestration/index.ts                (3 lines)
✅ src/components/sessions/SessionList.tsx              (95 lines)
✅ src/components/sessions/SessionItem.tsx              (180 lines)
✅ src/components/sessions/index.ts                     (2 lines)
✅ src/components/command/CommandPalette.tsx            (135 lines)
✅ src/components/command/index.ts                      (1 line)
```

Total: ~700 lines of production-ready component code
