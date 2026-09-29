// Brand and URLs. Change these to rebrand the whole portal, including the
// generated llms.txt, Markdown docs and Agent Skill.
export const BRAND = 'Hubtel';
export const PORTAL_NAME = 'Hubtel Developers Portal';
export const SLUG = BRAND.toLowerCase();
export const DOCS_URL = 'https://developers.hubtel.com';
export const API_BASE = 'https://api.hubtel.com';
export const MCP_URL = 'https://mcp.hubtel.com/mcp';

export const navLinks = [
  { to: '/docs', label: 'Docs' },
  { to: '/ai', label: 'AI tools' },
  { to: '/plugins', label: 'Plugins' },
  { to: '/community', label: 'Community' },
  { to: '/ip-whitelisting', label: 'IP whitelisting' },
];

export const footerColumns = [
  {
    title: 'Docs',
    links: [
      { to: '/docs/introduction', label: 'Introduction' },
      { to: '/docs/sandbox', label: 'Sandbox & test keys' },
      { to: '/docs/ip-whitelisting', label: 'IP whitelisting guide' },
      { to: '/docs/webhooks', label: 'Webhooks' },
    ],
  },
  {
    title: 'Build',
    links: [
      { to: '/ai', label: 'AI tools (MCP & Skills)' },
      { to: '/plugins', label: 'WooCommerce & Shopify' },
      { to: '/llms.txt', label: 'llms.txt', external: true },
      { to: '/ip-whitelisting', label: 'Request IP whitelisting' },
      { to: '/login', label: 'Log in / get onboarded' },
    ],
  },
  {
    title: 'Community',
    links: [
      { to: '/community', label: 'Developer community' },
      { to: '/community#feedback', label: 'Share feedback' },
      { to: '#', label: 'Status' },
      { to: '#', label: 'Contact support' },
    ],
  },
];

export const socials = [
  { icon: 'x', label: 'X' },
  { icon: 'linkedin', label: 'LinkedIn' },
  { icon: 'instagram', label: 'Instagram' },
  { icon: 'youtube', label: 'YouTube' },
];
