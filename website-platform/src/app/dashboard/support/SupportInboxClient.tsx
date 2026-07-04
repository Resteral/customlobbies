'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, CheckCircle2, User, Mail, Globe, Check } from 'lucide-react';
import { sendSupportMessage, fetchSupportMessages, toggleTicketStatus } from './actions';

interface Ticket {
  id: string;
  site_id: string;
  visitor_session_id: string;
  visitor_name: string;
  visitor_email: string;
  status: string;
  created_at: string;
  site: {
    name: string;
  };
}

interface Message {
  id?: string;
  ticket_id?: string;
  sender: string;
  content: string;
  created_at?: string;
}

export default function SupportInboxClient({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(initialTickets[0] || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom of message list
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Poll for messages in the selected ticket
  useEffect(() => {
    if (selectedTicket) {
      // Fetch immediately
      fetchSupportMessages(selectedTicket.id).then(setMessages);

      // Start polling
      pollIntervalRef.current = setInterval(async () => {
        const dbMsgs = await fetchSupportMessages(selectedTicket.id);
        if (dbMsgs.length !== messages.length) {
          setMessages(dbMsgs);
        }
      }, 2000);
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
  }, [selectedTicket, messages.length]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedTicket || sending) return;

    setSending(true);
    const text = inputText;
    setInputText('');

    // Optimistic message update
    const optMsg: Message = { sender: 'agent', content: text };
    setMessages(prev => [...prev, optMsg]);

    const res = await sendSupportMessage(selectedTicket.id, 'agent', text);
    if (!res.success) {
      alert('Failed to send message.');
    }
    
    setSending(false);
  };

  const handleToggleStatus = async (ticketId: string, currentStatus: string) => {
    const updatedStatus = currentStatus === 'open' ? 'resolved' : 'open';
    
    // Update local state
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: updatedStatus } : t));
    if (selectedTicket?.id === ticketId) {
      setSelectedTicket({ ...selectedTicket, status: updatedStatus });
    }

    const res = await toggleTicketStatus(ticketId, currentStatus);
    if (!res.success) {
      alert(res.error || 'Failed to update ticket status.');
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="border border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-secondary/5 min-h-[300px]">
        <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">Inbox is Empty</h3>
        <p className="text-muted-foreground max-w-sm">
          Support tickets and visitor feedback submitted on your websites will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex border border-border/50 rounded-2xl overflow-hidden bg-background">
      {/* Sidebar: Tickets List */}
      <div className="w-1/3 border-r border-border/50 flex flex-col bg-secondary/5">
        <div className="p-4 border-b border-border/50 bg-background/50 flex justify-between items-center">
          <h2 className="font-semibold text-sm">Tickets ({tickets.length})</h2>
          <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">Live Chat</span>
        </div>
        <div className="flex-grow overflow-y-auto">
          {tickets.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTicket(t)}
              className={`w-full text-left p-4 border-b border-border/50 transition-colors flex items-start gap-3 ${
                selectedTicket?.id === t.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-secondary/20 border-l-4 border-l-transparent'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold truncate text-sm">{t.visitor_name}</h4>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
                  <Globe className="w-3.5 h-3.5" />
                  Site: {t.site.name}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    t.status === 'open' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {t.status}
                  </span>
                  {t.visitor_email && (
                    <span className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {t.visitor_email}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Support Chat Window */}
      <div className="flex-1 flex flex-col bg-background relative">
        {selectedTicket ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 border-b border-border/50 bg-background/50 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold mb-1">{selectedTicket.visitor_name}</h2>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  {selectedTicket.visitor_email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5" />
                      {selectedTicket.visitor_email}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5" />
                    Site: {selectedTicket.site.name}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleStatus(selectedTicket.id, selectedTicket.status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    selectedTicket.status === 'open'
                      ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                      : 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  {selectedTicket.status === 'open' ? 'Mark Resolved' : 'Reopen Ticket'}
                </button>
              </div>
            </div>

            {/* Message Feed */}
            <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-secondary/5">
              {messages.map((msg, index) => {
                const isMe = msg.sender === 'agent';
                return (
                  <div key={index} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${
                      isMe 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-[#182030] border border-border/50 text-white rounded-tl-none'
                    }`}>
                      <span className="text-[10px] font-bold block uppercase tracking-wider opacity-60 mb-1">
                        {isMe ? 'You (Support)' : selectedTicket.visitor_name}
                      </span>
                      <p className="leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            {selectedTicket.status === 'open' ? (
              <form onSubmit={handleSendMessage} className="p-4 border-t border-border/50 bg-[#0e1422] flex gap-3">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your response..."
                  className="flex-grow bg-[#121824] border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary text-white"
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim() || sending}
                  className="bg-primary hover:bg-primary/95 text-white w-12 h-12 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-50 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            ) : (
              <div className="p-4 bg-secondary/15 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 border-t border-border/50">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                This ticket has been marked as resolved. Reopen the ticket to send messages.
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a support ticket to respond
          </div>
        )}
      </div>
    </div>
  );
}
