export default function Flashcard({ card, flipped, onFlip }) {
  return (
    <button className={`flashcard ${flipped ? "flipped" : ""}`} type="button" onClick={onFlip}>
      <span className="card-side-label">{flipped ? "Answer" : "Question"}</span>
      <span className="card-content">{flipped ? card.answer : card.question}</span>
      <span className="card-action">Click to flip</span>
    </button>
  );
}
