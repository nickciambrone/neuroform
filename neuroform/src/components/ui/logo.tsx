import React from "react";

export function PlaceholderLogo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="48"
      height="48"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Placeholder form logo"
    >
      {/* Document outline */}
      <rect
        x="12"
        y="8"
        width="40"
        height="48"
        rx="4"
        stroke="#4B5563"
        strokeWidth="3"
        fill="#F9FAFB"
      />
      {/* Form lines */}
      <line x1="20" y1="20" x2="44" y2="20" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="28" x2="44" y2="28" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="36" x2="44" y2="36" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="44" x2="36" y2="44" stroke="#4B5563" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
