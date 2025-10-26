'use client';

import { Skeleton, Card, CardBody } from '@heroui/react';

export default function Loading() {
  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column - Portrait Skeleton */}
          <div className="md:col-span-4">
            <div className="max-w-md mx-auto">
              <Skeleton className="rounded-xl" style={{ minHeight: '70vh' }} />
              <Card className="mt-8">
                <CardBody className="p-8">
                  <Skeleton className="h-12 w-3/4 mb-4 rounded-lg" />
                  <Skeleton className="h-8 w-1/2 mb-2 rounded-lg" />
                  <Skeleton className="h-6 w-2/3 rounded-lg" />
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Middle Column - Buttons Skeleton */}
          <div className="md:col-span-1 flex items-start justify-center pt-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-10 w-10 rounded-lg" />
            </div>
          </div>

          {/* Right Column - Profile Skeleton */}
          <div className="md:col-span-7">
            <div className="pt-8 space-y-3">
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-5/6 rounded-lg" />
              <Skeleton className="h-6 w-4/5 rounded-lg" />
              <Skeleton className="h-6 w-full rounded-lg" />
              <Skeleton className="h-6 w-3/4 rounded-lg" />
              <Skeleton className="h-6 w-5/6 rounded-lg" />
              <Skeleton className="h-6 w-2/3 rounded-lg" />
              <Skeleton className="h-6 w-4/5 rounded-lg" />
            </div>
          </div>
        </div>

        {/* Logs Section Skeleton */}
        <div className="mt-8">
          <Card>
            <CardBody className="p-6">
              <Skeleton className="h-8 w-1/4 mb-4 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </main>
  );
}
