import { itemResponse, realmResponse } from "../types";

export const generateItemTitle = (
  item: Partial<itemResponse>,
  realms: Partial<realmResponse>[]
) => {
  let itemTitle: string = "Unknown Item";
  let realmTitle: string = "Unknown Realm";

  const itemId = item.id || item._id;
  const isGold = itemId === 1;
  const isXrs = realms.length > 1;
  const assetClass = item.assetClass || item.asset_class;
  const isCommdty = assetClass?.includes("commdty") || false;

  if (item.ticker) {
    itemTitle = item.ticker.toUpperCase();
  } else if (typeof item.names === "object" && item.names?.en_GB) {
    itemTitle = item.names.en_GB;
  } else if (item.name) {
    itemTitle = item.name;
  } else if (itemId) {
    itemTitle = `#${itemId}`;
  }

  if (realms.length === 1) {
    const [realm] = realms;

    realmTitle = realm.realms?.[0] || "Unknown";
  } else {
    realmTitle = realms
      .map((r) => r.realms?.map((r) => r).join(", ") || "Unknown")
      .join(", ");
  }

  return { itemTitle, realmTitle, isGold, isXrs, isCommdty };
};
