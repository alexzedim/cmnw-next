import "@/styles/tokens.css";
import "@/styles/globals.css";

import type { ReactNode } from "react";

import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
import { fontSans, fontMono } from "@/config/fonts";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { detectLocale, getDictionary } from "@/dictionaries";

export const metadata: Metadata = {
  // metadataBase omitted: Next.js resolves relative metadata URLs against the
  // request origin automatically, which is correct for a multi-domain site
  // (cmnw.me, cmnw.ru, cmnw.xyz).
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

// Applies the stored color palette before first paint (zvuk.com-style);
// keeps its list in sync with PALETTE_IDS in lib/palette.ts.
const PALETTE_INIT_SCRIPT = `try{var p=localStorage.getItem("cmnw-palette");if(/^(violet|blue|green|peach|teal|dark-blue|black|light)$/.test(p||"")){var l=document.documentElement.classList;l.remove("palette-violet","palette-blue","palette-green","palette-peach","palette-teal","palette-dark-blue","palette-black","palette-light");l.add("palette-"+p);if(p==="light"){l.remove("dark")}else{l.add("dark")}}}catch(_e){}`;

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const locale = await detectLocale();
  const dict = await getDictionary(locale);

  return (
    <html suppressHydrationWarning className="palette-light" lang={locale}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PALETTE_INIT_SCRIPT }} />
      </head>
      <body
        className={clsx(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontMono.variable
        )}
      >
        <Providers dict={dict} locale={locale}>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto max-w-screen-2xl pt-16 px-6 flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
