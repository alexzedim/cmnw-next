import React from "react";
import {Typography} from "@material-ui/core";

export default function Clock(props) {
  const [date, setDate] = React.useState(new Date());
  const tick = () => {
    setDate(new Date());
  };
  React.useEffect(() => {
    let timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });
  return (
    (props.time) ? (
      <React.Fragment>
        <Typography align="center" variant="caption" display="block">
          NOW: {new Date().toLocaleString('en-GB')} LAST UPD: {new Date(props.time).toLocaleString('en-GB')}
        </Typography>
      </React.Fragment>
    ) : (
      <Typography variant="caption" display="block">
        NOW: {new Date().toLocaleString('en-GB')}
      </Typography>
    )
  );
};
