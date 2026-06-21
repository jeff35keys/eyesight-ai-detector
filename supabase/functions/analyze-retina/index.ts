import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface DiseasePrediction {
  disease: string;
  confidence: number;
  detected: boolean;
}

const DISEASES = [
  "Diabetic Retinopathy",
  "Glaucoma",
  "Age-related Macular Degeneration",
  "Cataracts",
  "Hypertensive Retinopathy",
  "Retinal Vein Occlusion",
  "Macular Edema",
  "Retinitis Pigmentosa",
  "Pathological Myopia",
];

const SYSTEM_PROMPT = `You are an ophthalmology AI assistant simulating a CNN-based retinal fundus image classifier. Analyze the provided fundus image and produce confidence scores (0.0-1.0) for each of these conditions: ${DISEASES.join(
  ", ",
)}. Mark a disease as "detected" if confidence > 0.5. Determine an overall severity in {Normal, Mild, Moderate, Severe, Proliferative} and an overall risk percentage 0-100. IMPORTANT: This is for educational/research demonstration only — not medical advice.`;

const USER_PROMPT = `Analyze this retinal fundus image and return a JSON object with this exact schema:
{
  "predictions": [
${DISEASES.map((d) => `    {"disease": "${d}", "confidence": number, "detected": boolean}`).join(",\n")}
  ],
  "severity": "Normal" | "Mild" | "Moderate" | "Severe" | "Proliferative",
  "overallRisk": number,
  "notes": "brief clinical observation"
}
Return ONLY valid JSON, no markdown.`;

// ---------- Provider implementations ----------

interface ProviderCfg {
  url: string;
  model: string;
  key: string;
  authHeader?: string;
  extraHeaders?: Record<string, string>;
}

async function callOpenAICompatible(cfg: ProviderCfg, dataUrl: string) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(cfg.extraHeaders || {}),
  };

  if (cfg.authHeader) {
    headers[cfg.authHeader] = cfg.key;
  } else {
    headers["Authorization"] = `Bearer ${cfg.key}`;
  }

  const res = await fetch(cfg.url, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: USER_PROMPT },
            { type: "image_url", image_url: { url: dataUrl } },
          ],
        },
      ],
      response_format: { type: "json_object" },
    }),
  });
  return res;
}

async function callGeminiDirect(key: string, dataUrl: string, mimeType: string) {
  const base64 = dataUrl.split(",")[1] || dataUrl;
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `${SYSTEM_PROMPT}\n\n${USER_PROMPT}` },
              { inline_data: { mime_type: mimeType || "image/jpeg", data: base64 } },
            ],
          },
        ],
        generationConfig: { responseMimeType: "application/json" },
      }),
    },
  );
  return res;
}

