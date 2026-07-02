# Aroha AI — Product Requirements Document

## 1. Product Overview

| Field | Value |
|---|---|
| **Product Name** | Aroha AI |
| **Agent Name** | Aroha (the AI persona) |
| **Tagline** | *Your personal health companion* |
| **Hackathon** | FlowZint AI Hackathon 2026 — Open Innovation |
| **Platform** | Android-first (React Native / Expo), iOS to follow |
| **Timeline** | July 2 – July 19, 2026 (17 days) |
| **Builder** | Solo |
| **Core Concept** | A conversational AI that lives alongside a daily health schedule — reading medications and ABDM records via camera/screenshot, logging symptoms, and preparing doctor visits — all with persistent memory that grows with the user. |
| **Positioning** | Reminder + logging + doctor-prep companion. **Advocates for the patient, never overrides the doctor.** No diagnosis, no prescribing, no "your medicine is wrong." |

## 2. Problem Statement

### The Problem

| Issue | Impact |
|---|---|
| Ageing population | 153M Indians are 60+ (2025), doubling to 347M by 2050¹ |
| Medication mismanagement | ~40–50% of elderly with chronic disease are non-adherent² |
| Scattered records | 900M+ ABHA accounts exist³ but data sits unused across prescriptions, ABDM, and memory |
| Complex apps | Elderly users excluded by small text, confusing navigation |
| Unprepared visits | Nothing organized to hand the doctor at appointment time |

### The Solution

**Aroha AI**: An interactive AI chat with an integrated daily schedule. The user talks to Aroha, Aroha reads medications (pill photo) and health records (ABDM screenshot) into a single profile, manages the schedule with reminders, logs symptom photos, prepares doctor-visit summaries, and remembers everything — building a lifelong health companion. It **advocates for the patient; it never overrides the doctor.**

