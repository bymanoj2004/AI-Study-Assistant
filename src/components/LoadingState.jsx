export default function LoadingState() {
  return (
    <section className="status-card" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <div>
        <h2>Generating your study set…</h2>
        <p>Creating flashcards and quiz questions.</p>
      </div>
    </section>
  );
}
