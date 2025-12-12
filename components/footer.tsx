import { Link } from "@heroui/link";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-divider">
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="flex flex-row items-center justify-between gap-4 text-xs sm:text-sm">
          <p className="text-muted whitespace-nowrap">
            © {year} Commonwealth | No cookies
          </p>
          <div className="flex gap-3 sm:gap-4">
            <Link
              className="text-muted hover:text-foreground transition-colors whitespace-nowrap"
              href="https://github.com/alexzedim/cmnw-next"
              rel="noopener noreferrer"
              target="_blank"
            >
              GitHub
            </Link>
            <Link
              className="text-muted hover:text-foreground transition-colors whitespace-nowrap"
              href="/discord"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
