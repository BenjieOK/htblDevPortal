import { useSyncExternalStore } from 'react';

const subscribe = (cb) => {
  window.addEventListener('popstate', cb);
  return () => window.removeEventListener('popstate', cb);
};

export function navigate(to) {
  const [path, hash] = to.split('#');
  if (path !== window.location.pathname) {
    window.history.pushState(null, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }
  requestAnimationFrame(() => {
    const el = hash && document.getElementById(hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  });
}

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname);

export function Link({ to, onClick, children, ...rest }) {
  const handle = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return <a href={to} onClick={handle} {...rest}>{children}</a>;
}
