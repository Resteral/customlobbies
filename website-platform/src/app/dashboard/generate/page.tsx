"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, Loader2, Sparkles, LayoutTemplate, Palette, Globe } from "lucide-react";
import Link from "next/link";
import { saveGeneratedSite } from "./actions";

export default function GenerateSite() {
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [industry, setIndustry] = useState("");

  const handleGenerate = async () => {
    setIsGenerating(true);
    
    // Call our server action to save the site to the database
    const result = await saveGeneratedSite(industry, prompt);
    
    if (result.error) {
      alert(result.error);
      setIsGenerating(false);
      return;
    }
    
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      setStep(3); // Go to preview step
    }, 4000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto min-h-screen">
      <header className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
          AI Website Generator
        </h1>
        <p className="text-muted-foreground">Describe your business, and our AI will build, configure, and host your perfect website in seconds.</p>
      </header>

      <div className="relative">
        <AnimatePresence mode="wait">
          {/* STEP 1: Describe */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-secondary/20 border border-border/50 rounded-3xl p-8 max-w-3xl mx-auto shadow-2xl backdrop-blur-sm"
            >
              <div className="flex items-center gap-3 mb-6 text-primary">
                <Sparkles className="w-6 h-6" />
                <h2 className="text-xl font-bold">What are you building?</h2>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Select Industry</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {["Technology", "E-Commerce", "Portfolio", "Agency"].map((ind) => (
                    <button
                      key={ind}
                      onClick={() => setIndustry(ind)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                        industry === ind 
                          ? "bg-primary/20 border-primary/50 text-primary" 
                          : "bg-secondary/50 border-border hover:border-primary/30"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium mb-2 text-muted-foreground">Describe your website</label>
                <textarea
                  className="w-full bg-background border border-border rounded-xl p-4 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                  placeholder="e.g. A modern portfolio for a freelance graphic designer who specializes in 3D animations and brand identity..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setStep(2)}
                  disabled={!prompt || !industry}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  Next Step
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Generating */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-secondary/20 border border-border/50 rounded-3xl p-12 max-w-2xl mx-auto shadow-2xl text-center"
            >
              {!isGenerating ? (
                <>
                  <Wand2 className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-4">Ready to generate?</h2>
                  <p className="text-muted-foreground mb-8">We will consume 1 AI credit to build your complete website structure, copy, and styling.</p>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-xl font-medium hover:bg-secondary/80 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleGenerate}
                      className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                    >
                      <Sparkles className="w-5 h-5" />
                      Generate Website
                    </button>
                  </div>
                </>
              ) : (
                <div className="py-8">
                  <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
                  <h2 className="text-2xl font-bold mb-2 animate-pulse">AI is building your site...</h2>
                  <p className="text-muted-foreground">Writing copy, selecting components, and applying styles.</p>
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 3: Preview */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Sparkles className="text-primary w-6 h-6" /> Site Generated Successfully!
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">Review your generated site before publishing.</p>
                </div>
                <div className="flex gap-3">
                  <button className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Customize Theme
                  </button>
                  <Link href="/dashboard" className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2">
                    <Globe className="w-4 h-4" /> Publish & Host
                  </Link>
                </div>
              </div>

              {/* Mock Preview Window */}
              <div className="rounded-xl border border-border/50 bg-secondary/10 overflow-hidden shadow-2xl">
                {/* Browser Chrome */}
                <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <div className="mx-auto bg-background/50 rounded-md px-32 py-1 text-xs text-muted-foreground flex items-center gap-2">
                    preview.aisite.pro <span className="opacity-50">/</span> {industry.toLowerCase()}
                  </div>
                </div>
                
                {/* Simulated Website Content */}
                <div className="bg-background min-h-[600px] flex flex-col">
                  {/* Mock Navbar */}
                  <div className="p-6 flex justify-between items-center border-b border-border/10">
                    <div className="font-bold text-xl">{industry} Brand</div>
                    <div className="flex gap-6 text-sm">
                      <span>Home</span>
                      <span>Services</span>
                      <span>About</span>
                      <span>Contact</span>
                    </div>
                  </div>
                  {/* Mock Hero */}
                  <div className="flex-grow flex flex-col items-center justify-center text-center p-12 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                    <h1 className="text-5xl font-black mb-6 max-w-3xl leading-tight">
                      Elevating Your <span className="text-primary">{industry}</span> Experience
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mb-10">
                      {prompt.length > 50 ? prompt.substring(0, 100) + "..." : "We provide top-tier solutions tailored to your unique business needs, powered by cutting-edge technology and design."}
                    </p>
                    <div className="flex gap-4">
                      <div className="bg-primary text-white px-8 py-3 rounded-full font-medium shadow-lg shadow-primary/20">Get Started</div>
                      <div className="bg-secondary px-8 py-3 rounded-full font-medium">Learn More</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
