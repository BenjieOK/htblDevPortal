// POST /api/chat: streams an answer from Claude, grounded in the portal's docs
// and community threads. Shared by the Vite dev server and the Vercel function.
import Anthropic from '@anthropic-ai/sdk';
import { BRAND } from '../src/data/site.js';
import { allPages } from '../src/data/apis.js';
import { threads, threadLink } from '../src/data/community.js';
import { llmsFullTxt } from '../src/lib/markdown.js';

const MODEL = 'claude-opus-5';
const MAX_MESSAGES = 20;
const MAX_CHARS = 4000;

const instructions = `You are the ${BRAND} Developer Assistant on the ${BRAND} developer portal. You help developers integrate the ${BRAND} APIs, and you connect them with the developer community.

How to answer:
- Answer only from the documentation and community threads below. If they don't cover the question, say so plainly and suggest asking the community or contacting support. Never invent endpoints, fields, error codes or policies.
- Be concise and practical. Lead with the answer, then a short code example if it helps. Use Markdown.
- Link to docs pages with relative links, for example [Receive mobile money](/docs/receive-mobile-money). Available pages: ${allPages.map((p) => `/docs/${p.id}`).join(', ')}.
- When a community thread is relevant, link it, for example [${threads[0].title}](${threadLink(threads[0])}), and mention that other developers have discussed it.
- For account-specific issues (a specific IP whitelisting request, KYC, live funds, a stuck live transaction), you can't see their account: explain the general process, then suggest posting in the community or contacting support.
- Always tell developers to keep secret keys in environment variables and to test with sandbox test keys first.
- Latency-sensitive; begin your visible answer immediately.`;

const communityContext = threads
  .map((t) => `- [${t.title}](${threadLink(t)}) (${t.tag}, ${t.solved ? 'solved' : 'open'}): ${t.answer}`)
  .join('\n');

// Stable across requests so it is served from the prompt cache.
const system = [
  { type: 'text', text: instructions },
  {
    type: 'text',
    text: `<documentation>\n${llmsFullTxt()}\n</documentation>\n\n<community_threads>\n${communityContext}\n</community_threads>`,
    cache_control: { type: 'ephemeral' },
  },
];

let client;

async function readJson(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function cleanMessages(raw, page) {
  const messages = (Array.isArray(raw) ? raw : [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }));
  while (messages.length && messages[0].role !== 'user') messages.shift();
  const last = messages.at(-1);
  if (!last || last.role !== 'user') return null;
  // Page context goes in the latest turn, not the system prompt, to keep the cache prefix stable.
  if (typeof page === 'string' && page.startsWith('/')) {
    last.content = `${last.content}\n\n(I'm currently on the portal page ${page.slice(0, 200)}.)`;
  }
  return messages;
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function handleChat(req, res) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'method_not_allowed' });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return sendJson(res, 400, { error: 'invalid_json' });
  }
  const messages = cleanMessages(body.messages, body.page);
  if (!messages) return sendJson(res, 400, { error: 'invalid_messages' });

  if (!process.env.ANTHROPIC_API_KEY && !process.env.ANTHROPIC_AUTH_TOKEN) {
    return sendJson(res, 503, { error: 'not_configured' });
  }
  client ??= new Anthropic();

  let started = false;
  const write = (text) => {
    if (!started) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache');
      started = true;
    }
    res.write(text);
  };

  try {
    const stream = client.beta.messages.stream({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: 'medium' },
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      system,
      messages,
    });

    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') write(event.delta.text);
    }

    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') {
      write("\n\nI can't help with that one. Try asking in the [community](/community) or contact support.");
    } else if (final.stop_reason === 'max_tokens') {
      write('\n\n_(Answer cut short. Ask me to continue.)_');
    }
    if (!started) write('');
    res.end();
  } catch (error) {
    let code = 'upstream_error';
    if (error instanceof Anthropic.AuthenticationError) code = 'not_configured';
    else if (error instanceof Anthropic.RateLimitError) code = 'rate_limited';
    else if (error instanceof Anthropic.APIError) console.error(`Claude API error ${error.status}:`, error.message);
    else console.error('Chat error:', error);

    if (!started) return sendJson(res, code === 'not_configured' ? 503 : 502, { error: code });
    res.end('\n\n_(Connection lost. Please try again.)_');
  }
}
