import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import { Link } from '../lib/router.jsx';
import { usePortal } from '../lib/portal.jsx';

const initials = (name) => name.split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export function BusinessStatus({ status }) {
  return status === 'verified'
    ? <span className="pill pill-ok">Verified</span>
    : <span className="pill pill-wait">Verification pending</span>;
}

export default function ProfileMenu({ onNavigate }) {
  const { user, business, businesses, switchBusiness, logout } = usePortal();
  const [open, setOpen] = useState(false);
  const [switching, setSwitching] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open) setSwitching(false);
  }, [open]);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  return (
    <div className="profile" ref={ref}>
      <button
        className="profile-btn"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
      >
        <span className="avatar">{initials(user.name)}</span>
        <span className="profile-btn-text">
          <strong>{user.name}</strong>
          <span>{business?.name}</span>
        </span>
        <svg className="chev" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
      </button>

      {open && (
        <div className="profile-menu" role="menu">
          <div className="profile-head">
            <span className="avatar avatar-lg">{initials(user.name)}</span>
            <div>
              <strong>{user.name}</strong>
              <span>{user.phone || user.email}</span>
            </div>
          </div>

          <div className="profile-biz">
            <span className="profile-label">Current business</span>
            <div className="profile-biz-row">
              <div>
                <strong>{business?.name}</strong>
                <span>{business?.role}</span>
              </div>
              {business && <BusinessStatus status={business.status} />}
            </div>
          </div>

          <button
            className="profile-item"
            role="menuitem"
            aria-expanded={switching}
            onClick={() => setSwitching((s) => !s)}
          >
            <Icon name="users" size={18} /> Switch business
            <svg className={`chev push${switching ? ' up' : ''}`} viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          {switching && (
            <div className="biz-list" role="group" aria-label="Your businesses">
              {businesses.map((b) => (
                <button
                  key={b.id}
                  role="menuitemradio"
                  aria-checked={b.id === business?.id}
                  className={`biz-option${b.id === business?.id ? ' current' : ''}`}
                  onClick={() => { switchBusiness(b.id); close(); }}
                >
                  <span className="biz-initial">{b.name[0]}</span>
                  <span className="biz-text"><strong>{b.name}</strong><span>{b.role}{b.status !== 'verified' && ' · pending'}</span></span>
                  {b.id === business?.id && <Icon name="check" size={16} />}
                </button>
              ))}
              <Link to="/login#onboarding" className="biz-option add" role="menuitem" onClick={close}>
                <span className="biz-initial">+</span> Add a business
              </Link>
            </div>
          )}

          <div className="profile-sep" />
          <Link to="/dashboard" className="profile-item" role="menuitem" onClick={close}><Icon name="chart" size={18} /> Dashboard</Link>
          <Link to="/dashboard" className="profile-item" role="menuitem" onClick={close}><Icon name="key" size={18} /> Test keys</Link>
          <Link to="/ip-whitelisting" className="profile-item" role="menuitem" onClick={close}><Icon name="shield" size={18} /> IP whitelisting</Link>
          <div className="profile-sep" />
          <button className="profile-item danger" role="menuitem" onClick={() => { close(); logout(); }}>
            <Icon name="logout" size={18} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
