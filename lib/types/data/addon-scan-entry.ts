export interface IAddonScanEntry {
  guid: string;
  id?: number;
  name: string;
  realmId?: number;
  realm: string;
  guild?: string;
  guildGuid?: string;
  guildRank?: number;
  class?: number | string;
  race?: number | string;
  gender?: string;
  faction?: string;
  level?: number;
  lastModified?: string;
  createdBy?: string;
  updatedBy?: string;
}
