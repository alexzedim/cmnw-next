import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import Link from "./Link";

export default function CharactersTable({data, members = false}) {
  if (!data || !data.length) return ('')

  const columns = [
    {
      title: 'Avatar',
      field: 'media',
      render: ({media}) => ((media && 'avatar_url' in media) ? (<img src={media.avatar_url} alt="A" style={{width: 50, borderRadius: '50%'}}/>) : (''))
    },
    {
      field: '_id',
      title: 'Name',
      render: ({_id}) => <Link href={`/character/${_id}`} color="secondary" underline="hover">{_id}</Link>
    },
    {
      title: 'Rank',
      field: 'guild',
      type: 'numeric',
      customSort: (a, b) => (a.guild && 'rank' in a.guild && b.guild && 'rank' in b.guild) ? (a.guild.rank - b.guild.rank) : (''),
      render: ({guild}) => {
        if (guild && 'rank' in guild) {
          if (parseInt(guild.rank) === 0) {
            return ('GM')
          } else {
            return guild.rank
          }
        }
      }
    },
    {
      field: 'item_level',
      title: 'ilvl',
      type: 'numeric',
      render: ({ilvl}) => ((ilvl && ilvl.eq) ? (ilvl.eq) : (''))
    },
    {title: 'Class', field: 'character_class'},
    {title: 'Level', field: 'level'},
    {title: 'Faction', field: 'faction'},
    {title: 'Race', field: 'race'},
    {title: 'Gender', field: 'gender'},
    {
      field: 'hash',
      title: 'Hash.A',
      render: ({hash}) => (hash && hash.a) ? (<Link href={`/hash/a@${hash.a}`} color="secondary" underline="hover">{hash.a}</Link>) : ('')
    },
    {
      field: 'hash',
      title: 'Hash.B',
      render: ({hash}) => (hash && hash.b) ? (<Link href={`/hash/b@${hash.b}`} color="secondary" underline="hover">{hash.b}</Link>) : ('')
    },
    {
      title: 'Last Modified',
      field: 'lastModified',
      cellStyle: {
        width: 175,
        minWidth: 175
      },
      render: ({lastModified}) => new Date(lastModified).toLocaleString('en-GB')
    },
  ]

  if (!members) {
    columns.splice(2, 0, {
      field: 'guild',
      title: 'Guild',
      render: ({guild, realm}) => {
        if (guild && guild.slug && guild.name) return (<Link href={`/guild/${guild.slug}@${realm.slug}`} color="secondary" underline="hover">{guild.name}</Link>)
      }
    })
    const column_index = columns.findIndex(({field}) => field === '_id')
    if (column_index !== -1) Object.assign(columns[column_index], {defaultSort: 'asc'})
  } else {
    const column_index = columns.findIndex(({field}) => field === 'guild')
    if (column_index !== -1) Object.assign(columns[column_index], {defaultSort: 'asc'})
    columns.splice(6, 0, {
      field: 'covenant',
      title: 'Covenant',
      render: ({covenant}) => ((covenant && 'chosen_covenant' in covenant && 'renown_level' in covenant)) ? (`${covenant.chosen_covenant} ${covenant.renown_level}`) : ('')
    })
  }

  return (
    <MaterialTable
      title="Characters"
      icons={TableIcons}
      columns={columns}
      data={data}
      style={{backgroundColor: 'inherit', textTransform: "uppercase"}}
      options={{
        sorting: true,
        pageSize: 20,
        pageSizeOptions: [10, 25, 50],
        showTitle: false,
        headerStyle: {backgroundColor: 'inherit'}
      }}
    />
  )
}
