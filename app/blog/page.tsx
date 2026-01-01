"use client";

import NextLink from "next/link";

import { title, subtitle } from "@/components/primitives";
import { BLOG_POSTS } from "@/constants/blog-posts";

export default function BlogPage() {
  return (
    <section className="section">
      <div className="max-w-4xl mx-auto px-6 space-y-8">
        <div>
          <h1 className={title()}>Blog</h1>
          <p className={subtitle({ class: "mt-4" })}>
            Latest updates and news from CMNW
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {BLOG_POSTS.map((post) => (
            <div
              key={post.id}
              className="card-surface p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col w-full">
                <p className="text-xl font-semibold">{post.title}</p>
                <p className="text-xs text-muted">{post.date}</p>
              </div>
              <p className="text-muted mt-3">{post.excerpt}</p>
              <div className="mt-4">
                <NextLink
                  className="underline-offset-4 hover:underline"
                  href={`/blog/${post.slug}`}
                >
                  Read more →
                </NextLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
