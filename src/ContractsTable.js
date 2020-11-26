import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";

export default function ContractsTable({data}) {
  if (!data) return <div>No records available</div>
  return (
    <MaterialTable
      title="Contracts Table"
      icons={TableIcons}
      columns={[
        {
          title: 'Price',
          field: 'price',
          render: ({price}) => price.toLocaleString('en-GB')
        },
        {
          title: 'Price Size',
          field: 'price_size',
          render: ({price_size}) => price_size.toLocaleString('en-GB')
        },
        {
          title: 'Quantity',
          field: 'quantity',
          render: ({quantity}) => quantity.toLocaleString('en-GB')
        },
        {
          title: 'Open Interest',
          field: 'open_interest',
          render: ({open_interest}) => parseInt(open_interest).toLocaleString('ru-RU')
        },
        {
          title: 'Sellers',
          field: 'sellers',
          render: ({sellers}) => sellers.length
        },
        {
          title: 'Orders',
          field: 'orders',
          render: ({orders}) => orders.length
        },
        {
          title: 'Last Modified',
          field: 'last_modified',
          cellStyle: {
            width: 175,
            minWidth: 175
          },
          defaultSort: 'desc',
          render: rowData => new Date(rowData.last_modified * 1000).toLocaleString('en-GB')
        },
      ]}
      data={data}
      style={{backgroundColor: '#ebe7ee', textTransform: "uppercase"}}
      options={{
        sorting: true,
        pageSize: 20,
        pageSizeOptions: [10, 20, 25, 50],
        showTitle: false,
        headerStyle: {backgroundColor: '#ebe7ee'}
      }}
    />
  )
}
