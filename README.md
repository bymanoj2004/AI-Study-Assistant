# AI Study Assistant

AI Study Assistant is a responsive React application that transforms a student's free-form notes or a study topic into a structured learning set: interactive flashcards and a scored quiz. It uses the Gemini API through a protected Express backend and is intentionally designed as a learning workflow, not a chatbot.

## Project objective

The project demonstrates how an AI-powered interface can safely turn unstructured user input into reliable, interactive UI. Rather than rendering an LLM response directly, the application validates a defined JSON contract before displaying the content.

## Features

- Generate a study set from a topic, revision notes, or exam material
- Review one flashcard at a time with flip, previous, next, and progress controls
- Complete a multiple-choice quiz with immediate feedback and explanations
- Track score and retry only the questions answered incorrectly
- Display intentional empty, loading, validation-error, and request-error states
- Prevent stale asynchronous requests from overwriting newer results using `useRef`
- Validate model output on the server and again in the client before rendering
- Keep the Gemini API key exclusively on the backend
- Support desktop, tablet, and mobile layouts

## Technology stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| AI provider | Google Gemini API |
| Configuration | dotenv |

## Architecture

```text
React client → POST /api/generate → Express server → Gemini API
                                      ↓
                         Parse and validate JSON response
                                      ↓
                         Flashcard and quiz UI components
```

The browser never communicates with Gemini directly and never receives the API key.

## Local setup

### Prerequisites

- Node.js 18 or later
- A Gemini API key from Google AI Studio

### Installation

1. Install the project dependencies.

   ```bash
   npm install
   ```

2. Copy `.env.example` to `server/.env`.

3. Add your Gemini API key to `server/.env`.

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   GEMINI_MODEL=gemini-2.5-flash
   PORT=3001
   ```

4. Start the Express backend in one terminal.

   ```bash
   npm run server
   ```

5. Start the Vite frontend in a second terminal.

   ```bash
   npm run dev
   ```

6. Open the local URL printed by Vite, typically `http://localhost:5173`.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run server` | Start the Express API server on port 3001 |
| `npm run build` | Create a production frontend build |
| `npm run preview` | Preview the production frontend build |

## API contract

### `POST /api/generate`

Request body:

```json
{ "input": "Explain Python OOP concepts." }
```

Successful response:

```json
{
  "success": true,
  "data": {
    "topic": "Python OOP",
    "flashcards": [{ "question": "What is a class?", "answer": "A blueprint for objects." }],
    "quiz": [{ "question": "...", "options": ["..."], "correctAnswer": "...", "explanation": "..." }]
  }
}
```

The backend rejects empty or oversized input and returns only validated study-set data. The frontend handles invalid and failed responses gracefully.

## Validation and reliability

The Gemini prompt requests JSON only, but model output is never assumed to be correct. The backend parses and validates required fields, non-empty content, flashcard structure, quiz option count, unique options, and answer-option consistency. The frontend repeats validation as a final guard before rendering. A request ID stored in `useRef` ensures a slow earlier request cannot replace a more recent result.

## Security

- Store `GEMINI_API_KEY` only in `server/.env`.
- Do not commit `server/.env` or expose the key with a `VITE_` variable.
- Provider failures are returned as friendly application errors; raw provider details and secrets are not exposed to users.

## Testing checklist

- Generate a study set from normal notes or a topic
- Confirm flashcard flip and navigation controls
- Complete the quiz and retry incorrectly answered questions
- Test empty input and visible loading state
- Test an invalid model response or failed network request
- Submit two requests quickly and confirm only the latest result appears
- Check usability at a 375px viewport width

## Known limitations

- Generated content quality depends on the selected Gemini model and the supplied study material.
- Invalid model output is rejected rather than automatically repaired.
- Study sets are session-only; the application has no authentication, database, or persistence layer.

## AI assistance disclosure

AI tools were used for ideation, implementation support, debugging, and review. The final project structure, behavior, and implementation should be reviewed and understood by the submitting developer.
