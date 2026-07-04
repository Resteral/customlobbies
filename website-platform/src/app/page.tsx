"use client";

import { motion } from "framer-motion";
import { Check, Bot, Globe, Server, ArrowRight } from "lucide-react";
import Link from "next/link";

const bundles = [
  {
    name: "Starter Site",
    price: "$29/mo",
    description: "Perfect for personal portfolios or small projects.",
    features: ["Custom Domain", "Fast Hosting", "Basic AI Site Builder", "Community Support"],
    popular: false,
    icon: Globe,
  },
  {
    name: "Pro Business",
    price: "$79/mo",
    description: "Everything you need to run your business online.",
    features: ["Everything in Starter", "Integrated AI Chatbot", "Priority Support", "E-commerce Ready", "Advanced Analytics"],
    popular: true,
    icon: Bot,
  },
  {
    name: "Enterprise Hosting",
    price: "$199/mo",
    description: "For high traffic sites requiring custom solutions.",
    features: ["Everything in Pro", "Custom AI Models", "Dedicated Account Manager", "99.9% Uptime SLA", "Custom Integrations"],
    popular: false,
    icon: Server,
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 -left-1/4 w-[150%] h-[1000px] bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-full blur-[120px] pointer-events-none opacity-50" />
      
      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md border-b border-border/50">
        <div className="flex items-center gap-2">
          <Bot className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold tracking-tight">Resolve.bet</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center md:pt-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 text-sm font-medium border rounded-full text-primary border-primary/20 bg-primary/10"
        >
          <span className="flex w-2 h-2 rounded-full bg-primary animate-pulse" />
          Introducing AI Chatbots for every site
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-4xl text-5xl font-extrabold tracking-tight md:text-7xl lg:text-8xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
        >
          The simplest way to <br className="hidden md:block" /> build & run your site.
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mt-6 text-lg md:text-xl text-muted-foreground"
        >
          Purchase a bundle, let AI build your website, host it instantly, and engage your visitors with an integrated AI chatbot—all in one place.
        </motion.p>
      </main>

      {/* Pricing/Bundles Section */}
      <section className="relative z-10 px-6 py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold md:text-5xl">Simple, all-in-one bundles</h2>
            <p className="mt-4 text-muted-foreground">Everything you need to succeed online, packaged perfectly.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {bundles.map((bundle, index) => (
              <motion.div
                key={bundle.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className={`relative flex flex-col p-8 rounded-3xl border backdrop-blur-sm transition-all hover:border-primary/50 ${
                  bundle.popular ? "bg-primary/5 border-primary/30 scale-105 shadow-2xl shadow-primary/10 z-10" : "bg-secondary/50 border-border/50"
                }`}
              >
                {bundle.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 text-xs font-semibold text-white bg-primary rounded-full">
                    Most Popular
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${bundle.popular ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'}`}>
                    <bundle.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">{bundle.name}</h3>
                </div>
                
                <div className="mb-6">
                  <span className="text-4xl font-extrabold">{bundle.price}</span>
                </div>
                
                <p className="mb-8 text-sm text-muted-foreground min-h-[40px]">{bundle.description}</p>
                
                <ul className="flex flex-col gap-4 mb-8 flex-grow">
                  {bundle.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm">
                      <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/20 text-primary">
                        <Check className="w-3 h-3" />
                      </div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <Link 
                  href={`/checkout?plan=${bundle.name.toLowerCase().includes('starter') ? 'starter' : bundle.name.toLowerCase().includes('pro') ? 'pro' : 'enterprise'}`}
                  className={`w-full py-3 mt-auto font-medium rounded-xl transition-all flex items-center justify-center gap-2 group ${
                    bundle.popular 
                      ? "bg-primary text-white hover:bg-primary/90" 
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}>
                  Select Bundle
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
