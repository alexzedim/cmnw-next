import { details } from '.';
import { ValuationTypes } from '../enums';

export type itemDetailsTable = {
  type: ValuationTypes,
  details: details,
  connected_realm_id: number,
}
