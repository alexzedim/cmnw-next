import fs from "fs";
import path from "path";

import React from "react";
import matter from "gray-matter";

import { title } from "@/components/primitives";
import {Frontmatter, MarkdownPageProps} from "@/types";

// Define the path to your markdown files directory
const markdownDirectory = path.join(process.cwd(), "content");

export const BlogPage: React.FC<MarkdownPageProps> = ({
  frontmatter,
  content,
}) => {
  return (
    <div>
      <h1 className={title()}>Blog</h1>
    </div>
  );
};

export async function getStaticPaths() {
  const filenames = fs.readdirSync(markdownDirectory);

  const paths = filenames
    .filter((filename) => filename.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(".md", "");

      return {
        params: {
          slug,
        },
      };
    });

  return {
    paths,
    fallback: false, // Set to true if you want to generate pages on demand
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const fullPath = path.join(markdownDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  // Use gray-matter to parse the frontmatter and content
  const { data, content } = matter(fileContents);

  // Type check the frontmatter
  const frontmatter = data as Frontmatter;

  return {
    props: {
      frontmatter,
      content,
    },
  };
}
