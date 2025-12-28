import { nameLocaleEmbed } from "@/lib/types";

export type itemResponse = {
  id: number;
  name: string;
  names: nameLocaleEmbed;
  quality: string;
  itemLevel: number;
  itemClass: string;
  itemSubClass: string;
  purchasePrice: number;
  purchaseQuantity: number;
  vendorSellPrice: number;
  isEquip: boolean;
  isStackable: boolean;
  inventoryType: string;
  hasContracts: boolean;
  assetClass: string[];
  expansion: string;
  stackable: number;
  indexBy: string;
  createdAt: string;
  updatedAt: string;
};
