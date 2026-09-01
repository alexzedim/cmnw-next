"use client";

const SCENE_FILTER =
  "grayscale(1) sepia(1) hue-rotate(-25deg) saturate(2.2) brightness(1.05)";

export const TwinkScene = () => {
  return (
    <img
      alt=""
      aria-hidden="true"
      className="absolute right-0 top-0 opacity-20 pointer-events-none"
      src="/guild-banners/twink-scene.svg"
      style={{
        width: "50%",
        height: "100%",
        objectFit: "cover",
        objectPosition: "right center",
        filter: SCENE_FILTER,
        maskImage: "linear-gradient(to right, transparent, black 35%)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 35%)",
      }}
    />
  );
};
