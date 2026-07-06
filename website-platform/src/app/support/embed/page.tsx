import EmbedClient from './EmbedClient';

export default async function SupportEmbedPage({ searchParams }: { searchParams: Promise<{ site_id?: string }> }) {
  const resolvedParams = await searchParams;
  const siteId = resolvedParams.site_id || '';

  return (
    <div className="min-h-screen bg-transparent text-white font-sans overflow-hidden">
      <EmbedClient siteId={siteId} />
    </div>
  );
}
