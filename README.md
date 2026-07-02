# Aroha AI — Your Personal Health Companion

[![Expo](https://img.shields.io/badge/Expo-52+-black)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.76-blue)](https://reactnative.dev)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020)](https://workers.cloudflare.com)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4)](https://deepmind.google.com/gemini)

**Aroha AI** is an Android health companion for elderly individuals managing multiple medications. It combines an AI chat with persistent memory, a daily schedule with reminders, camera-based medication capture, ABDM/health-record screenshot import, symptom photo logging, and one-tap doctor-visit summaries.

> Built for **FlowZint AI Hackathon 2026** — Open Innovation category. Android-first (iOS to follow).

**Positioning:** Aroha is a medication reminder + health-logging companion that helps elders remember, organize, and prepare for their doctor. It **advocates for the patient — it never overrides the doctor.** No diagnosis, no "your prescription is wrong."

---

## The Problem

- **153M Indians are 60+** (2025), doubling to **347M by 2050** — India is ageing fast¹
- **~40–50% of elderly** with chronic disease are non-adherent to their medications²
- **900M+ ABHA (ABDM) health accounts** already exist — records people can import today³
- **Scattered health records** — prescriptions, ABDM, and memory in different places
- Nothing is prepared when they finally see a doctor; complex apps exclude elderly users

## The Solution

Aroha AI gives every elder a single source of truth for their health:

### v1 — What we built (hackathon MVP)

| Feature | What It Does |
|---|---|
| **AI Chat + Memory** | Conversational companion that remembers your conditions, meds, and routine |
| **Camera → Medication** | Photo of a pill strip — AI reads it, you confirm, it's scheduled with a reminder |
| **ABDM / Record Import** | Upload a screenshot of your ABHA/health record — AI auto-fills your profile. *Import, not integration.* |
| **Daily Schedule** | Simple day view of medications, routines, appointments; one-tap complete + local reminders |
| **Doctor-Visit Summary** | One tap → symptoms + adherence + questions to ask your doctor |
| **Symptom Photo Log** | Photo of a rash/swelling — logged with timestamp for the next doctor visit |
| **Health Q&A** *(stretch)* | Ask about a remedy — general info + sources, always ending "confirm with your doctor" |

### Vision — where Aroha is going (roadmap, not built)

A health **advocate**: knows your full history, reviews a new prescription and hands you the right questions to raise with your doctor, reads a rash/symptom photo and advises whether and when to see one, turns a symptom into a likely cause and a next step. Always advocacy, never diagnosis — **the doctor decides.**

Plus **Google Sign-In with backup to your own Google Drive** (`appDataFolder`): sign in on a new phone and your history comes back — and the backup lives in *your* Drive, not our servers. Cross-device continuity with zero server-side storage of your health data.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Mobile** | React Native (Expo SDK 52+), Android-first |
| **Navigation** | Expo Router |
| **AI** | Google Gemini API (1.5 Flash — Vision + Text), one pipeline for pills + ABDM records |
| **Key proxy** | Cloudflare Worker holds the Gemini key server-side — never in the app |
| **Data** | On-device (AsyncStorage now, expo-sqlite for structured data); no cloud DB in MVP |
| **Auth** | None in MVP (single-device); accounts + cloud sync are roadmap |
| **Notifications** | expo-notifications (local reminders) |
| **Voice** *(stretch)* | expo-speech (TTS); STT if time allows |
| **Build** | `expo prebuild` → Android Studio (local Gradle APK) |

---

## Setup

```bash
git clone https://github.com/yourusername/ArohaAI
cd ArohaAI
npm install
```

Full step-by-step is in **SCAFFOLD_SETUP.md**. In short:

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com)
2. Deploy the key proxy (Cloudflare Worker):
   ```bash
   cd worker && npm install
   npx wrangler login
   npx wrangler secret put GEMINI_API_KEY   # paste your key
   npx wrangler deploy                       # prints your worker URL
   ```
3. Point the app at the worker:
   ```bash
   cd .. && npm install
   cp .env.example .env    # set EXPO_PUBLIC_AROHA_API_URL to your worker URL
   ```
4. Start the app:
   ```bash
   npx expo start
   ```
5. Build the Android APK locally:
   ```bash
   npx expo prebuild --platform android
   cd android && ./gradlew assembleDebug
   ```

---

## Project Structure

```
ArohaAI/
├── app/                    # Expo Router pages
│   └── (tabs)/             # Main app tabs (chat, …)
├── src/
│   └── lib/                # aroha.ts (worker client), storage.ts (on-device)
├── worker/                 # Cloudflare Worker — holds the Gemini key
├── assets/                 # Images, icons, fonts
├── PRD.md                  # Product Requirements Document
├── ARCHITECTURE.md         # System architecture
├── DEMO_SCRIPT.md          # Demo video script
├── PITCH_DECK.md           # Pitch presentation
├── JUDGE_QA.md             # Anticipated judge questions
└── SUBMISSION_CHECKLIST.md # Pre-submission checklist
```

---

## Key Screens

| Screen | Description |
|---|---|
| **Chat** | Home screen — AI conversation with today's schedule |
| **Schedule** | Day view with events, one-tap complete, reminders (daily recurrence in v1) |
| **Add Medication** | Camera capture → Gemini Vision → editable auto-filled form → confirm |
| **Import Records** | Screenshot upload → Gemini Vision → editable profile fields → confirm |
| **Symptom Log** | Camera/gallery → AI describes → timestamped log |
| **Health Profile** | Conditions, medications, doctors, memory (accessible from menu) |
| **Doctor Summary** | One-tap pre-visit report: symptoms + adherence + questions |
| **Settings** | Notifications, language; Smart Mode (stretch) |

---

## Data Sources

¹ [UNFPA India Ageing Report](https://india.unfpa.org/en/news/india-ageing-elderly-make-20-population-2050-unfpa-report) — 153M elderly (2025) → 347M (2050).
² [WHO SAGE2 adherence study, India](https://pmc.ncbi.nlm.nih.gov/articles/PMC10603298/) — ~51% average adherence; urban study 41.5% non-adherence.
³ [Press Information Bureau](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266979&reg=3&lang=1) — 90 crore (~900M) ABHA accounts (2026).

## License

MIT
