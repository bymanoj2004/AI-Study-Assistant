Study Assistant --- Frontend Internship Assignment Specification

1. Project Overview

Project Name

AI Study Assistant

Project Type

AI-powered structured-data learning tool

Primary Objective

Build a small React application where a student enters free-form study
material or a topic and the application uses an LLM to generate
structured flashcards and a quiz.

The important point is that this is an interactive study tool, NOT a
chatbot.

The application must:

Accept free-form text from the user.

Send the text to a backend.

Ask an LLM for strict JSON output.

Parse and validate the response.

Render the structured result as React components.

Allow the student to flip flashcards.

Allow the student to answer quiz questions.

Track wrong answers.

Allow the student to retry wrong answers.

Clearly handle malformed JSON, wrong data shape, empty results, slow
requests, and failed requests.

Keep the LLM API key on the backend.

The project should intentionally use simple React concepts such as:

useState

useEffect only when actually needed

useRef

Functional components

Props

Conditional rendering

Array .map()

Basic event handlers

Do not introduce complex state-management libraries, advanced React
patterns, or unnecessary architecture.

2. Assignment Alignment

This project directly follows the supplied Frontend Internship
Assignment requirements.

The assignment emphasizes:

React with hooks and functional components.

A free-form text input.

A real LLM API.

A backend/serverless proxy for the API key.

Structured JSON rather than free-form AI text.

Validation before rendering.

Interactive UI driven by React state.

Explicit loading, error, empty, and failure states.

Protection against stale responses.

A project that is clearly not a chatbot.

The application therefore must never display the model response as a
chat conversation.

Instead, the AI response becomes:

Flashcards
    ↓
Flip / Previous / Next
    ↓
Quiz
    ↓
Answer
    ↓
Score
    ↓
Retry Wrong Answers

3. Scope

Required MVP

The application must support:

Input

A student can enter:

A topic

Notes

A concept

Study material

Exam-related text

Example:

Explain Python OOP concepts including classes,
objects, inheritance, encapsulation and polymorphism.

AI Output

The backend requests structured JSON containing:

Topic

Flashcards

Quiz questions

Interactive Flashcards

The student can:

View one flashcard at a time.

Flip a card to reveal the answer.

Move to the next card.

Move to the previous card.

See current progress.

Example:

Card 2 / 5

What is inheritance?
--------------------
[ Flip Card ]

After flipping:

Card 2 / 5

Inheritance allows a class to reuse
properties and methods from another class.

[ Previous ] [ Next ]

Interactive Quiz

The student can:

Read a question.

Select one answer.

Submit the answer.

See whether it is correct.

Continue to the next question.

See the final score.

Retry Wrong Answers

After completing the quiz:

Score: 3 / 5

Correct: 3
Wrong: 2

[ Retry Wrong Answers ]

The retry mode should contain only questions answered incorrectly.

4. Non-Goals

Do NOT build:

A chatbot.

Chat history.

Chat bubbles.

User accounts.

Authentication.

Database.

RAG.

LangGraph.

Multi-agent systems.

Vector databases.

Web scraping.

Complex global state management.

Admin dashboard.

Payment system.

File upload system unless there is extra time.

Streaming unless the MVP is already complete.

The goal is a clean, reliable 8-hour assignment, not a
production-scale platform.

5. Recommended Technology

Frontend

React

Vite

JavaScript

React Hooks

CSS

Optional:

Tailwind CSS

Do not use TypeScript unless you already know it well.

Backend

Node.js

Express.js

The backend exists mainly to:

Receive the student's input.

Build the LLM prompt.

Call the LLM API.

Return the structured result.

LLM

Use any provider with a suitable free/low-cost option.

Recommended:

Groq

Gemini

OpenRouter

The model provider does not determine the quality of the project. The
important part is structured output and failure handling.

6. Simple Project Structure

Use a small structure that is easy to explain during the interview.

