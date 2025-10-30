export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  slug: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    title: "Welcome to CMNW",
    excerpt:
      "Introducing Commonwealth - your go-to platform for World of Warcraft community tools and resources.",
    date: "2025-01-20",
    slug: "welcome-to-cmnw",
  },
  {
    id: 2,
    title: "Next.js 16 Upgrade Complete",
    excerpt:
      "We've successfully upgraded to Next.js 16 with React 19, bringing better performance and new features.",
    date: "2025-01-24",
    slug: "nextjs-16-upgrade",
  },
  {
    id: 3,
    title: "New Search Features",
    excerpt:
      "Enhanced search functionality with better realm selection and commodity tracking.",
    date: "2025-01-24",
    slug: "new-search-features",
  },
];
