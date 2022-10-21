import { FC, Fragment } from 'react';
import MUIDataTable from 'mui-datatables';
import useSWR from 'swr';
import { LinearProgress, Box } from '@mui/material';
import { DOMAINS } from '../../constants';
import { AuctionsResponse, itemQuery } from '../../types';
import { theme } from '../../styles';
import Link from '../Link';

const styleCss = {
  root: {
    padding: theme.spacing(2),
    borderRadius: '15px',
    position: 'relative',
  },
  table: {
    color: 'white',
    padding: '1rem',
    border: 'solid 15px white',
  },
}

const options = {
  selectableRows: 'none',
  download: false,
  rowsPerPage: 25,
  rowsPerPageOptions: [15, 25, 50],
  setTableProps: () => ({ size:'small' }),
}

export const ItemListing: FC<itemQuery & { name: string }> = ({ id, name, is_gold, is_commdty }) => {

  if (is_commdty || is_gold) return <></>

  const { data, error } = useSWR<AuctionsResponse>(`${DOMAINS.domain}/api/dma/item/feed?_id=${id}`, (url) => fetch(url).then(r => r.json()));
  if (!data) return <LinearProgress />

  if (error) return <></>

  const timeLeft = new Map([
    ['SHORT', '30m'],
    ['MEDIUM', '30m - 2h'],
    ['LONG', '2h - 12h'],
    ['VERY_LONG', '1D - 2D'],
  ]);

  const columns = [
    {
      name: 'id',
      label: 'Item',
      options: {
        customBodyRenderLite: (dataIndex) => {
          let wowhead = `item=${data.feed[dataIndex].item_id}&`;
          if (data.feed[dataIndex].item.bonus_lists) {
            const bonus_lists: string = data.feed[dataIndex].item.bonus_lists.toString().replace(/,/g, ':');
            wowhead = wowhead.concat(`bonus=${bonus_lists}`);
          }
          wowhead = wowhead.concat('&xml')
          return (
            <Link
              href={`https://wowhead.com/item=${data.feed[dataIndex].item_id}`}
              prefetch={false}
              color="inherit"
              variant="inherit"
              underline="hover"
              data-disable-wowhead-tooltip="false"
              data-wh-icon-added="false"
              data-wh-rename-link="true"
              data-wh-icon-size="small"
              data-wowhead={wowhead}
            >
              {name}
            </Link>
          )
        }
      }
    },
    {
      name: 'connected_realm_id',
      label: 'Realm',
    },
    {
      name: 'buyout',
      label: 'Price',
      options: {
        customBodyRenderLite: (dataIndex) => {
          if (data.feed[dataIndex].buyout) return data.feed[dataIndex].buyout.toLocaleString('ru-RU');
          return `BID: ${data.feed[dataIndex].bid.toLocaleString('ru-RU')}`
        }
      }
    },
    {
      name: 'time_left',
      label: 'Expiration',
      options: {
        customBodyRenderLite: (dataIndex) => timeLeft.has(data.feed[dataIndex].time_left)
          ? timeLeft.get(data.feed[dataIndex].time_left) : data.feed[dataIndex].time_left
      }
    },
    {
      name: 'last_modified',
      label: 'Last Update',
      options: {
        customBodyRenderLite: (dataIndex) => new Date(data.feed[dataIndex].last_modified).toLocaleString('en-GB')
      }
    },
  ];

  return (
    <Fragment>
      <Box sx={styleCss.root}>
        <Box sx={styleCss.table}>
          <MUIDataTable
            data={data.feed}
            columns={columns}
            options={options}
          />
        </Box>
      </Box>
    </Fragment>
  )
}

export default ItemListing;
