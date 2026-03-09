# Chat Components

Production-quality chat UI components for the Crystallize multi-model orchestration app.

## Component Hierarchy

```
ChatShell (layout wrapper)
├── sidebar (React.ReactNode)
└── children
    ├── MessageList (scrollable message display)
    │   └── MessageBubble (individual messages)
    │       ├── ModelTag (model indicator)
    │       ├── TypingIndicator (when generating)
    │       └── Message content (with markdown rendering)
    └── InputBar (message input & controls)
        ├── Model selector (toggleable pills)
        ├── Mode dropdown
        ├── Auto-growing textarea
        ├── Template selector
        └── Send/Stop button
```

## Components

### ModelTag
Small colored pill showing model name with indicator dot.

```tsx
import { ModelTag } from '@/components/chat';

<ModelTag model="claude" size="md" />
```

**Props:**
- `model: ModelId` - Model identifier ('claude' | 'gpt' | 'gemini')
- `size?: 'sm' | 'md'` - Pill size (default: 'md')

**Features:**
- Model-specific background color (rgba 8% opacity) and text color
- Animated dot indicator in model color
- Responsive sizing

### TypingIndicator
Animated three-dot indicator showing which model is generating a response.

```tsx
import { TypingIndicator } from '@/components/chat';

<TypingIndicator model="claude" />
```

**Props:**
- `model: ModelId` - Model being generated

**Features:**
- Framer Motion bounce animation (0.6s cycle)
- Staggered dot animation (0.1s between each)
- Model color and tag display
- Smooth entry/exit transitions

### MessageBubble
Individual message display with automatic markdown rendering and metadata.

```tsx
import { MessageBubble } from '@/components/chat';

<MessageBubble message={message} />
```

**Props:**
- `message: Message` - Message object with id, role, model, content, timestamp, etc.

**Message Types:**
1. **User messages** - Right-aligned, white/10 background, no model tag
2. **Assistant messages** - Left-aligned, glass-surface with 2px colored left border, ModelTag shown
3. **System/Orchestrator** - Centered, italic, divider lines, muted text

**Features:**
- Full markdown support (bold, italic, code, code blocks)
- Token count and latency metadata
- Auto-timestamp formatting
- Framer Motion fade-up animation on mount
- Responsive layout (max-width: 800px)

**Markdown Support:**
- `**bold text**` → `<strong>`
- `*italic text*` → `<em>`
- `` `code` `` → inline code with monospace styling
- ` ```code blocks``` ` → `<pre><code>` with dark background
- Multi-line content with proper paragraph breaks

### MessageList
Scrollable container that manages message display and auto-scroll behavior.

```tsx
import { MessageList } from '@/components/chat';

<MessageList
  messages={messages}
  isGenerating={isGenerating}
  generatingModels={['claude', 'gpt']}
/>
```

**Props:**
- `messages: Message[]` - Array of messages to display
- `isGenerating: boolean` - Whether any model is currently generating
- `generatingModels?: ModelId[]` - Array of models currently generating

**Features:**
- Auto-scroll to bottom on new messages (smooth scroll)
- Staggered message entry animations
- Empty state with centered guidance text
- TypingIndicator display for each generating model
- Max-width: 800px centered layout
- Overflow-y auto with smooth scrolling

### InputBar
Complete message input interface with model selection, mode switching, and template support.

```tsx
import { InputBar } from '@/components/chat';

<InputBar
  onSend={(content) => console.log(content)}
  onStop={() => console.log('stopped')}
  isGenerating={false}
  activeModels={['claude']}
  onToggleModel={(model) => console.log(model)}
  mode="single"
  onModeChange={(mode) => console.log(mode)}
  templates={templates}
  onApplyTemplate={(id) => console.log(id)}
/>
```

**Props:**
- `onSend: (content: string) => void` - Callback when message sent
- `onStop: () => void` - Callback when generation stopped
- `isGenerating: boolean` - Whether models are generating
- `activeModels: ModelId[]` - Currently selected models
- `onToggleModel: (model: ModelId) => void` - Model selection toggle
- `mode: OrchestrationMode` - Current orchestration mode
- `onModeChange: (mode: OrchestrationMode) => void` - Mode change handler
- `templates: PromptTemplate[]` - Available prompt templates
- `onApplyTemplate: (id: string) => void` - Template selection handler

**Layout:**
- **Top row**: Model toggles (3 circles) + Mode dropdown
- **Middle**: Auto-growing textarea (1-8 lines max)
- **Bottom**: Template dropdown + Send/Stop button
- **Hint**: Keyboard shortcut display (Cmd+K)

**Features:**
- Enter to send, Shift+Enter for newline
- Auto-growing textarea with scroll limit
- Model pill toggling (click to select/deselect)
- Mode dropdown with descriptions
- Template dropdown with mode/model info
- Send button disabled when empty
- Stop button (red, with square icon) during generation
- Keyboard hint showing Command key shortcut

