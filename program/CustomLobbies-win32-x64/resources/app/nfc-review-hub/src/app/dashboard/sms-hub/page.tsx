'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, 
  Send, 
  PhoneCall, 
  Sparkles, 
  Clock, 
  Users, 
  CheckCircle2, 
  DollarSign, 
  Flame, 
  ShieldCheck, 
  Zap, 
  RefreshCw, 
  Sliders, 
  Plus, 
  Search, 
  Building2, 
  Volume2, 
  Smartphone,
  ArrowRight,
  TrendingUp,
  Check
} from 'lucide-react';
import { useNfcStore } from '@/lib/store';

export default function SmsAutomationHubPage() {
  const { 
    smsWorkflows, 
    smsLogs, 
    smsSubscribers, 
    toggleSmsWorkflow, 
    updateSmsWorkflowTemplate, 
    sendManualSms, 
    broadcastSmsCampaign, 
    addSmsSubscriber,
    activeTown
  } = useNfcStore();

  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(smsWorkflows[0]?.id || 'sms-missed-call-textback');
  const [editingTemplate, setEditingTemplate] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [testPhoneNumber, setTestPhoneNumber] = useState<string>('+1 (603) 555-0199');
  const [testCustomerName, setTestCustomerName] = useState<string>('Alex Tremblay');
  const [testStatusMsg, setTestStatusMsg] = useState<string | null>(null);

  // VIP Blast State
  const [blastOpen, setBlastOpen] = useState<boolean>(false);
  const [blastCampaignName, setBlastCampaignName] = useState<string>('Weekend Nitro Cold Brew & Hearth Sourdough Special');
  const [blastMessage, setBlastMessage] = useState<string>('🔥 Oasis VIP: Show this text today at Oasis Artisan Roastery & Bakehouse for 15% off any Nitro Cold Brew or Hearth Sourdough! Reply STOP to opt-out.');
  const [blastTownFilter, setBlastTownFilter] = useState<string>('all');
  const [blastSending, setBlastSending] = useState<boolean>(false);

  // New Subscriber Modal State
  const [subscriberModalOpen, setSubscriberModalOpen] = useState<boolean>(false);
  const [newSubPhone, setNewSubPhone] = useState<string>('');
  const [newSubName, setNewSubName] = useState<string>('');
  const [newSubTown, setNewSubTown] = useState<string>(activeTown?.name || 'Wolfeboro');

  // Search & Filter
  const [logSearch, setLogSearch] = useState<string>('');

  const selectedWorkflow = smsWorkflows.find(w => w.id === selectedWorkflowId) || smsWorkflows[0];

  // Initialize editing template on selection
  useEffect(() => {
    if (selectedWorkflow) {
      setEditingTemplate(selectedWorkflow.smsTemplate);
      setIsEditing(false);
    }
  }, [selectedWorkflowId, selectedWorkflow]);

  // Handle saving template
  const handleSaveTemplate = () => {
    if (selectedWorkflow) {
      updateSmsWorkflowTemplate(selectedWorkflow.id, editingTemplate);
      setIsEditing(false);
      setTestStatusMsg('Workflow template saved!');
      setTimeout(() => setTestStatusMsg(null), 3000);
    }
  };

  // Handle triggering test send
  const handleTriggerTest = () => {
    if (!selectedWorkflow) return;
    
    // Replace tokens for preview
    const rendered = selectedWorkflow.smsTemplate
      .replace(/{BusinessName}/g, selectedWorkflow.targetBusinessName)
      .replace(/{CustomerName}/g, testCustomerName)
      .replace(/{ReviewLink}/g, 'https://townraise.org/r/pnb-eats')
      .replace(/{KeypadCode}/g, '4892#')
      .replace(/{ConciergeLink}/g, 'https://townraise.org/guest/pine-cove')
      .replace(/{OrderLink}/g, 'https://townraise.org/menu/pnb-eats')
      .replace(/{AppointmentTime}/g, 'Tomorrow at 10:30 AM')
      .replace(/{Offer}/g, '15% Off Your Next Meal');

    sendManualSms(
      testPhoneNumber,
      testCustomerName,
      selectedWorkflow.targetBusinessName,
      rendered,
      selectedWorkflow.name
    );

    setTestStatusMsg(`🚀 Simulated SMS successfully sent to ${testPhoneNumber}! Acoustic chime played.`);
    setTimeout(() => setTestStatusMsg(null), 4000);
  };

  // Handle broadcast
  const handleDispatchBlast = () => {
    if (!blastMessage.trim()) return;
    setBlastSending(true);
    setTimeout(() => {
      broadcastSmsCampaign(blastCampaignName, blastMessage, blastTownFilter);
      setBlastSending(false);
      setBlastOpen(false);
      setTestStatusMsg(`🎉 VIP SMS Blast "${blastCampaignName}" successfully broadcast to Carroll County list!`);
      setTimeout(() => setTestStatusMsg(null), 5000);
    }, 600);
  };

  // Handle Add Subscriber
  const handleAddSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubPhone || !newSubName) return;
    addSmsSubscriber(newSubPhone, newSubName, newSubTown, 'website_vip_club');
    setNewSubPhone('');
    setNewSubName('');
    setSubscriberModalOpen(false);
    setTestStatusMsg(`Added ${newSubName} to VIP SMS Club (+50 Loyalty Points awarded)!`);
    setTimeout(() => setTestStatusMsg(null), 3000);
  };

  // Calculate Metrics
  const activeWorkflowsCount = smsWorkflows.filter(w => w.isActive).length;
  const totalSmsSent = smsLogs.length + 1480;
  const totalSubscribersCount = smsSubscribers.length;
  const monthlyRevenueGenerated = (smsWorkflows.reduce((acc, curr) => acc + (curr.isActive ? curr.monthlyValueToMerchant : 0), 0) + 120);

  // Filter logs
  const filteredLogs = smsLogs.filter(l => 
    l.recipientName.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.recipientPhone.includes(logSearch) ||
    l.businessName.toLowerCase().includes(logSearch.toLowerCase()) ||
    l.messageBody.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            2-Way SMS Automation & Local Marketing Engine
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white italic uppercase tracking-tight">
            SMS Automation & VIP Campaign Hub
          </h1>
          <p className="text-white/60 text-xs mt-1">
            Deploy automated text-back systems, instant review boosters, Airbnb concierges, and broadcast VIP weekend blasts to Carroll County patrons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setBlastOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
          >
            <Flame className="w-4 h-4" />
            <span>Launch VIP Weekend Blast</span>
          </button>

          <button
            onClick={() => setSubscriberModalOpen(true)}
            className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Add VIP Member</span>
          </button>
        </div>
      </div>

      {/* Notification status toast */}
      {testStatusMsg && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{testStatusMsg}</span>
          </div>
          <button onClick={() => setTestStatusMsg(null)} className="text-emerald-400 hover:text-white text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#0e0e15] border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-2">
            <span>Automated SMS Sent</span>
            <MessageSquare className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalSmsSent.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+324 this week (99.8% delivery rate)</span>
          </div>
        </div>

        <div className="p-4 bg-[#0e0e15] border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-2">
            <span>Active Workflows</span>
            <Zap className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white">{activeWorkflowsCount} / {smsWorkflows.length}</div>
          <div className="text-[10px] text-indigo-300 font-semibold flex items-center gap-1 mt-1">
            <span>Autonomous 24/7 triggers running</span>
          </div>
        </div>

        <div className="p-4 bg-[#0e0e15] border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-2">
            <span>VIP SMS Club Members</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white">{totalSubscribersCount}</div>
          <div className="text-[10px] text-amber-300 font-semibold flex items-center gap-1 mt-1">
            <span>Opted-in Carroll County diners & shoppers</span>
          </div>
        </div>

        <div className="p-4 bg-[#0e0e15] border border-white/5 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/50 text-xs font-bold mb-2">
            <span>Client Monthly Retainers</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white">${monthlyRevenueGenerated.toLocaleString()}<span className="text-xs text-white/40 font-normal">/mo</span></div>
          <div className="text-[10px] text-purple-300 font-semibold flex items-center gap-1 mt-1">
            <span>Turnkey recurring software revenue</span>
          </div>
        </div>
      </div>

      {/* Main Studio Grid: Workflow Editor + Live Phone Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Workflow Selector & Customizer (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Workflow List */}
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Turnkey SMS Workflows ({smsWorkflows.length})
                </h3>
                <p className="text-xs text-white/50 mt-0.5">Select a workflow to edit its copy, trigger delay, or test send.</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {smsWorkflows.map((wf) => {
                const isSelected = wf.id === selectedWorkflowId;
                return (
                  <div
                    key={wf.id}
                    onClick={() => setSelectedWorkflowId(wf.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                      isSelected 
                        ? 'bg-white/10 border-amber-500/50 shadow-md shadow-amber-500/5' 
                        : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        wf.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-white/40'
                      }`}>
                        {wf.category === 'missed_call_textback' && <PhoneCall className="w-4 h-4" />}
                        {wf.category === 'review_booster' && <Sparkles className="w-4 h-4" />}
                        {wf.category === 'table_ready' && <Users className="w-4 h-4" />}
                        {wf.category === 'airbnb_checkin' && <Building2 className="w-4 h-4" />}
                        {wf.category === 'contractor_lead' && <ShieldCheck className="w-4 h-4" />}
                        {wf.category === 'appointment_reminder' && <Clock className="w-4 h-4" />}
                        {wf.category === 'vip_broadcast' && <Flame className="w-4 h-4" />}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white truncate">{wf.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                            ${wf.monthlyValueToMerchant}/mo
                          </span>
                        </div>
                        <p className="text-[11px] text-white/50 truncate mt-0.5">
                          {wf.targetBusinessName} • <span className="text-white/70">Trigger: {wf.triggerEvent}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => toggleSmsWorkflow(wf.id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                          wf.isActive 
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/20' 
                            : 'bg-white/10 text-white/50 hover:text-white'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${wf.isActive ? 'bg-black animate-pulse' : 'bg-white/40'}`} />
                        {wf.isActive ? 'Active' : 'Paused'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workflow Template Customizer */}
          {selectedWorkflow && (
            <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    Configure: {selectedWorkflow.name}
                  </h3>
                  <p className="text-xs text-white/50 mt-0.5">
                    Assigned Merchant: <span className="text-white font-bold">{selectedWorkflow.targetBusinessName}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40">
                    {editingTemplate.length}/160 chars ({Math.ceil((editingTemplate.length || 1) / 160)} SMS segment)
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block">
                  SMS Copy Template
                </label>
                <textarea
                  rows={4}
                  value={editingTemplate}
                  onChange={(e) => {
                    setEditingTemplate(e.target.value);
                    setIsEditing(true);
                  }}
                  className="w-full bg-[#13131e] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-white/30 focus:outline-none focus:border-amber-500/50 transition-all font-sans"
                />

                {/* Available Insert Tokens */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-white/40 font-bold uppercase mr-1">Insert Tokens:</span>
                  {[
                    '{BusinessName}',
                    '{CustomerName}',
                    '{ReviewLink}',
                    '{KeypadCode}',
                    '{ConciergeLink}',
                    '{OrderLink}',
                    '{AppointmentTime}',
                    '{Offer}'
                  ].map((token) => (
                    <button
                      key={token}
                      onClick={() => {
                        setEditingTemplate(prev => prev + ' ' + token);
                        setIsEditing(true);
                      }}
                      className="px-2 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-md text-[10px] font-mono text-amber-300 transition-all"
                    >
                      {token}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
                    Auto-Trigger Delay
                  </label>
                  <input
                    type="text"
                    disabled
                    value={selectedWorkflow.delayMinutes === 0 ? 'Instant (0 seconds)' : `${selectedWorkflow.delayMinutes} Minutes after trigger`}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-white/60 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-white/60 uppercase tracking-wider block mb-1">
                    Estimated ROI Value to Merchant
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`$${selectedWorkflow.monthlyValueToMerchant}/mo value`}
                    className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2 text-xs text-emerald-400 font-bold"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <button
                  onClick={handleSaveTemplate}
                  disabled={!isEditing}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    isEditing 
                      ? 'bg-amber-500 hover:bg-amber-600 text-black font-black' 
                      : 'bg-white/5 text-white/30 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save Template Changes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerTest}
                    className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Trigger Test Send (+ Audio Chime)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Col: Live Interactive Mobile Phone Simulator (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-indigo-400" />
                Live Customer Phone Preview
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                iPhone 15 Pro
              </span>
            </div>

            {/* Realistic iPhone Screen Bezel */}
            <div className="max-w-[310px] mx-auto bg-[#000000] border-4 border-[#222230] rounded-[42px] p-3.5 shadow-2xl shadow-black/80 relative overflow-hidden">
              
              {/* Dynamic Island / Speaker Pill */}
              <div className="w-24 h-5 bg-black rounded-full mx-auto mb-2 flex items-center justify-center border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#111] border border-white/5 mr-2" />
                <div className="w-2 h-2 rounded-full bg-indigo-950/80" />
              </div>

              {/* Status Bar */}
              <div className="flex items-center justify-between px-2 text-[10px] text-white/70 font-semibold mb-3">
                <span>9:41</span>
                <div className="flex items-center gap-1 text-[9px]">
                  <span>5G</span>
                  <div className="w-4 h-2 border border-white/70 rounded-[2px] p-0.5 flex items-center">
                    <div className="w-full h-full bg-emerald-400 rounded-[1px]" />
                  </div>
                </div>
              </div>

              {/* Messages Header */}
              <div className="text-center pb-3 border-b border-white/10 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-black text-sm flex items-center justify-center mx-auto mb-1 shadow-md">
                  {selectedWorkflow ? selectedWorkflow.targetBusinessName.charAt(0) : 'O'}
                </div>
                <div className="text-xs font-bold text-white truncate max-w-[200px] mx-auto">
                  {selectedWorkflow?.targetBusinessName || 'Townraise Merchant'}
                </div>
                <div className="text-[9px] text-white/40">Verified Local Business • Townraise SMS</div>
              </div>

              {/* Message Thread Scroll Area */}
              <div className="space-y-3 min-h-[260px] max-h-[300px] overflow-y-auto p-1">
                <div className="text-center">
                  <span className="text-[9px] text-white/30 font-medium uppercase tracking-wider">Today 9:41 AM</span>
                </div>

                {/* Customer incoming context simulation */}
                {selectedWorkflow?.category === 'missed_call_textback' && (
                  <div className="p-2 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] text-red-300 flex items-center gap-1.5">
                    <PhoneCall className="w-3 h-3 text-red-400 shrink-0" />
                    <span>Missed Call from (603) 555-0199</span>
                  </div>
                )}

                {/* Automated SMS Message Bubble */}
                <div className="flex flex-col items-start space-y-1">
                  <div className="bg-[#248a3d] text-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-[11px] leading-relaxed max-w-[92%] shadow-sm">
                    {selectedWorkflow 
                      ? editingTemplate
                          .replace(/{BusinessName}/g, selectedWorkflow.targetBusinessName)
                          .replace(/{CustomerName}/g, testCustomerName)
                          .replace(/{ReviewLink}/g, 'https://townraise.org/r/pnb-eats')
                          .replace(/{KeypadCode}/g, '4892#')
                          .replace(/{ConciergeLink}/g, 'https://townraise.org/guest/pine-cove')
                          .replace(/{OrderLink}/g, 'https://townraise.org/menu/pnb-eats')
                          .replace(/{AppointmentTime}/g, 'Tomorrow at 10:30 AM')
                          .replace(/{Offer}/g, '15% Off Your Next Meal')
                      : 'Hello from Townraise Automation!'}
                  </div>
                  <span className="text-[8px] text-white/40 pl-1">Delivered via Townraise 2-Way Gateway</span>
                </div>

                {/* Interactive Simulated Customer Reply */}
                <div className="flex flex-col items-end space-y-1 pt-2">
                  <div className="bg-[#1f2937] text-white/90 rounded-2xl rounded-tr-sm px-3 py-1.5 text-[11px] max-w-[80%]">
                    Thank you so much! Leaving a review now ⭐
                  </div>
                  <span className="text-[8px] text-white/40 pr-1">Read 9:42 AM</span>
                </div>
              </div>

              {/* Message Input Simulation */}
              <div className="mt-3 pt-2 border-t border-white/10 flex items-center gap-2">
                <div className="flex-1 bg-[#151520] border border-white/10 rounded-full px-3 py-1 text-[10px] text-white/40">
                  Text Message
                </div>
                <div className="w-6 h-6 rounded-full bg-[#248a3d] flex items-center justify-center text-white">
                  <Send className="w-3 h-3" />
                </div>
              </div>

              {/* Home indicator bar */}
              <div className="w-24 h-1 bg-white/20 rounded-full mx-auto mt-3" />
            </div>

            {/* Test Configuration */}
            <div className="mt-4 pt-4 border-t border-white/5 space-y-3">
              <div className="text-xs font-bold text-white/70 uppercase tracking-wider">
                Simulate Recipient Contact
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] text-white/40 block mb-0.5">Customer Name</label>
                  <input
                    type="text"
                    value={testCustomerName}
                    onChange={(e) => setTestCustomerName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
                <div>
                  <label className="text-[9px] text-white/40 block mb-0.5">Phone Number</label>
                  <input
                    type="text"
                    value={testPhoneNumber}
                    onChange={(e) => setTestPhoneNumber(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500/50"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* VIP Subscribers Section */}
      <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400" />
              Carroll County VIP SMS Club Directory ({smsSubscribers.length} Patrons)
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Verified local patrons who opted-in via NFC tap stands, table buzzers, or website popups.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSubscriberModalOpen(true)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Enroll VIP Member</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-bold uppercase text-[10px]">
                <th className="pb-3 pl-2">VIP Customer</th>
                <th className="pb-3">Phone</th>
                <th className="pb-3">Town</th>
                <th className="pb-3">Opt-in Source</th>
                <th className="pb-3">Joined Date</th>
                <th className="pb-3 pr-2 text-right">Quick SMS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {smsSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-2 font-bold text-white flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white/10 text-white/80 font-black text-[10px] flex items-center justify-center">
                      {sub.name.charAt(0)}
                    </div>
                    <span>{sub.name}</span>
                  </td>
                  <td className="py-3 font-mono text-white/70">{sub.phone}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      {sub.town}
                    </span>
                  </td>
                  <td className="py-3 text-white/50 capitalize font-medium">
                    {sub.optInSource.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 text-white/40 text-[11px]">
                    {sub.subscribedDate}
                  </td>
                  <td className="py-3 pr-2 text-right">
                    <button
                      onClick={() => {
                        sendManualSms(
                          sub.phone,
                          sub.name,
                          'Carroll County VIP Club',
                          `Hi ${sub.name}! You have bonus Oasis loyalty points ready to redeem at participating Carroll County merchants!`,
                          'VIP SMS Broadcast Blast'
                        );
                        setTestStatusMsg(`Direct reward SMS sent to ${sub.name}!`);
                        setTimeout(() => setTestStatusMsg(null), 3500);
                      }}
                      className="px-2.5 py-1 bg-white/5 hover:bg-emerald-500/20 hover:text-emerald-300 text-white/70 rounded-md text-[10px] font-bold transition-all"
                    >
                      Ping SMS
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live SMS Outbox Activity Log */}
      <div className="bg-[#0c0c14] border border-white/5 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              Live SMS Outbox & Delivery Log ({smsLogs.length} Messages Logged)
            </h3>
            <p className="text-xs text-white/50 mt-0.5">
              Real-time audit log of all automated texts, review requests, and dispatch notices sent through the gateway.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search outbox log..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-[#141420] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-white/40 font-bold uppercase text-[10px]">
                <th className="pb-3 pl-2">Recipient</th>
                <th className="pb-3">Merchant</th>
                <th className="pb-3">Message Snippet</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Cost</th>
                <th className="pb-3 pr-2 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pl-2">
                    <div className="font-bold text-white">{log.recipientName}</div>
                    <div className="text-[10px] font-mono text-white/40">{log.recipientPhone}</div>
                  </td>
                  <td className="py-3 text-white/80 font-medium">
                    {log.businessName}
                  </td>
                  <td className="py-3 max-w-xs">
                    <p className="text-[11px] text-white/70 line-clamp-1 font-sans">{log.messageBody}</p>
                  </td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      log.status === 'delivered' 
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : log.status === 'replied'
                        ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-white/50">
                    ${log.cost.toFixed(4)}
                  </td>
                  <td className="py-3 pr-2 text-right text-white/40 text-[10px] font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIP Campaign Broadcast Modal */}
      {blastOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e0e18] border border-white/10 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Launch VIP Weekend SMS Blast
                  </h3>
                  <p className="text-xs text-white/50">Broadcast deals to opted-in Carroll County customers</p>
                </div>
              </div>
              <button
                onClick={() => setBlastOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Campaign Title (Internal Reference)
                </label>
                <input
                  type="text"
                  value={blastCampaignName}
                  onChange={(e) => setBlastCampaignName(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Target Town Filter
                </label>
                <select
                  value={blastTownFilter}
                  onChange={(e) => setBlastTownFilter(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500/50"
                >
                  <option value="all">All Carroll County Patrons ({smsSubscribers.length} contacts)</option>
                  <option value="Wolfeboro">Wolfeboro Only</option>
                  <option value="Conway">Conway / North Conway Only</option>
                  <option value="Ossipee">Ossipee Only</option>
                  <option value="Freedom">Freedom Only</option>
                  <option value="Effingham">Effingham Only</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-bold text-white/70 uppercase tracking-wider">
                    SMS Message Body
                  </label>
                  <span className="text-[10px] font-mono text-white/40">
                    {blastMessage.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={blastMessage}
                  onChange={(e) => setBlastMessage(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs">
                <span className="text-amber-300 font-medium">Estimated Carrier Delivery Cost:</span>
                <span className="text-amber-400 font-bold font-mono">
                  ${((blastTownFilter === 'all' ? smsSubscribers.length : smsSubscribers.filter(s => s.town.toLowerCase().includes(blastTownFilter.toLowerCase())).length) * 0.0079).toFixed(3)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setBlastOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={blastSending || !blastMessage.trim()}
                onClick={handleDispatchBlast}
                className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2"
              >
                {blastSending ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Flame className="w-3.5 h-3.5" />
                    <span>Send Weekend Blast Now</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll VIP Member Modal */}
      {subscriberModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddSubscriber} className="bg-[#0e0e18] border border-white/10 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-black text-white uppercase tracking-tight">
                  Enroll VIP Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSubscriberModalOpen(false)}
                className="text-white/40 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Mobile Phone Number
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (603) 555-0100"
                  value={newSubPhone}
                  onChange={(e) => setNewSubPhone(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-white/70 uppercase tracking-wider block mb-1">
                  Preferred Carroll County Town
                </label>
                <input
                  type="text"
                  required
                  value={newSubTown}
                  onChange={(e) => setNewSubTown(e.target.value)}
                  className="w-full bg-[#151522] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setSubscriberModalOpen(false)}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Save VIP Patron
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
