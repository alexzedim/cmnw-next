import { PT_Mono } from "next/font/google";
import { JetBrains_Mono } from "next/font/google";

// PT Mono has excellent Cyrillic and Greek support
export const fontSans = PT_Mono({
  subsets: ["latin", "cyrillic", "greek"],
  weight: "400",
  variable: "--font-sans",
});

export const fontMono = PT_Mono({
  subsets: ["latin", "cyrillic", "greek"],
  weight: "400",
  variable: "--font-mono",
});

// JetBrains Mono for Unicode symbols with full support
export const fontJetBrains = JetBrains_Mono({
  subsets: ["latin", "cyrillic", "greek"],
  weight: "400",
  variable: "--font-jetbrains",
});
