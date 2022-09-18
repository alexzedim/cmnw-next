import { ItemQuality } from '../types';
import { backgroundColors } from '../constants';

export const generateItemBackground = (props: { quality?: string, asset_class?: string[] }) => {
  let index: number = 11;
  const { quality, asset_class } = props;

  if (asset_class) {
    if (asset_class.includes('derivative')) index = 13;
    if (asset_class.includes('gold')) index = 16;
    if (asset_class.includes('wowtoken')) index = 17;
  }
  if (quality) {
    if (quality === ItemQuality.poor) index = 10;
    if (quality === ItemQuality.common) index = 11;
    if (quality === ItemQuality.uncommon) index = 12;
    if (quality === ItemQuality.rare) index = 13;
    if (quality === ItemQuality.epic) index = 14;
    if (quality === ItemQuality.legendary) index = 15;
    if (quality === ItemQuality.artifact) index = 16;
    if (quality === ItemQuality.heirloom || quality === ItemQuality.wowtoken) index = 17;
  }

  return backgroundColors[index];
}
