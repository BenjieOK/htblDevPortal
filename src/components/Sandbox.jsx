import { useState } from 'react';
import Icon from './Icon.jsx';
import { MethodBadge } from './Cards.jsx';
import { usePortal } from '../lib/portal.jsx';
import { Link } from '../lib/router.jsx';

const scenarios = [
  { id: 'success', label: 'Success' },
  { id: 'failure', label: 'Failure' },
  { id: 'exception', label: 'Exception' },
];

export function StatusCode({ code }) {
  const kind = code < 300 ? 'ok' : code < 500 ? 'warn' : 'bad';
  return <span className={`status status-${kind}`}>{code}</span>;
}

// Example responses are public. Sending a simulated request needs a test key.
export default function Sandbox({ endpoint }) {
  const { user, testKey, requireLogin } = usePortal();
  const [scenario, setScenario] = useState('success');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const send = () => {
    setLoading(true);
    setResult(null);
    const started = performance.now();
    setTimeout(() => {
      setResult({ ...endpoint.responses[scenario], ms: Math.round(performance.now() - started) });
      setLoading(false);
    }, 450 + Math.random() * 400);
  };

  const shown = result || endpoint.responses[scenario];

  return (
    <aside className="sandbox" aria-label="Sandbox">
      <div className="sandbox-head">
        <strong>Try it in the sandbox</strong>
        <span className="pill">No real money</span>
      </div>
      <div className="sandbox-url">
        <MethodBadge method={endpoint.method} />
        <code>{endpoint.path}</code>
      </div>

      <div className="seg" role="tablist" aria-label="Test scenario">
        {scenarios.map((s) => (
          <button
            key={s.id}
            role="tab"
            aria-selected={scenario === s.id}
            className={scenario === s.id ? 'active' : ''}
            onClick={() => { setScenario(s.id); setResult(null); }}
          >
            {s.label}
          </button>
        ))}
      </div>
      <p className="sandbox-hint">Sends <code>X-Test-Scenario: {scenario}</code></p>

      {!user ? (
        <button className="btn btn-primary btn-block" onClick={() => requireLogin()}>
          <Icon name="lock" size={16} /> Log in to send a test request
        </button>
      ) : !testKey ? (
        <Link to="/dashboard" className="btn btn-primary btn-block"><Icon name="key" size={16} /> Generate a test key first</Link>
      ) : (
        <button className="btn btn-primary btn-block" onClick={send} disabled={loading}>
          <Icon name="play" size={16} /> {loading ? 'Sending…' : 'Send test request'}
        </button>
      )}

      <div className="sandbox-response">
        <div className="sandbox-response-head">
          <span>{result ? 'Response' : 'Example response'}</span>
          <span>
            <StatusCode code={shown.code} />
            {result && <span className="muted"> · {result.ms} ms</span>}
          </span>
        </div>
        <pre><code>{JSON.stringify(shown.body, null, 2)}</code></pre>
      </div>
    </aside>
  );
}
