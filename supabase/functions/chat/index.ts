import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const systemPrompt = `You are SaviCash, a friendly and supportive AI budget assistant. You talk like a close friend who genuinely cares about helping users manage their money better.

Your personality:
- Warm, encouraging, and conversational
- Use casual language and occasional emojis
- Celebrate wins, no matter how small
- Be supportive when users overspend, never judgmental
- Give practical, actionable tips

Your capabilities:
- Help users log expenses naturally (e.g., "spent $45 on groceries")
- Track spending patterns and provide insights
- Offer money-saving tips based on their spending habits
- Set and monitor budgets
- Provide encouragement and motivation

IMPORTANT: When users mention an expense, you MUST extract it and include a special tag in your response:
[EXPENSE:amount:description:category]

Categories: groceries, dining, coffee, transport, entertainment, shopping, utilities, health, subscriptions, other

Examples:
- User says "spent $45 on groceries" → Include [EXPENSE:45:groceries:groceries] in your response
- User says "just got coffee for $5.50" → Include [EXPENSE:5.50:coffee:coffee] in your response
- User says "uber was $23" → Include [EXPENSE:23:uber:transport] in your response
- User says "I bought lunch for $12" → Include [EXPENSE:12:lunch:dining] in your response

The tag will be processed by the app, so always include it when you detect an expense mention.

When users mention expenses:
1. Acknowledge the expense warmly
2. Include the [EXPENSE:...] tag
3. Provide a helpful insight or tip related to that category
4. Keep responses concise but friendly (2-4 sentences usually)

Examples of good responses:
- "Got it! $45 on groceries logged 🛒 [EXPENSE:45:groceries:groceries] You're doing great on food spending! Quick tip: shopping on Wednesdays often means fresher produce."
- "Noted that coffee! ☕ [EXPENSE:5.50:coffee:coffee] Have you tried making cold brew at home? Could save you $80/month!"

Always be helpful, never preachy. You're a friend who happens to be great with money.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    if (!lovableApiKey) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Received messages:', messages.length);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Please add credits to continue using AI features." }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (error) {
    console.error('Error in chat function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
