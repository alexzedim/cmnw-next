"use client";

import type { Dictionary, Locale } from "@/dictionaries";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";

import { ToastViewport } from "@/lib/toast";
import { AppMetricsProvider } from "@/components/providers/app-metrics-provider";
import { LiveFeedProvider } from "@/components/providers/live-feed-provider";
import { I18nProvider } from "@/lib/i18n/context";

export interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
  dict: Dictionary;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    router_options: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, locale, dict }: ProvidersProps) {
  const router = useRouter();

  return (
    <I18nProvider value={{ locale, dict }}>
      <HeroUIProvider navigate={router.push}>
        <AppMetricsProvider>
          <LiveFeedProvider>{children}</LiveFeedProvider>
        </AppMetricsProvider>
        <ToastViewport maxVisible={4} />
      </HeroUIProvider>
    </I18nProvider>
  );
}
