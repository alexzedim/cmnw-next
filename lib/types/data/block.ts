export type BlockAction =
  | "GENESIS"
  | "JOIN"
  | "LEAVE"
  | "MIGRATE"
  | "HASH_A_CHANGE"
  | "HASH_B_CHANGE";

export interface Block {
  id: string;
  hashValue: string;
  charactersCount: number;
  confirmedCount: number;
  isCollision: boolean;
  firstSeenAt: string;
  lastSeenAt: string;
}

export interface BlockMember {
  id: string;
  blockId: string;
  characterGuid: string;
  hashA: string | null;
  hashB: string | null;
  isConfirmed: boolean;
  joinedAt: string;
}

export interface BlockLog {
  uuid: string;
  blockId: string | null;
  characterGuid: string | null;
  hashValue: string | null;
  hashA: string | null;
  hashB: string | null;
  action: BlockAction;
  original: string | null;
  updated: string | null;
  membersCount: number | null;
  scannedAt: string;
  createdAt: string;
}

export interface BlockResponse {
  block: Block;
  members: BlockMember[];
}

export interface BlockLogsResponse {
  logs: BlockLog[];
}
