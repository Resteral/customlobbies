'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  Sparkles, 
  Send, 
  Utensils, 
  ShoppingBag, 
  Check, 
  Plus, 
  Flame, 
  ArrowRight, 
  Star,
  Coffee,
  Waves,
  Wrench,
  Search,
  Filter,
  Truck,
  Phone,
  PhoneCall,
  CheckCircle2,
  RefreshCw,
  Store
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useNfcStore } from '@/lib/store';
import { StorefrontProduct, MerchantStorefront, DeliveryOrder } from '@/lib/types';
import { EFFINGHAM_AREA_BUSINESSES, LocalBusiness } from '@/lib/local-businesses';

interface ConciergeMsg {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  suggestedDishes?: {
    dish: StorefrontProduct;
    store: MerchantStorefront;
  }[];
  suggestedBusinesses?: LocalBusiness[];
  quickOptions?: string[];
  showCheckoutBtn?: boolean;
  showDeliveryForm?: boolean;
  showCallAheadForm?: boolean;
  confirmedDeliveryOrder?: DeliveryOrder;
  timestamp: string;
}

export default function DedicatedAiConciergePage() {
  const { storefronts, addToCart, cart, clearCart, placeDeliveryOrder, sendManualSms, playDeliveryChime } = useNfcStore();
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [addedItemNotice, setAddedItemNotice] = useState<string | null>(null);

  // In-Chat Dispatch State
  const [custName, setCustName] = useState('Alex Tremblay');
  const [custPhone, setCustPhone] = useState('(603) 555-0199');
  const [custAddress, setCustAddress] = useState('Pine Cove Dock 3, Ossipee Lake (Freedom, NH)');
  const [custPayment, setCustPayment] = useState<'cash_on_delivery' | 'cash_app' | 'venmo' | 'card'>('cash_on_delivery');
  const [custNotes, setCustNotes] = useState('Leave on dock table. Text when arrived.');
  const [isDispatching, setIsDispatching] = useState(false);

  // Call-Ahead State
  const [callStoreId, setCallStoreId] = useState<string>(EFFINGHAM_AREA_BUSINESSES[0]?.id || 'biz-eff-pnb-eats');
  const [callPickupType, setCallPickupType] = useState<'paid_phone' | 'prepay_sean' | 'cash_delivery'>('paid_phone');
  const [callPickupNameOrCode, setCallPickupNameOrCode] = useState('Alex - Order #42');
  const [callEstimatedCost, setCallEstimatedCost] = useState('28.50');
  const [callItemDescription, setCallItemDescription] = useState('2 Large subs + fries from the grill');

  const selectedCallBiz = EFFINGHAM_AREA_BUSINESSES.find(b => b.id === callStoreId) || EFFINGHAM_AREA_BUSINESSES[0];

  const [messages, setMessages] = useState<ConciergeMsg[]>([
    {
      id: 'msg-start',
      sender: 'ai',
      text: "👋 Welcome to the Carroll County AI Food & Call-In Courier Assistant! \n\n📞 Looking to call a local business? I will look up their **direct phone number** so you can call in your order. You can either pay the store over the phone, or prepay courier **Sean Martin** to pay for and pick up your items!",
      quickOptions: [
        '📞 Call Store & Dispatch Pickup',
        '🍔 Hungry for Food / Order Lunch & Dinner',
        '🥩 PNB Eats: (603) 539-7440',
        '🍕 Pizza Barn: (603) 539-2244',
        '🛠️ Ace Hardware: (603) 539-2666',
        '🌲 Campfire Firewood & S\'mores Kit'
      ],
      timestamp: 'Just now'
    }
  ]);

  // Find matching businesses with deep category, menu item, and semantic keyword matching
  const findMatchingBusinesses = (query: string): LocalBusiness[] => {
    const q = query.toLowerCase().trim();
    if (!q) return EFFINGHAM_AREA_BUSINESSES.slice(0, 3);

    // Semantic keyword collections
    const hardwareKws = [
      'hammer', 'nail', 'nails', 'screw', 'screws', 'drill', 'tool', 'tools', 'hardware', 'paint', 'pellet', 'pellets',
      'feed', 'saw', 'plumb', 'shovel', 'wrench', 'battery', 'generator', 'ace', 'dewalt', 'poulin',
      'building', 'homestead', 'lumber', 'wood pellet', 'bolt', 'plywood', 'contractor', 'garden', 'grainery'
    ];
    const smokeKws = [
      'vape', 'smoke', 'glass', 'bong', 'pipe', 'cigar', 'tobacco', 'cbd', 'torch', 'lighter',
      'geek bar', 'disposable', 'lookah', 'raw cone', 'rolling paper', 'hecht', 'puff', 'vaporizer', 'smoke world'
    ];
    const groceryKws = [
      'grocery', 'groceries', 'milk', 'egg', 'eggs', 'bread', 'butter', 'fruit', 'vegetable',
      'produce', 'supermarket', 'market', 'deli', 'butcher', 'steak', 'meat', 'provisions', 'hannaford', 'grinder'
    ];
    const antiqueKws = [
      'antique', 'antiques', 'flea market', 'vintage', 'pottery', 'fudge', 'cast iron', 'lantern',
      'skillet', 'souvenir', 'gift', 'gifts', 'curiosities', 'peddler', 'tramway', 'zeb'
    ];
    const lakeCampingKws = [
      'camp', 'camping', 'campground', 'tent', 'rv', 'beach', 'boat', 'kayak', 'dock', 'lake',
      'swimming', 'canoe', 'firewood', 'smores', 's\'mores'
    ];
    const coffeeKws = [
      'coffee', 'espresso', 'cold brew', 'nitro', 'latte', 'cappuccino', 'sourdough', 'bread',
      'bakery', 'scone', 'pastry', 'brioche', 'cinnamon roll', 'roastery', 'bagel'
    ];
    const seafoodKws = [
      'lobster', 'clam', 'clams', 'chowder', 'seafood', 'haddock', 'fish', 'fried clams'
    ];
    const bbqKws = [
      'bbq', 'barbecue', 'pulled pork', 'ribs', 'brisket', 'smoked'
    ];
    const pizzaKws = [
      'pizza', 'slice', 'flatbread', 'crust', 'pie', 'pepperoni'
    ];
    const pubKws = [
      'pub', 'tavern', 'beer', 'wings', 'poutine', 'burger', 'ale', 'ipa', 'draft'
    ];

    const isHardware = hardwareKws.some(kw => q.includes(kw));
    const isSmoke = smokeKws.some(kw => q.includes(kw));
    const isGrocery = groceryKws.some(kw => q.includes(kw));
    const isAntique = antiqueKws.some(kw => q.includes(kw));
    const isLakeCamp = lakeCampingKws.some(kw => q.includes(kw));
    const isCoffee = coffeeKws.some(kw => q.includes(kw));
    const isSeafood = seafoodKws.some(kw => q.includes(kw));
    const isBbq = bbqKws.some(kw => q.includes(kw));
    const isPizza = pizzaKws.some(kw => q.includes(kw));
    const isPub = pubKws.some(kw => q.includes(kw));

    const scored = EFFINGHAM_AREA_BUSINESSES.map(biz => {
      let score = 0;
      const bName = biz.name.toLowerCase();
      const bDesc = biz.description.toLowerCase();
      const bCat = biz.category.toLowerCase();
      const bTown = biz.town.toLowerCase();
      const bMenuTitle = (biz.menuTitle || '').toLowerCase();

      // Direct text match
      if (bName.includes(q)) score += 12;
      if (bDesc.includes(q)) score += 6;
      if (bMenuTitle.includes(q)) score += 6;
      if (bCat.includes(q)) score += 4;
      if (bTown.includes(q)) score += 2;

      // Menu items match
      if (biz.menuItems) {
        biz.menuItems.forEach(item => {
          if (item.name.toLowerCase().includes(q)) score += 10;
          if (item.description.toLowerCase().includes(q)) score += 5;
          if (item.category?.toLowerCase().includes(q)) score += 4;
        });
      }

      // Domain/semantic mapping boosts
      if (isHardware && (biz.id === 'biz-oss-mountain-grainery' || bName.includes('ace') || bName.includes('grainery'))) score += 20;
      if (isSmoke && (biz.id === 'biz-oss-smoke-world' || bName.includes('smoke world'))) score += 20;
      if (isGrocery && (biz.id === 'biz-wak-lovell-lake-market' || biz.id === 'biz-fre-village-store')) score += 15;
      if (isAntique && (biz.id === 'biz-eff-country-peddler' || biz.id === 'biz-oss-tramway-artisans' || biz.id === 'biz-con-zebs-store')) score += 15;
      if (isLakeCamp && (biz.id === 'biz-eff-camping-area' || biz.id === 'biz-eff-sean-courier')) score += 15;
      if (isCoffee && (biz.id === 'biz-eff-oasis-roastery' || biz.id === 'biz-con-frontside-coffee' || biz.id === 'biz-fre-village-store')) score += 15;
      if (isSeafood && (biz.id === 'biz-oss-jakes-seafood' || biz.id === 'biz-wak-knotty-pine')) score += 15;
      if (isBbq && (biz.id === 'biz-oss-yankee-smokehouse' || biz.id === 'biz-oss-pizza-barn')) score += 15;
      if (isPizza && (biz.id === 'biz-oss-pizza-barn' || biz.id === 'biz-eff-pnb-eats' || biz.id === 'biz-con-flatbread')) score += 15;
      if (isPub && (biz.id === 'biz-wak-poor-peoples-pub' || biz.id === 'biz-oss-hobbs-tavern')) score += 15;

      return { biz, score };
    });

    const filtered = scored.filter(s => s.score > 0).sort((a, b) => b.score - a.score).map(s => s.biz);
    return filtered.length > 0 ? filtered.slice(0, 3) : EFFINGHAM_AREA_BUSINESSES.slice(0, 3);
  };

  // Find matching dishes
  const findMatchingDishes = (query: string) => {
    const q = query.toLowerCase();
    const matches: { dish: StorefrontProduct; store: MerchantStorefront }[] = [];

    storefronts.forEach(store => {
      store.products.forEach(product => {
        const titleMatch = product.name.toLowerCase().includes(q);
        const descMatch = product.description.toLowerCase().includes(q);
        const catMatch = product.category.toLowerCase().includes(q);

        const isPizzaQuery = (q.includes('pizza') || q.includes('slice')) && product.category.toLowerCase().includes('pizza');
        const isSubQuery = (q.includes('sub') || q.includes('steak') || q.includes('sandwich') || q.includes('burger')) && (product.category.toLowerCase().includes('sub') || product.category.toLowerCase().includes('burger') || product.name.toLowerCase().includes('sub'));
        const isCoffeeQuery = (q.includes('coffee') || q.includes('bakery') || q.includes('breakfast')) && (product.category.toLowerCase().includes('beverage') || product.category.toLowerCase().includes('bakery'));
        const isGlutenFreeQuery = (q.includes('gluten') || q.includes('gf')) && (product.description.toLowerCase().includes('gluten') || product.badge?.toLowerCase().includes('gluten') || product.name.toLowerCase().includes('trout'));
        const isFoodGeneral = (q.includes('food') || q.includes('dinner') || q.includes('lunch') || q.includes('hungry') || q.includes('eat'));

        if (titleMatch || descMatch || catMatch || isPizzaQuery || isSubQuery || isCoffeeQuery || isGlutenFreeQuery || (isFoodGeneral && (product.badge || matches.length < 3))) {
          matches.push({ dish: product, store });
        }
      });
    });

    if (matches.length === 0) {
      storefronts.forEach(store => {
        if (store.products.length > 0 && matches.length < 3) {
          matches.push({ dish: store.products[0], store });
        }
      });
    }

    return matches.slice(0, 4);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputVal;
    if (!text.trim()) return;

    const userMsg: ConciergeMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      const lower = text.toLowerCase();

      // Keywords
      const hardwareKeywords = [
        'hammer', 'nail', 'nails', 'screw', 'screws', 'drill', 'tool', 'tools', 'hardware', 'paint', 'pellet', 'pellets',
        'feed', 'saw', 'plumb', 'shovel', 'wrench', 'battery', 'generator', 'ace', 'dewalt', 'poulin',
        'wood pellet', 'building', 'lumber', 'grainery'
      ];
      const smokeKeywords = [
        'vape', 'smoke', 'glass', 'bong', 'pipe', 'cigar', 'tobacco', 'cbd', 'torch', 'lighter',
        'geek bar', 'disposable', 'lookah', 'raw cone', 'smoke world'
      ];
      const groceryKeywords = [
        'grocery', 'groceries', 'milk', 'egg', 'eggs', 'bread', 'butter', 'fruit', 'vegetable',
        'produce', 'supermarket', 'market', 'deli', 'butcher', 'steak', 'meat', 'provisions', 'hannaford'
      ];
      const antiqueKeywords = [
        'antique', 'antiques', 'flea market', 'vintage', 'pottery', 'fudge', 'cast iron', 'lantern', 'peddler', 'tramway', 'zeb'
      ];

      // 1. Hardware, Tools, Building Supplies & Homestead Feeds
      if (hardwareKeywords.some(kw => lower.includes(kw))) {
        setCallStoreId('biz-oss-mountain-grainery');
        setCallItemDescription('Hardware, tools, building supplies or feed from Ace Hardware');
        const matchingBiz = findMatchingBusinesses(text);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🔨 Looking for tools, building supplies, hardware, or homestead feeds? **Mountain Grainery Ace Hardware** is located right on Route 16 in Center Ossipee ((603) 539-2666)!\n\n📞 You can call them directly to check inventory or pay over the phone, and **Sean Martin** can pick up and deliver your order directly to your job site, home, or camp:",
            suggestedBusinesses: matchingBiz.length > 0 ? matchingBiz : [EFFINGHAM_AREA_BUSINESSES.find(b => b.id === 'biz-oss-mountain-grainery')!],
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call Ace Hardware: (603) 539-2666',
              '🚗 Have Sean Pick Up from Ace',
              '🪵 Hardwood Heating Pellets ($7.49)',
              '🌾 Poulin Poultry Feed ($22.99)',
              '🛠️ DeWalt 20V Drill Combo ($199.00)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 2. Smoke, Vape, Glassware & Tobacco
      else if (smokeKeywords.some(kw => lower.includes(kw))) {
        setCallStoreId('biz-oss-smoke-world');
        setCallItemDescription('Vape, glass, or smoke accessories from Smoke World');
        const matchingBiz = findMatchingBusinesses(text);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "💨 Looking for vape, glassware, smoke essentials, or tobacco accessories? **Smoke World Ossipee** is located on Route 16 in Ossipee ((603) 539-7665)!\n\n📞 Call the store directly to order, or have **Sean Martin** retrieve your order and deliver it to your door:",
            suggestedBusinesses: matchingBiz.length > 0 ? matchingBiz : [EFFINGHAM_AREA_BUSINESSES.find(b => b.id === 'biz-oss-smoke-world')!],
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call Smoke World: (603) 539-7665',
              '🚗 Have Sean Pick Up from Smoke World',
              '💨 Geek Bar Pulse 15k ($19.99)',
              '🧪 Handblown Glass Beaker ($69.99)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 3. Groceries, Deli & Butcher Meats
      else if (groceryKeywords.some(kw => lower.includes(kw))) {
        setCallStoreId('biz-wak-lovell-lake-market');
        setCallItemDescription('Groceries, butcher cuts, or deli items');
        const matchingBiz = findMatchingBusinesses(text);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🛒 Need groceries, fresh provisions, or butcher-cut steaks? **Lovell Lake Market & Deli** in Wakefield ((603) 522-3344) and **Freedom Village Store** ((603) 539-7988) are ready!\n\nSean Martin can pick up curbside groceries or butcher meats and deliver them right to your kitchen or campsite:",
            suggestedBusinesses: matchingBiz,
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call Lovell Lake Market: (603) 522-3344',
              '📞 Call Freedom Village Store: (603) 539-7988',
              '🥩 Hand-Cut Prime Ribeye Steaks ($32.00)',
              '🥪 Lovell Lake Monster Grinder ($13.99)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 4. Antiques, Flea Market & Country Treasures
      else if (antiqueKeywords.some(kw => lower.includes(kw))) {
        setCallStoreId('biz-eff-country-peddler');
        const matchingBiz = findMatchingBusinesses(text);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🏺 Looking for vintage antiques, pottery, or artisan sweets? Explore **Country Peddler's Flea Market** in Effingham ((603) 539-7000), **Tramway Artisans** in West Ossipee ((603) 539-5700), and **Zeb's General Store** in North Conway ((603) 356-9294):",
            suggestedBusinesses: matchingBiz,
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call Country Peddler: (603) 539-7000',
              '📞 Call Tramway Artisans: (603) 539-5700',
              '🍬 Zeb\'s Old-Fashioned Hard Candies ($12.99)',
              '🍳 Restored Griswold Cast Iron ($48.00)'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 5. Call-Ahead / Store Pickup / Prepay Requests
      else if (
        lower.includes('call') || 
        lower.includes('phone') || 
        lower.includes('number') || 
        lower.includes('prepay') || 
        lower.includes('pickup') || 
        lower.includes('retrieve')
      ) {
        const matchingBiz = findMatchingBusinesses(text);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: `📞 Here is the direct business phone directory and courier pickup launcher!\n\nCall the business directly to place your order, pay over the phone (or prepay Sean), and Sean will pick it up and deliver it:`,
            suggestedBusinesses: matchingBiz.length > 0 ? matchingBiz : EFFINGHAM_AREA_BUSINESSES.slice(0, 3),
            showCallAheadForm: true,
            quickOptions: [
              '🍔 PNB Eats: (603) 539-7440',
              '🍕 Pizza Barn: (603) 539-2244',
              '🛠️ Ace Hardware: (603) 539-2666',
              '💨 Smoke World: (603) 539-7665',
              '☕ Oasis Roastery: (508) 507-0305'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 6. Direct Delivery / Sean Martin Dispatch
      else if (lower.includes('deliver') || lower.includes('sean') || lower.includes('dispatch') || lower.includes('courier')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🚗 **Sean Martin** is on duty in Carroll County with his all-wheel-drive courier vehicle. You can order directly below, or call any local store to place an order for Sean to retrieve:",
            showDeliveryForm: true,
            showCallAheadForm: true,
            quickOptions: [
              '📞 Call Store & Dispatch Pickup',
              '🍔 Add Steak & Cheese Sub First',
              '🍕 Add Smoked Pizza First',
              '🛠️ Pick Up Ace Hardware Order'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 7. Food
      else if (
        lower.includes('food') || 
        lower.includes('eat') || 
        lower.includes('dinner') || 
        lower.includes('lunch') || 
        lower.includes('hungry') || 
        lower.includes('pizza') || 
        lower.includes('sub') || 
        lower.includes('steak') || 
        lower.includes('burger') || 
        lower.includes('coffee') || 
        lower.includes('trout') || 
        lower.includes('wings') || 
        lower.includes('gluten') ||
        lower.includes('seafood') ||
        lower.includes('lobster') ||
        lower.includes('beer') ||
        lower.includes('pub')
      ) {
        const matches = findMatchingDishes(text);
        const matchingBiz = findMatchingBusinesses(text);

        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "Here are top recommended dishes and direct phone numbers for local kitchens in Carroll County. You can order online or call ahead for Sean to pick up:",
            suggestedDishes: matches,
            suggestedBusinesses: matchingBiz.slice(0, 2),
            quickOptions: [
              '🚀 Have Sean Deliver This',
              '📞 Call Store to Place Order',
              '🥩 Show me Steak & Cheese Subs',
              '🍕 Show me Pizzas'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } 
      // 8. Firewood / Lake
      else if (lower.includes('firewood') || lower.includes('lake') || lower.includes('dock') || lower.includes('airbnb') || lower.includes('smores') || lower.includes('camp')) {
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "🌲 Visiting Lake Ossipee or Lake Winnipesaukee? Sean Martin delivers kiln-dried hardwood firewood bundles & deluxe s'mores kits directly to boat launches, lakeside firepits, and private docks in ~25-35 minutes!",
            showDeliveryForm: true,
            quickOptions: [
              '🔥 Dispatch Firewood + S\'mores to Dock ($41.49)',
              '📞 Call Freedom Village Store: (603) 539-7400',
              '🌊 Check Lake Water Temperature'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
      // 9. Default
      else {
        const matches = findMatchingDishes('food');
        const bizList = findMatchingBusinesses(text);
        setMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text: "I can look up direct business phone numbers, help you order food, or dispatch driver Sean Martin to pick up pre-paid hardware, groceries, or meals. What are you looking for?",
            suggestedDishes: matches.slice(0, 2),
            suggestedBusinesses: bizList.slice(0, 2),
            quickOptions: [
              '🛠️ Ace Hardware & Tools',
              '🍔 Order Hot Food & Takeout',
              '🛒 Groceries & Market Pickup',
              '💨 Smoke World Ossipee',
              '🌲 Lake Concierge & Dockside Firewood'
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }

      setIsTyping(false);
      playDeliveryChime();
    }, 600);
  };

  const handleAddDish = (dish: StorefrontProduct, store: MerchantStorefront) => {
    addToCart({
      id: `food-${dish.id}-${Date.now()}`,
      name: dish.name,
      slug: dish.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      subtitle: `${store.businessName} • ${store.town}`,
      description: dish.description,
      price: dish.price,
      rating: 5.0,
      reviewsCount: 1,
      category: 'food',
      features: dish.badge ? [dish.badge] : [],
      imageUrl: dish.imageUrl,
      inStock: true,
      sellerName: store.businessName,
      sellerPhone: store.phone,
      town: `${store.town}, ${store.state}`,
    });

    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });

    setAddedItemNotice(`Added "${dish.name}" to cart!`);
    playDeliveryChime();
    setTimeout(() => setAddedItemNotice(null), 3000);

    setMessages(prev => [
      ...prev,
      {
        id: `ai-add-${Date.now()}`,
        sender: 'ai',
        text: `✅ Added **${dish.name}** ($${dish.price.toFixed(2)}) to your order! Would you like **Sean Martin** to deliver this now?`,
        showDeliveryForm: true,
        quickOptions: [
          '🍕 Add a Pizza to Order',
          '🥤 Add Beverages & Sides',
          '🛒 View Shopping Cart'
        ],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // In-Chat Call-Ahead & Prepay Store Pickup Dispatch
  const handleConfirmCallAheadPickup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);

    const estCost = parseFloat(callEstimatedCost) || 0;
    const deliveryFee = 4.99;
    const tip = 4.00;
    const total = (callPickupType === 'paid_phone' ? 0 : estCost) + deliveryFee + tip;

    const paymentMethod = callPickupType === 'prepay_sean' ? 'cash_app' : callPickupType === 'cash_delivery' ? 'cash_on_delivery' : 'card';
    const paymentStatus = callPickupType === 'paid_phone' ? 'prepaid' : 'pay_on_delivery';

    try {
      const newOrder = await placeDeliveryOrder({
        customerName: custName,
        customerPhone: custPhone,
        deliveryAddress: custAddress,
        deliveryInstructions: `[CALL-AHEAD PICKUP] Store: ${selectedCallBiz.name}. Order/Name: "${callPickupNameOrCode}". Notes: ${custNotes}`,
        serviceType: callPickupType === 'paid_phone' ? 'store_pickup' : 'prepaid_buy',
        paymentMethod,
        paymentStatus,
        restaurantName: selectedCallBiz.name,
        restaurantAddress: selectedCallBiz.address,
        pickupStoreName: selectedCallBiz.name,
        pickupStoreAddress: selectedCallBiz.address,
        pickupOrderCode: callPickupNameOrCode,
        estimatedItemCost: estCost,
        town: selectedCallBiz.town,
        items: [
          {
            id: `pickup-${Date.now()}`,
            name: `${selectedCallBiz.name} Call-In Pickup (${callItemDescription || 'Customer Order'})`,
            price: estCost,
            quantity: 1,
            notes: `Pickup Name/Code: "${callPickupNameOrCode}". Payment mode: ${callPickupType}`
          }
        ],
        subtotal: estCost,
        deliveryFee,
        tip,
        total: total === 0 ? deliveryFee + tip : total,
        driver: {
          name: 'Sean Martin',
          phone: '(508) 507-0305',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          vehicle: 'All-Wheel Drive Courier (AWD)',
          rating: 5.0,
          totalDeliveries: 412
        }
      });

      sendManualSms(
        '(508) 507-0305',
        'Sean Martin',
        'Oasis Call-In Dispatch',
        `🚨 NEW CALL-AHEAD PICKUP: Order #${newOrder.id} at ${selectedCallBiz.name} (${selectedCallBiz.phone || 'N/A'}) under "${callPickupNameOrCode}". Deliver to ${custAddress}. Mode: ${callPickupType}.`,
        'Contractor Emergency Lead Instant Dispatch'
      );

      setIsDispatching(false);

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 }
      });
      playDeliveryChime();

      setMessages(prev => [
        ...prev,
        {
          id: `ai-pickup-dispatched-${Date.now()}`,
          sender: 'ai',
          text: `🎉 **Pickup Dispatched to Sean Martin!** \n\nSean has received the alert to pick up your order at **${selectedCallBiz.name}** under name **"${callPickupNameOrCode}"** and deliver it directly to **${custAddress}**!`,
          confirmedDeliveryOrder: newOrder,
          quickOptions: [
            '📡 Track Sean on Live Radar',
            '📞 Call Sean (508-507-0305)',
            '🍔 Order Something Else'
          ],
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.error(err);
      setIsDispatching(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-20 px-4 md:px-10">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-[#0e0e18] to-indigo-950/40 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Call-Ahead & Courier Pickup Active • Sean Martin
              </div>
              <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tight text-white mt-1">
                Carroll County AI Call & Courier Dispatch
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="tel:5085070305"
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Call Sean</span>
            </a>

            <Link
              href="/cart"
              className="px-4 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-amber-400/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Cart ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
            </Link>
          </div>
        </div>

        {/* Added Item Toast */}
        {addedItemNotice && (
          <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{addedItemNotice}</span>
            </div>
            <Link href="/cart" className="text-xs font-black underline hover:text-white">
              Proceed to Cart →
            </Link>
          </div>
        )}

        {/* Main Chat Stream */}
        <div className="bg-[#0b0b14] border border-white/10 rounded-3xl p-6 space-y-5 min-h-[500px] shadow-2xl">
          <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[94%] md:max-w-[85%] rounded-2xl p-4 leading-relaxed text-xs md:text-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-tr-sm shadow-md'
                      : 'bg-[#141422] text-white border border-white/10 rounded-tl-sm shadow-sm'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {/* Suggested Business Phone Cards */}
                  {msg.suggestedBusinesses && msg.suggestedBusinesses.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold block">
                        📞 Direct Store Numbers (Tap to Call):
                      </span>
                      {msg.suggestedBusinesses.map((biz) => (
                        <div
                          key={biz.id}
                          className="p-3 rounded-xl bg-[#0c0c16] border border-white/10 flex items-center justify-between gap-3 hover:border-amber-400/40 transition-all"
                        >
                          <div className="min-w-0">
                            <div className="font-bold text-white text-xs truncate flex items-center gap-1.5">
                              <span>{biz.logoEmoji}</span>
                              <span>{biz.name}</span>
                            </div>
                            <p className="text-[10px] text-white/50 truncate">{biz.address}</p>
                          </div>

                          {biz.phone ? (
                            <a
                              href={`tel:${biz.phone.replace(/[^0-9]/g, '')}`}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg shadow-sm flex items-center gap-1.5 shrink-0 transition-all"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>{biz.phone}</span>
                            </a>
                          ) : (
                            <span className="text-[10px] text-white/40">In-Store</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Confirmed Delivery Order Tracking Card */}
                  {msg.confirmedDeliveryOrder && (
                    <div className="mt-4 p-4 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black">
                            <Truck className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-black text-white">Courier: Sean Martin</div>
                            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              En Route to Pickup • Est ~20 mins
                            </div>
                          </div>
                        </div>

                        <a 
                          href="tel:5085070305"
                          className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5 text-amber-400" />
                          <span>(508) 507-0305</span>
                        </a>
                      </div>

                      <div className="p-3 bg-black/40 rounded-xl space-y-1.5 text-xs">
                        <div className="flex justify-between text-white/70">
                          <span>Pickup Store:</span>
                          <span className="text-amber-400 font-bold">{msg.confirmedDeliveryOrder.restaurantName}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Delivery Address:</span>
                          <span className="text-white font-bold">{msg.confirmedDeliveryOrder.deliveryAddress}</span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Order Total:</span>
                          <span className="text-emerald-400 font-black">${msg.confirmedDeliveryOrder.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-1">
                        <Link
                          href={`/order/${msg.confirmedDeliveryOrder.id}`}
                          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl text-center shadow-lg"
                        >
                          📡 View Live GPS Radar Tracking
                        </Link>
                        <Link
                          href="/driver"
                          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold"
                        >
                          Driver Hub
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* CALL-AHEAD & PREPAY STORE PICKUP FORM */}
                  {msg.showCallAheadForm && !msg.confirmedDeliveryOrder && (
                    <form onSubmit={handleConfirmCallAheadPickup} className="mt-4 p-4 rounded-2xl bg-[#090910] border border-emerald-500/40 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-emerald-400 font-black text-xs">
                          <PhoneCall className="w-4 h-4" />
                          <span>Call & Courier Pickup Dispatch</span>
                        </div>
                        <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-full font-bold border border-emerald-500/20">
                          Sean Martin Courier
                        </span>
                      </div>

                      <div className="space-y-3">
                        {/* Store Selector */}
                        <div>
                          <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Select Store to Pick Up From</label>
                          <select
                            value={callStoreId}
                            onChange={(e) => setCallStoreId(e.target.value)}
                            className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            {EFFINGHAM_AREA_BUSINESSES.map((biz) => (
                              <option key={biz.id} value={biz.id}>
                                {biz.logoEmoji} {biz.name} ({biz.town}) — {biz.phone || 'No phone listed'}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Call Store Action Banner */}
                        {selectedCallBiz.phone && (
                          <div className="p-3 bg-indigo-950/40 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs">
                            <div>
                              <span className="text-[10px] text-indigo-300 font-bold block">1. Call {selectedCallBiz.name}:</span>
                              <span className="text-white font-mono font-bold text-sm">{selectedCallBiz.phone}</span>
                            </div>
                            <a
                              href={`tel:${selectedCallBiz.phone.replace(/[^0-9]/g, '')}`}
                              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                              <span>Call Store Now</span>
                            </a>
                          </div>
                        )}

                        {/* Payment Strategy Choice */}
                        <div>
                          <label className="text-[10px] uppercase font-bold text-white/50 block mb-1">2. How are you paying for the items?</label>
                          <div className="space-y-1.5">
                            {[
                              { id: 'paid_phone', label: '💳 I Paid Store Over the Phone', desc: 'Pickup fee only ($4.99) — give Sean your name or order #' },
                              { id: 'prepay_sean', label: '💚 Prepay Sean to Pay at Store', desc: 'Prepay items via Cash App ($frijj555) / Venmo (@Sean-Martin-NH)' },
                              { id: 'cash_delivery', label: '💵 Cash on Delivery', desc: 'Hand cash to Sean for items + delivery at your door/dock' },
                            ].map((opt) => (
                              <button
                                type="button"
                                key={opt.id}
                                onClick={() => setCallPickupType(opt.id as any)}
                                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                                  callPickupType === opt.id
                                    ? 'bg-amber-500/15 border-amber-500/60 text-white shadow-sm'
                                    : 'bg-white/[0.02] border-white/5 text-white/60 hover:text-white'
                                }`}
                              >
                                <div className="text-xs font-bold">{opt.label}</div>
                                <div className="text-[10px] text-white/40 mt-0.5">{opt.desc}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Order Name / Code */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Pickup Name or Order #</label>
                            <input
                              type="text"
                              required
                              value={callPickupNameOrCode}
                              onChange={(e) => setCallPickupNameOrCode(e.target.value)}
                              placeholder="e.g. Sarah - Order #18"
                              className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                          </div>

                          {callPickupType !== 'paid_phone' && (
                            <div>
                              <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Estimated Item Cost ($)</label>
                              <input
                                type="number"
                                step="0.50"
                                required
                                value={callEstimatedCost}
                                onChange={(e) => setCallEstimatedCost(e.target.value)}
                                placeholder="25.00"
                                className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                              />
                            </div>
                          )}
                        </div>

                        {/* Customer Location */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Your Name & Phone</label>
                            <input
                              type="text"
                              required
                              value={custName}
                              onChange={(e) => setCustName(e.target.value)}
                              placeholder="Your Name"
                              className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white mb-1.5"
                            />
                            <input
                              type="tel"
                              required
                              value={custPhone}
                              onChange={(e) => setCustPhone(e.target.value)}
                              placeholder="Your Phone #"
                              className="w-full bg-[#141420] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] uppercase font-bold text-white/50 block mb-0.5">Delivery Address / Dock / Cabin</label>
                            <textarea
                              rows={3}
                              required
                              value={custAddress}
                              onChange={(e) => setCustAddress(e.target.value)}
                              placeholder="e.g. Pine Cove Dock 3, Ossipee Lake"
                              className="w-full bg-[#141420] border border-white/10 rounded-xl p-2 text-xs text-white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Submit Dispatch */}
                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all"
                      >
                        {isDispatching ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Dispatching Sean...</span>
                          </>
                        ) : (
                          <>
                            <Truck className="w-4 h-4" />
                            <span>Dispatch Sean to Pick Up & Deliver</span>
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Suggested Food Cards */}
                  {msg.suggestedDishes && msg.suggestedDishes.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                      {msg.suggestedDishes.map(({ dish, store }) => (
                        <div
                          key={dish.id}
                          className="p-3 rounded-2xl bg-[#0c0c16] border border-white/10 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={dish.imageUrl}
                              alt={dish.name}
                              className="w-16 h-16 rounded-xl object-cover shrink-0 border border-white/10"
                            />
                            <div className="min-w-0">
                              <h4 className="font-bold text-white text-xs truncate">{dish.name}</h4>
                              <p className="text-[10px] text-white/50 truncate mt-0.5">{store.businessName} • {store.town}</p>
                              <div className="text-xs font-black text-amber-400 mt-1">${dish.price.toFixed(2)}</div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-white/5">
                            <span className="text-[10px] text-white/40 font-mono">{dish.calories || 'Chef Special'}</span>
                            <button
                              onClick={() => handleAddDish(dish, store)}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-1"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add to Order</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Option Chips */}
                {msg.quickOptions && (
                  <div className="flex flex-wrap gap-2 mt-2 max-w-[90%]">
                    {msg.quickOptions.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendMessage(opt.replace(/^[^\w\s]+/, '').trim())}
                        className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-amber-300 hover:text-white transition-all text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[9px] text-white/30 font-mono px-1 mt-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 bg-[#141422] border border-white/10 rounded-2xl px-4 py-2.5 w-32 text-white/50 text-xs">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] ml-1">Thinking...</span>
              </div>
            )}
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-3 pt-4 border-t border-white/10"
          >
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask for a business phone number, food, or dispatch Sean..."
              className="flex-1 bg-[#131320] border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-500/50"
            />
            <button
              type="submit"
              disabled={!inputVal.trim()}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:opacity-40 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Ask Bot</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
