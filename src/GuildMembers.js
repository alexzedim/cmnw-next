import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import Link from "./Link";

export default function GuildMembers({data}) {
    if (!data) return <div>No records available</div>
    return (
        <MaterialTable
            title="Guild Members"
            icons={TableIcons}
            columns={[
                {
                    field: 'url_id',
                    title: 'Name',
                    render: rowData => <Link href={rowData.url_id} color="secondary" underline="hover">{rowData._id}</Link>
                },
                {
                    title: 'Rank',
                    field: 'rank',
                    type: 'numeric',
                    defaultSort: 'asc',
                    render: rowData => (parseInt(rowData.rank) === 0) ? ('GM') : (rowData.rank)
                },
                {
                    field: 'item_level',
                    title: 'ilvl',
                    render: rowData => parseInt(rowData.item_level)
                },
                {
                    field: 'url_a',
                    title: 'Hash.A',
                    render: rowData => <Link href={rowData.url_a} color="secondary" underline="hover">{rowData.a}</Link>
                },
                {
                    field: 'url_b',
                    title: 'Hash.B',
                    render: rowData => <Link href={rowData.url_b} color="secondary" underline="hover">{rowData.b}</Link>
                },
                {
                    field: 'url_c',
                    title: 'Hash.C',
                    render: rowData => <Link href={rowData.url_c} color="secondary" underline="hover">{rowData.c}</Link>
                },
                {
                    title: 'Last Modified',
                    field: 'lastModified',
                    cellStyle: {
                        width: 175,
                        minWidth: 175
                    },
                    render: rowData => new Date(rowData.lastModified).toLocaleString('en-GB')
                },
            ]}
            data={data.map(({_id, name, realm, guild, hash, ilvl, lastModified}) => {
                let row = {
                    _id: _id,
                    url_id: `/character/${realm.slug}/${name}`,
                    rank: `${guild.rank}`,
                    item_level: 0,
                    a: 0,
                    url_a: ``,
                    b: 0,
                    url_b: ``,
                    c: 0,
                    url_c: ``,
                    lastModified: lastModified
                };
                if (hash) {
                    if ("a" in hash) {
                        row.a = hash.a;
                        row.url_a = `/find/a/${hash.a}`;
                    }
                    if ("b" in hash) {
                        row.b = hash.b;
                        row.url_b = `/find/b/${hash.b}`;
                    }
                    if ("c" in hash) {
                        row.c = hash.c;
                        row.url_c = `/find/c/${hash.c}`;
                    }
                }
                if (ilvl) {
                    if ("eq" in ilvl) {
                        row.item_level = ilvl.eq;
                    }
                }
                return row
            })}
            style={{ backgroundColor: '#ebe7ee', textTransform: "uppercase"}}
            options={{
                sorting: true,
                pageSize: 20,
                pageSizeOptions: [10,25,50],
                showTitle: false,
                headerStyle: {backgroundColor:'#ebe7ee'}
            }}
        />
    )
}
