import type { IAddonScanEntry } from "@/lib/types";

const ADDON_SCAN_LUA_REGEX = {
  TABLE_OPEN: /^\["[^"]+"\]\s*=\s*\{\s*$/,
  TABLE_CLOSE: /^\}\s*,?\s*$/,
  STRING_FIELD: /^\["(\w+)"\]\s*=\s*"(.*)"\s*,?\s*$/,
  NUMBER_FIELD: /^\["(\w+)"\]\s*=\s*(\d+)\s*,?\s*$/,
} as const;

const ADDON_SCAN_FIELD_ORDER = [
  "id",
  "name",
  "realmId",
  "realm",
  "guild",
  "guildRank",
  "guildRankName",
  "class",
  "race",
  "gender",
  "faction",
  "level",
  "status",
  "lastModified",
  "createdBy",
  "updatedBy",
] as const;

function toGuid(name: string, realm: string): string {
  const nameSlug = name.toLowerCase().replace(/\s+/g, "-");
  const realmSlug = realm.toLowerCase().replace(/\s+/g, "-");

  return `${nameSlug}@${realmSlug}`;
}

export function validateLuaHeader(content: string): boolean {
  return content.trimStart().startsWith("CMNWOSINT_DB");
}

export function parseAddonScanEntries(content: string): IAddonScanEntry[] {
  const lines = content.split(/\r?\n/);
  const entries: IAddonScanEntry[] = [];
  let currentEntry: Record<string, string | number> | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) continue;

    if (ADDON_SCAN_LUA_REGEX.TABLE_OPEN.test(line)) {
      currentEntry = {};

      continue;
    }

    if (ADDON_SCAN_LUA_REGEX.TABLE_CLOSE.test(line)) {
      if (currentEntry) {
        const name = String(currentEntry.name ?? "");
        const realm = String(currentEntry.realm ?? "");

        if (name && realm) {
          const guid = toGuid(name, realm);

          entries.push({
            guid,
            id:
              currentEntry.id !== undefined
                ? Number(currentEntry.id)
                : undefined,
            name,
            realmId:
              currentEntry.realmId !== undefined
                ? Number(currentEntry.realmId)
                : undefined,
            realm,
            guild:
              currentEntry.guild !== undefined
                ? String(currentEntry.guild)
                : undefined,
            guildGuid:
              currentEntry.guildGuid !== undefined
                ? String(currentEntry.guildGuid)
                : undefined,
            guildRank:
              currentEntry.guildRank !== undefined
                ? Number(currentEntry.guildRank)
                : undefined,
            class:
              currentEntry.class !== undefined
                ? Number.isNaN(Number(currentEntry.class))
                  ? String(currentEntry.class)
                  : Number(currentEntry.class)
                : undefined,
            race:
              currentEntry.race !== undefined
                ? Number.isNaN(Number(currentEntry.race))
                  ? String(currentEntry.race)
                  : Number(currentEntry.race)
                : undefined,
            gender:
              currentEntry.gender !== undefined
                ? String(currentEntry.gender)
                : undefined,
            faction:
              currentEntry.faction !== undefined
                ? String(currentEntry.faction)
                : undefined,
            level:
              currentEntry.level !== undefined
                ? Number(currentEntry.level)
                : undefined,
            lastModified:
              currentEntry.lastModified !== undefined
                ? String(currentEntry.lastModified)
                : undefined,
            createdBy:
              currentEntry.createdBy !== undefined
                ? String(currentEntry.createdBy)
                : undefined,
            updatedBy:
              currentEntry.updatedBy !== undefined
                ? String(currentEntry.updatedBy)
                : undefined,
          });
        }

        currentEntry = null;
      }

      continue;
    }

    if (currentEntry) {
      const stringMatch = ADDON_SCAN_LUA_REGEX.STRING_FIELD.exec(line);

      if (stringMatch) {
        const [, key, value] = stringMatch;

        if (
          ADDON_SCAN_FIELD_ORDER.includes(
            key as (typeof ADDON_SCAN_FIELD_ORDER)[number]
          )
        ) {
          currentEntry[key] = value;
        }

        continue;
      }

      const numberMatch = ADDON_SCAN_LUA_REGEX.NUMBER_FIELD.exec(line);

      if (numberMatch) {
        const [, key, value] = numberMatch;

        if (
          ADDON_SCAN_FIELD_ORDER.includes(
            key as (typeof ADDON_SCAN_FIELD_ORDER)[number]
          )
        ) {
          currentEntry[key] = Number(value);
        }
      }
    }
  }

  return entries;
}
