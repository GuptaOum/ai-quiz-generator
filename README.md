# 🧠 AI Quiz Generator

[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646cff.svg?logo=vite&logoColor=white)](https://vite.dev/)
[![Gemini API](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8e75ff.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/GuptaOum/ai-quiz-generator/pulls)

An intelligent, interactive multiple-choice quiz web application powered by **Google's Gemini 2.5 Flash** model. Enter any subject—from web development and astrophysics to cinema and history—and the application generates a tailored 5-question quiz on demand.

Equipped with **complete client-side state persistence**, your quiz progress, selections, and scores are never lost on page reloads or accidental browser exits.

---

## ✨ Features

- **⚡ Instant AI Quiz Generation**: Prompts Google Gemini 2.5 Flash with structured schema constraints to generate high-quality 5-question MCQs on any custom topic in seconds.
- **💾 Full State Persistence (`localStorage`)**:
  - Automatically preserves active quiz progress, question position, selected answers, and scoring in real time.
  - Page refresh, tab closure, or accidental navigation will safely restore your quiz right where you left off.
  - Automatically cleans up local storage when resetting or starting a new quiz.
- **🎯 Interactive Quiz Flow**:
  - **Option Toggle / Deselect**: Click an option to select; click again to deselect.
  - **Question Skipping**: Skip any question without being forced to choose an answer. Unanswered questions are logged as *"Not answered"*.
  - **Bidirectional Navigation**: Go forward or back using `Previous` and `Next` buttons to review and modify answers prior to completion.
  - **Visual Selection Feedback**: Selected answers highlight with responsive styling (`#2ecc71`).
- **📊 Comprehensive Score & Answer Review**:
  - Displays overall score out of total questions.
  - Expandable **"Review Answers"** section detailing each question, your chosen option, and the verified correct answer with intuitive color-coded indicators.
- **🎨 Polished UI & Modern Typography**:
  - Clean card-based aesthetic using Google Poppins typography, subtle CSS drop-shadows, and smooth state transition animations.

---

## 💾 How State Persistence Works

The application employs a dual-`useEffect` architecture ("Unpacking" on mount and "Packing" on state mutation) connected to the browser's `localStorage`.

### Data Flow

```
[User Action / Answer Selection]
              │
              ▼
   State Updates in React
(topic, currentQuiz, currentQuestionIndex, userAnswers, score, showResults)
              │
              ▼
   [Packing useEffect] ──▶ Serializes state to JSON ──▶ localStorage.setItem('quizState')
                                                                  │
┌─────────────────────────────────────────────────────────────────┘
│  (On Browser Reload / Return)
▼
[Unpacking useEffect] ──▶ Reads localStorage.getItem('quizState') ──▶ Deserializes & Restores State
```

### Key Implementation Snippets

#### 1. Unpacking (Restore on Mount)
Runs once when the component mounts. Checks for existing stored progress and repopulates the component state:

```javascript
useEffect(() => {
  const savedState = localStorage.getItem('quizState');
  if (savedState) {
    const { topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers } = JSON.parse(savedState);
    setTopic(topic);
    setCurrentQuiz(currentQuiz);
    setCurrentQuestionIndex(currentQuestionIndex);
    setScore(score);
    setShowResults(showResults);
    setUserAnswers(userAnswers || []);
  }
}, []);
```

#### 2. Packing (Persist on Update)
Tracks any changes to active quiz state and synchronizes with `localStorage`. When the quiz is finished or restarted (`currentQuiz === null`), the storage is cleanly purged:

```javascript
useEffect(() => {
  if (currentQuiz) {
    const quizState = {
      topic,
      currentQuiz,
      currentQuestionIndex,
      score,
      showResults,
      userAnswers
    };
    localStorage.setItem('quizState', JSON.stringify(quizState));
  } else {
    localStorage.removeItem('quizState');
  }
}, [topic, currentQuiz, currentQuestionIndex, score, showResults, userAnswers]);
```

### Persisted State Attributes

| State Property | Type | Description |
|---|---|---|
| `topic` | `string` | The topic string submitted by the user. |
| `currentQuiz` | `object` | Quiz object containing question prompts, option lists, and correct answers. |
| `currentQuestionIndex` | `number` | The zero-indexed position of the active question. |
| `score` | `number` | The cumulative score of correctly answered questions. |
| `showResults` | `boolean` | Flag controlling whether the user is on the final score summary screen. |
| `userAnswers` | `Array<string \| undefined>` | Stored answer choices corresponding to each question index. |

---

## 🛠️ Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vite.dev/)
- **AI Model**: [Google Gemini 2.5 Flash](https://ai.google.dev/) via `@google/generative-ai`
- **Markdown Support**: `react-markdown`
- **Styling**: Vanilla CSS with custom properties (CSS variables) and responsive design
- **State Persistence**: Browser HTML5 `localStorage` API

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A **Google Gemini API Key** (obtainable free of charge at [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/GuptaOum/ai-quiz-generator.git
   cd ai-quiz-generator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` in your editor and enter your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

5. **Build for production:**
   ```bash
   npm run build
   ```
   The compiled assets will be created in the `dist/` directory.

---

## 📁 Project Structure

```
ai-quiz-generator/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images and SVG icons
│   ├── App.css             # Main styling, responsive rules, color variables
│   ├── App.jsx             # Core component: Gemini prompt, state persistence, quiz UI
│   ├── App2.jsx            # Example profile-saving persistence prototype
│   └── main.jsx            # React root mount
├── .env.example            # Environment variable template
├── .gitignore              # Files and directories ignored by Git
├── eslint.config.js        # ESLint flat configuration
├── explanation.md          # Architectural notes on persistence & UX updates
├── index.html              # HTML entry point with Poppins font import
├── package.json            # Project dependencies and npm scripts
├── vite.config.js          # Vite configuration
└── README.md               # Project documentation
```

---

## 🛡️ License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

Crafted by **[Oum Gupta](https://github.com/GuptaOum)**. Feel free to star ⭐ the repository if you found this project helpful!
