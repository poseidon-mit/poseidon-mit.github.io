/**
 * Command Palette
 * Wires the existing useCommandPalette hook + cmdk primitives into a full UI.
 * Open with Cmd+K / Ctrl+K from anywhere in the app.
 */

import React, { useCallback } from 'react';
import {
  LayoutDashboard,
  Shield,
  TrendingUp,
  Zap,
  Scale,
  CheckSquare,
  FileText,
} from 'lucide-react';
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
    description: 'Review 3 pending approvals',
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

/* ── Component ───────────────────────────────────────────── */

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const { navigate } = useRouter();

  const handleSelect = useCallback(
    (path: string) => {
      onClose();
      navigate(path);
    },
    [navigate, onClose]
  );

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <CommandInput placeholder="Search engines, actions…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Engines">
          {ENGINE_COMMANDS.map((cmd) => {
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
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Quick Actions">
          {ACTION_COMMANDS.map((cmd) => {
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
          })}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
