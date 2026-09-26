import { useRef, useState } from "react";
import ErrorState from "./components/ErrorState";
import LoadingState from "./components/LoadingState";
import PromptInput from "./components/PromptInput";
import ResultView from "./components/ResultView";
import { generateStudyMaterial } from "./lib/api";
import { parseResult } from "./lib/validateResult";

export default function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const requestId = useRef(0);

  async function generate() {
    const cleanInput = input.trim();
    if (cleanInput.length < 3) {
      setError("Please enter at least 3 characters to generate a study set.");
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      const rawResult = await generateStudyMaterial(cleanInput);
      const validResult = parseResult(rawResult);
      if (id !== requestId.current) return;
      if (!validResult) throw new Error("Invalid study data received. Please try again.");
      setResult(validResult);
    } catch (caughtError) {
      if (id !== requestId.current) return;
      setError(caughtError.message || "We couldn't generate your study set.");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      <header className="site-header">
        <p className="brand">AI Study Assistant</p>
        <div className="header-actions">
          <p>Turn notes into practice</p>
          <button
            className="theme-toggle"
            type="button"
            onClick={() => setDarkMode((value) => !value)}
            aria-pressed={darkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span aria-hidden="true">{darkMode ? "☀" : "☾"}</span>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>
      <section className="intro">
        <p className="eyebrow">Focused learning</p>
        <h1>Study smarter with a set made for you.</h1>
        <p>Paste notes or name a topic. You’ll get flashcards and a quiz—not a chat thread.</p>
      </section>
      <PromptInput input={input} onInputChange={setInput} onSubmit={generate} loading={loading} />
      <section className="output-area">
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={generate} />}
        {!loading && !error && result && <ResultView result={result} />}
        {!loading && !error && !result && <div className="empty-state"><h2>Your study set will appear here.</h2><p>Enter a topic or paste your notes to get started.</p></div>}
      </section>
    </div>
  );
}
