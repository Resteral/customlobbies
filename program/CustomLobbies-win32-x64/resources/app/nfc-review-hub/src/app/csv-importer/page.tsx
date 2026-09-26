'use client';

import { useState } from 'react';
import Link from 'next/link';
import CsvImporterHub from '@/components/CsvImporterHub';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Store, 
  Utensils, 
  ShoppingBag, 
  ArrowLeft, 
  Download, 
  ShieldCheck, 
  Zap, 
  Layers,
  HelpCircle
} from 'lucide-react';

export default function CsvImporterPage() {
  return (
    <div className="min-h-screen bg-[#070709] text-slate-100 pt-24 pb-20 selection:bg-amber-400 selection:text-black">
      {/* Ambient background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/10 blur-[160px] rounded-full" />
        <div className="absolute top-3/4 right-1/4 w-[600px] h-[400px] bg-emerald-500/10 blur-[180px] rounded-full" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/create-storefront"
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Storefront Registration</span>
          </Link>

          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" /> 0% Middleman Fees
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5" /> Instant Local Storage
            </span>
          </div>
        </div>

        {/* Page Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono uppercase tracking-wider">
            <FileSpreadsheet className="w-4 h-4 text-amber-400" />
            <span>Universal Bulk CSV & Datafiniti / Menus API JSON Ingestor</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Import Restaurants, Menus & Products in Bulk
          </h1>

          <p className="text-zinc-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            Migrate your business catalog, restaurant menu items, or artisan inventory into Townraise. Upload any <strong className="text-white">.CSV / .TSV</strong>, or ingest raw <strong className="text-emerald-400">Datafiniti</strong> & <strong className="text-indigo-400">Menus API</strong> JSON scraper outputs with 1-click automatic schema detection.
          </p>
        </div>

        {/* The CSV Extractor Hub Component */}
        <CsvImporterHub />

        {/* How It Works & Help Accordion */}
        <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/10 space-y-6">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>How the Townraise CSV Extractor Works</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-zinc-400 leading-relaxed">
            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-amber-400 font-bold font-mono">STEP 1</div>
              <h4 className="font-bold text-white text-sm">Choose Your Data Mode</h4>
              <p>Select whether you are importing full business directory listings, restaurant digital menus, or marketplace artisan products.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-orange-400 font-bold font-mono">STEP 2</div>
              <h4 className="font-bold text-white text-sm">Upload or Paste Spreadsheet</h4>
              <p>Drop your `.csv` file or copy rows straight from Excel / Google Sheets. Our smart column detector automatically aligns your headers.</p>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2">
              <div className="text-emerald-400 font-bold font-mono">STEP 3</div>
              <h4 className="font-bold text-white text-sm">Review & Instant Publish</h4>
              <p>Inspect the spreadsheet grid, edit any values inline, and click Import. All records are instantly active with 0% middleman fees.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
