export type TimelineEntry = {
  id?: number;
  date: string;
  type: 'chat' | 'medication' | 'symptom' | 'onboarding' | 'dose_completed' | 'fact_learned';
  event: string;
  metadata?: string;
};

export type MemoryFact = {
  fact: string;
  category: 'condition' | 'medication' | 'preference' | 'routine' | 'symptom' | 'other';
  source: string;
  timestamp: string;
};