study-assistant/
│
├── src/
│   ├── components/
│   │   ├── PromptInput.jsx
│   │   ├── FlashcardDeck.jsx
│   │   ├── Flashcard.jsx
│   │   ├── Quiz.jsx
│   │   ├── QuizQuestion.jsx
│   │   ├── ResultView.jsx
│   │   ├── LoadingState.jsx
│   │   └── ErrorState.jsx
│   │
│   ├── lib/
│   │   ├── api.js
│   │   └── validateResult.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── server/
│   └── index.js
│
├── .env.example
├── README.md
├── package.json
└── spec.md

Important

The frontend must never call the LLM provider directly.

Correct:

React
  ↓
/api/generate
  ↓
Express backend
  ↓
LLM API

Incorrect:

React
  ↓
LLM API

The API key must remain on the server.

7. Data Shape

Design the data shape before writing the prompt.

The expected result is:

{
  "topic": "Python OOP",
  "flashcards": [
    {
      "question": "What is a class?",
      "answer": "A class is a blueprint for creating objects."
    }
  ],
  "quiz": [
    {
      "question": "Which keyword is used to create a class in Python?",
      "options": [
        "class",
        "object",
        "def",
        "new"
      ],
      "correctAnswer": "class",
      "explanation": "The class keyword defines a class in Python."
    }
  ]
}

8. Data Rules

The result must satisfy these rules.

Root object

Required:

topic
flashcards
quiz

Topic

Must be:

string

Must not be empty.

Flashcards

Must be:

array

Recommended:

3–8 flashcards

Each flashcard requires:

question: string
answer: string

Neither field may be empty.

Quiz

Must be:

array

Recommended:

3–8 questions

Each question requires:

question: string
options: array of 4 strings
correctAnswer: string
explanation: string

correctAnswer must exactly match one of the options.

This validation is important because the UI should never assume that the
AI returned correct data.

9. Strict LLM Prompt

The backend should send a strict prompt similar to:

const prompt = `
You are a study-content generator.

Return ONLY valid JSON.
Do not return Markdown.
Do not return code fences.
Do not add explanations outside the JSON.

Return exactly this structure:

{
  "topic": "string",
  "flashcards": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": "string",
      "explanation": "string"
    }
  ]
}

Rules:
- Generate 3 to 8 flashcards.
- Generate 3 to 8 quiz questions.
- Every quiz question must have exactly 4 options.
- correctAnswer must exactly match one option.
- Do not return empty strings.
- Keep the content educational and based on the user's input.

Study input:
${userInput}
`;

The prompt should be kept in one clear place so it is easy to understand
and modify.

10. API Contract

Frontend → Backend

Request

POST /api/generate
Content-Type: application/json

Body:

{
  "input": "Python OOP concepts"
}

Success response

{
  "success": true,
  "data": {
    "topic": "Python OOP",
    "flashcards": [],
    "quiz": []
  }
}

Failure response

{
  "success": false,
  "error": "Unable to generate study material."
}

The frontend should never depend on undocumented response fields.

11. Frontend API Function

Create one function responsible for talking to the backend.

Example:

export async function generateStudyMaterial(input) {
  const response = await fetch("/api/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ input })
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  const result = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || "Invalid response");
  }

  return result.data;
}

This keeps API communication separate from UI components.

12. Defensive Parsing and Validation

This is one of the most important parts of the assignment.

AI output must never go directly into the UI.

Create:

src/lib/validateResult.js

Example:

