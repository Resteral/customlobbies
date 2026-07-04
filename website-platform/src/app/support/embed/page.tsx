import EmbedClient from './EmbedClient';

export default function SupportEmbedPage({ searchParams }: { searchParams: { site_id?: string } }) {
  const siteId = searchParams.site_id || '';

  return (
    <div className="min-h-screen bg-transparent text-white font-sans overflow-hidden">
      <EmbedClient siteId={siteId} />
    </div>
  );
}
