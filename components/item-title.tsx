"use client";

import { Card, CardBody, Divider, Avatar } from "@heroui/react";

import { generateItemBackground } from "@/lib";

interface ItemTitleProps {
  itemTitle: string;
  realmTitle: string;
  quality?: string;
  assetClass?: string[];
  icon?: string;
}

export const ItemTitle = ({
  itemTitle,
  realmTitle,
  quality,
  assetClass,
  icon,
}: ItemTitleProps) => {
  const backgroundRoot = generateItemBackground({
    quality,
    asset_class: assetClass,
  });
  const backgroundTitle = generateItemBackground({ asset_class: assetClass });

  // Extract backgroundColor from gradient for border
  const borderColorMatch = backgroundTitle.match(/rgba?\([^)]+\)/);
  const borderColor = borderColorMatch ? borderColorMatch[0] : "#ffffff";

  return (
    <Card
      className="max-w-6xl mx-4 my-8"
      style={{ background: backgroundRoot }}
    >
      <CardBody
        className="p-8 border-[15px] rounded-xl"
        style={{
          background: backgroundRoot,
          borderColor: borderColor,
        }}
      >
        <div className="flex items-center gap-4 mb-4">
          {icon && (
            <Avatar
              alt="Item Icon"
              className="w-14 h-14"
              radius="sm"
              src={icon}
            />
          )}
          <h1
            className="font-black uppercase text-white break-words flex-1"
            style={{
              fontFamily: "Fira Sans, sans-serif",
              fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 6rem)",
              textAlign: "left",
            }}
          >
            {itemTitle}
          </h1>
        </div>

        <Divider className="mb-4" style={{ backgroundColor: borderColor }} />

        <h4
          className="text-white font-normal break-words"
          style={{
            fontFamily: "Fira Sans, sans-serif",
            fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 3rem)",
            textAlign: "left",
          }}
        >
          {realmTitle}
        </h4>
      </CardBody>
    </Card>
  );
};
