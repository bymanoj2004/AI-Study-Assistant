import FlashcardDeck from "./FlashcardDeck";
import Quiz from "./Quiz";

export default function ResultView({ result }) {
  return (
    <main className="study-set">
      <header className="study-set-header">
        <p className="eyebrow">Your study set</p>
        <h1>{result.topic}</h1>
      </header>
      <FlashcardDeck cards={result.flashcards} />
      <Quiz questions={result.quiz} />
    </main>
  );
}
