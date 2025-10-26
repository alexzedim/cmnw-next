'use client';

import { Card, CardBody, Divider } from "@heroui/react";
import { Link } from "@/components/custom-link";
import { generateFactionBackground } from "@/lib";
import { Faction } from "@/lib/types";

interface CharacterTitleProps {
  name: string;
  realm: string;
  guild?: string;
  guild_id?: string;
  guild_rank?: number;
  faction?: Faction;
}

export const CharacterTitle = ({ 
  name, 
  realm, 
  guild, 
  guild_id, 
  guild_rank, 
  faction 
}: CharacterTitleProps) => {
  const background = generateFactionBackground(faction);

  return (
    <Card 
      className="max-w-4xl mx-4 my-8"
      style={{ background }}
    >
      <CardBody 
        className="p-8 border-5 border-white rounded-xl"
        style={{ background }}
      >
        {/* Character Name */}
        <h1 
          className="font-black uppercase text-white tracking-wide leading-none mb-3"
          style={{
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 5rem)',
            textAlign: 'left',
            textShadow: '3px 3px 6px rgba(0, 0, 0, 0.8)'
          }}
        >
          {name}
        </h1>
        
        {/* Guild Info */}
        {guild && guild_id && (
          <div 
            className="text-white/95 font-medium mb-2"
            style={{
              fontFamily: 'Fira Sans, sans-serif',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.75rem)',
              textAlign: 'left',
              textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
            }}
          >
            <span className="text-white/70 font-bold">#</span>
            <Link 
              href={`/guild/${guild_id}`} 
              className="text-white hover:text-white/90 hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {guild}
            </Link>
            {guild_rank !== undefined && (
              <span className="text-white/80 font-normal ml-2">
                {guild_rank === 0 ? '// Guild Master' : `// Rank ${guild_rank}`}
              </span>
            )}
          </div>
        )}
        
        <Divider className="my-4 bg-white/30" />
        
        {/* Realm */}
        <div 
          className="text-white/90 font-semibold capitalize"
          style={{
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: 'clamp(1.25rem, 3vw, 2rem)',
            textAlign: 'left',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)',
            letterSpacing: '0.05em'
          }}
        >
          <span className="text-white/70 font-bold">@</span>{realm}
        </div>
      </CardBody>
    </Card>
  );
};
