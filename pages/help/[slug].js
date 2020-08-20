import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";
import { Container, Typography } from "@material-ui/core";
import Head from "next/head";

export default function Post({ content, frontmatter }) {
    return (
        <main>
            <Head>
                <title>{frontmatter.title}</title>

                <meta name="description" content={frontmatter.description}/>

                <meta property="og:type" content="website"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="og:title" content={frontmatter.title}/>
                <meta property="og:description" content={frontmatter.description}/>
                <meta property="og:image" content="https://conglomerat.group/logo.png"/>

                <meta property="twitter:card" content="summary_large_image"/>
                <meta property="og:url" content="https://conglomerat.group/"/>
                <meta property="twitter:title" content={frontmatter.title}/>
                <meta property="twitter:description" content={frontmatter.description}/>
                <meta property="og:image" content="https://conglomerat.group/logo.png"/>
            </Head>
            <Container fixed>
                <Typography variant="body1" component="p">
                    <ReactMarkdown
                        escapeHtml={false}
                        source={content}
                    />
                </Typography>
            </Container>
        </main>
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
