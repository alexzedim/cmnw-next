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

  // Commodity items don't have realms (region-wide)
  if (isCommdty) {
    realmTitle = "";
  } else if (realms.length === 1) {
    const [realm] = realms;

    realmTitle = realm.realms?.[0] || "Unknown";
  } else if (realms.length > 1) {
    realmTitle = realms
      .map((r) => r.realms?.map((r) => r).join(", ") || "Unknown")
      .join(", ");
  } else {
    realmTitle = "";
  }

  return {
    itemTitle,
    realmTitle,
    isGold,
    isXrs,
    isCommdty,
    // Item properties
    quality: item.quality,
    asset_class: item.asset_class,
    assetClass: item.assetClass,
    icon: item.icon,
    itemClass: item.itemClass,
    itemSubClass: item.itemSubClass,
    itemLevel: item.itemLevel,
    level: item.level,
    purchasePrice: item.purchasePrice,
    purchaseQuantity: item.purchaseQuantity,
    vendorSellPrice: item.vendorSellPrice,
    isEquip: item.isEquip,
    isStackable: item.isStackable,
    inventoryType: item.inventoryType,
    lootType: item.lootType,
    hasContracts: item.hasContracts,
    expansion: item.expansion,
    stackable: item.stackable,
    professionClass: item.professionClass,
    ticker: item.ticker,
    tags: item.tags,
    indexBy: item.indexBy,
  };
};
