import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from '@material-ui/core';
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%'
    },
    nested: {
        paddingLeft: theme.spacing(4),
    }
}));

export default function ItemValuations ({data, pageSize = 5}) {
    if (!data) return <div>No valuations available</div>
    const classes = useStyles();
    return (
        <MaterialTable
            title="Valuations"
            icons={TableIcons}
            columns={[
                { title: 'Name', field: 'name', cellStyle: { width: '5%', minWidth: "100px" } },
                { title: 'Flag', field: 'flag', cellStyle: { width: '5%', minWidth: "100px" } },
                { title: 'Type', field: 'type', cellStyle: { width: '5%', minWidth: "100px" } },
                { title: 'Value', field: 'value', cellStyle: { width: '10%', minWidth: "175px" }, defaultSort: 'asc' },
                { title: 'Realm', field: 'connected_realm_id', cellStyle: { width: '5%', minWidth: "75x" } },
                {
                    title: 'Last Modified',
                    field: 'last_modified',
                    cellStyle: {
                        width: 175,
                        minWidth: 175
                    },
                    render: rowData => new Date(rowData.last_modified*1000).toLocaleString('en-GB')
                }
            ]}
            data={data}
            style={{
                backgroundColor: '#ebe7ee',
                textTransform: "uppercase"
            }}
            options={{
                isLoading: true,
                sorting: true,
                pageSize: pageSize,
                search: false,
                pageSizeOptions: [5,10,20],
                showTitle: false,
                headerStyle: {backgroundColor:'#ebe7ee'}
            }}
            detailPanel={[
                {
                    tooltip: 'Show Info',
                    render: rowData => {
                        if (rowData.details) {
                           return (
                               <div
                                   className={classes.root}
                               >
                                   <Divider/>
                                   <List component="nav" aria-label="secondary" dense={true}>
                                       {Object.entries(rowData.details).map(([k, v]) => {
                                           if (k === "orders") {
                                               return ''
                                           }
                                           if (k === "reagent_items" || k === "premium_items" || k === "unsorted_items") {
                                               return (
                                                   <React.Fragment>
                                                       <ListItem>
                                                           <ListItemText primary={`${k.toString().replace(/_/g, ' ')}`}/>
                                                       </ListItem>
                                                       <List component="div" dense={true} disablePadding>
                                                           {v.map(x => (
                                                               <ListItem className={classes.nested}>
                                                                   <ListItemAvatar>
                                                                       <Avatar alt={x.name.en_GB} src={x.icon} />
                                                                   </ListItemAvatar>
                                                                   <ListItemText primary={<Link href={`/item/${rowData.connected_realm_id}/${x._id}`} color="textPrimary" underline="hover">{x.name.en_GB}</Link>} secondary={`Quantity: ${x.quantity}, Value: ${x.value}`} />
                                                               </ListItem>
                                                           ))}
                                                       </List>
                                                   </React.Fragment>
                                               )
                                           }
                                           return (
                                               <ListItem>
                                                   <ListItemText primary={`${k.toString().replace(/_/g, ' ')} : ${v}`}/>
                                               </ListItem>
                                           )
                                       })}
                                   </List>
                               </div>
                           )
                        }
                    },
                },
            ]}
        />
    )
}
