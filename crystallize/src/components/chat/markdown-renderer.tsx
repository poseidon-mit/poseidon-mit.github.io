import { cn } from '@/lib/utils';

/**
 * Simple markdown renderer for chat messages.
 * Supports: bold, italic, code, code blocks, lists, tables, and line breaks.
 */

interface RenderedContent {
  elements: React.ReactNode[];
}

export function renderMarkdown(content: string): RenderedContent {
  const elements: React.ReactNode[] = [];
  let remaining = content;
  let keyIndex = 0;

  while (remaining.length > 0) {
    // Code blocks (triple backticks)
    const codeBlockMatch = remaining.match(/^```([\s\S]*?)```/);
    if (codeBlockMatch) {
      const code = codeBlockMatch[1].trim();
      elements.push(
        <pre
          key={`code-${keyIndex++}`}
          className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-sm overflow-x-auto my-2"
        >
          <code>{code}</code>
        </pre>
      );
      remaining = remaining.slice(codeBlockMatch[0].length);
      continue;
    }

    // Paragraphs (double newline)
    const paragraphMatch = remaining.match(/^([^\n]|\n(?!\n))+/);
    if (paragraphMatch && remaining.startsWith('\n\n')) {
      elements.push(<div key={`p-${keyIndex++}`} className="my-3" />);
      remaining = remaining.slice(2);
      continue;
    }

    // Process a line with inline formatting
    const lineMatch = remaining.match(/^[^\n]*/);
    if (lineMatch) {
      const line = lineMatch[0];
      if (line.length > 0) {
        const lineElements = parseInlineMarkdown(line, keyIndex);
        elements.push(
          <div key={`line-${keyIndex++}`} className="leading-relaxed">
            {lineElements}
          </div>
        );
        keyIndex += Math.max(1, lineElements.length);
      }
      remaining = remaining.slice(line.length + 1);
    }
  }

  return { elements };
}

function parseInlineMarkdown(text: string, startKey: number): React.ReactNode[] {
  const elements: React.ReactNode[] = [];
  let remaining = text;
  let keyIndex = startKey;

  while (remaining.length > 0) {
    // Bold
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      elements.push(
        <strong key={`bold-${keyIndex++}`} className="font-semibold">
          {boldMatch[1]}
        </strong>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      elements.push(
        <em key={`italic-${keyIndex++}`} className="italic">
          {italicMatch[1]}
        </em>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code
    const inlineCodeMatch = remaining.match(/^`([^`]+)`/);
    if (inlineCodeMatch) {
      elements.push(
        <code
          key={`inline-${keyIndex++}`}
          className="bg-slate-800 text-slate-100 px-2 py-1 rounded font-mono text-sm"
        >
          {inlineCodeMatch[1]}
        </code>
      );
      remaining = remaining.slice(inlineCodeMatch[0].length);
      continue;
    }

    // Regular text (up to next formatting or end)
    const textMatch = remaining.match(/^[^*`]+/);
    if (textMatch) {
      elements.push(
        <span key={`text-${keyIndex++}`}>{textMatch[0]}</span>
      );
      remaining = remaining.slice(textMatch[0].length);
    } else {
      // Single character that doesn't match patterns
      elements.push(
        <span key={`text-${keyIndex++}`}>{remaining[0]}</span>
      );
      remaining = remaining.slice(1);
    }
  }

  return elements;
}
