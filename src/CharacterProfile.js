import React from "react";
import {Typography} from "@material-ui/core";
import Link from "./Link";
import humanizeString from 'humanize-string'

export default function CharacterProfile({character}) {

  if (!character) return <div>No records available</div>

  const field = ["id", "level", "average_item_level", "equipped_item_level", "chosen_covenant", "renown_level", "faction", "gender", "race", "character_class", "active_spec", "createdBy"];
  const hash = ["hash_a", "hash_b", "hash_f"];

  return (
    Object.entries(character).map(([key, value], index) => {
      if (hash.includes(key) && value !== null) {
        return (
          <Typography key={index} variant="caption" display="block" gutterBottom>
            {humanizeString(key)}: <Link href={`/${key.replace('_', '/')}@${value}`} color="textPrimary" underline="hover">{value}</Link>
          </Typography>
        )
      }
      if (field.includes(key) && value !== null) {
        return (
          <Typography key={index} variant="caption" display="block" gutterBottom>
            {humanizeString(key)}: {value}
          </Typography>
        )
      }
      if (key === "lastModified" && value !== null) {
        return (
          <Typography key={index} variant="caption" display="block" gutterBottom>
            {humanizeString(key)}: {new Date(character[value]).toLocaleString('ru-RU')}
          </Typography>
        )
      }
    })
  )
}
