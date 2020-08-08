import React from "react";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import ReactMarkdown from "react-markdown/with-html";

export default function Post({ content, frontmatter }) {
    return (
        <div>
            <ReactMarkdown
                escapeHtml={false}
                source={content}
            />
        </div>
    );
}

export async function getStaticPaths() {
    const files = fs.readdirSync("./tests");

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
    const markdownWithMetadata = fs
        .readFileSync(path.join("./tests", slug + ".md"))
        .toString();

    console.log(markdownWithMetadata)

    const { data, content } = matter(markdownWithMetadata);

    // Convert post date to format: Month day, Year
    const formattedDate = data.updatedAt.toLocaleDateString("en-GB");

    const frontmatter = {
        ...data,
        updatedAt: formattedDate,
    };

    console.log(content)

    return {
        props: {
            content: `# ${data.title}\n${content}`,
            frontmatter,
        },
    };
}