export function parseResult(raw) {
  try {
    const data = JSON.parse(raw);

    if (!data || typeof data !== "object") {
      return null;
    }

    if (typeof data.topic !== "string" || !data.topic.trim()) {
      return null;
    }

    if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
      return null;
    }

    if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
      return null;
    }

    for (const card of data.flashcards) {
      if (
        typeof card.question !== "string" ||
        typeof card.answer !== "string" ||
        !card.question.trim() ||
        !card.answer.trim()
      ) {
        return null;
      }
    }

    for (const question of data.quiz) {
      if (
        typeof question.question !== "string" ||
        !Array.isArray(question.options) ||
        question.options.length !== 4 ||
        typeof question.correctAnswer !== "string" ||
        typeof question.explanation !== "string"
      ) {
        return null;
      }

      if (!question.options.includes(question.correctAnswer)) {
        return null;
      }
    }

    return data;
  } catch {
    return null;
  }
}

If parsing or validation fails:

raw AI output
      ↓
parseResult()
      ↓
null
      ↓
ErrorState

Never render malformed AI data.

13. Required Stale Response Protection

The assignment specifically provides a pattern for preventing an older
request from overwriting a newer request.

Use useRef.

Example:

const requestId = useRef(0);

async function generate(input) {
  const id = ++requestId.current;

  try {
    setLoading(true);
    setError("");

    const result = await generateStudyMaterial(input);

    if (id !== requestId.current) {
      return;
    }

    setResult(result);
  } catch (error) {
    if (id !== requestId.current) {
      return;
    }

    setError("Could not generate study material.");
  } finally {
    if (id === requestId.current) {
      setLoading(false);
    }
  }
}

Why this is required

Suppose:

Request 1 → slow
Request 2 → fast

Request 2 finishes first.

The UI should show Request 2.

If Request 1 finishes later, it must NOT overwrite Request 2.

The requestId check prevents that bug.

This is a simple but highly relevant React concept for this assignment.

14. Main React State

Keep state simple.

Recommended App.jsx state:

const [input, setInput] = useState("");
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

Flashcard state:

const [currentCard, setCurrentCard] = useState(0);
const [isFlipped, setIsFlipped] = useState(false);

Quiz state:

const [currentQuestion, setCurrentQuestion] = useState(0);
const [selectedAnswer, setSelectedAnswer] = useState("");
const [score, setScore] = useState(0);
const [wrongAnswers, setWrongAnswers] = useState([]);
const [quizFinished, setQuizFinished] = useState(false);

Retry state can reuse the same quiz component.

Do not introduce Redux, Zustand, Context, or another global state
library for this project.

15. Component Responsibilities

PromptInput.jsx

Responsibilities:

Text input/textarea.

Submit button.

Disable submit while loading.

Prevent empty submissions.

Example:

What do you want to study?

[ Paste your notes or enter a topic... ]

              [ Generate Study Set ]

LoadingState.jsx

Display while waiting:

Generating your study set...

Creating flashcards and quiz questions.

The UI must not appear frozen.

ErrorState.jsx

Display:

Something went wrong.

We couldn't create a valid study set.

[ Try Again ]

Different errors can use friendly messages:

Invalid AI response.

Failed request.

Empty response.

Network error.

Server error.

Do not expose raw stack traces to the user.

16. Flashcard Component

Flashcard.jsx

Simple behavior:

Question
   ↓
Click
   ↓
Answer

Use React state:

const [flipped, setFlipped] = useState(false);

Example:

<button onClick={() => setFlipped(!flipped)}>
  {flipped ? card.answer : card.question}
</button>

The exact visual design is flexible.

The important part is that the card is actually interactive.

17. Flashcard Deck

FlashcardDeck.jsx

State:

const [currentCard, setCurrentCard] = useState(0);

Show:

2 / 5

Controls:

[ Previous ] [ Flip ] [ Next ]

Rules:

Previous cannot go below 0.

Next cannot go beyond the final card.

Starting a new card should reset the flip state.

The displayed card must come from React state.

18. Quiz Component

The quiz should be a real interactive component.

Example:

Question 2 / 5

Which keyword creates a class in Python?

○ object
○ class
○ def
○ new

[ Submit Answer ]

After submission:

Correct!

The class keyword is used to define a class.

[ Next Question ]

