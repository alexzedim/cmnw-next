"use client";

import type { ReactNode } from "react";

interface BannerBackdropProps {
  children: ReactNode;
}

export const BannerBackdrop = ({ children }: BannerBackdropProps) => {
  return (
    <svg
      className="absolute right-0 top-0 opacity-20 pointer-events-none"
      preserveAspectRatio="xMaxYMid slice"
      style={{
        width: "50%",
        height: "100%",
      }}
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
    >
      {children}
    </svg>
  );
};
