import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import {makeStyles} from '@material-ui/core/styles';
import {
  Avatar,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@material-ui/core';
import Link from "./Link";

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%'
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
  valuation: {
    backgroundColor: 'transparent',
    position: 'relative',
    margin: theme.spacing(4),
  }
}));

export default function ItemTable({data, pageSize = 15}) {
  if (!data) return <div>No valuations available</div>
  const classes = useStyles();
  return (
    <MaterialTable
      title="Group Items"
      icons={TableIcons}
      columns={[
        {title: 'ID', field: '_id'},
        {
          title: 'Icon',
          field: 'icon',
          render: ({icon}) => ((icon) ? (<img src={icon} alt="I" style={{width: 50, borderRadius: '50%'}}/>) : (''))
        },
        {title: 'Item', field: 'name', render: ({ticker, name}) => (<React.Fragment><p>{ticker}<br/>{name['en_GB']}<br/>{name['ru_RU']}</p></React.Fragment>)},
        {title: 'Expansion', field: 'expansion'},
        {title: 'Profession', field: 'profession_class'},
        {title: 'Stack Size', field: 'stackable'},
        {title: 'Item Class',  render: ({item_class, item_subclass}) => (item_class + ' / ' + item_subclass)},
        {title: 'Min Buy (CTD) / Max Sell ', field: 'valuations', render: ({valuations}) => Math.min(...valuations.filter(v => v.flag === 'BUY').map(v => v.value)) + ' / ' +  Math.max(...valuations.filter(v => v.flag === 'SELL').map(v => v.value))},
        //TODO valuations item
        {title: 'Score', field: 'score'},
      ]}
      data={data}
      style={{
        backgroundColor: 'inherit',
        textTransform: "uppercase"
      }}
      options={{
        isLoading: true,
        sorting: true,
        pageSize: 10,
        pageSizeOptions: [5, 10, 20],
        showTitle: false,
        headerStyle: {backgroundColor: 'inherit'}
      }}
      detailPanel={[
        {
          tooltip: 'Show Valuations',
          render: ({valuations}) => (
            <div>
              <Grid
                container
                direction="row"
                justify="space-around"
                alignItems="center"
              >
                <React.Fragment>
                {valuations.map((v, i) => (
                  <Grid item xs={2} key={i}>
                    <Card className={classes.valuation}>
                      <CardContent align={'center'}>
                        <Divider/>
                        <br/>
                        NAME: {v.name}
                        <br/>
                        <br/>
                        REALM: {v.connected_realm_id}
                        <br/>
                        <br/>
                        FLAG: {v.flag}
                        <br/>
                        <br/>
                        TYPE: {v.type}
                        <br/>
                        <br/>
                        VALUE: {v.value}
                        <br/>
                        <br/>
                        <Divider/>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
                </React.Fragment>
              </Grid>
            </div>
          ),
        },
      ]}
    />
  )
}
