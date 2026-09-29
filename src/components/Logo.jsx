import { PORTAL_NAME } from '../data/site.js';
import { Link } from '../lib/router.jsx';

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label={`${PORTAL_NAME} home`}>
      <span className="logo-mark">H</span>
      <span className="logo-text">{PORTAL_NAME}</span>
    </Link>
  );
}
