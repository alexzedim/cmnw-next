import React from "react";
import { Typography } from "@material-ui/core";
import Link from "./Link";

export default function CharacterProfile ({character}) {

    if (character.hash) {
        delete character.hash.t
    }

    /**
     * TODO
     * + OSINT back-end remove camelCase
     */

    const fieldsToCheck = ["id", "ilvl", "hash", "faction", "gender", "race", "character_class", "level", "spec",  "createdBy", "lastModified"];

    if (!character) return <div>No records available</div>
    return (
        fieldsToCheck.map(field => {
            if (field in character) {
                if (typeof character[field] === 'object') {
                    return Object.entries(character[field]).map(([k, v]) => (
                        (field === 'hash') ? (
                            <Typography variant="caption" display="block" gutterBottom>
                                {field} {k}: <Link href={`/find/${k}/${v}`} color="textPrimary" underline="hover">{v}</Link>
                            </Typography>
                        ) : (
                            <Typography variant="caption" display="block" gutterBottom>
                                {field} {k}: {v}
                            </Typography>
                        )
                    ))
                } else {
                    if (field === "lastModified") {
                        character[field] = new Date(character[field]).toLocaleString('en-GB')
                    }
                    return (
                        <Typography variant="caption" display="block" gutterBottom>
                            {field}: {character[field]}
                        </Typography>
                    )
                }
            }
        })
    )
}
