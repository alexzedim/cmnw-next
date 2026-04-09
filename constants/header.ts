export const HEADER = [
  {
    labelKey: "discordBot" as const,
    href: "/discord",
  },
  {
    labelKey: "characters" as const,
    href: { pathname: "/", query: { command: "character" } },
  },
  {
    labelKey: "guilds" as const,
    href: { pathname: "/", query: { command: "guild" } },
  },
  {
    labelKey: "commdty" as const,
    href: { pathname: "/", query: { command: "commdty" } },
  },
  {
    labelKey: "whoWeAre" as const,
    href: "/who-we-are",
  },
  {
    labelKey: "loginArea" as const,
    href: "/login-area",
  },
];
