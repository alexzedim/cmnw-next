"use client";

import { Card, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { Link } from "@heroui/link";

import { title, subtitle } from "@/components/primitives";
import { BLOG_POSTS } from "@/constants/blog-posts";

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
        {BLOG_POSTS.map((post) => (
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
              <Link color="primary" href={`/blog/${post.slug}`}>
                Read more →
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
