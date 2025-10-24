import { FlagTypes, ValuationTypes } from '../enums';

export type names = {
  en_US: string;
  es_MX: string;
  pt_BR: string;
  de_DE: string;
  en_GB: string;
  es_ES: string;
  fr_FR: string;
  it_IT: string;
  ru_RU: string;
}

export type details = {
  wi: number;
  lot_size: number;
  minimal_settlement_amount: number;
  quotation: string;
  description: string;
  swap_type: string;
  min_price: number;
  quantity: number;
  open_interest: number;
  orders: number[];
  rank: number;
  queue_cost: number;
  queue_quantity: number;
  derivatives_cost: number;
  reagent_items: itemValuation[];
  premium_reagent_items: itemValuation[];
  unsorted_reagent_items: itemValuation[];
}

export type itemValuation = {
  _id: number;
  quality: string;
  name: names,
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
  value: number;
  quantity: number;
}

export type valuation = {
  item_id: number;
  connected_realm_id: number;
  last_modified: number;
  value: number;
  name: string;
  flag: FlagTypes;
  type: ValuationTypes;
  details: details;
}

export type itemValuationsResponse = {
  valuations: valuation[];
  is_evaluating: number;
}
