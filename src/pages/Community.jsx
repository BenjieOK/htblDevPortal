import { useEffect, useId, useState } from 'react';
import Icon from '../components/Icon.jsx';
import { SectionHead } from '../components/Cards.jsx';
import { openAssistant } from '../components/Assistant.jsx';
import ImageAttachment from '../components/ImageAttachment.jsx';
import { usePortal } from '../lib/portal.jsx';
import { threads } from '../data/community.js';

const POSTS_KEY = 'hubtel-community-posts-v1';
const FEEDBACK_KEY = 'hubtel-community-feedback-v1';
const MEMBER_KEY = 'hubtel-community-member-v1';

const channels = [
  { icon: 'sparkle', title: 'AI Assistant', text: 'Get instant answers from the docs and past community threads, any time.', cta: 'Ask AI', onClick: () => openAssistant() },
  { icon: 'message', title: 'Discussion forum', text: 'Ask questions and search answers from other developers.', cta: 'Browse discussions', href: '#discussions' },
  { icon: 'users', title: 'Community chat', text: 'Talk with other developers in real time.', cta: null },
  { icon: 'calendar', title: 'Office hours', text: 'Meet with our integration engineers from 8:00 a.m. to 5:00 p.m. After hours, the integration support team is available 24 hours a day.', cta: 'Ask a question', href: '#ask' },
];

