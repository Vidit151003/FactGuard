# 🛡️ FactGuard — AI-Powered Fact Checker

> **Catch lies before they spread.**  
> Upload any PDF document and get an instant, claim-by-claim truth audit — powered by Google's Gemini AI with live Google Search grounding.

---

## 🌐 Live Demo

<!-- 🔗 Paste your deployed link below once the site is live -->

| Environment | URL |
|-------------|-----|
| **Production** |[fact-guard-eight.vercel.app](https://fact-guard-eight.vercel.app) |

---

## 📖 What is FactGuard?

FactGuard is a full-stack web application that lets you fact-check an entire document in minutes. You upload a PDF, and the app:

1. **Extracts** all readable text from the document.
2. **Identifies** specific, verifiable factual claims (statistics, dates, financial figures, etc.) using Gemini AI.
3. **Verifies** each claim one-by-one against live web data via Google Search grounding.
4. **Presents** a clean, interactive report — complete with a trust score, colour-coded verdict cards, and a downloadable JSON report.

The whole pipeline streams results to the browser in real time using **Server-Sent Events (SSE)**, so you can watch each claim get checked as it happens inside a slick terminal-style live console.

---

## ✨ Key Features

- **PDF Upload** — Drag-and-drop or click-to-browse file picker for PDF documents.
- **AI Claim Extraction** — Gemini `gemini-3.1-flash-lite` identifies 5–20 concrete, checkable claims per document.
- **Live Verification** — Each claim is verified using a separate Gemini call with the native `googleSearch` tool for real-time web grounding.
- **Real-Time Streaming** — SSE-powered progress with a Mac-style terminal console showing every step as it happens.
- **Trust Score** — A visual ring gauge that summarises overall document reliability at a glance.
- **Filterable Results** — Toggle between All, Verified ✅, Inaccurate ⚠️, and False ❌ claims.
- **Downloadable Reports** — Export the full fact-check report as a structured JSON file.
- **Responsive Design** — Works beautifully on desktop and mobile screens.

---

## 🏗️ Tech Stack

### Frontend (Client)

| Technology | Purpose |
|---|---|
| **React 18** | UI library — component-based architecture with hooks |
| **Vite 5** | Dev server & build tool with HMR and optimised bundling |
| **Vanilla CSS** | Custom design system with CSS variables, keyframe animations, and responsive layouts |
| **Google Fonts** | Typography — *Fraunces* (serif headings) and *DM Sans* (body text) |

### Backend (Server)

| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express 4** | Minimalist web framework for API routes |
| **Multer** | Middleware for handling `multipart/form-data` PDF uploads |
| **pdf-parse** | Extracts text content from uploaded PDF files |
| **@google/generative-ai** | Official Google Generative AI SDK for accessing Gemini models |
| **dotenv** | Loads environment variables from `.env` files |
| **CORS** | Cross-origin resource sharing middleware |

### Dev Tooling

| Tool | Purpose |
|---|---|
| **Concurrently** | Runs client and server dev processes in parallel from the root |
| **Nodemon** | Auto-restarts the server on file changes during development |
| **@vitejs/plugin-react** | Vite plugin for React JSX transform and Fast Refresh |

---

## 📁 Project Structure

```
FactGuard/
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Top navigation bar
│   │   │   ├── HeroSection.jsx     # Landing hero with animated visuals
│   │   │   ├── HowItWorks.jsx      # Three-step explainer section
│   │   │   ├── UploadSection.jsx   # PDF upload, terminal console, progress UI
│   │   │   ├── ResultsPanel.jsx    # Trust score, filter tabs, results display
│   │   │   ├── ClaimCard.jsx       # Individual claim verdict card
│   │   │   ├── StatsBar.jsx        # Statistics display bar
│   │   │   └── Footer.jsx          # Site footer
│   │   ├── App.jsx                 # Root component — manages state & layout
│   │   ├── main.jsx                # React DOM entry point
│   │   └── index.css               # Global design system & animations
│   ├── index.html                  # HTML shell with SEO meta tags
│   ├── vite.config.js              # Vite config with API proxy
│   ├── .env                        # Client environment variables (gitignored)
│   └── .env.example                # Template for client env vars
│
├── server/                     # Express backend
│   ├── routes/
│   │   └── factcheck.js            # POST /api/factcheck — SSE streaming endpoint
│   ├── services/
│   │   ├── pdfExtractor.js         # Reads PDF files and returns raw text
│   │   └── claimVerifier.js        # Gemini AI — claim extraction + verification
│   ├── uploads/                    # Temp directory for uploaded PDFs (gitignored)
│   ├── index.js                    # Express app entry — CORS, routes, server start
│   ├── .env                        # Server environment variables (gitignored)
│   └── .env.example                # Template for server env vars
│
├── package.json                # Root — scripts to run both client & server
├── .gitignore                  # Ignores node_modules, .env, dist, uploads
└── README.md                   # You are here 👋
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (comes with Node.js)
- A **Google Gemini API key** — get one free at [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/FactGuard.git
cd FactGuard
```

### 2. Install dependencies

From the project root, run:

```bash
npm run install:all
```

This installs dependencies for both the `client/` and `server/` directories in one go.

### 3. Configure environment variables

**Server** — create `server/.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=4000
```

**Client** — create `client/.env` (optional, only needed if your API is hosted elsewhere):

```env
VITE_API_URL=
```

> Leave `VITE_API_URL` empty for local development — Vite's proxy will forward `/api` requests to `localhost:4000` automatically.

### 4. Start development

```bash
npm run dev
```

This starts both the backend (port `4000`) and the frontend (port `5173`) concurrently.

Open your browser at **http://localhost:5173** and you're good to go.

---

## 🔧 Available Scripts

Run these from the **project root**:

| Command | Description |
|---|---|
| `npm run dev` | Starts both client & server in development mode |
| `npm run dev:client` | Starts only the Vite dev server |
| `npm run dev:server` | Starts only the Express server (with Nodemon) |
| `npm run install:all` | Installs dependencies for both client and server |

---

## 🔌 API Reference

### `POST /api/factcheck`

Upload a PDF for fact-checking. Returns results as a **Server-Sent Events** stream.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `pdf` — the PDF file to analyse

**SSE Event Stages:**

| Stage | Payload | Description |
|---|---|---|
| `extracting` | `{ message }` | PDF text extraction has started |
| `identifying` | `{ message }` | AI is scanning for factual claims |
| `claims_found` | `{ count, claims[] }` | List of identified claims |
| `verifying` | `{ current, total, claim }` | Currently verifying a specific claim |
| `claim_result` | `{ result }` | Verdict for a single claim |
| `complete` | `{ results[] }` | All claims verified — final results |
| `error` | `{ message }` | Something went wrong |

**Claim Result Shape:**

```json
{
  "id": 1,
  "claim": "The original claim text from the document",
  "category": "statistic",
  "status": "verified | inaccurate | false",
  "explanation": "Why this verdict was given",
  "corrected_fact": "The accurate fact, if applicable",
  "source": "World Bank, Reuters, etc.",
  "confidence": "high | medium | low"
}
```

---

## ⚙️ How It Works (Under the Hood)

```
┌──────────┐     PDF Upload      ┌──────────────┐
│  Browser  │ ───────────────────▶│ Express API  │
│  (React)  │                     │  /api/       │
└──────────┘                     │  factcheck   │
     ▲                            └──────┬───────┘
     │                                   │
     │  SSE Stream                       ▼
     │  (real-time)          ┌───────────────────────┐
     │                       │     pdf-parse          │
     │                       │  (text extraction)     │
     │                       └───────────┬────────────┘
     │                                   │
     │                                   ▼
     │                       ┌───────────────────────┐
     │                       │  Gemini Flash Lite     │
     │                       │  (claim extraction)    │
     │                       │  responseMimeType:     │
     │                       │    application/json    │
     │                       └───────────┬────────────┘
     │                                   │
     │                                   ▼
     │                       ┌───────────────────────┐
     │                       │  Gemini Flash Lite     │
     │◀──────────────────────│  + Google Search tool  │
     │                       │  (claim verification)  │
                             └───────────────────────┘
```

1. **Upload** — The user drops a PDF on the frontend. It's sent as `multipart/form-data` to the backend.
2. **Extract** — `pdf-parse` pulls out all readable text from the PDF.
3. **Identify Claims** — Gemini `gemini-3.1-flash-lite` (low temperature, JSON output mode) scans the text and returns a structured list of verifiable claims.
4. **Verify Each Claim** — A second Gemini call, this time with the `googleSearch` tool enabled, checks each claim against live web sources. Results stream back to the browser one by one via SSE.
5. **Display** — The React frontend renders verdicts in real-time with colour-coded cards, a trust score ring, and filter tabs.

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve FactGuard:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source. Feel free to use it, modify it, and build on top of it.

---

<p align="center">
  Built with ❤️ and a healthy distrust of unverified claims.
</p>
