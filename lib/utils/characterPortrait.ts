import { Faction } from '../types';

export const characterPortrait = (faction?: Faction, media?: string): string => {
  if (media) return media;
  if (faction && Faction.A) return '/images/factions/alliance.png';
  if (faction && Faction.H) return '/images/factions/horde.png';
  return '/vercel.svg';
}
