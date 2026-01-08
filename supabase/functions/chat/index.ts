import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
- Help users SET or ADD to their budget (e.g., "set my budget to $500" or "add $200 to my budget")
- Track spending patterns and provide insights
- Offer money-saving tips based on their spending habits
- Provide encouragement and motivation

IMPORTANT TAGS - You MUST include these special tags when relevant:

1. For EXPENSES, include: [EXPENSE:amount:description:category]
   Categories: groceries, dining, coffee, transport, entertainment, shopping, utilities, health, subscriptions, other
   
2. For BUDGET changes, include: [BUDGET:action:amount]
   Actions: "set" (replace current budget) or "add" (add to current budget)

EXPENSE Examples:
- User says "spent $45 on groceries" → Include [EXPENSE:45:groceries:groceries]
- User says "just got coffee for $5.50" → Include [EXPENSE:5.50:coffee:coffee]
- User says "uber was $23" → Include [EXPENSE:23:uber:transport]

BUDGET Examples:
- User says "set my budget to $500" → Include [BUDGET:set:500]
- User says "add $200 to my budget" → Include [BUDGET:add:200]
- User says "I want a $1000 budget" → Include [BUDGET:set:1000]
- User says "increase budget by $300" → Include [BUDGET:add:300]

The tags will be processed by the app, so ALWAYS include them when you detect expense or budget mentions.

Response guidelines:
1. Acknowledge the action warmly
2. Include the appropriate tag
3. Provide a helpful insight or encouragement
4. Keep responses concise (2-4 sentences)

Examples of good responses:
- "Got it! $45 on groceries logged 🛒 [EXPENSE:45:groceries:groceries] You're doing great on food spending!"
- "Budget updated! 💪 [BUDGET:set:500] $500 is a solid goal - I'll help you stick to it!"
- "Nice! Adding $200 to your budget 📈 [BUDGET:add:200] More breathing room is always good!"

Always be helpful, never preachy. You're a friend who happens to be great with money.`;

async function verifyAuth(req: Request): Promise<{ authorized: boolean; error?: string }> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { authorized: false, error: 'Missing or invalid authorization header' };
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data, error } = await supabaseClient.auth.getClaims(token);
  
  if (error || !data?.claims) {
    return { authorized: false, error: 'Invalid or expired token' };
  }

  return { authorized: true };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authorized) {
      console.log('Authentication failed:', authResult.error);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

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
