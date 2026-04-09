"use client";

import { useEffect } from "react";

import { useI18n } from "@/lib/i18n/context";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const { dict } = useI18n();

  useEffect(() => {
    /* eslint-disable no-console */
    console.error(error);
  }, [error]);

  return (
    <section className="section container mx-auto px-6">
      <div className="card-surface p-6">
        <h2 className="text-2xl font-semibold">{dict.error.genericTitle}</h2>
        <p className="text-muted mt-2">{dict.error.genericDescription}</p>
        <div className="mt-6">
          <button className="btn btn-primary" onClick={() => reset()}>
            {dict.error.genericTryAgain}
          </button>
        </div>
      </div>
    </section>
  );
}
