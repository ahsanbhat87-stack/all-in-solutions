/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Search, 
  FlaskConical, 
  ArrowRight, 
  MessageSquare, 
  Image as ImageIcon,
  ChevronRight,
  Send,
  Loader2,
  Menu,
  X,
  History,
  Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type ViewState = 'landing' | 'discovery' | 'laboratory' | 'about';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const DISCOVERY_ITEMS = [
  {
    id: 1,
    title: "WEB DEVELOPMENT",
    category: "ENGINEERING",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop",
    description: "High-performance, responsive web architectures built for the modern edge."
  },
  {
    id: 2,
    title: "APP DEVELOPMENT",
    category: "MOBILE",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2670&auto=format&fit=crop",
    description: "Native and cross-platform applications with seamless user experiences."
  },
  {
    id: 3,
    title: "AI AUTOMATION",
    category: "INTELLIGENCE",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2664&auto=format&fit=crop",
    description: "Integrating advanced neural networks to streamline complex business workflows."
  },
  {
    id: 4,
    title: "DIGITAL MARKETING",
    category: "STRATEGY",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop",
    description: "Data-driven growth strategies to amplify your digital presence."
  },
  {
    id: 5,
    title: "UI/UX DESIGN",
    category: "CREATIVE",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563dc4c?q=80&w=2670&auto=format&fit=crop",
    description: "Prototyping intuitive interfaces that bridge the gap between human and machine."
  },
  {
    id: 6,
    title: "CLOUD SOLUTIONS",
    category: "INFRASTRUCTURE",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop",
    description: "Scalable cloud deployments and serverless architecture management."
  }
];

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: chatInput };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: chatInput }] }
        ],
        config: {
          systemInstruction: "You are the ALL IN SOLUTIONS Digital Assistant. You are professional, efficient, and forward-thinking. You represent a service-based agency providing web development, app development, AI automation, and digital marketing. Be helpful, concise, and guide clients toward the best technical solutions."
        }
      });

      const assistantMessage: Message = { 
        role: 'assistant', 
        content: response.text || "Connection lost. Please try again." 
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "SYSTEM ERROR: Pipeline interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const NavLink = ({ label, target }: { label: string, target: ViewState }) => (
    <button 
      onClick={() => { setView(target); setIsMenuOpen(false); window.scrollTo(0,0); }}
      className={`font-mono uppercase tracking-widest text-sm hover:line-through transition-all ${view === target ? 'font-bold' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white brutal-border border-0 border-b px-6 py-4 flex items-center justify-between">
        <h1 
          className="font-display text-3xl tracking-tighter cursor-pointer"
          onClick={() => { setView('landing'); window.scrollTo(0,0); }}
        >
          ALL IN SOLUTIONS
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
          <NavLink label="Home" target="landing" />
          <NavLink label="Services" target="discovery" />
          <NavLink label="About" target="about" />
          <button 
            onClick={() => setView('laboratory')}
            className="group flex items-center gap-2 bg-black text-white px-5 py-2 font-mono text-xs uppercase tracking-widest hover:bg-white hover:text-black brutal-border transition-all h-10"
          >
            Strategy Lab <Zap size={14} className="group-hover:text-yellow-400" />
          </button>
        </nav>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-white pt-32 px-8 flex flex-col gap-10 text-center"
          >
            <NavLink label="Home" target="landing" />
            <NavLink label="Services" target="discovery" />
            <NavLink label="About" target="about" />
            <button 
              onClick={() => { setView('laboratory'); setIsMenuOpen(false); }}
              className="bg-black text-white p-5 font-display text-2xl uppercase tracking-widest mt-4"
            >
              START AI CONSULT
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 pt-20">
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Hero Section */}
              <section className="px-6 py-24 md:py-48 max-w-7xl mx-auto flex flex-col items-center text-center">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-12"
                >
                   <span className="font-mono text-xs uppercase tracking-[0.5em] px-4 py-2 border-2 border-black inline-block">Digital Transformation Partners</span>
                  <h2 className="font-display text-[clamp(4rem,14vw,12rem)] leading-[0.8] tracking-tighter">
                    BUILD THE <br/> FUTURE.
                  </h2>
                  <p className="font-sans text-xl md:text-2xl max-w-2xl mx-auto text-gray-700 leading-relaxed">
                    A full-service agency crafting digital experiences that fuse advanced engineering with radical design.
                  </p>
                  <div className="flex flex-wrap justify-center gap-6 pt-12">
                     <button 
                        onClick={() => setView('discovery')}
                        className="bg-black text-white px-10 py-5 font-mono uppercase tracking-widest text-sm brutal-shadow-hover hover:-translate-y-1 transition-all"
                      >
                        Explore Services
                      </button>
                       <button 
                        onClick={() => setView('about')}
                        className="bg-white text-black px-10 py-5 font-mono uppercase tracking-widest text-sm brutal-border hover:bg-gray-50 transition-all border-2"
                      >
                        Company Story
                      </button>
                  </div>
                </motion.div>
                
                {/* Marquee Section */}
                <div className="mt-32 w-screen relative -ml-[50vw] left-1/2 brutal-border border-0 border-y py-6 bg-black text-white overflow-hidden">
                   <div className="flex whitespace-nowrap animate-marquee">
                    {[1, 2, 3, 4].map((i) => (
                      <span key={i} className="font-mono text-sm uppercase tracking-[1em] px-12">
                        WEB SOLUTIONS • APP DEVELOPMENT • AI AUTOMATION • DIGITAL MARKETING • CLOUD ARCHITECTURE
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* Bento Grid Features */}
              <section className="px-6 py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-8 brutal-border p-12 bg-white brutal-shadow flex flex-col gap-12 group">
                    <Zap size={64} className="group-hover:rotate-12 transition-transform" />
                    <div>
                      <h3 className="font-display text-5xl mb-6">INTELLIGENT SYSTEMS</h3>
                      <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                        We don't just write code. We build autonomous engines that drive efficiency. 
                        Our AI-first approach reduces operational overhead by up to 60%.
                      </p>
                    </div>
                  </div>
                  <div className="md:col-span-4 brutal-border p-12 bg-black text-white flex flex-col justify-between">
                    <FlaskConical size={48} />
                    <div className="space-y-4">
                      <h4 className="font-display text-2xl">LAB DRIVEN</h4>
                      <p className="font-mono text-xs uppercase opacity-60">Constant experimentation with emerging technology stacks.</p>
                    </div>
                  </div>
                  <div className="md:col-span-4 brutal-border p-12 bg-white flex flex-col gap-8">
                    <Search size={32} />
                    <h4 className="font-display text-2xl">SEO & VISIBILITY</h4>
                    <p className="text-sm text-gray-600">Dominating search rankings through technical precision and meaningful content.</p>
                  </div>
                   <div className="md:col-span-8 brutal-border p-8 bg-white flex items-center justify-between group cursor-pointer" onClick={() => setView('discovery')}>
                    <h4 className="font-display text-3xl">VIEW OUR DIGITAL PORTFOLIO</h4>
                    <ChevronRight size={48} className="group-hover:translate-x-4 transition-transform" />
                  </div>
                </div>
              </section>
            </motion.div>
          )}

          {view === 'discovery' && (
            <motion.div 
              key="discovery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-24 max-w-7xl mx-auto"
            >
              <header className="mb-20">
                <h2 className="font-display text-8xl tracking-tighter mb-8 leading-none">CORE <br/> SERVICES</h2>
                <div className="h-1 bg-black w-32" />
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                {DISCOVERY_ITEMS.map((item) => (
                  <div key={item.id} className="brutal-border p-12 flex flex-col gap-8 hover:bg-black hover:text-white transition-all group">
                    <div className="w-16 h-16 bg-gray-100 flex items-center justify-center brutal-border group-hover:bg-white group-hover:text-black">
                       <Zap size={24} />
                    </div>
                    <h3 className="font-display text-3xl">{item.title}</h3>
                    <p className="font-sans text-gray-500 group-hover:text-gray-300 leading-relaxed">{item.description}</p>
                    <button className="font-mono text-[10px] font-bold uppercase tracking-widest border-b-2 border-black inline-block w-fit group-hover:border-white">
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {view === 'about' && (
            <motion.div 
              key="about"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 md:p-32 max-w-5xl mx-auto"
            >
              <h2 className="font-display text-8xl tracking-tighter mb-16">WE ARE <br/> ALL IN.</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
                <div className="space-y-12">
                  <p className="text-3xl leading-snug italic font-medium">
                    "Success isn't found in defaults. It's found in the courage to 
                    architect something unique."
                  </p>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    ALL IN SOLUTIONS was founded on a simple premise: Digital agencies should be as 
                    dynamic as the technology they use. We operate as an extension of your own vision, 
                    dedicated to shipping products that matter.
                  </p>
                </div>
                <div className="space-y-12">
                   <div className="grid grid-cols-1 gap-6">
                    <div className="p-10 brutal-border bg-black text-white">
                      <h4 className="font-mono text-xs uppercase tracking-[0.3em] mb-6 opacity-60">The Mission</h4>
                      <p className="text-lg">To provide every client with the technological sovereignty needed to lead their industry.</p>
                    </div>
                    <div className="p-10 brutal-border">
                      <h4 className="font-mono text-xs uppercase tracking-[0.3em] mb-6 opacity-60">The Vision</h4>
                      <p className="text-lg">A world where human creativity is amplified by perfectly engineered intelligent systems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'laboratory' && (
             <motion.div 
              key="laboratory"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen p-6 md:p-24 bg-gray-50 flex flex-col"
            >
               <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
                <header className="mb-12">
                  <h2 className="font-display text-6xl tracking-tighter">AI STRATEGY LAB</h2>
                  <p className="font-mono text-xs uppercase tracking-widest opacity-60 mt-4">Consult with our Intelligence Hub to define your technical requirements.</p>
                </header>

                <div className="flex-1 brutal-border bg-white brutal-shadow flex flex-col overflow-hidden mb-8">
                  <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {messages.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-30">
                        <FlaskConical size={64} className="mb-6" />
                        <p className="font-mono text-xs uppercase tracking-[0.5em]">System Standby: Awaiting Query</p>
                      </div>
                    )}
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-6 max-w-[80%] brutal-border ${m.role === 'user' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
                          <div className="font-mono text-[9px] uppercase tracking-widest mb-2 opacity-50">
                            {m.role === 'user' ? '[Client Request]' : '[System Response]'}
                          </div>
                          <p className="text-sm leading-relaxed">{m.content}</p>
                        </div>
                      </div>
                    ))}
                     {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white p-5 brutal-border flex items-center gap-3">
                          <Loader2 className="animate-spin" size={16} />
                          <span className="font-mono text-[10px] uppercase tracking-widest">Processing...</span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-gray-50 border-t-2 border-black flex gap-4">
                    <input 
                      type="text" 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="DESCRIBE YOUR DIGITAL VISION..."
                      className="flex-1 bg-white brutal-border p-4 font-mono text-xs uppercase outline-none focus:bg-white transition-all"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isLoading || !chatInput.trim()}
                      className="bg-black text-white px-8 brutal-shadow hover:translate-y-1 transition-all disabled:opacity-50"
                    >
                      <Send size={24} />
                    </button>
                  </div>
                </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Corporate Footer */}
      <footer className="bg-black text-white p-16 md:p-32 mt-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16">
          <div className="md:col-span-6 space-y-8">
            <h2 className="font-display text-5xl tracking-tighter">ALL IN SOLUTIONS</h2>
            <p className="font-sans text-xl opacity-60 leading-relaxed max-w-sm">
              We specialize in the high-end digital products of tomorrow. 
              Based globally, shipping locally.
            </p>
          </div>
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-white border-opacity-20 pb-2">Connect</h4>
            <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
              <li className="hover:text-white cursor-pointer transition-colors">LinkedIn</li>
              <li className="hover:text-white cursor-pointer transition-colors">Twitter (X)</li>
              <li className="hover:text-white cursor-pointer transition-colors">GitHub</li>
            </ul>
          </div>
          <div className="md:col-span-3 space-y-6">
            <h4 className="font-mono text-xs font-bold uppercase tracking-widest border-b border-white border-opacity-20 pb-2">Contact</h4>
            <ul className="space-y-4 font-mono text-[10px] uppercase tracking-widest opacity-60">
              <li>hello@allinsolutions.com</li>
              <li>Schedule a Call</li>
              <li>Press Inquiries</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 pt-8 border-t border-white border-opacity-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-mono text-[9px] uppercase tracking-widest opacity-40">© 2026 ALL IN SOLUTIONS. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-8">
             <span className="font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer">Privacy Policy</span>
             <span className="font-mono text-[9px] uppercase tracking-widest opacity-40 hover:opacity-100 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
