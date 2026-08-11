"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="error-state">
      <p className="eyebrow">Safe stop</p>
      <h1>The lab could not complete this run.</h1>
      <p>No draft was released. Reset the scenario and try the deterministic workflow again.</p>
      <button className="button button-primary" onClick={reset}>
        Reset the lab
      </button>
    </main>
  );
}
