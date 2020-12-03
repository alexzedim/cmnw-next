import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import {makeStyles} from '@material-ui/core/styles';
import CheckIcon from '@material-ui/icons/Check';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import {
  Card,
  CardContent,
  Divider,
  Grid,
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

export default function ItemTable({data, direction}) {
  if (!data) return <div>No valuations available</div>
  const classes = useStyles();
  return (
    <MaterialTable
      title="Group Items"
      icons={TableIcons}
      columns={[
        {title: 'ID', field: '_id', align: 'left', cellStyle: { minWidth: 65, width: 65, maxWidth: 65 }},
        {
          title: '',
          field: 'icon',
          align: 'right',
          cellStyle: { whiteSpace: "nowrap", minWidth: 65, width: 65, maxWidth: 65 },
          render: ({icon}) => ((icon) ? (<img src={icon} alt="I" style={{width: 50, borderRadius: '50%'}}/>) : (''))
        },
        {
          title: 'Item',
          field: 'name',
          align: 'left',
          cellStyle: { whiteSpace: "nowrap", minWidth: 500, width: 500 },
          render: ({ticker, name}) => (<React.Fragment><p>{ticker}<br/>{name['en_GB']}<br/>{name['ru_RU']}</p></React.Fragment>)},
        {title: 'Expansion', field: 'expansion'},
        {title: 'Profession', field: 'profession_class'},
        {title: 'Stack Size', field: 'stackable'},
        {
          title: 'Item Class',
          align: 'left',
          cellStyle: { whiteSpace: "nowrap", minWidth: 250, width: 250 },
          render: ({item_class, item_subclass, inventory_type}) => (<React.Fragment><p>{item_class}<br/>{item_subclass}<br/>{inventory_type}</p></React.Fragment>)},
        {title: 'Min Buy (CTD)', field: 'valuations', render: ({valuations}) => Math.min(...valuations.filter(v => v.flag === 'BUY').map(v => v.value))},
        {title: 'Max Sell', field: 'valuations', render: ({valuations}) => Math.max(...valuations.filter(v => v.flag === 'SELL').map(v => v.value))},
        {title: 'Item',  align: 'center', render: ({_id}) => (_id && direction) ? (<Link href={`/item/${_id}@${direction}`} color="secondary" underline="hover"><ShowChartIcon/></Link>) : (<ShowChartIcon/>)},
        {title: 'Contracts', field: 'contracts',  align: 'center', render: ({contracts}) => (contracts) ? (<CheckIcon/>) : ('')},
        {title: 'Score', field: 'score', type: 'numeric', defaultSort: 'desc'},
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
