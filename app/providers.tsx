"use client";

import type { ThemeProviderProps } from "next-themes";
import type { Dictionary, Locale } from "@/dictionaries";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { ToastViewport } from "@/lib/toast";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { AppMetricsProvider } from "@/components/providers/app-metrics-provider";
import { LiveFeedProvider } from "@/components/providers/live-feed-provider";
import { I18nProvider } from "@/lib/i18n/context";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
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

export function Providers({
  children,
  themeProps,
  locale,
  dict,
}: ProvidersProps) {
  const router = useRouter();

  return (
    <I18nProvider value={{ locale, dict }}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <AppMetricsProvider>
            <LiveFeedProvider>{children}</LiveFeedProvider>
          </AppMetricsProvider>
          <ToastViewport maxVisible={4} />
        </NextThemesProvider>
      </HeroUIProvider>
    </I18nProvider>
  );
}
