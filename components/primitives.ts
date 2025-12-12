import { tv } from "tailwind-variants";

export const title = tv({
  base: "tracking-tight inline font-semibold",
  variants: {
    color: {
      indigoCyan: "from-[var(--gradient-start)] to-[var(--gradient-end)]",
      foreground: "dark:from-[#ffffff] dark:to-[#b3b3b3]",
    },
    size: {
      sm: "text-3xl lg:text-4xl",
      md: "text-[2.75rem] lg:text-6xl leading-[1.1]",
      lg: "text-5xl lg:text-7xl",
    },
    fullWidth: {
      true: "w-full block",
    },
  },
  defaultVariants: {
    size: "md",
    color: "indigoCyan",
  },
  compoundVariants: [
    {
      color: ["indigoCyan", "foreground"],
      class: "bg-clip-text text-transparent bg-gradient-to-r",
    },
  ],
});

export const subtitle = tv({
  base: "w-full md:w-1/2 my-2 text-lg lg:text-xl text-muted block max-w-full",
  variants: {
    fullWidth: {
      true: "!w-full",
    },
  },
  defaultVariants: {
    fullWidth: true,
  },
});
