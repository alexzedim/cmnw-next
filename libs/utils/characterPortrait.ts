import { Faction } from '../types';

export const characterPortrait = (faction?: Faction, media?: string): string => {
  if (media) return media;
  if (faction && Faction.A) return './static/alliance.png';
  if (faction && Faction.H) return './static/horde.png';
  return './static/vercel.svg';
}
