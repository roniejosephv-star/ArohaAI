# Aroha AI — Submission Checklist

> Final checklist before submitting to the FlowZint AI Hackathon 2026 portal.
> Submission portal: https://flowzint.in/2026/ai/hackothon
> **Registration deadline: July 18** · **Project submission deadline: July 19, 12:00 AM IST**
> ⚠️ Register NOW — registration closes before submission. Submit early on the 19th; don't trust the portal at 11:59pm.

---

## 1. Code & Repository

- [ ] GitHub repo is **public**
- [ ] Clean commit history (no temporary commits, no "WIP" messages)
- [ ] **Gemini key is ONLY in the Cloudflare Worker secret** — never in the app, `.env`, or repo
- [ ] `.env` holds only the worker URL (not secret); `.gitignore` excludes `.env` and `worker/.dev.vars`
- [ ] `.env.example` file committed showing required variables
- [ ] `README.md` complete with:
  - [ ] Project description and tagline
  - [ ] Screenshots (at least 3)
  - [ ] Tech stack badges
  - [ ] Setup instructions (clone → install → configure → run)
  - [ ] Architecture overview
  - [ ] License
- [ ] All PRD/architecture/demo documents committed
- [ ] Code lints without errors (`npx expo lint` or equivalent)
- [ ] TypeScript compiles without errors (`npx tsc --noEmit`)

---

## 2. App Readiness

### CORE Features (must work for the demo)

- [ ] **Worker**: Gemini proxy deployed; app reaches it (test with curl)
- [ ] **Chat**: Messages send and receive; Aroha responds with personality (warm, big-text)
- [ ] **Persistent Memory**: Aroha recalls user details after app restart
- [ ] **Camera → Medication (HERO)**: Photo → Gemini reads → editable form → confirm → scheduled
- [ ] **Camera → Medication**: Graceful fallback to manual entry if Gemini fails
- [ ] **ABDM / Record Import**: Screenshot → Gemini extracts → editable review → confirm → profile fills
- [ ] **Schedule**: Day view shows events; one-tap complete; add/edit/delete
- [ ] **Notifications**: Local reminder fires at scheduled event time

### P1 Features (strong to have)

- [ ] **Onboarding**: profile → conditions → medications → routine (no caregiver in v1)
- [ ] **Symptom Photo**: Take/upload photo → AI describes → logged with timestamp
- [ ] **Doctor-Visit Summary**: One tap → symptoms + adherence + questions to ask
- [ ] **Streak**: Adherence streak + celebration message

### STRETCH (only if ahead)

- [ ] **Health Q&A**: General info + source + "confirm with your doctor" (NO interaction claims)
- [ ] **Voice**: TTS reads replies (STT only if solid)
- [ ] Advanced recurrence (weekdays/custom/date range) — (accounts/sign-in are roadmap, not MVP)

### Memory & Persistence

- [ ] **Persistent memory**: Aroha remembers user details across app restarts
- [ ] **Persistent memory**: Chat history loads on app relaunch
- [ ] **Persistent memory**: Medications and schedule persist across sessions
- [ ] **Context injection**: Aroha references today's schedule and recent conversations

### States & Edge Cases

- [ ] **Empty state**: First-time user sees onboarding, not empty chat
- [ ] **Empty state**: No events today — calendar shows friendly message
- [ ] **Loading state**: Skeleton/spinner shown while AI responds
- [ ] **Error state**: Network error — friendly message + retry option
- [ ] **Error state**: AI timeout — fallback message
- [ ] **Error state**: Camera permission denied — guidance to enable
- [ ] **Offline**: Cached schedule viewable
- [ ] **Offline**: Offline indicator shown
- [ ] **Offline**: AI features show "needs internet" message

---

## 3. Demo Assets

### Demo Video

- [ ] Video length: 2–3 minutes (target 2:45)
- [ ] Resolution: 1080p minimum
- [ ] Audio: Clear voiceover (no background noise)
- [ ] Screen recording: Clean (no unnecessary notifications, dark mode consistent)
- [ ] Script followed: See `DEMO_SCRIPT.md`
- [ ] Edited: Smooth transitions, no dead air
- [ ] Total runtime ~2:10 (LOCKED arc — see DEMO_SCRIPT.md)
- [ ] Opening hook: Problem statement (0:00-0:15)
- [ ] Meet Aroha + memory recall; calendar as a 2-sec flash only (0:15-0:35)
- [ ] WOW moment #1 (HERO): Camera → medication (0:35-1:05)
- [ ] WOW moment #2: ABDM import → filled Personal Summary payoff shot (1:05-1:30)
- [ ] Payoff beat: Doctor-visit summary (1:30-1:50)
- [ ] Close: Vision line "advocates, never overrides" + logo (1:50-2:10)
- [ ] NOT in video (still built): symptom log, Health Q&A, standalone calendar beat
- [ ] Uploaded to YouTube (unlisted) or Google Drive
- [ ] Link tested and working (incognito)

### Screenshots

- [ ] Onboarding screen
- [ ] Chat screen with today's schedule
- [ ] Camera → medication flow (editable result card)
- [ ] ABDM / record import → profile filled
- [ ] Doctor-visit summary
- [ ] Symptom log with timestamp

### Demo Environment

