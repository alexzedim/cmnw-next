import React from "react";
import {Typography} from "@material-ui/core";
import Link from "./Link";
import humanizeString from 'humanize-string'

export default function CharacterProfile({character}) {

  if (!character) return <div>No records available</div>

  const fieldsToCheck = ["id", "level", "ilvl", "hash", "covenant", "faction", "gender", "race", "character_class", "spec", "createdBy", "lastModified"];

  return (
    fieldsToCheck.map((field, field_index) => {
      if (field in character && character[field] !== null) {
        if (typeof character[field] === 'object' && !Array.isArray(character[field])) {
          /**
           * Iterate over objects key and value
           */
          return Object.entries(character[field]).map(([key, value], index) => {
            if (field === 'hash' && value !== null) {
              return (
                <Typography key={field_index * 10 + index} variant="caption" display="block" gutterBottom>
                  {field} {key}: <Link href={`/hash/${key}@${value}`} color="textPrimary" underline="hover">{value}</Link>
                </Typography>
              )
            }
            if (field === 'covenant' && value !== null) {
              return (
                <Typography key={field_index * 10 + index} variant="caption" display="block" gutterBottom>
                  {humanizeString(key)}: {value}
                </Typography>
              )
            }
            if ((field !== 'hash' || field !== 'covenant') && value !== null) {
              return (
                <Typography key={field_index * 10 + index} variant="caption" display="block" gutterBottom>
                  {humanizeString(field)} {humanizeString(key)}: {value}
                </Typography>
              )
            }
          })
        } else {
          if (field === "lastModified") {
            return (
              <Typography key={field_index} variant="caption" display="block" gutterBottom>
                {humanizeString(field)}: {new Date(character[field]).toLocaleString('en-GB')}
              </Typography>
            )
          } else {
            return (
              <Typography key={field_index} variant="caption" display="block" gutterBottom>
                {humanizeString(field)}: {character[field]}
              </Typography>
            )
          }
        }
      }
    })
  )
}
