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
      className="max-w-6xl mx-4 my-4"
      style={{ background: backgroundRoot }}
    >
      <CardBody
        className="p-6 border-8 rounded-xl"
        style={{
          background: backgroundRoot,
          borderColor: borderColor,
        }}
      >
        <div className="flex items-center gap-4">
          {icon && (
            <Avatar
              alt="Item Icon"
              className="w-16 h-16 flex-shrink-0"
              radius="sm"
              src={icon}
            />
          )}
          <div className="flex-1 min-w-0">
            <h1
              className="font-bold uppercase text-white break-words"
              style={{
                fontFamily: "Fira Sans, sans-serif",
                fontSize: "clamp(1.25rem, 2vw + 0.5rem, 2.5rem)",
                textAlign: "left",
                lineHeight: "1.2",
              }}
            >
              {itemTitle}
            </h1>
            {realmTitle && (
              <h4
                className="text-white/90 font-normal break-words mt-1"
                style={{
                  fontFamily: "Fira Sans, sans-serif",
                  fontSize: "clamp(0.875rem, 1vw + 0.5rem, 1.25rem)",
                  textAlign: "left",
                }}
              >
                {realmTitle}
              </h4>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
