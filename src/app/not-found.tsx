import Link from "next/link";

export default function NotFound() {
  return (
    <main className="error-state">
      <p className="eyebrow">404</p>
      <h1>This route is outside the handoff.</h1>
      <p>The public work sample has one scenario and one printable handoff.</p>
      <Link className="button button-primary" href="/">
        Return to the lab
      </Link>
    </main>
  );
}
