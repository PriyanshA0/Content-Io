import React from "react";

interface FaviconIconProps {
  className?: string;
  size?: number;
}

export function FaviconIcon({ className = "", size = 24 }: FaviconIconProps) {
  return (
    <img
      src="/assets/Favicon.png"
      alt="ContentIo logo"
      className={className}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
      }}
    />
  );
}
