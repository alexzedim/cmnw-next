"use client";

import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";

/**
 * Hero section component displaying the main title and search form.
 */
export function HeroSection() {
  return (
    <section className="section flex flex-col items-center justify-center gap-8">
      <div className="inline-block max-w-3xl text-center justify-center">
        <h1 className={title()}>CMNW</h1>
      </div>

      <div className="w-full flex justify-center px-4">
        <SearchForm />
      </div>
    </section>
  );
}
