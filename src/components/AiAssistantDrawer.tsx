import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RefreshCw, 
  ArrowRight, 
  Compass, 
  ShieldAlert,
  HelpCircle,
  Clock,
  Sparkle
} from 'lucide-react';
import { ChatMessage } from '../types';

export const AiAssistantDrawer: React.FC = () => {
  const {
    isAiAssistantOpen,
    setAiAssistantOpen,
    currentUser,
    bookings,
    tours,
    viewTourDetails,
    openBookingModal,
  } = useApp();

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      content: `Greetings ${currentUser.name.split(' ')[0]}! I am **Aura**, your private AI Travel Concierge.

How may I assist your upcoming journeys today? You can ask me to:
- **Recommend packages** within your budget (e.g., *"Suggest a 3-day trip under ₹10,000"*)
- **Compare destinations** (e.g., *"Compare Ooty and Kodaikanal"*)
- **Summarize your bookings** or plan tailored itineraries
- **Recommend ideal seasonal retreats** for families or couples`,
      timestamp: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiAssistantOpen) {
      scrollToBottom();
    }
  }, [messages, isAiAssistantOpen]);

  const promptChips = [
    'Suggest a 3-day trip under ₹10,000',
    'Compare Ooty and Kodaikanal',
    'Which destination is best for a family?',
    'Show me the best hill station packages',
    'Summarize my upcoming trip',
    'Plan a 4-day itinerary',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Find active upcoming booking for context
      const activeBooking = bookings.find(
        (b) => b.customerId === currentUser.id && b.status === 'confirmed'
      );

      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query.trim(),
          history: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'model',
            content: m.content,
          })),
          contextData: {
            userName: currentUser.name,
            bookingsCount: bookings.filter((b) => b.customerId === currentUser.id).length,
            activeBooking: activeBooking
              ? {
                  id: activeBooking.id,
                  tourTitle: activeBooking.tourTitle,
                  travelDate: activeBooking.travelDate,
                  travelersCount: activeBooking.travelersCount,
                  totalAmount: activeBooking.totalAmount,
                  status: activeBooking.status,
                  travelerName: activeBooking.travelerDetails[0]?.name || activeBooking.customerName,
                }
              : null,
          },
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I am currently curating our destinations. Could you please specify your preferred duration or budget?";

      // Check if reply mentions a specific tour we can link to
      let suggestedAction: ChatMessage['suggestedAction'] = undefined;
      const lowerReply = reply.toLowerCase();
      if (lowerReply.includes('misty nilgiri') || lowerReply.includes('ooty')) {
        suggestedAction = { label: 'View Ooty Tour Package', tourId: 'tour-ooty-01' };
      } else if (lowerReply.includes('princess of hill') || lowerReply.includes('kodaikanal')) {
        suggestedAction = { label: 'View Kodaikanal Package', tourId: 'tour-kodai-01' };
      } else if (lowerReply.includes('emerald backwater') || lowerReply.includes('kerala')) {
        suggestedAction = { label: 'View Kerala Houseboat Package', tourId: 'tour-kerala-01' };
      } else if (lowerReply.includes('coffee valley') || lowerReply.includes('coorg')) {
        suggestedAction = { label: 'View Coorg Package', tourId: 'tour-coorg-01' };
      } else if (lowerReply.includes('royal rajputana') || lowerReply.includes('rajasthan')) {
        suggestedAction = { label: 'View Rajasthan Grandeur', tourId: 'tour-rajasthan-01' };
      } else if (lowerReply.includes('paradise on earth') || lowerReply.includes('kashmir')) {
        suggestedAction = { label: 'View Kashmir Expedition', tourId: 'tour-kashmir-01' };
      }

      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          content: "I apologize for the momentary delay. I recommend reviewing our curated hill station getaways like **Misty Nilgiri Serenity (Ooty)** at ₹8,499/person or **Emerald Backwaters (Kerala)** at ₹18,999/person.",
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to render markdown text with bullet points, bold tags, and table styling
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return (
      <div className="space-y-2 text-sm leading-relaxed text-slate-200">
        {lines.map((line, idx) => {
          if (line.startsWith('### ')) {
            return (
              <h4 key={idx} className="text-base font-bold text-emerald-400 mt-2 mb-1">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={idx} className="text-lg font-bold text-white mt-3 mb-1">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('- ') || line.startsWith('* ')) {
            const rawText = line.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-emerald-400 font-bold mt-1 text-xs">•</span>
                <span dangerouslySetInnerHTML={{ __html: formatInline(rawText) }} />
              </div>
            );
          }
          if (line.match(/^\d+\.\s/)) {
            return (
              <div key={idx} className="pl-2 mt-1">
                <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
              </div>
            );
          }
          if (line.startsWith('|')) {
            // Table row preview
            return (
              <div key={idx} className="font-mono text-xs text-slate-300 py-0.5 overflow-x-auto">
                {line}
              </div>
            );
          }
          if (!line.trim()) {
            return <div key={idx} className="h-1.5" />;
          }
          return (
            <p key={idx} dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          );
        })}
      </div>
    );
  };

  const formatInline = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="text-emerald-300 italic">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-800 px-1 py-0.5 rounded text-amber-300 font-mono text-xs">$1</code>');
  };

  if (!isAiAssistantOpen) {
    return (
      <button
        id="floating-ai-assistant-trigger"
        onClick={() => setAiAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white rounded-full shadow-2xl shadow-emerald-500/30 border border-emerald-400/40 hover:scale-105 active:scale-95 transition-all duration-300 group"
        aria-label="Open AI Travel Assistant"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-amber-300 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping" />
        </div>
        <div className="text-left hidden sm:block">
          <span className="text-xs font-bold uppercase tracking-wider block leading-none">Aura AI</span>
          <span className="text-[10px] text-emerald-100 opacity-90 block mt-0.5">Travel Concierge</span>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-[480px] sm:h-[680px] z-50 flex flex-col bg-[#0b1120] sm:rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[#0d1627] via-[#091122] to-[#0d1627] border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-[#090e17] rounded-[14px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">Aura Concierge</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold rounded-full border border-emerald-500/30">
                Gemini 3.8
              </span>
            </div>
            <p className="text-xs text-slate-400">Intelligent Luxury Travel Assistant</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              setMessages([
                {
                  id: `msg-${Date.now()}`,
                  sender: 'assistant',
                  content: "Chat session refreshed. How may I assist your voyage planning now?",
                  timestamp: 'Just now',
                },
              ]);
            }}
            title="Reset conversation"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="close-ai-assistant-btn"
            onClick={() => setAiAssistantOpen(false)}
            aria-label="Close Assistant"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0 mt-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              )}

              <div className={`max-w-[85%] rounded-2xl p-4 text-sm shadow-md ${
                isUser
                  ? 'bg-emerald-600 text-white rounded-tr-none'
                  : 'bg-[#131b2e] border border-slate-700/60 rounded-tl-none'
              }`}>
                {isUser ? (
                  <p className="leading-relaxed">{msg.content}</p>
                ) : (
                  <div>
                    {renderFormattedContent(msg.content)}
                    {msg.suggestedAction && (
                      <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (msg.suggestedAction?.tourId) {
                              viewTourDetails(msg.suggestedAction.tourId);
                              setAiAssistantOpen(false);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-semibold transition-all group"
                        >
                          <span>{msg.suggestedAction.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
                <span className={`block text-[10px] mt-1.5 ${
                  isUser ? 'text-emerald-100/70 text-right' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-xl object-cover ring-1 ring-emerald-400 shrink-0 mt-1"
                />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-7 h-7 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
            </div>
            <div className="bg-[#131b2e] border border-slate-700/60 rounded-2xl rounded-tl-none p-3.5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-400 pl-1">Aura is formulating your journey...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompt Chips */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-[#090e1a]/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        {promptChips.map((chip, i) => (
          <button
            key={i}
            id={`prompt-chip-${i}`}
            onClick={() => handleSendMessage(chip)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium text-slate-300 bg-slate-800/70 hover:bg-emerald-900/40 hover:text-emerald-300 border border-slate-700/60 hover:border-emerald-500/40 transition-all shrink-0"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-[#090f1d] border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="ai-assistant-input-box"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Aura anything about destinations, budget, or itineraries..."
            disabled={isLoading}
            className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          <button
            id="ai-assistant-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white shadow-md shadow-emerald-600/30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          AuraVoyage AI Concierge • Tailored itineraries, seasonal weather & price transparency
        </p>
      </div>
    </div>
  );
};
