import { FC, Fragment } from 'react';
import { Avatar, TableCell, TableRow } from '@mui/material';
import { itemDetailsTable, ValuationTypes } from '../../types';
import humanizeString from 'humanize-string';
import Link from '../Link';

const ItemDetailsTable: FC<itemDetailsTable> = ({ type, details, connected_realm_id }) => {
  if (
    type === ValuationTypes.OTC ||
    type === ValuationTypes.GOLD ||
    type === ValuationTypes.FUNPAY ||
    type === ValuationTypes.WOWTOKEN
  ) {
    return (
      <Fragment>
        {Object.entries(details).map(([key, value], i) => (
          <TableRow key={i}>
            <TableCell colSpan={3} align="right">{humanizeString(key)}</TableCell>
            <TableCell colSpan={3} align="right">{typeof value === 'number' ? value.toLocaleString('ru-RU') : value}</TableCell>
          </TableRow>
        ))}
      </Fragment>
    )
  }

  if (type === ValuationTypes.DERIVATIVE) {
    return (
      <Fragment>
        <TableRow>
          <TableCell colSpan={1}/>
          <TableCell colSpan={1} variant="head">Name</TableCell>
          <TableCell colSpan={1} variant="head">Ticker</TableCell>
          <TableCell colSpan={1} variant="head">Price</TableCell>
          <TableCell colSpan={1} variant="head">Quantity</TableCell>
          <TableCell colSpan={1} variant="head">Value</TableCell>
        </TableRow>
        {details.reagent_items.map((row) => (
          <TableRow key={row._id}>
            <TableCell colSpan={1}><Avatar alt="Item Icon" variant="rounded" src={row.icon}/></TableCell>
            <TableCell colSpan={1}><Link href={`/item/${row.name.en_GB}@${connected_realm_id}`} color="textPrimary" underline="hover">{row.name.en_GB}</Link></TableCell>
            <TableCell colSpan={1}>{row.ticker}</TableCell>
            <TableCell colSpan={1} align="right" >{(row.value / row.quantity).toFixed(2)}</TableCell>
            <TableCell colSpan={1} align="right" >{row.quantity}</TableCell>
            <TableCell colSpan={1} align="right" >{row.value.toFixed(2)}</TableCell>
          </TableRow>
        ))}
        <TableRow>
          { details.rank ? <TableCell colSpan={1} align="right" variant="head">Rank</TableCell> : <TableCell colSpan={1}/> }
          { details.rank ? <TableCell colSpan={1} align="left">{details.rank}</TableCell> : <TableCell colSpan={1}/> }
          <TableCell colSpan={1} align="right" variant="head">Queue Cost</TableCell>
          <TableCell colSpan={1} align="left">{details.queue_cost}</TableCell>
          <TableCell colSpan={1} align="right" variant="head">Queue Quantity</TableCell>
          <TableCell colSpan={1} align="left">{details.queue_quantity}</TableCell>
        </TableRow>
      </Fragment>
    )
  }

  if (type === ValuationTypes.MARKET) {
    return (
      <Fragment>
        <TableRow key={0}>
          <TableCell colSpan={3} align="right">Minimal Price</TableCell>
          <TableCell colSpan={3} align="right">{details.min_price}</TableCell>
        </TableRow>
        <TableRow key={1}>
          <TableCell colSpan={3} align="right">Quantity</TableCell>
          <TableCell colSpan={3} align="right">{details.quantity}</TableCell>
        </TableRow>
        <TableRow key={2}>
          <TableCell colSpan={3} align="right">Open Interest</TableCell>
          <TableCell colSpan={3} align="right">{details.open_interest.toLocaleString('ru-RU')}</TableCell>
        </TableRow>
        <TableRow key={3}>
          <TableCell colSpan={3} align="right">Orders</TableCell>
          <TableCell colSpan={3} align="right">{details.orders.length}</TableCell>
        </TableRow>
      </Fragment>
    )
  }

  return <></>
}

export default ItemDetailsTable;
