'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function saveGeneratedSite(industry: string, prompt: string) {
  const supabase = await createClient()

  // 1. Get the current logged in user
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { error: 'You must be logged in to generate a site.' }
  }

  // 2. Generate HTML with Claude
  let generatedHtml = '';
  try {
    const response = await generateText({
      model: anthropic('claude-3-5-sonnet-latest'),
      system: `You are an expert web developer and UI designer. 
Your task is to generate a beautiful, modern, responsive landing page using HTML and Tailwind CSS via CDN.
The page should include a Header, Hero Section, Features Section, and Footer. 
Do not include \`\`\`html tags in the output, just raw valid HTML starting with <!DOCTYPE html>.
Ensure the Tailwind CSS script is included in the <head>: <script src="https://cdn.tailwindcss.com"></script>.
Make it look incredibly premium, colorful, and modern. Add inline CSS animations if possible.`,
      prompt: `Industry: ${industry}\nUser Request: ${prompt}\n\nPlease generate the full HTML page.`,
    });
    
    generatedHtml = response.text.trim();
    if (generatedHtml.startsWith('```html')) {
      generatedHtml = generatedHtml.replace(/```html/g, '').replace(/```/g, '').trim();
    }
  } catch (err) {
    console.error('Anthropic Error:', err);
    return { error: 'Failed to connect to AI generator. Make sure ANTHROPIC_API_KEY is set in .env.local.' }
  }

  // 3. Insert the new site into the database
  const siteName = `${industry} Site - ${Math.random().toString(36).substring(7)}`
  const fakeUrl = `${siteName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}.aisite.pro`
  
  const { data: siteData, error: siteError } = await supabase
    .from('sites')
    .insert([
      {
        user_id: user.id,
        name: siteName,
        industry: industry,
        prompt: prompt,
        url: fakeUrl,
        status: 'Published',
        html_content: generatedHtml
      }
    ])
    .select()
    .single()

  if (siteError) {
    console.error('Error saving site:', siteError)
    return { error: 'Failed to save generated site to database.' }
  }

  // Revalidate the dashboard pages so the new site appears
  revalidatePath('/dashboard', 'layout')
  
  return { success: true, site: siteData }
}
