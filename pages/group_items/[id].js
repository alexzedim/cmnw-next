import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import {Container, Divider, Typography} from "@material-ui/core";
import {useRouter} from "next/router";

import MetaHead from '../../src/MetaHead'
import ItemTable from "../../src/ItemTable";

const useStyles = makeStyles(theme => ({
  divider: {
    margin: `${theme.spacing(2)}px auto`,
  },
  titleBlock: {
    padding: theme.spacing(10, 0, 5),
  },
  title: {
    fontFamily: 'Fira Sans',
    fontStyle: 'normal',
    fontDisplay: 'swap',
    fontWeight: 400,
    textTransform: 'uppercase'
  }
}));

function ItemGroup({items}) {
  const {query: {id}} = useRouter()
  console.log(id)
  const classes = useStyles();
  return (
    <main>
      <MetaHead
        title={id.toUpperCase()}
        description={`ttt`}
      />
      <div className={classes.titleBlock}>
        <Container maxWidth="lg">
          <Typography component="h1" variant="h2" align="center" color="secondary" className={classes.title} gutterBottom>
            {id.toUpperCase()}
          </Typography>
        </Container>
      </div>
      <Divider className={classes.divider}/>
      <Container maxWidth={false}>
        <ItemTable data={items} />
        <Divider className={classes.divider}/>
      </Container>
    </main>
  )
}

export async function getServerSideProps({query}) {
  const {id} = query;
  const gql = `query Items($id: ID!) {
    items(id: $id) {
      _id
      name {
        en_GB
        ru_RU
      }
      ticker
      realms {
        _id
        name
        slug
        valuations
        ticker
      }
      valuations {
        name
        item_id
        connected_realm_id
        type
        last_modified
        value
        flag
        details {
          queue_cost
          queue_quantity
          rank
          reagent_items {
            _id
            quality
            level
            name {
              en_GB
            }
            icon
            item_class
            item_subclass
            purchase_price
            sell_price
            is_equippable
            is_stackable
            inventory_type
            purchase_quantity
            loot_type
            contracts
            expansion
            stackable
            profession_class
            ticker
            createdAt
            updatedAt
            value
            quantity
          }
          premium_items {
            _id
            quality
            name {
              en_GB
            }
            level
            icon
            item_class
            item_subclass
            purchase_price
            sell_price
            is_equippable
            is_stackable
            inventory_type
            purchase_quantity
            loot_type
            contracts
            expansion
            stackable
            profession_class
            ticker
            createdAt
            updatedAt
            value
            quantity
          }
          unsorted_items {
            _id
            name {
              en_GB
            }
            quality
            level
            icon
            item_class
            item_subclass
            purchase_price
            sell_price
            is_equippable
            is_stackable
            inventory_type
            purchase_quantity
            loot_type
            contracts
            expansion
            stackable
            profession_class
            ticker
            createdAt
            updatedAt
            value
            quantity
          }
          wi
          quotation
          swap_type
          description
          price_size
          quantity
          open_interest
        }
      }
      quality
      level
      icon
      item_class
      item_subclass
      purchase_price
      sell_price
      is_equippable
      is_stackable
      inventory_type
      purchase_quantity
      loot_type
      contracts
      asset_class
      expansion
      stackable
      profession_class
      ticker
      tags
      createdAt
      updatedAt
      score
    } 
  }`
  const {data: {items}} = await fetch(`http://${process.env.api}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: gql,
      variables: {id},
    })
  }).then(res => res.json())
  return {props: {items}}
}

export default ItemGroup
