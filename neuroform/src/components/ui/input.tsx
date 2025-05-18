import * as React from "react";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={`w-full rounded-lg border border-gray-300 px-4 py-2 text-sm shadow-sm focus:border-black focus:outline-none focus:ring-2 focus:ring-black ${className}`}
    {...props}
  />
));
Input.displayName = "Input";
