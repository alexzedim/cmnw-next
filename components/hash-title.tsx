"use client";

import { useState } from "react";
import {
  Card,
  CardBody,
  Divider,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";

import { generateFactionBackground } from "@/lib";

interface HashTitleProps {
  id: string;
}

export const HashTitle = ({ id }: HashTitleProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<string>("");

  const [type, query] = id.split("@");
  const hash = query.replace(/(.{4})/g, "$1 ");

  const handleClick = async () => {
    try {
      await navigator.clipboard.writeText(id);
      setCopyStatus(`Hash ${id} has been copied!`);
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      setCopyStatus("Failed to copy!");
      setIsOpen(true);
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  const background = generateFactionBackground();

  return (
    <Card className="max-w-6xl mx-4 my-8 border border-divider" style={{ background }}>
      <CardBody
        className="p-8 rounded-xl"
        style={{ background }}
      >
        <Popover isOpen={isOpen} placement="bottom" onOpenChange={setIsOpen}>
          <PopoverTrigger>
            <h1
              className="font-black uppercase text-white break-words cursor-pointer hover:opacity-80 transition-opacity"
              style={{
                fontFamily: "Fira Sans, sans-serif",
                fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 6rem)",
                textAlign: "left",
              }}
              onClick={handleClick}
            >
              {hash}
            </h1>
          </PopoverTrigger>
          <PopoverContent>
            <div className="px-4 py-2">
              <p className="text-sm">{copyStatus}</p>
            </div>
          </PopoverContent>
        </Popover>

        <Divider className="my-4 bg-primary" />

        <h2
          className="text-white font-normal break-words uppercase"
          style={{
            fontFamily: "Fira Sans, sans-serif",
            fontSize: "clamp(1.3rem, -2.75rem + 16.6667vw, 3rem)",
            textAlign: "left",
          }}
        >
          Type {type}
        </h2>
      </CardBody>
    </Card>
  );
};
