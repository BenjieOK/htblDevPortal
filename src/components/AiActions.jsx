import Icon from './Icon.jsx';
import { useCopy } from './Cards.jsx';
import { BRAND, DOCS_URL } from '../data/site.js';
import { pageToMd } from '../lib/markdown.js';
import { openAssistant } from './Assistant.jsx';

export const claudeUrl = (prompt) => `https://claude.ai/new?q=${encodeURIComponent(prompt)}`;
export const cursorPromptUrl = (prompt) => `cursor://anysphere.cursor-deeplink/prompt?text=${encodeURIComponent(prompt)}`;

// "Use this page with AI" buttons shown at the top of every docs page.
export default function AiActions({ page }) {
  const [copied, copy] = useCopy();
  const prompt = `Read ${DOCS_URL}/docs/${page.id}.md and help me integrate "${page.title}" from the ${BRAND} API into my project. Use a test key from an environment variable.`;

  return (
    <div className="ai-actions" aria-label="Use this page with AI">
      <button type="button" className="chip" onClick={() => copy(pageToMd(page))}>
        <Icon name={copied ? 'check' : 'copy'} size={15} /> {copied ? 'Copied' : 'Copy as Markdown'}
      </button>
      <a className="chip" href={`/docs/${page.id}.md`} target="_blank" rel="noreferrer">
        <Icon name="file" size={15} /> View .md
      </a>
      <button type="button" className="chip chip-ai" onClick={() => openAssistant(`Explain "${page.title}" and show me how to use it.`)}>
        <Icon name="message" size={15} /> Ask the assistant
      </button>
      <a className="chip chip-ai" href={claudeUrl(prompt)} target="_blank" rel="noreferrer">
        <Icon name="sparkle" size={15} /> Open in Claude
      </a>
      <a className="chip chip-ai" href={cursorPromptUrl(prompt)}>
        <Icon name="terminal" size={15} /> Open in Cursor
      </a>
    </div>
  );
}
