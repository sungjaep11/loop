import { NextRequest, NextResponse } from "next/server";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

/** GET /api/tts - health check: returns whether TTS is configured (has API key). */
export async function GET() {
  const hasKey = !!process.env.ELEVENLABS_API_KEY?.trim();
  return NextResponse.json(
    { tts: "ok", hasKey },
    { status: 200, headers: corsHeaders }
  );
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const voiceId = process.env.ELEVENLABS_VOICE_ID?.trim() || "VR6AewLTigWG4xSOukaG";

  if (!apiKey) {
    console.error(
      "TTS: ELEVENLABS_API_KEY is not set. Add it to frontend/.env and restart the Next dev server."
    );
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not set" },
      { status: 500, headers: corsHeaders }
    );
  }

  let body: { text?: string; voiceId?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: corsHeaders }
    );
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json(
      { error: "Missing or empty text" },
      { status: 400, headers: corsHeaders }
    );
  }

  const resolvedVoiceId =
    typeof body.voiceId === "string" && body.voiceId.trim()
      ? body.voiceId.trim()
      : voiceId;

  console.log("TTS POST:", text.slice(0, 50) + (text.length > 50 ? "…" : ""));
  try {
    const res = await fetch(`${ELEVENLABS_API_URL}/${resolvedVoiceId}`, {
      method: "POST",
      headers: {
        "xi-api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5", // Faster model for lower latency
        optimize_streaming_latency: 3, // 0-4, higher = lower latency
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("ElevenLabs TTS error:", res.status, errText);
      return NextResponse.json(
        { error: "TTS request failed", details: errText },
        { status: res.status, headers: corsHeaders }
      );
    }

    const audioBuffer = await res.arrayBuffer();
    console.log("TTS OK:", (audioBuffer.byteLength / 1024).toFixed(1), "KB");
    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("ElevenLabs TTS:", err);
    return NextResponse.json(
      { error: "TTS request failed" },
      { status: 500, headers: corsHeaders }
    );
  }
}
