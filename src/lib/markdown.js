// Turns the docs data into Markdown so AI assistants (Claude, Cursor, etc.)
// can read it. Used by the "Copy as Markdown" button and scripts/gen-docs.mjs.
import { BRAND, SLUG, DOCS_URL, API_BASE, MCP_URL } from '../data/site.js';
import { guides, apiGroups, allPages } from '../data/apis.js';
import { codeSamples } from './samples.js';

const fence = (code, lang = '') => '```' + lang + '\n' + code + '\n```';

function blocksToMd(blocks) {
  return blocks
    .map((b) => {
      if (b.p) return b.p;
      if (b.h) return `## ${b.h}`;
      if (b.list) return b.list.map((i) => `- ${i}`).join('\n');
      return fence(b.code, b.lang);
    })
    .join('\n\n');
}

function endpointToMd(e) {
  const rows = e.params
    .map((p) => `| \`${p.name}\` | ${p.in} | ${p.type} | ${p.required ? 'yes' : 'no'} | ${p.desc} |`)
    .join('\n');
  const responses = Object.entries(e.responses)
    .map(([k, r]) => `### ${k[0].toUpperCase() + k.slice(1)} (HTTP ${r.code})\n\n${fence(JSON.stringify(r.body, null, 2), 'json')}`)
    .join('\n\n');
  return [
    `${e.summary}`,
    fence(`${e.method} ${API_BASE}${e.path}`, 'http'),
    '## Parameters',
    '| Name | In | Type | Required | Description |\n| --- | --- | --- | --- | --- |\n' + rows,
    '## Example request',
    fence(codeSamples(e).cURL, 'bash'),
    '## Responses',
    'In the sandbox, set the `X-Test-Scenario` header to `success`, `failure` or `exception` to get each response below.',
    responses,
  ].join('\n\n');
}

export function pageToMd(page) {
  const body = page.type === 'guide' ? `> ${page.summary}\n\n${blocksToMd(page.blocks)}` : endpointToMd(page);
  return `# ${page.title}\n\n${body}\n\nSource: ${DOCS_URL}/docs/${page.id}\n`;
}

export function llmsTxt() {
  const link = (p) => `- [${p.title}](${DOCS_URL}/docs/${p.id}.md): ${p.summary}`;
  return [
    `# ${BRAND} API`,
    '',
    `> Payments, transfers, bill payments, customer verification, transactions and SMS APIs. Base URL: ${API_BASE}. Auth: Bearer secret key. Test keys (sk_test_) use a sandbox with simulated success, failure and exception responses.`,
    '',
    `An MCP server is available at ${MCP_URL}. The full docs are in one file at ${DOCS_URL}/llms-full.txt.`,
    '',
    '## Guides',
    ...guides.map(link),
    ...apiGroups.flatMap((g) => ['', `## ${g.title}`, ...g.endpoints.map(link)]),
    '',
  ].join('\n');
}

export function llmsFullTxt() {
  return allPages.map(pageToMd).join('\n---\n\n');
}

export function skillMd() {
  const endpoints = apiGroups
    .flatMap((g) => g.endpoints)
    .map((e) => `- \`${e.method} ${e.path}\`: ${e.title}. Docs: ${DOCS_URL}/docs/${e.id}.md`)
    .join('\n');
  return `---
name: ${SLUG}-api
description: Integrate the ${BRAND} payments API (mobile money, card checkout, transfers, bill payments, verification, SMS). Use when the user is building payments or messaging with ${BRAND}.
---

# ${BRAND} API integration

## Rules
- Base URL: ${API_BASE}. Send \`Authorization: Bearer <secret key>\` on every request.
- Read the secret key from an environment variable. Never hard-code it or expose it in client-side code.
- Use a test key (sk_test_) until the user says they are ready to go live.
- Always send a unique \`clientReference\` so retries are safe.
- Mobile money and transfers are asynchronous: handle the webhook, and call \`GET /v1/transactions/{transactionId}\` after a timeout instead of retrying blindly.
- Test all three paths with the \`X-Test-Scenario\` header: success, failure, exception.
- Live requests only work from whitelisted IPs. Tell the user to request whitelisting at ${DOCS_URL}/ip-whitelisting (login required).

## Endpoints
${endpoints}

## More
- Full docs: ${DOCS_URL}/llms-full.txt
- Webhooks: ${DOCS_URL}/docs/webhooks.md
- Errors: ${DOCS_URL}/docs/errors.md
`;
}