function readStorage(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function readMemberName() {
  try {
    return localStorage.getItem(MEMBER_KEY) || '';
  } catch {
    return '';
  }
}

function writeStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function CommentForm({ onSubmit }) {
  const inputId = useId();
  const [text, setText] = useState('');
  const [attachment, setAttachment] = useState(null);
  return (
    <form className="form comment-form" onSubmit={(event) => { event.preventDefault(); onSubmit(text, attachment); setText(''); setAttachment(null); }}>
      <label htmlFor={inputId}>Add a comment</label>
      <textarea id={inputId} required rows={2} maxLength={1200} value={text} onChange={(event) => setText(event.target.value)} placeholder="Share a helpful reply…" />
      <ImageAttachment attachment={attachment} onChange={setAttachment} />
      <button className="btn btn-primary btn-sm" type="submit" disabled={!text.trim()}>Comment</button>
    </form>
  );
}

export default function Community() {
  const { user } = usePortal();
  const [posts, setPosts] = useState(() => {
    const saved = readStorage(POSTS_KEY, null);
    return Array.isArray(saved) ? saved : threads.map((thread) => ({ ...thread, comments: [] }));
  });
  const [feedback, setFeedback] = useState(() => readStorage(FEEDBACK_KEY, []));
  const [memberName, setMemberName] = useState(readMemberName);
  const [joinName, setJoinName] = useState(() => user?.name || '');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Payments');
  const [question, setQuestion] = useState(() => new URLSearchParams(window.location.search).get('q') || '');
  const [postImage, setPostImage] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackTopic, setFeedbackTopic] = useState('Docs');
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackImage, setFeedbackImage] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const readQuestion = () => {
      const value = new URLSearchParams(window.location.search).get('q');
      if (value) setQuestion(value);
    };
    window.addEventListener('popstate', readQuestion);
    return () => window.removeEventListener('popstate', readQuestion);
  }, []);

  const join = (event) => {
    event.preventDefault();
    const name = joinName.trim();
    if (!name) return;
    try {
      localStorage.setItem(MEMBER_KEY, name);
      setMemberName(name);
      setNotice(`Welcome to the community, ${name}.`);
    } catch {
      setNotice('Your browser could not save your membership. Check its storage settings and try again.');
    }
  };

  const addComment = (postId, text, attachment) => {
    const updated = posts.map((post) => post.id === postId
      ? { ...post, comments: [...(post.comments || []), { id: crypto.randomUUID(), author: memberName, text: text.trim(), attachment }] }
      : post);
    setPosts(updated);
    setNotice(writeStorage(POSTS_KEY, updated) ? 'Your comment has been added.' : 'Your comment is visible, but could not be saved in this browser.');
  };

  const addPost = (event) => {
    event.preventDefault();
    const post = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: memberName,
      tag: topic,
      replies: 0,
      solved: false,
      body: question.trim(),
      attachment: postImage,
      comments: [],
    };
    const updated = [post, ...posts];
    setPosts(updated);
    const saved = writeStorage(POSTS_KEY, updated);
    setTitle('');
    setQuestion('');
    setPostImage(null);
    setNotice(saved ? 'Your discussion has been posted.' : 'Your discussion is visible, but could not be saved in this browser.');
  };

  const addFeedback = (event) => {
    event.preventDefault();
    const entry = {
      id: crypto.randomUUID(),
      author: memberName || user?.name || 'Community member',
      topic: feedbackTopic,
      text: feedbackText.trim(),
      email: feedbackEmail.trim() || null,
      attachment: feedbackImage,
      createdAt: new Date().toISOString(),
    };
    const updated = [entry, ...feedback];
    setFeedback(updated);
    const saved = writeStorage(FEEDBACK_KEY, updated);
    setFeedbackText('');
    setFeedbackEmail('');
    setFeedbackImage(null);
    setNotice(saved ? 'Thanks. Your feedback has been saved in this browser.' : 'Your feedback is visible, but could not be saved in this browser.');
  };

  return (
    <>
      <section className="page-hero">
        <div className="container split">
          <div>
            <span className="eyebrow">Developer community</span>
            <h1>Build with <span className="accent">other developers</span></h1>
            <p className="lead">Get instant answers from the AI assistant, help from teams already live, and a direct line to our engineers.</p>
            <div className="hero-ctas">
              <button className="btn btn-primary" onClick={() => openAssistant()}><Icon name="sparkle" size={16} /> Ask AI</button>
              <a href="#join" className="btn btn-ghost"><Icon name="users" size={16} /> Join the community</a>
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
                {c.onClick ? (
                  <button className="link link-btn" onClick={c.onClick}>{c.cta} →</button>
                ) : c.href ? (
                  <a href={c.href} className="link">{c.cta} →</a>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="join">
        <div className="container narrow">
          <SectionHead center eyebrow="Join in" title={memberName ? `Welcome, ${memberName}` : 'Join the developer community'} text={memberName ? 'You can now start discussions, comment, and share feedback.' : 'Choose the name you want other developers to see when you post.'} />
          {memberName ? (
            <div className="notice notice-ok"><Icon name="check" /> You are a community member. <button className="link-btn" type="button" onClick={() => { localStorage.removeItem(MEMBER_KEY); setMemberName(''); setNotice('You have left the community.'); }}>Leave community</button></div>
          ) : (
            <form className="form card-form join-form" onSubmit={join}>
              <label htmlFor="join-name">Display name<input id="join-name" required minLength={2} maxLength={50} value={joinName} onChange={(event) => setJoinName(event.target.value)} placeholder="Your name" /></label>
              <button className="btn btn-primary" type="submit">Join community</button>
            </form>
          )}
        </div>
      </section>

      <section className="section section-tint">
        <div className="container">
          <SectionHead eyebrow="Community forum" title="Join the conversation" text="Browse questions, share what worked for you, and learn from other Hubtel developers." />
          <ul className="threads" id="discussions">
            {posts.map((t) => (
              <li key={t.id} id={`thread-${t.id}`}>
                <details>
                  <summary>
                    <span className="thread-title">{t.title}</span>
                    <span className="thread-meta">
                      <span className="muted">{t.author}</span>
                      <span className="tag">{t.tag}</span>
                      {t.solved && <span className="pill pill-ok"><Icon name="check" size={12} /> Solved</span>}
                      <span className="muted">{(t.replies || 0) + (t.comments?.length || 0)} replies</span>
                    </span>
                  </summary>
                  <div className="thread-content">
                    {t.body && <div className="thread-entry"><div><strong>Question from {t.author}</strong><p>{t.body}</p>{t.attachment && <img className="discussion-image" src={t.attachment.src} alt={`Attached image: ${t.attachment.name}`} />}</div></div>}
                    {t.answer && <p className="thread-answer"><strong>{t.solved ? 'Accepted answer: ' : 'Summary: '}</strong>{t.answer}</p>}
                    {t.comments?.length > 0 && (
                      <ul className="comment-list" aria-label="Comments">
                        {t.comments.map((comment) => (
                          <li className="comment" key={comment.id}>
                            <div><strong>{comment.author}</strong><p>{comment.text}</p>{comment.attachment && <img className="discussion-image" src={comment.attachment.src} alt={`Attached image: ${comment.attachment.name}`} />}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                    {memberName ? <CommentForm onSubmit={(text, attachment) => addComment(t.id, text, attachment)} /> : <p className="join-required"><a href="#join" className="link">Join the community</a> to add a comment.</p>}
                  </div>
                </details>
              </li>
            ))}
          </ul>
          <p className="small muted community-storage-note">Discussions and comments are saved in this browser only. They are not shared with other users yet.</p>
        </div>
      </section>

      <section className="section" id="ask">
        <div className="container narrow">
          <SectionHead center eyebrow="Ask the community" title="Still stuck? Post a question" text="Other developers and our integration engineers will reply." />
          {memberName ? (
            <form className="form card-form" onSubmit={addPost}>
              <label htmlFor="question-title">Question title<input id="question-title" required maxLength={120} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="What do you need help with?" /></label>
              <label htmlFor="question-topic">Topic<select id="question-topic" value={topic} onChange={(event) => setTopic(event.target.value)}><option>Payments</option><option>Bill payments</option><option>Verification</option><option>Messaging</option><option>IP whitelisting</option><option>Plugins</option><option>AI tools</option><option>Other</option></select></label>
              <label htmlFor="question-body">Details<textarea id="question-body" required rows={4} maxLength={4000} value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Describe what you're trying to do and what happened." /></label>
              <ImageAttachment attachment={postImage} onChange={setPostImage} />
              <p className="small muted">Never include secret keys or customer data.</p>
              <div className="row">
                <button className="btn btn-primary" type="submit">Post discussion</button>
                <button className="btn btn-ghost" type="button" onClick={() => question.trim() && openAssistant(question)} disabled={!question.trim()}>Ask AI first</button>
              </div>
            </form>
          ) : (
            <div className="notice community-join-notice"><Icon name="users" /> Join the community before posting. <a href="#join" className="link">Join now</a></div>
          )}
        </div>
      </section>

      <section className="section section-tint" id="feedback">
        <div className="container narrow">
          <SectionHead center eyebrow="Feedback" title="Tell us what to improve" text="Every message goes straight to the developer experience team." />
          <form className="form card-form" onSubmit={addFeedback}>
            <label htmlFor="feedback-topic">Topic<select id="feedback-topic" value={feedbackTopic} onChange={(event) => setFeedbackTopic(event.target.value)}><option>Docs</option><option>Sandbox</option><option>IP whitelisting</option><option>Plugins</option><option>AI tools</option><option>Community</option><option>Other</option></select></label>
            <label htmlFor="feedback-text">Your feedback<textarea id="feedback-text" required rows={4} maxLength={4000} value={feedbackText} onChange={(event) => setFeedbackText(event.target.value)} placeholder="What was hard, missing or confusing?" /></label>
            <label htmlFor="feedback-email">Email (optional)<input id="feedback-email" type="email" autoComplete="email" value={feedbackEmail} onChange={(event) => setFeedbackEmail(event.target.value)} placeholder="you@company.com" /></label>
            <ImageAttachment attachment={feedbackImage} onChange={setFeedbackImage} />
            <button className="btn btn-primary" type="submit">Save feedback</button>
          </form>
          {feedback.length > 0 && (
            <ul className="feedback-list" aria-label="Feedback saved in this browser">
              {feedback.map((item) => <li key={item.id}><strong>{item.topic} · {item.author}</strong><p>{item.text}</p>{item.attachment && <img className="discussion-image" src={item.attachment.src} alt={`Attached image: ${item.attachment.name}`} />}</li>)}
            </ul>
          )}
          <p className="small muted community-storage-note">Feedback stays in this browser and is not sent to Hubtel yet.</p>
        </div>
      </section>
      {notice && <div className="community-toast" role="status"><span>{notice}</span><button type="button" aria-label="Dismiss" onClick={() => setNotice('')}>×</button></div>}
    </>
  );
}
