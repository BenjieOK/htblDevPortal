// Offline fallback for the assistant: keyword search over docs and community
// threads, used when the AI service isn't configured or can't be reached.
import { allPages } from '../data/apis.js';
import { threads, threadLink } from '../data/community.js';

const STOP = new Set('a an and are can do does for from how i in is it my of on or the to what when where which with you your'.split(' '));
const words = (s) => s.toLowerCase().match(/[a-z0-9]+/g)?.filter((w) => w.length > 1 && !STOP.has(w)) ?? [];

function score(query, text, title) {
  const hay = text.toLowerCase();
  const t = title.toLowerCase();
  return query.reduce((n, w) => n + (t.includes(w) ? 3 : 0) + (hay.includes(w) ? 1 : 0), 0);
}

export function localAnswer(question) {
  const q = words(question);
  const pageText = (p) =>
    [p.title, p.summary, p.path, ...(p.params || []).map((x) => `${x.name} ${x.desc}`), ...(p.blocks || []).map((b) => b.p || b.h || (b.list || []).join(' ') || '')].join(' ');

  const pages = allPages
    .map((p) => ({ p, s: score(q, pageText(p), p.title) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 3);
  const found = threads
    .map((t) => ({ t, s: score(q, `${t.title} ${t.tag} ${t.answer}`, t.title) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 2);

  if (!pages.length && !found.length) {
    return "I couldn't find anything in the docs or community for that. Try different words, or **ask the community** below and a developer or engineer will help.";
  }
  const out = ['The AI assistant is offline, so here are the closest matches from the docs and community:'];
  if (pages.length) out.push('', '**Docs**', ...pages.map(({ p }) => `- [${p.title}](/docs/${p.id}): ${p.summary}`));
  if (found.length) out.push('', '**Community**', ...found.map(({ t }) => `- [${t.title}](${threadLink(t)})${t.solved ? ' (solved)' : ''}`));
  return out.join('\n');
}
