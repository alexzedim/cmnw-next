export type AuctionsResponse = {
  feed: Array<{
    id: number;
    item_id: number;
    item: {
      id: number;
      bonus_lists?: number[];
    };
    connected_realm_id: number;
    last_modified: number;
    quantity: number;
    bid?: number;
    buyout?: number;
    price?: number;
    time_left: string;
    updatedAt: Date;
    createdAt: Date;
  }>
}
