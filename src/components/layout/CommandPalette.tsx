/**
 * Command Palette
 * Wires the existing useCommandPalette hook + cmdk primitives into a full UI.
 * Open with Cmd+K / Ctrl+K from anywhere in the app.
 */

import React, { useCallback, useState } from 'react';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  CheckSquare,
  FileText,
  Presentation,
  Eye,
  LayoutGrid,
  Database,
  Mic,
  MicOff,
  type LucideIcon,
} from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { Button } from '@/design-system';
import { useRouter } from '../../router';
import { DEMO_THREAD } from '@/lib/demo-thread';
import { cn } from '@/lib/utils';

/* ── Helpers ──────────────────────────────────────────────── */

/** Build a view-mode path relative to the current page. */
function resolveViewModePath(currentPath: string, viewMode: string): string {
  // Only apply to engine pages
  const enginePrefixes = ['/protect', '/grow', '/execute', '/govern', '/dashboard'];
  const base = enginePrefixes.find((p) => currentPath === p || currentPath.startsWith(p + '/'));
  if (base) return `${base}?view=${viewMode}`;
  return currentPath;
}

type CommandTone = 'dashboard' | 'protect' | 'grow' | 'execute' | 'govern' | 'view';

const TONE_CLASSES: Record<CommandTone, { chip: string; icon: string }> = {
  dashboard: { chip: 'bg-cyan-500/15', icon: 'text-cyan-300' },
  protect: { chip: 'bg-green-500/15', icon: 'text-green-300' },
  grow: { chip: 'bg-violet-500/15', icon: 'text-violet-300' },
  execute: { chip: 'bg-amber-500/15', icon: 'text-amber-300' },
  govern: { chip: 'bg-blue-500/15', icon: 'text-blue-300' },
  view: { chip: 'bg-teal-500/15', icon: 'text-teal-300' },
};

/* ── Command definitions ─────────────────────────────────── */

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: LucideIcon;
  tone: CommandTone;
  path: string;
  shortcut?: string;
}

const ENGINE_COMMANDS: Command[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'System overview',
    icon: LayoutDashboard,
    tone: 'dashboard',
    path: '/dashboard',
  },
  {
    id: 'protect',
    label: 'Protect',
    description: 'Risk & threat detection',
    icon: Shield,
    tone: 'protect',
    path: '/protect',
  },
  {
    id: 'grow',
    label: 'Grow',
    description: 'Goals & forecasts',
    icon: TrendingUp,
    tone: 'grow',
    path: '/grow',
  },
  {
    id: 'execute',
    label: 'Execute',
    description: 'Approval queue',
    icon: Zap,
    tone: 'execute',
    path: '/execute',
  },
  {
    id: 'govern',
    label: 'Govern',
    description: 'Audit & compliance',
    icon: Scale,
    tone: 'govern',
    path: '/govern',
  },
];

const ACTION_COMMANDS: Command[] = [
  {
    id: 'approve-pending',
    label: 'Approve Pending Actions',
    description: `Review ${DEMO_THREAD.pendingActions} pending approvals`,
    icon: CheckSquare,
    tone: 'execute',
    path: '/execute/approval',
    shortcut: '⌘E',
  },
  {
    id: 'view-audit',
    label: 'View Audit Ledger',
    description: 'Review recent audit entries',
    icon: FileText,
    tone: 'govern',
    path: '/govern/audit',
    shortcut: '⌘G',
  },
];

const PRESENTATION_COMMANDS: Command[] = [
  {
    id: 'present-protect',
    label: 'Present: Protect',
    description: 'Start presentation at Protect engine',
    icon: Presentation,
    tone: 'protect',
    path: '/protect?view=glance&mode=present',
  },
  {
    id: 'present-grow',
    label: 'Present: Grow',
    description: 'Start presentation at Grow engine',
    icon: Presentation,
    tone: 'grow',
    path: '/grow?view=glance&mode=present',
  },
  {
    id: 'present-execute',
    label: 'Present: Execute',
    description: 'Start presentation at Execute engine',
    icon: Presentation,
    tone: 'execute',
    path: '/execute?view=glance&mode=present',
  },
  {
    id: 'present-govern',
    label: 'Present: Govern',
    description: 'Start presentation at Govern engine',
    icon: Presentation,
    tone: 'govern',
    path: '/govern?view=glance&mode=present',
  },
];

