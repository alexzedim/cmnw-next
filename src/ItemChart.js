import React from "react";
import TableIcons from "TableIcons";
import MaterialTable from "material-table";

export default function ItemChart ({data}) {
    if (!data) return <div>No records available</div>
    let timeLeft = new Map([
        ['SHORT', '30m'],
        ['MEDIUM', '30m - 2h'],
        ['LONG', '2h - 12h'],
        ['VERY_LONG', '1D - 2D'],
    ])
    return (
        <MaterialTable
            title="Test"
            icons={TableIcons}
            columns={[
                {
                    title: 'ID', field: 'id', type: 'numeric', cellStyle: { width: '5%', minWidth: "100px" },
                },
                {
                    title: 'T', field: 'T',
                    render: ({item}) => <a href="#" data-disable-wowhead-tooltip="false" data-wh-icon-added="false" data-wh-rename-link="true" data-wh-icon-size="small" data-wowhead={`item=${item.id}&bonus=${item.bonus_lists.toString().replace(/,/g, ':')}&xml`}>hai</a>
                },
                { title: 'Realms', field: 'connected_realm_id' },
                { title: 'Bid', field: 'bid', type: 'currency', render: ({bid}) => bid.toLocaleString('ru-RU') },
                { title: 'Buyout', field: 'buyout', type: 'currency', defaultSort: 'asc', render: ({buyout}) => buyout.toLocaleString('ru-RU') },
                { title: 'Time Left', field: 'time_left', render: ({time_left}) => timeLeft.get(time_left) },
                {
                    title: 'Last Modified',
                    field: 'last_modified',
                    cellStyle: {
                        width: 175,
                        minWidth: 175
                    },
                    type: 'datetime',
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