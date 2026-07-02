# Aroha AI — Pitch Deck

> Slide-by-slide content for investor/judge presentation.
> Each slide = ~30 seconds.

---

## Slide 1: Title

```
┌─────────────────────────────────────────┐
│                                         │
│           AROHA AI                       │
│     Your personal health companion       │
│                                         │
│     Growth • Care • Trust               │
│                                         │
│     ──────────────────────────────       │
│     FlowZint AI Hackathon 2026          │
│     Open Innovation Category            │
│                                         │
│     [Your Name]                         │
│     [Your Title / Background]           │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "This is Aroha AI — a personal health companion for the 153 million seniors in India managing multiple medications, a number set to double by 2050."

---

## Slide 2: The Problem

```
┌─────────────────────────────────────────┐
│  THE PROBLEM                             │
│                                         │
│  🏥 153M Indians 60+ (→347M by 2050)    │
│  💊 ~40–50% non-adherent (chronic)      │
│  🗂️ 900M+ ABHA records — sitting unused │
│  📱 Health apps are too complex         │
│                                         │
│  "My mother takes 5 medications daily.  │
│   Her records are in 4 places and she   │
│   forgets what to tell her doctor."     │
│                                         │
│  → Fragmented health data               │
│  → Missed & mistimed doses              │
│  → Nothing prepared for doctor visits   │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "India has 153 million people over 60 today — doubling to 347 million by 2050. Nearly half of elderly patients with chronic disease don't take their medications correctly. And here's the twist: over 900 million ABHA digital health records already exist — but that data just sits there, scattered across prescriptions, ABDM, and memory. When these patients finally see a doctor, they can't remember what happened. The apps meant to help are too complex for the people who need them most."

