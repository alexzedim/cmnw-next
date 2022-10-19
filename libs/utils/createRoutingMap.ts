import { Commands, initialValuesSearch } from '../types';

export const createRoutingMap = (values: initialValuesSearch) => {
  return new Map<Commands, string>([
    [Commands.characters, `/${values.command}/${values.character}@${values.realm.value}`],
    [Commands.guilds, `/${values.command}/${values.guild}@${values.realm.value}`],
    [Commands.commdty, `/${values.command}/${values.commdty}@${values.realm.value}`],
    [Commands.gold, `/${values.command}/GOLD@${values.realm.value}`],
    [Commands.hash, `/${values.command}/${values.type}@${values.hash}`],
  ]);
};
