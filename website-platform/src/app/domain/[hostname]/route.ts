import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { hostname: string } }
) {
  const hostname = params.hostname;
  
  if (!hostname) {
    return new NextResponse('Missing hostname parameter', { status: 400 });
  }

  const supabase = await createClient();

  // Find the site by custom_domain
  const { data: site, error } = await supabase
    .from('sites')
    .select('html_content, status')
    .eq('custom_domain', hostname)
    .single();

  if (error || !site) {
    return new NextResponse(`Site not found for domain ${hostname}`, { status: 404 });
  }

  if (!site.html_content) {
    return new NextResponse('Site is generating...', { status: 200 });
  }

  // Return the raw generated HTML
  return new NextResponse(site.html_content, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
