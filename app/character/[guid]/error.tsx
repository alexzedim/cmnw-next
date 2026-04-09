"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useI18n } from "@/lib/i18n/context";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Character page error:", error);
  }, [error]);

  const { dict } = useI18n();
  const e = dict.error;

  const isNotFound = error.message.includes("404");
  const isServerError =
    error.message.includes("500") || error.message.includes("503");

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="card-surface p-8 text-center">
            <h1 className="text-4xl font-bold text-foreground">
              {isNotFound ? e.title404 : e.titleOops}
            </h1>
            <h2 className="text-2xl font-bold mt-4">
              {isNotFound
                ? e.characterNotFound
                : isServerError
                  ? e.serverError
                  : e.somethingWentWrong}
            </h2>
            <p className="mt-4 mb-6 text-muted">
              {isNotFound
                ? e.characterDeleted
                : isServerError
                  ? e.serverIssues
                  : error.message || e.unexpectedCharacter}
            </p>

            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary" onClick={reset}>
                {e.tryAgain}
              </button>
              <Link className="btn btn-outline" href="/">
                {e.goHome}
              </Link>
            </div>

            {error.digest && (
              <p className="mt-6 text-xs text-muted">
                {e.errorId}
                {error.digest}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
