import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "LOVABLE_API_KEY is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { module, context } = await req.json();

    const systemPrompts: Record<string, string> = {
      content: `You are an expert website content writer. Generate marketing content for a local service business.
Given the business context, generate content blocks. Return JSON with this exact structure:
{
  "blocks": [
    {
      "blockId": "<id>",
      "blockType": "<type>",
      "headline": "<headline>",
      "subheadline": "<subheadline>",
      "description": "<description>",
      "cta": "<call to action text>"
    }
  ]
}
Block types: hero, features, services, gallery, pricing, cta, contact, about, testimonials, faq.
Write in ${context.language === 'en' ? 'English' : context.language === 'de' ? 'German' : context.language === 'fr' ? 'French' : context.language === 'es' ? 'Spanish' : 'Russian'}.`,

      seo: `You are an SEO expert for local service businesses. Generate SEO-optimized pages.
Return JSON:
{
  "pages": [
    {
      "slug": "<url-slug>",
      "title": "<page title max 60 chars>",
      "metaDescription": "<meta description max 160 chars>",
      "h1": "<main heading>",
      "headings": [{"level": 2, "text": "<heading>"}],
      "bodyContent": "<main body text>",
      "faq": [{"question": "<q>", "answer": "<a>"}]
    }
  ]
}
Generate: main service+city page, emergency page, and up to 3 sub-service pages.
Write in ${context.language === 'en' ? 'English' : context.language === 'de' ? 'German' : context.language === 'fr' ? 'French' : context.language === 'es' ? 'Spanish' : 'Russian'}.`,

      smm: `You are a social media marketing expert. Generate posts for local service businesses.
Return JSON:
{
  "posts": [
    {
      "platform": "instagram|facebook|linkedin",
      "caption": "<post caption>",
      "hashtags": ["#tag1", "#tag2"],
      "suggestedImagePrompt": "<optional image prompt>"
    }
  ]
}
Generate 2 posts per platform (instagram, facebook, linkedin).
Write in ${context.language === 'en' ? 'English' : context.language === 'de' ? 'German' : context.language === 'fr' ? 'French' : context.language === 'es' ? 'Spanish' : 'Russian'}.`,
    };

    const systemPrompt = systemPrompts[module];
    if (!systemPrompt) {
      return new Response(JSON.stringify({ error: `Unknown module: ${module}` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userPrompt = `Business: ${context.serviceCategory} in ${context.targetCity}
Industry: ${context.industry}
Sub-services: ${context.subServices?.join(', ') || 'N/A'}
Topic: ${context.siteTopic || `${context.serviceCategory} in ${context.targetCity}`}
${module === 'content' && context.blocks ? `\nExisting blocks (generate content for each):\n${JSON.stringify(context.blocks.map((b: any) => ({ id: b.id, text: b.text?.substring(0, 50) })))}` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credits exhausted. Please add funds at Settings > Workspace > Usage." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI generation failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(JSON.stringify({ error: "Failed to parse AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-generate error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
