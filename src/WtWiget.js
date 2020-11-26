import Typography from "@material-ui/core/Typography";
import React from "react";

export default function WtWiget({data}) {
  let price;
  if (!data) return <div>Value not available</div>
  if (data) ({price} = data)
  return (
    <Typography component="h1" variant="h2" color="textSecondary">
      {price.toLocaleString('ru-RU')} g
    </Typography>
  );
}
