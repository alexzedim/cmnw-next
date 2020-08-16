import React from "react";
import { Typography } from "@material-ui/core";
import Link from "./Link";
import humanizeString from 'humanize-string'

export default function CharacterProfile ({character}) {

    if (!character) return <div>No records available</div>

    if (character.hash) {
        delete character.hash.t
    }

    const fieldsToCheck = ["id", "level", "ilvl", "hash", "faction", "gender", "race", "character_class", "spec",  "createdBy", "lastModified"];

    return (
        fieldsToCheck.map((field, i) => {
            if (field in character) {
                if (typeof character[field] === 'object') {
                    return Object.entries(character[field]).map(([k, v], y) => (
                        (field === 'hash') ? (
                            <Typography key={i+y} variant="caption" display="block" gutterBottom>
                                {field} {k}: <Link href={`/find/${k}/${v}`} color="textPrimary" underline="hover">{v}</Link>
                            </Typography>
                        ) : (
                            <Typography key={i+y} variant="caption" display="block" gutterBottom>
                                {humanizeString(field)} {humanizeString(k)}: {v}
                            </Typography>
                        )
                    ))
                } else {
                    if (field === "lastModified") {
                        character[field] = (new Date(character[field]))
                    }
                    return (
                        <Typography key={i} variant="caption" display="block" gutterBottom>
                            {humanizeString(field)}: {character[field]}
                        </Typography>
                    )
                }
            }
        })
    )
}