### ChatShell
Main layout wrapper providing sidebar toggle and two-column layout.

```tsx
import { ChatShell } from '@/components/chat';

<ChatShell sidebar={<Sidebar />}>
  <MessageList messages={messages} isGenerating={false} />
  <InputBar {...props} />
</ChatShell>
```

**Props:**
- `sidebar: React.ReactNode` - Sidebar content
- `children: React.ReactNode` - Main content (MessageList + InputBar)

**Layout:**
- Left sidebar: 260px wide, glass-surface with border-right
- Main area: flex-1, contains message list and input
- Toggle button: Top-left, animates with sidebar collapse
- Sidebar collapse animation: 0.3s ease-in-out

**Features:**
- Animated sidebar collapse (width: 260 → 0)
- Collapsible toggle button with PanelLeftOpen/Close icons
- Sidebar hidden by default on mobile (<768px can be added via CSS)
- Framer Motion AnimatePresence for smooth transitions

## Utilities

### renderMarkdown
Simple markdown parser and renderer for chat message content.

```tsx
import { renderMarkdown } from '@/components/chat';

const { elements } = renderMarkdown('**Bold** and *italic* text');
```

**Supported Markdown:**
- **bold** - `**text**`
- *italic* - `*text*`
- `code` - `` `code` ``
- Code blocks - ` ```code``` `
- Line breaks - Auto-detected paragraph breaks
- Future support: lists, tables

## Styling & Theme

All components use:
- **Dark theme**: Slate-950 background with slate-50 text
- **Glass morphism**: `glass-surface` and `glass-surface-card` classes
- **Model colors**: From `MODELS` config (cyan, green, violet)
- **Tailwind CSS 4.1** for styling
- **Framer Motion 12** for animations
- **lucide-react** for icons

### CSS Classes Used
- `glass-surface` - Standard glass card background
- `glass-surface-card` - Full card treatment with inset shadow
- Model-specific: `text-model-claude`, `bg-model-claude`, etc.

## Animation Presets

- **Fade-up**: Messages fade in while moving up slightly (y: 8 → 0)
- **Stagger**: Messages animate with 50ms stagger on list render
- **Bounce**: TypingIndicator dots bounce in sequence (0.6s cycle)
- **Dropdown**: Mode/template dropdowns fade and slide (0.15s)
- **Sidebar**: Sidebar collapse animates width and opacity (0.3s)

## Type Safety

All components are fully typed with TypeScript:
- `ModelId` - Model identifiers
- `Message` - Message structure with role, content, metadata
- `MessageRole` - 'user' | 'assistant' | 'system' | 'orchestrator'
- `OrchestrationMode` - 'single' | 'parallel' | 'debate' | 'review' | 'refine' | 'custom'
- `PromptTemplate` - Template structure
- `ModelTagProps`, `InputBarProps`, etc. - Component prop interfaces

## Integration Example

```tsx
import { ChatShell, MessageList, InputBar } from '@/components/chat';
import { useChatContext } from '@/contexts/ChatContext';

export function ChatPage() {
  const {
    messages,
    isGenerating,
    generatingModels,
    activeModels,
    mode,
    templates,
    sendMessage,
    toggleModel,
    setMode,
    applyTemplate,
    stopGeneration,
  } = useChatContext();

  return (
    <ChatShell sidebar={<ConversationHistory />}>
      <div className="flex flex-col h-full">
        <MessageList
          messages={messages}
          isGenerating={isGenerating}
          generatingModels={generatingModels}
        />
        <InputBar
          onSend={sendMessage}
          onStop={stopGeneration}
          isGenerating={isGenerating}
          activeModels={activeModels}
          onToggleModel={toggleModel}
          mode={mode}
          onModeChange={setMode}
          templates={templates}
          onApplyTemplate={applyTemplate}
        />
      </div>
    </ChatShell>
  );
}
```

## Performance Considerations

- **MessageList**: Uses Framer Motion stagger for smooth list rendering
- **InputBar**: Textarea height calculation optimized with useEffect cleanup
- **Markdown rendering**: Simple regex-based parser, O(n) performance
- **Auto-scroll**: Debounced with setTimeout (100ms) to prevent excessive reflows
- **Animations**: GPU-accelerated via Framer Motion (transform/opacity only)

## Accessibility

- Textarea with proper labeling
- Keyboard shortcuts (Enter, Shift+Enter, Cmd+K)
- Focus states on all interactive elements
- Semantic HTML structure
- Icon tooltips on buttons
- Color contrast > 4.5:1 WCAG AA compliant

## Dependencies

- React 19
- TypeScript 5.9
- Tailwind CSS 4.1
- Framer Motion 12
- lucide-react (icons)
- @/lib/utils (cn function)
- @/lib/models (MODELS, MODE_LABELS, ALL_MODELS)
- @/lib/types (all type definitions)
