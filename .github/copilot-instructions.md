# Copilot / AI Agent Instructions for my-react-app

This file contains concise, actionable guidance for AI coding agents working on this React + Vite project.

**Project Overview**
- **Stack:** React (client), Vite dev server and build. See `package.json` scripts (`dev`, `build`, `preview`).
- **Purpose:** Single-page app that generates multiple-choice quizzes using the Gemini API via the `@google/generative-ai` client in `src/App.jsx`.

**Key Files**
- `src/App.jsx`: Core app logic — topic input, calls `GoogleGenerativeAI`, parses returned JSON, renders quiz UI. Example: the app extracts JSON with `text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1)` then `JSON.parse`.
- `src/main.jsx`: React entry and root mount.
- `vite.config.js`: dev server settings including `host: true` and `allowedHosts` (contains an ngrok URL used for external testing).
- `package.json`: scripts, dependencies (`@google/generative-ai`, React, Vite) and devDeps (ESLint + plugins).

**Build / Dev / Debug Commands**
- Run dev server (Windows `cmd.exe`):
  - `npm install`
  - `npm run dev` — starts Vite with HMR
- Build for production: `npm run build`
- Preview production build locally: `npm run preview`
- Lint: `npm run lint`

**Environment & Secrets**
- The app reads the Gemini API key from `import.meta.env.VITE_GEMINI_API_KEY` (client-side env). Expect a `.env` with `VITE_GEMINI_API_KEY=...` during local development. Do NOT commit secrets. Note: keys used client-side will be exposed in the built bundle.

**Patterns & Conventions (codebase-specific)**
- Client-side generative calls: `new GoogleGenerativeAI(API_KEY)` then `genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })` and `model.generateContent(prompt)` — changes to prompts or model names should be updated in `src/App.jsx`.
- Response parsing: the app assumes the model returns a JSON blob possibly embedded in other text and extracts the JSON by slicing from first `{` to last `}`. This is brittle; if you modify this behavior, update parsing tests or add robust extraction.
- UI state: all quiz state is in `App` via `useState`. When refactoring, keep state transitions (loading, error, currentQuiz, currentQuestionIndex, score) consistent to avoid breaking UI flow.
- Styles: `App.css` and `Quiz.css` control layout; class names like `option-button`, `correct`, and `incorrect` are used in `src/App.jsx`.

**Dev Server Notes**
- `vite.config.js` exposes the dev server externally (`host: true`) and lists an `ngrok` host under `allowedHosts`. If you change this, be aware of live-reload behavior when accessed externally.

**When Editing or Extending**
- If adding server-side proxying for the Gemini API, update `vite.config.js` or add a separate server folder and move key usage off the client. Search for `VITE_GEMINI_API_KEY` and `@google/generative-ai` to find related spots.
- For prompt changes, update the prompt string in `src/App.jsx` and validate returned JSON structure: `{ topic, questions: [{ question, options, correctAnswer }] }`.
- When updating deps, check `package.json` and run `npm install` before testing.

**Quick Troubleshooting**
- If quizzes fail to generate: check browser console for parsing errors; inspect `result.response.text()` content to see whether output format changed.
- If HMR or external access fails: check `vite.config.js.allowedHosts` and any active ngrok tunnel.

If anything in this doc is unclear or you'd like more detail (tests, CI steps, or a plan to move the API key to a server), tell me which section to expand.