> Sources: [UNFPA](https://india.unfpa.org/en/news/india-ageing-elderly-make-20-population-2050-unfpa-report) (population) · [WHO SAGE2](https://pmc.ncbi.nlm.nih.gov/articles/PMC10603298/) (adherence) · [PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266979&reg=3&lang=1) (ABHA).

---

## Slide 3: The Solution

```
┌─────────────────────────────────────────┐
│  THE SOLUTION                            │
│                                         │
│  AROHA AI — A SINGLE SOURCE OF TRUTH    │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  📸 Photo a pill → auto-scheduled│   │
│  │  🗂️ Screenshot ABDM → profile    │   │
│  │  💬 Chat that remembers you      │   │
│  │  📅 Daily schedule + reminders   │   │
│  │  🩺 One-tap doctor-visit summary │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Chat-first + big-text UI for seniors   │
│  One app. Every day. Everything.        │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Aroha is a single source of truth. Photograph a pill strip and it's on the calendar with a reminder. Screenshot your ABDM health record and your whole profile fills in — no typing. Chat with Aroha and it remembers everything about you. And with one tap, it prepares a summary for your doctor. Built chat-first, with big text, for people who find other apps too hard."

---

## Slide 4: Key Features (v1 — what we built)

```
┌─────────────────────────────────────────┐
│  KEY FEATURES                            │
│                                         │
│  📸 CAMERA → MEDICATION                 │
│  Photo a pill strip → AI reads it →     │
│  scheduled with a reminder              │
│                                         │
│  🗂️ ABDM/RECORD IMPORT                  │
│  Screenshot your ABHA record → profile  │
│  auto-fills. Import, not integration.   │
│                                         │
│  🧠 CHAT + PERSISTENT MEMORY            │
│  Remembers your conditions, meds,       │
│  routine. Gets to know you.             │
│                                         │
│  📅 SCHEDULE + REMINDERS                │
│  Daily plan, one-tap complete,          │
│  local notifications                    │
│                                         │
│  🩺 DOCTOR-VISIT SUMMARY                │
│  One tap → symptoms + adherence +       │
│  questions to ask your doctor           │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Five things Aroha does today. One: photograph a pill strip and it's read, scheduled, and reminded. Two — and this is unique — screenshot your ABDM health record and your entire profile fills in; import, not a months-long integration. Three: chat with persistent memory, so Aroha actually knows you. Four: a simple daily schedule with reminders. Five: one tap generates a summary to take to your doctor. Two of these run on the same Gemini Vision pipeline — that's the technical depth."

---

## Slide 5: Technology

```
┌─────────────────────────────────────────┐
│  TECHNOLOGY                              │
│                                         │
│  ┌──────────┐  ┌────────────────────┐  │
│  │ MOBILE    │  │  AI                │  │
│  │ React     │  │  Google Gemini     │  │
│  │ Native    │  │  1.5 Flash         │  │
│  │ (Expo)    │  │  Vision + Text     │  │
│  └──────────┘  └────────────────────┘  │
│                                         │
│  ┌──────────┐  ┌────────────────────┐  │
│  │ BACKEND   │  │  KEY DEPTH         │  │
│  │ Firebase  │  │  ONE Vision        │  │
│  │ Auth,     │  │  pipeline →        │  │
│  │ Firestore,│  │  pills + ABDM      │  │
│  │ Functions │  │  records           │  │
│  └──────────┘  └────────────────────┘  │
│                                         │
│  Android-first (iOS to follow)          │
│  Serverless — zero ops · key stays      │
│  server-side, never in the client       │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Built on React Native with Expo, Android-first with a local build we can install and demo. Google Gemini 1.5 Flash powers the AI — one Vision pipeline reads both pill strips and ABDM record screenshots. Firebase handles auth, real-time data, and reminders. The Gemini key lives server-side in a Cloud Function, never in the app. Serverless means zero ops for a solo builder shipping in 17 days."

---

## Slide 6: Market & Business Model

```
┌─────────────────────────────────────────┐
│  MARKET & BUSINESS MODEL                 │
│                                         │
│  India geriatric healthcare:            │
│  ~$42.2B (2024) → ~$97.3B (2033)        │
│                                         │
│  ┌─ B2C (now) ────────────────────┐    │
│  │  Freemium → Premium (~₹99/mo)*  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─ B2B (roadmap) ────────────────┐    │
│  │  Corporate elder-care benefit   │    │
│  │  (~₹50/employee/mo)*            │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─ PHARMA (roadmap) ─────────────┐    │
│  │  Patient adherence (~₹10/pt/mo)*│    │
│  └─────────────────────────────────┘    │
│                                         │
│  *illustrative pricing (assumption)     │
│  GTM: B2C now → B2B → Pharma            │
│                                         │
│  Upside: 722M Asia-Pacific seniors      │
│  (2024) → ~1.3B by 2050 = expansion     │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "The India geriatric healthcare market was about 42 billion dollars in 2024, on track to roughly 97 billion by 2033. We start B2C with a freemium model — the pricing here is an illustrative assumption, not validated. Our scale path is B2B: companies offering Aroha as an employee parent benefit, then pharma adherence programs; those tiers are roadmap. India is the beachhead — but the same ageing wave is hitting all of Asia-Pacific, already home to 722 million people over 60 and headed for 1.3 billion by 2050. That's our expansion runway."

> Sources: [IMARC — India geriatric healthcare market](https://www.imarcgroup.com/india-geriatric-healthcare-market) · [UN ESCAP — Asia-Pacific ageing](https://www.unescap.org/sites/default/files/SDD%20Ageing%20Fact%20Sheet%20Overview.pdf).

---

## Slide 7: The Vision (north star)

```
┌─────────────────────────────────────────┐
│  WHERE AROHA IS GOING                    │
│                                         │
│  From companion → to health ADVOCATE    │
│  (advocates for you — never overrides   │
│   your doctor)                          │
│                                         │
│  🧠 Knows your full history & routine   │
│  🔎 Reviews a new prescription and       │
│     surfaces questions to ASK your doc  │
│  📷 Reads a rash/symptom photo → tells   │
│     you WHEN & WHETHER to see a doctor  │
│  🧭 Symptom → likely cause → next action │
│                                         │
│  Aroha prepares the patient.            │
│  The doctor still decides.              │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Today Aroha remembers and reminds. The vision is a health advocate — one that knows your whole history, looks at a new prescription and hands you the right questions to ask your doctor, reads a photo of a rash and tells you whether and when to get it seen, turns a symptom into a likely cause and a next step. Note the boundary: Aroha never tells you your doctor is wrong or to stop a medicine. It advocates for you and prepares you — the doctor decides. That boundary is what makes it safe to build."

---

## Slide 8: Roadmap

```
┌─────────────────────────────────────────┐
│  ROADMAP                                 │
│                                         │
│  JUL 2026 (v1 — shipped)                │
│  ├── Camera → medication + reminders    │
│  ├── ABDM/record screenshot import      │
│  ├── Chat + persistent memory           │
│  └── Doctor-visit summary               │
│                                         │
│  SEP 2026 (V2)                          │
│  ├── Google Sign-In + backup to YOUR    │
│  │   Google Drive (we store nothing)    │
│  ├── Voice / Smart Mode                 │
│  ├── Hindi / Hinglish support           │
│  └── Prescription-review advocate (beta)│
│                                         │
│  DEC 2026 (V3)                          │
│  ├── Rash/symptom photo → action guide  │
│  ├── Native ABDM (Consent Manager)      │
│  ├── Caregiver dashboard                │
│  └── B2B corporate + pharma rollout     │
│                                         │
│  2027 → APAC expansion (722M→1.3B 60+)  │
│         · formal compliance             │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "v1 shipped this month: camera-to-medication, ABDM import, chat with memory, doctor summaries. V2 adds voice, Hindi, and the first prescription-review advocate in beta. V3 brings symptom-photo guidance, native ABDM linking, the caregiver dashboard, and B2B. 2027 is APAC scale and formal compliance."

---

## Slide 9: Why We'll Win

```
┌─────────────────────────────────────────┐
│  WHY AROHA AI WINS                       │
│                                         │
│  🏆 SOLVES A REAL PROBLEM               │
│  Medication errors + scattered records  │
│                                         │
│  🏆 MULTIMODAL DEPTH                     │
│  One Vision pipeline → pills AND ABDM   │
│  records. Chat + memory + schedule.     │
│                                         │
│  🏆 EMOTIONAL HOOK                      │
│  Everyone has aging parents             │
│                                         │
│  🏆 RESPONSIBLE BY DESIGN               │
│  Advocates, never overrides the doctor. │
│  Judges notice who takes safety seriously│
│                                         │
│  🏆 SCALABLE                            │
│  One user → Enterprise → Pharma         │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Five reasons we win. Real problem — medication errors and scattered records. Multimodal depth — one Vision pipeline reading both pills and ABDM records, plus chat, memory, and schedule. Emotional connection — everyone has aging parents. Responsible by design — Aroha advocates for the patient but never overrides the doctor, and judges notice who takes that seriously. And scalable from one user to enterprise. We hit every criterion — and we do it without pretending an AI should replace a physician."

---

## Slide 10: Thank You

```
┌─────────────────────────────────────────┐
│                                         │
│           AROHA AI                       │
│     Your personal health companion       │
│                                         │
│     Growth • Care • Trust               │
│                                         │
│     ──────────────────────────────       │
│                                         │
│     [Your Name]                         │
│     [Email]                             │
│     [GitHub]                            │
│     [LinkedIn]                          │
│                                         │
│     "Built for my mother.               │
│      Designed for everyone."            │
│                                         │
│     Live demo: [link]                   │
│     GitHub: [link]                      │
│                                         │
└─────────────────────────────────────────┘
```

**Script**: "Aroha AI — built for my mother, designed for everyone. Thank you."
