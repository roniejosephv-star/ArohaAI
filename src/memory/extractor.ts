// Lightweight heuristic + Gemini-based fact extractor.
// For v1 we use simple pattern matching for common phrases,
// keeping it fast and offline-friendly. A full Gemini extraction
// endpoint can be added to the worker for deeper parsing.

export function extractFactsFromMessage(userMessage: string, reply: string): string[] {
  const facts: string[] = [];
  const lower = userMessage.toLowerCase();

  // Medication mentions
  const medMatch = lower.match(/(?:take|on|using)\s+(\w+\s?\w*)\s*(\d+\s*mg|mcg|g|ml)?/i);
  if (medMatch) {
    facts.push(`User mentioned medication: ${medMatch[0]}`);
  }

  // Condition mentions
  const conditionKeywords = ['diabetes', 'bp', 'blood pressure', 'sugar', 'thyroid',
    'arthritis', 'asthma', 'cholesterol', 'heart', 'bp', 'cough', 'fever', 'pain'];
  for (const keyword of conditionKeywords) {
    if (lower.includes(keyword)) {
      facts.push(`User mentioned condition/symptom: ${keyword}`);
      break;
    }
  }

  // Time/routine mentions
  const timeMatch = lower.match(/(\d{1,2})\s*:\s*(\d{2})\s*(am|pm)?/);
  if (timeMatch) {
    facts.push(`User mentioned time: ${timeMatch[0]}`);
  }

  return facts;
}

export function buildTimelineEvents(
  userMessage: string,
  reply: string
): Array<{ event: string; type: 'chat' | 'fact_learned' }> {
  const events: Array<{ event: string; type: 'chat' | 'fact_learned' }> = [];

  events.push({
    event: userMessage.slice(0, 120),
    type: 'chat',
  });

  const facts = extractFactsFromMessage(userMessage, reply);
  for (const fact of facts) {
    events.push({ event: fact, type: 'fact_learned' });
  }

  return events;
}
