import React, {
  createContext,
  useReducer,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import type {
  Session,
  Message,
  ModelId,
  OrchestrationMode,
  PromptTemplate,
  OrchestratorConfig,
} from '@/lib/types';
import { generateId, truncate } from '@/lib/utils';
import { mockStream, mockSend } from '@/mocks/mock-responses';
import { BUILT_IN_TEMPLATES, getTemplateById } from '@/lib/templates';

interface ChatContextType {
  // Session state
  sessions: Session[];
  activeSessionId: string | null;
  activeSession: Session | undefined;

  // Orchestration state
  config: OrchestratorConfig;
  templates: PromptTemplate[];
  customTemplates: PromptTemplate[];

  // UI state
  isGenerating: boolean;

  // Actions
  createSession(): void;
  switchSession(id: string): void;
  deleteSession(id: string): void;
  renameSession(id: string, title: string): void;
  sendMessage(content: string): Promise<void>;
  stopGeneration(): void;
  exportSession(id: string): string;

  // Orchestration actions
  setMode(mode: OrchestrationMode): void;
  toggleModel(modelId: ModelId): void;
  applyTemplate(templateId: string): void;
  saveTemplate(template: Omit<PromptTemplate, 'isBuiltIn'>): void;
  deleteTemplate(id: string): void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatState {
  sessions: Session[];
  activeSessionId: string | null;
  config: OrchestratorConfig;
  templates: PromptTemplate[];
  customTemplates: PromptTemplate[];
  isGenerating: boolean;
  abortController: AbortController | null;
}

type ChatAction =
  | { type: 'CREATE_SESSION'; payload: Session }
  | { type: 'SWITCH_SESSION'; payload: string }
  | { type: 'DELETE_SESSION'; payload: string }
  | { type: 'RENAME_SESSION'; payload: { id: string; title: string } }
  | { type: 'ADD_MESSAGE'; payload: { sessionId: string; message: Message } }
  | { type: 'REPLACE_MESSAGES'; payload: { sessionId: string; messages: Message[] } }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_MODE'; payload: OrchestrationMode }
  | { type: 'TOGGLE_MODEL'; payload: ModelId }
  | { type: 'APPLY_TEMPLATE'; payload: PromptTemplate }
  | { type: 'SAVE_TEMPLATE'; payload: PromptTemplate }
  | { type: 'DELETE_TEMPLATE'; payload: string }
  | { type: 'SET_ABORT_CONTROLLER'; payload: AbortController | null }
  | { type: 'LOAD_FROM_STORAGE'; payload: ChatState };

const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  config: {
    mode: 'single',
    activeModels: ['claude'],
  },
  templates: BUILT_IN_TEMPLATES,
  customTemplates: [],
  isGenerating: false,
  abortController: null,
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'CREATE_SESSION': {
      const newSessions = [...state.sessions, action.payload];
      return {
        ...state,
        sessions: newSessions,
        activeSessionId: action.payload.id,
      };
    }

    case 'SWITCH_SESSION':
      return {
        ...state,
        activeSessionId: action.payload,
      };

    case 'DELETE_SESSION': {
      const newSessions = state.sessions.filter(s => s.id !== action.payload);
      const newActiveId =
        state.activeSessionId === action.payload
          ? newSessions[0]?.id ?? null
          : state.activeSessionId;
      return {
        ...state,
        sessions: newSessions,
        activeSessionId: newActiveId,
      };
    }

    case 'RENAME_SESSION': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.id
            ? { ...s, title: action.payload.title, updatedAt: Date.now() }
            : s,
        ),
      };
    }

    case 'ADD_MESSAGE': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                messages: [...s.messages, action.payload.message],
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    }

    case 'REPLACE_MESSAGES': {
      return {
        ...state,
        sessions: state.sessions.map(s =>
          s.id === action.payload.sessionId
            ? {
                ...s,
                messages: action.payload.messages,
                updatedAt: Date.now(),
              }
            : s,
        ),
      };
    }

    case 'SET_GENERATING':
      return {
        ...state,
        isGenerating: action.payload,
      };

    case 'SET_MODE': {
      const newConfig = {
        ...state.config,
        mode: action.payload,
      };
      return {
        ...state,
        config: newConfig,
      };
    }

    case 'TOGGLE_MODEL': {
      const newModels = state.config.activeModels.includes(action.payload)
        ? state.config.activeModels.filter(m => m !== action.payload)
        : [...state.config.activeModels, action.payload];

      return {
        ...state,
        config: {
          ...state.config,
          activeModels: newModels,
        },
      };
    }

    case 'APPLY_TEMPLATE': {
      return {
        ...state,
        config: {
          mode: action.payload.mode,
          activeModels: action.payload.models,
          rounds: action.payload.rounds,
          systemPrompt: action.payload.systemPrompt,
          outputFormat: action.payload.outputFormat,
        },
      };
    }

    case 'SAVE_TEMPLATE': {
      return {
        ...state,
        customTemplates: [...state.customTemplates, action.payload],
      };
    }

    case 'DELETE_TEMPLATE': {
      return {
        ...state,
        customTemplates: state.customTemplates.filter(t => t.id !== action.payload),
      };
    }

    case 'SET_ABORT_CONTROLLER':
      return {
        ...state,
        abortController: action.payload,
      };

    case 'LOAD_FROM_STORAGE':
      return action.payload;

    default:
      return state;
  }
}

