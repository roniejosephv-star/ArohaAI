# Aroha AI — Judge Q&A Preparation

> Anticipated questions from hackathon judges, with prepared answers.
> These cover the judging criteria, technical depth, business viability, and edge cases.

---

## Product & Problem

### Q1: How is this different from Apple Health or Google Fit?

**A**: Those are fitness dashboards that track steps, heart rate, and sleep. Aroha is a conversational health companion. Key differences:

1. **Chat-first interface** — not a dashboard. Users talk to Aroha naturally
2. **Medication management** — Apple Health doesn't read a pill strip and schedule it
3. **Camera + screenshot input** — photograph a prescription OR upload an ABDM record; one Vision pipeline reads both
4. **Doctor-visit prep** — one tap turns your history into a summary to take to your doctor
5. **Persistent memory** — Aroha remembers everything about the user across sessions

Apple Health shows you data. Aroha *talks* to you, *reads* your medications and records, and *prepares* you for your doctor.

### Q2: How do you ensure medical accuracy?

**A**: Aroha is positioned as a **reminder and logging companion, not a medical-advice engine** — and that positioning is itself the primary safety layer. On top of it:

1. **Scope limits** — Aroha does not diagnose, prescribe, or claim drug interactions. Its job is to remember, remind, log symptoms, and prepare notes for the doctor.
2. **System prompts** — for any health-info question, it surfaces general information, cites the source, and hard-codes "I'm not a doctor — confirm with yours" into the response.
3. **Doctor hand-off** — the app generates pre-visit summaries so the real decision stays with a clinician.

We deliberately cut the drug-interaction engine rather than ship a version that could confidently state a wrong interaction to an elderly user. That's a safety decision, not a missing feature.

### Q3: What if Gemini gives wrong information?

**A**: We contain the blast radius by limiting what Aroha is allowed to do:
1. **No high-stakes claims** — it doesn't diagnose, prescribe, or assert drug interactions, so a wrong answer can't become a dangerous instruction.
2. **Disclaimer first** — every health-related response leads and ends with "I'm not a doctor — confirm with yours."
3. **Confirm-before-save** — Vision-parsed meds/records are always shown for user review before anything is stored; the AI never silently writes data.
4. **Guardrails** — the system prompt blocks diagnosing and prescribing.
5. **User feedback** — thumbs up/down to flag bad responses.

The core utility — reminders, schedule, symptom logging — doesn't depend on the model being medically correct at all. That's by design.

---

## Technical

### Q4: How does the camera → medication feature work?

**A**: Three steps, under 5 seconds:

1. User takes a photo of a pill strip/bottle using `expo-camera`
2. Image is sent to our **Cloudflare Worker** (which holds the Gemini key), which calls **Gemini Vision 1.5 Flash**
3. Gemini extracts: medication name, dosage, frequency, timing, and special instructions

The structured data is returned to the app, the user **confirms or edits** it, and it's saved **on-device**. Schedule entries are auto-generated and local notifications are created. The same Vision pipeline powers screenshot import (Q4b) — one pipeline, three entry points.

### Q4b: Do you integrate with ABDM / ABHA?

**A**: Not via the ABDM API — and that's a deliberate, honest choice. Real ABDM integration requires HIP/HIU registration, Consent Manager onboarding, and sandbox approval — weeks of process that doesn't fit a hackathon, and more importantly isn't needed to deliver value today.

Instead, Aroha lets users **import their existing ABDM/ABHA records by uploading a screenshot.** The same Gemini Vision pipeline parses conditions, medications, and history and pre-fills the Health Profile (accessible from the menu). Users can also enter data manually or by voice.

So the honest framing is: **import, not integration.** It works on day one with zero ABDM onboarding. Native ABDM linking via the Consent Manager is our roadmap item — the screenshot importer proves the parsing works, and API linking just changes the source.

### Q5: How does the persistent memory work?

**A**: This is the core of the product — the **Health Memory Layer**, three on-device stages:

1. **Memory Extractor** — after each interaction (chat, med capture, ABHA import, symptom log, dose completion), pull out structured facts and events.
2. **Health Timeline** — an append-only, dated log of those events, stored on-device (expo-sqlite).
3. **Context Builder** — before each Gemini call, assemble the profile + the relevant recent timeline entries into the prompt.

So Gemini reasons over accumulated memory, not a single message — every interaction becomes memory, memory becomes context, context becomes personalization. That orchestration is the innovation; the individual model calls are commodity. All on-device, no cloud DB, and a rolling-summary compression for very long histories is a roadmap optimization.

### Q6: How do you handle offline?

