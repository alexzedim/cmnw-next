"use client";

import { title } from "@/components/primitives";
import { SearchForm } from "@/components/search-form";
import { useI18n } from "@/lib/i18n/context";

export function HeroSection() {
  const { dict } = useI18n();

  return (
    <section className="section flex flex-col items-center justify-center gap-8">
      <div className="inline-block max-w-3xl text-center justify-center">
        <h1 className={`${title()} !font-thin !text-[108px] !leading-none`}>
          {dict.home.heroTitle}
        </h1>
      </div>

      <div className="w-full flex justify-center px-4">
        <SearchForm />
      </div>
    </section>
  );
}
