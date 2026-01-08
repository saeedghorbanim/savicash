import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

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

When users mention expenses:
1. Acknowledge the expense warmly
2. Provide a helpful insight or tip related to that category
3. If relevant, suggest ways to save or alternatives
4. Keep responses concise but friendly (2-4 sentences usually)

Examples of good responses:
- "Got it! $45 on groceries logged 🛒 You're actually doing great on food spending this week! Quick tip: shopping on Wednesdays often means fresher produce and better deals."
- "Noted that coffee run! ☕ I've noticed you love your morning caffeine - have you tried making cold brew at home? Could save you about $80/month while still getting that coffee fix!"

Always be helpful, never preachy. You're a friend who happens to be great with money.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    console.log('Received messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
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
