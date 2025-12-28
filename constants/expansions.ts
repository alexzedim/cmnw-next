export interface Expansion {
  value: string;
  label: string;
  fullName: string;
  color: string;
  accentColor?: string;
}

export const EXPANSIONS: Expansion[] = [
  {
    value: "clsc",
    label: "VANILLA",
    fullName: "World of Warcraft",
    color: "rgb(7, 135, 172)", // Classic WoW Blue
    accentColor: "rgb(237, 233, 68)", // Gold accent
  },
  {
    value: "tbc",
    label: "TBC",
    fullName: "The Burning Crusade",
    color: "rgb(76, 175, 80)", // Fel Green
    accentColor: "rgb(139, 195, 74)",
  },
  {
    value: "wotlk",
    label: "WOTLK",
    fullName: "Wrath of the Lich King",
    color: "rgb(135, 206, 250)", // Light Blue (Icy)
    accentColor: "rgb(176, 224, 230)", // Powder Blue
  },
  {
    value: "cata",
    label: "CATA",
    fullName: "Cataclysm",
    color: "rgb(220, 20, 20)", // Red (Fiery)
    accentColor: "rgb(255, 99, 71)", // Tomato
  },
  {
    value: "mop",
    label: "MOP",
    fullName: "Mists of Pandaria",
    color: "rgb(50, 205, 50)", // Bright Lime Green (Monk class color)
    accentColor: "rgb(144, 238, 144)", // Light Green
  },
  {
    value: "wod",
    label: "WOD",
    fullName: "Warlords of Draenor",
    color: "rgb(139, 69, 19)", // Saddle Brown (Wood & Iron)
    accentColor: "rgb(210, 140, 80)", // Lighter brown
  },
  {
    value: "legion",
    label: "LGN",
    fullName: "Legion",
    color: "rgb(76, 175, 80)", // Neon Green (Fel energy)
    accentColor: "rgb(0, 0, 0)", // Black for contrast
  },
  {
    value: "bfa",
    label: "BFA",
    fullName: "Battle for Azeroth",
    color: "rgb(25, 118, 210)", // Royal Blue
    accentColor: "rgb(237, 233, 68)", // Gold
  },
  {
    value: "shdw",
    label: "SHDW",
    fullName: "Shadowlands",
    color: "rgb(224, 224, 224)", // Light Gray/Silver
    accentColor: "rgb(192, 192, 192)", // Gray
  },
  {
    value: "df",
    label: "DF",
    fullName: "Dragonflight",
    color: "rgb(255, 193, 7)", // Amber/Gold
    accentColor: "rgb(255, 235, 59)", // Light Gold
  },
  {
    value: "tww",
    label: "TWW",
    fullName: "The War Within",
    color: "rgb(63, 81, 181)", // Indigo Blue
    accentColor: "rgb(129, 199, 243)", // Light Blue
  },
];

export const getExpansionColor = (value: string): string => {
  const expansion = EXPANSIONS.find((exp) => exp.value === value);

  return expansion?.color ?? "rgb(157, 157, 157)";
};

export const getExpansionFullName = (value: string): string => {
  const expansion = EXPANSIONS.find((exp) => exp.value === value);

  return expansion?.fullName ?? value.toUpperCase();
};