async function runProvider(
  provider: string,
  dataUrl: string,
  mimeType: string,
): Promise<{ ok: boolean; status: number; content: string; providerUsed: string }> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  const groqKey = Deno.env.get("GROQ_API_KEY");
  const orKey = Deno.env.get("OPENROUTER_API_KEY");
  const hfKey = Deno.env.get("HUGGINGFACE_API_KEY");
  const togetherKey = Deno.env.get("TOGETHER_API_KEY");
  const geminiKey = Deno.env.get("GEMINI_API_KEY");

  let res: Response;
  let used = provider;

  switch (provider) {
    case "groq":
      if (!groqKey) throw new Error("GROQ_API_KEY not set");
      res = await callOpenAICompatible(
        {
          url: "https://api.groq.com/openai/v1/chat/completions",
          model: "llama-3.2-90b-vision-preview",
          key: groqKey,
        },
        dataUrl,
      );
      break;
    case "openrouter":
      if (!orKey) throw new Error("OPENROUTER_API_KEY not set");
      res = await callOpenAICompatible(
        {
          url: "https://openrouter.ai/api/v1/chat/completions",
          model: "google/gemini-2.0-flash-exp:free",
          key: orKey,
          extraHeaders: {
            "HTTP-Referer": "https://retinaai.app",
            "X-Title": "RetinaAI",
          },
        },
        dataUrl,
      );
      break;
    case "together":
      if (!togetherKey) throw new Error("TOGETHER_API_KEY not set");
      res = await callOpenAICompatible(
        {
          url: "https://api.together.xyz/v1/chat/completions",
          model: "meta-llama/Llama-3.2-90B-Vision-Instruct-Turbo",
          key: togetherKey,
        },
        dataUrl,
      );
      break;
    case "huggingface":
      if (!hfKey) throw new Error("HUGGINGFACE_API_KEY not set");
      // HF router exposes an OpenAI-compatible endpoint for vision models
      res = await callOpenAICompatible(
        {
          url: "https://router.huggingface.co/v1/chat/completions",
          model: "meta-llama/Llama-3.2-11B-Vision-Instruct",
          key: hfKey,
        },
        dataUrl,
      );
      break;
    case "gemini":
      if (!geminiKey) throw new Error("GEMINI_API_KEY not set");
      res = await callGeminiDirect(geminiKey, dataUrl, mimeType);
      break;
    case "lovable":
    default:
      used = "lovable";
      if (!lovableKey) throw new Error("LOVABLE_API_KEY not set");
      res = await callOpenAICompatible(
        {
          url: "https://ai.gateway.lovable.dev/v1/chat/completions",
          model: "google/gemini-2.5-flash",
          key: lovableKey,
          authHeader: "Lovable-API-Key",
          extraHeaders: {
            "X-Lovable-AIG-SDK": "vercel-ai-sdk",
          },
        },
        dataUrl,
      );
      break;
  }

  const text = await res.text();
  let content = "";
  if (res.ok) {
    try {
      const j = JSON.parse(text);
      // Gemini direct shape
      if (provider === "gemini") {
        content = j.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
      } else {
        content = j.choices?.[0]?.message?.content ?? "{}";
      }
    } catch {
      content = text;
    }
  } else {
    content = text;
  }
  return { ok: res.ok, status: res.status, content, providerUsed: used };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageName, mimeType, provider: requestedProvider } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    // Provider priority: explicit request → AI_PROVIDER env → "lovable"
    const provider = (requestedProvider || Deno.env.get("AI_PROVIDER") || "lovable").toLowerCase();

    // Try the chosen provider, fall back to lovable if it fails
    let attempt = await runProvider(provider, dataUrl, mimeType || "image/jpeg").catch((e) => ({
      ok: false,
      status: 500,
      content: e?.message || "provider error",
      providerUsed: provider,
    }));

    if (!attempt.ok && provider !== "lovable") {
      console.warn(`Provider ${provider} failed (${attempt.status}). Falling back to Lovable AI.`);
      attempt = await runProvider("lovable", dataUrl, mimeType || "image/jpeg").catch((e) => ({
        ok: false,
        status: 500,
        content: e?.message || "lovable fallback error",
        providerUsed: "lovable",
      }));
    }

    if (!attempt.ok) {
      if (attempt.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (attempt.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      return new Response(
        JSON.stringify({ error: `AI provider error (${attempt.providerUsed}): ${attempt.status} - ${attempt.content.slice(0, 500)}` }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    let parsed: any;
    try {
      parsed = JSON.parse(attempt.content);
    } catch {
      const match = attempt.content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    const predictions: DiseasePrediction[] = DISEASES.map((name) => {
      const p =
        (parsed.predictions || []).find((x: any) =>
          (x.disease || "").toLowerCase().includes(name.toLowerCase().split(" ")[0]),
        ) ||
        (parsed.predictions || []).find(
          (x: any) => (x.disease || "").toLowerCase() === name.toLowerCase(),
        );
      const confidence = Math.max(0, Math.min(1, Number(p?.confidence ?? 0)));
      return {
        disease: name,
        confidence,
        detected: typeof p?.detected === "boolean" ? p.detected : confidence > 0.5,
      };
    });

    const validSeverities = ["Normal", "Mild", "Moderate", "Severe", "Proliferative"];
    const severity = validSeverities.includes(parsed.severity) ? parsed.severity : "Normal";
    const overallRisk = Math.round(
      Math.max(
        0,
        Math.min(
          100,
          Number(parsed.overallRisk ?? Math.max(...predictions.map((p) => p.confidence)) * 100),
        ),
      ),
    );

    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      imageName: imageName || "fundus.jpg",
      predictions,
      severity,
      overallRisk,
      notes: parsed.notes || "",
      providerUsed: attempt.providerUsed,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("analyze-retina error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
