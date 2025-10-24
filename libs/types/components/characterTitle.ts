import { Faction } from '../enums';

export type characterTitle = {
  name: string,
  realm: string,
  guild?: string,
  guild_id?: string,
  guild_rank?: number,
  faction?: Faction,
}
