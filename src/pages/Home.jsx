import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { SectionHead, CodeBlock, MethodBadge } from '../components/Cards.jsx';
import { StatusCode } from '../components/Sandbox.jsx';
import { Link } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';
import { apiGroups, findPage } from '../data/apis.js';
import { BRAND, PORTAL_NAME, SLUG, MCP_URL } from '../data/site.js';

const withoutLogin = [
  'Read every guide and endpoint',
  'Compare request and response formats',
  'Copy docs into Claude, Cursor or any AI tool',
  'See example success, failure and exception responses',
];
const withLogin = [
  'Generate sandbox test keys',
  'Send simulated requests, no funded account needed',
  'Request IP whitelisting in a few clicks',
  'Switch to live keys and go to production',
];
const quickEndpoints = ['receive-mobile-money', 'card-checkout', 'send-to-wallet', 'transaction-status']
  .map((id) => findPage(id))
  .filter(Boolean);

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">All-in-one payment solutions</span>
          <h1>Welcome to {PORTAL_NAME}</h1>
          <h2 className="hero-subtitle">Programmable API integration with instant payments</h2>
          <p className="lead">
            Mobile money and bank transactions made easy with {BRAND} APIs. Explore the endpoints,
            integrate payments, transfers, bills and more, then test safely in the sandbox.
          </p>
          <div className="hero-ctas">
            <Link to="/docs" className="btn btn-primary">Explore the APIs</Link>
            <Link to="/login?next=%2Fdashboard" className="btn btn-ghost">Get started</Link>
          </div>
          <div className="hero-quick-access" aria-label="Quick access to popular endpoints">
            <span className="hero-quick-label">Popular endpoints</span>
            <ul>
              {quickEndpoints.map((endpoint) => (
                <li key={endpoint.id}>
                  <Link to={`/docs/${endpoint.id}`}>
                    <MethodBadge method={endpoint.method} />
                    <span>{endpoint.title}</span>
                    <span className="hero-quick-arrow" aria-hidden="true">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="hero-media">
          <img src="/images/hero-dashboard.png" alt="Merchant dashboard on laptop and phone showing payments, refunds and payment trends" />
        </div>
      </div>
    </section>
  );
}

function TwoWays() {
  const { user, requireLogin } = usePortal();
  return (
    <section className="section" id="access">
      <div className="container">
        <SectionHead center eyebrow="Get started" title="Explore, test, then go live." text="Follow a clear path from your first API request to a production-ready integration." />
        <div className="grid-2">
          <div className="way">
            <div className="way-head"><div className="icon"><Icon name="unlock" /></div><div><span className="tag">No login</span><h3>Explore</h3></div></div>
            <ul className="checks">{withoutLogin.map((t) => <li key={t}>{t}</li>)}</ul>
            <Link to="/docs" className="btn btn-outline-soft">Open the docs</Link>
          </div>
          <div className="way way-accent">
            <div className="way-head"><div className="icon"><Icon name="key" /></div><div><span className="tag tag-alt">With login</span><h3>Build</h3></div></div>
            <ul className="checks">{withLogin.map((t) => <li key={t}>{t}</li>)}</ul>
            {user ? (
              <Link to="/dashboard" className="btn btn-primary">Go to dashboard</Link>
            ) : (
              <button className="btn btn-primary" onClick={() => requireLogin('/dashboard')}>Log in to get keys</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Catalogue() {
  return (
    <section className="section section-tint" id="apis">
      <div className="container">
        <SectionHead eyebrow="API catalogue" title="Everything you can build" text="Open any endpoint to see its parameters, code samples and responses." />
        <div className="grid-4">
          {apiGroups.map((g) => (
            <div className="feature" key={g.id}>
              <div className="icon"><Icon name={g.icon} /></div>
              <h4>{g.title}</h4>
              <p>{g.summary}</p>
              <ul className="endpoint-list">
                {g.endpoints.map((e) => (
                  <li key={e.id}><Link to={`/docs/${e.id}`}>{e.title}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SandboxPreview() {
  const endpoint = findPage('receive-mobile-money');
  const [scenario, setScenario] = useState('success');
  const r = endpoint.responses[scenario];
  return (
    <section className="section" id="sandbox">
      <div className="container split">
        <div className="split-copy">
          <span className="eyebrow">Sandbox</span>
          <h2>Test every path without real money</h2>
          <p>
            Test keys go to a sandbox that returns simulated responses. You don't need a funded business
            account, and you don't need to wait for anyone to top one up.
          </p>
          <ul className="checks">
            <li>Choose success, failure or exception with one header</li>
            <li>Webhooks fire just like in production</li>
            <li>Switch to live keys when you're ready</li>
          </ul>
          <Link to="/docs/sandbox" className="btn btn-primary">How the sandbox works</Link>
        </div>
        <div className="sim">
          <div className="sim-head">
            <span className="dots"><i /><i /><i /></span>
            <code>POST /v1/payments/mobile-money</code>
          </div>
          <div className="seg seg-dark">
            {['success', 'failure', 'exception'].map((s) => (
              <button key={s} className={s === scenario ? 'active' : ''} onClick={() => setScenario(s)}>
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
          <div className="sim-status"><StatusCode code={r.code} /> <span>X-Test-Scenario: {scenario}</span></div>
          <pre><code>{JSON.stringify(r.body, null, 2)}</code></pre>
        </div>
      </div>
    </section>
  );
}

function AiReady() {
  return (
    <section className="section section-dark" id="ai">
      <div className="container split">
        <div className="split-copy">
          <span className="eyebrow">Built for AI assistants</span>
          <h2>Your AI assistant can read the docs</h2>
          <p>
            Connect Claude or Cursor to our docs and they can look up the right endpoints, parameters and
            error codes as they write your integration.
          </p>
          <div className="ai-grid">
            <div><Icon name="plug" /><h4>MCP server</h4><p>Search docs and call the sandbox from Claude or Cursor.</p></div>
            <div><Icon name="sparkle" /><h4>Agent Skill</h4><p>Integration rules your assistant follows.</p></div>
            <div><Icon name="file" /><h4>llms.txt</h4><p>Every page as clean Markdown.</p></div>
            <div><Icon name="copy" /><h4>Copy as Markdown</h4><p>One click on every docs page.</p></div>
          </div>
          <Link to="/ai" className="btn btn-primary">Set up AI tools</Link>
        </div>
        <CodeBlock
          samples={{
            'Claude Code': `claude mcp add --transport http ${SLUG} ${MCP_URL}`,
            Cursor: JSON.stringify({ mcpServers: { [SLUG]: { url: MCP_URL } } }, null, 2),
            Prompt: `Using the ${SLUG} MCP server, add mobile money checkout to my Next.js app.\nUse a test key, handle the webhook, and test the failure and exception paths.`,
          }}
        />
      </div>
    </section>
  );
}

function Plugins() {
  return (
    <section className="section section-tint">
      <div className="container split split-reverse">
        <div className="split-media media-card">
          <img src="/images/bill-payment.png" alt="Phone showing a payment confirmation screen" />
        </div>
        <div className="split-copy">
          <span className="eyebrow">No-code plugins</span>
          <h2>Take payments on your store without writing code</h2>
          <p>Official plugins connect WooCommerce and Shopify stores in minutes. They're built for SMEs and startups that don't have developers.</p>
          <div className="grid-2 mini">
            <div className="mini-card"><div className="icon sm"><Icon name="cart" /></div><div><h4>WooCommerce</h4><p>For WordPress stores.</p></div></div>
            <div className="mini-card"><div className="icon sm"><Icon name="bag" /></div><div><h4>Shopify</h4><p>For Shopify stores.</p></div></div>
          </div>
          <Link to="/plugins" className="btn btn-primary">See the plugins</Link>
        </div>
      </div>
    </section>
  );
}

function Whitelisting() {
  const steps = [
    { icon: 'shield', title: 'Submit your IP', text: 'Log in and enter your server IP on the request page.' },
    { icon: 'message', title: 'Engineer is notified', text: 'Your Integration Engineer gets the request right away.' },
    { icon: 'check', title: 'Approved or rejected', text: 'You see the result on the request page and by email.' },
    { icon: 'rocket', title: 'Go live', text: 'Switch to live keys and start taking payments.' },
  ];
  return (
    <section className="section" id="whitelisting">
      <div className="container">
        <SectionHead center eyebrow="IP whitelisting" title="Request IP whitelisting yourself" text="No support tickets or email back-and-forth. Request it, then track it in your dashboard." />
        <ol className="flow">
          {steps.map((s, i) => (
            <li key={s.title}>
              <div className="icon"><Icon name={s.icon} /></div>
              <span className="flow-num">Step {i + 1}</span>
              <h4>{s.title}</h4>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="row center top-gap">
          <Link to="/ip-whitelisting" className="btn btn-primary">Request IP whitelisting</Link>
          <Link to="/docs/ip-whitelisting" className="btn btn-ghost">Read the guide →</Link>
        </div>
      </div>
    </section>
  );
}

function Community() {
  return (
    <section className="section section-tint">
      <div className="container split">
        <div className="split-media">
          <img src="/images/team.png" alt="Developers reviewing code together" />
        </div>
        <div className="split-copy">
          <span className="eyebrow">Developer community</span>
          <h2>Build with other developers</h2>
          <p>Ask questions, share integration tips and tell us what to fix next. Our engineers read and reply.</p>
          <ul className="checks">
            <li>Peer support from teams already live</li>
            <li>Direct feedback to the product team</li>
            <li>Meetups, office hours and release notes</li>
          </ul>
          <Link to="/community" className="btn btn-primary">Join the community</Link>
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="cta">
      <div className="container cta-inner">
        <div>
          <h2>Start with the docs</h2>
          <p>Read them now. Log in when you're ready for test keys.</p>
        </div>
        <Link to="/docs" className="btn btn-light">Browse the docs</Link>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <TwoWays />
      <Catalogue />
      <SandboxPreview />
      <AiReady />
      <Plugins />
      <Whitelisting />
      <Community />
      <Cta />
    </>
  );
}
