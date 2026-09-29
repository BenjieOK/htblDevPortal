import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Serves POST /api/chat during `npm run dev` and `npm run preview`,
// using the same handler as the Vercel function in api/chat.js.
function chatApi() {
  const mount = (server, load) => {
    server.middlewares.use('/api/chat', async (req, res) => {
      const { handleChat } = await load();
      await handleChat(req, res);
    });
  };
  return {
    name: 'chat-api',
    configureServer(server) {
      mount(server, () => server.ssrLoadModule('/server/chat.js'));
    },
    configurePreviewServer(server) {
      mount(server, () => import('./server/chat.js'));
    },
  };
}

export default defineConfig(({ mode }) => {
  // Make ANTHROPIC_API_KEY from .env available to the server-side handler only.
  const env = loadEnv(mode, process.cwd(), 'ANTHROPIC_');
  for (const [k, v] of Object.entries(env)) process.env[k] ??= v;

  return {
    plugins: [react(), chatApi()],
  };
});
