"use client";

import { usePathname } from "next/navigation";
import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@heroui/navbar";
import NextLink from "next/link";

import { Logo } from "@/components/icons";

export const Navbar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <HeroUINavbar
      className="bg-transparent backdrop-blur-sm"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {!isHomePage && (
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink
              className="flex justify-start items-center gap-1"
              href="/"
            >
              <Logo />
            </NextLink>
          </NavbarBrand>
        )}
      </NavbarContent>
    </HeroUINavbar>
  );
};
