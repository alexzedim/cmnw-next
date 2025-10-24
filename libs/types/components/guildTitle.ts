import { Faction } from '../enums';

export type guildTitle = {
  name: string,
  realm: string,
  member_count: number,
  achievement_points: number,
  created_timestamp: Date,
  faction?: Faction
}
