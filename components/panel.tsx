import clsx from "clsx";
import { ReactNode } from "react";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={clsx("card-surface p-6", className)}>{children}</div>;
}
