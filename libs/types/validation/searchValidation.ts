import { array, object, string } from 'yup';

export const searchValidation = object().shape({
  character: string()
    .min(3, 'Between 3 and 13 symbols!')
    .max(13, 'Between 3 and 13 symbols!')
    .required('Required'),
  guild: string()
    .min(3, 'Between 3 and 25 symbols!')
    .max(25, 'Between 3 and 25 symbols!')
    .required('Required'),
  hash: string()
    .min(13, 'Between 14 and 20 symbols!')
    .max(20, 'Between 14 and 20 symbols!')
    .required('Required'),
  realm: object({
    label: string().default('Гордунни').required(),
    value: string().default('gordunni').required(),
  }),
  item: string().required('Required'),
  hubs: array().min(1),
});
