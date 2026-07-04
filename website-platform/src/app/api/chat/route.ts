import { anthropic } from '@ai-sdk/anthropic';
import { streamText, tool } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, siteContext } = await req.json();

  const result = streamText({
    model: anthropic('claude-3-5-sonnet-latest'),
    system: `You are a helpful AI assistant for a local business website. 
${siteContext ? `Here is some context about the business: ${siteContext}` : ''}
Your goal is to answer visitor questions, capture leads, and guide them to the right pages.
If a user asks to buy something, see products, or checkout, use the navigateUser tool to send them to the '/store' page or another relevant URL.`,
    messages,
    tools: {
      navigateUser: tool({
        description: 'Navigate the user to a specific URL on the website (e.g., /store, /checkout, /contact)',
        parameters: z.object({
          url: z.string().describe('The URL path to navigate to, e.g., /store'),
          reason: z.string().describe('The reason for navigating, shown to the user'),
        }),
        execute: async ({ url, reason }) => {
          // The actual navigation happens on the client side when this tool call is received.
          return {
            success: true,
            navigatedTo: url,
            reason
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
