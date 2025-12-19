import { PT_Mono } from "next/font/google";

// PT Mono has excellent Cyrillic support
export const fontSans = PT_Mono({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-sans",
});

export const fontMono = PT_Mono({
  subsets: ["latin", "cyrillic"],
  weight: "400",
  variable: "--font-mono",
});
