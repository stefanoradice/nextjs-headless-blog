'use client';
import { useEffect, useRef, useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('messages') || '[]');
    }
    return [];
  });
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(chat));
  }, [chat]);

  const updatePadding = () => {
    const inputHeight = inputRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;
    const lastMessage =
      chatContainerRef.current?.children?.[chatContainerRef.current.children.length - 2];
    const lastMessageHeight = lastMessage?.offsetHeight || 0;
    console.log({ inputHeight, viewportHeight, lastMessageHeight });
    const padding = viewportHeight - lastMessageHeight - inputHeight - 40;

    if (chatContainerRef.current) {
      chatContainerRef.current.style.paddingBottom = `${padding}px`;
    }
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth',
    });
  };
  async function handleSend() {
    if (!input.trim()) return;
    updatePadding();
    setReply('');
    setInput('');
    setLoading(true);

    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    messages.push({ role: 'user', content: input });
    setChat(messages);

    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        const newMessages = [...messages, { role: 'assistant', content: text }];
        setChat(newMessages);
        setReply('');
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(Boolean);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.response) {
            for (const char of parsed.response) {
              text += char;
              setReply(text);
              await new Promise((r) => setTimeout(r, 10));
            }
          }
        } catch (err) {
          console.error('Parsing error:', err);
        }
      }
    }

    setLoading(false);
  }

  return (
    <div className="relative max-w-xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Chat GPT-style con Ollama</h1>
      <div
        ref={chatContainerRef}
        className="mb-4 p-3 rounded min-h-[80px] whitespace-pre-line mb-20"
      >
        {chat.map((msg, index) => (
          <div key={index} className={`flex justify-${msg.role === 'user' ? 'end' : 'start'} mb-2`}>
            <div
              className={`rounded-2xl p-4 mb-2 inline-block ${msg.role === 'user' ? 'text-right bg-gray-200' : 'text-left'}`}
              style={{
                wordBreak: 'break-word',
                overflowWrap: 'anywhere',
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div className={`${reply && 'p-4'}`}>{reply || (loading && '...')}</div>
      </div>
      <div
        ref={inputRef}
        className="fixed bottom-0 left-0 right-0 px-4 py-4 max-w-xl mx-auto mt-10 bg-gradient-to-t from-[#ededed] via-[#ededed]/90 to-transparent"
      >
        <textarea
          rows="3"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="w-full p-2 rounded-2xl mb-2 bg-white"
          placeholder="Scrivi un messaggio..."
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Sto pensando...' : 'Invia'}
        </button>
      </div>
    </div>
  );
}
