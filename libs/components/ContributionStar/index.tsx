import { FC, Fragment } from 'react';
import { contributionStar } from '../../types';
import { Card, CardContent, Typography } from '@mui/material';
import { StarOutlined } from '@mui/icons-material';
import { theme } from '../../styles';
import Link from '../Link';

const styleCss = {
  star: {
    width: theme.spacing(8),
    height: theme.spacing(8),
    color: theme.palette.primary.main,
    margin: 'auto',
    display: 'block'
  },
  card: {
    backgroundColor: 'transparent',
    position: 'relative',
    height: 250,
    border: 'none',
    boxShadow: 'none',
    textAlign: 'center',
  },
  title: {
    textTransform: 'uppercase',
  },
};

const ContributionStar: FC<contributionStar> = ({ character, name, discord, github, twitter}) => {
  return (
    <Card sx={styleCss.card}>
      <CardContent>
        <StarOutlined
          sx={styleCss.star}
          color="secondary"
        />
        <Typography variant="overline" align="center" sx={styleCss.title} gutterBottom>
          {name}
        </Typography>

        {(twitter) ? (
          <Fragment>
            <br/>
            <Typography variant="overline" align="center" sx={styleCss.title}>
              <Link href={`https://www.twitter.com/${twitter}`} prefetch={false}>{twitter}</Link>
            </Typography>
          </Fragment>
        ) : (<></>)}

        {(character) ? (
          <Fragment>
            <br/>
            <Typography variant="overline" align="center" sx={styleCss.title}>
              <Link href={`/character/${character}`}>{character}</Link>
            </Typography>
          </Fragment>
        ) : (<></>)}

        {(discord) ? (
          <Fragment>
            <br/>
            <Typography variant="overline" align="center" sx={styleCss.title}>
              {discord}
            </Typography>
          </Fragment>
        ) : (<></>)}

        {(github) ? (
          <Fragment>
            <br/>
            <Typography variant="overline" align="center" sx={styleCss.title}>
              <Link href={`https://www.github.com/${github}`} prefetch={false}>{github}</Link>
            </Typography>
          </Fragment>
        ) : (<></>)}

      </CardContent>
    </Card>
  )
}

export default ContributionStar;
