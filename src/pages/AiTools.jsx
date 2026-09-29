import Icon from '../components/Icon.jsx';
import { CodeBlock, CopyButton, SectionHead } from '../components/Cards.jsx';
import { claudeUrl } from '../components/AiActions.jsx';
import { BRAND, SLUG, DOCS_URL, MCP_URL } from '../data/site.js';

const cursorInstallUrl = `cursor://anysphere.cursor-deeplink/mcp/install?name=${SLUG}&config=${btoa(JSON.stringify({ url: MCP_URL }))}`;
const starterPrompt = `Read ${DOCS_URL}/llms.txt, then help me add ${BRAND} mobile money payments to my app. Use a test key from an environment variable, handle the webhook, and test the success, failure and exception scenarios.`;

const tools = [
  { name: 'search_docs', text: 'Search guides and endpoints by keyword.' },
  { name: 'get_endpoint', text: 'Get parameters, examples and responses for one endpoint.' },
  { name: 'sandbox_request', text: 'Send a simulated request with your test key.' },
  { name: 'get_transaction_status', text: 'Look up a sandbox transaction by ID.' },
];

export default function AiTools() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">AI tools</span>
          <h1>Build your integration with <span className="accent">Claude or Cursor</span></h1>
          <p className="lead">
            Our docs are built to be read by AI coding assistants as well as people. Connect your assistant
            once and it can look up endpoints, follow our integration rules, and test in the sandbox.
          </p>
          <div className="hero-ctas">
            <a className="btn btn-primary" href={cursorInstallUrl}><Icon name="terminal" size={16} /> Add to Cursor</a>
            <a className="btn btn-ghost" href={claudeUrl(starterPrompt)} target="_blank" rel="noreferrer">Try it in Claude →</a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="1 · MCP server" title="Connect the docs to your assistant" text={`The ${BRAND} MCP server gives your assistant these tools:`} />
          <div className="grid-4 tools">
            {tools.map((t) => (
              <div className="tool" key={t.name}><code>{t.name}</code><p>{t.text}</p></div>
            ))}
          </div>
          <div className="grid-2 setup">
            <div>
              <h3>Claude Code</h3>
              <p>Run this in your project folder:</p>
              <CodeBlock title="terminal" code={`claude mcp add --transport http ${SLUG} ${MCP_URL}`} />
              <h3>Claude Desktop and claude.ai</h3>
              <p>Go to <strong>Settings → Connectors → Add custom connector</strong> and paste the server URL:</p>
              <CodeBlock title="url" code={MCP_URL} />
            </div>
            <div>
              <h3>Cursor</h3>
              <p>Click <strong>Add to Cursor</strong> above, or add this to <code>.cursor/mcp.json</code>:</p>
              <CodeBlock title=".cursor/mcp.json" code={JSON.stringify({ mcpServers: { [SLUG]: { url: MCP_URL } } }, null, 2)} />
              <h3>Other assistants</h3>
              <p>Any MCP client that supports remote HTTP servers can connect using the same URL.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container split">
          <div className="split-copy">
            <span className="eyebrow">2 · Agent Skill</span>
            <h2>Give your assistant our integration rules</h2>
            <p>
              The skill tells your assistant how to integrate correctly: keep keys in environment variables,
              use a unique reference for every request, handle webhooks, and check status before retrying.
            </p>
            <CodeBlock title="Claude Code: install the skill" code={`mkdir -p .claude/skills/${SLUG}-api\ncurl -o .claude/skills/${SLUG}-api/SKILL.md \\\n  ${DOCS_URL}/skills/${SLUG}-api/SKILL.md`} />
            <p className="small">For Cursor, save the same file as <code>.cursor/rules/{SLUG}-api.mdc</code>.</p>
          </div>
          <div className="file-preview">
            <div className="file-preview-head">
              <span><Icon name="file" size={15} /> SKILL.md</span>
              <a className="link" href={`/skills/${SLUG}-api/SKILL.md`} target="_blank" rel="noreferrer">View full file →</a>
            </div>
            <ul>
              <li>Read the secret key from an environment variable</li>
              <li>Use test keys until the user is ready to go live</li>
              <li>Send a unique clientReference so retries are safe</li>
              <li>Handle webhooks and check status after a timeout</li>
              <li>Test success, failure and exception scenarios</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="3 · Plain-text docs" title="Docs any AI tool can read" text="No login and no JavaScript needed. Point any assistant at these URLs." />
          <div className="grid-3">
            {[
              { path: '/llms.txt', title: 'llms.txt', text: 'An index of every docs page, with links to its Markdown version.' },
              { path: '/llms-full.txt', title: 'llms-full.txt', text: 'All the docs in one Markdown file, ready to paste into a chat.' },
              { path: '/docs/receive-mobile-money.md', title: 'Any page + .md', text: 'Add .md to any docs URL to get that page as Markdown.' },
            ].map((f) => (
              <div className="feature" key={f.path}>
                <div className="icon"><Icon name="file" /></div>
                <h4>{f.title}</h4>
                <p>{f.text}</p>
                <div className="row">
                  <a className="link" href={f.path} target="_blank" rel="noreferrer">Open →</a>
                  <CopyButton text={DOCS_URL + f.path} label="Copy URL" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container narrow">
          <SectionHead center eyebrow="Starter prompt" title="Not sure where to start? Paste this." />
          <CodeBlock title="prompt" code={starterPrompt} />
        </div>
      </section>
    </>
  );
}
