/**
 * Aroha proxy — a tiny Cloudflare Worker that holds the Gemini API key.
 * The mobile app calls THIS worker; the key never ships in the app.
 * Uses Gemini's REST API directly, so the worker has zero npm dependencies.
 */

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

    const message = body && body.message;
    if (!message || typeof message !== 'string') {
      return json({ error: 'A "message" string is required.' }, 400);
    }

    const history = Array.isArray(body.history) ? body.history : [];
    const contents = [
      ...history.slice(-10).map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: String(m.content || '') }],
      })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const payload = {
      systemInstruction: { parts: [{ text: AROHA_SYSTEM }] },
      contents,
    };

    try {
      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        env.GEMINI_API_KEY;

      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await r.json();
      if (!r.ok) {
        console.error('Gemini error:', JSON.stringify(data));
        return json({ error: 'Aroha could not respond right now.' }, 502);
      }

      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        "Sorry, I couldn't find the words. Please try again.";

      return json({ reply });
    } catch (e) {
      console.error('Worker error:', e);
      return json({ error: 'internal' }, 500);
    }
  },
};
