import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";

/**
 * TODO import Link from "./Link"; with props
 * data-wowhead={`item=${item.id}&bonus=${item.bonus_lists.toString().replace(/,/g, ':')}&xml`}
 * @param name
 * @param quality
 * @param data
 * @returns {JSX.Element}
 * @constructor
 */

export default function ItemChart ({name, quality = 1, data}) {

    if (!data || !data.length) return <div>No records available</div>

    const qualityItem = new Map([
        ['Poor', 0],
        ['Common', 1],
        ['Uncommon', 2],
        ['Rare', 3],
        ['Epic', 4],
        ['Legendary', 5],
        ['Artifact', 6],
        ['Heirloom', 7],
        ['WoW Token', 8],
    ])

    const timeLeft = new Map([
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
                    title: 'Item', field: 'id',
                    render: ({item}) => <a href="#" data-disable-wowhead-tooltip="false" data-wh-icon-added="false" class={`q${qualityItem.get(quality)}`} data-wh-rename-link="true" data-wh-icon-size="small" data-wowhead={`item=${item.id}&bonus=${item.bonus_lists.toString().replace(/,/g, ':')}&xml`}>{name}</a>
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