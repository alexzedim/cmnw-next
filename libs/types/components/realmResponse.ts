export type realmResponse = {
  readonly _id: number,

  readonly realms: string[],

  readonly slug: string,

  readonly connected_realm_id: number;

  readonly golds: number;

  readonly auctions: number;

  readonly valuations: number;
}
