"use client";

import { Card, CardContent } from "@heroui/react";

import { Link } from "@/components/custom-link";

interface ContributionStarProps {
  character?: string;
  name: string;
  discord?: string;
  github?: string;
  twitter?: string;
}

export const ContributionStar = ({
  character,
  name,
  discord,
  github,
  twitter,
}: ContributionStarProps) => {
  return (
    <Card className="bg-transparent shadow-none border-none h-[250px]">
      <CardContent className="flex flex-col items-center justify-start text-center gap-2 pt-8">
        {/* Star Icon */}
        <svg
          className="w-16 h-16 text-primary mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          viewBox="0 0 24 24"
        >
          <polygon
            fill="none"
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            stroke="currentColor"
          />
        </svg>

        <p className="text-sm uppercase font-semibold">{name}</p>

        {twitter && (
          <p className="text-xs uppercase">
            <Link
              className="text-inherit hover:text-primary transition-colors"
              href={`https://www.twitter.com/${twitter.replace("@", "")}`}
              prefetch={false}
            >
              {twitter}
            </Link>
          </p>
        )}

        {character && (
          <p className="text-xs uppercase">
            <Link
              className="text-inherit hover:text-primary transition-colors"
              href={`/character/${character}`}
            >
              {character}
            </Link>
          </p>
        )}

        {discord && <p className="text-xs uppercase text-muted">{discord}</p>}

        {github && (
          <p className="text-xs uppercase">
            <Link
              className="text-inherit hover:text-primary transition-colors"
              href={`https://www.github.com/${github}`}
              prefetch={false}
            >
              {github}
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
};