const VIEW_MODE_COMMANDS: { id: string; label: string; description: string; icon: LucideIcon; tone: CommandTone; viewMode: string }[] = [
  {
    id: 'view-glance',
    label: 'Switch to Glance',
    description: 'Minimal KPI overview',
    icon: Eye,
    tone: 'view',
    viewMode: 'glance',
  },
  {
    id: 'view-detail',
    label: 'Switch to Detail',
    description: 'Standard working view',
    icon: LayoutGrid,
    tone: 'view',
    viewMode: 'detail',
  },
  {
    id: 'view-deep',
    label: 'Switch to Deep',
    description: 'Full analysis with methodology',
    icon: Database,
    tone: 'view',
    viewMode: 'deep',
  },
];

/* ── Component ───────────────────────────────────────────── */

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { navigate, path } = useRouter();
  const { isListening, startListening, stopListening, isSupported } = useVoiceInput();
  const [searchValue, setSearchValue] = useState('');

  const handleSelect = useCallback(
    (navPath: string) => {
      if (isListening) stopListening();
      onClose();
      navigate(navPath);
    },
    [navigate, onClose, isListening, stopListening]
  );

  const renderCommandGroup = (commands: Command[]) =>
    commands.map((cmd) => {
      const Icon = cmd.icon;
      const tone = TONE_CLASSES[cmd.tone];
      return (
        <CommandItem
          key={cmd.id}
          value={`${cmd.label} ${cmd.description}`}
          onSelect={() => handleSelect(cmd.path)}
          className="gap-3"
        >
          <span className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg', tone.chip)}>
            <Icon className={cn('h-4 w-4', tone.icon)} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-medium">{cmd.label}</span>
            {cmd.description && (
              <span className="block text-xs opacity-50">{cmd.description}</span>
            )}
          </span>
          {cmd.shortcut && <CommandShortcut>{cmd.shortcut}</CommandShortcut>}
        </CommandItem>
      );
    });

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => { if (!open) { if (isListening) stopListening(); setSearchValue(''); onClose(); } }}>
      <div className="flex items-center border-b border-white/5 px-2">
        <CommandInput
          placeholder={isListening ? 'Listening…' : 'Search engines, actions, presentations…'}
          value={searchValue}
          onValueChange={setSearchValue}
        />
        {isSupported && (
          <Button
            onClick={isListening ? stopListening : startListening}
            className={cn(
              'mr-3 !h-8 !min-h-8 !w-8 !rounded-lg !px-0',
              isListening
                ? 'border border-red-400/40 bg-red-500/20 text-red-300'
                : 'bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300',
            )}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            variant="ghost"
            size="sm"
            springPress={false}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Engines">
          {renderCommandGroup(ENGINE_COMMANDS)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {renderCommandGroup(ACTION_COMMANDS)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Presentation">
          {renderCommandGroup(PRESENTATION_COMMANDS)}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="View Mode">
          {VIEW_MODE_COMMANDS.map((cmd) => {
            const Icon = cmd.icon;
            const tone = TONE_CLASSES[cmd.tone];
            return (
              <CommandItem
                key={cmd.id}
                value={`${cmd.label} ${cmd.description}`}
                onSelect={() => handleSelect(resolveViewModePath(path, cmd.viewMode))}
                className="gap-3"
              >
                <span className={cn('flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg', tone.chip)}>
                  <Icon className={cn('h-4 w-4', tone.icon)} aria-hidden="true" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{cmd.label}</span>
                  {cmd.description && (
                    <span className="block text-xs opacity-50">{cmd.description}</span>
                  )}
                </span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