**A**: Strong here, because data is **on-device by design**. Your schedule, medications, and profile are stored on the phone (AsyncStorage/expo-sqlite), so viewing *and editing* them works fully offline — no network needed. Only the AI calls (chat, camera, ABDM import) need internet, since those hit the Worker → Gemini. Cloud sync across devices is roadmap, not MVP.

### Q7: What's the tech stack and why?

**A**:
- **React Native (Expo 52), Android-first** — one codebase, iOS to follow; local APK via `expo prebuild` + Android Studio (no EAS dependency for the demo)
- **Cloudflare Worker** — a ~30-line serverless proxy that holds the Gemini key. Free tier, no billing card, deploys in minutes. Keeps the key off the device and out of the public repo.
- **On-device storage** (AsyncStorage / expo-sqlite) — no cloud DB in the MVP; data stays on the phone, which also makes offline real
- **Gemini 1.5 Flash** — fastest multimodal model, generous free tier, Vision + Text; **one pipeline reads both pill strips and ABDM records**
- **expo-notifications** — local reminders; **expo-speech** — TTS for Smart Mode (stretch)

Deliberately minimal: one tiny server (just for the key) and everything else on-device — the least infrastructure that keeps the key safe, ideal for a solo builder shipping in ~2 weeks.

### Q8: How is the app structured?

**A**: Expo Router for file-based navigation:
- `(auth)/` — Login and signup screens
- `(tabs)/chat/` — Main chat screen with today's schedule
- `(tabs)/schedule/` — Day list of events (month grid = stretch)
- `(modals)/add-event/` — Add/edit event form
- `(modals)/add-medication/` — Camera → medication flow
- `(modals)/import-records/` — ABDM/record screenshot → profile
- `profile/` — Health profile (incl. ABDM-imported data), medications list, memory settings
- `settings/` — notifications, language; Smart Mode toggle (stretch)

---

## Business & Scalability

### Q9: Who is your target user?

**A**: Primary: Seniors 60+ managing 3+ daily medications. Secondary: Their adult children who are the actual buyers. Tertiary: HR departments and pharma companies for B2B.

Key insight: the end user (elderly person) may not pay, but their children will. The app is designed to be set up by a family member and used daily by the senior.

### Q10: What's the business model?

**A**: Three-tier:
*(Pricing below is illustrative — a planning assumption, not validated pricing.)*
1. **B2C Freemium** — Basic tracking free (schedule, medications list, reminders). Premium ~₹99/month (AI chat, camera capture, ABDM import, doctor summaries; caregiver dashboard when it ships)
2. **B2B Corporate** — ~₹50/employee/month. Companies offer Aroha as an employee parent benefit. *(Roadmap — requires the caregiver/admin dashboard.)*
3. **Pharma** — ~₹10/patient/month. Patient adherence programs. *(Roadmap.)*

### Q11: How do you acquire users?

**A**: 
- **B2C**: Adult children search "app to help parents manage medications" → App Store → set up for parents via QR code
- **B2B**: HR conferences, corporate wellness partnerships, employee benefits brokers
- **Pharma**: Direct sales to pharma companies with existing patient programs
- **Referral**: "Invite a caregiver" feature creates viral loop within families

### Q12: How big is the market?

