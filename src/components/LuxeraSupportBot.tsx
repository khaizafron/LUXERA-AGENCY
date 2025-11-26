import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Type, FunctionDeclaration } from "@google/genai";
import { MessageSquare, X, Send, Sparkles, LifeBuoy, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SERVICES, PLANS } from '../constants';

interface LuxeraSupportBotProps {
  userName: string;
}

interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  isTyping?: boolean;
}

// --- Tool Definitions ---

const submitTicketFunction: FunctionDeclaration = {
  name: 'submit_support_ticket',
  description: 'Submit a support ticket when a user reports a problem, bug, or explicitly asks for human help. Requires email and issue description.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      email: {
        type: Type.STRING,
        description: 'The email address of the user.',
      },
      issue_description: {
        type: Type.STRING,
        description: 'A detailed description of the problem or request.',
      },
      priority: {
        type: Type.STRING,
        description: 'Priority level: low, medium, or high.',
        enum: ['low', 'medium', 'high']
      }
    },
    required: ['email', 'issue_description'],
  },
};

// --- Context Building ---

const buildSystemContext = (userName: string) => {
  const servicesContext = SERVICES.map(s => 
    `- ${s.name} (${s.category}): ${s.description} [Limit: ${s.monthlyLimit}/mo]`
  ).join('\n');

  const plansContext = PLANS.map(p => 
    `- ${p.name}: $${p.price}/mo. Features: ${p.features.join(', ')}`
  ).join('\n');

  return `
    You are Luxera AI, the advanced virtual assistant for the Luxera Automation Platform.
    Your goal is to help users like ${userName} navigate the dashboard, understand services, and resolve issues.

    PLATFORM INFO:
    Luxera is a SaaS platform offering AI & Automation services.
    
    AVAILABLE SERVICES:
    ${servicesContext}

    PRICING PLANS:
    ${plansContext}

    COMPLIANCE & TERMS:
    - We strictly follow Meta's Commerce Policy for WhatsApp Automation.
    - Data is encrypted at rest and in transit (AES-256).
    - Users own their data.
    - WhatsApp Bots must be verified to avoid bans.

    GUIDELINES:
    1. Be professional, futuristic, and helpful.
    2. If a user asks "How do I use X?", explain the steps based on the service description.
    3. If a user reports a bug or asks for human support, YOU MUST ask for their email (if not provided in chat) and the issue details, then call the 'submit_support_ticket' tool.
    4. Answer both simple questions (e.g., "What is Luxera?") and complex ones (e.g., "How does the Python Data Analytics cron job work?").
    5. Keep answers concise but informative.
  `;
};

export const LuxeraSupportBot: React.FC<LuxeraSupportBotProps> = ({ userName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: `Hello ${userName}! I'm Luxera AI. How can I assist you with your automation today?` 
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const aiRef = useRef<GoogleGenAI | null>(null);

  useEffect(() => {
    // Initialize Gemini
    if (process.env.API_KEY) {
      aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
      console.warn("API_KEY is missing. LuxeraBot will work in mock mode.");
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsThinking(true);

    try {
      // 1. Construct History for Context
      // We grab the last 10 messages to keep context window manageable
      const history = messages.slice(-10).map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));

      // 2. Add current user message
      history.push({
        role: 'user',
        parts: [{ text: userMsg.text }]
      });

      let responseText = "I'm sorry, I'm having trouble connecting to my neural network right now.";

      if (aiRef.current) {
        const model = aiRef.current.models;
        
        // 3. Generate Content
        const result = await model.generateContent({
          model: 'gemini-2.5-flash',
          config: {
            systemInstruction: buildSystemContext(userName),
            tools: [{ functionDeclarations: [submitTicketFunction] }],
          },
          contents: history,
        });

        // 4. Check for Function Calls
        const toolCalls = result.functionCalls;
        
        if (toolCalls && toolCalls.length > 0) {
          // Handle Tool Call (Ticket Submission)
          for (const call of toolCalls) {
            if (call.name === 'submit_support_ticket') {
               const { email, issue_description, priority } = call.args as any;
               
               // Simulate backend API call
               console.log(`[TICKET SUBMITTED] Email: ${email}, Issue: ${issue_description}, Priority: ${priority}`);
               
               // Provide tool response
               const toolResponse = await model.generateContent({
                 model: 'gemini-2.5-flash',
                 config: { systemInstruction: buildSystemContext(userName) },
                 contents: [
                   ...history,
                   {
                     role: 'model',
                     parts: [{ functionCall: call }] // Include the call in history
                   },
                   {
                     role: 'user',
                     parts: [{ 
                       functionResponse: {
                         name: 'submit_support_ticket',
                         response: { result: 'success', ticket_id: `TICKET-${Math.floor(Math.random() * 10000)}` }
                       }
                     }]
                   }
                 ]
               });
               
               responseText = toolResponse.text || "Ticket submitted successfully!";
            }
          }
        } else {
          // Normal text response
          responseText = result.text || "I didn't get a response.";
        }
      } else {
        // Mock Mode Fallback
        await new Promise(r => setTimeout(r, 1000));
        responseText = "Gemini API Key is missing in environment. Please configure it to chat with me for real!";
      }

      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: responseText
      }]);

    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I encountered a system error. Please try again later."
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 shadow-lg shadow-purple-500/30 flex items-center justify-center text-white transition-all ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare className="w-7 h-7" />
        {/* Online Indicator */}
        <span className="absolute top-0 right-0 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] max-h-[80vh] bg-[#0F1115] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 p-4 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center border border-white/20">
                  <LifeBuoy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Luxera Support</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-gray-300 uppercase tracking-wider">AI Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/20"
            >
              {messages.map((msg) => (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'model' && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center mr-2 flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-tr-none'
                        : 'bg-[#1A1D24] border border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              
              {isThinking && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="w-8 h-8 mr-2" />
                  <div className="bg-[#1A1D24] border border-white/5 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                    <span className="text-xs text-gray-400">Thinking...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-[#0F1115]">
              <div className="relative flex items-center gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about services, terms, or help..."
                  className="w-full bg-[#1A1D24] border border-white/10 text-white text-sm rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:border-cyan-500/50 transition-all"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isThinking}
                  className="absolute right-2 p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-cyan-500/20 transition-all"
                >
                  <Send size={16} />
                </button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-600">Powered by Gemini 2.5 Flash • Luxera AI v1.0</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
