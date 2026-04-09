import type { Metadata } from "next";

import { Separator } from "@heroui/react";

import { ContributionStar } from "@/components/contribution-star";
import { CONTRIBUTORS } from "@/constants";
import { detectLocale, getDictionary } from "@/dictionaries";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);
  const wwa = dict.whoWeAre;

  return {
    title: wwa.metadataTitle,
    description: wwa.metadataDescription,
    openGraph: {
      title: wwa.metadataTitle,
      description: wwa.metadataOgDescription,
    },
  };
}

export default async function WhoWeArePage() {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 py-8">
        <Separator className="mb-8" />

        <h1 className="text-4xl font-bold text-center uppercase my-8">
          {dict.whoWeAre.title}
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
