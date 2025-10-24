import { HashType, initialValuesSearch } from '../types';

export const initialValues = (): initialValuesSearch => {
  return ({
    command: 'character',
    realm: { label: 'Гордунни', value: 'gordunni' },
    character: 'Блюрателла',
    guild: 'Депортация',
    type: HashType.A,
    hash: 'A99BECEC48B29FF',
    item: 'FLASK.POWER',
    id: '0',
    commdty: 'FLASK.POWER',
  })
};
