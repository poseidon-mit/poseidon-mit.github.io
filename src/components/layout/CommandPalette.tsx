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
import { useRouter } from '../../router';
import { DEMO_THREAD } from '@/lib/demo-thread';

/* ── Helpers ──────────────────────────────────────────────── */

/** Build a view-mode path relative to the current page. */
function resolveViewModePath(currentPath: string, viewMode: string): string {
  // Only apply to engine pages
  const enginePrefixes = ['/protect', '/grow', '/execute', '/govern', '/dashboard'];
  const base = enginePrefixes.find((p) => currentPath === p || currentPath.startsWith(p + '/'));
  if (base) return `${base}?view=${viewMode}`;
  return currentPath;
}

/* ── Command definitions ─────────────────────────────────── */

interface Command {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  color: string;
  path: string;
  shortcut?: string;
}

const ENGINE_COMMANDS: Command[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    description: 'System overview',
    icon: LayoutDashboard,
    color: '#00F0FF',
    path: '/dashboard',
  },
  {
    id: 'protect',
    label: 'Protect',
    description: 'Risk & threat detection',
    icon: Shield,
    color: '#22C55E',
    path: '/protect',
  },
  {
    id: 'grow',
    label: 'Grow',
    description: 'Goals & forecasts',
    icon: TrendingUp,
    color: '#8B5CF6',
    path: '/grow',
  },
  {
    id: 'execute',
    label: 'Execute',
    description: 'Approval queue',
    icon: Zap,
    color: '#EAB308',
    path: '/execute',
  },
  {
    id: 'govern',
    label: 'Govern',
    description: 'Audit & compliance',
    icon: Scale,
    color: '#3B82F6',
    path: '/govern',
  },
];

const ACTION_COMMANDS: Command[] = [
  {
    id: 'approve-pending',
    label: 'Approve Pending Actions',
    description: `Review ${DEMO_THREAD.pendingActions} pending approvals`,
    icon: CheckSquare,
    color: '#EAB308',
    path: '/execute/approval',
    shortcut: '⌘E',
  },
  {
    id: 'view-audit',
    label: 'View Audit Ledger',
    description: 'Review recent audit entries',
    icon: FileText,
    color: '#3B82F6',
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
    color: '#22C55E',
    path: '/protect?view=glance&mode=present',
  },
  {
    id: 'present-grow',
    label: 'Present: Grow',
    description: 'Start presentation at Grow engine',
    icon: Presentation,
    color: '#8B5CF6',
    path: '/grow?view=glance&mode=present',
  },
  {
    id: 'present-execute',
    label: 'Present: Execute',
    description: 'Start presentation at Execute engine',
    icon: Presentation,
    color: '#EAB308',
    path: '/execute?view=glance&mode=present',
  },
  {
    id: 'present-govern',
    label: 'Present: Govern',
    description: 'Start presentation at Govern engine',
    icon: Presentation,
    color: '#3B82F6',
    path: '/govern?view=glance&mode=present',
  },
];

const VIEW_MODE_COMMANDS: { id: string; label: string; description: string; icon: React.ElementType; color: string; viewMode: string }[] = [
  {
    id: 'view-glance',
    label: 'Switch to Glance',
    description: 'Minimal KPI overview',
    icon: Eye,
    color: '#14B8A6',
    viewMode: 'glance',
  },
  {
    id: 'view-detail',
    label: 'Switch to Detail',
    description: 'Standard working view',
    icon: LayoutGrid,
    color: '#14B8A6',
    viewMode: 'detail',
  },
  {
    id: 'view-deep',
    label: 'Switch to Deep',
    description: 'Full analysis with methodology',
    icon: Database,
    color: '#14B8A6',
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
      return (
        <CommandItem
          key={cmd.id}
          value={`${cmd.label} ${cmd.description}`}
          onSelect={() => handleSelect(cmd.path)}
          className="gap-3"
        >
          <span
            className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
            style={{ background: `${cmd.color}1a` }}
          >
            <Icon className="w-4 h-4" style={{ color: cmd.color }} aria-hidden="true" />
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
      <div className="flex items-center">
        <CommandInput
          placeholder={isListening ? 'Listening…' : 'Search engines, actions, presentations…'}
          value={searchValue}
          onValueChange={setSearchValue}
        />
        {isSupported && (
          <button
            onClick={isListening ? stopListening : startListening}
            className="mr-3 flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
            style={{
              background: isListening ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)',
              color: isListening ? '#EF4444' : '#64748B',
            }}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
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
            return (
              <CommandItem
                key={cmd.id}
                value={`${cmd.label} ${cmd.description}`}
                onSelect={() => handleSelect(resolveViewModePath(path, cmd.viewMode))}
                className="gap-3"
              >
                <span
                  className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0"
                  style={{ background: `${cmd.color}1a` }}
                >
                  <Icon className="w-4 h-4" style={{ color: cmd.color }} aria-hidden="true" />
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
