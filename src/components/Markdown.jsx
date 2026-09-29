// Small, safe Markdown renderer for assistant replies (no HTML injection).
// Supports paragraphs, headings, lists, code fences, `code`, **bold** and links.
import { CodeBlock } from './Cards.jsx';
import { Link } from '../lib/router.jsx';

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function Inline({ text, onLink }) {
  return text.split(INLINE).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (href.startsWith('/') && !href.startsWith('//')) {
        const isFile = /\.(md|txt)$/.test(href.split('#')[0]);
        return isFile
          ? <a key={i} href={href} target="_blank" rel="noreferrer">{label}</a>
          : <Link key={i} to={href} onClick={onLink}>{label}</Link>;
      }
      if (/^https?:\/\//.test(href)) return <a key={i} href={href} target="_blank" rel="noreferrer">{label}</a>;
      return label;
    }
    return part;
  });
}

export default function Markdown({ text, onLink }) {
  const lines = text.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) code.push(lines[i++]);
      i++;
      out.push(<CodeBlock key={out.length} code={code.join('\n')} title={fence[1] || 'code'} />);
      continue;
    }
    const list = line.match(/^\s*([-*]|\d+\.)\s+/);
    if (list) {
      const ordered = /\d/.test(list[1]);
      const items = [];
      while (i < lines.length && /^\s*([-*]|\d+\.)\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*([-*]|\d+\.)\s+/, ''));
      const Tag = ordered ? 'ol' : 'ul';
      out.push(<Tag key={out.length}>{items.map((t, k) => <li key={k}><Inline text={t} onLink={onLink} /></li>)}</Tag>);
      continue;
    }
    const heading = line.match(/^#{1,4}\s+(.*)/);
    if (heading) {
      out.push(<h5 key={out.length}><Inline text={heading[1]} onLink={onLink} /></h5>);
      i++;
      continue;
    }
    if (!line.trim()) { i++; continue; }
    const para = [];
    while (i < lines.length && lines[i].trim() && !/^(```|\s*([-*]|\d+\.)\s+|#{1,4}\s)/.test(lines[i])) para.push(lines[i++]);
    out.push(<p key={out.length}><Inline text={para.join(' ')} onLink={onLink} /></p>);
  }
  return <div className="md">{out}</div>;
}
