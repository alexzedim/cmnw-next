'use client';

import { Avatar } from "@heroui/react";
import { Link } from "@/components/custom-link";
import { DOMAINS } from "@/lib/constants";

interface CharacterButtonsProps {
  name: string;
  realm: string;
}

export const CharacterButtons = ({ name, realm }: CharacterButtonsProps) => {
  const services = [
    {
      name: 'WarcraftLogs',
      url: `${DOMAINS.warcraftLogs}/character/eu/${realm}/${name}`,
      icon: '/external/wcl.svg',
    },
    {
      name: 'RaiderIO',
      url: `${DOMAINS.raiderIo}/characters/eu/${realm}/${name}`,
      icon: '/external/rio.svg',
    },
    {
      name: 'WoWProgress',
      url: `${DOMAINS.wowProgress}/character/eu/${realm}/${name}`,
      icon: '/external/wp.svg',
    },
    {
      name: 'BattleNet',
      url: `${DOMAINS.battleNet}/en-gb/character/eu/${realm}/${name}`,
      icon: '/external/armory.svg',
    },
    {
      name: 'Check PvP',
      url: `${DOMAINS.checkPvp}/eu/${realm}/${name}`,
      icon: '/external/check-pvp-1.svg',
    },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
      {services.map((service) => (
        <Link 
          key={service.name}
          href={service.url}
          prefetch={false}
        >
          <Avatar
            src={service.icon}
            alt={service.name}
            className="w-16 h-16"
            radius="sm"
          />
        </Link>
      ))}
    </div>
  );
};
