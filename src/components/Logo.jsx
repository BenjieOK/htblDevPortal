import { PORTAL_NAME } from '../data/site.js';
import { Link } from '../lib/router.jsx';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${PORTAL_NAME} home`}>
      <img className="logo-mark" src="/images/hubtel-logo.svg" alt="" />
      <span className="logo-text">{PORTAL_NAME}</span>
    </Link>
  );
}
