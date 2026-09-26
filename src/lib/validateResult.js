const isFilledString = (value) => typeof value === "string" && value.trim().length > 0;

export function validateResult(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return null;
  if (!isFilledString(data.topic)) return null;
  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) return null;
  if (!Array.isArray(data.quiz) || data.quiz.length === 0) return null;

  const cardsAreValid = data.flashcards.every(
    (card) => card && isFilledString(card.question) && isFilledString(card.answer)
  );
  const quizIsValid = data.quiz.every(
    (question) =>
      question &&
      isFilledString(question.question) &&
      Array.isArray(question.options) &&
      question.options.length === 4 &&
      question.options.every(isFilledString) &&
      isFilledString(question.correctAnswer) &&
      isFilledString(question.explanation) &&
      question.options.includes(question.correctAnswer)
  );

  return cardsAreValid && quizIsValid ? data : null;
}

// Supports a raw model response when needed, as well as already-parsed API data.
export function parseResult(raw) {
  if (typeof raw === "string") {
    try {
      return validateResult(JSON.parse(raw));
    } catch {
      return null;
    }
  }
  return validateResult(raw);
}
