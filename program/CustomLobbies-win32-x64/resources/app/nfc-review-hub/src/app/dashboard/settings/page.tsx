'use client';

import { useState } from 'react';
import { useNfcStore } from '@/lib/store';
import { 
  Phone, Send, Bell, ShieldCheck, CheckCircle2, 
  MessageSquare, Radio, Volume2, Sparkles, HelpCircle, Save 
} from 'lucide-react';

export default function NotificationSettingsPage() {
  const { notificationSettings, updateNotificationSettings, playDeliveryChime } = useNfcStore();

  const [phone, setPhone] = useState(notificationSettings.phoneNumber || '');
  const [enableSms, setEnableSms] = useState(notificationSettings.enableSms ?? true);
  const [enableTwilio, setEnableTwilio] = useState(notificationSettings.enableTwilio ?? false);
  const [twilioSid, setTwilioSid] = useState(notificationSettings.twilioAccountSid || '');
  const [twilioAuth, setTwilioAuth] = useState(notificationSettings.twilioAuthToken || '');
  const [twilioFromNumber, setTwilioFromNumber] = useState(notificationSettings.twilioPhoneNumber || '');
  const [enableWhatsApp, setEnableWhatsApp] = useState(notificationSettings.enableWhatsApp ?? false);
  const [whatsappPhone, setWhatsappPhone] = useState(notificationSettings.whatsappPhone || '');
  const [whatsappApiKey, setWhatsappApiKey] = useState(notificationSettings.whatsappApiKey || '');
  const [enableTelegram, setEnableTelegram] = useState(notificationSettings.enableTelegram ?? false);
  const [telegramToken, setTelegramToken] = useState(notificationSettings.telegramBotToken || '');
  const [telegramChatId, setTelegramChatId] = useState(notificationSettings.telegramChatId || '');
  const [enableDiscord, setEnableDiscord] = useState(notificationSettings.enableDiscord ?? false);
  const [discordWebhook, setDiscordWebhook] = useState(notificationSettings.discordWebhookUrl || '');
  const [enableSound, setEnableSound] = useState(notificationSettings.enableSoundChime ?? true);

  // Merchant & Driver Payment Payout Handles
  const [paypalEmail, setPaypalEmail] = useState('seanhse97@gmail.com');
  const [paypalHandle, setPaypalHandle] = useState('paypal.me/seanhse97');
  const [cashAppTag, setCashAppTag] = useState('$frijj555');
  const [venmoHandle, setVenmoHandle] = useState('@Sean-Martin-NH');
  const [zellePhone, setZellePhone] = useState('(508) 507-0305');

  // Load custom payment accounts from localStorage on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('pulpulse_payout_settings_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.paypalEmail) setPaypalEmail(parsed.paypalEmail);
          if (parsed.paypalHandle) setPaypalHandle(parsed.paypalHandle);
          if (parsed.cashAppTag) setCashAppTag(parsed.cashAppTag);
          if (parsed.venmoHandle) setVenmoHandle(parsed.venmoHandle);
          if (parsed.zellePhone) setZellePhone(parsed.zellePhone);
        }
      } catch {}
    }
  });

  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('pulpulse_payout_settings_v1', JSON.stringify({
        paypalEmail,
        paypalHandle,
        cashAppTag,
        venmoHandle,
        zellePhone
      }));
    }
    updateNotificationSettings({
      phoneNumber: phone,
      enableSms,
      enableTwilio,
      twilioAccountSid: twilioSid,
      twilioAuthToken: twilioAuth,
      twilioPhoneNumber: twilioFromNumber,
      enableWhatsApp,
      whatsappPhone,
      whatsappApiKey,
      enableTelegram,
      telegramBotToken: telegramToken,
      telegramChatId,
      enableDiscord,
      discordWebhookUrl: discordWebhook,
      enableSoundChime: enableSound,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSendTestNotification = async () => {
    setIsTesting(true);
    setTestStatus(null);
    if (enableSound) playDeliveryChime();

    const sampleOrder = {
      id: 'test-999',
      orderNumber: '999',
      customerName: 'Test Customer (Sean)',
      customerPhone: phone || '(603) 555-0199',
      deliveryAddress: '42 Pine Hill Rd, Effingham, NH 03882',
      deliveryInstructions: 'TEST NOTIFICATION RELAY: Please confirm phone received this ping!',
      items: [
        { id: 't-1', name: 'Cold Brew Growler (64oz)', quantity: 1, price: 18.00 },
        { id: 't-2', name: 'Obsidian NFC Review Card', quantity: 2, price: 29.99 },
      ],
      subtotal: 77.98,
      deliveryFee: 4.99,
      tip: 10.00,
      total: 92.97,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
      notifiedPhone: true,
    };

    try {
      const res = await fetch('/api/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: sampleOrder,
          settings: {
            phoneNumber: phone,
            enableSms,
            enableTwilio,
            twilioAccountSid: twilioSid,
            twilioAuthToken: twilioAuth,
            twilioPhoneNumber: twilioFromNumber,
            enableWhatsApp,
            whatsappPhone,
            whatsappApiKey,
            enableTelegram,
            telegramBotToken: telegramToken,
            telegramChatId,
            enableDiscord,
            discordWebhookUrl: discordWebhook,
            enableSoundChime: enableSound,
          },
        }),
      });

      const data = await res.json();
      if (data.success) {
        setTestStatus(`✓ Test notification dispatched to: ${data.result.channels.join(', ')}`);
      } else {
        setTestStatus(`Notice: ${data.error || 'Check configuration credentials'}`);
      }
    } catch (e: any) {
      setTestStatus(`Notice: Local audio chime played. Configure Telegram or Discord for instant remote lock screen push.`);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-400">
            Real-Time Push & SMS Relays
          </span>
          <h1 className="text-3xl md:text-4xl font-black italic tracking-tight uppercase text-white">
            Phone Notification Relay
          </h1>
          <p className="text-xs text-zinc-400">
            Configure how new customer delivery orders are immediately forwarded to your smartphone.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSendTestNotification}
          disabled={isTesting}
          className="px-6 py-3 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isTesting ? 'Pinging Phone...' : 'Test Send to My Phone'}</span>
        </button>
      </div>

      {testStatus && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{testStatus}</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-8">
        
        {/* Method 1: Primary Mobile Phone (SMS & Driver Contact) */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black italic text-white uppercase">Primary Phone Number</h3>
                <p className="text-xs text-zinc-400">Where delivery SMS alerts and customer callbacks are routed.</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableSms}
                onChange={(e) => setEnableSms(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          <div>
            <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Your Mobile Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. (603) 555-0199"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        {/* Payment & Payout Accounts (PayPal, Cash App, Venmo, Zelle) */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-xl">
                🅿️
              </div>
              <div>
                <h3 className="text-lg font-black italic text-white uppercase">Customer Payment & Payout Accounts</h3>
                <p className="text-xs text-zinc-400">
                  Configure where customers send food & courier prepayments (PayPal, Cash App, Venmo, Zelle).
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono font-bold uppercase">
              Instant Payouts
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* PayPal Email & Handle */}
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🅿️</span>
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">PayPal Account</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400">PayPal Email / PayPal.Me Link</label>
                <input
                  type="text"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  placeholder="seanhse97@gmail.com or paypal.me/seanhse97"
                  className="w-full bg-black/40 border border-blue-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-blue-400"
                />
              </div>
            </div>

            {/* Cash App */}
            <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🟩</span>
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Cash App Cashtag</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400">Cashtag handle</label>
                <input
                  type="text"
                  value={cashAppTag}
                  onChange={(e) => setCashAppTag(e.target.value)}
                  placeholder="$frijj555"
                  className="w-full bg-black/40 border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            {/* Venmo */}
            <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🟦</span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Venmo Handle</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400">Venmo @username</label>
                <input
                  type="text"
                  value={venmoHandle}
                  onChange={(e) => setVenmoHandle(e.target.value)}
                  placeholder="@Sean-Martin-NH"
                  className="w-full bg-black/40 border border-cyan-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Zelle */}
            <div className="p-4 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">🟪</span>
                <span className="text-xs font-bold text-purple-300 uppercase tracking-wider">Zelle Bank Transfer</span>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono text-zinc-400">Zelle Phone or Email</label>
                <input
                  type="text"
                  value={zellePhone}
                  onChange={(e) => setZellePhone(e.target.value)}
                  placeholder="(508) 507-0305 / frijj555@gmail.com"
                  className="w-full bg-black/40 border border-purple-500/30 rounded-xl px-3.5 py-2.5 text-xs text-white font-mono focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Method 2: Twilio Carrier SMS (Real Cellular Texts to iPhone/Android) */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Radio className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black italic text-white uppercase">Twilio Carrier SMS Engine</h3>
                  <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-[8px] font-mono font-bold uppercase rounded-md border border-red-500/30">
                    Carrier SMS • $0.0079/text
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Sends automated cellular SMS text messages directly to your phone and to customers with live order updates.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableTwilio}
                onChange={(e) => setEnableTwilio(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>

          {enableTwilio && (
            <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Twilio Account SID</label>
                  <input
                    type="text"
                    value={twilioSid}
                    onChange={(e) => setTwilioSid(e.target.value)}
                    placeholder="e.g. ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Twilio Auth Token</label>
                  <input
                    type="password"
                    value={twilioAuth}
                    onChange={(e) => setTwilioAuth(e.target.value)}
                    placeholder="e.g. your_auth_token_here"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Twilio Phone Number</label>
                  <input
                    type="tel"
                    value={twilioFromNumber}
                    onChange={(e) => setTwilioFromNumber(e.target.value)}
                    placeholder="e.g. +1603539XXXX"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-red-950/20 border border-red-500/20 rounded-2xl text-[11px] text-zinc-300 space-y-1">
                <p className="font-bold text-red-300">Quick Twilio Setup (3 minutes):</p>
                <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                  <li>Create a free account at <b>twilio.com</b> (includes ~$15 free trial credit).</li>
                  <li>Click <b>Buy a Phone Number</b> (search for area code <code>603</code> or <code>508</code>, costs ~$1.15/mo).</li>
                  <li>Copy your <b>Account SID</b> and <b>Auth Token</b> from the Twilio Console homepage and paste above!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Method 3: WhatsApp Direct Push Relay (Free via CallMeBot / Twilio) */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black">
                WA
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black italic text-white uppercase">WhatsApp Instant Relay</h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[8px] font-mono font-bold uppercase rounded-md border border-emerald-500/30">
                    Direct to WhatsApp • Free
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Sends full order tickets and GPS navigation links straight to your personal WhatsApp chat.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableWhatsApp}
                onChange={(e) => setEnableWhatsApp(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          {enableWhatsApp && (
            <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Your WhatsApp Phone Number (with Country Code)</label>
                  <input
                    type="tel"
                    value={whatsappPhone}
                    onChange={(e) => setWhatsappPhone(e.target.value)}
                    placeholder="e.g. +15085070305"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">WhatsApp API Key (from CallMeBot)</label>
                  <input
                    type="password"
                    value={whatsappApiKey}
                    onChange={(e) => setWhatsappApiKey(e.target.value)}
                    placeholder="e.g. 123456"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-emerald-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-2xl text-[11px] text-zinc-300 space-y-1">
                <p className="font-bold text-emerald-300">How to activate WhatsApp alerts in 30 seconds:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                  <li>In WhatsApp, add the contact phone number: <b>+34 941 01 96 50</b> (CallMeBot).</li>
                  <li>Send the exact text message: <code>I allow callmebot to send me messages</code></li>
                  <li>Wait 10 seconds — CallMeBot will reply on WhatsApp with your personal <b>API Key</b>. Paste it above and click Save!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Method 4: Telegram Bot Relay (Zero Latency & 100% Free Push Notifications with Sound) */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black italic text-white uppercase">Telegram Bot Instant Push</h3>
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[8px] font-mono font-bold uppercase rounded-md border border-indigo-500/30">
                    Recommended • Free
                  </span>
                </div>
                <p className="text-xs text-zinc-400">
                  Sends loud, instant notifications directly to Telegram on your iPhone/Android with 1-tap Google Maps directions and customer click-to-call links.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableTelegram}
                onChange={(e) => setEnableTelegram(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500"></div>
            </label>
          </div>

          {enableTelegram && (
            <div className="space-y-4 pt-2 border-t border-white/5 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Telegram Bot Token</label>
                  <input
                    type="password"
                    value={telegramToken}
                    onChange={(e) => setTelegramToken(e.target.value)}
                    placeholder="e.g. 123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Your Telegram Chat ID</label>
                  <input
                    type="text"
                    value={telegramChatId}
                    onChange={(e) => setTelegramChatId(e.target.value)}
                    placeholder="e.g. 987654321"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-400 font-mono"
                  />
                </div>
              </div>

              <div className="p-4 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl text-[11px] text-zinc-300 space-y-1">
                <p className="font-bold text-indigo-300">How to get your free Telegram Bot in 60 seconds:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-zinc-400">
                  <li>Open Telegram and message <b>@BotFather</b> with <code>/newbot</code> to get your Bot Token.</li>
                  <li>Message your new bot once, then search <b>@userinfobot</b> on Telegram to get your numeric Chat ID.</li>
                  <li>Paste them above and click <b>Test Send to My Phone</b>!</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Method 3: Discord Mobile Push */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black italic text-white uppercase">Discord Mobile Webhook</h3>
                <p className="text-xs text-zinc-400">
                  Pushes delivery tickets to a private Discord channel with sound and full customer embeds.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableDiscord}
                onChange={(e) => setEnableDiscord(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
            </label>
          </div>

          {enableDiscord && (
            <div className="pt-2 border-t border-white/5 animate-in fade-in">
              <label className="text-[10px] font-mono uppercase text-zinc-400 mb-1.5 block">Discord Webhook URL</label>
              <input
                type="url"
                value={discordWebhook}
                onChange={(e) => setDiscordWebhook(e.target.value)}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          )}
        </div>

        {/* Method 4: Audio Chime & Browser Alerts */}
        <div className="bg-[#0e0e14] border border-white/10 rounded-3xl p-6 md:p-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white">
              <Volume2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black italic text-white uppercase">Live Order Audio Chime</h3>
              <p className="text-xs text-zinc-400">Plays an acoustic delivery bell sound on order arrival.</p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enableSound}
              onChange={(e) => setEnableSound(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="w-full py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black font-black text-xs uppercase tracking-widest rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{savedNotice ? 'Notification Preferences Saved! ✓' : 'Save Relay Settings'}</span>
        </button>

      </form>
    </div>
  );
}
