import { guildMember } from './guildMember';

export type guildResponse = {
  _id: string,
  name: string,
  realm: string,
  realm_id: number,
  realm_name: string,
  id: number,
  faction: string,
  members: guildMember[],
  achievement_points: number,
  member_count: number,
  last_modified: Date,
  created_timestamp: Date,
  status_code: number,
  created_by: string,
  updated_by: string,
  createOnlyUnique: boolean,
  forceUpdate: number,
  iteration: number,
  updatedAt: Date,
  createdAt: Date,
};
