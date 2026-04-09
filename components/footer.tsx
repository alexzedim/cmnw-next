"use client";

import { useState, useEffect } from "react";
import { Link } from "@heroui/link";

import { Logo } from "@/components/icons";
import { useAppMetrics } from "@/components/providers/app-metrics-provider";
import { SYMBOLS } from "@/constants/symbols";
import { getRandomItems } from "@/utils/random";

type FooterLink = {
  label: string;
  href?: string;
  isExternal?: boolean;
  isMetrics?: boolean;
};

type FooterSection = {
  links: FooterLink[];
};

const toDateFromTimestamp = (timestamp: number | null | undefined) => {
  if (typeof timestamp !== "number" || Number.isNaN(timestamp)) {
    return null;
  }

  const isSeconds = timestamp < 1_000_000_000_000;
  const milliseconds = isSeconds ? timestamp * 1000 : timestamp;

  return Number.isFinite(milliseconds) ? new Date(milliseconds) : null;
};

export const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const [symbolSet] = useState(() =>
    Math.random() > 0.5 ? SYMBOLS.BRAILLE : SYMBOLS.HEX
  );
  const {
    metrics,
    status: metricsStatus,
    hasError: metricsError,
  } = useAppMetrics();
  const generateSymbols = () => getRandomItems(Array.from(symbolSet), 7);
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const metricsIndicatorState = metricsError ? "error" : metricsStatus;

  const metricsIndicatorClass =
    metricsIndicatorState === "online"
      ? "bg-emerald-500"
      : metricsIndicatorState === "degraded"
        ? "bg-amber-500"
        : metricsIndicatorState === "error"
          ? "bg-red-500"
          : "bg-foreground/40 animate-pulse";

  const uptimeLabel =
    metrics?.uptime && !metricsError
      ? metrics.uptime
      : metricsIndicatorState === "error"
        ? "Uptime unavailable"
        : "Calculating uptime…";

  const latestMarketDate = toDateFromTimestamp(
    metrics?.latestMarketTimestamp ?? null
  );

  const latestMarketLabel =
    latestMarketDate && !metricsError
      ? latestMarketDate.toLocaleString()
      : metricsIndicatorState === "error"
        ? "No market data"
        : "Loading market data…";

  const metricsLabel =
    metrics?.version && !metricsError
      ? `v${metrics.version}`
      : metricsIndicatorState === "error"
        ? "Status unavailable"
        : "Checking status…";

  const linkBaseClasses =
    "text-sm leading-tight relative flex w-fit items-center transition-colors duration-200 hover:text-[var(--primary)] group after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-foreground/60";

  const renderLinkContent = (link: FooterLink) =>
    link.isMetrics ? (
      <span className="flex w-full flex-col gap-1 text-left">
        <span className="text-[10px] uppercase tracking-wide text-foreground/40">
          uptime
        </span>
        <span className="font-mono text-xs text-foreground/80">
          {uptimeLabel}
        </span>
        <span className="text-[10px] uppercase tracking-wide text-foreground/40">
          latest market
        </span>
        <span className="font-mono text-xs text-foreground/80">
          {latestMarketLabel}
        </span>
        <span className="flex items-center gap-2 pt-1">
          <span
            aria-label={
              metricsIndicatorState === "online"
                ? "API online"
                : metricsIndicatorState === "degraded"
                  ? "API degraded"
                  : metricsIndicatorState === "error"
                    ? "API offline"
                    : "Checking API status"
            }
            className={`size-2 rounded-full transition-colors duration-200 ${metricsIndicatorClass}`}
          />
          <span className="text-foreground text-sm leading-tight">
            {metricsLabel}
          </span>
        </span>
      </span>
    ) : (
      link.label
    );

  const footerSections: FooterSection[] = mounted
    ? [
        {
          links: [
            {
              label: "GitHub",
              href: "https://github.com/alexzedim/cmnw-next",
              isExternal: true,
            },
            { label: generateSymbols(), href: "/" },
            { label: generateSymbols(), href: "/" },
          ],
        },
        {
          links: [
            { label: "Discord", href: "/" },
            { label: generateSymbols(), href: "/" },
            { label: generateSymbols(), href: "/" },
          ],
        },
        {
          links: [
            {
              label: "Zero Cookie Policy",
              href: "https://www.google.com/search?q=Zero+Cookie+policy",
            },
            { label: "Uptime" },
            { label: uptimeLabel },
            { label: "Latest Market Data" },
            { label: latestMarketLabel },
          ],
        },
      ]
    : [];

  return (
    <div className="container mx-auto px-6 mt-32 mb-20">
      <footer className="relative grid grid-cols-4 gap-x-4 lg:grid-cols-12 lg:gap-x-6 card-surface p-6 h-auto min-h-[400px] rounded-xl md:min-h-[450px] lg:min-h-[430px] lg:rounded-3xl">
        {/* Footer Badge */}
        <div className="absolute top-6 left-4 lg:top-8 lg:left-8">
          <div className="inline-flex items-center gap-3 uppercase text-xs tracking-wide opacity-60">
            <div className="size-2 rounded-full bg-[var(--primary)]" />
            <p className="text-xs uppercase tracking-wide">Footer</p>
          </div>
        </div>

        {/* Logo at bottom left - hidden on mobile */}
        <span className="absolute bottom-4 left-4 hidden md:block lg:bottom-5 lg:left-8">
          <Logo size={40} />
        </span>

        {/* Logo at bottom left - mobile only */}
        <span className="absolute bottom-6 left-4 md:hidden">
          <Logo size={40} />
        </span>

        {/* Main Footer Content */}
        <div className="col-span-full flex h-full flex-col pt-28 pb-8 pl-4 lg:col-span-5 lg:col-start-8 lg:pr-4 lg:pl-0 xl:col-span-4 xl:col-start-9">
          {/* Footer Links */}
          <ul className="mb-10 flex flex-wrap gap-x-12 gap-y-8 pr-6 lg:flex-nowrap lg:justify-between lg:gap-x-4 lg:gap-y-0 2xl:max-w-[76%] 2xl:pr-0">
            {footerSections.map((section, index) => (
              <li key={index} className="w-fit">
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link, linkIndex) => (
                    <li key={`${index}-${linkIndex}`}>
                      {link.href ? (
                        <Link
                          className={`${linkBaseClasses} ${link.isMetrics ? "flex-col items-start gap-1" : ""}`}
                          href={link.href}
                          {...(link.isExternal && {
                            rel: "noopener noreferrer",
                            target: "_blank",
                          })}
                        >
                          {renderLinkContent(link)}
                        </Link>
                      ) : (
                        <span
                          className={`${linkBaseClasses} ${link.isMetrics ? "flex-col items-start gap-1" : ""} cursor-default`}
                        >
                          {renderLinkContent(link)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Bottom Section */}
          <div className="mt-auto -mb-1.5 flex flex-col flex-wrap items-end justify-end gap-x-3 gap-y-1 pr-4 lg:max-w-[90%] lg:flex-row lg:items-center lg:justify-between lg:pr-0">
            {/* Copyright */}
            <p className="text-foreground text-sm leading-tight">
              © {year} CMNW. All rights reserved.
              <span className="ml-3 inline-flex items-center gap-2 text-xs tracking-wide text-foreground/80">
                <span
                  aria-label={
                    metricsIndicatorState === "online"
                      ? "API online"
                      : metricsIndicatorState === "degraded"
                        ? "API degraded"
                        : metricsIndicatorState === "error"
                          ? "API offline"
                          : "Checking API status"
                  }
                  className={`size-2 rounded-full transition-colors duration-200 ${metricsIndicatorClass}`}
                />
                <span className="text-foreground text-sm leading-tight">
                  {metricsLabel}
                </span>
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
