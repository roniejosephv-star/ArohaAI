# Aroha AI — Day 1 Scaffold Setup (No Firebase)

Architecture: **Expo app → Cloudflare Worker (holds the Gemini key) → Gemini.** All user data stays **on the device** (AsyncStorage now, expo-sqlite later). No Firebase, no login for the MVP.

Why the worker: the Gemini key can't live in the app — an APK decompiles and a public repo gets scraped. The worker is a ~30-line server that keeps the key off the device. See the chat with Claude for the full "why a vault won't work" explanation.

> App commands run from `ArohaAI/`. Worker commands run from `ArohaAI/worker/`.

## 0. What you need first
- Node LTS (v20) + npm
- Android Studio with an SDK + a working emulator (AVD)
- A Gemini API key — https://aistudio.google.com/app/apikey
- A free Cloudflare account — https://dash.cloudflare.com/sign-up

## 1. Deploy the Aroha proxy (worker)
```bash
cd worker
npm install
npx wrangler login                 # opens the browser, log in to Cloudflare
npx wrangler secret put GEMINI_API_KEY   # paste your Gemini key when prompted
npx wrangler deploy                # prints your worker URL, e.g. https://aroha-proxy.<you>.workers.dev
```
Copy that URL — you'll need it in step 2.

### Test the worker (optional but smart)
```bash
curl -X POST https://aroha-proxy.<you>.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
# expect: {"reply":"..."}
```

### Local dev alternative (no deploy)
```bash
cd worker
cp .dev.vars.example .dev.vars     # put your Gemini key in .dev.vars (git-ignored)
npx wrangler dev                   # serves at http://127.0.0.1:8787
```
Use that localhost URL as your API URL while developing.

## 2. Configure and run the app
```bash
cd ..            # back to ArohaAI/
npm install
cp .env.example .env
# edit .env → set EXPO_PUBLIC_AROHA_API_URL to your worker URL from step 1
npx expo start   # press "a" for the Android emulator
```

## 3. Build the real APK (do this early — Day 1)
```bash
npx expo prebuild --platform android
cd android && ./gradlew assembleDebug
# APK: android/app/build/outputs/apk/debug/app-debug.apk
```

## Day 1 exit check ✅
- The app opens straight to the chat (no login in the MVP).
- You type a message and Aroha replies (a real Gemini response via the worker).
- A debug APK builds and runs on the emulator.

Commit when green: `git add -A && git commit -m "slice: gemini chat via worker"`

## File map
```
ArohaAI/
├── app/
│   ├── _layout.tsx           # no auth gate — straight to tabs
│   ├── index.tsx             # redirects to chat
│   └── (tabs)/_layout.tsx | chat.tsx
├── src/lib/
│   ├── aroha.ts              # fetch() to the worker
│   └── storage.ts            # on-device profile (AsyncStorage)
├── worker/
│   ├── src/index.js          # Cloudflare Worker — holds the Gemini key
│   ├── wrangler.toml
│   └── .dev.vars.example     # copy to .dev.vars for local dev
├── app.json | package.json | tsconfig.json | babel.config.js
└── .env.example              # copy to .env, set EXPO_PUBLIC_AROHA_API_URL
```

## Notes
- **Key safety:** the Gemini key is only ever a Cloudflare secret (`wrangler secret put`) or in `worker/.dev.vars` (git-ignored). It never enters the app or the repo.
- **Data:** everything is on-device, so the app works offline for stored data by default. Cloud sync is a roadmap item, not the MVP.
- **Day 2** adds chat history + memory + a minimal schedule model, all in on-device storage.
