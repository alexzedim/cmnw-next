import React from "react";
import Router from 'next/router';
import { ButtonGroup, Button } from "@material-ui/core";

export default function ItemContractButtons ({item, realm}) {
    const contracts = [
        {
            name: "intraday", value: "tod"
        },
        {
            name: "yesterday", value: "ytd"
        },
        {
            name: "week", value: "week"
        },
        {
            name: "last week", value: "last_week"
        },
        {
            name: "month", value: "month"
        },
        {
            name: "last month", value: "last_month"
        },
    ]
    return (
        <ButtonGroup color="primary" aria-label="outlined primary button group">
            {contracts.map(({name, value}) => (
                <Button onClick={() => Router.push(`/contracts/${value}/${item}@${realm}`)}>{name}</Button>
            ))}
        </ButtonGroup>
    );
};