'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Upload, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Star, 
  ArrowRight, 
  Utensils, 
  RefreshCw, 
  ShieldCheck, 
  Zap,
  Plus,
  Send,
  MessageSquare,
  Sliders,
  Smartphone,
  Eye,
  Check,
  Flame,
  Clock,
  HeartHandshake,
  DollarSign,
  Search,
  Tag,
  Info,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct } from '@/lib/types';

interface ChatMessage {
  id: string;
  sender: 'customer' | 'ai_agent';
  text: string;
  timestamp: string;
}

export default function AiAssistantPage() {
  const { storefronts, importAiScannedMenu, sendManualSms, playDeliveryChime } = useNfcStore();
  const [selectedStorefrontId, setSelectedStorefrontId] = useState(storefronts[0]?.id || 'sf-oasis-roastery');
  const [activeTab, setActiveTab] = useState<'menu_scanner' | 'review_responder' | 'chat_simulator' | 'rules'>('menu_scanner');

  const currentStore = storefronts.find(s => s.id === selectedStorefrontId) || storefronts[0];

  // -------------------------------------------------------------
  // TAB 1: MENU SCANNER & ENHANCER STATE
  // -------------------------------------------------------------
  const [rawMenuInput, setRawMenuInput] = useState(`The Big Mountain Steak & Cheese Sub - $17.49
Thinly shaved USDA prime ribeye steak, melted white American cheese, grilled sweet onions, sauteed bell peppers, and chipotle garlic aioli on freshly baked French bread.

Wood-Fired Smoked Pulled Pork Pizza - $21.99
16" hand-stretched dough topped with 14-hour hickory smoked pulled pork, tangy New England maple BBQ sauce, red onion rings, mozzarella, and smoked gouda.

Lakeside Beer-Battered Lake Trout Basket - $16.50
Wild-caught local lake trout dipped in crisp local IPA batter, served with golden hand-cut fries, house coleslaw, and lemon-caper tartar sauce.`);

  const [isScanning, setIsScanning] = useState(false);
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [parsedProducts, setParsedProducts] = useState<StorefrontProduct[]>([]);
  const [importSuccess, setImportSuccess] = useState(false);

  // Preset Menu Templates
  const handleLoadPreset = (preset: 'grill' | 'cafe' | 'pizza') => {
    if (preset === 'grill') {
      setRawMenuInput(`The Big Mountain Steak & Cheese Sub - $17.49\nThinly shaved prime ribeye, melted white American, caramelized sweet onions, and roasted garlic aioli.\n\nHickory Bacon Smash Burger - $15.99\nTwo 4oz grass-fed smash patties, applewood bacon, sharp Vermont cheddar, house pickles, and campfire sauce on brioche.\n\nCrispy Buffalo Chicken Tenders Basket - $13.99\nButtermilk-brined chicken breast tenders, spicy honey buffalo glaze, celery sticks, and house gorgonzola dip.`);
    } else if (preset === 'cafe') {
      setRawMenuInput(`Single-Origin Nitro Cold Brew (16oz) - $5.50\nSlow-steeped Colombian roast infused with nitrogen for a creamy, velvety head. Notes of dark chocolate and caramel.\n\nArtisan Turkey Cranberry Panini - $12.99\nRoasted turkey breast, tangy NH cranberry-orange relish, aged cheddar pressed crisp on rustic sourdough.\n\nWarm Cinnamon Brioche Roll - $4.50\nFreshly baked golden brioche swirled with Korintje cinnamon, topped with vanilla bean cream cheese glaze.`);
    } else if (preset === 'pizza') {
      setRawMenuInput(`16" Margherita Fresca - $19.99\nCrushed San Marzano tomatoes, fresh buffalo mozzarella, fragrant sweet basil, extra virgin olive oil, and flaky sea salt.\n\n16" Meat Lover's Mountain Pie - $24.50\nSpicy pepperoni, local Italian sweet sausage, smoked bacon, shaved prosciutto, and house mozzarella blend.\n\nGarlic Herb Dough Knots (6pc) - $7.99\nOven-baked knot pastries tossed in roasted garlic butter, parsley, and freshly grated Parmigiano-Reggiano.`);
    }
  };

  // AI Menu Processing & Auto-Enrichment
  const handleScanMenu = () => {
    setIsScanning(true);
    setTimeout(() => {
      const blocks = rawMenuInput.split('\n\n').filter(Boolean);
      const generated: StorefrontProduct[] = blocks.map((block, idx) => {
        const lines = block.split('\n');
        const firstLine = lines[0] || '';
        const descLine = lines[1] || 'Handcrafted fresh daily with premium locally sourced ingredients.';
        const priceMatch = firstLine.match(/\$([0-9.]+)/);
        const nameClean = firstLine.replace(/\s*-\s*\$[0-9.]+.*$/, '').trim() || `Chef Special #${idx + 1}`;
        const price = priceMatch ? parseFloat(priceMatch[1]) : 14.99;

        // Auto Dietary & Pairing Enrichment
        const isGlutenFree = descLine.toLowerCase().includes('trout') || descLine.toLowerCase().includes('salad') || descLine.toLowerCase().includes('cold brew');
        const isVegetarian = descLine.toLowerCase().includes('margherita') || descLine.toLowerCase().includes('cinnamon');
        const isChefPick = idx === 0;

        const defaultImages = [
          'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&auto=format&fit=crop&q=80',
          'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80'
        ];

        return {
          id: `ai-prod-${Date.now()}-${idx}`,
          name: nameClean,
          description: descLine,
          price,
          category: idx === 0 ? 'Signature Entrees' : idx === 1 ? 'Pizzas & Flatbreads' : 'Sides & Appetizers',
          imageUrl: defaultImages[idx % defaultImages.length],
          inStock: true,
          calories: `${520 + (idx * 110)} cal`,
          badge: isChefPick ? '⭐ Best Seller' : isGlutenFree ? '🌾 Gluten-Free Option' : undefined
        };
      });

      setParsedProducts(generated);
      setIsScanning(false);
      playDeliveryChime();
    }, 1200);
  };

  const handleApplyImport = () => {
    if (parsedProducts.length === 0) return;
    importAiScannedMenu(selectedStorefrontId, parsedProducts);
    setImportSuccess(true);
    playDeliveryChime();
    setTimeout(() => {
      setImportSuccess(false);
      setParsedProducts([]);
    }, 3500);
  };

  // -------------------------------------------------------------
  // TAB 2: AUTONOMOUS REVIEW RESPONDER STATE
  // -------------------------------------------------------------
  const [reviewStars, setReviewStars] = useState<number>(5);
  const [customerName, setCustomerName] = useState('Sarah J.');
  const [customerReviewText, setCustomerReviewText] = useState('Best steak and cheese sub in Carroll County! The staff was super friendly and food came out in 10 minutes. Will be back every weekend.');
  const [responseTone, setResponseTone] = useState<'grateful_seo' | 'friendly' | 'apology_resolution' | 'concise'>('grateful_seo');
  const [generatedResponse, setGeneratedResponse] = useState('');
  const [copiedNotice, setCopiedNotice] = useState(false);
  const [autoReplyEnabled, setAutoReplyEnabled] = useState(true);

  const handleGenerateReply = () => {
    const targetStore = currentStore?.businessName || 'our team';

    if (reviewStars >= 4) {
      if (responseTone === 'grateful_seo') {
        setGeneratedResponse(`Thank you so much for the fantastic 5-star review, ${customerName}! Here at ${targetStore} in Carroll County, our family takes immense pride in handcrafting the freshest hot subs, artisan pizzas, and roadside favorites on Route 25. We can't wait to welcome you back next weekend! ⭐`);
      } else if (responseTone === 'friendly') {
        setGeneratedResponse(`Hey ${customerName}! Reading this totally made our whole kitchen team's day! Thank you for stopping by ${targetStore}. See you again soon for another delicious bite! 😊`);
      } else if (responseTone === 'concise') {
        setGeneratedResponse(`Thanks so much for the 5 stars, ${customerName}! Great to have you at ${targetStore}. Looking forward to your next visit!`);
      } else {
        setGeneratedResponse(`Thank you ${customerName} for dining with ${targetStore}! We appreciate your support for local Carroll County family businesses.`);
      }
    } else {
      if (responseTone === 'apology_resolution') {
        setGeneratedResponse(`Dear ${customerName}, thank you for bringing this to our attention. At ${targetStore}, we hold ourselves to the highest standards, and we sincerely apologize that your recent experience fell short. We would love the opportunity to make this right—please reach out to our management directly at frijj555@gmail.com so we can take care of your next meal on us.`);
      } else {
        setGeneratedResponse(`Hi ${customerName}, we are truly sorry your visit to ${targetStore} didn't meet your expectations. Your feedback is invaluable to our crew. Please email us directly so we can make things right immediately.`);
      }
    }
  };

  const handleCopyReply = () => {
    navigator.clipboard.writeText(generatedResponse);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  // -------------------------------------------------------------
  // TAB 3: LIVE AI CHAT SIMULATOR STATE
  // -------------------------------------------------------------
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'customer',
      text: 'Hi! Do you deliver food and firewood to boat docks on Ossipee Lake?',
      timestamp: '10:02 AM'
    },
    {
      id: 'msg-2',
      sender: 'ai_agent',
      text: `Hello! Yes absolutely! 🌲 ${currentStore?.businessName || 'Townraise'} couriers deliver hot meals, pizzas, and kiln-dried hardwood firewood bundles directly to public boat launches, lakeside firepits, and private docks in Carroll County. Our average delivery time is ~25-35 minutes!`,
      timestamp: '10:02 AM'
    }
  ]);
  const [userInput, setUserInput] = useState('');
  const [aiTyping, setAiTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || userInput;
    if (!text.trim()) return;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: 'customer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, newMsg]);
    if (!textToSend) setUserInput('');
    setAiTyping(true);

    // AI Agent Response generation
    setTimeout(() => {
      let responseText = '';
      const lower = text.toLowerCase();

      if (lower.includes('gluten') || lower.includes('allergy') || lower.includes('celiac')) {
        responseText = `Yes! We offer gluten-free cauliflower pizza crusts, gluten-free sandwich wraps, and dedicated preparation options at ${currentStore.businessName}. Please mention any allergies in the order notes so our kitchen takes extra care!`;
      } else if (lower.includes('hours') || lower.includes('open') || lower.includes('sunday')) {
        responseText = `We are open 7 days a week from 11:00 AM to 9:00 PM! Online ordering and dockside dispatch run until 8:30 PM daily.`;
      } else if (lower.includes('firewood') || lower.includes('dock') || lower.includes('lake') || lower.includes('smores')) {
        responseText = `You can order our Seasoned Hardwood Firewood Bundle & Campfire S'mores kit directly through the Lake Concierge portal (/concierge). Couriers deliver straight to your dock!`;
      } else if (lower.includes('best') || lower.includes('recommend') || lower.includes('popular')) {
        responseText = `Our top customer favorites at ${currentStore.businessName} are The Big Mountain Steak & Cheese Sub ($17.49) and our Wood-Fired Smoked Pulled Pork Pizza ($21.99)!`;
      } else {
        responseText = `Thanks for reaching out to ${currentStore.businessName}! You can browse our full live digital menu, place a delivery or dine-in order, or tap to reserve right here on Townraise. How else can I help your party today? 😊`;
      }

      setChatMessages(prev => [
        ...prev,
        {
          id: `chat-ai-${Date.now()}`,
          sender: 'ai_agent',
          text: responseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setAiTyping(false);
      playDeliveryChime();
    }, 700);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5 animate-pulse" />
            Autonomous AI Multi-Modal Engine v4.2 • 24/7 Active
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            AI Menu Intelligence & Customer Response Agent
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Digitize paper menus into high-definition interactive dishes and deploy autonomous 24/7 AI agents to answer customer inquiries and reviews.
          </p>
        </div>

        {/* Selected Storefront Picker */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-white/40 uppercase font-bold block">Assigned Merchant Node</span>
            <span className="text-xs font-bold text-amber-400">{currentStore?.businessName}</span>
          </div>
          <select
            value={selectedStorefrontId}
            onChange={(e) => setSelectedStorefrontId(e.target.value)}
            className="bg-[#12121e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
          >
            {storefronts.map((sf) => (
              <option key={sf.id} value={sf.id}>
                {sf.businessName} ({sf.town})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-[#0c0c14] border border-white/5 rounded-2xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('menu_scanner')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'menu_scanner'
              ? 'bg-amber-500 text-black font-black shadow-lg shadow-amber-500/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>AI Menu Scanner & Enhancer</span>
        </button>

        <button
          onClick={() => setActiveTab('review_responder')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'review_responder'
              ? 'bg-indigo-600 text-white font-black shadow-lg shadow-indigo-500/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Star className="w-4 h-4 text-amber-400" />
          <span>Review & Feedback Responder</span>
        </button>

        <button
          onClick={() => setActiveTab('chat_simulator')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'chat_simulator'
              ? 'bg-emerald-500 text-black font-black shadow-lg shadow-emerald-500/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Live 24/7 AI Chat Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'rules'
              ? 'bg-purple-600 text-white font-black shadow-lg shadow-purple-500/20'
              : 'text-white/60 hover:text-white hover:bg-white/5'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Autonomous Rules & Guardrails</span>
        </button>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* TAB 1: AI MENU SCANNER & ENHANCER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'menu_scanner' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Input Text / OCR Paste */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Paste Menu Text or OCR Scan
                  </h3>

                  {/* Preset Loaders */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-white/40 font-bold uppercase mr-1">Presets:</span>
                    <button
                      onClick={() => handleLoadPreset('grill')}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-amber-300"
                    >
                      Grill & Sub
                    </button>
                    <button
                      onClick={() => handleLoadPreset('pizza')}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-orange-300"
                    >
                      Pizzeria
                    </button>
                    <button
                      onClick={() => handleLoadPreset('cafe')}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded-md text-[10px] font-bold text-emerald-300"
                    >
                      Cafe / Bakery
                    </button>
                  </div>
                </div>

                <textarea
                  rows={9}
                  value={rawMenuInput}
                  onChange={(e) => setRawMenuInput(e.target.value)}
                  placeholder="Paste menu items (e.g. Dish Name - $Price followed by description)..."
                  className="w-full bg-[#13131e] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 font-mono leading-relaxed"
                />

                <div className="flex items-center justify-between pt-2">
                  <div className="text-[11px] text-white/50">
                    💡 Formats: <code>Name - $Price</code> on line 1, ingredients on line 2.
                  </div>

                  <button
                    onClick={handleScanMenu}
                    disabled={isScanning || !rawMenuInput.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
                  >
                    {isScanning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Analyzing & Enhancing...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Parse & Auto-Enrich Dishes</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: AI Enriched Menu Output & Deployment */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      AI Enriched Dish Output ({parsedProducts.length} Items)
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">
                      Auto-matched with HD imagery, dietary tags, calorie estimates & pricing.
                    </p>
                  </div>

                  {parsedProducts.length > 0 && (
                    <button
                      onClick={handleApplyImport}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Sync to {currentStore?.businessName}</span>
                    </button>
                  )}
                </div>

                {/* Import Success Message */}
                {importSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Successfully deployed items to {currentStore?.businessName} Storefront & Kitchen KDS!</span>
                  </div>
                )}

                {/* Empty State */}
                {parsedProducts.length === 0 && !isScanning && (
                  <div className="py-12 text-center text-white/40 space-y-2 border border-dashed border-white/10 rounded-xl">
                    <Utensils className="w-8 h-8 mx-auto text-white/20" />
                    <p className="text-xs font-bold">No dishes parsed yet.</p>
                    <p className="text-[11px] text-white/30">Click "Parse & Auto-Enrich Dishes" on the left to test the AI.</p>
                  </div>
                )}

                {/* Parsed Dishes List */}
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {parsedProducts.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-[#131320] border border-white/5 rounded-xl flex items-center gap-3.5 hover:border-amber-500/30 transition-all"
                    >
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
                          <span className="text-xs font-black text-amber-400 shrink-0">${item.price.toFixed(2)}</span>
                        </div>
                        <p className="text-[11px] text-white/60 line-clamp-1 mt-0.5">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {item.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              {item.badge}
                            </span>
                          )}
                          <span className="text-[10px] text-white/40 font-mono">{item.calories}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 2: AUTONOMOUS REVIEW & FEEDBACK RESPONDER */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'review_responder' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Review Simulator & Config */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-400" />
                Customer Review Context
              </h3>

              {/* Star rating selector */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1.5">
                  Star Rating Received
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewStars(star)}
                      className={`p-2 rounded-xl border flex items-center gap-1 text-xs font-bold transition-all ${
                        reviewStars >= star
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-400'
                          : 'bg-white/5 border-white/5 text-white/30'
                      }`}
                    >
                      <Star className={`w-4 h-4 ${reviewStars >= star ? 'fill-amber-400' : ''}`} />
                      <span>{star}★</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Name */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-[#13131e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Review Text */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Customer Review Text
                </label>
                <textarea
                  rows={3}
                  value={customerReviewText}
                  onChange={(e) => setCustomerReviewText(e.target.value)}
                  className="w-full bg-[#13131e] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              {/* Response Persona / Tone */}
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1.5">
                  AI Response Tone & Strategy
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'grateful_seo', label: 'Grateful Local SEO', desc: 'Boosts Google Maps ranking with keywords' },
                    { id: 'friendly', label: 'Warm & Hospitable', desc: 'Family-style friendly tone' },
                    { id: 'apology_resolution', label: 'Empathy & Resolution', desc: 'Private resolution with owner email' },
                    { id: 'concise', label: 'Quick & Crisp', desc: 'Fast, professional acknowledgment' },
                  ].map((tone) => (
                    <button
                      key={tone.id}
                      onClick={() => setResponseTone(tone.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        responseTone === tone.id
                          ? 'bg-indigo-600/20 border-indigo-500/50 text-white'
                          : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white'
                      }`}
                    >
                      <div className="text-xs font-bold">{tone.label}</div>
                      <div className="text-[10px] text-white/40 mt-0.5">{tone.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleGenerateReply}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Autonomous AI Response</span>
              </button>
            </div>
          </div>

          {/* Right Column: AI Response Preview */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-400" />
                  Generated AI Response Preview
                </h3>

                {generatedResponse && (
                  <button
                    onClick={handleCopyReply}
                    className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-all"
                  >
                    {copiedNotice ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedNotice ? 'Copied!' : 'Copy Reply'}</span>
                  </button>
                )}
              </div>

              <div className="p-4 bg-[#12121e] border border-white/10 rounded-xl min-h-[160px] flex flex-col justify-between">
                {generatedResponse ? (
                  <p className="text-xs text-white leading-relaxed font-sans">{generatedResponse}</p>
                ) : (
                  <div className="text-center py-8 text-white/30 text-xs">
                    Click "Generate Autonomous AI Response" on the left to see the drafted reply.
                  </div>
                )}

                {generatedResponse && (
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
                    <span>{generatedResponse.length} characters</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Safe & Google SEO Optimized
                    </span>
                  </div>
                )}
              </div>

              {/* Direct Post Simulation */}
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">24/7 Autonomous Google Auto-Reply</span>
                  <span className="text-[11px] text-white/50">Automatically post 5-star gratitude replies in &lt; 2 minutes</span>
                </div>

                <button
                  onClick={() => setAutoReplyEnabled(!autoReplyEnabled)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    autoReplyEnabled 
                      ? 'bg-emerald-500 text-black font-black' 
                      : 'bg-white/10 text-white/40'
                  }`}
                >
                  {autoReplyEnabled ? '🟢 Enabled' : '⚪ Paused'}
                </button>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 3: LIVE 24/7 AI CHAT SIMULATOR */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'chat_simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: Quick Prompts & Knowledge Ingestion */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Test Sample Inquiries
              </h3>
              <p className="text-xs text-white/50">
                Click any common customer question below to see how the AI agent autonomously responds using {currentStore?.businessName}'s real live menu.
              </p>

              <div className="space-y-2">
                {[
                  'Do you deliver food and firewood to boat docks on Ossipee Lake?',
                  'Are there any gluten-free pizza or bun options?',
                  'What are your most popular best-selling sandwiches?',
                  'What time do you close on Sundays?',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendMessage(prompt)}
                    className="w-full p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/5 text-left text-xs text-white/80 transition-all flex items-center justify-between group"
                  >
                    <span className="truncate pr-2">{prompt}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-white/30 group-hover:text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-white/5">
                <div className="flex items-center gap-2 text-[11px] text-white/60">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>The AI Agent dynamically scans your live storefront inventory & pricing.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Interactive iPhone Chat Interface */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                    AI
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{currentStore?.businessName} Support Agent</h3>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Active 24/7 Multi-Channel Responder
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setChatMessages([chatMessages[0], chatMessages[1]])}
                  className="text-[10px] text-white/40 hover:text-white"
                >
                  Clear Chat
                </button>
              </div>

              {/* Message Thread */}
              <div className="space-y-3 min-h-[280px] max-h-[320px] overflow-y-auto p-2">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'customer' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'customer'
                          ? 'bg-amber-500 text-black font-medium rounded-tr-sm'
                          : 'bg-[#181826] text-white border border-white/10 rounded-tl-sm'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-white/30 px-1 mt-1 font-mono">{msg.timestamp}</span>
                  </div>
                ))}

                {aiTyping && (
                  <div className="flex items-center gap-1.5 text-xs text-white/50 bg-[#181826] border border-white/10 rounded-2xl px-3 py-2 w-28">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[10px] text-white/40 ml-1">Typing...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 pt-2 border-t border-white/5"
              >
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Ask any customer question about menu, hours, or delivery..."
                  className="flex-1 bg-[#13131e] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-emerald-500/50"
                />
                <button
                  type="submit"
                  disabled={!userInput.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-black font-black text-xs uppercase rounded-xl transition-all flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* TAB 4: AUTONOMOUS RULES & GUARDRAILS */}
      {/* ------------------------------------------------------------- */}
      {activeTab === 'rules' && (
        <div className="max-w-4xl space-y-6">
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-6 space-y-6">
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Autonomous Agent Operating Parameters
              </h3>
              <p className="text-xs text-white/50 mt-0.5">
                Configure safety guardrails, auto-dispatch rules, and merchant-specific guidelines.
              </p>
            </div>

            <div className="space-y-4 divide-y divide-white/5">
              
              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Instant 5-Star Google Review Auto-Publish</h4>
                  <p className="text-[11px] text-white/50">Automatically thank 5-star reviewers without requiring manual owner review.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-amber-500 cursor-pointer" />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Negative Feedback Escalation Filter</h4>
                  <p className="text-[11px] text-white/50">Any 1-3 star review automatically alerts the store owner's mobile phone via SMS instead of public posting.</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-emerald-500 cursor-pointer" />
              </div>

              <div className="pt-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">2-Way SMS Auto-Responder Speed</h4>
                  <p className="text-[11px] text-white/50">Maximum latency before responding to customer text inquiries.</p>
                </div>
                <select className="bg-[#141420] border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white">
                  <option>Instant (&lt; 15 seconds)</option>
                  <option>1 Minute</option>
                  <option>5 Minutes</option>
                </select>
              </div>

              <div className="pt-4 space-y-2">
                <h4 className="text-xs font-bold text-white">Custom Merchant Knowledge Base Injection</h4>
                <p className="text-[11px] text-white/50">Provide specific house policies, boat dock delivery rules, or special dietary notes for the AI agent to reference.</p>
                <textarea
                  rows={3}
                  defaultValue="We offer dock delivery to Lake Ossipee boat ramps. Gluten-free rolls available upon request for +$1.50. We accept Cash App, Venmo, Zelle, and Apple Pay."
                  className="w-full bg-[#13131e] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500/50 font-sans"
                />
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
