import { Link as HeroUILink } from "@heroui/link";
import NextLink from "next/link";
import { ComponentProps } from "react";

type CustomLinkProps = Omit<ComponentProps<typeof HeroUILink>, "href"> & {
  href: string;
};

export const CustomLink = ({ href, children, ...props }: CustomLinkProps) => {
  return (
    <HeroUILink as={NextLink} href={href} {...props}>
      {children}
    </HeroUILink>
  );
};
