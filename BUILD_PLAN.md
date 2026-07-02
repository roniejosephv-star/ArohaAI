# Aroha AI — Build Plan (Android-First, Vibecoding)

**Window (re-baselined):** Build starts **Jul 3** (first 2 days went to planning/docs). Submit **Jul 19**.
**Recovery plan:** the 2 planning days are recovered by (a) extended dev sessions, (b) efficiency cuts (no summarizer, reuse one Vision pipeline), (c) tighter sequencing so nothing gets rebuilt. **Not by overtime alone** — tired vibecoding creates bugs that cost more than the hours saved. Two buffer days (Jul 16, Jul 18) are protected on purpose.
**Deadlines:** Project submission **19 Jul**. Registration deadline **18 Jul** — register NOW, separate from submission.
**Target for demo:** Installable Android APK, built locally via Expo prebuild + Android Studio.

---

## 0. Ground Rules (read before writing any code)

1. **One vertical slice per session.** Finish and run it on a device/emulator before starting the next. No parallel half-features.
2. **Commit after every slice that runs.** `git commit -m "slice: chat working"`. Vibecoding's failure mode is an unbisectable 2,000-line mess.
3. **Test on device, not just in the AI's head.** The AI cannot see your emulator. You are the test harness.
4. **When something breaks, paste the actual error.** Never ask "fix the app." Ask "here's the stack trace, fix this."
5. **Cut from the back, never the front.** If you fall behind, you drop stretch features (bottom of this list) — you never ship a broken hero feature to squeeze in a shallow one.
6. **Positioning:** Aroha is a **medication reminder + health-logging companion that prepares notes for your doctor** — NOT a medical-advice engine. Every health-info response ends with "I'm not a doctor — confirm with yours." This is a feature, not a hedge.

---

## Scope (agreed cut)

Scope mirrors PRD §5 tiers. Cut from the bottom, never the top.

- **CORE (must demo):** Auth · AI Chat + Persistent Memory · Camera → Medication (HERO) · ABDM/Record Import · Daily Schedule · Local Notifications
- **P1 (strong to have):** Onboarding · Symptom Photo Log · Doctor Visit Summary · Streak
- **STRETCH (only if ahead):** Voice/Smart Mode · Health Q&A (info + disclaimer, no interaction claims) · Advanced recurrence (beyond daily) · Refill Alert · Google sign-in

**Roadmap (NOT built in v1):** Google Sign-In + backup/restore to the user's own Google Drive (`appDataFolder`) · Caregiver dashboard · Drug-interaction / prescription-review advocate · Rash/symptom → action guide · B2B/pharma · native ABDM linking. These are the north-star vision (PRD §5b), labeled as future everywhere.

---

## Stack (chosen for max AI-codegen reliability)

| Layer | Choice | Note |
|---|---|---|
| Framework | Expo (SDK 52+) + Expo Router + TypeScript | Most-represented in training data = best codegen |
| Build | `expo prebuild` → Android Studio (Gradle) | Local APK, no EAS/signing pain for Android |
| Auth + DB | Firebase Auth + Firestore | Email login is enough for demo; skip Google OAuth first pass |
| AI | Gemini 1.5 Flash (Vision + Text) | Call from a thin Cloud Function OR Expo API route — **never ship the key in the client** |
| Camera | expo-camera / expo-image-picker | Hero feature — spend real time here |
| Notifications | expo-notifications (local) | Local reminders only; skip push/FCM for demo |
| Voice (stretch) | expo-speech (TTS) + expo-av or @react-native-voice | STT is the flaky part — stretch only |

---

## Day 0 — Prerequisites (Jul 3, before any feature code)

Confirm ALL of these work before Day 1, or Day 1 slips:
- Node LTS + `npx` working; Android Studio with an SDK + a running **emulator image** (you have Android Studio — verify an AVD actually boots).
- **Firebase project** created: Auth (email/password) + Firestore enabled.
- **Gemini API key with billing enabled** — the free tier will rate-limit you mid-demo. Store it for server-side use only.
- Git repo initialized; `.gitignore` excludes `.env`.
- **ABDM/ABHA test data:** at least one realistic health-record screenshot to test the import flow. If you don't have a real ABHA record, make a convincing mock — otherwise your hero's second flow has nothing to demo.

---

## Day-by-Day (re-baselined, extended sessions)

### Jul 4 (Day 1) — Foundation + first Gemini response
- `npx create-expo-app`, Expo Router + TS, tab layout shell.
- Firebase Auth (email/password) + minimal login screen.
- Gemini call **server-side** (Cloud Function or API route) → one text reply rendering in a chat bubble.
- `expo prebuild` once → open in Android Studio → confirm a debug APK builds and runs on the emulator. **Prove the build while the app is empty.**
- **Exit check:** log in + get one real Gemini reply on the emulator. Commit.

### Jul 5 (Day 2) — Chat + Memory + minimal schedule model
- Chat screen with history (FlatList), Firestore-backed messages per user.
- **Memory (simplified):** a `userProfile` doc (conditions, meds, routine) + the **last ~10 messages re-injected verbatim** into every Gemini prompt. **No summarizer function in v1** — this is real memory for demo purposes and saves ~half a day.
- **Minimal `schedule` data model NOW** (collection + a bare day-list read). ← moved forward so the hero has somewhere to write meds. Full schedule UI comes Jul 9.
- Aroha persona: warm, plain language, short sentences.
- **Exit check:** close & reopen app → Aroha remembers your name + a fact. Commit.

