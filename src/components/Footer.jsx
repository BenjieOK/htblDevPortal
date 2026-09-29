import Logo from './Logo.jsx';
import Icon from './Icon.jsx';
import { Link } from '../lib/router.jsx';
import { BRAND, footerColumns, socials } from '../data/site.js';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Open docs, a sandbox with test keys, and AI-ready integration guides.</p>
          <div className="stores">
            {['Google Play', 'App Store', 'AppGallery'].map((s) => (
              <a href="#" className="store" key={s}>{s}</a>
            ))}
          </div>
        </div>
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h5>{col.title}</h5>
            {col.links.map((l) =>
              l.external ? <a key={l.label} href={l.to}>{l.label}</a> : <Link key={l.label} to={l.to}>{l.label}</Link>
            )}
          </div>
        ))}
      </div>
      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} {BRAND}. All rights reserved.</p>
        <div className="socials">
          {socials.map((s) => (
            <a href="#" aria-label={s.label} key={s.label}><Icon name={s.icon} /></a>
          ))}
        </div>
      </div>
    </footer>
  );
}
