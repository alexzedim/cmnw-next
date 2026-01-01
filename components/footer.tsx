"use client";

import { useState, useEffect } from "react";
import { Link } from "@heroui/link";

import { Logo } from "@/components/icons";
import { SYMBOLS } from "@/constants/symbols";
import { getRandomItems } from "@/utils/random";

export const Footer = () => {
  const [mounted, setMounted] = useState(false);
  const [symbolSet] = useState(() =>
    Math.random() > 0.5 ? SYMBOLS.BRAILLE : SYMBOLS.HEX
  );
  const generateSymbols = () => getRandomItems(Array.from(symbolSet), 7);
  const year = new Date().getFullYear();

  useEffect(() => {
    setMounted(true);
  }, []);

  const footerSections = mounted
    ? [
        {
          title: generateSymbols(),
          links: [
            { label: generateSymbols(), href: "/news" },
            { label: generateSymbols(), href: "/docs" },
            { label: generateSymbols(), href: "/contact" },
            {
              label: "GitHub",
              href: "https://github.com/alexzedim/cmnw-next",
              isExternal: true,
            },
          ],
        },
        {
          title: generateSymbols(),
          links: [
            { label: generateSymbols(), href: "/careers" },
            { label: generateSymbols(), href: "/enterprise" },
            { label: generateSymbols(), href: "/security" },
          ],
        },
        {
          title: generateSymbols(),
          links: [
            { label: generateSymbols(), href: "/privacy" },
            { label: generateSymbols(), href: "/terms" },
            { label: generateSymbols(), href: "/sla" },
            { label: generateSymbols(), href: "/dpa" },
            { label: generateSymbols(), href: "/baa" },
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
            <div className="size-2 rounded-full bg-orange-500" />
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
            {footerSections.map((section) => (
              <li key={section.title} className="w-fit">
                <p className="text-foreground text-sm leading-tight mb-3.5">
                  {section.title}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        className="text-sm leading-tight relative flex w-fit items-center transition-colors duration-200 hover:text-orange-500 group after:absolute after:-bottom-px after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:ease-in-out hover:after:w-full text-foreground/60"
                        href={link.href}
                        {...(link.isExternal && {
                          rel: "noopener noreferrer",
                          target: "_blank",
                        })}
                      >
                        {link.label}
                      </Link>
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
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
