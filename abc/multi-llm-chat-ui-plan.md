# Multi-LLM Orchestration Chat UI — Implementation Plan

> This is a complete implementation prompt. Paste the entire document into a frontier LLM (Claude, GPT, Gemini) to build the application.

---

## Context for the AI

You are building a personal-use multi-LLM orchestration chat UI. The user coordinates multiple frontier LLMs (Claude Opus, GPT Codex, Gemini Pro) on the same topic — having them debate, review each other's work, generate competing ideas, and refine outputs iteratively. Today this is done manually via copy-paste between tools. This app replaces that workflow.

**Key concept:** The user sees a single clean chat interface. Behind the scenes, messages can be routed to one or more LLMs. AI-to-AI conversations happen visually in the chat. The user can intervene at any time or let the AIs continue autonomously. The metaphor is "knowledge crystallization" — raw ideas refined through multi-model dialogue into polished output.

**This is frontend-only.** API connections will be built separately. Use mock data and callback interfaces for now.

---

## Tech Stack

- React 19 + TypeScript 5.9 + Vite 7
- Tailwind CSS 4.1 (dark mode only, `@import 'tailwindcss'` + `@theme inline`)
- Framer Motion 12 (animations)
- Radix UI primitives (Dialog, Popover, DropdownMenu, Tooltip, ScrollArea)
- lucide-react (icons)
- cmdk (command palette)
- class-variance-authority + clsx + tailwind-merge

Install command:
```bash
npm create vite@latest crystallize -- --template react-ts
cd crystallize
npm install tailwindcss @tailwindcss/postcss postcss framer-motion @radix-ui/react-dialog @radix-ui/react-popover @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-scroll-area lucide-react cmdk class-variance-authority clsx tailwind-merge
```

---

## Design Language