**A**: India alone has **153 million people aged 60+ (2025), doubling to 347 million by 2050** ([UNFPA](https://india.unfpa.org/en/news/india-ageing-elderly-make-20-population-2050-unfpa-report)). The **India geriatric healthcare market was ~USD 42.2B in 2024, projected to ~USD 97.3B by 2033** at ~9% CAGR ([IMARC](https://www.imarcgroup.com/india-geriatric-healthcare-market)). And **900M+ ABHA/ABDM health accounts already exist** ([PIB](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2266979&reg=3&lang=1)) — a ready base of importable digital health records unique to our approach. India is our beachhead; the expansion runway is Asia-Pacific, which already holds **722M people aged 60+ (2024), heading to ~1.3B by 2050** — ~60% of the world's older persons ([UN ESCAP](https://www.unescap.org/sites/default/files/SDD%20Ageing%20Fact%20Sheet%20Overview.pdf)). We lead with India because that's where ABDM — and our import feature — actually works today. (Figures sourced; earlier "$50B / 600M APAC" claims were unverified and have been replaced.)

---

## Competition

### Q13: Who are your competitors?

**A**: Three categories:

1. **Medication reminder apps** (Medisafe, MyTherapy, CareClinic) — Basic reminders, no AI, no verification, no memory
2. **Health chatbots** (Ada, Buoy Health, Babylon) — Symptom checkers, not medication managers, no calendar, no camera
3. **Elder care platforms** (ElderAid, Samvedna, Kraya) — Human-led services (nurses, calls), expensive, not AI-native

**Aroha's advantage**: We're the first to combine AI chat + medication management + camera input + health verification + persistent memory in one app. No one does all five.

### Q14: What's your moat?

**A**: 
1. **Data network effects** — As users import records and log symptoms, Aroha gets better at parsing messy real-world prescriptions and records. More users = more accurate extraction
2. **Persistent memory** — The longer a user stays, the more Aroha knows them. High switching cost
3. **B2B relationships** — Enterprise contracts create lock-in (HR systems integration, employee data)
4. **Regulatory** — Health data is highly regulated. First-mover advantage in compliance

---

## Hackathon-Specific

### Q15: What's the most impressive thing in your demo?

**A**: Two moments, both powered by the same Vision pipeline:

1. **Camera → medication** — "Take a photo of this pill strip. In 5 seconds, Aroha reads it as Metformin 500mg, twice daily after meals, adds it to the calendar, and sets a reminder. That's multimodal AI solving a real daily problem."

2. **ABDM record → instant profile** — "Upload a screenshot of your ABHA health record. Aroha reads your conditions and medications and fills your whole health profile in seconds — no typing, no ABDM integration, no waiting. A senior is set up in under a minute." (This is the differentiator no team-of-four chatbot will have.)

### Q16: How much of this is built vs mock/prototype?

**A**: For the demo video, all flows shown work end-to-end with real data:
- Real Gemini API calls (via the Worker) for camera analysis, ABDM import, and chat
- Real on-device persistence (AsyncStorage/expo-sqlite)
- Real local notifications via expo-notifications
- Voice (TTS) if the stretch feature is completed

The app is running as an installed APK on a real Android device during the demo.

### Q17: What would you build if you had 3 more months?

**A**: 
0. Google Sign-In + backup/restore to the user's own Google Drive (`appDataFolder`) — cross-device continuity with zero server-side storage of health data
1. Hindi and regional language support (multimodal — text + voice)
2. Pharmacy delivery API integration (order refills from the app)
3. Lab report OCR (upload reports, AI extracts values, tracks changes over time)
4. Telemedicine integration (book doctor appointments within the app)
5. Apple Health / Google Fit sync (correlate step count, heart rate with medication adherence)
6. HIPAA compliance and enterprise security audit

---

## Edge Cases & Challenges

### Q18: What if the user takes the wrong photo? (blurry, wrong angle)

**A**: Three mitigations:
1. In-app guidance — overlay frame showing ideal positioning
2. Gemini Vision handles partially blurry images — still extracts what it can
3. Fallback — user can manually type the medication name if AI fails
4. Confirmation step — user reviews AI's extraction before saving

### Q19: How do you handle users with no internet?

**A**: Viewing works offline via Firestore's default read cache — the last-loaded schedule and medication list are visible with no connection, behind an offline banner. AI features (chat, camera, ABDM import) require internet. Offline *writes* (marking items complete while offline, then syncing) are a roadmap item — we don't claim it for v1.

### Q20: What stops someone from sharing health data inappropriately?

**A**: In the MVP, health data never leaves the device — there's no shared cloud store to leak from. When cloud sync ships (roadmap), it'll use authenticated, user-isolated storage. We follow data minimization throughout — only the minimum data needed for each feature.

### Q20b: You send health-record screenshots and medical data to Google's Gemini. What about privacy?

**A**: Fair concern, and we're upfront about it. For this build:
1. **Data stays on-device** — health records, meds, and symptoms live only on the phone. The only thing sent to Google is the specific text/image needed for a single inference; nothing is stored in a cloud DB of ours.
2. **Processing, not training** — prompts/images go to the Gemini API for inference only; we use tier terms where data isn't used to train models.
3. **Key never on the device** — the Gemini key lives only in the Cloudflare Worker (as a secret); the app and the public repo never contain it.
4. **Roadmap** — an on-device / India-hosted model for PHI, and full ABDM Consent-Manager flows, are the next privacy steps.

We don't overclaim compliance — we're a prototype. But "data stays on the device, key stays on the server" is a genuinely strong privacy posture, not a retrofit.

### Q21: How do you prevent notification fatigue?

**A**: Three strategies:
1. **User-configurable** — each event has independent notification toggle
2. **Reminder style** — user selects "gentle" (1 reminder), "firm" (2 reminders), or "minimal" (only critical meds)
3. **Smart grouping** — notifications for adjacent items are combined ("You have 3 items due between 8-9 AM")
4. **Streak-based** — if user has a strong streak, notifications reduce (they don't need them)
