"use client";

import { useEffect } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import Link from "next/link";

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

  const isNotFound = error.message.includes("404");
  const isServerError =
    error.message.includes("500") || error.message.includes("503");

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="flex-col items-center pt-8 pb-0">
              <h1 className="text-4xl font-bold text-danger">
                {isNotFound ? "404" : "Oops!"}
              </h1>
            </CardHeader>
            <CardBody className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">
                {isNotFound
                  ? "Character Not Found"
                  : isServerError
                    ? "Server Error"
                    : "Something went wrong!"}
              </h2>
              <p className="mb-6 text-default-600">
                {isNotFound
                  ? "The character you are looking for does not exist or has been deleted."
                  : isServerError
                    ? "Our servers are currently experiencing issues. Please try again later."
                    : error.message ||
                      "An unexpected error occurred while loading this character."}
              </p>

              <div className="flex gap-4 justify-center">
                <Button color="primary" variant="solid" onPress={reset}>
                  Try Again
                </Button>
                <Button as={Link} color="default" href="/" variant="bordered">
                  Go Home
                </Button>
              </div>

              {error.digest && (
                <p className="mt-6 text-sm text-default-400">
                  Error ID: {error.digest}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
