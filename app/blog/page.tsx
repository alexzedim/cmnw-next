"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Link } from "@heroui/link";
import { title, subtitle } from "@/components/primitives";

const blogPosts = [
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

export default function BlogPage() {
  return (
    <div className="flex flex-col gap-8 py-8 md:py-10">
      <div className="max-w-4xl">
        <h1 className={title()}>Blog</h1>
        <p className={subtitle({ class: "mt-4" })}>
          Latest updates and news from CMNW
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 max-w-4xl">
        {blogPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col w-full">
                <p className="text-xl font-semibold">{post.title}</p>
                <p className="text-small text-default-500">{post.date}</p>
              </div>
            </CardHeader>
            <CardBody>
              <p className="text-default-600">{post.excerpt}</p>
            </CardBody>
            <CardFooter>
              <Link href={`/blog/${post.slug}`} color="primary">
                Read more →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
