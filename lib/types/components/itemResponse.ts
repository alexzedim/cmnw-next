import { nameLocaleEmbed } from './nameLocaleEmbed';

export type itemResponse = {
  _id: number;

  name: nameLocaleEmbed;

  quality: string;

  ilvl: number;

  level: number;

  icon: string;

  item_class: string;

  item_subclass: string;

  purchase_price: number;

  purchase_quantity: number;

  sell_price: number;

  is_equippable: boolean;

  is_stackable: boolean;

  inventory_type: string;

  loot_type: string;

  contracts: boolean;

  asset_class: string[];

  expansion: string;

  stackable: number;

  profession_class: string;

  ticker: string;

  tags: string[];
}
