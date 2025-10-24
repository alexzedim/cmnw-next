import { Metadata } from 'next';
import { Divider } from "@heroui/react";
import { ContributionStar } from '@/components/contribution-star';
import { CONTRIBUTORS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'CMNW: The Conglomerat',
  description: 'World of Warcraft: Intelligence always wins.',
  openGraph: {
    title: 'CMNW: The Conglomerat',
    description: 'Meet the contributors who make CMNW possible',
  },
};

export default function WhoWeArePage() {
  return (
    <main className="min-h-screen pt-20 pb-8">
      <div className="container mx-auto px-4 py-8">
        <Divider className="mb-8" />
        
        <h1 className="text-4xl font-bold text-center uppercase my-8">
          Great Many Thanks
        </h1>
        
        <Divider className="mb-8" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CONTRIBUTORS.map((contributor) => (
            <ContributionStar
              key={contributor.value}
              character={contributor.character}
              name={contributor.name}
              discord={contributor.discord}
              twitter={contributor.twitter}
              github={contributor.github}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
