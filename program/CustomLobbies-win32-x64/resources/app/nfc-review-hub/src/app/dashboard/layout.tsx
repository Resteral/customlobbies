'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, CreditCard, BarChart3, Truck, 
  Phone, ShoppingBag, Radio, ShieldCheck, ArrowLeft, Cpu, Compass, Crown, Store, Megaphone,
  Bot, ChefHat, MessageSquare, Code2
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { deliveryOrders, feedbacks, userMembership, tableTickets, isAdmin } = useNfcStore();
  const pendingOrdersCount = deliveryOrders.filter(o => o.status === 'pending').length;
  const newFeedbackCount = feedbacks.filter(f => f.status === 'new').length;
  const newTableOrdersCount = tableTickets.filter(t => t.status === 'new_order').length;

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/admin', label: 'Admin & Automation Suite', icon: Crown, badge: isAdmin ? '👑 Sean Martin' : '🔒 Sean Only' },
    { href: '/dashboard/sms-hub', label: 'SMS Automation & VIP Hub', icon: MessageSquare, badge: '⚡ SMS' },
    { href: '/dashboard/embeds', label: 'Website Embeds & Widgets', icon: Code2, badge: '✨ HTML' },
    { href: '/dashboard/ai-assistant', label: 'AI Menu & Review Assistant', icon: Bot, badge: '🧠 AI' },
    { href: '/dashboard/kitchen', label: 'Kitchen Display (KDS)', icon: ChefHat, badge: newTableOrdersCount > 0 ? `${newTableOrdersCount} table` : undefined },
    { href: '/dashboard/growth-kit', label: 'Growth Kit & Promos', icon: Megaphone, badge: '🚀 New' },
    { href: '/dashboard/storefront', label: 'Websites & Menus', icon: Store },
    { href: '/dashboard/town-command', label: 'Town Vanguard Command', icon: Compass },
    { href: '/dashboard/programmer', label: 'NFC Card Programmer', icon: Cpu },
    { href: '/dashboard/delivery', label: 'Delivery Dispatch', icon: Truck, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} new` : undefined },
    { href: '/dashboard/feedback', label: 'Feedback Shield & Inbox', icon: ShieldCheck, badge: newFeedbackCount > 0 ? `${newFeedbackCount} new` : undefined },
    { href: '/dashboard/cards', label: 'NFC Card Fleet', icon: CreditCard },
    { href: '/dashboard/analytics', label: 'Tap Radar & Analytics', icon: BarChart3 },
    { href: '/dashboard/settings', label: 'Phone & Notification Relay', icon: Phone },
    { href: '/marketplace', label: 'Hardware Store', icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen pt-20 bg-[#070709] text-white flex flex-col md:flex-row">
      
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0a0a0f] border-r border-white/5 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400">
              Merchant Node Hub
            </span>
            <h2 className="text-xl font-black italic tracking-tight text-white uppercase">
              Command Center
            </h2>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[8px] font-mono font-bold animate-pulse">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Station Status */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          {/* Membership Status Badge */}
          <Link
            href="/membership"
            className="p-3 bg-gradient-to-r from-amber-400/10 via-indigo-600/10 to-transparent border border-white/10 hover:border-amber-400/40 rounded-2xl flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2.5">
              <span className="text-base">{userMembership.avatarEmoji || '🌟'}</span>
              <div>
                <span className="text-[8px] font-mono uppercase text-zinc-500 block">Node Membership</span>
                <span className="text-[11px] font-bold text-white group-hover:text-amber-400 transition-colors">
                  {userMembership.active ? userMembership.tierName : 'Upgrade to Pro'}
                </span>
              </div>
            </div>
            <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          </Link>

          <div className="p-3.5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-zinc-300">PHONE RELAY ARMED</span>
            </div>
            <p className="text-[8px] font-mono text-zinc-500">Instant Dispatch • Online</p>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-wider transition-colors px-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Public Store</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
