import { useState } from 'react';
import Icon from './Icon.jsx';
import { usePortal } from '../lib/portal.jsx';

// Returns an error message, or null if the address can be whitelisted.
export function checkIp(ip) {
  const parts = ip.split('.');
  if (parts.length !== 4 || parts.some((p) => !/^\d{1,3}$/.test(p) || +p > 255)) return 'Enter a valid IPv4 address, like 203.0.113.10.';
  const [a, b] = parts.map(Number);
  if (a === 10 || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168)) return 'This is a private address. Enter the public IP your server uses to reach the internet.';
  if (a === 127 || a === 0 || (a === 169 && b === 254) || a >= 224) return 'This address can’t be whitelisted. Enter your server’s public IP.';
  return null;
}

function StatusPill({ status }) {
  if (status === 'approved') return <span className="pill pill-ok"><Icon name="check" size={12} /> Approved</span>;
  if (status === 'rejected') return <span className="pill pill-bad">Rejected</span>;
  return <span className="pill pill-wait">Waiting for engineer</span>;
}

export function IpRequestForm() {
  const { ipRequests, submitIpRequest } = usePortal();
  const [ip, setIp] = useState('');
  const [env, setEnv] = useState('Production');
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);
  const [justSent, setJustSent] = useState(null);

  const error = ip ? checkIp(ip) : null;
  const duplicate = !error && ipRequests.some((r) => r.ip === ip && r.env === env && r.status !== 'rejected');

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!ip || error || duplicate) return;
    submitIpRequest({ ip, env, reason });
    setJustSent(ip);
    setIp('');
    setReason('');
    setTouched(false);
  };

  return (
    <>
      <form className="form ip-form" onSubmit={submit} noValidate>
        <label>IP address to whitelist
          <input
            value={ip}
            onChange={(e) => { setIp(e.target.value.trim()); setJustSent(null); }}
            onBlur={() => setTouched(true)}
            placeholder="e.g. 203.0.113.10"
            inputMode="decimal"
            autoComplete="off"
            aria-invalid={touched && !!(error || duplicate)}
            aria-describedby="ip-help"
          />
          {touched && error && <span className="field-error">{error}</span>}
          {touched && duplicate && <span className="field-error">You've already requested this IP for {env}.</span>}
          {!(touched && (error || duplicate)) && <span className="field-help" id="ip-help">The public IPv4 address your server sends API requests from.</span>}
        </label>
        <label>Environment
          <select value={env} onChange={(e) => setEnv(e.target.value)}>
            <option>Production</option>
            <option>Staging</option>
          </select>
        </label>
        <label className="span-2">Reason <span className="optional">(optional)</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. New payment server" maxLength={200} />
        </label>
        <div className="span-2 row">
          <button className="btn btn-primary" type="submit"><Icon name="shield" size={16} /> Submit request</button>
          {justSent && <span className="sent-note"><Icon name="check" size={14} /> Request for {justSent} sent. Your Integration Engineer has been notified.</span>}
        </div>
      </form>

      <h4 className="top-gap">Your requests</h4>
      {ipRequests.length === 0 ? (
        <p className="muted">No requests yet.</p>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>IP address</th><th>Environment</th><th>Reason</th><th>Submitted</th><th>Status</th></tr></thead>
            <tbody>
              {ipRequests.map((r) => (
                <tr key={r.id}>
                  <td><code>{r.ip}</code></td>
                  <td>{r.env}</td>
                  <td>{r.reason || <span className="muted">-</span>}</td>
                  <td>{new Date(r.submittedAt).toLocaleString()}</td>
                  <td><StatusPill status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
