import React from 'react';

function renderInline(text: string): React.ReactNode[] {
  // Strip any unbalanced/dangling bold markers only when odd-paired at ends
  const cleaned = text.replace(/^\*{3,}|\*{3,}$/g, '');
  // Match **bold**, *italic*, or https:// URLs cleanly
  const tokenRegex = /(\*\*[^*\n]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s)]+)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(cleaned)) !== null) {
    if (match.index > lastIndex) {
      parts.push(cleaned.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={match.index} style={{ fontWeight: 700 }}>
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={match.index} style={{ fontStyle: 'italic' }}>
          {token.slice(1, -1)}
        </em>
      );
    } else if (token.startsWith('http://') || token.startsWith('https://')) {
      const cleanUrl = token.replace(/[.,;!?]+$/, '');
      const trailing = token.slice(cleanUrl.length);
      parts.push(
        <a
          key={match.index}
          href={cleanUrl}
          target="_blank"
          rel="noreferrer"
          style={{
            display: 'inline',
            marginTop: 0,
            color: 'inherit',
            textDecoration: 'underline',
            fontWeight: 600,
            wordBreak: 'break-word',
          }}
        >
          {cleanUrl.replace(/^https?:\/\//, '')}
        </a>
      );
      if (trailing) parts.push(trailing);
    }
    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < cleaned.length) {
    parts.push(cleaned.slice(lastIndex));
  }

  // Remove any leftover stray '**' if malformed
  return parts.map((node) =>
    typeof node === 'string' ? node.replace(/\*\*/g, '') : node
  );
}

export default function ChatMessageText({ text }: { text: string }) {
  const lines = text.split('\n');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {lines.map((rawLine, idx) => {
        const line = rawLine.trimEnd();
        if (!line.trim()) {
          return <div key={idx} style={{ height: 4 }} />;
        }

        // Convert markdown headings (e.g. ### Title) cleanly to bold lines
        const headingMatch = line.match(/^#{1,6}\s+(.*)$/);
        if (headingMatch) {
          return (
            <div key={idx} style={{ fontWeight: 700, marginTop: 2 }}>
              {renderInline(headingMatch[1])}
            </div>
          );
        }

        // Convert bullet lines (- item / * item) cleanly without raw asterisks or hyphens
        const bulletMatch = line.match(/^\s*[-*•]\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 7,
                paddingLeft: 2,
              }}
            >
              <span style={{ opacity: 0.75, fontWeight: 700 }}>•</span>
              <span style={{ flex: 1 }}>{renderInline(bulletMatch[1])}</span>
            </div>
          );
        }

        return <div key={idx}>{renderInline(line)}</div>;
      })}
    </div>
  );
}

