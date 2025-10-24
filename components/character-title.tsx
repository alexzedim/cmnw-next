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
        <h1 
          className="font-black uppercase text-white"
          style={{
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: 'clamp(2rem, -2.75rem + 16.6667vw, 4rem)',
            textAlign: 'left'
          }}
        >
          {name}
        </h1>
        
        {guild && guild_id && (
          <h4 
            className="text-white font-normal"
            style={{
              fontFamily: 'Fira Sans, sans-serif',
              fontSize: 'clamp(1rem, -2.75rem + 16.6667vw, 2rem)',
              textAlign: 'left'
            }}
          >
            #<Link href={`/guild/${guild_id}`} className="text-white hover:underline">
              {guild}
            </Link>
            {guild_rank !== undefined && (
              <span>
                {guild_rank === 0 ? ' // GM' : ` // R${guild_rank}`}
              </span>
            )}
          </h4>
        )}
        
        <Divider className="my-4 bg-primary" />
        
        <h4 
          className="text-white font-normal"
          style={{
            fontFamily: 'Fira Sans, sans-serif',
            fontSize: 'clamp(1.3rem, -2.75rem + 16.6667vw, 2rem)',
            textAlign: 'left'
          }}
        >
          @{realm}
        </h4>
      </CardBody>
    </Card>
  );
};
