"use client";

import { AxesPaths } from "./axes-paths";
import { BannerBackdrop } from "./banner-backdrop";

export const FullRaiderAxes = () => {
  return (
    <BannerBackdrop>
      <defs>
        <path
          d="M0 0 C22 -30 76 -30 96 0 C76 30 22 30 0 0 Z"
          fill="#FEFEFE"
          id="laurelLeaf"
        />
      </defs>
      <g>
        <path
          d="M74 498 Q92 800 380 916"
          fill="none"
          stroke="#FEFEFE"
          strokeLinecap="round"
          strokeWidth="10"
        />
        <use href="#laurelLeaf" transform="translate(74 498) rotate(87)" />
        <use href="#laurelLeaf" transform="translate(113 678) rotate(75)" />
        <use href="#laurelLeaf" transform="translate(213 817) rotate(46)" />
        <use href="#laurelLeaf" transform="translate(380 916) rotate(23)" />
      </g>
      <g transform="translate(1024 0) scale(-1 1)">
        <path
          d="M74 498 Q92 800 380 916"
          fill="none"
          stroke="#FEFEFE"
          strokeLinecap="round"
          strokeWidth="10"
        />
        <use href="#laurelLeaf" transform="translate(74 498) rotate(87)" />
        <use href="#laurelLeaf" transform="translate(113 678) rotate(75)" />
        <use href="#laurelLeaf" transform="translate(213 817) rotate(46)" />
        <use href="#laurelLeaf" transform="translate(380 916) rotate(23)" />
      </g>
      <AxesPaths baseColor="#4B0082" />
    </BannerBackdrop>
  );
};
