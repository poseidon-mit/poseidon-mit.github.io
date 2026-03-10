/**
 * Talk your money — State Machine Hook
 *
 * useReducer-based state machine for the conversational interface.
 */
import { useReducer, useCallback, useEffect, useMemo } from 'react'
import { useRouter } from '@/router'
import type { TalkToMoneyState, TalkToMoneyEvent, Message, RouteContext } from './types'
import { resolveRouteContext, getCannedResponse } from './route-context'

interface State {
  machineState: TalkToMoneyState
  messages: Message[]
  routeContext: RouteContext | null
}

function createMessage(role: 'user' | 'assistant', content: string): Message {
  return { id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, role, content, timestamp: Date.now() }
}

function reducer(state: State, event: TalkToMoneyEvent): State {
  switch (event.type) {
    case 'OPEN': {
      if (state.machineState !== 'idle') return state
      const greeting = getCannedResponse(state.routeContext)
      return {
        ...state,
        machineState: 'desktop-panel',
        messages: state.messages.length === 0
          ? [createMessage('assistant', greeting)]
          : state.messages,
      }
    }
    case 'CLOSE':
      return { ...state, machineState: 'idle' }
    case 'SEND_MESSAGE': {
      const userMsg = createMessage('user', event.content)
      const response = getCannedResponse(state.routeContext)
      const assistantMsg = createMessage('assistant', response)
      return {
        ...state,
        machineState: 'follow-up',
        messages: [...state.messages, userMsg, assistantMsg],
      }
    }
    case 'RESPONSE_COMPLETE':
      return { ...state, machineState: 'follow-up' }
    case 'ROUTE_CHANGE':
      return {
        ...state,
        routeContext: event.context,
        // Reset messages on route change for fresh context
        messages: [],
        machineState: state.machineState === 'idle' ? 'idle' : state.machineState,
      }
    default:
      return state
  }
}

export function useTalkToMoney() {
  const { path, search } = useRouter()

  const initialContext = useMemo(() => resolveRouteContext(path, search), [])

  const [state, dispatch] = useReducer(reducer, {
    machineState: 'idle',
    messages: [],
    routeContext: initialContext,
  })

  // Update context on route changes
  useEffect(() => {
    const context = resolveRouteContext(path, search)
    dispatch({ type: 'ROUTE_CHANGE', context })
  }, [path, search])

  const open = useCallback(() => dispatch({ type: 'OPEN' }), [])
  const close = useCallback(() => dispatch({ type: 'CLOSE' }), [])
  const send = useCallback((content: string) => {
    if (content.trim()) dispatch({ type: 'SEND_MESSAGE', content: content.trim() })
  }, [])

  return {
    state: state.machineState,
    messages: state.messages,
    routeContext: state.routeContext,
    isOpen: state.machineState !== 'idle',
    hasContext: state.routeContext !== null && state.routeContext.decisionId !== undefined,
    open,
    close,
    send,
  }
}