Or:

Incorrect.

Correct answer: class

[ Next Question ]

Do not allow the user to repeatedly increase the score by clicking
Submit multiple times.

Use state such as:

const [answered, setAnswered] = useState(false);

19. Quiz Scoring

When the user submits an answer:

if (selectedAnswer === question.correctAnswer) {
  setScore(prevScore => prevScore + 1);
} else {
  setWrongAnswers(prev => [...prev, question]);
}

The quiz should show the final result:

Quiz Complete

Score: 4 / 5

Correct: 4
Wrong: 1

[ Retry Wrong Answers ]

20. Retry Wrong Answers

This is an important interactive feature.

If the student gets:

Q2
Q4

wrong, clicking:

Retry Wrong Answers

should create a new quiz session containing only:

Q2
Q4

The app does not need another LLM call.

This demonstrates that the application is using structured data
intelligently rather than simply printing AI output.

21. Result Flow

The main application flow should be:

User enters topic/notes
        ↓
PromptInput
        ↓
Generate button
        ↓
LoadingState
        ↓
Backend API
        ↓
LLM
        ↓
JSON response
        ↓
Parse + Validate
        ↓
Valid?
   ↙          ↘
 NO            YES
 ↓              ↓
ErrorState    ResultView
                 ↓
          ┌──────┴──────┐
          ↓             ↓
      Flashcards       Quiz
          ↓             ↓
       Flip cards    Answer questions
                        ↓
                     Score
                        ↓
                 Retry wrong answers

22. Failure Handling

Every realistic failure must have a visible state.

22.1 Malformed JSON

Example AI response:

Here are your flashcards:
...

instead of JSON.

Expected behavior:

ErrorState

Never crash.

22.2 Wrong JSON Shape

Example:

{
  "questions": []
}

instead of:

{
  "topic": "...",
  "flashcards": [],
  "quiz": []
}

Expected behavior:

Invalid study data received.
[ Try Again ]

22.3 Empty Response

If the AI returns:

{
  "topic": "",
  "flashcards": [],
  "quiz": []
}

Treat it as invalid.

Do not display an empty application screen.

22.4 Slow Response

While waiting:

Generating your study set...

Disable the Generate button.

Do not let the user think the application has crashed.

22.5 Failed Request

If the backend or LLM fails:

We couldn't generate your study set.

Please try again.

[ Retry ]

22.6 Stale Response

Use:

useRef()

with a request ID.

A previous slow request must never replace a newer result.

23. Empty States

Before the first generation:

Your study set will appear here.

Enter a topic or paste your notes to get started.

After clearing the result:

No study set generated yet.

These states should be intentional rather than leaving a blank page.

24. UI Design

Keep the design simple and clean.

Suggested layout:

------------------------------------------------
|              AI STUDY ASSISTANT              |
------------------------------------------------

What do you want to study?

[                                      ]
[       Paste notes or enter topic     ]
[                                      ]

              [ Generate ]

------------------------------------------------

                Study Set
                Python OOP

        ┌───────────────────────┐
        │                       │
        │     Flashcard         │
        │                       │
        │   What is a class?    │
        │                       │
        └───────────────────────┘

        [ Previous ] [ Flip ] [ Next ]

------------------------------------------------

                  Quiz

Question 1 / 5

Which keyword creates a class?

○ class
○ object
○ def
○ new

             [ Submit ]

------------------------------------------------

The UI should work on:

Desktop

Tablet

Mobile

25. React Concepts Demonstrated

The project should intentionally demonstrate simple React concepts
clearly.

useState

Used for:

Input

Loading

Error

Generated result

Current flashcard

Flip state

Current quiz question

Selected answer

Score

Wrong answers

useRef

Used for:

Stale response protection.

Props

Example:

<Flashcard
  card={card}
  flipped={isFlipped}
  onFlip={handleFlip}
/>

Conditional Rendering

