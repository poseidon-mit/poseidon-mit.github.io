/**
 * useSimulatedChat — Chat state hook with fake streaming
 *
 * useReducer-based state machine. Simulates AI streaming by revealing
 * response text character-by-character with configurable delay.
 */
import { useReducer, useCallback, useRef, useEffect } from 'react'
import type { ChatMessage, CardPayload } from './types'
import { generateResponse } from './simulated-engine'

interface State {
  messages: ChatMessage[]
  isStreaming: boolean
  streamingText: string
  streamingCards: CardPayload[]
  toolCallLabel: string | null
}

type Action =
  | { type: 'ADD_USER_MSG'; content: string }
  | { type: 'START_TOOL_CALL'; label: string }
  | { type: 'START_STREAMING'; fullText: string; cards: CardPayload[] }
  | { type: 'STREAM_TICK'; text: string }
  | { type: 'STREAM_DONE' }
  | { type: 'CLEAR' }

function createId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_USER_MSG':
      return {
        ...state,
        messages: [...state.messages, {
          id: createId(),
          role: 'user',
          content: action.content,
          timestamp: Date.now(),
        }],
      }
    case 'START_TOOL_CALL':
      return {
        ...state,
        isStreaming: true,
        toolCallLabel: action.label,
        streamingText: '',
        streamingCards: [],
      }
    case 'START_STREAMING':
      return {
        ...state,
        toolCallLabel: null,
        streamingText: '',
        streamingCards: action.cards,
      }
    case 'STREAM_TICK':
      return { ...state, streamingText: action.text }
    case 'STREAM_DONE':
      return {
        ...state,
        isStreaming: false,
        streamingText: '',
        streamingCards: [],
        toolCallLabel: null,
        messages: [...state.messages, {
          id: createId(),
          role: 'assistant',
          content: state.streamingText,
          cards: state.streamingCards.length > 0 ? state.streamingCards : undefined,
          timestamp: Date.now(),
        }],
      }
    case 'CLEAR':
      return { messages: [], isStreaming: false, streamingText: '', streamingCards: [], toolCallLabel: null }
    default:
      return state
  }
}

const CHAR_DELAY_MS = 12
const TOOL_CALL_DELAY_MS = 800

export function useSimulatedChat() {
  const [state, dispatch] = useReducer(reducer, {
    messages: [],
    isStreaming: false,
    streamingText: '',
    streamingCards: [],
    toolCallLabel: null,
  })

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const send = useCallback((content: string) => {
    if (!content.trim() || state.isStreaming) return

    dispatch({ type: 'ADD_USER_MSG', content: content.trim() })

    const response = generateResponse(content)

    // Phase 1: Tool call indicator (if applicable)
    if (response.toolCallLabel) {
      dispatch({ type: 'START_TOOL_CALL', label: response.toolCallLabel })
      timeoutRef.current = setTimeout(() => {
        startStreaming(response.text, response.cards)
      }, TOOL_CALL_DELAY_MS)
    } else {
      dispatch({ type: 'START_TOOL_CALL', label: 'Thinking' })
      timeoutRef.current = setTimeout(() => {
        startStreaming(response.text, response.cards)
      }, 400)
    }

    function startStreaming(fullText: string, cards: CardPayload[]) {
      dispatch({ type: 'START_STREAMING', fullText, cards })

      let i = 0
      intervalRef.current = setInterval(() => {
        i++
        if (i >= fullText.length) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          dispatch({ type: 'STREAM_TICK', text: fullText })
          // Small delay before finalizing to show complete text
          timeoutRef.current = setTimeout(() => {
            dispatch({ type: 'STREAM_DONE' })
          }, 100)
          return
        }
        dispatch({ type: 'STREAM_TICK', text: fullText.slice(0, i) })
      }, CHAR_DELAY_MS)
    }
  }, [state.isStreaming])

  const clear = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    dispatch({ type: 'CLEAR' })
  }, [])

  return {
    messages: state.messages,
    isStreaming: state.isStreaming,
    streamingText: state.streamingText,
    streamingCards: state.streamingCards,
    toolCallLabel: state.toolCallLabel,
    send,
    clear,
  }
}
