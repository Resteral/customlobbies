'use client';

import { useState } from 'react';
import { User, Mail, Clock, CheckCircle, Globe, ChevronRight } from 'lucide-react';
import { updateLeadStatus } from './actions';

type Lead = {
  id: string;
  name: string;
  email: string;
  transcript: string;
  status: string;
  created_at: string;
  site: {
    name: string;
    url: string;
  };
};

export default function InboxClient({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(initialLeads[0] || null);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    // Optimistic update
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
    
    await updateLeadStatus(leadId, newStatus);
  };

  if (leads.length === 0) {
    return (
      <div className="h-full border border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-secondary/5">
        <Mail className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">Your Inbox is Empty</h3>
        <p className="text-muted-foreground max-w-sm">
          When visitors talk to the AI chatbot on your generated sites and provide their contact info, they will appear here as leads!
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex border border-border/50 rounded-2xl overflow-hidden bg-background">
      {/* Sidebar: Lead List */}
      <div className="w-1/3 border-r border-border/50 flex flex-col bg-secondary/5">
        <div className="p-4 border-b border-border/50 bg-background/50">
          <h2 className="font-semibold">All Leads ({leads.length})</h2>
        </div>
        <div className="flex-grow overflow-y-auto">
          {leads.map((lead) => (
            <button
              key={lead.id}
              onClick={() => setSelectedLead(lead)}
              className={`w-full text-left p-4 border-b border-border/50 transition-colors flex items-start gap-3 ${
                selectedLead?.id === lead.id ? 'bg-primary/5 border-l-4 border-l-primary' : 'hover:bg-secondary/20 border-l-4 border-l-transparent'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold truncate">{lead.name || 'Anonymous'}</h4>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate mb-2">{lead.email}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                    lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' :
                    lead.status === 'Contacted' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-green-500/10 text-green-500'
                  }`}>
                    {lead.status}
                  </span>
                  <span className="text-xs text-muted-foreground truncate flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {lead.site.name}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Lead Details & Transcript */}
      <div className="flex-1 flex flex-col bg-background relative">
        {selectedLead ? (
          <>
            <div className="p-6 border-b border-border/50 flex justify-between items-start bg-secondary/5">
              <div>
                <h2 className="text-2xl font-bold mb-1">{selectedLead.name || 'Anonymous User'}</h2>
                <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline flex items-center gap-2 mb-4">
                  <Mail className="w-4 h-4" />
                  {selectedLead.email}
                </a>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-4 h-4" />
                    Source: <a href={`https://${selectedLead.site.url}`} target="_blank" className="hover:text-primary transition-colors">{selectedLead.site.name}</a>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    Captured: {new Date(selectedLead.created_at).toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <select 
                  value={selectedLead.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value)}
                  className="bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="New">Status: New</option>
                  <option value="Contacted">Status: Contacted</option>
                  <option value="Closed">Status: Closed</option>
                </select>
              </div>
            </div>

            <div className="p-6 flex-grow overflow-y-auto">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                AI Chat Transcript
              </h3>
              
              <div className="bg-secondary/5 border border-border/50 rounded-xl p-6 font-mono text-sm whitespace-pre-wrap text-muted-foreground">
                {selectedLead.transcript || "No transcript available for this lead."}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Select a lead to view details
          </div>
        )}
      </div>
    </div>
  );
}
