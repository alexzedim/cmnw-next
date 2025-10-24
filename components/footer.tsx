import { Divider } from "@heroui/react";
import { Link } from "@heroui/link";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-divider">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <Divider className="mb-4" />
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <p className="text-sm text-default-600">
            © {year} Commonwealth | We don't use cookies or track your behavior
          </p>
          <div className="flex gap-4">
            <Link
              href="https://github.com/alexzedim/cmnw-next"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-default-600 hover:text-default-900"
            >
              GitHub
            </Link>
            <Link
              href="/discord"
              className="text-sm text-default-600 hover:text-default-900"
            >
              Discord
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
