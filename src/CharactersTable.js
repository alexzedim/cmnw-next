import React from "react";
import TableIcons from "./TableIcons";
import MaterialTable from "material-table";
import Link from "./Link";

export default function CharactersTable({data, members = false}) {
  if (!data || !data.length) return ('')

  const characters = data.map(({_id, name, realm, guild, hash, ilvl, media, faction, race, gender, character_class, spec, level, lastModified}) => {

    let avatar, guild_name, guild_rank, guild_url, item_level = 0, hash_a = '', hash_b = '', hash_c = '';

    if (hash) {
      if ("a" in hash) {
        hash_a = hash.a;
      }
      if ("b" in hash) {
        hash_b = hash.b;
      }
      if ("c" in hash) {
        hash_c = hash.c;
      }
    }

    if (media) {
      if ("avatar_url" in media) {
        avatar = media.avatar_url;
      }
    }

    if (!members && guild) {
      guild_url = `/guild/${guild.slug}@${realm.slug}`;
      guild_name = guild.name;
    }

    if (guild) {
      guild_rank = guild.rank
    }

    if (ilvl) {
      if ("eq" in ilvl) {
        item_level = ilvl.eq;
      }
    }

    return {
      _id: _id,
      url_id: `/character/${name}@${realm.slug}`,
      guild_url: guild_url || '',
      guild_name: guild_name || '',
      race: race,
      gender: gender,
      avatar: avatar,
      a: hash_a,
      b: hash_b,
      c: hash_c,
      spec: spec,
      level: level,
      url_a: `/hash/a@${hash_a}` || '',
      url_b: `/hash/b@${hash_b}` || '',
      url_c: `/hash/c@${hash_c}` || '',
      faction: faction,
      class: character_class,
      rank: guild_rank,
      item_level: item_level,
      lastModified: lastModified
    }
  })

  const columns = [
    {
      title: 'Avatar',
      field: 'avatar',
      render: ({avatar}) => ((avatar) ? (<img src={avatar} alt="A" style={{width: 50, borderRadius: '50%'}}/>) : (''))
    },
    {
      field: '_id',
      title: 'Name',
      render: rowData => <Link href={rowData.url_id} color="secondary" underline="hover">{rowData._id}</Link>
    },
    {
      title: 'Rank',
      field: 'rank',
      type: 'numeric',
      render: rowData => (parseInt(rowData.rank) === 0) ? ('GM') : (rowData.rank)
    },
    {
      field: 'item_level',
      title: 'ilvl',
      render: rowData => parseInt(rowData.item_level)
    },
    {title: 'Class', field: 'class'},
    {title: 'Level', field: 'level'},
    {title: 'Faction', field: 'faction'},
    {title: 'Race', field: 'race'},
    {title: 'Gender', field: 'gender'},
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
  ]

  if (!members) {
    columns.splice(2, 0, {
      field: 'guild_name',
      title: 'Guild',
      render: rowData => (rowData.guild_url && rowData.guild_name) ? (
        <Link href={rowData.guild_url} color="secondary" underline="hover">{rowData.guild_name}</Link>) : ('')
    })
    let column_index = columns.findIndex(({field}) => field === '_id')
    columns[column_index] = Object.assign(columns[column_index], {defaultSort: 'asc'})
  } else {
    let column_index = columns.findIndex(({field}) => field === 'rank')
    columns[column_index] = Object.assign(columns[column_index], {defaultSort: 'asc'})
  }

  return (
    <MaterialTable
      title="Characters"
      icons={TableIcons}
      columns={columns}
      data={characters}
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
