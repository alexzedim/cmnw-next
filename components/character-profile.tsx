"use client";

import { Link } from "@/components/custom-link";

interface CharacterProfileProps {
  character: Record<string, any>;
}

function humanizeString(str: string): string {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .toLowerCase()
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function pick(obj: Record<string, any>, keys: string[]): Record<string, any> {
  return Object.fromEntries(
    keys.filter((key) => key in obj).map((key) => [key, obj[key]])
  );
}

export const CharacterProfile = ({ character }: CharacterProfileProps) => {
  const fields: string[] = [
    "id",
    "level",
    "average_item_level",
    "equipped_item_level",
    "chosen_covenant",
    "renown_level",
    "faction",
    "gender",
    "race",
    "character_class",
    "active_spec",
    "createdBy",
  ];
  const fieldsWithLink: string[] = ["hash_a", "hash_b"];
  const profile = pick(character, [...fields, ...fieldsWithLink]);

  return (
    <div className="flex flex-col gap-2">
      {Object.entries(profile).map(([key, value], index) => {
        if (fieldsWithLink.includes(key) && value !== null) {
          return (
            <p key={index} className="text-sm text-muted">
              {humanizeString(key)}:{" "}
              <Link
                className="text-primary hover:text-accent transition-colors"
                href={`/${key.replace("_", "/")}@${value}`}
              >
                {value as string}
              </Link>
            </p>
          );
        }

        if (fields.includes(key) && value !== null) {
          return (
            <p key={index} className="text-sm text-muted">
              {humanizeString(key)}: {value}
            </p>
          );
        }

        if (key === "lastModified" && value !== null) {
          return (
            <p key={index} className="text-sm text-muted">
              {humanizeString(key)}:{" "}
              {new Date(profile.last_modified).toLocaleString("ru-RU")}
            </p>
          );
        }

        return null;
      })}
    </div>
  );
};
