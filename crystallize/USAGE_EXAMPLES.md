# Crystallize Components - Usage Examples

## Complete App Setup

Here's a fully functional example integrating all components together:

```tsx
// src/App.tsx
import { useState, useEffect } from 'react';
import {
  ModeSelector,
  ModelPicker,
  PromptTemplateSelector,
} from '@/components/orchestration';
import { SessionList } from '@/components/sessions';
import { CommandPalette } from '@/components/command';
import type { Session, OrchestrationMode, ModelId, PromptTemplate } from '@/lib/types';

export function App() {
  // State
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [mode, setMode] = useState<OrchestrationMode>('single');
  const [models, setModels] = useState<ModelId[]>(['claude']);
  const [templates] = useState<PromptTemplate[]>([
    {
      id: 'code-review',
      name: 'Code Review',
      mode: 'parallel',
      models: ['claude', 'gpt'],
      systemPrompt: 'You are a code reviewer...',
      outputFormat: 'markdown',
      rounds: 1,
      isBuiltIn: true,
    },
  ]);
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  // Open command palette with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleCreateSession = () => {
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: `Chat ${new Date().toLocaleTimeString()}`,
      messages: [],
      models,
      mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      setActiveSessionId(sessions.find((s) => s.id !== id)?.id ?? null);
    }
  };

  const handleRenameSession = (id: string, title: string) => {
    setSessions(
      sessions.map((s) =>
        s.id === id ? { ...s, title, updatedAt: Date.now() } : s
      )
    );
  };

  const handleToggleModel = (model: ModelId) => {
    if (mode === 'single') {
      // Single mode: toggle on/off
      setModels(models.includes(model) ? [] : [model]);
    } else {
      // Other modes: add/remove from list
      setModels(
        models.includes(model)
          ? models.filter((m) => m !== model)
          : [...models, model]
      );
    }
  };

  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMode(template.mode);
      setModels(template.models);
      // You could also pre-populate the input field with the system prompt
    }
  };

  const handleCommand = (action: string) => {
    switch (action) {
      case 'new-chat':
        handleCreateSession();
        break;
      case 'clear-chat':
        // Clear messages in current session
        if (activeSessionId) {
          setSessions(
            sessions.map((s) =>
              s.id === activeSessionId ? { ...s, messages: [] } : s
            )
          );
        }
        break;
      case 'export-chat':
        // Export current session to JSON or Markdown
        console.log('Export chat:', activeSessionId);
        break;
      case 'switch-claude':
        setModels(['claude']);
        setMode('single');
        break;
      case 'switch-gpt':
        setModels(['gpt']);
        setMode('single');
        break;
      case 'switch-gemini':
        setModels(['gemini']);
        setMode('single');
        break;
      case 'mode-single':
        setMode('single');
        break;
      case 'mode-parallel':
        setMode('parallel');
        break;
      case 'mode-debate':
        setMode('debate');
        break;
      case 'mode-review':
        setMode('review');
        break;
      case 'mode-refine':
        setMode('refine');
        break;
      case 'mode-custom':
        setMode('custom');
        break;
      case 'toggle-sidebar':
        // Toggle sidebar visibility
        console.log('Toggle sidebar');
        break;
    }
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId);

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Left Sidebar */}
      <div className="w-64 border-r border-border bg-neutral-900 bg-opacity-50 overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <SessionList
            sessions={sessions}
            activeSessionId={activeSessionId}
            onSelect={setActiveSessionId}
            onCreate={handleCreateSession}
            onDelete={handleDeleteSession}
            onRename={handleRenameSession}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <div className="border-b border-border px-6 py-4 bg-neutral-900 bg-opacity-30 flex items-center gap-4">
          <ModeSelector mode={mode} onChange={setMode} />
          <ModelPicker
            activeModels={models}
            onToggle={handleToggleModel}
            mode={mode}
          />
          <PromptTemplateSelector
            templates={templates}
            onApply={handleApplyTemplate}
          />

          {/* Active session info */}
          {activeSession && (
            <div className="ml-auto text-sm text-muted">
              {activeSession.title}
            </div>
          )}
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          {activeSession ? (
            <div className="h-full flex flex-col p-6">
              {activeSession.messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-muted">
                  <div className="text-center">
                    <p className="text-lg font-medium mb-2">
                      Start a conversation
                    </p>
                    <p className="text-sm">
                      Type a message or use Cmd+K for commands
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto mb-4">
                  {/* Render messages here */}
                </div>
              )}

              {/* Input area */}
              <div className="glass-surface rounded-md p-4">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-transparent outline-none text-foreground placeholder-muted"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      // Handle send message
                    }
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted">
              <div className="text-center">
                <p className="text-lg font-medium mb-2">No chat selected</p>
                <p className="text-sm">
                  Create a new chat or select one from the sidebar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onAction={handleCommand}
      />
    </div>
  );
}

export default App;
```

