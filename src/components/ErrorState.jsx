export default function ErrorState({ message, onRetry }) {
  return (
    <section className="status-card error-state" role="alert">
      <div>
        <h2>Something went wrong</h2>
        <p>{message || "We couldn't create a valid study set."}</p>
        <button className="secondary-button" type="button" onClick={onRetry}>
          Try Again
        </button>
      </div>
    </section>
  );
}
