import { itemResponse, realmResponse } from "../types";

export const generateItemTitle = (
  item: Partial<itemResponse>,
  realms: Partial<realmResponse>[]
) => {
  let itemTitle: string = "Unknown Item";
  let realmTitle: string = "Unknown Realm";

  const itemId = item.id;
  const isGold = itemId === 1;
  const assetClass = item.assetClass;
  const isCommdty = assetClass?.includes("COMMDTY") || false;

  if (typeof item.names === "object" && item.names?.en_GB) {
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
    isCommdty,
    // Item properties
    quality: item.quality,
    assetClass: item.assetClass,
    itemClass: item.itemClass,
    itemSubClass: item.itemSubClass,
    itemLevel: item.itemLevel,
    purchasePrice: item.purchasePrice,
    purchaseQuantity: item.purchaseQuantity,
    vendorSellPrice: item.vendorSellPrice,
    isEquip: item.isEquip,
    isStackable: item.isStackable,
    inventoryType: item.inventoryType,
    hasContracts: item.hasContracts,
    expansion: item.expansion,
    stackable: item.stackable,
    indexBy: item.indexBy,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
};
