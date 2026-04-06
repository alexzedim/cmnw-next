"use client";

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarBrand,
  NavbarMenu,
} from "@heroui/navbar";
import { Kbd } from "@heroui/kbd";
import { Input } from "@heroui/input";
import NextLink from "next/link";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon, Logo } from "@/components/icons";

export const Navbar = () => {
  const searchInput = (
    <Input
      aria-label="Search"
      classNames={{
        inputWrapper: "bg-background border border-divider",
        input: "text-sm text-foreground",
      }}
      endContent={
        <Kbd className="hidden lg:inline-block" keys={["command"]}>
          K
        </Kbd>
      }
      labelPlacement="outside"
      placeholder="Search..."
      startContent={
        <SearchIcon className="text-base text-muted pointer-events-none flex-shrink-0" />
      }
      type="search"
    />
  );

  return (
    <HeroUINavbar
      className="bg-transparent border-b token-border backdrop-blur-sm"
      maxWidth="xl"
      position="sticky"
    >
      <NavbarContent className="basis-1/3" justify="start" />

      <NavbarContent className="basis-1/3" justify="center">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-center items-center gap-1" href="/">
            <Logo />
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="basis-1/3" justify="end">
        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu>{searchInput}</NavbarMenu>
    </HeroUINavbar>
  );
};
