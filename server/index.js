import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config({ path: "server/.env" });
dotenv.config();

const app = express();
const port = Number(process.env.PORT) || 3001;

// Get the current file and server directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: "100kb" }));

function buildPrompt(userInput) {
  return `You are a study-content generator. Return ONLY valid JSON: no Markdown, code fences, or text outside JSON.

Return exactly this shape:
{
  "topic": "string",
  "flashcards": [{ "question": "string", "answer": "string" }],
  "quiz": [{
    "question": "string",
    "options": ["string", "string", "string", "string"],
    "correctAnswer": "string",
    "explanation": "string"
  }]
}

Rules:
- Generate 3 to 8 flashcards and 3 to 8 quiz questions.
- Every question has exactly four distinct options.
- correctAnswer exactly matches one option.
- Do not use empty strings.
- Keep all content educational and based on the study input.

Study input:
${userInput}`;
}

function isFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function validateStudySet(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return false;
  if (!isFilledString(data.topic)) return false;

  if (
    !Array.isArray(data.flashcards) ||
    data.flashcards.length < 3 ||
    data.flashcards.length > 8
  ) {
    return false;
  }

  if (
    !Array.isArray(data.quiz) ||
    data.quiz.length < 3 ||
    data.quiz.length > 8
  ) {
    return false;
  }

  const validCards = data.flashcards.every(
    (card) =>
      card &&
      isFilledString(card.question) &&
      isFilledString(card.answer)
  );

  const validQuestions = data.quiz.every(
    (question) =>
      question &&
      isFilledString(question.question) &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(isFilledString) &&
      new Set(question.options).size === 4 &&
      isFilledString(question.correctAnswer) &&
      question.options.includes(question.correctAnswer) &&
      isFilledString(question.explanation)
  );

  return validCards && validQuestions;
}

app.post("/api/generate", async (req, res) => {
  const input =
    typeof req.body?.input === "string"
      ? req.body.input.trim()
      : "";

  if (input.length < 3 || input.length > 5000) {
    return res.status(400).json({
      success: false,
      error: "Study input must be between 3 and 5000 characters."
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      error: "The server is missing its LLM configuration."
    });
  }

  try {
    const model =
      process.env.GEMINI_MODEL || "gemini-2.5-flash";

    const providerResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
        model
      )}:generateContent`,
      {
        method: "POST",
        headers: {
          "x-goog-api-key": process.env.GEMINI_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: buildPrompt(input)
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!providerResponse.ok) {
      throw new Error("Provider request failed");
    }

    const providerData = await providerResponse.json();

    const content =
      providerData?.candidates?.[0]?.content?.parts
        ?.map((part) => part.text || "")
        .join("");

    let studySet;

    try {
      studySet = JSON.parse(content);
    } catch {
      return res.status(502).json({
        success: false,
        error: "The AI returned invalid study data."
      });
    }

    if (!validateStudySet(studySet)) {
      return res.status(502).json({
        success: false,
        error: "The AI returned invalid study data."
      });
    }

    return res.json({
      success: true,
      data: studySet
    });
  } catch {
    return res.status(502).json({
      success: false,
      error:
        "Unable to generate study material. Please try again."
    });
  }
});


const distPath = path.join(__dirname, "../dist");

app.use(express.static(distPath));


app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`Study Assistant running on port ${port}`);
});