export type Frontmatter = {
  title: string;
  date: string;
  // Add other frontmatter fields as needed (e.g., description, author)
};

export type MarkdownPageProps = {
  frontmatter: Frontmatter;
  content: string;
};
