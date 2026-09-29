import { useState } from 'react';
import Icon from './Icon.jsx';

export function SectionHead({ eyebrow, title, text, center }) {
  return (
    <div className={`section-head${center ? ' center' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState(null);
  const copy = async (text, id = true) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1600);
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  };
  return [copied, copy];
}

export function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, copy] = useCopy();
  return (
    <button type="button" className={`copy-btn ${className}`} onClick={() => copy(text)}>
      <Icon name={copied ? 'check' : 'copy'} size={15} />
      {copied ? 'Copied' : label}
    </button>
  );
}

// Dark code panel with optional language tabs.
export function CodeBlock({ samples, code, title }) {
  const tabs = samples ? Object.keys(samples) : null;
  const [tab, setTab] = useState(tabs?.[0]);
  const text = samples ? samples[tab] : code;
  return (
    <div className="code">
      <div className="code-bar">
        {tabs ? (
          <div className="code-tabs" role="tablist">
            {tabs.map((t) => (
              <button key={t} role="tab" aria-selected={t === tab} className={t === tab ? 'active' : ''} onClick={() => setTab(t)}>
                {t}
              </button>
            ))}
          </div>
        ) : (
          <span className="code-title">{title}</span>
        )}
        <CopyButton text={text} className="on-dark" />
      </div>
      <pre><code>{text}</code></pre>
    </div>
  );
}

export function MethodBadge({ method }) {
  return <span className={`method method-${method.toLowerCase()}`}>{method}</span>;
}
