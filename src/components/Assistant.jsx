import { useEffect, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Markdown from './Markdown.jsx';
import { navigate } from '../lib/router.jsx';
import { localAnswer } from '../lib/localSearch.js';
import { BRAND } from '../data/site.js';

const STORAGE_KEY = 'assistant-chat';
const suggestions = [
  'How do I test a failed mobile money payment?',
  'What should I do after a 504 timeout?',
  'How do I get my server IP whitelisted?',
  'How do I connect the docs to Cursor?',
];

// Open the assistant from anywhere, optionally asking a question:
// window.dispatchEvent(new CustomEvent('open-assistant', { detail: { question } }))
export const openAssistant = (question) =>
  window.dispatchEvent(new CustomEvent('open-assistant', { detail: { question } }));

const askCommunityUrl = (q) => `/community?q=${encodeURIComponent(q)}#ask`;

function loadChat() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadChat);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const sendRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable; chat still works for this page view.
    }
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const onOpen = (e) => {
      setOpen(true);
      if (e.detail?.question) sendRef.current(e.detail.question);
    };
    window.addEventListener('open-assistant', onOpen);
    return () => window.removeEventListener('open-assistant', onOpen);
  }, []);

  const updateLast = (fn) => setMessages((ms) => ms.map((m, i) => (i === ms.length - 1 ? fn(m) : m)));

  const send = async (text) => {
    const question = text.trim();
    if (!question || busy) return;
    const history = [...messages, { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '', question }]);
    setInput('');
    setBusy(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
          page: window.location.pathname,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(`status ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        updateLast((m) => ({ ...m, content: m.content + chunk }));
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        updateLast((m) => ({ ...m, content: m.content || '_Stopped._' }));
      } else {
        updateLast((m) => ({ ...m, content: localAnswer(question), offline: true }));
      }
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  };
  sendRef.current = send;

  const rate = (index, rating) => setMessages((ms) => ms.map((m, i) => (i === index ? { ...m, rating } : m)));
  const lastQuestion = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const closeOnMobile = () => window.matchMedia('(max-width: 560px)').matches && setOpen(false);

  return (
    <>
      <button
        className={`assistant-fab${open ? ' hidden' : ''}`}
        onClick={() => setOpen(true)}
        aria-label="Open the developer assistant"
      >
        <Icon name="sparkle" size={20} /> <span>Ask AI</span>
      </button>

      {open && (
        <section className="assistant" role="dialog" aria-label={`${BRAND} Developer Assistant`}>
          <header className="assistant-head">
            <div className="assistant-avatar"><Icon name="sparkle" size={18} /></div>
            <div>
              <strong>Developer Assistant</strong>
              <span>Answers from the docs and community</span>
            </div>
            {messages.length > 0 && (
              <button className="assistant-icon-btn" onClick={() => setMessages([])} disabled={busy} title="New chat" aria-label="New chat">↺</button>
            )}
            <button className="assistant-icon-btn" onClick={() => setOpen(false)} aria-label="Close">×</button>
          </header>

          <div className="assistant-body" ref={listRef} aria-live="polite">
            {messages.length === 0 ? (
              <div className="assistant-empty">
                <p>Hi! Ask me anything about the {BRAND} APIs. I'll answer from the docs and point you to community threads where other developers have solved the same problem.</p>
                <div className="assistant-suggest">
                  {suggestions.map((s) => <button key={s} onClick={() => send(s)}>{s}</button>)}
                </div>
              </div>
            ) : (
              messages.map((m, i) =>
                m.role === 'user' ? (
                  <div className="bubble bubble-user" key={i}>{m.content}</div>
                ) : (
                  <div className="bubble bubble-bot" key={i}>
                    {m.content ? <Markdown text={m.content} onLink={closeOnMobile} /> : <span className="typing"><i /><i /><i /></span>}
                    {m.content && !(busy && i === messages.length - 1) && (
                      <div className="bubble-foot">
                        {m.offline && <span className="pill pill-wait">Offline search</span>}
                        {m.rating ? (
                          m.rating === 'up' ? (
                            <span className="muted">Thanks for the feedback!</span>
                          ) : (
                            <button className="link-btn" onClick={() => { navigate(askCommunityUrl(m.question || lastQuestion)); closeOnMobile(); }}>
                              Ask the community instead →
                            </button>
                          )
                        ) : (
                          <span className="rate">
                            Helpful?
                            <button onClick={() => rate(i, 'up')} aria-label="Helpful">👍</button>
                            <button onClick={() => rate(i, 'down')} aria-label="Not helpful">👎</button>
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              )
            )}
          </div>

          <form
            className="assistant-input"
            onSubmit={(e) => { e.preventDefault(); send(input); }}
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={4000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); }
              }}
              placeholder="Ask about endpoints, errors, testing…"
              aria-label="Your question"
            />
            {busy ? (
              <button type="button" className="assistant-send" onClick={() => abortRef.current?.abort()} aria-label="Stop">■</button>
            ) : (
              <button type="submit" className="assistant-send" disabled={!input.trim()} aria-label="Send"><Icon name="arrow" size={18} /></button>
            )}
          </form>
          <footer className="assistant-foot">
            <button className="link-btn" onClick={() => { navigate(askCommunityUrl(lastQuestion)); closeOnMobile(); }}>
              <Icon name="users" size={14} /> Ask the community
            </button>
            <span className="muted">AI can make mistakes. Check the docs.</span>
          </footer>
        </section>
      )}
    </>
  );
}
