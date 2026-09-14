import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Star, 
  Terminal, 
  LayoutDashboard, 
  Printer, 
  Calculator,
  Smartphone,
  Monitor,
  Sparkles
} from 'lucide-react';
import { ActiveTab } from '../types';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, viewMode, setViewMode } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'customer-card', label: 'Customer Card', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'review-qr', label: 'Review Booster Gate', icon: <Star className="w-4 h-4" /> },
    { id: 'cashier-terminal', label: 'Cashier Terminal', icon: <Terminal className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Merchant Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'qr-studio', label: 'Print QR Stands', icon: <Printer className="w-4 h-4" /> },
    { id: 'pitch-calculator', label: 'Pitch & ROI Calculator', icon: <Calculator className="w-4 h-4" /> },
  ];

  return (
    <header className="no-print bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-violet-600 flex items-center justify-center text-slate-950 font-black text-lg shadow-md shadow-amber-500/20">
              ⚡
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white flex items-center gap-1.5">
                PerkPulse
                <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold px-1.5 py-0.5 rounded-md">
                  PRO
                </span>
              </span>
              <p className="text-[10px] text-slate-400 hidden sm:block">Loyalty Stamps + Google Review Multiplier</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 border border-slate-800 p-1 rounded-2xl">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Side: Device Frame Toggle */}
          <div className="flex items-center gap-2">
            {activeTab === 'customer-card' && (
              <div className="hidden sm:flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('mobile-preview')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                    viewMode === 'mobile-preview'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Phone Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Phone Frame</span>
                </button>
                <button
                  onClick={() => setViewMode('desktop')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
                    viewMode === 'desktop'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title="Fluid View"
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>Fluid</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 scrollbar-none">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
