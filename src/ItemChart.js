import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import Link from "./Link";

export default function ItemChart ({name, data}) {

    if (!data || !data.length) return ('')

    const timeLeft = new Map([
        ['SHORT', '30m'],
        ['MEDIUM', '30m - 2h'],
        ['LONG', '2h - 12h'],
        ['VERY_LONG', '1D - 2D'],
    ])

    return (
        <MaterialTable
            title="Item Feed"
            icons={TableIcons}
            columns={[
                {
                    title: 'Item', field: 'id',
                    render: ({item}) => {
                        let item_query = `item=${item.id}&`
                        if (item.bonus_lists) {
                            if (item.bonus_lists.length) {
                                item_query = item_query.concat(`bonus=${item.bonus_lists.toString().replace(/,/g, ':')}`)
                            }
                        }
                        item_query = item_query.concat('&xml')
                        return (
                            <Link
                                href="#"
                                prefetch={false}
                                color="inherit"
                                variant="inherit"
                                underline="hover"
                                data-disable-wowhead-tooltip="false"
                                data-wh-icon-added="false"
                                data-wh-rename-link="true"
                                data-wh-icon-size="small"
                                data-wowhead={item_query}
                            >
                                {name}
                            </Link>
                        )
                    }
                },
                { title: 'Realms', field: 'connected_realm_id', render:({connected_realm_id}) => connected_realm_id.toString().replace(/,/g, ', ') },
                { title: 'Buyout', field: 'buyout', defaultSort: 'asc', align: 'center', render: ({bid, buyout}) => {
                        if (buyout) {
                            return buyout.toLocaleString('ru-RU')
                        } else {
                            return `BID: ${bid.toLocaleString('ru-RU')}`
                        }
                    }
                },
                { title: 'Time Left', field: 'time_left', render: ({time_left}) => timeLeft.get(time_left) },
                {
                    title: 'Last Modified',
                    field: 'last_modified',
                    cellStyle: {
                        width: 175,
                        minWidth: 175
                    },
                    render: ({last_modified}) => new Date(last_modified * 1000).toLocaleString('en-GB')
                }
            ]}
            data={data}
            style={{
                backgroundColor: '#ebe7ee',
                textTransform: "uppercase"
            }}
            options={{
                sorting: true,
                pageSize: 10,
                search: false,
                pageSizeOptions: [5,10,15],
                showTitle: false,
                headerStyle: {backgroundColor:'#ebe7ee'}
            }}
        />
    )
};