- [ ] APK installed and runs on a real Android device (not just emulator)
- [ ] Demo user profile pre-loaded ("Geeta Sharma, 68, BP + Diabetes + Arthritis")
- [ ] 3+ pre-existing medications in the schedule
- [ ] Today's schedule shows mix of completed and pending items
- [ ] Printed pill strip available for camera demo
- [ ] Sample ABDM/ABHA record screenshot in the gallery for the import demo
- [ ] Good lighting for camera capture
- [ ] Wi-Fi available (no cellular dependency)

---

## 4. Submission Portal

### Account Setup

- [ ] Account created on [FlowZint Submission Portal](https://flowzint.in/2026/ai/hackothon)
- [ ] Verification email confirmed

### Project Details

- [ ] **Project Name**: Aroha AI
- [ ] **Category**: Open Innovation
- [ ] **Team Size**: 1
- [ ] **Team Lead**: [Your Name]
- [ ] **Team Members**: (none — solo)
- [ ] **College/Organization**: [Your College/Org]
- [ ] **City**: [Your City]

### Project Description

- [ ] **Short description** (1-2 sentences, for listing):
  > "Aroha AI is a Personal Health Memory System for Indian elders and the families who care for them. Every interaction — a photographed pill strip, an imported ABHA record, a logged symptom, a completed dose — becomes structured health memory (Memory Extractor → Health Timeline → Context Builder) that Gemini reasons over to deliver AI medication reminders, camera → medication capture, ABDM/ABHA record import, and one-tap doctor-visit summaries. Not a chatbot — an on-device memory system where inputs become memory, memory becomes context, and context becomes personalized care."
- [ ] **Detailed description** (100-200 words, for judging):
  > Draft:
  > "Aroha AI is a Personal Health Memory System for Indian elders and their families. The innovation isn't any single model call — it's the Health Memory Layer that orchestrates them: every interaction runs through a Memory Extractor → Health Timeline → Context Builder, so Gemini reasons over accumulated memory, not one message. Inputs become memory, memory becomes context, context becomes personalized care. Today that memory delivers real value through one Gemini Vision pipeline serving two jobs: photograph a pill strip and Aroha reads the medication, dosage, and timing and schedules it with a reminder; or upload a screenshot of your ABDM/ABHA record and Aroha auto-fills your health profile — import, not a months-long integration. Users log symptom photos, and one tap generates a doctor-visit summary of symptoms, adherence, and questions to ask. Built with React Native (Expo, Android-first) and Gemini. Data stays on-device; the Gemini key lives only in a Cloudflare Worker — never in the app or repo. Aroha advocates for the patient and prepares them for their doctor — it never diagnoses or overrides a physician. Roadmap: accounts + Google Drive backup, voice, native ABDM linking, prescription-review advocacy, and a caregiver dashboard."

### Submission Links

- [ ] **GitHub Repository URL**: `https://github.com/[yourusername]/ArohaAI`
- [ ] **Demo Video URL**: `https://youtube.com/watch?v=[yourvideo]` or Google Drive link
- [ ] **APK download** (optional): link to the release APK (Google Drive) for judges to install
- [ ] **Screenshots**: 6 screenshots uploaded
- [ ] **Additional Files**: PRD.md, ARCHITECTURE.md, DEMO_SCRIPT.md uploaded (if portal allows)

---

## 5. Day of Submission (July 19)

### Pre-Submission (Morning)

- [ ] Full app walkthrough on real device — all flows work
- [ ] Demo video plays without errors (check link)
- [ ] GitHub repo accessible in incognito mode
- [ ] All links in submission form tested
- [ ] Phone charged to 100%
- [ ] Do not disturb mode ON (no notifications during demo)

### Submission

- [ ] Submit before 12:00 AM IST (July 19)
- [ ] Take screenshot of submission confirmation
- [ ] Check email for confirmation from FlowZint
- [ ] Verify submission appears on portal

### Post-Submission

- [ ] Share submission on LinkedIn/Twitter
- [ ] Tag FlowZint and relevant communities
- [ ] Keep phone available for potential follow-up (live demo request)

---

## 6. Final Verification Walkthrough

Run through this complete flow one last time:

1. **Fresh install** (APK) → App launches to login screen
2. **Sign up** with email → Redirected to onboarding
3. **Onboarding**: Name "Geeta", Age 68, Female → Conditions: BP, Diabetes, Arthritis
4. **Camera → med (HERO)**: Show printed strip → Gemini reads → edit if needed → confirm → scheduled
5. **ABDM import**: Upload a record screenshot → Gemini extracts → review → confirm → profile fills
6. **Add one medication manually** (proves the fallback)
7. **Onboarding**: Set routine — Wake 7AM, Breakfast 8AM, Lunch 1PM, Dinner 8PM
8. **Chat screen**: See today's schedule with medications + meals
9. **Tap to complete** a medication → count updates, Aroha responds
10. **Memory check**: close & reopen app → Aroha still knows Geeta's name + conditions
11. **Health Q&A (if built)**: "Is Triphala good for digestion?" → info + source + "confirm with your doctor"
12. **Camera → symptom**: Take photo of a mock symptom → Aroha logs it with timestamp
13. **Doctor summary**: menu → "Prepare for doctor visit" → summary generates
14. **Schedule**: add "Doctor appointment" tomorrow 3PM → reminder ON → notification fires on test
15. **(Stretch) Voice**: Aroha reads a reply aloud (TTS)

---

## 7. Contacts

- **FlowZint Submission Portal**: https://flowzint.in/2026/ai/hackothon
- **FlowZint Helpdesk**: contact@flowzint.in
- **Result Portal**: https://flowzint.in/2026/ai/hackothon/results/round1
- **Result Date**: July 20, 2026
