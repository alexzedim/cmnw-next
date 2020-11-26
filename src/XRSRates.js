import React from "react";
import {Typography} from "@material-ui/core";

export default function XRSRates({stackSize = 200}) {
  return (
    <React.Fragment>
      <Typography variant="caption" display="block" gutterBottom>
        Guild Tab Slots: 98
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Guild Tab (x{stackSize}) Capacity: {98 * stackSize}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Guild Bank 6 Tabs (x{stackSize}) Capacity: {98 * 6 * stackSize}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Guild Transfer Price (RUB): 2000
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Inventory Slots (30 Slot Bags & 16 Slot Backpack): {30 * 4 + 16}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Inventory Capacity (30 Slot Bags & 16 Slot Backpack): {136 * stackSize}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Bank Slots (30 Slot Bags): {7 * 30 + 28}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Bank Capacity (30 Slot Bags): {(7 * 30 + 28) * stackSize}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Reagent Bank Slots: 98
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Reagent Bank Capacity: {98 * stackSize}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Character Transfer Price (RUB): 1350
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Gold Cap Limit: 9999999
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Gold Cap XRS (per x1000) / Character Transfer RUB: {1350 / 10000}
      </Typography>
      <Typography variant="caption" display="block" gutterBottom>
        Gold Cap XRS (per x1000) / Guild Transfer RUB: {2000 / 10000}
      </Typography>
    </React.Fragment>
  )
}
