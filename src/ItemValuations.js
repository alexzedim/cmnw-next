import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import { makeStyles } from '@material-ui/core/styles';
import { List, ListItem, ListItemAvatar, ListItemText, Divider, Avatar } from '@material-ui/core';

/**
 * TODO add  rows
 * @param data
 * @param pageSize
 * @returns {*}
 * @constructor
 */

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
                { title: 'Value', field: 'value', cellStyle: { width: '80%', minWidth: "175px" }, defaultSort: 'asc' },
            ]}
            data={data}
            style={{
                backgroundColor: '#ebe7ee',
                textTransform: "uppercase"
            }}
            options={{
                sorting: true,
                pageSize: pageSize,
                search: false,
                pageSizeOptions: [5,10,15],
                showTitle: false,
                headerStyle: {backgroundColor:'#ebe7ee'}
            }}
            detailPanel={[
                {
                    icon: "X",
                    openIcon: "X",
                    tooltip: 'Show Both',
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
                                           if (Array.isArray(v)) {
                                               return (
                                                   <React.Fragment>
                                                       <ListItem>
                                                           <ListItemText primary={`${k.toString().replace(/_/g, ' ')}`}/>
                                                       </ListItem>
                                                       <List component="div" disablePadding>
                                                           {v.map(x => (
                                                               <ListItem className={classes.nested}>
                                                                   <ListItemAvatar>
                                                                       <Avatar alt={x.name.en_GB} src={x.icon} />
                                                                   </ListItemAvatar>
                                                                   <ListItemText primary={x.name.en_GB} secondary={`Quantity: ${x.quantity}, Value: ${x.value}`} />
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
