const AROHA_SYSTEM = `You are Aroha, a warm, patient personal health companion for elderly people in India.

STYLE:
- Speak in short, plain sentences. Be kind, calm, and encouraging.
- Assume the user may have low tech literacy and poor eyesight. Keep replies brief.

STRICT SAFETY RULES (never break these):
- You are NOT a doctor. You do not diagnose conditions or prescribe medicines.
- You never tell a user their doctor is wrong or that they should stop a medicine.
- You may share general, sourced health information, but for anything medical you
  end your reply with: "I'm not a doctor — please confirm with yours."
- If a user describes an emergency (chest pain, trouble breathing, fainting, severe
  bleeding), tell them to contact a doctor or emergency services immediately.

Your job is to remember, remind, log, and help the user prepare for their doctor —
you advocate for the patient, you never override the doctor.`;

const MEDICATION_PROMPT = `You are a medication extraction assistant. Analyze the image and return JSON with:
- name: the medication name
- dosage: the dosage strength (e.g. "500mg", "5mg")
- form: "tablet" | "capsule" | "liquid" | "injection" | "cream"
- frequency: "once_daily" | "twice_daily" | "thrice_daily" | "weekly" | "as_needed"
- times: array of times in "HH:mm" format (e.g. ["08:00", "20:00"])
- instructions: any special instructions

Return ONLY valid JSON, no markdown, no explanation. If you cannot determine a field, use null.`;

const SYMPTOM_PROMPT = `You are a symptom description assistant. Describe what you see in the image factually and neutrally.
- appearance: brief visual description (color, size, texture, location on body)
- description: plain English description of what the image shows
- advice: general advice only — always end with "This is not medical advice. Please consult your doctor for a proper diagnosis."

Return ONLY valid JSON with these three fields, no markdown, no explanation. If you cannot determine a field, use null.`;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

async function callGemini(payload, env) {
  const url =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' +
    env.GEMINI_API_KEY;

  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await r.json();
  if (!r.ok) {
    const msg = data?.error?.message || JSON.stringify(data);
    console.error('Gemini error:', msg);
    throw new Error('Gemini: ' + msg);
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

async function handleChat(body, env) {
  const { message, history, context } = body;

  let systemPrompt = AROHA_SYSTEM;
  if (context) {
    systemPrompt += `\n\nCONTEXT ABOUT THE USER (use this to personalize your response):\n${context}`;
  }

  const h = Array.isArray(history) ? history : [];
  const contents = [
    ...h.slice(-10).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }],
    })),
    { role: 'user', parts: [{ text: message }] },
  ];

  const reply = await callGemini(
    {
      systemInstruction: { parts: [{ text: systemPrompt }] },
      contents,
    },
    env
  );

  return json({ reply: reply || "Sorry, I couldn't find the words. Please try again." });
}

async function handleVision(body, env, prompt) {
  const { image, mimeType } = body;

  if (!image || !mimeType) {
    return json({ error: 'Image and mimeType are required.' }, 400);
  }

  const reply = await callGemini(
    {
      contents: [
        {
          parts: [
            { inlineData: { mimeType, data: image } },
            { text: prompt },
          ],
        },
      ],
    },
    env
  );

  try {
    const parsed = JSON.parse(reply.replace(/```json|```/g, '').trim());
    return json(parsed);
  } catch {
    console.error('Failed to parse Gemini vision response:', reply);
    return json({ error: 'Could not parse the image. Please try again or enter manually.' }, 422);
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return json({ error: 'Use POST.' }, 405);

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON.' }, 400);
    }

    const intent = body?.intent || 'chat';

    try {
      switch (intent) {
        case 'chat':
          return await handleChat(body, env);
        case 'analyzeMedication':
          return await handleVision(body, env, MEDICATION_PROMPT);
        case 'analyzeSymptom':
          return await handleVision(body, env, SYMPTOM_PROMPT);
        default:
          return json({ error: `Unknown intent: ${intent}` }, 400);
      }
    } catch (e) {
      console.error('Worker error:', e);
      return json({ error: 'Internal error' }, 500);
    }
  },
};
