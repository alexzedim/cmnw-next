import { nameLocaleEmbed } from "./nameLocaleEmbed";

export type itemResponse = {
  id: number;
  _id?: number; // Deprecated, use id

  name?: string;
  names?: nameLocaleEmbed;

  quality?: string;

  itemLevel?: number;

  level?: number;

  icon?: string;

  itemClass?: string;

  itemSubClass?: string;

  purchasePrice?: number;

  purchaseQuantity?: number;

  vendorSellPrice?: number;

  isEquip?: boolean;

  isStackable?: boolean;

  inventoryType?: string;

  lootType?: string;

  hasContracts?: boolean;

  asset_class?: string[]; // Keep for compatibility with generateItemBackground
  assetClass?: string[];

  expansion?: string;

  stackable?: number;

  professionClass?: string;

  ticker?: string;

  tags?: string[];

  indexBy?: string;

  createdAt?: Date;
  updatedAt?: Date;
};
