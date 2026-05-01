"use client";

import Link, { type LinkProps } from "next/link";
import { LoaderCircle } from "lucide-react";
import { useState, type MouseEvent, type ReactNode } from "react";

interface LoadingLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  loadingLabel?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function LoadingLink({
  children,
  className,
  loadingLabel = "Loading...",
  onClick,
  ...props
}: LoadingLinkProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    setIsLoading(true);
    window.setTimeout(() => setIsLoading(false), 3500);
  };

  return (
    <Link {...props} className={className} onClick={handleClick} aria-busy={isLoading}>
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          {loadingLabel}
        </span>
      ) : (
        children
      )}
    </Link>
  );
}
