import { useState, useRef, useEffect } from 'react';

// ─────────────────────────────────────────────────────────────
// ChatScreen – AI Chatbot UI (ChatGPT-style)
//
// Props:
//   onSendMessage(text: string) – called when the user sends.
//   Your AI brain should hook into this prop from the parent.
//   This component only handles the UI / layout.
// ─────────────────────────────────────────────────────────────

// ── Unique message ID generator ──────────────────────────────
let _id = 0;
const uid = () => ++_id;

// ── Time formatter ───────────────────────────────────────────
const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ── Seed messages (remove these in production) ───────────────
const SEED_MESSAGES = [
  {
    id: uid(),
    from: 'ai',
    text: 'Hello! How can I help you today?',
    time: new Date(),
  },
];

// ─────────────────────────────────────────────────────────────
// TYPING INDICATOR
// Three bouncing dots shown while the AI brain is processing.
// Show it by setting isTyping=true, hide it when your brain
// has a response ready.
// ─────────────────────────────────────────────────────────────
const TypingDots = () => (
  <div style={styles.typingWrap}>
    {/* Small AI icon to the left of the dots */}
    <div style={styles.aiIcon}>AI</div>

    {/* Dots container */}
    <div style={styles.dotsRow}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ ...styles.dot, animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// MESSAGE BUBBLE
// - AI messages  → left side, light grey pill
// - User messages → right side, dark pill (like ChatGPT)
// ─────────────────────────────────────────────────────────────
const MessageBubble = ({ msg }) => {
  const isUser = msg.from === 'user';

  return (
    /* Row – flex direction flips for user vs AI */
    <div style={{
      ...styles.msgRow,
      justifyContent: isUser ? 'flex-end' : 'flex-start',
    }}>

      {/* AI icon – only shown on AI messages */}
      {!isUser && <div style={styles.aiIcon}>AI</div>}

      {/* Column: bubble + timestamp */}
      <div style={{
        ...styles.bubbleCol,
        alignItems: isUser ? 'flex-end' : 'flex-start',
      }}>

        {/* Bubble */}
        <div style={{
          ...styles.bubble,
          background: isUser ? 'var(--bubble-user-bg)' : 'var(--bubble-ai-bg)',
          color:      isUser ? 'var(--bubble-user-text)' : 'var(--bubble-ai-text)',
          borderRadius: isUser
            ? '18px 18px 4px 18px'   // user: flat bottom-right
            : '18px 18px 18px 4px',  // AI:   flat bottom-left
          boxShadow: isUser ? 'none' : 'var(--shadow-bubble)',
        }}>
          {/* Preserve Shift+Enter newlines */}
          {msg.text.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </div>

        {/* Timestamp below the bubble */}
        <span style={styles.timestamp}>{formatTime(msg.time)}</span>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT – ChatScreen
// ─────────────────────────────────────────────────────────────
const ChatScreen = ({ onSendMessage = () => {} }) => {

  // ── State ──────────────────────────────────────────────────
  const [text, setText]         = useState('');            // current draft text
  const [messages, setMessages] = useState(SEED_MESSAGES); // full message list
  const [isTyping, setIsTyping] = useState(false);         // typing indicator
  const [theme, setTheme]       = useState('light');       // UI theme

  // ── Theme Effect ───────────────────────────────────────────
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

  // ── Refs ───────────────────────────────────────────────────
  const bottomRef   = useRef(null);  // invisible div at bottom – used for auto-scroll
  const textareaRef = useRef(null);  // textarea – used for auto-resize

  // ── Auto-scroll to bottom whenever messages or typing changes ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Auto-resize textarea (grows up to 160px, then scrolls) ──
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';                                  // reset first
    el.style.height = Math.min(el.scrollHeight, 160) + 'px';  // then expand
  }, [text]);

  // ── Character limit ────────────────────────────────────────
  const MAX  = 4000;
  const over = text.length > MAX;

  // ─────────────────────────────────────────────────────────
  // handleSubmit – THE CORE EVENT HANDLER
  //
  // Triggered by:
  //   • Enter key (without Shift), via handleKeyDown below
  //   • Clicking the ▲ send button
  //
  // Steps:
  //   1. e.preventDefault() → stops the <form> from reloading the page
  //   2. Guards against empty input or over-limit messages
  //   3. Builds a user message object and adds it to state
  //   4. Calls onSendMessage(text) → YOUR AI brain receives the text
  //   5. Clears the textarea
  //   6. Shows the typing indicator (your brain should call
  //      addAIMessage() when it has a response)
  // ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop browser page reload

    const trimmed = text.trim();
    if (!trimmed || over) return; // ignore empty or too-long messages

    // Build and add the user's message
    const userMsg = { id: uid(), from: 'user', text: trimmed, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);

    // ← YOUR AI BRAIN receives the text here via this prop
    // Clear the input field and reset textarea height
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    // Show typing indicator while brain works
    setIsTyping(true);

    try {
      const reply = await onSendMessage(trimmed);
      if (reply) {
        const aiMsg = { id: uid(), from: 'ai', text: reply, time: new Date() };
        setMessages((prev) => [...prev, aiMsg]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsTyping(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // addAIMessage – call this from your parent after the brain responds
  //
  // Usage in your parent component:
  //
  //   const chatRef = useRef();
  //
  //   const handleSend = async (userText) => {
  //     const reply = await myBrain.generate(userText); // your logic
  //     chatRef.current.addAIMessage(reply);            // inject reply
  //   };
  //
  //   <ChatScreen ref={chatRef} onSendMessage={handleSend} />
  //
  // (Requires forwardRef + useImperativeHandle – see bottom of file)
  // ─────────────────────────────────────────────────────────

  // importent thing
  
//   const addAIMessage = (responseText) => {
//     setIsTyping(false); // hide typing dots
//     const aiMsg = { id: uid(), from: 'ai', text: responseText, time: new Date() };
//     setMessages((prev) => [...prev, aiMsg]);
//   };

  // ── Enter = send  /  Shift+Enter = newline ─────────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // ─────────────────────────────────────────────────────────
  // RENDER
  //
  // Layout (flex column, full viewport):
  //   ┌────────────────────────┐
  //   │  HEADER                │  fixed – just the bot name
  //   ├────────────────────────┤
  //   │  MESSAGE LIST          │  flex:1, scrollable
  //   ├────────────────────────┤
  //   │  COMPOSE BAR           │  shrinks/grows with textarea
  //   └────────────────────────┘
  // ─────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Global styles: bounce keyframe + tiny resets ── */}
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
                       Roboto, Oxygen, Ubuntu, sans-serif;
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30%            { transform: translateY(-5px); }
        }
        /* hide scrollbar inside textarea */
        textarea::-webkit-scrollbar { width: 0; }
        /* send button hover */
        .send-btn:hover:not(:disabled) { background: #000 !important; }
        /* compose box focus glow */
        .compose-box:focus-within {
          border-color: #111827 !important;
          box-shadow: 0 0 0 2px rgba(17,24,39,0.08) !important;
        }
      `}</style>

      {/* ══════════════════════════════════════════════════
          SHELL – white, full viewport height
          ══════════════════════════════════════════════════ */}
      <div style={styles.shell}>

        {/* ══════════════════════════════════════════════
            HEADER
            Minimal – just the bot name + a subtle model
            tag. No avatar, no status, no action buttons
            (as requested).
            ══════════════════════════════════════════════ */}
        <header style={styles.header}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={styles.headerTitle}>AI Assistant</span>
            <span style={styles.modelBadge}>Premium</span>
          </div>
          <button 
            onClick={toggleTheme} 
            style={styles.themeToggleBtn}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </header>

        {/* ══════════════════════════════════════════════
            MESSAGE LIST
            role="log" + aria-live makes screen readers
            announce new messages automatically.
            ══════════════════════════════════════════════ */}
        <main
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          style={styles.messageList}
        >
          {/* Render every message bubble */}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}

          {/* Typing indicator – shown while AI brain processes */}
          {isTyping && <TypingDots />}

          {/* Scroll target – always stays at the very bottom */}
          <div ref={bottomRef} />
        </main>

        {/* ══════════════════════════════════════════════
            COMPOSE BAR
            Matches ChatGPT: rounded pill, no extra icons,
            ▲ send button, hint text, disclaimer.
            ══════════════════════════════════════════════ */}
        <div style={styles.composeOuter}>
          <form onSubmit={handleSubmit} style={styles.composeForm}>

            {/* Rounded compose pill */}
            <div className="compose-box" style={styles.composeBox}>

              {/* Textarea – Enter sends, Shift+Enter = newline */}
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message AI Assistant…"
                rows={1}
                aria-label="Message input"
                style={styles.textarea}
              />

              {/* Send button – disabled when empty or over limit */}
              <button
                type="submit"
                className="send-btn"
                aria-label="Send message"
                disabled={!text.trim() || over}
                style={{
                  ...styles.sendBtn,
                  background: (!text.trim() || over) ? 'var(--border-color)' : 'var(--send-btn-bg)',
                  cursor:     (!text.trim() || over) ? 'not-allowed' : 'pointer',
                }}
              >
                {/* Up-arrow SVG icon – no external library needed */}
                <svg
                  width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>

            {/* Hint row: keyboard shortcut + character counter */}
            <div style={styles.hintRow}>
              <span style={styles.hint}>
                Enter to send &nbsp;·&nbsp; Shift+Enter for new line
              </span>
              {/* Counter turns red when over the 4000-char limit */}
              <span style={{ ...styles.hint, color: over ? '#EF4444' : '#9CA3AF' }}>
                {text.length} / {MAX}
              </span>
            </div>
          </form>

          {/* Disclaimer – identical in purpose to ChatGPT's footer note */}
          <p style={styles.disclaimer}>
            AI can make mistakes. Consider checking important info.
          </p>
        </div>

      </div>
    </>
  );
};

// ─────────────────────────────────────────────────────────────
// STYLES – all in one object to keep JSX clean
// ─────────────────────────────────────────────────────────────
const styles = {

  // Full-viewport shell
  shell: {
    display: 'flex',
    flexDirection: 'column',
    height: '100dvh',
    width: '100%',
    background: 'var(--bg-primary)',
    overflow: 'hidden',
  },

  // Header bar
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    borderBottom: '1px solid var(--border-color)',
    background: 'var(--bg-secondary)',
    flexShrink: 0,
    boxShadow: 'var(--shadow-soft)',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--text-primary)',
    letterSpacing: '-0.01em',
  },
  modelBadge: {
    fontSize: 11,
    fontWeight: 500,
    color: 'var(--text-secondary)',
    background: 'var(--bg-primary)',
    padding: '4px 10px',
    borderRadius: 20,
    border: '1px solid var(--border-color)',
  },
  themeToggleBtn: {
    background: 'transparent',
    border: 'none',
    fontSize: 18,
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s',
  },

  // Scrollable message pane
  messageList: {
    flex: 1,
    overflowY: 'auto',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    maxWidth: 768,
    width: '100%',
    margin: '0 auto',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },

  // Individual message row
  msgRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    width: '100%',
  },

  // Small circular AI icon
  aiIcon: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'var(--ai-icon-bg)',
    color: 'var(--ai-icon-text)',
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    letterSpacing: '0.03em',
    boxShadow: 'var(--shadow-bubble)',
  },

  // Bubble + timestamp column
  bubbleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    maxWidth: '80%',
  },

  // Bubble itself
  bubble: {
    padding: '12px 16px',
    fontSize: 15,
    lineHeight: 1.6,
    wordBreak: 'break-word',
    whiteSpace: 'pre-wrap',
  },

  // Timestamp
  timestamp: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    padding: '0 4px',
  },

  // Typing indicator row
  typingWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  dotsRow: {
    display: 'flex',
    gap: 5,
    padding: '14px 18px',
    background: 'var(--bubble-ai-bg)',
    borderRadius: '18px 18px 18px 4px',
    boxShadow: 'var(--shadow-bubble)',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--text-secondary)',
    display: 'inline-block',
    animation: 'bounce 1.2s infinite ease-in-out',
  },

  // Compose outer
  composeOuter: {
    flexShrink: 0,
    padding: '12px 16px 16px',
    background: 'transparent', // Make it transparent to let the primary background show
    maxWidth: 768,
    width: '100%',
    margin: '0 auto',
    alignSelf: 'center',
    boxSizing: 'border-box',
  },
  composeForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },

  // Rounded pill compose box with glassmorphism
  composeBox: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: 10,
    background: 'var(--compose-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 24,
    padding: '12px 12px 12px 20px',
    transition: 'border-color 0.3s, box-shadow 0.3s',
    boxShadow: 'var(--shadow-soft)',
  },

  // Textarea inside the pill
  textarea: {
    flex: 1,
    border: 'none',
    background: 'transparent',
    resize: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    fontSize: 15,
    color: 'var(--text-primary)',
    lineHeight: 1.55,
    padding: '4px 0',
    overflowY: 'hidden',
    maxHeight: 160,
  },

  // Send button (▲)
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 16,
    border: 'none',
    color: 'var(--send-btn-text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'background 0.2s, transform 0.1s',
  },

  // Hint + character counter row
  hintRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0 12px',
  },
  hint: {
    fontSize: 11,
    color: 'var(--text-secondary)',
  },

  // Footer disclaimer
  disclaimer: {
    textAlign: 'center',
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginTop: 12,
  },
};

export default ChatScreen;
