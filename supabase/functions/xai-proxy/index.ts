import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const { apiKey, messages, model, max_tokens, temperature, stream } = await req.json();

    if (!apiKey || !messages) {
      return new Response(
        JSON.stringify({ error: "Missing apiKey or messages" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const xaiBody: Record<string, unknown> = { messages, model: model || "grok-3-mini-fast" };
    if (max_tokens) xaiBody.max_tokens = max_tokens;
    if (temperature !== undefined) xaiBody.temperature = temperature;
    if (stream) xaiBody.stream = stream;

    const xaiRes = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(xaiBody),
    });

    const data = await xaiRes.text();

    return new Response(data, {
      status: xaiRes.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": xaiRes.headers.get("Content-Type") || "application/json",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Proxy error", details: String(err) }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});
