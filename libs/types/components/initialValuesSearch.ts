import { HashType } from '../enums';

export type initialValuesSearch = {
  command: string | string[],
  realm: { label: string, value: string },
  character: string,
  guild: string,
  type: HashType,
  item: string,
  commdty: string,
  hash: string,
  id: string,
}
