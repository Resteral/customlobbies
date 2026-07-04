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
    .select('id, html_content, status')
    .eq('custom_domain', hostname)
    .single();

  if (error || !site) {
    return new NextResponse(`Site not found for domain ${hostname}`, { status: 404 });
  }

  if (!site.html_content) {
    return new NextResponse('Site is generating...', { status: 200 });
  }

  // Inject our support chat widget iframe
  const embedCode = `
    <div id="resolve-support-root"></div>
    <script>
      (function() {
        var container = document.getElementById('resolve-support-root');
        var iframe = document.createElement('iframe');
        iframe.src = window.location.origin + '/support/embed?site_id=${site.id}';
        iframe.style.position = 'fixed';
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        iframe.style.width = '65px';
        iframe.style.height = '65px';
        iframe.style.border = 'none';
        iframe.style.zIndex = '999999';
        iframe.style.background = 'transparent';
        iframe.style.transition = 'all 0.3s ease';
        container.appendChild(iframe);

        window.addEventListener('message', function(event) {
          if (event.data === 'open-support') {
            iframe.style.width = '330px';
            iframe.style.height = '430px';
          } else if (event.data === 'close-support') {
            iframe.style.width = '65px';
            iframe.style.height = '65px';
          }
        });
      })();
    </script>
  `;
  
  let finalHtml = site.html_content;
  if (finalHtml.includes('</body>')) {
    finalHtml = finalHtml.replace('</body>', `${embedCode}</body>`);
  } else {
    finalHtml += embedCode;
  }

  // Return the raw generated HTML
  return new NextResponse(finalHtml, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
