# Idea Coach

A conversational ideation platform that guides users from a vague idea to a clear, structured, and actionable concept through AI-powered coaching.

---

## Architecture Overview

```
idea-coach/
├── server/           # Express + TypeScript REST API
│   └── src/
│       ├── routes/        # HTTP handlers (thin — no logic)
│       │   ├── ideas.ts   # Idea generation & storage endpoints
│       │   └── chat.ts    # Session & message endpoints
│       ├── services/      # All business logic
│       │   ├── anthropic.ts      # Claude API wrapper
│       │   ├── ideaGenerator.ts  # Generates the initial idea draft
│       │   ├── chatService.ts    # Coach conversation engine
│       │   └── storage.ts        # In-memory store (swap-ready for Postgres)
│       └── types.ts       # Shared domain types
└── client/           # React + TypeScript + Vite + Tailwind
    └── src/
        ├── pages/         # Route-level components
        ├── components/    # Reusable UI components
        ├── api.ts         # Typed fetch wrapper
        └── types.ts       # Shared domain types
```

**Key design principle:** Routes are thin handlers. All logic lives in services. This makes the codebase easy to test and easy to extend.

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Frontend | React 18 + Vite | Fast DX, industry standard |
| Styling | Tailwind CSS | Utility-first, consistent spacing |
| Routing | React Router v6 | Declarative, nested layouts |
| Backend | Express + TypeScript | Lightweight, explicit |
| AI | Claude (`claude-sonnet-4-6`) | Best reasoning for structured coaching |
| Storage | In-memory Map | Zero setup; swap to Postgres by replacing `storage.ts` |

---

## Running Locally

### Prerequisites
- Node.js 18+
- An Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com)

### Setup

```bash
# 1. Install all dependencies
npm run install:all

# 2. Configure the server environment
cp server/.env.example server/.env
# Edit server/.env and add your ANTHROPIC_API_KEY

# 3. Start both server and client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

---

## API Reference

### Ideas

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/ideas/generate` | Generate a draft idea |
| `GET` | `/api/ideas` | Get all saved ideas |
| `POST` | `/api/ideas` | Save an idea from a session |
| `PATCH` | `/api/ideas/:id/rating` | Rate a saved idea (1–5) |

### Chat

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/chat/sessions` | Create session + get first coach message |
| `GET` | `/api/chat/sessions/:id` | Fetch a session with its messages |
| `POST` | `/api/chat/sessions/:id/messages` | Send a user message, get coach reply |
| `POST` | `/api/chat/sessions/:id/summary` | Generate the structured idea summary |

---

## Chatbot Design

### Conversation Framework

The coach follows a structured 5-phase flow:

```
WELCOME → TARGET_USER → CORE_PROBLEM → DIFFERENTIATOR → VALUE_PROP → COMPLETE
```

| Phase | Goal | Example question |
|-------|------|-----------------|
| WELCOME | Acknowledge idea, open conversation | "Who exactly is this for?" |
| TARGET_USER | Identify the specific user | "What's their typical situation when this problem arises?" |
| CORE_PROBLEM | Clarify the pain being solved | "How are they handling this today, and why does that fall short?" |
| DIFFERENTIATOR | Find the unique angle | "What would make someone choose this over existing alternatives?" |
| VALUE_PROP | Synthesize and confirm | "So the core value is X — does that match your thinking?" |

### System Prompt Design

The coach prompt is **phase-aware and context-injected**. On every API call, the current phase and full idea context are embedded into the system prompt. This approach:

- Keeps Claude focused and on-track
- Avoids the coach drifting into generic AI assistant behavior
- Makes phase transitions explicit and controllable

The response format is JSON:
```json
{
  "message": "coach's message to display",
  "phase": "TARGET_USER",
  "isComplete": false
}
```

The backend parses this and stores phase state server-side, so the client never needs to manage conversation logic.

### Why not rule-based?

Rule-based conversation trees break the moment a user gives an unexpected answer. A prompt-driven AI can handle open-ended, nuanced responses while still following a structured framework — the best of both approaches.

---

## Production Improvements

### Data persistence
Replace `storage.ts` with a Postgres adapter (e.g. Prisma). The interface is the same — `getSession`, `setSession`, `getAllIdeas`, etc.

### Authentication
Add JWT-based auth middleware. Sessions and ideas should be scoped to a user ID. The storage service accepts a `userId` parameter — just uncomment and wire it.

### Rate limiting
Add `express-rate-limit` to the `/api/chat/sessions/:id/messages` endpoint to prevent API cost abuse.

### Streaming responses
Replace `messages.create` with `messages.stream` from the Anthropic SDK for real-time token streaming to the frontend. Improves perceived latency significantly.

### Session expiry
Add TTL to in-memory sessions (or DB row expiry) to clean up abandoned sessions.

### Error monitoring
Add Sentry or similar. The global Express error handler is the right injection point.

### Export
Add a "Export as PDF/Markdown" feature for the idea summary card.
