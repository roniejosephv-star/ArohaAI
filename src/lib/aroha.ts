import { ChatMessage } from './storage';

const API_URL = process.env.EXPO_PUBLIC_AROHA_API_URL;

export type { ChatMessage };

export async function sendToAroha(
  message: string,
  history: ChatMessage[] = [],
  context?: string
): Promise<string> {
  if (!API_URL) {
    throw new Error(
      'EXPO_PUBLIC_AROHA_API_URL is not set. Copy .env.example to .env and add your worker URL.'
    );
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      intent: 'chat',
      message,
      history,
      context,
    }),
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

export async function analyzeImage(
  imageBase64: string,
  mimeType: string,
  intent: 'analyzeMedication' | 'analyzeRecord'
): Promise<Record<string, unknown>> {
  if (!API_URL) {
    throw new Error('EXPO_PUBLIC_AROHA_API_URL is not set.');
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ intent, image: imageBase64, mimeType }),
  });

  if (!res.ok) {
    throw new Error(`Analysis failed (${res.status}).`);
  }

  const data = await res.json();
  if (data.error) {
    throw new Error(data.error);
  }
  return data;
}
