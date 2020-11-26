import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";

export default function OSINT_Logs({data, pageSize = 15}) {
  if (!data) return <div>No records available</div>
  return (
    <MaterialTable
      title="OSINT Logs"
      icons={TableIcons}
      columns={[
        {title: 'Event', field: 'action', cellStyle: {width: '5%', minWidth: "100px"}},
        {title: 'Message', field: 'message', cellStyle: {width: '80%', minWidth: "450px"}},
        {
          title: 'After', field: 'after', cellStyle: {width: '10%', minWidth: "175px"},
          render: rowData => new Date(rowData.after).toLocaleString('en-GB')
        },
        {
          title: 'Before', field: 'before', cellStyle: {width: '10%', minWidth: "175px"},
          render: rowData => new Date(rowData.before).toLocaleString('en-GB'),
          defaultSort: 'desc',
        }
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
        pageSizeOptions: [5, 10, 15],
        showTitle: false,
        headerStyle: {backgroundColor: '#ebe7ee'}
      }}
    />
  )
}
