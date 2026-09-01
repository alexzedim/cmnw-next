"use client";

import { BannerBackdrop } from "./banner-backdrop";

const QUESTION_MARK_PATH =
  "M388 432 Q388 240 512 240 Q644 240 644 376 Q644 462 552 514 Q516 534 516 576 L516 606";

export const UnknownMark = () => {
  return (
    <BannerBackdrop>
      <g transform="rotate(12 512 512)">
        <path
          d={QUESTION_MARK_PATH}
          fill="none"
          stroke="#FEFEFE"
          strokeLinecap="round"
          strokeWidth="148"
        />
        <path
          d={QUESTION_MARK_PATH}
          fill="none"
          stroke="#4B5563"
          strokeLinecap="round"
          strokeWidth="104"
        />
        <circle cx="516" cy="748" fill="#FEFEFE" r="78" />
        <circle cx="516" cy="748" fill="#4B5563" r="52" />
      </g>
    </BannerBackdrop>
  );
};
