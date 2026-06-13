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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, imageName, mimeType } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const dataUrl = imageBase64.startsWith("data:")
      ? imageBase64
      : `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const systemPrompt = `You are an ophthalmology AI assistant simulating a CNN-based retinal fundus image classifier. Analyze the provided fundus image and produce confidence scores (0.0-1.0) for each of these conditions: ${DISEASES.join(", ")}. Mark a disease as "detected" if confidence > 0.5. Determine an overall severity in {Normal, Mild, Moderate, Severe, Proliferative} and an overall risk percentage 0-100. IMPORTANT: This is for educational/research demonstration only — not medical advice.`;

    const userPrompt = `Analyze this retinal fundus image and return a JSON object with this exact schema:
{
  "predictions": [
${DISEASES.map((d) => `    {"disease": "${d}", "confidence": number, "detected": boolean}`).join(",\n")}
  ],
  "severity": "Normal" | "Mild" | "Moderate" | "Severe" | "Proliferative",
  "overallRisk": number,
  "notes": "brief clinical observation"
}
Return ONLY valid JSON, no markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userPrompt },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to your Lovable workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: `AI gateway error: ${response.status} - ${text}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      const match = content.match(/\{[\s\S]*\}/);
      parsed = match ? JSON.parse(match[0]) : {};
    }

    // Normalize / sanitize
    const predictions: DiseasePrediction[] = DISEASES.map((name) => {
      const p = (parsed.predictions || []).find((x: any) =>
        (x.disease || "").toLowerCase().includes(name.toLowerCase().split(" ")[0])
      ) || (parsed.predictions || []).find((x: any) =>
        (x.disease || "").toLowerCase() === name.toLowerCase()
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
      Math.max(0, Math.min(100, Number(parsed.overallRisk ?? Math.max(...predictions.map((p) => p.confidence)) * 100)))
    );

    const result = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      imageName: imageName || "fundus.jpg",
      predictions,
      severity,
      overallRisk,
      notes: parsed.notes || "",
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
