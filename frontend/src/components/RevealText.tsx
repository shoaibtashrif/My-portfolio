import type { CSSProperties } from "react";

/** React-owned text splitting keeps headings readable and avoids DOM mutation. */
export function RevealText({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  let index = offset;
  return (
    <span className="ea-reveal-text">
      <span className="ea-accessible-text">{text}</span>
      <span aria-hidden="true">
        {text.split(" ").map((word, wordIndex) => (
          <span key={`${word}-${wordIndex}`}>
            {wordIndex > 0 ? " " : null}
            <span className="ea-word-mask">
              {Array.from(word).map((character, characterIndex) => (
                <span
                  key={characterIndex}
                  className="ea-reveal-glyph"
                  style={{ "--glyph-index": index++ } as CSSProperties}
                >
                  {character}
                </span>
              ))}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}
