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
    if (!data) return ('')
    return (
        <TableContainer component={Paper} className={classes.table}>
            <Table stickyHeader size="small" aria-label="Quotes">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Price</TableCell>
                        <TableCell align="center">Quantity</TableCell>
                        <TableCell align="center">Value</TableCell>
                        <TableCell align="center">{(gold === true) ? ('Sellers') : ('Orders')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map(({ price, quantity, open_interest, size }, i) => (
                        <TableRow key={i}>
                            <TableCell align="center" component="th" scope="row">{price.toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="center">{quantity.toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="center">{Math.round(open_interest).toLocaleString('ru-RU')}</TableCell>
                            <TableCell align="center">{size}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}