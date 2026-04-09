export interface BlogPost {
  id: number;
  titleKey: string;
  excerptKey: string;
  date: string;
  slug: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 1,
    titleKey: "welcomeToCmnw",
    excerptKey: "welcomeToCmnwExcerpt",
    date: "2025-01-20",
    slug: "welcome-to-cmnw",
  },
  {
    id: 2,
    titleKey: "nextjs16Upgrade",
    excerptKey: "nextjs16UpgradeExcerpt",
    date: "2025-01-24",
    slug: "nextjs-16-upgrade",
  },
  {
    id: 3,
    titleKey: "newSearchFeatures",
    excerptKey: "newSearchFeaturesExcerpt",
    date: "2025-01-24",
    slug: "new-search-features",
  },
];
