"use client";

import { BankTable } from "./bank-table";
import { FullRaiderAxes } from "./full-raider-axes";
import { MixedShield } from "./mixed-shield";
import { RaiderAxes } from "./raider-axes";
import { TwinkScene } from "./twink-scene";
import { UnknownMark } from "./unknown-mark";
import { GUILD_TYPES } from "./constants";

type GuildType = (typeof GUILD_TYPES)[keyof typeof GUILD_TYPES];

interface GuildBannerProps {
  guildType: GuildType;
}

export const GuildBanner = ({ guildType }: GuildBannerProps) => {
  switch (guildType.statusKey) {
    case GUILD_TYPES.BANK.statusKey:
      return <BankTable />;
    case GUILD_TYPES.TWINK.statusKey:
      return <TwinkScene />;
    case GUILD_TYPES.RAIDING_FULL.statusKey:
      return <FullRaiderAxes />;
    case GUILD_TYPES.MIXED.statusKey:
      return <MixedShield />;
    case GUILD_TYPES.UNKNOWN.statusKey:
      return <UnknownMark />;
    default:
      return <RaiderAxes />;
  }
};
