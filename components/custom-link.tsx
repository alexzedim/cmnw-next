import { Link as HeroUILink } from "@heroui/link";
import NextLink from "next/link";
import { ComponentProps } from "react";

type CustomLinkProps = Omit<ComponentProps<typeof HeroUILink>, "href"> & {
  href: string;
  prefetch?: boolean;
};

export const CustomLink = ({
  href,
  prefetch,
  children,
  ...props
}: CustomLinkProps) => {
  return (
    <HeroUILink as={NextLink} href={href} prefetch={prefetch} {...props}>
      {children}
    </HeroUILink>
  );
};

// Export as Link for convenience
export { CustomLink as Link };
