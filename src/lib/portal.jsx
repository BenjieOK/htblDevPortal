// Prototype login and portal state: the logged-in user, their businesses, and
// per-business test keys and IP whitelist requests. Stored in localStorage for
// the demo; replace with the real auth and API.
import { createContext, useContext, useEffect, useState } from 'react';
import { navigate } from './router.jsx';

const STORAGE_KEY = 'portal-demo-state-v2';
const PortalContext = createContext(null);
const EMPTY = { user: null, businesses: [], businessId: null, testKeys: {}, ipRequests: [] };

// Demo businesses linked to every account, so "Switch business" has something to switch between.
const demoBusinesses = [
  { id: 'biz-accra-fresh', name: 'Accra Fresh Foods', role: 'Owner', status: 'verified' },
  { id: 'biz-kumasi-crafts', name: 'Kumasi Crafts Ltd', role: 'Developer', status: 'verified' },
  { id: 'biz-tema-logistics', name: 'Tema Logistics', role: 'Admin', status: 'pending' },
];

function load() {
  try {
    return { ...EMPTY, ...JSON.parse(localStorage.getItem(STORAGE_KEY)) };
  } catch {
    return EMPTY;
  }
}

const randomKey = (prefix) =>
  prefix + Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join('');

export function PortalProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Storage unavailable (private mode); state still works for this visit.
    }
  }, [state]);

  const update = (patch) => setState((s) => ({ ...s, ...(typeof patch === 'function' ? patch(s) : patch) }));

  const business = state.businesses.find((b) => b.id === state.businessId) || null;

  const api = {
    user: state.user,
    businesses: state.businesses,
    business,
    // Keys and requests belong to the business that is currently selected.
    testKey: business ? state.testKeys[business.id] || null : null,
    ipRequests: state.ipRequests.filter((r) => r.businessId === state.businessId),

    // Sends the user to the login page, then back to `next` after logging in.
    requireLogin: (next = window.location.pathname) => navigate(`/login?next=${encodeURIComponent(next)}`),
    login: (phone) =>
      update({ user: { phone, name: 'Developer' }, businesses: demoBusinesses, businessId: demoBusinesses[0].id }),
    logout: () => {
      setState(EMPTY);
      navigate('/');
    },
    switchBusiness: (id) => update({ businessId: id }),
    generateTestKey: () =>
      update((s) => ({ testKeys: { ...s.testKeys, [s.businessId]: randomKey('sk_test_') } })),
    submitIpRequest: (req) => {
      const id = Date.now();
      update((s) => ({
        ipRequests: [
          { ...req, id, businessId: s.businessId, status: 'pending', submittedAt: new Date().toISOString() },
          ...s.ipRequests,
        ],
      }));
      // Demo only: simulate the Integration Engineer approving the request.
      setTimeout(() => {
        update((s) => ({
          ipRequests: s.ipRequests.map((r) => (r.id === id ? { ...r, status: 'approved', reviewer: 'Integration Engineer' } : r)),
        }));
      }, 6000);
    },
  };

  return <PortalContext.Provider value={api}>{children}</PortalContext.Provider>;
}

export const usePortal = () => useContext(PortalContext);
