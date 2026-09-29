import { useEffect, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { SectionHead } from '../components/Cards.jsx';
import { openAssistant } from '../components/Assistant.jsx';
import { threads } from '../data/community.js';

const channels = [
  { icon: 'sparkle', title: 'Developer Assistant', text: 'Get instant answers from the docs and past community threads, any time.', cta: 'Ask the assistant', onClick: () => openAssistant() },
  { icon: 'message', title: 'Discussion forum', text: 'Ask questions and search answers from other developers.', cta: 'Visit the forum' },
  { icon: 'users', title: 'Community chat', text: 'Talk with other developers in real time.', cta: 'Join the chat' },
  { icon: 'calendar', title: 'Office hours', text: 'Monthly live Q&A with our integration engineers.', cta: 'See the schedule' },
];

function AskForm() {
  const [question, setQuestion] = useState('');
  const [posted, setPosted] = useState(false);

  // The assistant links here with ?q=… so the question carries over.
  useEffect(() => {
    const read = () => {
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) { setQuestion(q); setPosted(false); }
    };
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  if (posted) {
    return <div className="notice notice-ok"><Icon name="check" /> Posted! You'll get an email when someone replies.</div>;
  }
  return (
    <form className="form card-form" onSubmit={(e) => { e.preventDefault(); setPosted(true); }}>
      <label>Your question
        <textarea required rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Describe what you're trying to do and what happened." />
      </label>
      <label>Topic
        <select defaultValue="Payments">
          <option>Payments</option><option>Bill payments</option><option>Verification</option><option>Messaging</option>
          <option>IP whitelisting</option><option>Plugins</option><option>AI tools</option><option>Other</option>
        </select>
      </label>
      <p className="small muted">Don't include secret keys or customer data. Our engineers read every question.</p>
      <div className="row">
        <button className="btn btn-primary" type="submit">Post to the community</button>
        <button className="btn btn-ghost" type="button" onClick={() => question.trim() && openAssistant(question)} disabled={!question.trim()}>
          Try the assistant first
        </button>
      </div>
    </form>
  );
}

export default function Community() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <span className="eyebrow">Developer community</span>
            <h1>Build with <span className="accent">other developers</span></h1>
            <p className="lead">Get instant answers from the AI assistant, help from teams already live, and a direct line to our engineers.</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => openAssistant()}><Icon name="sparkle" size={16} /> Ask the assistant</button>
              <a href="#ask" className="btn btn-ghost">Post a question →</a>
            </div>
          </div>
          <img src="/images/team.png" alt="Developers reviewing code together" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="grid-4">
            {channels.map((c) => (
              <div className="feature" key={c.title}>
                <div className="icon"><Icon name={c.icon} /></div>
                <h4>{c.title}</h4>
                <p>{c.text}</p>
                {c.onClick
                  ? <button className="link link-btn" onClick={c.onClick}>{c.cta} →</button>
                  : <a href="#" className="link">{c.cta} →</a>}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow="Recent discussions" title="What people are talking about" text="The assistant links to these threads when they answer your question." />
          <ul className="threads">
            {threads.map((t) => (
              <li key={t.id} id={`thread-${t.id}`}>
                <details>
                  <summary>
                    <span className="thread-title">{t.title}</span>
                    <span className="thread-meta">
                      <span className="tag">{t.tag}</span>
                      {t.solved && <span className="pill pill-ok"><Icon name="check" size={12} /> Solved</span>}
                      <span className="muted">{t.replies} replies</span>
                    </span>
                  </summary>
                  <p className="thread-answer"><strong>{t.solved ? 'Accepted answer: ' : 'Summary: '}</strong>{t.answer}</p>
                </details>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" id="ask">
        <div className="container narrow">
          <SectionHead center eyebrow="Ask the community" title="Still stuck? Post a question" text="Other developers and our integration engineers will reply." />
          <AskForm />
        </div>
      </section>

      <section className="section section-tint" id="feedback">
        <div className="container narrow">
          <SectionHead center eyebrow="Feedback" title="Tell us what to improve" text="Every message goes straight to the developer experience team." />
          {sent ? (
            <div className="notice notice-ok"><Icon name="check" /> Thanks! We've received your feedback.</div>
          ) : (
            <form className="form card-form" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <label>Topic
                <select defaultValue="Docs">
                  <option>Docs</option><option>Sandbox</option><option>IP whitelisting</option><option>Plugins</option><option>AI tools</option><option>Other</option>
                </select>
              </label>
              <label>Your feedback<textarea required rows={4} placeholder="What was hard, missing or confusing?" /></label>
              <label>Email (optional)<input type="email" placeholder="you@company.com" /></label>
              <button className="btn btn-primary" type="submit">Send feedback</button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}
