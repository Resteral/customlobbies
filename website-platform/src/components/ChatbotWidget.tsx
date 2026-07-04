"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, ArrowRight } from "lucide-react";
import { useChat } from '@ai-sdk/react';

export default function ChatbotWidget({ themeColor = "#3b82f6" }: { themeColor?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const { messages, input, handleInputChange, handleSubmit, toolInvocations } = useChat({
    api: '/api/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: 'Hi there! How can I help you today?' }
    ],
    onToolCall({ toolCall }) {
      if (toolCall.toolName === 'navigateUser') {
        const url = (toolCall.args as any).url;
        // In a real deployed app, this would use next/navigation useRouter
        // For preview, we just update window location
        window.location.href = url;
      }
    }
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleSubmit(e);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-white z-50 transition-colors"
        style={{ backgroundColor: themeColor }}
      >
        <MessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-background border border-border/50 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Chat Header */}
            <div 
              className="p-4 text-white flex justify-between items-center"
              style={{ backgroundColor: themeColor }}
            >
              <div className="flex items-center gap-2 font-medium">
                <Bot className="w-5 h-5" />
                AI Assistant
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4 bg-secondary/10">
              {messages.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex gap-2 max-w-[85%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'user' ? 'bg-secondary text-muted-foreground' : 'text-white'
                  }`}
                  style={msg.role !== 'user' ? { backgroundColor: themeColor } : {}}
                  >
                    {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div className={`px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user' ? 'bg-secondary text-foreground rounded-tr-sm' : 'bg-background border border-border/50 text-foreground rounded-tl-sm'
                  }`}>
                    {msg.content}
                    
                    {/* Render tool calls nicely */}
                    {msg.toolInvocations?.map(tool => {
                      if (tool.toolName === 'navigateUser') {
                        return (
                          <div key={tool.toolCallId} className="mt-3 p-3 bg-secondary/30 rounded-lg border border-border/50 flex flex-col gap-2">
                            <span className="font-semibold text-xs text-muted-foreground">Redirecting you...</span>
                            <div className="flex items-center gap-2 text-primary font-medium">
                              <ArrowRight className="w-4 h-4" />
                              {(tool.args as any).url}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{(tool.args as any).reason}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={onSubmit} className="p-3 border-t border-border/50 bg-background flex items-center gap-2">
              <input 
                type="text"
                placeholder="Type your message..."
                className="flex-grow bg-secondary/50 border border-border/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-primary/50"
                value={input}
                onChange={handleInputChange}
              />
              <button 
                type="submit"
                className="p-2 rounded-full text-white shrink-0 transition-colors hover:opacity-90"
                style={{ backgroundColor: themeColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
