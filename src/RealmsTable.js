import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";

export default function RealmsTable ({data}) {
    if (!data || !data.length) return <div>No records available</div>
    return (
        <MaterialTable
            title="Contracts Table"
            icons={TableIcons}
            columns={[
                {
                    title: 'Hub',
                    field: 'connected_realm_id',
                    type: 'numeric'
                },
                {
                    title: 'Name',
                    field: 'name',
                    type: 'string'
                },
                {
                    title: 'Name Locale',
                    field: 'name_locale',
                    type: 'string'
                },
                {
                    title: 'Locale',
                    field: 'locale',
                    type: 'string'
                },
                {
                    title: 'Characters Total',
                    field: 'players.total',
                    defaultSort: 'desc',
                },
                {
                    title: 'Alliance',
                    field: 'players.alliance',
                    cellStyle: {
                        color: '#039be5'
                    },
                },
                {
                    title: 'Horde',
                    field: 'players.horde',
                    cellStyle: {
                        color: '#8C1616'
                    },
                },
                {
                    title: 'Max Level',
                    field: 'players.max_level',
                },
                {
                    title: 'Unique Players',
                    field: 'players.unique',
                },
                {
                    title: 'Guilds Total',
                    field: 'guilds.total',
                },
                {
                    title: 'Alliance',
                    field: 'guilds.alliance',
                    cellStyle: {
                        color: '#039be5'
                    },
                },
                {
                    title: 'Horde',
                    field: 'guilds.horde',
                    cellStyle: {
                        color: '#8C1616'
                    },
                },
                {
                    title: 'Gold',
                    field: 'golds',
                    render: rowData => new Date(rowData.golds*1000).toLocaleString('en-GB')
                },
                {
                    title: 'Valuations',
                    field: 'valuations',
                    render: rowData => new Date(rowData.valuations*1000).toLocaleString('en-GB')
                },
                {
                    title: 'Auctions',
                    field: 'auctions',
                    render: rowData => new Date(rowData.auctions*1000).toLocaleString('en-GB')
                },
            ]}
            data={data}
            style={{ backgroundColor: '#ebe7ee', textTransform: "uppercase"}}
            options={{
                sorting: true,
                pageSize: 20,
                pageSizeOptions: [10,20,25,50],
                showTitle: false,
                headerStyle: { backgroundColor:'#ebe7ee' }
            }}
        />
    )
}
