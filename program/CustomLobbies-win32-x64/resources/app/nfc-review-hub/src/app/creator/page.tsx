'use client';

import NfcTagReaderCustomizer from '@/components/NfcTagReaderCustomizer';
import Link from 'next/link';
import { 
  Radio, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  Smartphone, 
  Award, 
  PhoneCall, 
  ArrowRight,
  Download,
  Copy,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';

export default function AllInOneNfcCreatorPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-white pt-24 pb-24 px-4 sm:px-6 lg:px-8 selection:bg-amber-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-amber-500/10 rounded-full blur-[140px]" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        
        {/* Top Header Banner & Breadcrumbs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/admin"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>← Admin Menu</span>
            </Link>
            <Link
              href="/dashboard/cards"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>Card Fleet 📇</span>
            </Link>
            <Link
              href="/marketplace"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono font-bold text-zinc-300 hover:text-amber-400 transition-colors flex items-center gap-1.5"
            >
              <span>Marketplace 🛍️</span>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>13.56 MHz ISO/IEC 14443A Standard Flasher Active</span>
            </span>
          </div>
        </div>

        {/* Hero Title & Value Proposition */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-rose-500/20 to-purple-500/20 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-amber-500/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            Universal Smart RFID / NFC Hardware Engine
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[1.1]">
            All-in-One <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent">NFC Card Creator</span> & Tag Studio
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
            Design, program, test, and manufacture custom smart NFC cards, counter stands, tap pucks, and keychains. Encode 15+ interactive archetypes with direct Web NFC browser flashing, offline NFC Tools payloads, batch CSV exports, and instant laser-engraved hardware delivery by <strong className="text-amber-400">Sean Martin</strong>.
          </p>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-lg">
              ⭐
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">15+ Smart Archetypes</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Google reviews, digital vCards, touchless menus, guest Wi-Fi, driver dispatch & tip jars.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-lg">
              📲
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Web NFC & Offline Tools</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              1-tap browser tag burning, chip UID scanning, and 1-click formatted NFC Tools records.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-lg">
              🏭
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">100-Card Batch Engine</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Automated serial generation, bulk QR matrices, and factory CSV export for laser engraving.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 font-bold text-lg">
              👑
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-wider">Physical Production</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Obsidian PVC, 24K Gold Metal, Bamboo Wood & Acrylic stands delivered locally in Carroll County.
            </p>
          </div>
        </div>

        {/* The Main All-in-One NFC Customizer Studio Component */}
        <div className="bg-white/[0.01] rounded-3xl border border-white/10 p-2 sm:p-6 shadow-2xl">
          <NfcTagReaderCustomizer />
        </div>

        {/* Lead Operator Hardware Guarantee Callout */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 backdrop-blur-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-400 text-black flex items-center justify-center text-2xl font-black shadow-xl shadow-amber-400/20 shrink-0">
              👑
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Direct Operator Support
                </span>
                <span className="text-xs text-zinc-400 font-mono">Effingham, NH & Carroll County</span>
              </div>
              <h3 className="text-lg font-black text-white">
                Need Custom Fleet Deployment or Laser Engraving Assistance?
              </h3>
              <p className="text-xs text-zinc-300 max-w-2xl">
                Contact Lead Operator <strong>Sean Martin</strong> directly for custom high-volume merchant batches, on-site countertop stand installations, or physical hardware hand delivery.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="tel:5085070305"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call 508-507-0305</span>
            </a>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5"
            >
              <span>Contact Lead</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
