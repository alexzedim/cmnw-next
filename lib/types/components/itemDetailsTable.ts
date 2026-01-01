import { ValuationTypes } from "../enums";

import { details } from ".";

export type itemDetailsTable = {
  type: ValuationTypes;
  details: details;
  connected_realm_id: number;
};
