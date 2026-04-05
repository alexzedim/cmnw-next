"use client";

import { Skeleton, Card } from "@heroui/react";

export default function Loading() {
  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        {/* Guild Header Skeleton */}
        <Card className="mb-8">
          <Card.Content className="p-8">
            <Skeleton className="h-12 w-1/3 mb-4 rounded-lg" />
            <Skeleton className="h-6 w-1/4 mb-2 rounded-lg" />
            <div className="flex gap-4 mt-4">
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
              <Skeleton className="h-8 w-32 rounded-lg" />
            </div>
          </Card.Content>
        </Card>

        {/* Divider Skeleton */}
        <Skeleton className="h-px w-full mb-8" />

        {/* Roster Table Skeleton */}
        <Card>
          <Card.Content className="p-6">
            <Skeleton className="h-8 w-1/4 mb-4 rounded-lg" />
            <div className="space-y-3">
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
              <Skeleton className="h-16 w-full rounded-lg" />
            </div>
          </Card.Content>
        </Card>

        {/* Divider Skeleton */}
        <Skeleton className="h-px w-full my-8" />

        {/* Logs Section Skeleton */}
        <Card>
          <Card.Content className="p-6">
            <Skeleton className="h-8 w-1/4 mb-4 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </Card.Content>
        </Card>
      </div>
    </main>
  );
}
