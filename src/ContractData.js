import React from "react";
import { Typography } from "@material-ui/core";
import humanizeString from 'humanize-string'

export default function ContractData ({data}) {

    if (!data) return ('')

    return (
        Object.entries(data).map(([k, v]) => (
            <Typography variant="caption" display="block" gutterBottom>
                {humanizeString(k)} : {v}
            </Typography>
        ))
    )
}