interface ChatProviderProps {
  children: ReactNode;
}

export function ChatProvider({ children }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('crystallize:chat-state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatState;
        // Ensure templates are always present
        parsed.templates = BUILT_IN_TEMPLATES;
        dispatch({ type: 'LOAD_FROM_STORAGE', payload: parsed });
      } catch (e) {
        console.error('Failed to load chat state from localStorage', e);
      }
    } else {
      // Create initial empty session
      const initialSession: Session = {
        id: generateId(),
        title: 'New chat',
        messages: [],
        models: ['claude'],
        mode: 'single',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      dispatch({ type: 'CREATE_SESSION', payload: initialSession });
    }
  }, []);

  // Persist to localStorage (debounced)
  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      const stateToSave: Omit<ChatState, 'abortController'> = {
        sessions: state.sessions,
        activeSessionId: state.activeSessionId,
        config: state.config,
        templates: state.templates,
        customTemplates: state.customTemplates,
        isGenerating: false,
      };
      localStorage.setItem('crystallize:chat-state', JSON.stringify(stateToSave));
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state]);

  const activeSession = state.sessions.find(s => s.id === state.activeSessionId);

  const createSession = useCallback(() => {
    const newSession: Session = {
      id: generateId(),
      title: 'New chat',
      messages: [],
      models: state.config.activeModels,
      mode: state.config.mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    dispatch({ type: 'CREATE_SESSION', payload: newSession });
  }, [state.config]);

  const switchSession = useCallback((id: string) => {
    dispatch({ type: 'SWITCH_SESSION', payload: id });
  }, []);

  const deleteSession = useCallback((id: string) => {
    dispatch({ type: 'DELETE_SESSION', payload: id });
  }, []);

  const renameSession = useCallback((id: string, title: string) => {
    dispatch({ type: 'RENAME_SESSION', payload: { id, title } });
  }, []);

  const stopGeneration = useCallback(() => {
    if (state.abortController) {
      state.abortController.abort();
    }
    dispatch({ type: 'SET_GENERATING', payload: false });
    dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
  }, [state.abortController]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeSession || state.isGenerating) return;

      // Add user message
      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId: activeSession.id, message: userMessage } });

      // Generate session title from first message if needed
      if (activeSession.title === 'New chat') {
        const title = truncate(content, 40);
        dispatch({ type: 'RENAME_SESSION', payload: { id: activeSession.id, title } });
      }

      dispatch({ type: 'SET_GENERATING', payload: true });
      const abortController = new AbortController();
      dispatch({ type: 'SET_ABORT_CONTROLLER', payload: abortController });

      try {
        // Process based on orchestration mode
        if (state.config.mode === 'single') {
          await generateSingleResponse(activeSession.id, userMessage, state.config.activeModels[0]);
        } else if (state.config.mode === 'parallel') {
          await generateParallelResponses(activeSession.id, userMessage, state.config.activeModels);
        } else if (state.config.mode === 'debate') {
          await generateDebateResponses(
            activeSession.id,
            userMessage,
            state.config.activeModels,
            state.config.rounds || 1,
          );
        } else if (state.config.mode === 'review') {
          await generateReviewResponses(activeSession.id, userMessage, state.config.activeModels);
        } else if (state.config.mode === 'refine') {
          await generateRefineResponses(activeSession.id, userMessage, state.config.activeModels);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Error generating response:', error);
        }
      } finally {
        dispatch({ type: 'SET_GENERATING', payload: false });
        dispatch({ type: 'SET_ABORT_CONTROLLER', payload: null });
      }
    },
    [activeSession, state.isGenerating, state.config.mode, state.config.activeModels, state.config.rounds],
  );

  const generateSingleResponse = async (sessionId: string, userMessage: Message, model: ModelId) => {
    const messages = activeSession?.messages || [];
    let content = '';

    for await (const chunk of mockStream(model, messages)) {
      content += chunk;
      // Optionally update message in real-time (streaming effect)
    }

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      model,
      content,
      timestamp: Date.now(),
      replyTo: userMessage.id,
      meta: {
        mode: state.config.mode,
      },
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: assistantMessage } });
  };

  const generateParallelResponses = async (
    sessionId: string,
    userMessage: Message,
    models: ModelId[],
  ) => {
    const messages = activeSession?.messages || [];

    const responses = await Promise.all(
      models.map(async model => {
        let content = '';
        for await (const chunk of mockStream(model, messages)) {
          content += chunk;
        }
        return { model, content };
      }),
    );

    for (const { model, content } of responses) {
      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        model,
        content,
        timestamp: Date.now(),
        replyTo: userMessage.id,
        meta: {
          mode: state.config.mode,
        },
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: assistantMessage } });
    }
  };

  const generateDebateResponses = async (
    sessionId: string,
    userMessage: Message,
    models: ModelId[],
    rounds: number,
  ) => {
    let conversationMessages = activeSession?.messages || [];

    for (let round = 0; round < rounds; round++) {
      // Add orchestrator message
      const orchestratorMessage: Message = {
        id: generateId(),
        role: 'orchestrator',
        content: `Round ${round + 1} of ${rounds}`,
        timestamp: Date.now(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: orchestratorMessage } });
      conversationMessages = [...conversationMessages, orchestratorMessage];

      // Each model responds sequentially
      for (const model of models) {
        let content = '';
        for await (const chunk of mockStream(model, conversationMessages)) {
          content += chunk;
        }

        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          model,
          content,
          timestamp: Date.now(),
          replyTo: round === 0 ? userMessage.id : undefined,
          meta: {
            mode: state.config.mode,
          },
        };

        dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: assistantMessage } });
        conversationMessages = [...conversationMessages, assistantMessage];
      }
    }
  };

  const generateReviewResponses = async (
    sessionId: string,
    userMessage: Message,
    models: ModelId[],
  ) => {
    const messages = activeSession?.messages || [];

    if (models.length === 0) return;

    // First model drafts
    const draftModel = models[0];
    let draftContent = '';
    for await (const chunk of mockStream(draftModel, messages)) {
      draftContent += chunk;
    }

    const draftMessage: Message = {
      id: generateId(),
      role: 'assistant',
      model: draftModel,
      content: draftContent,
      timestamp: Date.now(),
      replyTo: userMessage.id,
      meta: {
        mode: state.config.mode,
      },
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: draftMessage } });

    // Other models review
    const reviewMessages = [...messages, draftMessage];

    for (let i = 1; i < models.length; i++) {
      const model = models[i];
      let reviewContent = '';
      for await (const chunk of mockStream(model, reviewMessages)) {
        reviewContent += chunk;
      }

      const reviewMessage: Message = {
        id: generateId(),
        role: 'assistant',
        model,
        content: reviewContent,
        timestamp: Date.now(),
        replyTo: draftMessage.id,
        meta: {
          mode: state.config.mode,
        },
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: reviewMessage } });
    }
  };

  const generateRefineResponses = async (
    sessionId: string,
    userMessage: Message,
    models: ModelId[],
  ) => {
    let conversationMessages = activeSession?.messages || [];

    for (let i = 0; i < models.length; i++) {
      const model = models[i];
      let content = '';

      for await (const chunk of mockStream(model, conversationMessages)) {
        content += chunk;
      }

      const assistantMessage: Message = {
        id: generateId(),
        role: 'assistant',
        model,
        content,
        timestamp: Date.now(),
        replyTo: i === 0 ? userMessage.id : undefined,
        meta: {
          mode: state.config.mode,
        },
      };

      dispatch({ type: 'ADD_MESSAGE', payload: { sessionId, message: assistantMessage } });
      conversationMessages = [...conversationMessages, assistantMessage];
    }
  };

  const exportSession = useCallback(
    (id: string): string => {
      const session = state.sessions.find(s => s.id === id);
      if (!session) return '';

      let markdown = `# ${session.title}\n\n`;
      markdown += `**Mode:** ${session.mode}\n`;
      markdown += `**Models:** ${session.models.join(', ')}\n`;
      markdown += `**Created:** ${new Date(session.createdAt).toLocaleString()}\n\n`;
      markdown += '---\n\n';

      for (const message of session.messages) {
        if (message.role === 'user') {
          markdown += `**You:**\n\n${message.content}\n\n`;
        } else if (message.role === 'assistant') {
          markdown += `**${message.model} (${message.role}):**\n\n${message.content}\n\n`;
        } else if (message.role === 'orchestrator') {
          markdown += `*${message.content}*\n\n`;
        }
      }

      return markdown;
    },
    [state.sessions],
  );

  const setMode = useCallback((mode: OrchestrationMode) => {
    dispatch({ type: 'SET_MODE', payload: mode });
  }, []);

  const toggleModel = useCallback((modelId: ModelId) => {
    dispatch({ type: 'TOGGLE_MODEL', payload: modelId });
  }, []);

  const applyTemplate = useCallback((templateId: string) => {
    const template = getTemplateById(templateId) || state.customTemplates.find(t => t.id === templateId);
    if (template) {
      dispatch({ type: 'APPLY_TEMPLATE', payload: template });
    }
  }, [state.customTemplates]);

  const saveTemplate = useCallback((template: Omit<PromptTemplate, 'isBuiltIn'>) => {
    const fullTemplate: PromptTemplate = {
      ...template,
      isBuiltIn: false,
    };
    dispatch({ type: 'SAVE_TEMPLATE', payload: fullTemplate });
  }, []);

  const deleteTemplate = useCallback((id: string) => {
    dispatch({ type: 'DELETE_TEMPLATE', payload: id });
  }, []);

  const value: ChatContextType = {
    sessions: state.sessions,
    activeSessionId: state.activeSessionId,
    activeSession,
    config: state.config,
    templates: state.templates,
    customTemplates: state.customTemplates,
    isGenerating: state.isGenerating,
    createSession,
    switchSession,
    deleteSession,
    renameSession,
    sendMessage,
    stopGeneration,
    exportSession,
    setMode,
    toggleModel,
    applyTemplate,
    saveTemplate,
    deleteTemplate,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatContext(): ChatContextType {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatProvider');
  }
  return context;
}
