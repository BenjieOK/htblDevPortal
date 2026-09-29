import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import AiActions from '../components/AiActions.jsx';
import Sandbox, { StatusCode } from '../components/Sandbox.jsx';
import { CodeBlock, MethodBadge } from '../components/Cards.jsx';
import { Link } from '../lib/router.jsx';
import { codeSamples } from '../lib/samples.js';
import { guides, apiGroups, allPages, findPage } from '../data/apis.js';
import { API_BASE } from '../data/site.js';

function Sidebar({ current, onNavigate }) {
  const [q, setQ] = useState('');
  const match = (p) => !q || `${p.title} ${p.path || ''}`.toLowerCase().includes(q.toLowerCase());
  const sections = [
    { title: 'Guides', pages: guides },
    ...apiGroups.map((g) => ({ title: g.title, pages: g.endpoints })),
  ];

  return (
    <nav className="docs-sidebar" aria-label="Documentation">
      <label className="search">
        <Icon name="search" size={16} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search guides and endpoints" aria-label="Search guides and endpoints" />
      </label>
      {sections.map((s) => {
        const pages = s.pages.filter(match);
        if (!pages.length) return null;
        return (
          <div className="docs-nav-group" key={s.title}>
            <h6>{s.title}</h6>
            {pages.map((p) => (
              <Link key={p.id} to={`/docs/${p.id}`} onClick={onNavigate} className={p.id === current ? 'active' : ''}>
                {p.method && <MethodBadge method={p.method} />}
                <span>{p.title}</span>
              </Link>
            ))}
          </div>
        );
      })}
    </nav>
  );
}

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.p) return <p key={i}>{b.p}</p>;
    if (b.h) return <h2 key={i}>{b.h}</h2>;
    if (b.list) return <ul key={i} className="doc-list">{b.list.map((li) => <li key={li}>{li}</li>)}</ul>;
    return <CodeBlock key={i} code={b.code} title={b.lang} />;
  });
}

function EndpointBody({ e }) {
  const groups = ['path', 'query', 'body'].map((where) => [where, e.params.filter((p) => p.in === where)]).filter(([, ps]) => ps.length);
  return (
    <>
      <div className="endpoint-url">
        <MethodBadge method={e.method} />
        <code>{API_BASE}{e.path}</code>
      </div>
      {groups.map(([where, ps]) => (
        <section key={where}>
          <h2>{where === 'body' ? 'Request body' : `${where[0].toUpperCase() + where.slice(1)} parameters`}</h2>
          <div className="params">
            {ps.map((p) => (
              <div className="param" key={p.name}>
                <div>
                  <code className="param-name">{p.name}</code>
                  <span className="param-type">{p.type}</span>
                  {p.required && <span className="param-req">required</span>}
                </div>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </section>
      ))}
      <h2>Example request</h2>
      <CodeBlock samples={codeSamples(e)} />
      <h2>Responses</h2>
      <div className="responses">
        {Object.entries(e.responses).map(([k, r]) => (
          <details key={k} open={k === 'success'}>
            <summary><StatusCode code={r.code} /> {k[0].toUpperCase() + k.slice(1)}</summary>
            <pre><code>{JSON.stringify(r.body, null, 2)}</code></pre>
          </details>
        ))}
      </div>
    </>
  );
}

export default function Docs({ id }) {
  const page = findPage(id || 'introduction');
  const [menuOpen, setMenuOpen] = useState(false);
  const index = allPages.indexOf(page);
  const [prev, next] = useMemo(() => [allPages[index - 1], allPages[index + 1]], [index]);

  if (!page) {
    return (
      <div className="container section center-text">
        <h1>Page not found</h1>
        <p><Link to="/docs" className="link">Back to the docs →</Link></p>
      </div>
    );
  }

  return (
    <div className={`docs container${page.type === 'endpoint' ? ' has-sandbox' : ''}`}>
      <button className="docs-menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
        <Icon name="book" size={16} /> {menuOpen ? 'Hide' : 'Browse'} docs
      </button>
      <div className={`docs-sidebar-wrap${menuOpen ? ' open' : ''}`}>
        <Sidebar current={page.id} onNavigate={() => setMenuOpen(false)} />
      </div>

      <article className="doc">
        <span className="eyebrow">{page.group}</span>
        <h1>{page.title}</h1>
        <p className="doc-summary">{page.summary}</p>
        <AiActions page={page} />
        {page.type === 'guide' ? <Blocks blocks={page.blocks} /> : <EndpointBody e={page} />}
        <div className="doc-pager">
          {prev ? <Link to={`/docs/${prev.id}`}>← {prev.title}</Link> : <span />}
          {next && <Link to={`/docs/${next.id}`}>{next.title} →</Link>}
        </div>
      </article>

      {page.type === 'endpoint' && <Sandbox key={page.id} endpoint={page} />}
    </div>
  );
}
