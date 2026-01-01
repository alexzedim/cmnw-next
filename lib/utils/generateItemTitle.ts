import { itemResponse } from "../types";

export const generateItemTitle = (item: Partial<itemResponse>) => {
  let itemTitle: string = "Unknown Item";

  const itemId = item.id;
  const isGold = itemId === 1;
  const assetClass = item.assetClass;
  const isCommdty = assetClass?.includes("COMMDTY") || false;

  if (typeof item.names === "object" && item.names?.en_GB) {
    itemTitle = item.names.en_GB;
  } else if (item.name) {
    itemTitle = item.name;
  } else if (itemId) {
    itemTitle = `${itemId}`;
  }

  return {
    itemTitle,
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