---

## Using Individual Components

### Just the Mode Selector

```tsx
import { ModeSelector } from '@/components/orchestration';
import { useState } from 'react';
import type { OrchestrationMode } from '@/lib/types';

export function ModeDemo() {
  const [mode, setMode] = useState<OrchestrationMode>('parallel');

  return (
    <div className="p-8">
      <ModeSelector mode={mode} onChange={setMode} />
      <p className="mt-4">Selected mode: {mode}</p>
    </div>
  );
}
```

### Just the Model Picker

```tsx
import { ModelPicker } from '@/components/orchestration';
import { useState } from 'react';
import type { ModelId, OrchestrationMode } from '@/lib/types';

export function ModelPickerDemo() {
  const [models, setModels] = useState<ModelId[]>(['claude', 'gpt']);
  const [mode] = useState<OrchestrationMode>('parallel');

  const handleToggle = (model: ModelId) => {
    setModels((prev) =>
      prev.includes(model)
        ? prev.filter((m) => m !== model)
        : [...prev, model]
    );
  };

  return (
    <div className="p-8">
      <ModelPicker
        activeModels={models}
        onToggle={handleToggle}
        mode={mode}
      />
      <p className="mt-4">Active models: {models.join(', ')}</p>
    </div>
  );
}
```

### Just the Session List

```tsx
import { SessionList } from '@/components/sessions';
import { useState } from 'react';
import type { Session } from '@/lib/types';

export function SessionListDemo() {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      title: 'Q4 Planning',
      messages: [],
      models: ['claude', 'gpt'],
      mode: 'debate',
      createdAt: Date.now() - 86400000,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: '2',
      title: 'Code Review',
      messages: [],
      models: ['claude'],
      mode: 'single',
      createdAt: Date.now() - 3600000,
      updatedAt: Date.now(),
    },
  ]);
  const [activeId, setActiveId] = useState<string | null>('2');

  return (
    <div className="w-64 h-screen border-r border-neutral-700">
      <SessionList
        sessions={sessions}
        activeSessionId={activeId}
        onSelect={setActiveId}
        onCreate={() => {
          const newSession: Session = {
            id: crypto.randomUUID(),
            title: `New Chat`,
            messages: [],
            models: ['claude'],
            mode: 'single',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          setSessions([newSession, ...sessions]);
        }}
        onDelete={(id) => setSessions(sessions.filter((s) => s.id !== id))}
        onRename={(id, title) => {
          setSessions(
            sessions.map((s) =>
              s.id === id ? { ...s, title, updatedAt: Date.now() } : s
            )
          );
        }}
      />
    </div>
  );
}
```

### Just the Command Palette

```tsx
import { CommandPalette } from '@/components/command';
import { useState } from 'react';

export function CommandPaletteDemo() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8">
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-cyan-600 text-white rounded"
      >
        Open Command Palette (Cmd+K)
      </button>

      <CommandPalette
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAction={(action) => {
          console.log('Command executed:', action);
          setIsOpen(false);
        }}
      />
    </div>
  );
}
```

---

## Advanced Patterns

### Multi-select Models with Mode Switching