### Jul 6–8 (Days 3–5) — HERO: Vision pipeline (pill first, then ABDM)
- **One Gemini Vision pipeline, reused** — but sequence it so quality is locked before you widen:
  - **Jul 6–7: Pill strip photo → med.** Parse name/dose/frequency → editable form → confirm → writes to the schedule model. Make this *flawless*: blurry photo, unreadable strip, permission denied all degrade gracefully to "edit manually." Test 5+ real strips.
  - **Jul 8: ABDM/ABHA screenshot → profile.** Reuse the same pipeline; parse conditions/meds/history → editable review → confirm → populates Health Profile. ABDM screenshots are denser/messier — **budget this as the thing most likely to overrun.** If pill→med isn't solid by end of Jul 7, ABDM slips to the Jul 13 overflow day.
- Every parse pre-fills an **editable** form; user confirms before save. Never auto-commit.
- **Framing:** "import your ABDM/ABHA records via screenshot," NOT "ABDM integrated."
- **Exit check:** (a) pill photo → confirmed med → on today's schedule; (b) ABDM screenshot → confirmed → in Health Profile. Commit after each.

### Jul 9 (Day 6) — Schedule UI + Local Notifications
- Day-view list of today's events (meds, meals, custom); one-tap "mark done" (this feeds adherence for the doctor summary).
- Add/edit/delete events; recurrence = **daily only** (advanced recurrence = stretch).
- expo-notifications local reminders at event times.
- **Exit check:** schedule a med 2 min out → notification fires → tap done. Commit.

### Jul 10–11 (Days 7–8) — Onboarding + Symptom Log + Streak
- Onboarding: name/age → conditions → meds (camera or manual) → routine.
- **Symptom Photo Log** (moved BEFORE the summary so it has data): photo/gallery → Gemini describes → timestamped log entry.
- Streak counter + celebration message.
- **Exit check:** fresh install → full onboarding → log a symptom → it appears in history. Commit.

### Jul 12 (Day 9) — Doctor Visit Summary (now the data exists)
- One button → Gemini generates a summary from **real** data: adherence (from schedule completions) + recent symptoms (from the log) + 3 suggested questions.
- Ends with "I'm not a doctor — confirm with yours."
- **Exit check:** summary generates from actual logged data, not placeholders. Commit.

### Jul 13 (Day 10) — Overflow / Stretch buffer
- **First priority: absorb any hero/ABDM overrun.** If Jul 8 slipped, finish ABDM here.
- If genuinely ahead: **Voice TTS** (expo-speech reads replies aloud — reads as "voice mode" on video) and/or **Health Q&A** (info + source + disclaimer, NO interaction claims). Both droppable.
- **Do not start anything you can't finish today.**

### Jul 14–15 (Days 11–12) — Elderly-UX polish + real APK
- 18px+ base font, high contrast, 44pt+ touch targets, big buttons, minimal nav.
- Loading/empty/error states everywhere (elderly users panic at blank screens).
- **Offline check (verify, don't build):** confirm Firestore's default read cache shows last-loaded schedule/meds with network off + an offline banner. A truthfulness check on existing SDK behavior — NOT a new feature.
- `expo prebuild --clean` → **release APK** in Android Studio → install on a **real phone** → run the full happy path.
- **Exit check:** APK installs and runs the whole demo path on a physical device. Commit + tag.

### Jul 16 (Day 13) — BUFFER / hardening
- Fix whatever's flaky. Re-test the hero on 5+ pill strips + your ABDM screenshot until it never crashes.
- No new features. This day exists to absorb slippage — protect it.

### Jul 17 (Day 14) — Demo video + assets
- Record the **locked ~2:10 arc** (see DEMO_SCRIPT.md): Problem → Meet Aroha + memory → HERO camera→med → **ABDM import → personal summary** → doctor summary → vision close. Lead with the hero in the first 20s.
- Screenshots per SUBMISSION_CHECKLIST; update docs to match what actually shipped.
- Confirm demo video URL + repo are public (test in incognito).

### Jul 18 — Register (deadline!) + BUFFER
- **Register on the portal today** — registration deadline is Jul 18, separate from submission.
- Final asset checks; re-record video if needed. Slack for the portal misbehaving.

### Jul 19 — Submit early in the day. **Do not submit at 11:59pm.** Screenshot the confirmation.

---

## Where vibecoding will fight you (budget extra time)

- **Firebase auth + Firestore rules** — AI often generates outdated v8 syntax; force it to use modular v10.
- **Camera permissions on Android** — prebuild config + `app.json` permissions; codegen frequently forgets these.
- **expo-notifications on a prebuilt (non-Expo-Go) app** — behaves differently than in Expo Go; test on the real build.
- **Gemini key exposure** — AI will happily hardcode it in the client. Keep it server-side, always.

## If you're behind by Jul 12

Ship exactly this and it still wins on depth: **Onboarding → Chat+Memory → Camera→Med → ABDM Import → Schedule+Reminders → Doctor Summary.** Six polished slices beat twelve half-working ones. Drop (in order): Health Q&A → Voice → symptom log → streak. Never sacrifice the hero (camera→med) or ABDM import — they're the whole differentiation.

## Extended-session reality check

You're recovering 2 days partly on longer hours. Guard the quality: stop coding when error rate climbs (you'll notice you're pasting the same stack trace twice). A 3-hour block rested beats a 6-hour block exhausted for vibecoding. The buffer days (Jul 16, 18) exist so you don't have to choose sleep vs. shipping on the final night.
