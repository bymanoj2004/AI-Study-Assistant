export default function QuizQuestion({ question, selectedAnswer, onSelect, answered }) {
  return (
    <div className="quiz-question">
      <h3>{question.question}</h3>
      <div className="options" role="radiogroup" aria-label="Answer options">
        {question.options.map((option) => {
          const selected = selectedAnswer === option;
          const correct = answered && option === question.correctAnswer;
          const incorrect = answered && selected && !correct;
          return (
            <button
              className={`option ${selected ? "selected" : ""} ${correct ? "correct" : ""} ${incorrect ? "incorrect" : ""}`}
              type="button"
              role="radio"
              aria-checked={selected}
              key={option}
              disabled={answered}
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
