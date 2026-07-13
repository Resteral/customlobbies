"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Check, Bot, Globe, Server, ArrowRight, Download, 
  Sparkles, Terminal, Swords, Cpu, Laptop, HardDrive, Gamepad2
} from "lucide-react";
import Link from "next/link";

const pricingTiers = [
  {
    name: "Creator License",
    price: 19,
    description: "Perfect for indie devs and hobbyists building standalone games.",
    features: [
      "Downloadable Engine (Win / macOS)",
      "Low-Poly & 2.5D Rendering Pipelines",
      "Local Project Storage (Own your files)",
      "250 AI 3D Mesh & Render Credits/mo",
      "Standard Compiler & Game Exporter",
      "Community Discord Support"
    ],
    popular: false,
    icon: Laptop,
  },
  {
    name: "Studio License",
    price: 49,
    description: "For professional creators and small studios needing higher capacity.",
    features: [
      "Everything in Creator License",
      "1,000 AI 3D Mesh & Render Credits/mo",
      "Advanced 2.5D pre-rendered generator",
      "Local LLM script integration (Offline AI)",
      "Priority compiler upgrades & custom plugins",
      "Commercial Publishing License",
      "Direct Email Support"
    ],
    popular: true,
    icon: Cpu,
  }
];

export default function EngineStorefront() {
  const [activeTab, setActiveTab] = useState<"features" | "specs" | "downloads">("features");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070a13] text-white font-sans">
      {/* Background radial glow */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[1000px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-[120px] pointer-events-none opacity-40" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">AetherForge</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Engine Features</a>
          <a href="#downloads" className="hover:text-white transition-colors">Download App</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link href="/" className="hover:text-white transition-colors">Resolve Main</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-indigo-400 transition-colors">
            Sign In
          </Link>
          <a href="#pricing" className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
            Buy Engine
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-16 text-center md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 mb-8 text-xs font-semibold border rounded-full text-indigo-400 border-indigo-500/20 bg-indigo-500/10 tracking-wide uppercase"
        >
          <Sparkles className="w-3.5 h-3.5" />
          AetherForge Desktop App V1.0.4 Released
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
        >
          Your own AI engine. <br /> Built for standalone creators.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mt-6 text-base md:text-lg text-gray-400 leading-relaxed"
        >
          A downloadable, high-performance desktop editor. Generate low-poly meshes, high-detail 2.5D renders, and script logic using AI. Export games locally with 100% file ownership.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <a 
            href="#downloads" 
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/30"
          >
            <Download className="w-5 h-5" /> Download for Desktop
          </a>
          <a 
            href="#features" 
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-semibold px-8 py-4 rounded-xl text-base transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            Explore Features <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Engine Dashboard Showcase Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full max-w-5xl mt-20 relative p-1 rounded-3xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 border border-white/10 shadow-2xl backdrop-blur-3xl overflow-hidden"
        >
          <div className="bg-[#0b0f19] rounded-[22px] overflow-hidden border border-white/5 aspect-[16/9] flex flex-col">
            {/* Window bar */}
            <div className="bg-[#0c101b] border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <span className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="text-xs text-gray-500 font-mono flex items-center gap-1.5 bg-[#070a13] px-4 py-1 rounded-md border border-white/5">
                <Terminal className="w-3 h-3 text-indigo-400" /> AetherForge.exe - Low-Poly Editor
              </div>
              <span className="text-xs text-green-400 font-mono">● LOCAL ENGINE ONLINE</span>
            </div>
            
            {/* Editor Workspace Mockup */}
            <div className="flex-grow grid grid-cols-12 text-left h-full">
              {/* Sidebar */}
              <div className="col-span-3 border-r border-white/5 bg-[#090d16] p-4 flex flex-col gap-4 text-xs">
                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">AI Creation Core</span>
                <div className="bg-[#0e1424] p-3 rounded-lg border border-white/5 space-y-2">
                  <span className="text-gray-400">Generate 3D Model Prompt:</span>
                  <div className="bg-[#070a13] p-2 rounded text-[11px] font-mono border border-white/5 text-indigo-300">
                    "a low-poly rustic log chest with iron bands"
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-indigo-500 rounded-full animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-500">
                    <span>Compiling meshes...</span>
                    <span>85%</span>
                  </div>
                </div>

                <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] mt-4">Hierarchy</span>
                <div className="space-y-1.5 font-mono text-[11px] text-gray-400">
                  <div>📁 Scenes</div>
                  <div className="pl-3">📄 Dungeon_Room_01</div>
                  <div className="pl-6 text-indigo-400">🔷 Chest_LowPoly [Active]</div>
                  <div className="pl-6">🔷 Pillar_Stone_01</div>
                  <div className="pl-6">💡 Torch_Light_01</div>
                  <div className="pl-6">🔷 Knight_Player</div>
                </div>
              </div>

              {/* Viewport */}
              <div className="col-span-6 bg-[#0a0e18] relative flex items-center justify-center">
                {/* Simulated 3D Mesh */}
                <div className="w-48 h-48 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
                  {/* Mock chest drawing via CSS */}
                  <div className="w-24 h-16 bg-[#4f3b25] border-2 border-indigo-400 rounded-lg flex flex-col justify-between relative transform rotate-12 shadow-2xl">
                    <div className="h-4 bg-[#3d2c1a] border-b border-indigo-400 flex items-center justify-between px-1">
                      <span className="w-1 h-1 bg-[#8c7456]" />
                      <span className="w-1.5 h-1.5 bg-[#d4af37] rounded-sm" />
                      <span className="w-1 h-1 bg-[#8c7456]" />
                    </div>
                    <div className="flex justify-between px-2 pb-1">
                      <div className="w-1.5 h-10 bg-indigo-500/20" />
                      <div className="w-1.5 h-10 bg-indigo-500/20" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 font-mono">
                  Camera: Perspective | FPS: 60 | Triangles: 1,402
                </div>
              </div>

              {/* Inspector / Compiler */}
              <div className="col-span-3 border-l border-white/5 bg-[#090d16] p-4 flex flex-col justify-between text-xs">
                <div className="space-y-4">
                  <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Logic Generator</span>
                  <div className="bg-[#0e1424] p-3 rounded-lg border border-white/5 space-y-2">
                    <span className="text-[10px] text-gray-400">Rule Prompt:</span>
                    <div className="bg-[#070a13] p-2 rounded text-[10px] font-mono border border-white/5 text-gray-400">
                      "Make chest open on interact"
                    </div>
                  </div>
                  <div className="space-y-1 font-mono text-[10px]">
                    <span className="text-gray-500">// Generated Script</span>
                    <div className="bg-[#070a13] p-2 rounded border border-white/5 text-green-400 overflow-x-auto whitespace-pre">
{`onInteract(() => {
  chest.play("open");
  player.addGold(50);
});`}
                    </div>
                  </div>
                </div>
                <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded text-xs transition-colors flex items-center justify-center gap-1">
                  <Gamepad2 className="w-3.5 h-3.5" /> RUN TEST PLAY
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Engine Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold md:text-4xl">Engine Core Technologies</h2>
          <p className="mt-4 text-gray-400">AetherForge bundles modern tools into a unified offline desktop interface designed specifically for rapid development.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#090d16] border border-white/5 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <HardDrive className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Local File Autonomy</h3>
            <p className="text-sm text-gray-400">No cloud locks. Projects are saved as normal folders containing standard open formats like glTF, PNG, and JSON. You own 100% of your assets.</p>
          </div>
          <div className="bg-[#090d16] border border-white/5 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Render & Mesh Generator</h3>
            <p className="text-sm text-gray-400">Generate both low-poly 3D models and high-detailed 2D/3D custom renders for isometric grids, UI icons, visual novel scenes, or game backdrops.</p>
          </div>
          <div className="bg-[#090d16] border border-white/5 p-6 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Safe Script Compile</h3>
            <p className="text-sm text-gray-400">AI-generated scripting runs within a sandboxed WebAssembly execution environment, protecting the editor and gameplay loops from compilation crashes.</p>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section id="downloads" className="max-w-4xl mx-auto px-6 py-20 border-t border-white/5 text-center">
        <h2 className="text-3xl font-extrabold md:text-4xl mb-4">Download AetherForge Engine</h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">Install the engine on your native operating system. Select your platform below to download the latest setup installer.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-2xl mx-auto">
          <div className="bg-[#090d16] border border-indigo-500/20 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-indigo-400">WINDOWS BUILD</span>
              <h3 className="text-xl font-bold mt-1 mb-2">AetherForge for Windows</h3>
              <p className="text-xs text-gray-500">Requires Windows 10/11 x64, DirectX 12 or Vulkan compatible GPU.</p>
            </div>
            <button className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Installer (.msi)
            </button>
          </div>
          <div className="bg-[#090d16] border border-purple-500/20 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-purple-400">MAC OS BUILD</span>
              <h3 className="text-xl font-bold mt-1 mb-2">AetherForge for macOS</h3>
              <p className="text-xs text-gray-500">Requires macOS 12+ (Apple Silicon M1/M2/M3 native or Intel Core).</p>
            </div>
            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download Installer (.dmg)
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 max-w-5xl mx-auto px-6 py-24 border-t border-white/5">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold md:text-4xl">Pricing Plans</h2>
          <p className="mt-4 text-gray-400">Access the full standalone engine with dedicated AI generation credits included.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {pricingTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div 
                key={tier.name}
                className={`relative flex flex-col justify-between p-8 rounded-2xl bg-[#090d16] border ${
                  tier.popular ? "border-indigo-500" : "border-white/5"
                } shadow-xl`}
              >
                {tier.popular && (
                  <span className="absolute top-0 right-8 -translate-y-1/2 bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Recommended
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{tier.name}</h3>
                      <span className="text-xs text-gray-500">{tier.description}</span>
                    </div>
                  </div>
                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">${tier.price}</span>
                    <span className="text-gray-500 text-sm">/ month</span>
                  </div>
                  <ul className="mt-6 space-y-3.5 text-sm text-gray-400">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button 
                  className={`mt-8 w-full py-3 rounded-xl font-bold text-sm transition-all ${
                    tier.popular 
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30" 
                      : "bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10"
                  }`}
                >
                  Purchase License
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#05070d] py-12 px-6 text-center text-xs text-gray-600">
        <p>© 2026 AetherForge Engine. All rights reserved. Powered by Resolve.bet platform.</p>
      </footer>
    </div>
  );
}
