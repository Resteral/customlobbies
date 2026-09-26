'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  UtensilsCrossed, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  ArrowRight, 
  Plus, 
  Flame, 
  Bell, 
  DollarSign, 
  CreditCard,
  Radio,
  Check
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';
import { DineInTableTicket } from '@/lib/types';

export default function KitchenDisplayPage() {
  const { tableTickets, updateTableTicketStatus, submitDineInTableOrder, storefronts } = useNfcStore();
  const [selectedRestaurantId, setSelectedRestaurantId] = useState(storefronts[0]?.id || 'sf-oasis-roastery');

  const filteredTickets = tableTickets.filter(t => t.restaurantId === selectedRestaurantId);

  const newOrders = filteredTickets.filter(t => t.status === 'new_order');
  const inKitchen = filteredTickets.filter(t => t.status === 'in_kitchen');
  const served = filteredTickets.filter(t => t.status === 'served');
  const completed = filteredTickets.filter(t => t.status === 'paid_closed');

  const handleCreateTestOrder = () => {
    const tableNum = `Table ${Math.floor(1 + Math.random() * 12)}`;
    const curStore = storefronts.find(s => s.id === selectedRestaurantId);

    submitDineInTableOrder({
      tableNumber: tableNum,
      restaurantId: selectedRestaurantId,
      restaurantName: curStore?.businessName || 'Oasis Artisan Roastery',
      customerName: 'Walk-in Diner',
      customerPhone: '(603) 555-0199',
      items: [
        { id: 't-1', name: 'Steak & Cheese Sub (12" Giant)', quantity: 1, price: 17.49, notes: 'Extra pickles' },
        { id: 't-2', name: 'Hand-Cut Fries', quantity: 1, price: 4.99 },
        { id: 't-3', name: 'Craft IPA', quantity: 1, price: 6.50 }
      ],
      subtotal: 28.98,
      tax: 2.46,
      tip: 6.00,
      total: 37.44,
      paidStatus: 'paid_card',
      kitchenNotes: 'Order sent from NFC table stand'
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold mb-2">
            <ChefHat className="w-3.5 h-3.5" />
            Live Kitchen Display System (KDS) & Table Dispatch
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            Kitchen Ticket Screen
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Real-time dine-in orders tapped from NFC table stands and QR tents.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleCreateTestOrder}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate NFC Table Order</span>
          </button>
        </div>
      </div>

      {/* Restaurant Selector & Stats Bar */}
      <div className="p-4 bg-[#0d0d12] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-white/60 uppercase">Kitchen Station:</span>
          <select
            value={selectedRestaurantId}
            onChange={(e) => setSelectedRestaurantId(e.target.value)}
            className="bg-[#181820] border border-white/10 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-amber-400"
          >
            {storefronts.map((s) => (
              <option key={s.id} value={s.id}>{s.businessName} (Dine-In KDS)</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-amber-400 font-bold">{newOrders.length} New</span>
          <span className="text-orange-400 font-bold">{inKitchen.length} Cooking</span>
          <span className="text-emerald-400 font-bold">{served.length} Served</span>
        </div>
      </div>

      {/* 3 Kanban Ticket Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: New Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 animate-bounce" />
              1. New Table Orders ({newOrders.length})
            </span>
          </div>

          <div className="space-y-4">
            {newOrders.map((ticket) => (
              <div key={ticket.id} className="bg-[#0d0d12] border-2 border-red-500/50 rounded-3xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="text-base font-black text-white block">{ticket.tableNumber}</span>
                    <span className="text-xs text-white/50">{ticket.customerName} • {new Date(ticket.orderedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold uppercase">
                    New
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {ticket.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <span className="text-white font-bold">{item.quantity}x {item.name}</span>
                      <span className="text-white/50 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {ticket.kitchenNotes && (
                  <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-300 text-[11px] font-mono">
                    Note: {ticket.kitchenNotes}
                  </div>
                )}

                <button
                  onClick={() => updateTableTicketStatus(ticket.id, 'in_kitchen')}
                  className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Flame className="w-4 h-4" />
                  <span>Start Cooking (Send to Grill) ➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2: In Kitchen / Cooking */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-400 text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5" />
              2. Cooking on Line ({inKitchen.length})
            </span>
          </div>

          <div className="space-y-4">
            {inKitchen.map((ticket) => (
              <div key={ticket.id} className="bg-[#0d0d12] border border-orange-500/40 rounded-3xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="text-base font-black text-white block">{ticket.tableNumber}</span>
                    <span className="text-xs text-white/50">{ticket.customerName}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-bold uppercase">
                    Grill Active
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  {ticket.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-start">
                      <span className="text-white font-bold">{item.quantity}x {item.name}</span>
                      <span className="text-white/50 font-mono">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateTableTicketStatus(ticket.id, 'served')}
                  className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-black font-black uppercase text-xs tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Food Ready (Serve Table) ➔</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Column 3: Served & Completed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-emerald-400 text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              3. Served at Table ({served.length})
            </span>
          </div>

          <div className="space-y-4">
            {served.map((ticket) => (
              <div key={ticket.id} className="bg-[#0d0d12] border border-white/10 rounded-3xl p-5 space-y-4 opacity-90">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <div>
                    <span className="text-base font-black text-white block">{ticket.tableNumber}</span>
                    <span className="text-xs text-white/50">Total: ${ticket.total.toFixed(2)} (Paid Online)</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                    Served
                  </span>
                </div>

                <div className="space-y-1.5 text-xs text-white/70">
                  {ticket.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span>{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => updateTableTicketStatus(ticket.id, 'paid_closed')}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white font-bold text-xs uppercase rounded-xl transition-colors"
                >
                  Close & Archive Table Ticket ✓
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