```tsx
import { ModeSelector, ModelPicker } from '@/components/orchestration';
import { useState } from 'react';
import type { OrchestrationMode, ModelId } from '@/lib/types';

export function OrchestratorPanel() {
  const [mode, setMode] = useState<OrchestrationMode>('parallel');
  const [models, setModels] = useState<ModelId[]>(['claude', 'gpt']);

  const handleModeChange = (newMode: OrchestrationMode) => {
    setMode(newMode);
    // In single mode, reset to first selected model if multiple selected
    if (newMode === 'single' && models.length > 1) {
      setModels([models[0]]);
    }
  };

  const handleToggleModel = (model: ModelId) => {
    if (mode === 'single') {
      setModels(models.includes(model) ? [] : [model]);
    } else {
      setModels((prev) =>
        prev.includes(model)
          ? prev.filter((m) => m !== model)
          : [...prev, model]
      );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-neutral-200 mb-2 block">
          Orchestration Mode
        </label>
        <ModeSelector mode={mode} onChange={handleModeChange} />
      </div>

      <div>
        <label className="text-sm font-medium text-neutral-200 mb-2 block">
          Models ({models.length} selected)
        </label>
        <ModelPicker
          activeModels={models}
          onToggle={handleToggleModel}
          mode={mode}
        />
      </div>

      <div className="text-sm text-neutral-400 mt-4">
        <p>
          Mode: <span className="font-medium">{mode}</span>
        </p>
        <p>
          Models: <span className="font-medium">{models.join(', ')}</span>
        </p>
      </div>
    </div>
  );
}
```

### Session Search and Filter

```tsx
import { SessionList } from '@/components/sessions';
import { useState } from 'react';
import type { Session } from '@/lib/types';

export function SessionManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Note: SessionList has built-in search, but here's how to add
  // additional filtering on top
  const filteredSessions = sessions.filter((s) =>
    s.title.toLowerCase().includes('debate') ||
    s.mode === 'debate'
  );

  return (
    <div className="w-64">
      <SessionList
        sessions={filteredSessions}
        activeSessionId={activeId}
        onSelect={setActiveId}
        onCreate={() => { /* ... */ }}
        onDelete={(id) => setSessions(sessions.filter((s) => s.id !== id))}
        onRename={(id, title) => { /* ... */ }}
      />
    </div>
  );
}
```

---

## Keyboard Shortcuts

### Adding Global Shortcuts

```tsx
import { useEffect } from 'react';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K: Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Dispatch action to open command palette
      }

      // Cmd+N or Ctrl+N: New chat
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        // Dispatch action to create new session
      }

      // Escape: Close any open menus
      if (e.key === 'Escape') {
        // Close dropdowns, command palette, etc.
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}

// Usage in your app
export function App() {
  useKeyboardShortcuts();
  // ... rest of app
}
```

---

## Styling and Theming

All components respect the theme from `src/styles/index.css`. To customize:

1. Edit CSS variables in `src/styles/index.css`
2. Components automatically use the new colors

```css
@theme inline {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  --color-surface: rgba(255, 255, 255, 0.03);
  --color-model-claude: #00F0FF;
  --color-model-gpt: #22C55E;
  --color-model-gemini: #8B5CF6;
}
```

---

## Error Handling

### Graceful Fallbacks

```tsx
export function SafeSessionList({ sessions }: { sessions: Session[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  try {
    return (
      <SessionList
        sessions={sessions}
        activeSessionId={activeId}
        onSelect={setActiveId}
        onCreate={() => { /* ... */ }}
        onDelete={(id) => { /* ... */ }}
        onRename={(id, title) => { /* ... */ }}
      />
    );
  } catch (error) {
    console.error('SessionList error:', error);
    return (
      <div className="p-4 text-red-400">
        Error loading sessions. Please refresh.
      </div>
    );
  }
}
```

---

## Testing Components

### Mock Data for Testing

```tsx
import type { Session, PromptTemplate } from '@/lib/types';

export const mockSessions: Session[] = [
  {
    id: '1',
    title: 'Q4 Planning Discussion',
    messages: [],
    models: ['claude', 'gpt'],
    mode: 'debate',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 3600000,
  },
  {
    id: '2',
    title: 'Code Review - Authentication Module',
    messages: [],
    models: ['claude'],
    mode: 'single',
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now(),
  },
];

export const mockTemplates: PromptTemplate[] = [
  {
    id: 'code-review',
    name: 'Code Review',
    mode: 'parallel',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'You are an expert code reviewer...',
    rounds: 1,
    isBuiltIn: true,
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    mode: 'parallel',
    models: ['claude', 'gpt'],
    systemPrompt: 'Generate creative ideas...',
    rounds: 3,
    isBuiltIn: true,
  },
];
```

---

That's it! All components are ready to integrate. Use these examples as a starting point for your implementation.
