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
import { LanguageSwitcher } from "@/components/language-switcher";
import { SearchIcon, Logo } from "@/components/icons";
import { useI18n } from "@/lib/i18n/context";

export const Navbar = () => {
  const { dict } = useI18n();

  const searchInput = (
    <Input
      aria-label={dict.navbar.searchAriaLabel}
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
      placeholder={dict.navbar.searchPlaceholder}
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
        <LanguageSwitcher />
        <ThemeSwitch />
      </NavbarContent>

      <NavbarMenu>{searchInput}</NavbarMenu>
    </HeroUINavbar>
  );
};
