import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import { CopyButton } from '../components/Cards.jsx';
import { Link } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';
import { IpRequestForm } from '../components/IpWhitelist.jsx';
import { BusinessStatus } from '../components/ProfileMenu.jsx';

const tabs = [
  { id: 'keys', label: 'Test keys', icon: 'key' },
  { id: 'ip', label: 'IP whitelisting', icon: 'shield' },
  { id: 'live', label: 'Go live', icon: 'rocket' },
];

function Keys() {
  const { testKey, generateTestKey } = usePortal();
  const [shown, setShown] = useState(false);
  return (
    <div className="panel">
      <h3>Sandbox test key</h3>
      <p>Use this key to send simulated requests. No money moves and you don't need a funded account.</p>
      {testKey ? (
        <>
          <div className="key-row">
            <code>{shown ? testKey : testKey.slice(0, 12) + '•'.repeat(20)}</code>
            <button className="copy-btn" onClick={() => setShown((s) => !s)}>{shown ? 'Hide' : 'Reveal'}</button>
            <CopyButton text={testKey} />
          </div>
          <div className="row top-gap">
            <Link to="/docs/receive-mobile-money" className="btn btn-primary">Try it in the docs</Link>
            <button className="btn btn-ghost" onClick={generateTestKey}>Roll key</button>
          </div>
        </>
      ) : (
        <button className="btn btn-primary" onClick={generateTestKey}><Icon name="key" size={16} /> Generate test key</button>
      )}
    </div>
  );
}

function IpWhitelist() {
  return (
    <div className="panel">
      <div className="panel-head">
        <h3>Request IP whitelisting</h3>
        <Link to="/ip-whitelisting" className="link small">Open full page →</Link>
      </div>
      <p>Your Integration Engineer is notified as soon as you submit, and you'll see their decision here.</p>
      <IpRequestForm />
    </div>
  );
}

function GoLive() {
  const { testKey, ipRequests, business } = usePortal();
  const items = [
    { done: business?.status === 'verified', text: 'Business verification (KYC) approved', to: null },
    { done: !!testKey, text: 'Generate a test key', to: null },
    { done: false, text: 'Test success, failure and exception scenarios', to: '/docs/sandbox' },
    { done: false, text: 'Set up your webhook handler', to: '/docs/webhooks' },
    { done: ipRequests.some((r) => r.status === 'approved'), text: 'Get your server IP whitelisted', to: null },
  ];
  const ready = items.filter((i) => i.done).length;
  return (
    <div className="panel">
      <h3>Go-live checklist</h3>
      <p>{ready} of {items.length} done. When everything is ticked, you can request live keys.</p>
      <div className="progress"><span style={{ width: `${(ready / items.length) * 100}%` }} /></div>
      <ul className="checklist">
        {items.map((i) => (
          <li key={i.text} className={i.done ? 'done' : ''}>
            <span className="tick">{i.done && <Icon name="check" size={14} />}</span>
            {i.to ? <Link to={i.to}>{i.text}</Link> : i.text}
          </li>
        ))}
      </ul>
      <button className="btn btn-primary" disabled={ready < items.length}>Request live keys</button>
    </div>
  );
}

export default function Dashboard() {
  const { user, business, requireLogin } = usePortal();
  const [tab, setTab] = useState('keys');

  if (!user) {
    return (
      <section className="section">
        <div className="container narrow center-text">
          <div className="icon icon-center"><Icon name="lock" /></div>
          <h1 className="h2">Log in to your dashboard</h1>
          <p>You need to log in for test keys, IP whitelisting and going live. You can read the docs without logging in.</p>
          <div className="row center top-gap">
            <button className="btn btn-primary" onClick={() => requireLogin('/dashboard')}>Log in</button>
            <Link to="/docs" className="btn btn-ghost">Browse the docs →</Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section dash">
      <div className="container">
        <div className="dash-head">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h1 className="h2">Hi, {user.name}</h1>
            <p className="dash-biz">
              Working in <strong>{business?.name}</strong> {business && <BusinessStatus status={business.status} />}
            </p>
          </div>
          <span className="muted small">Switch business or log out from the menu at the top right.</span>
        </div>
        <div className="dash-body">
          <nav className="dash-tabs" role="tablist">
            {tabs.map((t) => (
              <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
                <Icon name={t.icon} size={18} /> {t.label}
              </button>
            ))}
          </nav>
          {tab === 'keys' && <Keys />}
          {tab === 'ip' && <IpWhitelist />}
          {tab === 'live' && <GoLive />}
        </div>
      </div>
    </section>
  );
}
