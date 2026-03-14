import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const XAI_TIMEOUT_MS = 30_000;

Deno.serve(async (req: Request) => {
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
    const body = await req.json();
    const { apiKey, messages, model, max_tokens, temperature, stream, useSearch } = body;

    if (!apiKey || !messages) {
      return new Response(
        JSON.stringify({ error: "Missing apiKey or messages" }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    let endpoint: string;
    let xaiBody: Record<string, unknown>;

    if (useSearch) {
      // Responses API — supports web_search tool
      endpoint = "https://api.x.ai/v1/responses";
      xaiBody = {
        model: model || "grok-3-mini-fast",
        input: messages,
        tools: [{ type: "web_search" }],
      };
      if (max_tokens) xaiBody.max_output_tokens = max_tokens;
      if (temperature !== undefined) xaiBody.temperature = temperature;
    } else {
      // Chat Completions API — standard chat
      endpoint = "https://api.x.ai/v1/chat/completions";
      xaiBody = { messages, model: model || "grok-3-mini-fast" };
      if (max_tokens) xaiBody.max_tokens = max_tokens;
      if (temperature !== undefined) xaiBody.temperature = temperature;
      if (stream) xaiBody.stream = stream;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), XAI_TIMEOUT_MS);

    let xaiRes: Response;
    try {
      xaiRes = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify(xaiBody),
        signal: controller.signal,
      });
    } catch (fetchErr) {
      clearTimeout(timeout);
      const isTimeout = fetchErr instanceof Error && fetchErr.name === "AbortError";
      return new Response(
        JSON.stringify({ error: isTimeout ? "xAI API timeout" : "xAI unreachable", details: String(fetchErr) }),
        {
          status: 504,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }
    clearTimeout(timeout);

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
