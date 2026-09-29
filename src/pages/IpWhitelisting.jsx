import Icon from '../components/Icon.jsx';
import { IpRequestForm } from '../components/IpWhitelist.jsx';
import { Link } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';

const steps = [
  { title: 'Submit your IP', text: 'Enter the public IP of your server and choose the environment.' },
  { title: 'Engineer is notified', text: 'Your assigned Integration Engineer gets the request straight away.' },
  { title: 'Approved or rejected', text: 'The status updates here and you get an email.' },
];

export default function IpWhitelisting() {
  const { user, business, requireLogin } = usePortal();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">IP whitelisting</span>
          <h1>Request <span className="accent">IP whitelisting</span></h1>
          <p className="lead">Live payment requests are only accepted from whitelisted IPs. Submit your server's IP here. No support ticket needed.</p>
        </div>
      </section>

      <section className="section">
        <div className="container ip-layout">
          <div className="panel">
            {user ? (
              <>
                <div className="panel-head">
                  <h3>New request</h3>
                  <span className="muted small">For <strong>{business?.name}</strong> · {user.phone || user.email}</span>
                </div>
                <IpRequestForm />
              </>
            ) : (
              <div className="locked">
                <div className="icon icon-center"><Icon name="lock" /></div>
                <h3>Log in to request IP whitelisting</h3>
                <p>Only logged-in businesses can submit IP addresses, so that each request is linked to a verified account and its Integration Engineer.</p>
                <div className="row center top-gap">
                  <button className="btn btn-primary" onClick={() => requireLogin('/ip-whitelisting')}>Log in</button>
                  <Link to="/login?next=%2Fip-whitelisting#onboarding" className="btn btn-ghost">New business? Get onboarded →</Link>
                </div>
              </div>
            )}
          </div>

          <aside className="ip-aside">
            <h4>How it works</h4>
            <ol className="ip-steps">
              {steps.map((s, i) => (
                <li key={s.title}><span>{i + 1}</span><div><strong>{s.title}</strong><p>{s.text}</p></div></li>
              ))}
            </ol>
            <div className="ip-tips">
              <h4>Before you submit</h4>
              <ul className="doc-list">
                <li>Use your server's <strong>public</strong> IP, not a private one like 192.168.x.x.</li>
                <li>On cloud hosting, set up a static outbound IP first.</li>
                <li>Sandbox requests with test keys don't need whitelisting.</li>
              </ul>
              <Link to="/docs/ip-whitelisting" className="link">Read the IP whitelisting guide →</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
