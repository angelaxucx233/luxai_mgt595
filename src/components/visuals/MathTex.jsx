import katex from 'katex';
import 'katex/dist/katex.min.css';

/** Render a LaTeX string. Falls back to plain text if it fails to parse. */
export default function MathTex({ tex, block = false, className = '' }) {
  let html;
  try {
    html = katex.renderToString(tex, { displayMode: block, throwOnError: false, strict: false });
  } catch {
    return <span className={className}>{tex}</span>;
  }
  return (
    <span
      className={`[&_.katex]:text-[1.06em] ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Render mixed prose where $...$ segments become typeset math.
 * Money-safe: a "$" followed by a digit (like $50) is treated as literal text,
 * and "\$" inside math never terminates a segment.
 */
export function MathText({ text, className = '' }) {
  if (typeof text !== 'string' || !text.includes('$')) {
    return <span className={className}>{text}</span>;
  }
  const nodes = [];
  let plain = '';
  let i = 0;
  const nextDollar = (from) => {
    let j = from;
    while (j < text.length) {
      j = text.indexOf('$', j);
      if (j === -1) return -1;
      if (j > 0 && text[j - 1] === '\\') {
        j += 1;
        continue;
      }
      return j;
    }
    return -1;
  };
  while (i < text.length) {
    const a = nextDollar(i);
    if (a === -1) {
      plain += text.slice(i);
      break;
    }
    const b = nextDollar(a + 1);
    if (b === -1) {
      plain += text.slice(i);
      break;
    }
    const inner = text.slice(a + 1, b);
    if (inner.length > 0 && !/^[0-9]/.test(inner)) {
      plain += text.slice(i, a);
      if (plain) {
        nodes.push(<span key={nodes.length}>{plain}</span>);
        plain = '';
      }
      nodes.push(<MathTex key={nodes.length} tex={inner} />);
      i = b + 1;
    } else {
      plain += text.slice(i, a + 1);
      i = a + 1;
    }
  }
  if (plain) nodes.push(<span key={nodes.length}>{plain}</span>);
  return <span className={className}>{nodes}</span>;
}
