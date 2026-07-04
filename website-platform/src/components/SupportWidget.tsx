'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Mail, ShieldQuestion, HelpCircle } from 'lucide-react';
import { createSupportTicket, sendSupportMessage, fetchSupportMessages } from '@/app/dashboard/support/actions';

interface Message {
  id?: string;
  sender: string;
  content: string;
  created_at?: string;
}

export default function SupportWidget({ siteId }: { siteId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  // Setup Form
  const [hasDetails, setHasDetails] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loadingTicket, setLoadingTicket] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get or create Visitor Session ID
  const getSessionId = () => {
    if (typeof window === 'undefined') return '';
    let sid = localStorage.getItem('resolve_support_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('resolve_support_session_id', sid);
    }
    return sid;
  };

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing ticket if it exists
  useEffect(() => {
    if (isOpen) {
      const checkExisting = async () => {
        const sid = getSessionId();
        const res = await createSupportTicket(siteId, sid);
        if (res.success && res.ticketId) {
          setTicketId(res.ticketId);
          setHasDetails(true);
          const msgs = await fetchSupportMessages(res.ticketId);
          setMessages(msgs);
        }
      };
      checkExisting();
    }
  }, [isOpen, siteId]);

  // Poll for replies from support
  useEffect(() => {
    if (isOpen && ticketId) {
      pollIntervalRef.current = setInterval(async () => {
        const dbMsgs = await fetchSupportMessages(ticketId);
        if (dbMsgs.length !== messages.length) {
          setMessages(dbMsgs);
        }
      }, 3000);
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [isOpen, ticketId, messages.length]);

  const handleStartTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoadingTicket(true);
    const sid = getSessionId();
    const res = await createSupportTicket(siteId, sid, name, email);
    
    if (res.success && res.ticketId) {
      setTicketId(res.ticketId);
      setHasDetails(true);
      
      // Send initial welcome message
      await sendSupportMessage(res.ticketId, 'visitor', `Hi! I need help. (Visitor: ${name})`);
      const msgs = await fetchSupportMessages(res.ticketId);
      setMessages(msgs);
    } else {
      alert('Failed to start chat session. Please try again.');
    }
    setLoadingTicket(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !ticketId || sending) return;

    setSending(true);
    const text = inputText;
    setInputText('');

    // Optimistically update
    const optMsg: Message = { sender: 'visitor', content: text };
    setMessages(prev => [...prev, optMsg]);

    const res = await sendSupportMessage(ticketId, 'visitor', text);
    if (!res.success) {
      alert('Failed to send message.');
    }

    setSending(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Support Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary hover:bg-primary/95 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-105"
        >
          <HelpCircle className="w-7 h-7" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-[#0e1422]/95 backdrop-blur-md border border-border/50 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-primary text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-bold text-sm">Live Support & Feedback</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-grow overflow-y-auto p-4 flex flex-col justify-between">
            {!hasDetails ? (
              /* Setup Form */
              <form onSubmit={handleStartTicket} className="space-y-4 my-auto">
                <div className="text-center mb-2">
                  <ShieldQuestion className="w-10 h-10 text-primary mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-white">How can we help?</h4>
                  <p className="text-gray-400 text-xs mt-1">Start a live chat session with our support team.</p>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Your Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full bg-[#121824] border border-border/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Email (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-[#121824] border border-border/50 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loadingTicket}
                  className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-2 rounded-xl text-xs transition-colors disabled:opacity-50"
                >
                  {loadingTicket ? 'Starting Chat...' : 'Start Chat'}
                </button>
              </form>
            ) : (
              /* Chat Log & Message Feed */
              <div className="flex-grow flex flex-col justify-between h-full">
                <div className="flex-grow overflow-y-auto space-y-3 pr-1 text-xs">
                  {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-xs py-10">
                      Sending support ticket details...
                    </div>
                  )}
                  {messages.map((msg, index) => {
                    const isMe = msg.sender === 'visitor';
                    return (
                      <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-xl px-3 py-1.5 ${
                          isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-[#182030] border border-border/50 text-white rounded-tl-none'
                        }`}>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 border-t border-border/20 pt-3">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type message..."
                    className="flex-grow bg-[#121824] border border-border/50 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || sending}
                    className="bg-primary hover:bg-primary/95 text-white w-8 h-8 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