### Visual Identity
- **Name:** Crystallize (working title)
- **Palette:** Dark background (#09090b), subtle glass surfaces, model-specific accent colors
- **Typography:** Inter (body), JetBrains Mono (code/system), Space Grotesk (headings)
- **Feel:** Minimal, dark, quiet luxury. Like a premium IDE crossed with iMessage. Zero clutter.

### Model Color Mapping
```
Claude  → Cyan    #00F0FF  (var(--model-claude))
GPT     → Green   #22C55E  (var(--model-gpt))
Gemini  → Violet  #8B5CF6  (var(--model-gemini))
User    → White/neutral
System  → Muted gray
```

Each model's messages get a subtle left-border accent in their color. No heavy theming — just enough to distinguish at a glance.

### Glass Morphism (Light Touch)
```css
.glass-surface {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.06);
}
```

---

## Application Structure

```
src/
├── main.tsx                  # App entry
├── App.tsx                   # Root layout
├── styles/
│   └── index.css             # Tailwind + theme + glass utilities
├── components/
│   ├── ui/                   # Primitives (button, input, badge, scroll-area, etc.)
│   ├── chat/
│   │   ├── ChatShell.tsx     # Main layout: sidebar + chat area
│   │   ├── MessageList.tsx   # Scrollable message history
│   │   ├── MessageBubble.tsx # Single message with model indicator
│   │   ├── InputBar.tsx      # Message input + controls
│   │   ├── ModelTag.tsx      # Small colored model indicator
│   │   └── TypingIndicator.tsx
│   ├── orchestration/
│   │   ├── OrchestratorPanel.tsx   # Side panel: configure AI routing
│   │   ├── ModeSelector.tsx        # Select orchestration mode
│   │   ├── ModelPicker.tsx         # Toggle which models participate
│   │   └── PromptTemplate.tsx      # Prompt engineering presets
│   ├── sessions/
│   │   ├── SessionList.tsx         # Left sidebar: conversation history
│   │   └── SessionItem.tsx         # Single session entry
│   └── command/
│       └── CommandPalette.tsx      # Cmd+K quick actions
├── lib/
│   ├── utils.ts              # cn() helper
│   ├── models.ts             # Model definitions and colors
│   └── types.ts              # Core TypeScript types
├── hooks/
│   ├── useChat.ts            # Chat state management
│   ├── useOrchestration.ts   # Orchestration mode state
│   └── useCommandPalette.ts  # Cmd+K handler
└── mocks/
    └── mock-responses.ts     # Fake API responses for development
```

---

## Core Types

```typescript
// lib/types.ts

type ModelId = 'claude' | 'gpt' | 'gemini';

type MessageRole = 'user' | 'assistant' | 'system' | 'orchestrator';

interface Message {
  id: string;
  role: MessageRole;
  model?: ModelId;           // Which model generated this (undefined for user/system)
  content: string;
  timestamp: number;
  replyTo?: string;          // Reference to another message ID (for AI-to-AI threads)
  meta?: {
    mode?: OrchestrationMode;
    promptTemplate?: string;
    tokens?: number;
    latencyMs?: number;
  };
}

type OrchestrationMode =
  | 'single'      // Send to one model
  | 'parallel'    // Send to all, show all responses
  | 'debate'      // Models respond to each other's outputs
  | 'review'      // One model generates, others review/critique
  | 'refine'      // Sequential: each model improves the previous output
  | 'custom';     // User-defined prompt chain

interface Session {
  id: string;
  title: string;
  messages: Message[];
  models: ModelId[];         // Active models for this session
  mode: OrchestrationMode;
  createdAt: number;
  updatedAt: number;
}

interface OrchestratorConfig {
  mode: OrchestrationMode;
  activeModels: ModelId[];
  rounds?: number;           // For debate/refine: how many rounds
  systemPrompt?: string;     // Override system prompt
  outputFormat?: string;     // Constrain output format
  temperature?: number;
}

// API adapter interface (implemented later)
interface LLMAdapter {
  send(model: ModelId, messages: Message[], config?: Partial<OrchestratorConfig>): Promise<Message>;
  stream(model: ModelId, messages: Message[], config?: Partial<OrchestratorConfig>): AsyncIterable<string>;
}
```

---

## Component Specifications

### 1. ChatShell.tsx — Main Layout

```
┌──────────────┬────────────────────────────────────────────┐
│              │                                            │
│  SessionList │           MessageList                      │
│  (240px)     │           (flex-1)                         │
│              │                                            │
│  - Sessions  │  ┌──────────────────────────────────────┐  │
│  - New chat  │  │  [Claude] Message bubble...           │  │
│  - Search    │  │  [GPT] Response bubble...             │  │
│              │  │  [Gemini] Review bubble...             │  │
│              │  │  [User] Intervention...                │  │
│              │  └──────────────────────────────────────┘  │
│              │                                            │
│              │  ┌──────────────────────────────────────┐  │
│              │  │  InputBar                              │  │
│              │  │  [textarea] [model picker] [send]      │  │
│              │  └──────────────────────────────────────┘  │
└──────────────┴────────────────────────────────────────────┘
```

- Sidebar is collapsible (toggle or < 768px → hidden)
- Chat area is centered, max-width 800px for readability
- Full height viewport, no page scroll — only MessageList scrolls

### 2. MessageBubble.tsx — Single Message

Each message shows:
- **Model tag** (left side): small colored pill with model name + icon
- **Content**: markdown-rendered text (use a simple markdown renderer or dangerouslySetInnerHTML for now)
- **Metadata line** (bottom, muted): timestamp, token count, latency
- **Reply indicator**: if this is an AI responding to another AI, show a thin connecting line or "replying to [model]" label

Visual rules:
- User messages: right-aligned, no model tag, subtle white/gray bubble
- AI messages: left-aligned, model-colored left border (2px), dark glass background
- System/orchestrator messages: centered, italic, muted, no bubble
- AI-to-AI messages: same as AI but with a subtle "chain" icon or indentation to show it is part of an orchestration sequence

```tsx
// Simplified structure
<div className={cn(
  "flex gap-3 py-3",
  message.role === 'user' && "justify-end",
  message.role === 'system' && "justify-center"
)}>
  {message.model && <ModelTag model={message.model} />}
  <div className={cn(
    "max-w-[680px] rounded-2xl px-4 py-3 text-sm leading-relaxed",
    message.role === 'user' && "bg-white/10 text-white",
    message.role === 'assistant' && "glass-surface border-l-2",
    message.model === 'claude' && "border-l-[#00F0FF]",
    message.model === 'gpt' && "border-l-[#22C55E]",
    message.model === 'gemini' && "border-l-[#8B5CF6]",
  )}>
    {message.content}
  </div>
</div>
```

### 3. InputBar.tsx — Message Input

Layout:
```
┌─────────────────────────────────────────────────────────┐
│ [Model pills: Claude ● | GPT ● | Gemini ●]  [Mode: ▾] │
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Type a message...                              [⌘K] │ │
│ │                                                     │ │
│ └─────────────────────────────────────────────────────┘ │
│                          [Attach] [Template ▾] [Send ➤] │
└─────────────────────────────────────────────────────────┘
```

Features:
- **Textarea** auto-grows (min 1 line, max 8 lines), Enter to send, Shift+Enter for newline
- **Model pills** are toggleable — click to include/exclude a model for the next message
- **Mode dropdown** selects orchestration mode (single/parallel/debate/review/refine/custom)
- **Template button** opens a dropdown of saved prompt templates
- **Cmd+K** opens CommandPalette
- Send button is disabled when input is empty
- When in `single` mode, only the selected model pill is active
- When in `parallel` or `debate` mode, multiple pills can be active

### 4. ModelTag.tsx — Model Indicator

```tsx
// Small colored pill next to messages
<span className={cn(
  "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
  model === 'claude' && "bg-[#00F0FF]/10 text-[#00F0FF]",
  model === 'gpt' && "bg-[#22C55E]/10 text-[#22C55E]",
  model === 'gemini' && "bg-[#8B5CF6]/10 text-[#8B5CF6]",
)}>
  <span className="h-1.5 w-1.5 rounded-full bg-current" />
  {modelLabels[model]}
</span>
```

### 5. ModeSelector.tsx — Orchestration Mode Picker

Dropdown or segmented control showing available modes:

| Mode | Label | Description | Behavior |
|------|-------|-------------|----------|
| `single` | Single | Send to one model | Standard chat |
| `parallel` | Parallel | All models answer | Show responses side-by-side or stacked |
| `debate` | Debate | Models discuss | Model A responds, Model B critiques, Model C synthesizes. Configurable rounds. |
| `review` | Review | Generate + Review | One model drafts, others score/critique |
| `refine` | Refine | Sequential polish | A → B improves → C polishes → final |
| `custom` | Custom | User-defined chain | User writes the orchestration prompt template |

### 6. PromptTemplate.tsx — Prompt Engineering Presets

Predefined templates the user can select. Each template configures:
- Which models participate
- What system prompt each model gets
- How many rounds
- Output format constraints

**Built-in templates:**

```typescript
const templates: PromptTemplate[] = [
  {
    id: 'three-ideas',
    name: '3 Ideas from 3 Models',
    mode: 'parallel',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'Generate one unique idea from a different angle than other models would take. Be specific and original.',
    rounds: 1,
  },
  {
    id: 'debate-2-rounds',
    name: 'Debate (2 rounds)',
    mode: 'debate',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'Engage in a structured debate. Challenge assumptions. Cite specific reasoning.',
    rounds: 2,
  },
  {
    id: 'draft-and-review',
    name: 'Draft → Review → Final',
    mode: 'refine',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'First model: draft. Second model: review and critique. Third model: produce the final polished version incorporating the review.',
    rounds: 1,
  },
  {
    id: 'red-team',
    name: 'Red Team',
    mode: 'review',
    models: ['claude', 'gpt', 'gemini'],
    systemPrompt: 'One model generates the proposal. The other two independently identify weaknesses, risks, and blind spots. Be rigorous.',
    rounds: 1,
  },
  {
    id: 'executive-polish',
    name: 'Executive Polish',
    mode: 'refine',
    models: ['claude', 'gpt'],
    systemPrompt: 'First model: write the executive draft. Second model: refine for precision, tone, and executive credibility. Output format: polished final version only.',
    rounds: 1,
  },
  {
    id: 'format-lock',
    name: 'Format Lock',
    mode: 'single',
    models: ['claude'],
    systemPrompt: 'Output strictly in the format specified by the user. No commentary, no preamble. Format only.',
    outputFormat: 'User specifies in message',
    rounds: 1,
  },
];
```

The user can create, edit, and delete custom templates. Store in localStorage.

### 7. SessionList.tsx — Left Sidebar

- List of past sessions, sorted by `updatedAt` descending
- Each item shows: title (auto-generated from first message), model icons used, timestamp
- "New Chat" button at top with `+` icon
- Search/filter input at top
- Click to switch sessions
- Right-click or `...` menu: rename, delete, duplicate, export as markdown

### 8. CommandPalette.tsx — Cmd+K

Quick actions:
- New chat
- Switch model
- Change mode
- Apply template
- Search sessions
- Toggle sidebar
- Export current chat
- Clear chat

---

## Orchestration Flow (Visual)

When the user sends a message in `debate` mode with all 3 models:

```
User: "What is the biggest risk in AI adoption for banks?"
        │
        ▼
┌─ Orchestrator (system message, muted) ─────────────────┐
│ "Starting debate: 3 models, 2 rounds"                   │
└─────────────────────────────────────────────────────────┘
        │
        ▼
[Claude] "The biggest risk is governance gaps..."
        │
        ▼
[GPT] "I would push back on Claude's framing. The real risk is..."
        │
        ▼
[Gemini] "Both raise valid points, but the overlooked risk is..."
        │
        ▼
┌─ Orchestrator ──────────────────────────────────────────┐
│ "Round 1 complete. Starting round 2."                    │
└─────────────────────────────────────────────────────────┘
        │
        ▼
[Claude] "Responding to GPT and Gemini: ..."
[GPT] "Revised position: ..."
[Gemini] "Synthesis: ..."
        │
        ▼
┌─ Orchestrator ──────────────────────────────────────────┐
│ "Debate complete. 2 rounds, 3 models."                   │
└─────────────────────────────────────────────────────────┘
```

The user can **intervene** at any point by typing in the InputBar during a running orchestration. This inserts a user message and the orchestration continues with that context.

A **Stop** button appears during active orchestration to halt the sequence.

---

## State Management

Use React state + context. No external state library needed for this scale.

```typescript
// hooks/useChat.ts

interface ChatState {
  sessions: Session[];
  activeSessionId: string | null;
  isGenerating: boolean;
}

interface ChatActions {
  createSession: () => string;
  switchSession: (id: string) => void;
  sendMessage: (content: string) => void;
  stopGeneration: () => void;
  deleteSession: (id: string) => void;
  renameSession: (id: string, title: string) => void;
  exportSession: (id: string) => string; // Returns markdown
}
```

```typescript
// hooks/useOrchestration.ts

interface OrchestrationState {
  mode: OrchestrationMode;
  activeModels: ModelId[];
  config: OrchestratorConfig;
  templates: PromptTemplate[];
}

interface OrchestrationActions {
  setMode: (mode: OrchestrationMode) => void;
  toggleModel: (model: ModelId) => void;
  applyTemplate: (templateId: string) => void;
  saveTemplate: (template: PromptTemplate) => void;
  deleteTemplate: (id: string) => void;
}
```

Persist sessions and templates to **localStorage**. Load on mount.

---

## Mock API Layer

```typescript
// mocks/mock-responses.ts

const mockResponses: Record<ModelId, string[]> = {
  claude: [
    "From a governance perspective, the key consideration is...",
    "I would approach this differently. The underlying assumption is...",
    "Building on the previous point, there is a nuance worth exploring...",
  ],
  gpt: [
    "The data suggests a different conclusion. Consider...",
    "I agree with the framing but would add...",
    "Looking at this from an implementation standpoint...",
  ],
  gemini: [
    "There is a synthesis available here. Both perspectives...",
    "The contrarian view worth considering is...",
    "If we step back to first principles...",
  ],
};

// Simulate streaming with random delay
async function* mockStream(model: ModelId, _messages: Message[]): AsyncIterable<string> {
  const response = mockResponses[model][Math.floor(Math.random() * mockResponses[model].length)];
  const words = response.split(' ');
  for (const word of words) {
    await new Promise(r => setTimeout(r, 30 + Math.random() * 50));
    yield word + ' ';
  }
}

// Simulate full response
async function mockSend(model: ModelId, _messages: Message[]): Promise<string> {
  await new Promise(r => setTimeout(r, 500 + Math.random() * 1500));
  return mockResponses[model][Math.floor(Math.random() * mockResponses[model].length)];
}
```

---

## CSS Setup

```css
/* src/styles/index.css */

@import 'tailwindcss';

@theme inline {
  --color-background: #09090b;
  --color-foreground: #fafafa;
  --color-muted: #a1a1aa;
  --color-border: rgba(255, 255, 255, 0.06);
  --color-surface: rgba(255, 255, 255, 0.03);

  --color-model-claude: #00F0FF;
  --color-model-gpt: #22C55E;
  --color-model-gemini: #8B5CF6;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --font-heading: 'Space Grotesk', sans-serif;

  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --duration-fast: 120ms;
  --duration-base: 200ms;
  --duration-slow: 320ms;
}

/* Base */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Glass surface */
.glass-surface {
  background: var(--color-surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
}

/* Model accent borders */
.border-model-claude { border-left-color: var(--color-model-claude); }
.border-model-gpt { border-left-color: var(--color-model-gpt); }
.border-model-gemini { border-left-color: var(--color-model-gemini); }

/* Model accent text */
.text-model-claude { color: var(--color-model-claude); }
.text-model-gpt { color: var(--color-model-gpt); }
.text-model-gemini { color: var(--color-model-gemini); }

/* Model accent backgrounds (subtle) */
.bg-model-claude { background: rgba(0, 240, 255, 0.08); }
.bg-model-gpt { background: rgba(34, 197, 94, 0.08); }
.bg-model-gemini { background: rgba(139, 92, 246, 0.08); }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 3px; }
::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }

/* Typing animation */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.typing-cursor::after {
  content: '▋';
  animation: blink 1s step-end infinite;
  color: var(--color-muted);
}
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd+K` | Open command palette |
| `Cmd+N` | New chat |
| `Cmd+Shift+S` | Toggle sidebar |
| `Cmd+1/2/3` | Quick switch model (Claude/GPT/Gemini) |
| `Enter` | Send message |
| `Shift+Enter` | New line in input |
| `Escape` | Stop generation / close palette |
| `Cmd+E` | Export current chat as markdown |
| `Cmd+Shift+D` | Toggle debug panel (show raw prompts) |

---

## Implementation Order

Build in this order. Each step is independently testable.

### Phase 1 — Skeleton (Day 1)
1. Vite project setup with Tailwind 4.1 and CSS theme
2. `App.tsx` with the 2-column layout (sidebar + main)
3. `ChatShell.tsx` — empty shells for SessionList, MessageList, InputBar
4. Static mock messages rendered in MessageList
5. Basic InputBar with textarea and send button

### Phase 2 — Chat Core (Day 2)
6. `useChat` hook with session state, message appending, localStorage persistence
7. `MessageBubble` with model-colored borders and ModelTag
8. `InputBar` wired to useChat — sending adds a user message
9. Mock API integration — sending a message triggers a mock AI response after delay
10. Auto-scroll to bottom on new messages
11. TypingIndicator animation during generation

### Phase 3 — Orchestration (Day 3)
12. `useOrchestration` hook with mode and model state
13. `ModelPicker` — toggleable pills in InputBar
14. `ModeSelector` — dropdown in InputBar
15. `parallel` mode: send to all active models, show all responses
16. `debate` mode: sequential with round tracking and orchestrator messages
17. `refine` mode: A → B → C sequential pipeline
18. Stop button during active orchestration

### Phase 4 — Templates & Command Palette (Day 4)
19. `PromptTemplate` system with built-in presets
20. Template selector dropdown in InputBar
21. Custom template create/edit modal (Dialog)
22. `CommandPalette` with Cmd+K — search, switch, mode change
23. All keyboard shortcuts wired

### Phase 5 — Sessions & Polish (Day 5)
24. `SessionList` with session history, search, rename, delete
25. Export session as markdown
26. Framer Motion: message entrance animations (fade-up, 120ms stagger)
27. Responsive: sidebar collapses on mobile, full-width chat
28. Empty state for new chats
29. Final visual polish — spacing, typography, transitions

---

## Files to Create (Complete List)

```
crystallize/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── postcss.config.js
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── styles/
│   │   └── index.css
│   ├── lib/
│   │   ├── utils.ts
│   │   ├── models.ts
│   │   └── types.ts
│   ├── hooks/
│   │   ├── useChat.ts
│   │   ├── useOrchestration.ts
│   │   └── useCommandPalette.ts
│   ├── mocks/
│   │   └── mock-responses.ts
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── popover.tsx
│   │   ├── chat/
│   │   │   ├── ChatShell.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── InputBar.tsx
│   │   │   ├── ModelTag.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── orchestration/
│   │   │   ├── ModeSelector.tsx
│   │   │   ├── ModelPicker.tsx
│   │   │   └── PromptTemplate.tsx
│   │   ├── sessions/
│   │   │   ├── SessionList.tsx
│   │   │   └── SessionItem.tsx
│   │   └── command/
│   │       └── CommandPalette.tsx
│   └── contexts/
│       └── ChatContext.tsx
```

---

## What This Plan Does NOT Cover (Intentionally)

- **API integration** — The `LLMAdapter` interface is defined but not implemented. Build this separately.
- **Authentication** — Personal use, no auth needed.
- **Database** — localStorage only. Upgrade to IndexedDB or SQLite later if needed.
- **File sharing between models** — Future feature. For now, models share context through the message history.
- **Markdown rendering** — Use `dangerouslySetInnerHTML` with basic formatting for now. Add a proper renderer (react-markdown) later.
- **Token counting** — Mock values. Add tiktoken integration when API layer is built.

---

## Summary

This is a single-user, frontend-only chat UI that:

1. Presents a clean ChatGPT-like interface with minimal cognitive load
2. Routes messages to one or more frontier LLMs via a pluggable adapter interface
3. Supports 6 orchestration modes (single, parallel, debate, review, refine, custom)
4. Shows AI-to-AI conversations visually in the chat with model-colored indicators
5. Offers prompt engineering control through configurable templates
6. Persists sessions to localStorage
7. Uses Cmd+K command palette for fast actions
8. Runs as a lightweight Vite app with zero backend dependencies

The design metaphor is **knowledge crystallization** — rough ideas enter, polished insight emerges through multi-model refinement. The UI should feel like a calm, premium thinking environment where the user orchestrates intelligence with minimal friction.
