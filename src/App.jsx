import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Assistant from './components/Assistant.jsx';
import Home from './pages/Home.jsx';
import Docs from './pages/Docs.jsx';
import AiTools from './pages/AiTools.jsx';
import Plugins from './pages/Plugins.jsx';
import Community from './pages/Community.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import IpWhitelisting from './pages/IpWhitelisting.jsx';
import { Link, usePath } from './lib/router.jsx';
import { PortalProvider } from './lib/portal.jsx';

function Page({ path }) {
  if (path === '/') return <Home />;
  if (path === '/docs' || path === '/docs/') return <Docs />;
  if (path.startsWith('/docs/')) return <Docs id={path.slice(6)} />;
  if (path === '/ai') return <AiTools />;
  if (path === '/plugins') return <Plugins />;
  if (path === '/community') return <Community />;
  if (path === '/dashboard') return <Dashboard />;
  if (path === '/login') return <Login />;
  if (path === '/ip-whitelisting') return <IpWhitelisting />;
  return (
    <section className="section center-text container">
      <h1 className="h2">Page not found</h1>
      <p><Link to="/" className="link">Go home →</Link></p>
    </section>
  );
}

export default function App() {
  const path = usePath();
  const isLogin = path === '/login';
  return (
    <PortalProvider>
      {!isLogin && <Navbar />}
      <main>
        <Page path={path} />
      </main>
      {!path.startsWith('/docs') && !isLogin && <Footer />}
      {!isLogin && <Assistant />}
    </PortalProvider>
  );
}
