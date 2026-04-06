"use client";

import { Avatar } from "@heroui/react";

import { Link } from "@/components/custom-link";
import { ENDPOINTS } from "@/constants";

interface CharacterButtonsProps {
  name: string;
  realm: string;
}

export const CharacterButtons = ({ name, realm }: CharacterButtonsProps) => {
  const services = [
    {
      name: "WarcraftLogs",
      url: `${ENDPOINTS.WARCRAFT_LOGS}/character/eu/${realm}/${name}`,
      icon: "/external/wcl.svg",
    },
    {
      name: "RaiderIO",
      url: `${ENDPOINTS.RAIDER_IO}/characters/eu/${realm}/${name}`,
      icon: "/external/rio.svg",
    },
    {
      name: "WoWProgress",
      url: `${ENDPOINTS.WOW_PROGRESS}/character/eu/${realm}/${name}`,
      icon: "/external/wp.svg",
    },
    {
      name: "BattleNet",
      url: `${ENDPOINTS.BATTLE_NET}/en-gb/character/eu/${realm}/${name}`,
      icon: "/external/armory.svg",
    },
    {
      name: "Check PvP",
      url: `${ENDPOINTS.CHECK_PVP}/eu/${realm}/${name}`,
      icon: "/external/check-pvp-1.svg",
    },
  ];

  return (
    <div className="card-surface p-6 rounded-xl mb-6">
      {/* Section Header with Badge */}
      <div className="mb-5 flex items-center gap-3">
        <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider opacity-50">
          <div className="size-1.5 rounded-full bg-[var(--primary)]" />
          <span>External Resources</span>
        </div>
      </div>

      {/* Service Links */}
      <div className="flex flex-row items-center justify-center gap-4 flex-wrap">
        {services.map((service) => (
          <Link
            key={service.name}
            className="group relative"
            href={service.url}
            prefetch={false}
            title={service.name}
          >
            <Avatar className="w-16 h-16 transition-transform duration-200 group-hover:scale-110 group-hover:shadow-lg dark:group-hover:shadow-none cursor-pointer">
              <Avatar.Image alt={service.name} src={service.icon} />
              <Avatar.Fallback>{service.name[0]}</Avatar.Fallback>
            </Avatar>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {service.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