> ¹ [UNFPA India Ageing Report](https://india.unfpa.org/en/news/india-ageing-elderly-make-20-population-2050-unfpa-report) · ² [WHO SAGE2 study](https://pmc.ncbi.nlm.nih.gov/articles/PMC10603298/) · ³ [PIB — 90 crore ABHA](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266979&reg=3&lang=1)

## 3. Target Users

### Primary: Elderly individuals (60+) managing health independently
- Lives alone or with family
- Takes 3+ daily medications
- Has 1+ chronic conditions (BP, diabetes, arthritis, thyroid)
- Consults 1+ doctors regularly
- Moderate to low tech literacy

### Secondary: Caregivers / Adult Children *(roadmap — served after MVP)*
- Monitor adherence from their own device
- Receive alerts for missed critical medications
- View health trends over time

### Tertiary: Enterprises (B2B) *(roadmap)*
- HR departments offering elder care benefits
- Pharma companies needing patient adherence programs
- Insurance companies offering wellness incentives

## 4. User Stories

### Onboarding
```
US-01: [ROADMAP] As a new user, I want an account so my data syncs across devices.
       (MVP has no login — data is private by staying on the single device.)
US-02: As a new user, I want to tell Aroha about my conditions, medications,
       and daily routine so it can personalize everything.
US-03: [ROADMAP] As a user, I want to add my caregiver (family member) so they
       can monitor my adherence. (Not in v1 — see §5b.)
```

### Medications
```
US-04: As a user, I want to add medications by taking a photo of the
       prescription so I don't have to type everything.
US-05: As a user, I want to view all my medications with dosage and timing.
US-06: As a user, I want Aroha to automatically create schedule entries
       from my medications.
US-07: As a user, I want to mark medications as completed with one tap.
```

### Daily Schedule
```
US-08: As a user, I want to see today's schedule in a calendar view so I
       know what to do and when.
US-09: As a user, I want to add custom events (exercise, appointments,
       meals) to my schedule.
US-10: As a user, I want events to repeat on specific days (e.g., Mon/Wed/Fri
       or every weekend).
US-11: As a user, I want notifications for upcoming events.
US-12: [STRETCH] As a user, I want a month view to see my schedule at a glance.
       (v1 ships a simple day list; month grid is stretch.)
```

### AI Chat
```
US-13: As a user, I want to chat with Aroha naturally about my health.
US-14: As a user, I want Aroha to remember our past conversations and
       my health details.
US-15: As a user, I want Aroha to check in with me daily.
US-16: As a user, I want Aroha to celebrate my adherence streaks.
```

### Health Verification
```
US-17: As a user, I want to ask Aroha about a health claim (remedy, medicine,
       diet) and get a sourced, verified response.
US-18: As a user, I want Aroha to automatically check if a new substance
       interacts with my current medications.
```

### Symptoms
```
US-19: As a user, I want to log symptoms by taking a photo so I can show
       my doctor later.
US-20: As a user, I want to see my symptom history over time.
```

### Smart Mode (Voice)
```
US-21: As a user, I want to speak to Aroha instead of typing.
US-22: As a user, I want Aroha to respond with voice.
```

### Caregiver (ROADMAP — not built in v1)
```
US-23: As a caregiver, I want to see the user's adherence summary.
US-24: As a caregiver, I want to receive alerts for missed critical meds.
```

## 5. Features

> Priority tiers map to BUILD_PLAN.md. **CORE** must demo; **P1** strong-to-have; **STRETCH** only if ahead. Cut from the bottom, never the top.

### CORE — Must demo (MVP)

| ID | Feature | Description |
|---|---|---|
| F-01 | AI Chat | Conversational UI with chat history, Aroha personality |
| F-02 | Persistent Memory | Remembers user details, medications, conversations across sessions |
| F-06 | Camera → Medication (HERO) | Capture photo → Gemini Vision reads → editable auto-filled form → confirm → scheduled |
| F-07 | ABDM / Record Import | Upload ABHA/record screenshot → same Vision pipeline auto-fills profile. Import, not integration. |
| F-03 | Daily Schedule | Day view of events; add/edit/delete; one-tap complete |
| F-05 | Local Notifications | Reminders for scheduled events (expo-notifications) |
| F-11 | Auth | Email/password (Google sign-in = stretch) |

### P1 — Strong to have

| ID | Feature | Description |
|---|---|---|
| F-10 | Onboarding | Step-by-step setup: profile, conditions, medications, routine |
| F-08 | Symptom Photo Log | Take/upload photo → AI describes → logs with timestamp |
| F-15 | Doctor Visit Summary | Auto-generated report (symptoms, adherence, questions to ask) |
| F-14 | Streak Tracking | Daily adherence streak with celebration messages |

### STRETCH — Only if ahead of schedule

| ID | Feature | Description |
|---|---|---|
| F-12 | Smart Mode (Voice) | TTS first (expo-speech); STT only if solid |
| F-04 | Advanced Recurrence | Beyond daily: weekdays, custom days, date range |
| F-09b | Health Q&A | General info + sources, always "confirm with your doctor." **No interaction claims.** |
| F-16 | Medication Refill Alert | Based on dosage + pill count |

### CUT from v1 → moved to Vision/Roadmap (see §5b)

Drug-interaction engine · Caregiver dashboard · Prescription-review advocate · Rash/symptom → action guide · these are the **north-star vision**, not hackathon-build claims.

## 5b. Vision — Aroha as Health Advocate (roadmap, NOT built for v1)

The north star: Aroha evolves from a companion that *remembers and reminds* into a health **advocate** that knows the user deeply and helps them navigate the medical system. Critically, every capability below is framed as **advocacy, not diagnosis** — Aroha surfaces concerns and prepares the patient; a licensed doctor always decides.

| Vision capability | Safe framing (the only acceptable framing) | Target |
|---|---|---|
| Prescription review | "I noticed X about this prescription — worth asking Dr. ___ about." **Never** "this is wrong / stop taking it." | V2 beta |
| Medicine appropriateness | Flags questions to raise with the doctor, given known conditions. Never a verdict. | V2 |
| Rash / symptom photo analysis | Describes what it sees + advises **whether and when to see a doctor**. Never a diagnosis. | V3 |
| Symptom → likely cause → action | General guidance + "see a doctor if…" thresholds, with sources. | V3 |

**Why this framing is non-negotiable:** an AI telling an elderly user their prescription is "bad" or to doubt a prescribed medicine is a safety hazard and a legal liability, and it signals *poor* judgment to expert judges. The advocacy framing keeps the ambition while staying safe — and demonstrates responsibility, which is itself a differentiator.

### Cloud continuity (roadmap)

**Google Sign-In + backup/restore to the user's own Google Drive (`appDataFolder`).** A JSON snapshot of the user's data is written to their *own* Drive; signing in on a new device restores it. Aroha runs no backend database and stores none of the user's health data — the backup lives in the user's Drive. This extends the "we store nothing" privacy posture to cross-device use. Not built in v1 (adds Android OAuth complexity); featured as roadmap.

## 6. User Flow

```
App Launch → Auth (Sign Up / Log In)
    │
    ▼
Onboarding:
    ├── Name, Age, Gender
    ├── Medical Conditions (select + custom)
    ├── Current Medications (camera / search / manual)
    ├── Daily Routine (wake, meals, sleep)
    └── [ROADMAP] Caregiver (optional: name, phone) — not in v1
    │
    ▼
Main Screen (Chat):
    ┌─────────────────────────────────────┐
    │  ☰ Aroha AI                         │
    │  ──────────────────────────────      │
    │  📅 Today — 4 of 7 completed         │
    │  8:00 ☐ BP Tablet                   │
    │  9:00 ☑ Breakfast                   │
    │  10:00 ☐ Knee exercises             │
    │                                     │
    │  Aroha: Good morning! You've done   │
    │  4 of 7 today. How are your knees?  │
    │                                     │
    │  You: Still a bit stiff             │
    │                                     │
    │  Aroha: Let me log that. Want to    │
    │  take a photo to show your doctor? │
    │                                     │
    │  ┌────────────────────────────┐     │
    │  │ Type a message...  📷  🎤  │     │
    │  └────────────────────────────┘     │
    └─────────────────────────────────────┘
    │
    ▼ (tap ☰ menu)
Schedule View (v1):
    ├── Day list (all events with time, type, notification status)
    ├── + Add Event (modal form; daily recurrence in v1)
    └── [STRETCH] Month grid + advanced recurrence (weekdays/custom/date range)
```

## 7. Non-Functional Requirements

| Category | Requirement |
|---|---|
| **Performance** | AI responses < 3s (Gemini 1.5 Flash target) |
| **Offline** | Data lives on-device (AsyncStorage/expo-sqlite), so the schedule/meds/profile work offline by default. Only AI calls need internet. |
| **Security** | Gemini API key lives only in the Cloudflare Worker (as a secret), never in the app or repo |
| **Privacy** | Health data stays on the device — it never leaves the phone except the specific text/image sent to Gemini for a single inference |
| **Accessibility** | Minimum 18px font, high contrast, large touch targets (44pt minimum) |
| **Platform** | Android-first (Android 8+); iOS to follow |

## 8. Success Metrics (Hackathon Judging)

| Criteria | How Aroha AI Addresses It |
|---|---|
| **Innovation & Creativity** | One Gemini Vision pipeline powering BOTH pill capture and ABDM record import — no chatbot competitor has this |
| **Real-World Problem Solving** | Medication errors + scattered records + unprepared doctor visits — concrete, measurable |
| **AI Automation** | Gemini Vision + persistent memory + context-aware prompting + auto-generated doctor summaries |
| **User Experience** | Chat-first, large text, one-tap interactions, big touch targets for seniors |
| **Scalability & Responsibility** | B2C → caregiver network → pharma/insurance B2B; advocate-not-override safety framing |
