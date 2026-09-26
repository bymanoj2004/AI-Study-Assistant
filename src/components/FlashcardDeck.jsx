import { useEffect, useState } from "react";
import Flashcard from "./Flashcard";

export default function FlashcardDeck({ cards }) {
  const [currentCard, setCurrentCard] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setCurrentCard(0);
    setFlipped(false);
  }, [cards]);

  function changeCard(nextIndex) {
    setCurrentCard(nextIndex);
    setFlipped(false);
  }

  return (
    <section className="content-section" aria-labelledby="flashcards-title">
      <div className="section-heading">
        <div><p className="eyebrow">Review</p><h2 id="flashcards-title">Flashcards</h2></div>
        <p>{currentCard + 1} / {cards.length}</p>
      </div>
      <Flashcard card={cards[currentCard]} flipped={flipped} onFlip={() => setFlipped((value) => !value)} />
      <div className="deck-controls">
        <button className="secondary-button" type="button" onClick={() => changeCard(currentCard - 1)} disabled={currentCard === 0}>Previous</button>
        <button className="secondary-button" type="button" onClick={() => setFlipped((value) => !value)}>Flip</button>
        <button className="secondary-button" type="button" onClick={() => changeCard(currentCard + 1)} disabled={currentCard === cards.length - 1}>Next</button>
      </div>
    </section>
  );
}
