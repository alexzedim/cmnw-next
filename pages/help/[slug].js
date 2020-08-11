import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import {Box, CardContent, Container, Grid, Typography} from "@material-ui/core";
import makeStyles from "@material-ui/core/styles/makeStyles";

export default function Post({ content, frontmatter }) {

    return (
        <Container fixed>
            <Typography variant="body1" component="p">
                <ReactMarkdown
                    escapeHtml={false}
                    source={content}
                />
            </Typography>
        </Container>
    );
}

export async function getStaticPaths() {

    const files = fs.readdirSync("./wiki");


    const paths = files.map((filename) => ({
        params: {
            slug: filename.replace(".md", ""),
        },
    }));

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params: { slug } }) {

    const markdownWithMetadata = fs.readFileSync(path.join("./wiki", slug + ".md")).toString();

    const { data, content } = matter(markdownWithMetadata);

    // Convert post date to format: Month day, Year
    const formattedDate = data.updatedAt.toLocaleDateString("en-GB");

    const frontmatter = {
        ...data,
        updatedAt: formattedDate,
    };

    return {
        props: {
            content: `# ${data.title}\n${content}`,
            frontmatter,
        },
    };
}