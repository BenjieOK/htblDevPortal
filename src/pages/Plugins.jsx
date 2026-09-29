import Icon from '../components/Icon.jsx';
import { SectionHead } from '../components/Cards.jsx';
import { Link } from '../lib/router.jsx';
import { BRAND } from '../data/site.js';

const plugins = [
  {
    icon: 'cart',
    name: 'WooCommerce',
    platform: 'WordPress',
    text: 'Add mobile money and card payments to your WooCommerce checkout.',
    steps: [
      `In WordPress, go to Plugins → Add New and search for "${BRAND} Payments".`,
      'Install and activate the plugin.',
      `Go to WooCommerce → Settings → Payments and turn on ${BRAND}.`,
      'Paste your API keys from the dashboard, then save.',
    ],
    cta: 'Download for WordPress',
  },
  {
    icon: 'bag',
    name: 'Shopify',
    platform: 'Shopify App Store',
    text: 'Let Shopify customers pay with mobile money and cards.',
    steps: [
      `Find "${BRAND} Payments" in the Shopify App Store.`,
      'Click Install and approve the permissions.',
      `Go to Settings → Payments and activate ${BRAND}.`,
      'Paste your API keys from the dashboard, then save.',
    ],
    cta: 'Get it on Shopify',
  },
];

export default function Plugins() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">Plugins</span>
          <h1>Accept payments on your store <span className="accent">without code</span></h1>
          <p className="lead">Official plugins for WooCommerce and Shopify. Built for SMEs and startups that don't have a developer on the team.</p>
        </div>
      </section>
      <section className="section">
        <div className="container grid-2">
          {plugins.map((p) => (
            <article className="plugin" key={p.name}>
              <div className="plugin-head">
                <div className="icon"><Icon name={p.icon} /></div>
                <div>
                  <h3>{p.name}</h3>
                  <span className="muted">{p.platform}</span>
                </div>
                <span className="pill">Official</span>
              </div>
              <p>{p.text}</p>
              <ol className="plugin-steps">{p.steps.map((s) => <li key={s}>{s}</li>)}</ol>
              <a href="#" className="btn btn-primary">{p.cta}</a>
            </article>
          ))}
        </div>
      </section>
      <section className="section section-tint">
        <div className="container">
          <SectionHead center eyebrow="Included" title="What every plugin gives you" />
          <div className="grid-4">
            {[
              ['phone', 'Mobile money', 'Every major network at checkout.'],
              ['card', 'Cards', 'Visa and Mastercard with 3-D Secure.'],
              ['check', 'Automatic order updates', 'Orders are marked paid when payment completes.'],
              ['key', 'Test mode', 'Try it with test keys before going live.'],
            ].map(([icon, title, text]) => (
              <div className="feature" key={title}><div className="icon"><Icon name={icon} /></div><h4>{title}</h4><p>{text}</p></div>
            ))}
          </div>
          <p className="center-text small top-gap">Using a different platform? <Link to="/docs/card-checkout" className="link">Use hosted checkout →</Link></p>
        </div>
      </section>
    </>
  );
}
