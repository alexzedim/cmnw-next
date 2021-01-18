import React, { useState, useEffect } from "react";
import {AppBar, Toolbar, Typography, IconButton, Drawer, MenuItem} from '@material-ui/core';
import MenuIcon from "@material-ui/icons/Menu";
import {makeStyles} from '@material-ui/core/styles';
import Link from "./Link";


const headersData = [
  {
    label: "Characters & Guilds",
    href: "/osint",
  },
  {
    label: "Items & Auctions",
    href: "/dma",
  },
  {
    label: "Discord Bot",
    href: "/discord",
  },
  {
    label: "Help",
    href: "/help",
  },
  {
    label: "Who we are",
    href: "/who-we-are",
  },
];

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 1,
    justifyContent: "space-between",
  },
  element: {
    paddingLeft: '50px',
    paddingRight: '50px'
  },
  appBar: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  }
}));

export default function Header() {
  const classes = useStyles();

  const [state, setState] = useState({
    mobileView: false,
    drawerOpen: false,
  });

  const { mobileView, drawerOpen } = state;

  useEffect(() => {
    const setResponsiveness = () => {
      return window.innerWidth < 900
          ? setState((prevState) => ({ ...prevState, mobileView: true }))
          : setState((prevState) => ({ ...prevState, mobileView: false }));
    };

    setResponsiveness();

    window.addEventListener("resize", () => setResponsiveness());
  }, []);

  const getMenuButtons = () => {
    return headersData.map(({ label, href }, i) => {
      return (
          <Typography className={classes.element} key={i} variant="overline" color="primary" align="center" noWrap>
            <Link href={href} color="inherit" underline="none">
              {label}
            </Link>
          </Typography>
      );
    });
  };

  const getDrawerChoices = () => {
    return headersData.map(({ label, href }, i) => {
      return (
        <MenuItem key={i}>
          <Typography variant="overline" color="primary" align="center" noWrap>
            <Link href={href} color="inherit" underline="none">
              {label}
            </Link>
          </Typography>
        </MenuItem>
      );
    });
  };

  const displayDesktop = () => {
    return (
      <Toolbar className={classes.root}>
        <div>{getMenuButtons()}</div>
      </Toolbar>
    );
  };

  const displayMobile = () => {
    const handleDrawerOpen = () => setState((prevState) => ({ ...prevState, drawerOpen: true }));
    const handleDrawerClose = () => setState((prevState) => ({ ...prevState, drawerOpen: false }));

    return (
      <Toolbar>
        <IconButton
            {...{
              edge: "start",
              color: "inherit",
              "aria-label": "menu",
              "aria-haspopup": "true",
              onClick: handleDrawerOpen,
            }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
            {...{
              anchor: "left",
              open: drawerOpen,
              onClose: handleDrawerClose,
            }}
        >
          <div>{getDrawerChoices()}</div>
        </Drawer>

      </Toolbar>
    );
  };

  return (
    <header>
      <AppBar className={classes.appBar}>
        {mobileView ? displayMobile() : displayDesktop()}
      </AppBar>
    </header>
  );
}
