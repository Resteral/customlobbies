'use client';

import { useState } from 'react';
import { saveCrmIntegration } from './actions';
import { Loader2, CheckCircle2 } from 'lucide-react';

export function CrmConfigForm({ 
  siteId, 
  initialProvider, 
  initialWebhookUrl 
}: { 
  siteId: string, 
  initialProvider: string, 
  initialWebhookUrl: string 
}) {
  const [provider, setProvider] = useState(initialProvider);
  const [webhookUrl, setWebhookUrl] = useState(initialWebhookUrl);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaved(false);

    const result = await saveCrmIntegration(siteId, provider, webhookUrl);
    
    if (result.error) {
      alert(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    
    setIsSaving(false);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <select 
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="custom">Custom Webhook (Zapier, Make)</option>
            <option value="hubspot">HubSpot (via Webhook)</option>
            <option value="salesforce">Salesforce (via Webhook)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Webhook URL</label>
          <input 
            type="url" 
            placeholder="https://hooks.zapier.com/..."
            value={webhookUrl}
            onChange={(e) => setWebhookUrl(e.target.value)}
            className="w-full bg-background border border-border/50 rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary outline-none"
            required
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button 
          type="submit" 
          disabled={isSaving}
          className="bg-primary text-white px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Integration'}
        </button>
        {saved && (
          <span className="text-green-500 text-sm flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-4 h-4" /> Saved successfully
          </span>
        )}
      </div>
    </form>
  );
}
