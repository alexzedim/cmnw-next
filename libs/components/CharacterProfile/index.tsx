import { pick } from 'lodash';
import { FC, Fragment } from 'react';
import { characterProfile } from '../../types';
import { Typography } from '@mui/material';
import humanizeString from 'humanize-string'
import Link from '../Link';

const CharacterProfile: FC<characterProfile> = ({ character}) => {
  const fields: string[] = ['id', 'level', 'average_item_level', 'equipped_item_level', 'chosen_covenant', 'renown_level', 'faction', 'gender', 'race', 'character_class', 'active_spec', 'createdBy'];
  const fieldsWithLink: string[] = ['hash_a', 'hash_b'];
  const profile = pick(character, [...fields, ...fieldsWithLink]);
  return (
    <Fragment>
      {Object.entries(profile).map(([key, value], index) => {
        if (fieldsWithLink.includes(key) && value !== null) {
          return (
            <Typography key={index} variant="caption" display="block" gutterBottom>
              {humanizeString(key)}: <Link href={`/${key.replace('_', '/')}@${value}`} color="textPrimary" underline="hover">{value}</Link>
            </Typography>
          )
        }
        if (fields.includes(key) && value !== null) {
          return (
            <Typography key={index} variant="caption" display="block" gutterBottom>
              {humanizeString(key)}: {value}
            </Typography>
          )
        }
        if (key === "lastModified" && value !== null) {
          return (
            <Typography key={index} variant="caption" display="block" gutterBottom>
              {humanizeString(key)}: {new Date(profile.last_modified).toLocaleString('ru-RU')}
            </Typography>
          )
        }
      })}
    </Fragment>
  )
}

export default CharacterProfile;
