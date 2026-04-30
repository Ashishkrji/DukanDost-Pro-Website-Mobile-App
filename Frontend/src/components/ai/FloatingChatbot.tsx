import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Sparkles, Loader2, Maximize2, Minimize2, PlusCircle, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as api from '../../services/api';
import { useStore } from '../../store/useStore';
import { cn } from '../../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isAction?: boolean;
}

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Namaste! Main aapka DukanDost AI assistant hoon. Main aapki kaise madad kar sakta hoon?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { showToast, fetchCustomers, fetchTransactions } = useStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.aiChat([...messages, userMessage].map(m => ({ role: m.role, content: m.content })));
      
      if (res.success) {
        if (res.tool_calls && res.tool_calls.length > 0) {
          // Handle tool calls
          for (const call of res.tool_calls) {
            const { name, arguments: argsJson } = call.function;
            const args = JSON.parse(argsJson);
            
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: `Theek hai, main "${name.replace('_', ' ')}" action execute kar raha hoon...`,
              isAction: true
            }]);

            try {
              await api.aiExecute(name, args);
              showToast(`Action executed: ${name.replace('_', ' ')}`, 'success');
              
              // Refresh relevant data
              if (name === 'add_customer') fetchCustomers();
              if (name === 'add_transaction') {
                fetchTransactions();
                fetchCustomers();
              }

              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Kaam ho gaya! ${name.replace('_', ' ')} safaltapurvak poora hua.` 
              }]);
            } catch (err: any) {
              setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: `Maaf kijiye, action execute karne mein dikkat aayi: ${err.message}` 
              }]);
            }
          }
        } else {
          setMessages(prev => [...prev, { role: 'assistant', content: res.message }]);
        }
      }
    } catch (error) {
      showToast('AI connection failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              height: isMinimized ? '80px' : '500px',
              width: '380px'
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden mb-4 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-[#0A0B1A] text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                  <Bot size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DukanDost AI</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Active Assistant</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-50/50">
                  {messages.map((m, i) => (
                    <motion.div
                      initial={{ opacity: 0, x: m.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i}
                      className={cn(
                        "flex items-start gap-2",
                        m.role === 'user' ? "flex-row-reverse" : ""
                      )}
                    >
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        m.role === 'user' ? "bg-orange-100 text-orange-600" : "bg-[#0A0B1A] text-white"
                      )}>
                        {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={cn(
                        "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                        m.role === 'user' 
                          ? "bg-[#FF6B00] text-white rounded-tr-none" 
                          : m.isAction 
                            ? "bg-blue-50 border border-blue-100 text-blue-700 font-bold italic"
                            : "bg-white border border-slate-100 text-slate-700 rounded-tl-none"
                      )}>
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex items-start gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#0A0B1A] text-white flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-none">
                        <Loader2 size={18} className="animate-spin text-orange-500" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-slate-100">
                  <div className="flex items-center gap-2 bg-slate-100 rounded-2xl p-2 pr-1">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                      placeholder="Kuch poochiye ya command dijiye..."
                      className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-2 text-slate-700 placeholder:text-slate-400"
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="w-10 h-10 rounded-xl bg-[#FF6B00] text-white flex items-center justify-center hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-200"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                    <QuickAction icon={<PlusCircle size={12} />} label="Naya Grahak" onClick={() => setInput('Naya customer add karo')} />
                    <QuickAction icon={<CreditCard size={12} />} label="Udhaar Entry" onClick={() => setInput('Ramu ko 500 udhaar diye')} />
                    <QuickAction icon={<Sparkles size={12} />} label="Business Health" onClick={() => setInput('Mera business kaisa chal raha hai?')} />
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-[1.5rem] bg-[#0A0B1A] text-white flex items-center justify-center shadow-2xl relative group overflow-hidden",
          isOpen ? "bg-orange-500" : ""
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </motion.button>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-full text-[10px] font-bold text-slate-500 border border-slate-200 transition-all whitespace-nowrap"
    >
      {icon}
      {label}
    </button>
  );
}
