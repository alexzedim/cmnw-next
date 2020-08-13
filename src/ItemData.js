import React from "react";
import { Typography } from "@material-ui/core";
import humanizeString from 'humanize-string'

export default function ItemData ({data}) {

    if (!data) return ('')

    const fieldsToCheck = [
        "_id", "name", "level", "ilvl",
        "inventory_type", "quality",
        "item_class", "item_subclass", "asset_class", "profession_class",
        "expansion", "ticker", "purchase_price", "sell_price", "purchase_quantity", "stackable"
    ];

    return (
        fieldsToCheck.map(field => {
            if (field in data) {
                if (Array.isArray(data[field])) {
                    if (data[field].length) {
                        return (
                            <Typography variant="caption" display="block" gutterBottom>
                                {humanizeString(field)}: {data[field].toString().replace(/,/g, ' ')}
                            </Typography>
                        )
                    }
                } else if (typeof data[field] === 'object') {
                    if (field === 'name') {
                        return (
                            <Typography variant="caption" display="block" gutterBottom>
                                {field}: {data[field].en_GB}
                            </Typography>
                        )
                    } else {
                        return Object.entries(data[field]).map(([k, v]) => (
                            <Typography variant="caption" display="block" gutterBottom>
                                {humanizeString(field)} {humanizeString(k)}: {v}
                            </Typography>
                        ))
                    }
                } else {
                    return (
                        <Typography variant="caption" display="block" gutterBottom>
                            {humanizeString(field)}: {data[field]}
                        </Typography>
                    )
                }
            }
        })
    )
}
