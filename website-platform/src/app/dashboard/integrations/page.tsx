import { createClient } from '@/utils/supabase/server';
import { CrmConfigForm } from './CrmConfigForm';

export default async function IntegrationsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user's sites and their chatbot configs
  const { data: sites } = await supabase
    .from('sites')
    .select(`
      id, 
      name,
      chatbot_configs (crm_provider, crm_webhook_url)
    `)
    .eq('user_id', user?.id || '');

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">Integrations</h1>
        <p className="text-muted-foreground">Connect your AI Chatbots to your favorite CRM tools.</p>
      </header>

      <div className="space-y-8">
        {sites && sites.length > 0 ? (
          sites.map(site => {
            // Check if it's an array (from the join) or single object
            const config = Array.isArray(site.chatbot_configs) 
              ? site.chatbot_configs[0] 
              : site.chatbot_configs;
              
            return (
              <div key={site.id} className="bg-secondary/10 border border-border/50 rounded-2xl p-6">
                <h3 className="text-xl font-bold mb-4">{site.name}</h3>
                
                <CrmConfigForm 
                  siteId={site.id} 
                  initialProvider={config?.crm_provider || 'custom'}
                  initialWebhookUrl={config?.crm_webhook_url || ''}
                />
              </div>
            )
          })
        ) : (
          <div className="text-center p-8 border border-dashed border-border/50 rounded-xl bg-secondary/5 text-muted-foreground">
            You need to generate a website before you can configure integrations.
          </div>
        )}
      </div>
    </div>
  );
}
