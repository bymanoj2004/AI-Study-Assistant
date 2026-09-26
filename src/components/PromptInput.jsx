export default function PromptInput({ input, onInputChange, onSubmit, loading }) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit();
  }

  const isEmpty = !input.trim();

  return (
    <form className="prompt-form" onSubmit={handleSubmit}>
      <label htmlFor="study-input">What do you want to study?</label>
      <textarea
        id="study-input"
        value={input}
        onChange={(event) => onInputChange(event.target.value)}
        placeholder="Paste your notes or enter a topic..."
        rows="6"
        maxLength="5000"
        disabled={loading}
      />
      <p className="input-hint">Enter a topic, notes, or exam material (3–5000 characters).</p>
      <button className="primary-button" type="submit" disabled={loading || isEmpty}>
        {loading ? "Generating…" : "Generate Study Set"}
      </button>
    </form>
  );
}
