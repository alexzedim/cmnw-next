import { Metadata } from "next";
import { Separator } from "@heroui/react";

import { ContributionStar } from "@/components/contribution-star";
import { CONTRIBUTORS } from "@/constants";

export const metadata: Metadata = {
  title: "cmnw",
  description: "World of Warcraft: Intelligence always wins.",
  openGraph: {
    title: "cmnw",
    description: "Meet the contributors who make CMNW possible",
  },
};

export default function WhoWeArePage() {
  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-8" />

        <h1 className="text-4xl font-bold text-center uppercase my-8">
          Great Many Thanks
        </h1>

        <Separator className="mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CONTRIBUTORS.map((contributor) => (
            <ContributionStar
              key={contributor.value}
              character={contributor.character}
              discord={contributor.discord}
              github={contributor.github}
              name={contributor.name}
              twitter={contributor.twitter}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
