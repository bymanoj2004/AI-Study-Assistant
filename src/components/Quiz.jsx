import { useEffect, useState } from "react";
import QuizQuestion from "./QuizQuestion";

export default function Quiz({ questions }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [isRetry, setIsRetry] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState(questions);

  useEffect(() => {
    resetQuiz(questions, false);
  }, [questions]);

  function resetQuiz(nextQuestions, retry) {
    setActiveQuestions(nextQuestions);
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswered(false);
    setScore(0);
    setWrongAnswers([]);
    setFinished(false);
    setIsRetry(retry);
  }

  function submitAnswer() {
    if (!selectedAnswer || answered) return;
    const question = activeQuestions[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
      setScore((value) => value + 1);
    } else {
      setWrongAnswers((answers) => [...answers, question]);
    }
    setAnswered(true);
  }

  function nextQuestion() {
    if (currentQuestion === activeQuestions.length - 1) {
      setFinished(true);
      return;
    }
    setCurrentQuestion((value) => value + 1);
    setSelectedAnswer("");
    setAnswered(false);
  }

  if (finished) {
    const wrongCount = activeQuestions.length - score;
    return (
      <section className="content-section quiz" aria-labelledby="quiz-title">
        <p className="eyebrow">Test yourself</p>
        <h2 id="quiz-title">Quiz complete</h2>
        <div className="score-card">
          <strong>{score} / {activeQuestions.length}</strong>
          <span>{isRetry ? "Retry score" : "Score"}</span>
        </div>
        <p>Correct: {score} · Wrong: {wrongCount}</p>
        {wrongAnswers.length > 0 && (
          <button className="primary-button" type="button" onClick={() => resetQuiz(wrongAnswers, true)}>
            Retry Wrong Answers
          </button>
        )}
      </section>
    );
  }

  const question = activeQuestions[currentQuestion];
  const isCorrect = selectedAnswer === question.correctAnswer;
  return (
    <section className="content-section quiz" aria-labelledby="quiz-title">
      <div className="section-heading">
        <div><p className="eyebrow">Test yourself {isRetry && "· Retry"}</p><h2 id="quiz-title">Quiz</h2></div>
        <p>Question {currentQuestion + 1} / {activeQuestions.length}</p>
      </div>
      <QuizQuestion question={question} selectedAnswer={selectedAnswer} onSelect={setSelectedAnswer} answered={answered} />
      {answered && (
        <div className={`answer-feedback ${isCorrect ? "is-correct" : "is-incorrect"}`} aria-live="polite">
          <strong>{isCorrect ? "Correct!" : `Incorrect. Correct answer: ${question.correctAnswer}`}</strong>
          <p>{question.explanation}</p>
        </div>
      )}
      {answered ? (
        <button className="primary-button" type="button" onClick={nextQuestion}>
          {currentQuestion === activeQuestions.length - 1 ? "See Results" : "Next Question"}
        </button>
      ) : (
        <button className="primary-button" type="button" onClick={submitAnswer} disabled={!selectedAnswer}>Submit Answer</button>
      )}
    </section>
  );
}
