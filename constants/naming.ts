import { romanize } from "@/lib/utils/romanize";

export const NAMING_CONSTANTS = {
  CHARACTER: romanize("CHARACTER"),
  MARKET: romanize("MARKET", { market: true }),
  CHARACTER_ACCOUNT_DETECTIVE: romanize("CHARACTER ACCOUNT DETECTIVE"),
  GUILD: romanize("GUILD"),
  ITEM: romanize("ITEM"),
  MARKET_VOLUME_ALLOCATION: romanize("MARKET VOLUME ALLOCATION", {
    market: true,
  }),
  BLOCK: romanize("BLOCK"),
  REALM: romanize("REALM"),
};