Example:

{loading && <LoadingState />}

{error && <ErrorState message={error} />}

{result && <ResultView result={result} />}

Array Mapping

Example:

{question.options.map(option => (
  <button key={option}>
    {option}
  </button>
))}

This is enough React complexity for the assignment.

26. Backend Responsibilities

The Express backend should remain small.

Example flow:

POST /api/generate
        ↓
Validate input
        ↓
Create prompt
        ↓
Call LLM
        ↓
Receive response
        ↓
Return structured data

The API key must exist only in:

server/.env

Example:

LLM_API_KEY=your_key_here

Never:

VITE_LLM_API_KEY=...

Never put the secret directly in frontend code.

27. Backend Input Validation

Reject:

empty input

Example:

if (!input || !input.trim()) {
  return res.status(400).json({
    success: false,
    error: "Study input is required."
  });
}

Optional reasonable length limit:

Minimum: 3 characters
Maximum: 5000 characters

This prevents obviously invalid requests.

28. Backend JSON Handling

The backend should make a best effort to request JSON-only output.

However, never assume the LLM will always obey.

The application must still validate the result.

Preferred flow:

LLM response
     ↓
Extract JSON if necessary
     ↓
JSON.parse()
     ↓
Validate structure
     ↓
Return only valid structured data

If invalid:

{
  "success": false,
  "error": "The AI returned invalid study data."
}

29. Security

Minimum security requirements:

API key only on backend.

Do not commit .env.

Include .env.example.

Validate user input.

Do not expose provider API errors containing secrets.

Do not put the LLM API key in frontend JavaScript.

30. Testing Checklist

Before submission, manually test:

Normal case

Enter a topic.

Generate study set.

Flashcards appear.

Flashcards flip.

Previous/Next work.

Quiz works.

Score appears.

Retry wrong answers works.

Empty input

Click Generate with no input.

Expected:

Validation message.

Loading

Verify:

Loading state appears.
Generate button is disabled.

Invalid response

Simulate or temporarily mock malformed JSON.

Expected:

ErrorState

Wrong shape

Test missing:

flashcards

Expected:

ErrorState

Stale response

Trigger two requests quickly.

Expected:

Only the newest request updates the UI.

Mobile

Test around:

375px width

The application should remain usable.

31. Recommended 8-Hour Development Plan

Hour 1 --- Setup

Create Vite React project.

Create Express server.

Create basic folders.

Create .env.

Confirm frontend ↔ backend communication.

Hour 2 --- Data + AI

Define JSON shape.

Create prompt.

Connect LLM API.

Return response from backend.

Hour 3 --- Validation

Implement parseResult.

Validate flashcards.

Validate quiz.

Handle invalid JSON.

Handle wrong shape.

Hour 4 --- Flashcards

Create Flashcard.

Create FlashcardDeck.

Add flip.

Add Previous/Next.

Add progress.

Hour 5 --- Quiz

Render options.

Select answer.

Submit.

Score.

Show explanation.

Finish screen.

Hour 6 --- Retry + Failure Handling

Retry wrong answers.

Loading state.

Error state.

Empty state.

Stale response protection using useRef.

Hour 7 --- UI Polish

Responsive layout.

Better spacing.

Buttons.

Cards.

Mobile testing.

Accessibility basics.

Hour 8 --- Submission

README.

AI usage note.

Known limitations.

Time spent.

Git commits.

Screen recording.

Final testing.

If the core works before 8 hours, stop adding features and improve
reliability.

32. Stretch Goals

Only implement these after the MVP is stable.

Possible additions:

Difficulty selection.

Number of flashcards selection.

Dark mode.

Small animations.

Keyboard navigation.

Save the current study set in local storage.

Generate a new quiz from the same flashcards.

Do not sacrifice the core failure handling for stretch goals.

33. README Requirements

The README should contain:

Project Description

Explain:

