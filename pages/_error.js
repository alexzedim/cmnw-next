import Logo from '../public/logo2.svg';
import React from "react";
import { Container, Grid, Typography } from "@material-ui/core";
import Link from "../src/Link";

function Error({ statusCode }) {
    return (
        <Container maxWidth={false}>
            <Grid container
                  direction="row"
                  justify="center"
                  alignItems="center"
            >
                <Grid container item xs={12} justify="center">
                    <Logo />
                </Grid>
                <Grid container item xs={12} justify="center">
                    <Typography variant="h2" component="h2" color="textPrimary" display="block" gutterBottom>
                        {statusCode || `Four, oh four`}
                    </Typography>
                    <Typography component="h3" variant="caption" display="block" color="textPrimary">
                        Or maybe not?
                    </Typography>
                </Grid>
                <Grid container item xs={12} justify="center">
                    <Typography component="h5" variant="body1" display="block" color="textPrimary">
                        Something with your query goes wrong. Clarify the criteria and <Link href={`/`} color="textPrimary" underline="hover">try another one</Link>.
                    </Typography>
                </Grid>
                <Grid container item xs={12} justify="center">
                    <Typography component="h5" variant="body1" display="block" color="textPrimary">
                        Or <Link href={`https://github.com/AlexZeDim/conglomerat-FRONT/issues`} color="textPrimary" underline="hover" prefetch={false}>submit a bug via @GitHub</Link> or <Link href={`/help`} color="textPrimary" underline="hover">any other contacts</Link>.
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}

export default Error
