import { ChatProvider, useChatContext } from '@/contexts/ChatContext';
import { ChatShell, MessageList, InputBar } from '@/components/chat';
import { SessionList } from '@/components/sessions';
import { CommandPalette } from '@/components/command';
import { useCommandPalette } from '@/hooks/useCommandPalette';
import { TooltipProvider } from '@/components/ui';

function AppContent() {
  const {
    sessions,
    activeSessionId,
    activeSession,
    isGenerating,
    config,
    templates,
    customTemplates,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    sendMessage,
    stopGeneration,
    setMode,
    toggleModel,
    applyTemplate,
  } = useChatContext();

  const { isOpen, close: closePalette } = useCommandPalette();

  const allTemplates = [...templates, ...customTemplates];

  function handleCommandAction(action: string, payload?: any) {
    switch (action) {
      case 'new-chat':
        createSession();
        break;
      case 'switch-model':
        if (payload) toggleModel(payload);
        break;
      case 'set-mode':
        if (payload) setMode(payload);
        break;
      default:
        break;
    }
    closePalette();
  }

  const sidebar = (
    <SessionList
      sessions={sessions}
      activeSessionId={activeSessionId}
      onSelect={switchSession}
      onCreate={createSession}
      onDelete={deleteSession}
      onRename={renameSession}
    />
  );

  return (
    <ChatShell sidebar={sidebar}>
      <div className="flex flex-col h-full">
        <div className="flex-1 min-h-0 overflow-hidden">
          <MessageList
            messages={activeSession?.messages ?? []}
            isGenerating={isGenerating}
            generatingModels={isGenerating ? config.activeModels : undefined}
          />
        </div>
        <div className="shrink-0 border-t border-white/[0.06] bg-[#09090b]">
          <div className="mx-auto max-w-[800px] px-4 py-3">
            <InputBar
              onSend={sendMessage}
              onStop={stopGeneration}
              isGenerating={isGenerating}
              activeModels={config.activeModels}
              onToggleModel={toggleModel}
              mode={config.mode}
              onModeChange={setMode}
              templates={allTemplates}
              onApplyTemplate={applyTemplate}
            />
          </div>
        </div>
      </div>
      <CommandPalette
        isOpen={isOpen}
        onClose={closePalette}
        onAction={handleCommandAction}
      />
    </ChatShell>
  );
}

export default function App() {
  return (
    <TooltipProvider>
      <ChatProvider>
        <AppContent />
      </ChatProvider>
    </TooltipProvider>
  );
}
