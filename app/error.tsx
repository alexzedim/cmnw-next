"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <section className="section container mx-auto px-6">
      <div className="card-surface p-6">
        <h2 className="text-2xl font-semibold">Something went wrong</h2>
        <p className="text-muted mt-2">Please try again. If the problem persists, contact support.</p>
        <div className="mt-6">
          <button className="btn btn-primary" onClick={() => reset()}>Try again</button>
        </div>
      </div>
    </section>
  );
}
