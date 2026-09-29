// Sample community threads for the prototype. The assistant uses these to
// point developers at existing discussions. Replace with data from the real forum.
export const threads = [
  {
    id: 'momo-timeout-retry',
    title: 'Handling timeouts on mobile money: retry or check status?',
    tag: 'Payments',
    replies: 12,
    solved: true,
    answer: 'Do not resend the payment after a 504. Call GET /v1/transactions/{transactionId} (or wait for the webhook). Only create a new payment, with a new clientReference, once the status is failed.',
  },
  {
    id: 'laravel-webhooks',
    title: 'Sharing a Laravel package for webhooks',
    tag: 'Show & tell',
    replies: 8,
    solved: false,
    answer: 'A community member shared a Laravel package that verifies and queues webhook callbacks, with idempotency by transactionId.',
  },
  {
    id: 'woocommerce-pending',
    title: 'WooCommerce plugin: orders stuck on pending',
    tag: 'Plugins',
    replies: 5,
    solved: true,
    answer: 'The callback URL was blocked by a security plugin. Allow-list the webhook route and make sure the site is served over HTTPS.',
  },
  {
    id: 'mcp-cursor-tips',
    title: 'Using the MCP server with Cursor: tips',
    tag: 'AI tools',
    replies: 17,
    solved: false,
    answer: 'Tips: add the MCP server at project level, install the Agent Skill as a Cursor rule, and ask the agent to test failure and exception scenarios in the sandbox.',
  },
  {
    id: 'ip-whitelist-cloud',
    title: 'IP whitelisting when my server IP changes (cloud hosting)',
    tag: 'IP whitelisting',
    replies: 9,
    solved: true,
    answer: 'Use a static outbound IP (NAT gateway or reserved IP) and request whitelisting for that address on the IP whitelisting page. Sandbox requests do not need whitelisting.',
  },
  {
    id: 'sender-id-approval',
    title: 'How long does SMS sender ID approval take?',
    tag: 'Messaging',
    replies: 6,
    solved: true,
    answer: 'Sender IDs are reviewed before use. Until approval, send requests fail with sender_not_registered. Register the sender ID early.',
  },
];

export const threadLink = (t) => `/community#thread-${t.id}`;
