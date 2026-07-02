export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

// URL of your deployed Cloudflare Worker (set in .env). The Gemini key lives
// only in the worker — never in this app.
const API_URL = process.env.EXPO_PUBLIC_AROHA_API_URL;

/**
 * Sends a message to Aroha via the server-side proxy (Cloudflare Worker).
 */
export async function sendToAroha(
  message: string,
  history: ChatMessage[] = []
): Promise<string> {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_AROHA_API_URL is not set. Copy .env.example to .env and add your worker URL.'
    );
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error(`Aroha request failed (${res.status}).`);
  }

  const data = (await res.json()) as { reply?: string; error?: string };
  if (data.error || !data.reply) {
    throw new Error(data.error || 'No reply from Aroha.');
  }
  return data.reply;
}
