import { useState } from 'react';
import Icon from '../components/Icon.jsx';
import Logo from '../components/Logo.jsx';
import { Link, navigate } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';
import { BRAND } from '../data/site.js';

const onboardingSteps = [
  { title: 'Create your business account', text: `Sign up on ${BRAND} with your business name, email and phone number.` },
  { title: 'Submit your business documents', text: 'Upload the documents below so we can verify your business (KYC).' },
  { title: 'Get verified', text: 'Our team reviews your documents and contacts you if anything is missing.' },
  { title: 'Log in here and start building', text: 'Use the same login on the developer portal to get test keys, request IP whitelisting and go live.' },
];

const documents = [
  'Business registration certificate',
  'Ghana Card of the business owner or director',
  'Tax Identification Number (TIN)',
  'Settlement bank account or mobile money wallet',
];
const DEMO_OTP = '123456';

// Only allow redirects to paths on this site.
function nextPath() {
  const next = new URLSearchParams(window.location.search).get('next');
  return next && next.startsWith('/') && !next.startsWith('//') ? next : '/dashboard';
}

export default function Login() {
  const { user, login, logout } = usePortal();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [error, setError] = useState('');

  const requestOtp = (e) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15) {
      setError('Enter a valid phone number.');
      return;
    }
    setPhone(phone.trim());
    setError('');
    setStep('otp');
  };

  const verifyOtp = (e) => {
    e.preventDefault();
    if (otp !== DEMO_OTP) {
      setError('That code is not correct. Enter the demo code shown below.');
      return;
    }
    login(phone);
    navigate(nextPath());
  };

  return (
    <section className="login-page">
      <div className="login-grid">
        <aside className="login-visual">
          <Link to="/docs" className="login-back-link"><Icon name="arrow" size={16} /> Back to docs</Link>
          <div className="login-scene">
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=85"
              alt="A software developer working at a computer"
            />
            <div className="code-window code-window-back" aria-hidden="true">
              <div className="code-window-bar"><i /><i /><i /><span>payments.ts</span></div>
              <pre><code><span className="code-purple">const</span> payment = <span className="code-yellow">await</span> hubtel.<span className="code-blue">charges</span>.<span className="code-green">create</span>({'{'}</code>{'\n'}  amount: <span className="code-orange">125.00</span>,{'\n'}  currency: <span className="code-green">'GHS'</span>,{'\n'}  reference: <span className="code-green">'order_4821'</span>{'\n'}{'}'});</pre>
            </div>
            <div className="code-window code-window-front" aria-hidden="true">
              <div className="code-window-bar"><i /><i /><i /><span>terminal</span></div>
              <pre><code><span className="code-green">$</span> npm run dev{'\n'}<span className="code-muted">ready</span> <span className="code-blue">localhost:5173</span>{'\n'}<span className="code-green">$</span> _</code></pre>
            </div>
          </div>
          <div className="login-visual-copy">
            <span className="eyebrow">Your next build starts here</span>
            <h1>Build what moves<br />business forward.</h1>
            <p>One developer account. Everything you need to build with Hubtel.</p>
            <a href="#onboarding" className="login-onboard-link">New to Hubtel? Get your business onboarded <span aria-hidden="true">→</span></a>
          </div>
        </aside>

        <div className="login-side">
        <div className="login-card">
          <Logo />
          {user ? (
            <>
              <h1 className="h2 top-gap">You're logged in</h1>
              <p>Signed in as <strong>{user.phone || user.email}</strong>.</p>
              <div className="row top-gap">
                <Link to={nextPath()} className="btn btn-primary">Continue</Link>
                <button className="btn btn-ghost" onClick={logout}>Log out</button>
              </div>
            </>
          ) : step === 'otp' ? (
            <>
              <h1 className="h2 top-gap">Verify your phone</h1>
              <p>Enter the 6-digit code for <strong>{phone}</strong>.</p>
              <p className="otp-demo-note" role="note">Demo mode: SMS delivery is not configured. Use <strong>{DEMO_OTP}</strong> to continue.</p>
              <form className="form top-gap" onSubmit={verifyOtp} noValidate>
                <label htmlFor="login-otp">One-time code
                  <input
                    id="login-otp"
                    className="otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
                    placeholder="6-digit code"
                    maxLength={6}
                    autoFocus
                  />
                </label>
                {error && <span className="field-error" role="alert">{error}</span>}
                <button className="btn btn-primary btn-block" type="submit">Verify and log in</button>
                <button className="otp-back" type="button" onClick={() => { setStep('phone'); setOtp(''); setError(''); }}>Use a different phone number</button>
              </form>
            </>
          ) : (
            <>
              <h1 className="h2 top-gap">Log in</h1>
              <p>Enter the mobile number linked to your {BRAND} business account.</p>
              <form className="form top-gap" onSubmit={requestOtp} noValidate>
                <label htmlFor="login-phone">Phone number
                  <input id="login-phone" type="tel" inputMode="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setError(''); }} placeholder="+233 24 123 4567" autoComplete="tel" autoFocus />
                </label>
                {error && <span className="field-error" role="alert">{error}</span>}
                <button className="btn btn-primary btn-block" type="submit">Send OTP</button>
              </form>
            </>
          )}

          <div className="login-why">
            <h4>What you can do after logging in</h4>
            <ul className="checks">
              <li>Generate sandbox test keys</li>
              <li>Request IP whitelisting</li>
              <li>Get live keys and go to production</li>
            </ul>
          </div>
          <p className="modal-note"><Icon name="unlock" size={14} /> You don't need to log in to <Link to="/docs" className="link">read the docs</Link>.</p>
        </div>
        </div>
      </div>

      <div className="container onboard-wrap">
        <div className="onboard" id="onboarding">
          <span className="eyebrow">New to {BRAND}?</span>
          <h2>Get your business onboarded</h2>
          <p>
            To get API keys, your business needs a verified {BRAND} account. If your business already uses
            {` ${BRAND}`}, just log in with that account. There's nothing new to set up.
          </p>

          <ol className="onboard-steps">
            {onboardingSteps.map((s, i) => (
              <li key={s.title}>
                <span>{i + 1}</span>
                <div><strong>{s.title}</strong><p>{s.text}</p></div>
              </li>
            ))}
          </ol>

          <div className="onboard-docs">
            <h4><Icon name="file" size={18} /> Documents you'll need</h4>
            <ul>{documents.map((d) => <li key={d}>{d}</li>)}</ul>
          </div>

          <div className="row top-gap">
            <a href="#" className="btn btn-primary">Start onboarding</a>
            <a href="#" className="btn btn-outline-soft">Talk to our team</a>
          </div>
          <p className="small muted top-gap">
            While you wait for verification, you can <Link to="/docs" className="link">explore the docs</Link> and
            {' '}<Link to="/community" className="link">ask the community</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
