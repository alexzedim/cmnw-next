import { FC, Fragment, useState, MouseEvent } from 'react';
import { hashTitle } from '../../types/components/hashTitle';
import { Divider, Popover, Typography, Box } from '@mui/material';
import { generateFactionBackground } from '../../utils';
import { theme } from '../../styles';

const styleCss = {
  root: {
    margin: theme.spacing(2),
    padding: theme.spacing(4),
    borderRadius: '15px',
    position: 'relative',
  },
  title: {
    color: 'white',
    padding: '2rem',
    border: 'solid 15px white',
  },
  hash: {
    fontFamily: 'Fira Sans',
    fontWeight: 900,
    textTransform: 'uppercase',
    fontSize: 'clamp(1.3rem, -2.7500rem + 16.6667vw, 6rem)',
    textAlign: 'left',
    overflowWrap: 'break-word',
  },
  type: {
    fontFamily: 'Fira Sans',
    fontWeight: 400,
    fontSize: 'clamp(1.3rem, -2.7500rem + 16.6667vw, 3rem)',
    textTransform: 'uppercase',
    textAlign: 'left',
    overflowWrap: 'break-word',
  },
  divider: {
    background: theme.palette.primary.main
  },
  popover: {
    pointerEvents: 'none',
  },
  paper: {
    padding: theme.spacing(1),
    background: theme.palette.primary.main,
    color: '#f5f2f2',
  },
};

const HashTitle: FC<hashTitle> = ({ id }) => {
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<EventTarget | null>(null);

  const [type, query] = id.split('@');
  const hash = query.replace(/(.{4})/g, '$1 ');

  const handleClick = async (textBuffer: string, event: MouseEvent<HTMLElement, MouseEvent>) => {
    try {
      await navigator.clipboard.writeText(textBuffer);
      setCopyStatus(`Hash ${id} has been coped!`);
      setAnchorEl(event.target);
    } catch (err) {
      setCopyStatus('Failed to copy!');
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const pid = open ? 'text-buffer' : undefined;

  const background = generateFactionBackground();
  return (
    <Fragment>
      <Box sx={styleCss.root} style={background}>
        <Box sx={styleCss.title} style={background}>
          <Typography
            onClick={(e) => handleClick(id, e)}
            onMouseLeave={handlePopoverClose}
            variant="h1"
            component="h1"
            color="textPrimary"
            sx={styleCss.hash}
          >
            {hash}
          </Typography>
          <Popover
            id={pid}
            sx={styleCss.popover}
            open={open}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Typography>{copyStatus}</Typography>
          </Popover>
          <Divider sx={styleCss.divider}/>
          <Typography
            variant="h2"
            component="h2"
            color="textPrimary"
            sx={styleCss.type}
          >
            Type {type}
          </Typography>
        </Box>
      </Box>
    </Fragment>
  )
}

export default HashTitle;
