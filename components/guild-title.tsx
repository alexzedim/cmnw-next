"use client";

import { Card, CardBody, Divider } from "@heroui/react";

import { generateFactionBackground } from "@/lib";
import { Faction } from "@/lib/types";

interface GuildTitleProps {
  name: string;
  realm: string;
  member_count: number;
  created_timestamp: number | string;
  achievement_points: number;
  faction?: Faction;
}

export const GuildTitle = ({
  name,
  realm,
  member_count,
  created_timestamp,
  achievement_points,
  faction,
}: GuildTitleProps) => {
  const background = generateFactionBackground(faction);
  const createdDate = new Date(created_timestamp).toLocaleString("en-GB");

  return (
    <Card className="max-w-6xl mx-4 my-8" style={{ background }}>
      <CardBody
        className="p-8 border-[15px] border-white rounded-xl"
        style={{ background }}
      >
        <h1
          className="font-black uppercase text-white break-words"
          style={{
            fontFamily: "Fira Sans, sans-serif",
            fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 6rem)",
            textAlign: "left",
          }}
        >
          #{name}
        </h1>

        <Divider className="my-4 bg-primary" />

        <p className="text-white text-sm uppercase">
          Created: {createdDate} | Members: {member_count} | Achievements:{" "}
          {achievement_points}
        </p>

        <h4
          className="text-white font-normal break-words mt-2"
          style={{
            fontFamily: "Fira Sans, sans-serif",
            fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 4rem)",
            textAlign: "left",
          }}
        >
          @{realm}
        </h4>
      </CardBody>
    </Card>
  );
};
