"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/context";

export function LanguageSwitcher() {
  const { locale, dict } = useI18n();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;
    startTransition(() => router.refresh());
  };

  return (
    <button
      className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors px-2"
      disabled={isPending}
      type="button"
      onClick={() => switchLocale(locale === "en" ? "ru" : "en")}
    >
      {locale === "en" ? dict.languageSwitcher.ru : dict.languageSwitcher.en}
    </button>
  );
}
