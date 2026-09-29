// Vercel serverless function for the Developer Assistant.
import { handleChat } from '../server/chat.js';

export const config = { maxDuration: 60 };

export default function handler(req, res) {
  return handleChat(req, res);
}
