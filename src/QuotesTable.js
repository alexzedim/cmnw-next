import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";

const useStyles = makeStyles(() => ({
    table: {
        minWidth: 400,
        maxHeight: '760px',
    }
}));

export default function QuotesTable({data, gold = false}) {
    const classes = useStyles();
    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table stickyHeader size="small" aria-label="Quotes">
                <TableHead>
                    <TableRow>
                        <TableCell>Price</TableCell>
                        <TableCell align="left">Quantity</TableCell>
                        <TableCell align="right">Value</TableCell>
                        <TableCell align="right">{(gold === true) ? ('Sellers') : ('Orders')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ price, quantity, open_interest, size }, i) => (
                        <TableRow key={i}>
                            <TableCell component="th" scope="row">{price.toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="right">{quantity.toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="right">{Math.round(open_interest).toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="right">{size}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}