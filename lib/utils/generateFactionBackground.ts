import { Faction } from "../types";

import { randomInt } from "./randomInt";

import { backgroundGradients } from "@/constants/background-gradients";

export const generateFactionBackground = (faction?: Faction) => {
  let min = 0;
  let max = 9;

  if (faction) {
    if (faction === Faction.A) max = 4;
    if (faction === Faction.H) min = 5;
  }
  const index = randomInt(min, max);

  return backgroundGradients[index];
};