AI Study Assistant converts free-form study input into
structured flashcards and an interactive quiz.

Features

AI-generated flashcards.

Flip-card interaction.

Interactive quiz.

Score tracking.

Retry wrong answers.

Structured JSON validation.

Loading/error/empty states.

Stale response protection.

Backend API key protection.

Setup

Example:

npm install
npm run dev

If frontend and backend have separate commands, clearly document both.

Environment Variables

LLM_API_KEY=

Explain that the real key belongs on the server.

AI Usage Note

Be honest about AI assistance.

Example:

AI tools were used for brainstorming, debugging, and reviewing
implementation ideas. The final project structure, logic, and
implementation were reviewed and understood by the author.

Known Limitations

Examples:

LLM output can still occasionally fail validation.

Content quality depends on the selected model.

No authentication or persistence.

No database.

Study sets are temporary.

Time Spent

State the actual time spent.

Do not claim exactly 8 hours unless that is true.

34. Demo Recording

The short demo should show:

Open the application.

Enter study input.

Click Generate.

Show loading state.

Show generated flashcards.

Flip a flashcard.

Move between cards.

Start quiz.

Answer questions.

Show score.

Retry wrong answers.

Briefly show the code for:

JSON validation

backend API call

useRef stale-response protection

The demo should emphasize that this is a structured interactive tool,
not a chatbot.

35. Interview Explanation

Be prepared to explain the following.

Why is it not a chatbot?

Because the AI response is not displayed as conversational text.

It is converted into structured data:

JSON
 ↓
Validation
 ↓
Flashcard component
 ↓
Quiz component

The user interacts with the generated study material.

Why validate AI output?

Because an LLM response cannot be trusted to always have the expected
structure.

Validation prevents:

crashes

missing fields

invalid quiz options

empty content

unexpected AI output

Why use a backend?

To keep the LLM API key out of the browser.

Why use useRef?

To identify the latest request and prevent an older, slower request from
overwriting newer data.

Why use simple React?

The assignment evaluates whether the developer understands React
fundamentals and can build reliable AI-powered UI.

Simple state is easier to understand, debug, and explain.

36. Important Implementation Principles

Principle 1 --- Structured data first

Do not start by designing a chatbot.

Start with:

JSON shape

Then build the UI around that shape.

Principle 2 --- Validate before rendering

Always:

AI response
 ↓
parse
 ↓
validate
 ↓
React UI

Never:

AI response
 ↓
React UI

Principle 3 --- UI state must represent real application state

Examples:

loading
error
empty
flashcard index
flip state
selected answer
score
wrong answers

Principle 4 --- Fail gracefully

Every external AI request can fail.

The application should remain usable.

Principle 5 --- Keep the implementation explainable

Avoid adding libraries simply because they are available.

A small React application with clear state and components is preferred.

37. Final Acceptance Criteria

The project is complete when all of these are true:

React functional components are used.

React hooks are used.

User enters information through free-form text.

A real LLM API is used.

LLM API key is protected by a backend.

AI output is requested as JSON.

JSON is parsed.

JSON structure is validated.

Invalid JSON does not crash the application.

Wrong-shaped JSON does not reach the UI.

Empty responses are handled.

Loading state is visible.

Failed requests show an error.

Retry is available.

Stale responses are prevented using useRef.

Flashcards are interactive.

Quiz is interactive.

Score is calculated.

Wrong answers can be retried.

The application is clearly not a chatbot.

The UI works on mobile.

README is included.

AI usage is honestly documented.

A short demo recording is included.

The project stays within the approximately 8-hour target.

38. Final Product Definition

The final application should feel like:

"Paste what you want to study → AI converts it into a structured
study set → interact with flashcards → take a quiz → retry
mistakes."

It should NOT feel like:

"Type a message → receive an AI message → type another message."

The first demonstrates structured AI product development.

The second is a chatbot.

For this assignment, the first approach 