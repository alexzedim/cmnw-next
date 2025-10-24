import { Divider } from "@heroui/react";
import { Link } from "@heroui/link";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-divider">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-default-600 whitespace-nowrap">
            © {year} Commonwealth | No cookies
          </p>
          <div className="flex gap-3 sm:gap-4">
            <Link
              href="https://github.com/alexzedim/cmnw-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-default-600 hover:text-default-900 whitespace-nowrap"
            >
              GitHub
            </Link>
            <Link
              href="/discord"
              className="text-default-600 hover:text-default-900 whitespace-nowrap"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
