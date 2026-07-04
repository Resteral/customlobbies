import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  const url = params.url;
  
  if (!url) {
    return new NextResponse('Missing URL parameter', { status: 400 });
  }

  const supabase = await createClient();

  // Find the site by URL
  const { data: site, error } = await supabase
    .from('sites')
    .select('html_content, status')
    .eq('url', url)
    .single();

  if (error || !site) {
    return new NextResponse('Site not found', { status: 404 });
  }

  // If no html content exists (like for mock sites generated before Phase 5)
  if (!site.html_content) {
    const fallbackHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Resolve.bet Site</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-50 flex items-center justify-center min-h-screen font-sans">
        <div class="text-center p-8 max-w-lg bg-white shadow-xl rounded-2xl border border-gray-100">
          <div class="text-blue-500 mb-4 flex justify-center">
            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"></path></svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Site is generating...</h1>
          <p class="text-gray-500">This is a placeholder for a site generated before the Live AI update. Please generate a new site in the dashboard to see the AI output!</p>
        </div>
      </body>
      </html>
    `;
    return new NextResponse(fallbackHtml, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  // Return the raw generated HTML
  return new NextResponse(site.html_content, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
