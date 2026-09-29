import { useState } from 'react';
import Logo from './Logo.jsx';
import { Link, usePath } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';
import { navLinks } from '../data/site.js';
import ProfileMenu from './ProfileMenu.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const path = usePath();
  const { user } = usePortal();
  const close = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Logo />
        <nav className={`nav-links${open ? ' open' : ''}`}>
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={close} className={path.startsWith(l.to) ? 'active' : ''}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <ProfileMenu onNavigate={close} />
          ) : (
            <Link to="/login" className="btn btn-outline nav-login" onClick={close}>Log in</Link>
          )}
        </nav>
        <button className="nav-toggle" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </div>
    </header>
  );
}
